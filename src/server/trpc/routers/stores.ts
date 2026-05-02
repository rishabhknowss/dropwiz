import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { stores, products, assets, users, type StoreSection, type StorePage } from "@/db/schema";

const FREE_TIERS = ["free", "starter"] as const;
import { createPageFromTemplate, PAGE_TEMPLATES } from "@/lib/page-templates";
import {
  createPendingStore,
  runStoreGeneration,
} from "@/server/jobs/store-generation";
import {
  generateHero,
  generateBundles,
  generateFaq,
} from "@/lib/ai/prompts";
import { generateImage, generateImageWithReference } from "@/lib/ai/wavespeed";
import { resolveProductImageUrl } from "@/lib/ai/product-image";
import {
  buildStoreAssetKey,
  presignPutUrl,
  publicUrlFor,
  prefixedKey,
} from "@/lib/storage/r2";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { checkLimits } from "../rate-limit";

const createInputSchema = z.object({
  url: z.string().url().max(2048).optional(),
  aiPrompt: z.string().min(10).max(1000).optional(),
  persona: z.string().max(160).optional(),
  angle: z.string().max(160).optional(),
  targetLanguage: z.string().min(2).max(10),
  currency: z.string().min(3).max(8).optional(),
  shopifyShopDomain: z.string().max(255).optional(),
  shopifyProductId: z.string().max(255).optional(),
});

export const storesRouter = router({
  create: publicProcedure
    .input(createInputSchema)
    .mutation(async ({ ctx, input }) => {
      const rl = await checkLimits([
        { key: `store-create:ip:${ctx.ip}`, limit: 8, windowMs: 60 * 60 * 1000 },
      ]);
      if (!rl.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many stores created. Please wait a bit.",
        });
      }

      const usingShopify =
        !!input.shopifyShopDomain && !!input.shopifyProductId;
      const usingAI = !!input.aiPrompt;

      if (!usingShopify && !input.url && !usingAI) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provide a product URL, Shopify product, or AI description",
        });
      }

      const sourceUrl = usingShopify
        ? `https://${input.shopifyShopDomain}/products/${input.shopifyProductId}`
        : usingAI
        ? `ai://${Date.now()}`
        : input.url!;

      const pending = await createPendingStore({
        url: sourceUrl,
        aiPrompt: usingAI ? input.aiPrompt : undefined,
        persona: input.persona?.trim() || "General buyer for this product",
        angle: input.angle?.trim() || "Problem-solution",
        targetLanguage: input.targetLanguage,
        currency: input.currency,
        userId: ctx.session?.user.id ?? null,
      });

      const shopifySource =
        usingShopify
          ? {
              shopDomain: input.shopifyShopDomain!,
              productId: input.shopifyProductId!,
            }
          : null;

      void runStoreGeneration(pending.storeId, sourceUrl, {
        shopifySource,
        aiPrompt: usingAI ? input.aiPrompt : undefined,
      }).catch((err) => {
        console.error("[store-gen] unhandled:", err);
      });

      return pending;
    }),

  getStatus: publicProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: stores.id,
          slug: stores.slug,
          name: stores.name,
          status: stores.status,
          score: stores.score,
          failureReason: stores.failureReason,
          productId: stores.productId,
        })
        .from(stores)
        .where(eq(stores.id, input.storeId))
        .limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });

      let analysis: unknown = null;
      let productImage: string | null = null;
      if (row.productId) {
        const productRow = await db
          .select({
            rawPayload: products.rawPayload,
            originalImages: products.originalImages,
          })
          .from(products)
          .where(eq(products.id, row.productId))
          .limit(1);
        const raw = productRow[0]?.rawPayload as
          | { analysis?: unknown }
          | null
          | undefined;
        analysis = raw?.analysis ?? null;
        const imgs = productRow[0]?.originalImages as string[] | null;
        productImage = imgs?.[0] ?? null;
      }

      return { ...row, analysis, productImage };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(80) }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(eq(stores.slug, input.slug))
        .limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      return row;
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        id: stores.id,
        slug: stores.slug,
        name: stores.name,
        status: stores.status,
        score: stores.score,
        sections: stores.sections,
        themeTokens: stores.themeTokens,
        screenshotKey: stores.screenshotKey,
        publishedShopifyUrl: stores.publishedShopifyUrl,
        lastPublishedAt: stores.lastPublishedAt,
        createdAt: stores.createdAt,
      })
      .from(stores)
      .where(eq(stores.userId, ctx.user.id))
      .orderBy(desc(stores.createdAt));

    return rows.map((r) => {
      const hero = r.sections.find((s) => s.type === "hero");
      const product = r.sections.find((s) => s.type === "product");
      const heroData = (hero?.data ?? {}) as { imageUrl?: string };
      const productData = (product?.data ?? {}) as { imageUrl?: string };
      const thumbnailUrl = heroData.imageUrl ?? productData.imageUrl ?? null;
      const tokens = (r.themeTokens ?? {}) as {
        colors?: { background?: string; primary?: string; accent?: string };
      };
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        status: r.status,
        score: r.score,
        screenshotKey: r.screenshotKey,
        publishedShopifyUrl: r.publishedShopifyUrl,
        lastPublishedAt: r.lastPublishedAt,
        createdAt: r.createdAt,
        thumbnailUrl,
        themePreview: {
          bg: tokens.colors?.background ?? "#0a0a0a",
          primary: tokens.colors?.primary ?? "#c7ff3d",
          accent: tokens.colors?.accent ?? "#c7ff3d",
        },
      };
    });
  }),

  getMine: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      return row;
    }),

  updateStrategy: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        persona: z.string().min(2).max(80).optional(),
        angle: z.string().min(2).max(80).optional(),
        targetLanguage: z.string().min(2).max(10).optional(),
        currency: z.string().min(3).max(8).optional(),
        name: z.string().min(1).max(200).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(stores)
        .set({
          persona: input.persona,
          angle: input.angle,
          targetLanguage: input.targetLanguage,
          currency: input.currency,
          name: input.name,
          updatedAt: new Date(),
        })
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .returning({ id: stores.id });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true };
    }),

  applyTemplate: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        themeTokens: z.record(z.string(), z.unknown()),
        layout: z
          .array(
            z.enum([
              "hero",
              "product",
              "bundles",
              "trust",
              "faq",
              "footer",
              "video",
              "countdown",
              "comparison",
              "lifestyle",
              "gallery",
              "testimonials",
              "valueProps",
            ]),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      let sections = store.sections;
      if (input.layout) {
        const existingByType = new Map(
          store.sections.map((s) => [s.type, s]),
        );
        sections = input.layout.map((type, order) => {
          const existing = existingByType.get(type);
          if (existing) return { ...existing, order };
          return {
            id: nanoid(8),
            type,
            order,
            data: defaultSectionData(type, store),
          };
        });
      }

      await db
        .update(stores)
        .set({
          themeTokens: input.themeTokens as Record<string, unknown>,
          sections,
          updatedAt: new Date(),
        })
        .where(eq(stores.id, input.storeId));
      return { success: true };
    }),

  updateTheme: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        themeTokens: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(stores)
        .set({
          themeTokens: input.themeTokens as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .returning({ id: stores.id });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true };
    }),

  reorderSections: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        sectionIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const row = rows[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });

      const byId = new Map(row.sections.map((s) => [s.id, s]));
      const next = input.sectionIds
        .map((id) => byId.get(id))
        .filter((s): s is (typeof row.sections)[number] => !!s)
        .map((s, i) => ({ ...s, order: i }));

      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));
      return { success: true };
    }),

  updateSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        sectionId: z.string().min(1),
        data: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const idx = store.sections.findIndex((s) => s.id === input.sectionId);
      if (idx === -1)
        throw new TRPCError({ code: "NOT_FOUND", message: "Section not found" });

      const next = [...store.sections];
      next[idx] = {
        ...next[idx],
        data: { ...next[idx].data, ...input.data },
      };

      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));
      return { success: true };
    }),

  addSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        type: z.enum([
          "hero",
          "product",
          "bundles",
          "trust",
          "faq",
          "footer",
          "video",
          "countdown",
          "comparison",
          "lifestyle",
          "gallery",
          "testimonials",
          "valueProps",
        ]),
        position: z.number().int().min(0).optional(),
        variant: z.string().max(40).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const baseData = defaultSectionData(input.type, store) as Record<string, unknown>;
      const data = input.variant ? { ...baseData, variant: input.variant } : baseData;
      const newSection: StoreSection = {
        id: nanoid(8),
        type: input.type,
        order: 0,
        data,
      };

      const insertAt = input.position ?? store.sections.length;
      const next = [...store.sections];
      next.splice(insertAt, 0, newSection);
      const ordered = next.map((s, i) => ({ ...s, order: i }));

      await db
        .update(stores)
        .set({ sections: ordered, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));
      return { section: newSection };
    }),

  removeSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        sectionId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const next = store.sections
        .filter((s) => s.id !== input.sectionId)
        .map((s, i) => ({ ...s, order: i }));

      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));
      return { success: true };
    }),

  regenerateSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        sectionId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      if (!store.productId)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Store has no product",
        });

      const section = store.sections.find((s) => s.id === input.sectionId);
      if (!section) throw new TRPCError({ code: "NOT_FOUND" });

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, store.productId))
        .limit(1);
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      const genCtx = {
        product: {
          title: product.title ?? "Product",
          description: product.description ?? "",
          priceCents: product.priceCents ?? 4900,
          currency: product.currency ?? "USD",
          originalImages: (product.originalImages as string[]) ?? [],
        },
        targeting: {
          persona: store.persona ?? "general consumer",
          angle: store.angle ?? "transformation",
          targetLanguage: store.targetLanguage,
        },
        storeId: store.id,
        userId: ctx.user.id,
      };

      let newData: Record<string, unknown> = section.data;
      if (section.type === "hero") {
        const hero = await generateHero(genCtx);
        newData = {
          ...section.data,
          headline: hero.headline,
          subheadline: hero.subheadline,
          primaryCta: hero.primaryCta,
          secondaryCta: hero.secondaryCta,
          urgencyBadge: hero.urgencyBadge,
          socialProof: hero.socialProof,
        };
      } else if (section.type === "bundles") {
        const bundles = await generateBundles(genCtx);
        newData = { ...section.data, bundles: bundles.bundles };
      } else if (section.type === "faq") {
        const faq = await generateFaq(genCtx);
        newData = { ...section.data, faqs: faq.faqs };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Section "${section.type}" cannot be regenerated`,
        });
      }

      const next = store.sections.map((s) =>
        s.id === section.id ? { ...s, data: newData } : s,
      );
      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, store.id));
      return { success: true };
    }),

  generateImage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        kind: z.enum(["hero", "lifestyle", "product", "ad"]),
        prompt: z.string().min(4).max(800),
        width: z.number().int().min(256).max(2048).optional(),
        height: z.number().int().min(256).max(2048).optional(),
        count: z.number().int().min(1).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userRows = await db
        .select({ imageCredits: users.imageCredits, tier: users.tier })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);
      const user = userRows[0];
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const count = input.count ?? 1;
      const isFreeTier = FREE_TIERS.includes(user.tier as (typeof FREE_TIERS)[number]);
      if (isFreeTier && user.imageCredits < count) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Not enough image credits. Need ${count}, have ${user.imageCredits}. Upgrade to Pro for unlimited.`,
        });
      }

      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      let referenceImageUrl: string | null = null;
      if (store.productId) {
        const productRows = await db
          .select({ originalImages: products.originalImages })
          .from(products)
          .where(eq(products.id, store.productId))
          .limit(1);
        const product = productRows[0];
        if (product) {
          referenceImageUrl = resolveProductImageUrl(store, product);
        }
      }

      if (referenceImageUrl) {
        const result = await generateImageWithReference({
          prompt: input.prompt,
          referenceImageUrl,
          width: input.width ?? 1024,
          height: input.height ?? 1024,
          storeId: input.storeId,
          userId: ctx.user.id,
          kind: input.kind,
          count,
        });
        const first = result.variants[0];
        if (!first) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        if (isFreeTier) {
          await db
            .update(users)
            .set({ imageCredits: sql`${users.imageCredits} - ${count}` })
            .where(eq(users.id, ctx.user.id));
        }

        return {
          assetId: first.assetId,
          imageUrl: first.imageUrl,
          r2Key: first.r2Key,
          variants: result.variants,
          creditsRemaining: isFreeTier ? user.imageCredits - count : null,
        };
      }

      const result = await generateImage({
        model: "flux_schnell",
        prompt: input.prompt,
        width: input.width ?? 1024,
        height: input.height ?? 1024,
        numImages: count,
        storeId: input.storeId,
        userId: ctx.user.id,
        kind: input.kind,
      });

      const asset = result.assets[0];
      if (!asset?.publicUrl) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      if (isFreeTier) {
        await db
          .update(users)
          .set({ imageCredits: sql`${users.imageCredits} - ${count}` })
          .where(eq(users.id, ctx.user.id));
      }

      return {
        assetId: asset.id,
        imageUrl: asset.publicUrl,
        r2Key: asset.r2Key,
        variants: result.assets
          .filter((a) => !!a.publicUrl)
          .map((a) => ({
            assetId: a.id,
            imageUrl: a.publicUrl as string,
            r2Key: a.r2Key,
          })),
        creditsRemaining: isFreeTier ? user.imageCredits - count : null,
      };
    }),

  createUploadUrl: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        kind: z.enum(["hero", "lifestyle", "product", "logo", "ad"]),
        contentType: z
          .string()
          .regex(/^image\/(png|jpeg|webp|gif)$/i, "Only PNG, JPEG, WebP, GIF allowed"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select({ id: stores.id })
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const ext = input.contentType.split("/")[1] === "jpeg" ? "jpg" : input.contentType.split("/")[1];
      const key = buildStoreAssetKey(input.storeId, input.kind, ext);
      const fullKey = prefixedKey(key);
      const uploadUrl = await presignPutUrl(key, input.contentType, 5 * 60);
      return { uploadUrl, key: fullKey };
    }),

  registerUploadedAsset: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        kind: z.enum(["hero", "lifestyle", "product", "logo", "ad"]),
        key: z.string().min(1).max(512),
        bytes: z.number().int().min(1).max(50 * 1024 * 1024),
        contentType: z.string().regex(/^image\/(png|jpeg|webp|gif)$/i),
        width: z.number().int().min(1).max(8000).optional(),
        height: z.number().int().min(1).max(8000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select({ id: stores.id })
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const [asset] = await db
        .insert(assets)
        .values({
          storeId: input.storeId,
          kind: input.kind,
          source: "uploaded",
          r2Key: input.key,
          contentType: input.contentType,
          width: input.width ?? 0,
          height: input.height ?? 0,
          bytes: input.bytes,
        })
        .returning({ id: assets.id });

      const publicUrl = publicUrlFor(input.key);
      if (!publicUrl) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "R2_PUBLIC_URL not configured",
        });
      }
      return { assetId: asset.id, imageUrl: publicUrl };
    }),

  regenerateHeroImage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        prompt: z.string().max(500).optional(),
        count: z.number().int().min(1).max(4).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const count = input.count ?? 1;

      const userRows = await db
        .select({ imageCredits: users.imageCredits, tier: users.tier })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);
      const user = userRows[0];
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const isFreeTier = FREE_TIERS.includes(user.tier as (typeof FREE_TIERS)[number]);
      if (isFreeTier && user.imageCredits < count) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Not enough credits. Need ${count}, have ${user.imageCredits}.`,
        });
      }

      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const heroIdx = store.sections.findIndex((s) => s.type === "hero");
      if (heroIdx === -1)
        throw new TRPCError({ code: "NOT_FOUND", message: "No hero section" });

      const prompt =
        input.prompt ??
        `Product hero shot of ${store.name ?? "product"}, studio lighting, soft cream background, premium editorial photography, centered, no text, no watermark. Target: ${store.persona ?? "general consumer"}.`;

      const result = await generateImage({
        model: "flux_schnell",
        prompt,
        width: 1024,
        height: 1024,
        numImages: count,
        storeId: store.id,
        userId: ctx.user.id,
        kind: "hero",
      });

      const newImageUrl = result.assets[0]?.publicUrl;
      if (!newImageUrl) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (isFreeTier) {
        await db
          .update(users)
          .set({ imageCredits: sql`${users.imageCredits} - ${count}` })
          .where(eq(users.id, ctx.user.id));
      }

      const next = [...store.sections];
      next[heroIdx] = {
        ...next[heroIdx],
        data: { ...next[heroIdx].data, imageUrl: newImageUrl },
      };
      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, store.id));

      return {
        imageUrl: newImageUrl,
        assetId: result.assets[0]?.id,
        variants: result.assets
          .filter((a) => !!a.publicUrl)
          .map((a) => ({
            assetId: a.id,
            imageUrl: a.publicUrl as string,
            r2Key: a.r2Key,
          })),
        creditsRemaining: isFreeTier ? user.imageCredits - count : null,
      };
    }),

  setHeroImage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const heroIdx = store.sections.findIndex((s) => s.type === "hero");
      if (heroIdx === -1) throw new TRPCError({ code: "NOT_FOUND" });

      const next = [...store.sections];
      next[heroIdx] = {
        ...next[heroIdx],
        data: { ...next[heroIdx].data, imageUrl: input.imageUrl },
      };
      await db
        .update(stores)
        .set({ sections: next, updatedAt: new Date() })
        .where(eq(stores.id, store.id));
      return { success: true };
    }),

  claim: protectedProcedure
    .input(z.object({ claimToken: z.string().min(8).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const [claimed] = await db
        .update(stores)
        .set({
          userId: ctx.user.id,
          claimToken: null,
          claimTokenExpiresAt: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(stores.claimToken, input.claimToken),
            sql`${stores.claimTokenExpiresAt} > now()`,
            sql`${stores.userId} IS NULL`,
          ),
        )
        .returning({ id: stores.id, slug: stores.slug });
      if (!claimed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Claim link is invalid or expired",
        });
      }
      return claimed;
    }),

  getPages: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const rows = await db
        .select({ pages: stores.pages, sections: stores.sections, name: stores.name })
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      if (store.pages.length > 0) {
        return store.pages;
      }

      const defaultPage: StorePage = {
        id: nanoid(10),
        type: "product",
        name: "Product Page",
        slug: "",
        sections: store.sections,
        order: 0,
        isDefault: true,
      };
      return [defaultPage];
    }),

  addPage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        type: z.enum(["product", "landing", "about", "faq", "gallery", "blog"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      let pages = store.pages;
      if (pages.length === 0 && store.sections.length > 0) {
        const defaultPage: StorePage = {
          id: nanoid(10),
          type: "product",
          name: "Product Page",
          slug: "",
          sections: store.sections,
          order: 0,
          isDefault: true,
        };
        pages = [defaultPage];
      }

      const productSection = store.sections.find((s) => s.type === "product");
      const productData = (productSection?.data ?? {}) as { imageUrl?: string };
      const newPage = createPageFromTemplate(
        input.type,
        store.name ?? "Store",
        pages.length,
        productData.imageUrl,
      );

      const updatedPages = [...pages, newPage];
      await db
        .update(stores)
        .set({ pages: updatedPages, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { page: newPage };
    }),

  updatePage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
        name: z.string().min(1).max(100).optional(),
        slug: z.string().max(80).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const pageIdx = pages.findIndex((p) => p.id === input.pageId);
      if (pageIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });

      const updatedPages = [...pages];
      updatedPages[pageIdx] = {
        ...updatedPages[pageIdx],
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
      };

      await db
        .update(stores)
        .set({ pages: updatedPages, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  deletePage: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const page = pages.find((p) => p.id === input.pageId);
      if (!page) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      if (page.isDefault) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete the default page" });
      }

      const updatedPages = pages
        .filter((p) => p.id !== input.pageId)
        .map((p, i) => ({ ...p, order: i }));

      await db
        .update(stores)
        .set({ pages: updatedPages, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  reorderPages: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const byId = new Map(pages.map((p) => [p.id, p]));
      const reordered = input.pageIds
        .map((id) => byId.get(id))
        .filter((p): p is StorePage => !!p)
        .map((p, i) => ({ ...p, order: i }));

      await db
        .update(stores)
        .set({ pages: reordered, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  updatePageSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
        sectionId: z.string().min(1),
        data: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const pageIdx = pages.findIndex((p) => p.id === input.pageId);
      if (pageIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });

      const page = pages[pageIdx];
      const sectionIdx = page.sections.findIndex((s) => s.id === input.sectionId);
      if (sectionIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Section not found" });

      const updatedSections = [...page.sections];
      updatedSections[sectionIdx] = {
        ...updatedSections[sectionIdx],
        data: { ...updatedSections[sectionIdx].data, ...input.data },
      };

      const updatedPages = [...pages];
      updatedPages[pageIdx] = { ...page, sections: updatedSections };

      const sectionsUpdate = page.isDefault ? updatedSections : store.sections;

      await db
        .update(stores)
        .set({ pages: updatedPages, sections: sectionsUpdate, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  addPageSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
        type: z.enum([
          "hero",
          "product",
          "bundles",
          "trust",
          "faq",
          "footer",
          "video",
          "countdown",
          "comparison",
          "lifestyle",
          "gallery",
          "testimonials",
          "valueProps",
        ]),
        position: z.number().int().min(0).optional(),
        variant: z.string().max(40).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const pageIdx = pages.findIndex((p) => p.id === input.pageId);
      if (pageIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });

      const page = pages[pageIdx];
      const baseData = defaultSectionData(input.type, store) as Record<string, unknown>;
      const data = input.variant ? { ...baseData, variant: input.variant } : baseData;
      const newSection: StoreSection = {
        id: nanoid(8),
        type: input.type,
        order: 0,
        data,
      };

      const insertAt = input.position ?? page.sections.length;
      const updatedSections = [...page.sections];
      updatedSections.splice(insertAt, 0, newSection);
      const orderedSections = updatedSections.map((s, i) => ({ ...s, order: i }));

      const updatedPages = [...pages];
      updatedPages[pageIdx] = { ...page, sections: orderedSections };

      const sectionsUpdate = page.isDefault ? orderedSections : store.sections;

      await db
        .update(stores)
        .set({ pages: updatedPages, sections: sectionsUpdate, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { section: newSection };
    }),

  removePageSection: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
        sectionId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const pageIdx = pages.findIndex((p) => p.id === input.pageId);
      if (pageIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });

      const page = pages[pageIdx];
      const updatedSections = page.sections
        .filter((s) => s.id !== input.sectionId)
        .map((s, i) => ({ ...s, order: i }));

      const updatedPages = [...pages];
      updatedPages[pageIdx] = { ...page, sections: updatedSections };

      const sectionsUpdate = page.isDefault ? updatedSections : store.sections;

      await db
        .update(stores)
        .set({ pages: updatedPages, sections: sectionsUpdate, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  reorderPageSections: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        pageId: z.string().min(1),
        sectionIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const pages = ensurePages(store);
      const pageIdx = pages.findIndex((p) => p.id === input.pageId);
      if (pageIdx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });

      const page = pages[pageIdx];
      const byId = new Map(page.sections.map((s) => [s.id, s]));
      const reordered = input.sectionIds
        .map((id) => byId.get(id))
        .filter((s): s is StoreSection => !!s)
        .map((s, i) => ({ ...s, order: i }));

      const updatedPages = [...pages];
      updatedPages[pageIdx] = { ...page, sections: reordered };

      const sectionsUpdate = page.isDefault ? reordered : store.sections;

      await db
        .update(stores)
        .set({ pages: updatedPages, sections: sectionsUpdate, updatedAt: new Date() })
        .where(eq(stores.id, input.storeId));

      return { success: true };
    }),

  listPageTemplates: publicProcedure.query(() => {
    return PAGE_TEMPLATES.map((t) => ({
      type: t.type,
      name: t.name,
      description: t.description,
      icon: t.icon,
    }));
  }),
});

function ensurePages(store: typeof stores.$inferSelect): StorePage[] {
  if (store.pages.length > 0) {
    return store.pages;
  }
  if (store.sections.length === 0) {
    return [];
  }
  return [
    {
      id: nanoid(10),
      type: "product",
      name: "Product Page",
      slug: "",
      sections: store.sections,
      order: 0,
      isDefault: true,
    },
  ];
}

function defaultSectionData(
  type: StoreSection["type"],
  store: typeof stores.$inferSelect,
): Record<string, unknown> {
  const productSection = store.sections.find((s) => s.type === "product");
  const productData = (productSection?.data ?? {}) as {
    priceCents?: number;
    currency?: string;
    imageUrl?: string;
    title?: string;
  };
  const currency = productData.currency ?? store.currency ?? "USD";
  const priceCents = productData.priceCents ?? 4900;

  switch (type) {
    case "hero":
      return {
        headline: "New headline",
        subheadline: "Tell the story in one line.",
        primaryCta: "Shop now",
        secondaryCta: null,
        urgencyBadge: null,
        socialProof: null,
        imageUrl: productData.imageUrl ?? "",
      };
    case "product":
      return {
        title: productData.title ?? store.name ?? "Product",
        imageUrl: productData.imageUrl ?? "",
        priceCents,
        currency,
      };
    case "bundles":
      return {
        bundles: [
          {
            name: "Single",
            description: "One item",
            quantity: 1,
            discountPercent: 0,
            badge: null,
            savings: "Full price",
            recommended: false,
          },
          {
            name: "Popular",
            description: "The most-picked bundle",
            quantity: 3,
            discountPercent: 20,
            badge: "MOST POPULAR",
            savings: "Save 20%",
            recommended: true,
          },
        ],
        basePriceCents: priceCents,
        currency,
      };
    case "trust":
      return {
        badges: [
          "30-day money-back guarantee",
          "Ships in 1-2 business days",
          "Secure checkout",
        ],
      };
    case "faq":
      return { faqs: [{ question: "New question?", answer: "Write the answer here." }] };
    case "footer":
      return { storeName: store.name ?? "Store" };
    case "video":
      return { videoUrl: "", caption: "Product video" };
    case "countdown":
      return {
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        label: "Launch offer",
      };
    case "comparison":
      return {
        rows: [
          { label: "Our product", ours: "✓", theirs: "✗" },
          { label: "Competitor", ours: "✓", theirs: "✓" },
        ],
      };
    case "lifestyle":
      return {
        headline: "Made for the way you actually use it",
        body: "Real people, real results. Tell the story here.",
        imageUrl: productData.imageUrl ?? "",
        imagePosition: "right",
      };
    case "gallery":
      return {
        title: "See it from every angle",
        images: [
          { url: productData.imageUrl ?? "", caption: "" },
          { url: "", caption: "" },
          { url: "", caption: "" },
          { url: "", caption: "" },
        ],
      };
    case "testimonials":
      return {
        title: "Customers talking",
        testimonials: [
          {
            quote: "This actually works. 14 days and I'm a different person.",
            name: "Sarah K.",
            role: "Verified buyer",
            rating: 5,
          },
          {
            quote: "Exceeded expectations. Ordering two more for my family.",
            name: "Marcus T.",
            role: "Verified buyer",
            rating: 5,
          },
          {
            quote: "Worth every penny. The learning course is a nice touch.",
            name: "Priya S.",
            role: "Verified buyer",
            rating: 5,
          },
        ],
      };
    case "valueProps":
      return {
        title: "Why this one",
        props: [
          {
            icon: "⚡",
            title: "Ships fast",
            description: "Out the door in 1–2 business days.",
          },
          {
            icon: "🛡",
            title: "30-day guarantee",
            description: "Love it or send it back — no questions.",
          },
          {
            icon: "★",
            title: "Rated 4.9/5",
            description: "Backed by thousands of verified reviews.",
          },
        ],
      };
    default:
      return {};
  }
}
