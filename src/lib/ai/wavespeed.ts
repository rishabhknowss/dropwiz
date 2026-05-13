import axios, { AxiosError } from "axios";
import { env } from "@/env";
import { db } from "@/db";
import { generations, assets } from "@/db/schema";
import { uploadFromUrl, buildStoreAssetKey } from "@/lib/storage/r2";
import { hashInput } from "./hash";

const BASE = "https://api.wavespeed.ai/api/v3";

export const SEEDREAM_COST_PER_IMAGE = 0.04;
export const CREDITS_PER_IMAGE = 1;

export const WAVESPEED_MODELS = {
  flux_schnell: "wavespeed-ai/flux-schnell",
  flux_dev: "wavespeed-ai/flux-dev",
  seedream: "bytedance/seedream-v4/edit",
} as const;

export type WavespeedModel = keyof typeof WAVESPEED_MODELS;

const MODEL_COST_USD: Record<WavespeedModel, number> = {
  flux_schnell: 0.003,
  flux_dev: 0.025,
  seedream: 0.04,
};

type SubmitResponse = {
  data: { id: string; urls: { get: string } };
};

type StatusResponse = {
  data: {
    id: string;
    status: "created" | "processing" | "completed" | "failed";
    outputs: string[];
    error: string | null;
  };
};

function getHeaders() {
  if (!env.WAVESPEED_API_KEY) {
    throw new Error("WAVESPEED_API_KEY is not set");
  }
  return {
    Authorization: `Bearer ${env.WAVESPEED_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function submitJob(
  model: WavespeedModel,
  payload: Record<string, unknown>,
): Promise<string> {
  const modelPath = WAVESPEED_MODELS[model];
  try {
    const res = await axios.post<SubmitResponse>(
      `${BASE}/${modelPath}`,
      payload,
      { headers: getHeaders(), timeout: 30_000 },
    );
    return res.data.data.id;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        `wavespeed submit failed: ${err.response?.status} ${JSON.stringify(err.response?.data)}`,
      );
    }
    throw err;
  }
}

async function pollJob(
  taskId: string,
  maxMs = 120_000,
  intervalMs = 1500,
): Promise<string[]> {
  const deadline = Date.now() + maxMs;
  const startTime = Date.now();
  let pollCount = 0;
  console.log(`[wavespeed:poll] Starting poll for task ${taskId}, timeout=${maxMs}ms`);

  while (Date.now() < deadline) {
    pollCount++;
    const elapsed = Date.now() - startTime;

    try {
      const res = await axios.get<StatusResponse>(`${BASE}/predictions/${taskId}/result`, {
        headers: getHeaders(),
        timeout: 15_000,
      });
      const data = res.data.data;

      if (data.status === "completed") {
        console.log(`[wavespeed:poll] Task ${taskId} completed after ${elapsed}ms (${pollCount} polls), outputs=${data.outputs.length}`);
        return data.outputs;
      }
      if (data.status === "failed") {
        const errorMsg = data.error || "Generation failed - the image provider rejected this request. Try a different prompt or image.";
        console.error(`[wavespeed:poll] Task ${taskId} FAILED after ${elapsed}ms: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (pollCount % 10 === 0) {
        console.log(`[wavespeed:poll] Task ${taskId} still ${data.status} after ${elapsed}ms (poll #${pollCount})`);
      }
    } catch (err) {
      if (err instanceof Error && !err.message.includes("Generation failed")) {
        console.warn(`[wavespeed:poll] Poll request error for ${taskId}: ${err.message}`);
      } else {
        throw err;
      }
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  console.error(`[wavespeed:poll] Task ${taskId} TIMEOUT after ${Date.now() - startTime}ms`);
  throw new Error("wavespeed timeout");
}

export type GenerateImageInput = {
  model?: WavespeedModel;
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numImages?: number;
  seed?: number;
  storeId: string;
  kind: "hero" | "lifestyle" | "product" | "logo" | "ad";
  userId?: string | null;
};

export type GenerateImageResult = {
  assets: Array<{
    id: string;
    r2Key: string;
    publicUrl?: string;
    width: number;
    height: number;
  }>;
  generationId: string;
  costUsd: number;
  latencyMs: number;
};

const SEEDREAM_EDIT_BASE =
  "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4/edit";
const SEEDREAM_T2I_BASE =
  "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4/text-to-image";
const SEEDREAM_COST_USD = SEEDREAM_COST_PER_IMAGE;

export type AdAspectRatio =
  | "1:1"
  | "9:16"
  | "16:9"
  | "4:5"
  | "5:4"
  | "3:2"
  | "2:3"
  | "3:4"
  | "4:3"
  | "21:9";

export type AdQuality = "low" | "medium" | "high";
export type AdResolution = "1k" | "2k" | "4k";

const ASPECT_TO_SIZE: Record<AdAspectRatio, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "9:16": { width: 1024, height: 1820 },
  "16:9": { width: 1820, height: 1024 },
  "4:5": { width: 1024, height: 1280 },
  "5:4": { width: 1280, height: 1024 },
  "3:2": { width: 1536, height: 1024 },
  "2:3": { width: 1024, height: 1536 },
  "3:4": { width: 1024, height: 1365 },
  "4:3": { width: 1365, height: 1024 },
  "21:9": { width: 1820, height: 780 },
};

export type GenerateAdImageInput = {
  prompt: string;
  aspectRatio?: AdAspectRatio;
  quality?: AdQuality;
  resolution?: AdResolution;
  referenceImages?: string[];
  storeId: string;
  userId?: string | null;
};

type SeedreamSyncResponse = {
  data: {
    id: string;
    status: "completed" | "failed" | "processing" | "created";
    outputs: string[];
    error: string | null;
    urls?: { get: string };
  };
};

async function submitSeedream(
  body: Record<string, unknown>,
  useEdit: boolean,
): Promise<{ id: string; outputs: string[]; status: string }> {
  const url = useEdit ? SEEDREAM_EDIT_BASE : SEEDREAM_T2I_BASE;
  const promptPreview = typeof body.prompt === "string" ? body.prompt.slice(0, 60) : "no-prompt";
  console.log(`[wavespeed:seedream] Submitting ${useEdit ? "edit" : "t2i"} job, prompt="${promptPreview}..."`);
  const startTime = Date.now();

  try {
    const res = await axios.post<SeedreamSyncResponse>(url, body, {
      headers: getHeaders(),
      timeout: 90_000,
    });

    const elapsed = Date.now() - startTime;
    console.log(`[wavespeed:seedream] Submit response in ${elapsed}ms: id=${res.data.data.id}, status=${res.data.data.status}, outputs=${res.data.data.outputs?.length ?? 0}`);

    return {
      id: res.data.data.id,
      outputs: res.data.data.outputs ?? [],
      status: res.data.data.status,
    };
  } catch (err) {
    const elapsed = Date.now() - startTime;
    if (err instanceof AxiosError) {
      console.error(`[wavespeed:seedream] Submit FAILED after ${elapsed}ms: ${err.response?.status} ${JSON.stringify(err.response?.data)}`);
      throw new Error(
        `seedream submit failed: ${err.response?.status} ${JSON.stringify(err.response?.data)}`,
      );
    }
    console.error(`[wavespeed:seedream] Submit FAILED after ${elapsed}ms:`, err);
    throw err;
  }
}

export async function generateAdImage(
  input: GenerateAdImageInput,
): Promise<{
  assetId: string;
  imageUrl: string;
  r2Key: string;
  costUsd: number;
  latencyMs: number;
}> {
  const aspectRatio = input.aspectRatio ?? "4:5";
  const { width, height } = ASPECT_TO_SIZE[aspectRatio];
  const startedAt = Date.now();
  const useEdit = (input.referenceImages?.length ?? 0) > 0;
  const inputHash = hashInput({
    model: "seedream-v4",
    edit: useEdit,
    prompt: input.prompt,
    size: `${width}x${height}`,
    refs: input.referenceImages ?? [],
  });

  const body: Record<string, unknown> = {
    prompt: input.prompt,
    size: `${width}*${height}`,
    enable_sync_mode: true,
    enable_base64_output: false,
  };
  if (useEdit) body.images = input.referenceImages;

  try {
    const submitted = await submitSeedream(body, useEdit);

    let outputUrls = submitted.outputs;
    if (submitted.status !== "completed" || outputUrls.length === 0) {
      outputUrls = await pollJob(submitted.id, 6 * 60_000, 2500);
    }
    const sourceUrl = outputUrls[0];
    if (!sourceUrl) throw new Error("seedream returned no outputs");

    const ext = sourceUrl.match(/\.(jpe?g|png|webp)/i)?.[1]?.toLowerCase() ?? "jpg";
    const key = buildStoreAssetKey(input.storeId, "ad", ext === "jpeg" ? "jpg" : ext);
    const result = await uploadFromUrl(sourceUrl, key);
    const latencyMs = Date.now() - startedAt;

    const [asset] = await db
      .insert(assets)
      .values({
        storeId: input.storeId,
        kind: "ad",
        source: "generated",
        r2Key: result.key,
        contentType: result.publicUrl?.endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        width,
        height,
        bytes: result.bytes,
        prompt: input.prompt,
        model: useEdit
          ? "bytedance/seedream-v4/edit"
          : "bytedance/seedream-v4/text-to-image",
        metadata: { taskId: submitted.id, aspectRatio, useEdit },
      })
      .returning({ id: assets.id });

    await db.insert(generations).values({
      storeId: input.storeId,
      userId: input.userId ?? null,
      kind: "image",
      model: useEdit
        ? "bytedance/seedream-v4/edit"
        : "bytedance/seedream-v4/text-to-image",
      promptVersion: "seedream-v4",
      inputHash,
      input: { prompt: input.prompt, aspectRatio, size: `${width}x${height}`, useEdit },
      output: { assetId: asset.id },
      inputTokens: 0,
      outputTokens: 0,
      cachedTokens: 0,
      costUsd: SEEDREAM_COST_USD.toFixed(6),
      latencyMs,
      success: 1,
    });

    if (!result.publicUrl) throw new Error("R2 public URL missing");
    return {
      assetId: asset.id,
      imageUrl: result.publicUrl,
      r2Key: result.key,
      costUsd: SEEDREAM_COST_USD,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const message = err instanceof Error ? err.message : String(err);
    try {
      await db.insert(generations).values({
        storeId: input.storeId,
        userId: input.userId ?? null,
        kind: "image",
        model: useEdit
          ? "bytedance/seedream-v4/edit"
          : "bytedance/seedream-v4/text-to-image",
        promptVersion: "seedream-v4",
        inputHash,
        input: { prompt: input.prompt, aspectRatio, size: `${width}x${height}`, useEdit },
        costUsd: "0",
        latencyMs,
        success: 0,
        error: message.slice(0, 1000),
      });
    } catch {}
    throw err;
  }
}

export type GenerateWithReferenceInput = {
  prompt: string;
  referenceImageUrl: string;
  storeId: string;
  kind: "hero" | "lifestyle" | "product" | "logo" | "ad";
  userId?: string | null;
  width?: number;
  height?: number;
};

const PRODUCT_IMAGE_STYLES = [
  "premium studio hero shot, editorial lighting, clean white seamless background, centered composition, high-end product photography",
  "moody cinematic side-lighting, deep shadows, low-key dramatic mood, dark charcoal backdrop, editorial luxury feel",
  "bright airy daylight, soft diffused natural light, pastel mint gradient backdrop, fresh modern aesthetic",
  "luxury editorial on premium marble surface, warm golden hour tones, magazine cover quality",
  "minimalist floating product with soft gradient background, subtle drop shadow, Apple-style clean aesthetic",
  "lifestyle in natural home environment, warm ambient lighting, contextual setting, aspirational lifestyle moment",
  "product in active use scenario, authentic lifestyle moment, shallow depth of field, candid documentary style",
  "premium interior setting with natural window light, styled vignette, editorial home magazine aesthetic",
  "three-quarter angle detail shot highlighting texture and craftsmanship, macro clarity, studio lighting",
  "close-up macro shot of key product feature, razor sharp focus, dramatic rim light, black background",
  "flat lay composition with complementary minimal props, overhead editorial styling, clean negative space",
  "dynamic angle product shot, bold perspective, strong shadows, contemporary commercial aesthetic",
  "split composition with large clean space on left for text overlay, product right-aligned, corporate presentation style",
  "hero banner layout with product center-right, ample headline space on left, infographic-ready composition",
];

type ImageKind = "hero" | "lifestyle" | "product" | "feature";

const determineKind = (index: number): ImageKind => {
  if (index < 5) return "hero";
  if (index < 8) return "lifestyle";
  if (index < 12) return "product";
  return "feature";
};

const VARIATION_DIRECTIONS = PRODUCT_IMAGE_STYLES.slice(0, 5);

type DbAssetKind = "hero" | "lifestyle" | "product" | "logo" | "ad";

const mapKindToDbKind = (kind: ImageKind): DbAssetKind => {
  if (kind === "feature") return "product";
  return kind;
};

async function generateOneVariant(
  input: GenerateWithReferenceInput,
  variationDirection: string,
): Promise<{ assetId: string; imageUrl: string; r2Key: string }> {
  const width = input.width ?? 2048;
  const height = input.height ?? 2048;
  const startedAt = Date.now();
  const finalPrompt = `Use the provided photo as the literal product — preserve its exact shape, color, material, finish, proportions, and surface details. Restage it as: ${input.prompt}. Style direction for this variant: ${variationDirection}. No watermark, no third-party logos, no UI chrome, photorealistic, ultra high quality, sharp details, professional photography.`;
  const inputHash = hashInput({
    model: "seedream-v4",
    edit: true,
    prompt: finalPrompt,
    size: `${width}*${height}`,
    refs: [input.referenceImageUrl],
  });

  try {
    const submitted = await submitSeedream(
      {
        prompt: finalPrompt,
        size: `${width}*${height}`,
        enable_sync_mode: true,
        enable_base64_output: false,
        images: [input.referenceImageUrl],
      },
      true,
    );
    let outputUrls = submitted.outputs;
    if (submitted.status !== "completed" || outputUrls.length === 0) {
      outputUrls = await pollJob(submitted.id, 6 * 60_000, 2500);
    }
    const sourceUrl = outputUrls[0];
    if (!sourceUrl) throw new Error("seedream returned no outputs");

    const ext =
      sourceUrl.match(/\.(jpe?g|png|webp)/i)?.[1]?.toLowerCase() ?? "jpg";
    const key = buildStoreAssetKey(
      input.storeId,
      input.kind,
      ext === "jpeg" ? "jpg" : ext,
    );
    const result = await uploadFromUrl(sourceUrl, key);
    const latencyMs = Date.now() - startedAt;

    const [asset] = await db
      .insert(assets)
      .values({
        storeId: input.storeId,
        kind: input.kind,
        source: "generated",
        r2Key: result.key,
        contentType: result.publicUrl?.endsWith(".png")
          ? "image/png"
          : "image/jpeg",
        width,
        height,
        bytes: result.bytes,
        prompt: finalPrompt,
        model: "bytedance/seedream-v4/edit",
        metadata: { taskId: submitted.id, withReference: true, variant: variationDirection },
      })
      .returning({ id: assets.id });

    await db.insert(generations).values({
      storeId: input.storeId,
      userId: input.userId ?? null,
      kind: "image",
      model: "bytedance/seedream-v4/edit",
      promptVersion: "seedream-v4",
      inputHash,
      input: {
        prompt: finalPrompt,
        size: `${width}x${height}`,
        kind: input.kind,
        withReference: true,
      },
      output: { assetId: asset.id },
      inputTokens: 0,
      outputTokens: 0,
      cachedTokens: 0,
      costUsd: SEEDREAM_COST_USD.toFixed(6),
      latencyMs,
      success: 1,
    });

    if (!result.publicUrl) throw new Error("R2 public URL missing");
    return {
      assetId: asset.id,
      imageUrl: result.publicUrl,
      r2Key: result.key,
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const message = err instanceof Error ? err.message : String(err);
    try {
      await db.insert(generations).values({
        storeId: input.storeId,
        userId: input.userId ?? null,
        kind: "image",
        model: "bytedance/seedream-v4/edit",
        promptVersion: "seedream-v4",
        inputHash,
        input: {
          prompt: finalPrompt,
          size: `${width}x${height}`,
          kind: input.kind,
          withReference: true,
        },
        costUsd: "0",
        latencyMs,
        success: 0,
        error: message.slice(0, 1000),
      });
    } catch {}
    throw err;
  }
}

export async function generateImageWithReference(
  input: GenerateWithReferenceInput & { count?: number },
): Promise<{
  variants: Array<{ assetId: string; imageUrl: string; r2Key: string }>;
  costUsd: number;
}> {
  const count = Math.min(Math.max(input.count ?? 1, 1), 5);
  const directions = VARIATION_DIRECTIONS.slice(0, count);

  const settled = await Promise.allSettled(
    directions.map((direction) => generateOneVariant(input, direction)),
  );

  const variants = settled
    .filter(
      (r): r is PromiseFulfilledResult<{ assetId: string; imageUrl: string; r2Key: string }> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value);

  if (variants.length === 0) {
    const firstReason = settled.find((r) => r.status === "rejected");
    throw firstReason?.status === "rejected"
      ? firstReason.reason instanceof Error
        ? firstReason.reason
        : new Error(String(firstReason.reason))
      : new Error("All variants failed");
  }

  return { variants, costUsd: SEEDREAM_COST_PER_IMAGE * variants.length };
}

export type CustomImagePrompt = {
  label: string;
  prompt: string;
  style: "hero" | "lifestyle" | "studio" | "editorial" | "closeup";
};

export type BatchImageInput = {
  referenceImageUrl: string;
  productTitle: string;
  storeId: string;
  userId: string | null;
  targetCount?: number;
  customPrompts?: CustomImagePrompt[];
};

export type BatchImageResult = {
  images: Array<{
    assetId: string;
    imageUrl: string;
    r2Key: string;
    kind: ImageKind;
    style: string;
  }>;
  totalCostUsd: number;
  creditsUsed: number;
};

async function generateBatchVariant(
  input: {
    referenceImageUrl: string;
    prompt: string;
    storeId: string;
    userId: string | null;
    kind: ImageKind;
  },
  style: string,
): Promise<{ assetId: string; imageUrl: string; r2Key: string; kind: ImageKind; style: string }> {
  const dbKind = mapKindToDbKind(input.kind);
  const result = await generateOneVariant(
    {
      prompt: input.prompt,
      referenceImageUrl: input.referenceImageUrl,
      storeId: input.storeId,
      kind: dbKind,
      userId: input.userId,
      width: 1024,
      height: 1024,
    },
    style,
  );
  return { ...result, kind: input.kind, style };
}

const styleToKind = (style: CustomImagePrompt["style"]): ImageKind => {
  switch (style) {
    case "hero":
    case "studio":
      return "hero";
    case "lifestyle":
      return "lifestyle";
    case "editorial":
    case "closeup":
      return "product";
    default:
      return "product";
  }
};

export async function generateProductImageBatch(
  input: BatchImageInput,
): Promise<BatchImageResult> {
  const count = input.targetCount ?? 12;
  const hasCustomPrompts = input.customPrompts && input.customPrompts.length > 0;

  console.log(`[wavespeed] Starting batch generation: ${count} images, ref=${input.referenceImageUrl?.slice(0, 50)}...`);
  console.log(`[wavespeed] Using ${hasCustomPrompts ? "LLM-generated" : "fallback"} prompts`);

  const results: BatchImageResult["images"] = [];
  const errors: string[] = [];
  const batchSize = 3;

  if (hasCustomPrompts) {
    const prompts = input.customPrompts!.slice(0, count);

    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);
      console.log(`[wavespeed] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(prompts.length / batchSize)}`);

      const batchResults = await Promise.allSettled(
        batch.map((promptData) => {
          const kind = styleToKind(promptData.style);
          return generateBatchVariant(
            {
              referenceImageUrl: input.referenceImageUrl,
              prompt: promptData.prompt,
              storeId: input.storeId,
              userId: input.userId,
              kind,
            },
            promptData.label,
          );
        }),
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          const errorMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
          errors.push(errorMsg);
          console.error(`[wavespeed] Image generation failed:`, errorMsg);
        }
      }
    }
  } else {
    const shuffledStyles = [...PRODUCT_IMAGE_STYLES].sort(() => Math.random() - 0.5);
    const selectedStyles = shuffledStyles.slice(0, count);

    for (let i = 0; i < selectedStyles.length; i += batchSize) {
      const batch = selectedStyles.slice(i, i + batchSize);
      console.log(`[wavespeed] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(selectedStyles.length / batchSize)}`);

      const batchResults = await Promise.allSettled(
        batch.map((style, batchIdx) => {
          const globalIdx = i + batchIdx;
          const kind = determineKind(globalIdx);
          return generateBatchVariant(
            {
              referenceImageUrl: input.referenceImageUrl,
              prompt: `Premium product photography of this exact product (${input.productTitle}). ${style}`,
              storeId: input.storeId,
              userId: input.userId,
              kind,
            },
            style,
          );
        }),
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          const errorMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
          errors.push(errorMsg);
          console.error(`[wavespeed] Image generation failed:`, errorMsg);
        }
      }
    }
  }

  console.log(`[wavespeed] Batch complete: ${results.length}/${count} successful, ${errors.length} failed`);
  if (errors.length > 0 && results.length === 0) {
    console.error(`[wavespeed] All images failed. First error:`, errors[0]);
  }

  return {
    images: results,
    totalCostUsd: results.length * SEEDREAM_COST_PER_IMAGE,
    creditsUsed: results.length * CREDITS_PER_IMAGE,
  };
}

export async function generateImage(
  input: GenerateImageInput,
): Promise<GenerateImageResult> {
  const model = input.model ?? "flux_schnell";
  const numImages = input.numImages ?? 1;
  const width = input.width ?? 1024;
  const height = input.height ?? 1024;
  const startedAt = Date.now();
  const inputHash = hashInput({ model, prompt: input.prompt, width, height, seed: input.seed });

  try {
    const taskId = await submitJob(model, {
      prompt: input.prompt,
      size: `${width}*${height}`,
      num_images: numImages,
      seed: input.seed ?? -1,
      enable_base64_output: false,
      enable_sync_mode: false,
    });

    const outputUrls = await pollJob(taskId);
    const costUsd = MODEL_COST_USD[model] * outputUrls.length;
    const latencyMs = Date.now() - startedAt;

    const uploaded = await Promise.all(
      outputUrls.map(async (url, idx) => {
        const key = buildStoreAssetKey(input.storeId, input.kind, "png");
        const result = await uploadFromUrl(url, key);
        const [asset] = await db
          .insert(assets)
          .values({
            storeId: input.storeId,
            kind: input.kind,
            source: "generated",
            r2Key: result.key,
            contentType: "image/png",
            width,
            height,
            bytes: result.bytes,
            prompt: input.prompt,
            model: WAVESPEED_MODELS[model],
            metadata: { taskId, index: idx },
          })
          .returning({ id: assets.id });
        return {
          id: asset.id,
          r2Key: result.key,
          publicUrl: result.publicUrl,
          width,
          height,
        };
      }),
    );

    const [gen] = await db
      .insert(generations)
      .values({
        storeId: input.storeId,
        userId: input.userId ?? null,
        kind: "image",
        model: WAVESPEED_MODELS[model],
        promptVersion: `wavespeed-${model}`,
        inputHash,
        input: { prompt: input.prompt, width, height, numImages },
        output: { assetIds: uploaded.map((a) => a.id) },
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        costUsd: costUsd.toFixed(6),
        latencyMs,
        success: 1,
      })
      .returning({ id: generations.id });

    return { assets: uploaded, generationId: gen.id, costUsd, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const message = err instanceof Error ? err.message : String(err);
    try {
      await db.insert(generations).values({
        storeId: input.storeId,
        userId: input.userId ?? null,
        kind: "image",
        model: WAVESPEED_MODELS[model],
        promptVersion: `wavespeed-${model}`,
        inputHash,
        input: { prompt: input.prompt, width, height, numImages },
        costUsd: "0",
        latencyMs,
        success: 0,
        error: message.slice(0, 1000),
      });
    } catch {}
    throw err;
  }
}
