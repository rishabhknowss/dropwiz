import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID, createHash } from "crypto";
import { env } from "@/env";

const globalForR2 = globalThis as unknown as { r2Client?: S3Client };

export const r2 =
  globalForR2.r2Client ??
  new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

if (env.NODE_ENV !== "production") globalForR2.r2Client = r2;

export const R2_BUCKET = env.R2_BUCKET;
export const R2_PREFIX = env.R2_PREFIX;

export function prefixedKey(key: string): string {
  const stripped = key.replace(/^\/+/, "");
  return R2_PREFIX ? `${R2_PREFIX}/${stripped}` : stripped;
}

export function buildKey(parts: (string | number)[], extension?: string): string {
  const ulid = randomUUID().replace(/-/g, "").slice(0, 20);
  const base = parts.filter(Boolean).map(String).join("/");
  return extension ? `${base}/${ulid}.${extension}` : `${base}/${ulid}`;
}

export function buildStoreAssetKey(
  storeId: string,
  kind: string,
  extension: string,
): string {
  return buildKey(["stores", storeId, kind], extension);
}

export function hashBuffer(buf: Buffer | Uint8Array): string {
  return createHash("sha256").update(buf).digest("hex");
}

export type UploadInput = {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
  prefixed?: boolean;
};

export type UploadResult = {
  key: string;
  bytes: number;
  etag?: string;
  publicUrl?: string;
};

export async function uploadAsset(input: UploadInput): Promise<UploadResult> {
  const key = input.prefixed === false ? input.key : prefixedKey(input.key);
  const body =
    typeof input.body === "string" ? Buffer.from(input.body, "utf-8") : input.body;

  const cmd: PutObjectCommandInput = {
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: input.contentType,
    CacheControl: input.cacheControl ?? "public, max-age=31536000, immutable",
    Metadata: input.metadata,
  };
  const res = await r2.send(new PutObjectCommand(cmd));

  return {
    key,
    bytes: body.length,
    etag: res.ETag,
    publicUrl: publicUrlFor(key),
  };
}

export async function uploadFromUrl(
  sourceUrl: string,
  key: string,
  prefixed = true,
): Promise<UploadResult> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`fetch failed ${res.status} ${sourceUrl}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  return uploadAsset({ key, body: buf, contentType, prefixed });
}

export async function getAsset(key: string, prefixed = true): Promise<Buffer> {
  const k = prefixed ? prefixedKey(key) : key;
  const res = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: k }));
  if (!res.Body) throw new Error(`no body for ${k}`);
  const chunks: Uint8Array[] = [];
  for await (const chunk of res.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function headAsset(key: string, prefixed = true) {
  const k = prefixed ? prefixedKey(key) : key;
  return r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: k }));
}

export async function deleteAsset(key: string, prefixed = true): Promise<void> {
  const k = prefixed ? prefixedKey(key) : key;
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: k }));
}

export async function listAssets(prefix: string, prefixed = true) {
  const p = prefixed ? prefixedKey(prefix) : prefix;
  return r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: p }));
}

export async function presignGetUrl(
  key: string,
  ttlSeconds = 60 * 60,
  prefixed = true,
): Promise<string> {
  const k = prefixed ? prefixedKey(key) : key;
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: k }),
    { expiresIn: ttlSeconds },
  );
}

export async function presignPutUrl(
  key: string,
  contentType: string,
  ttlSeconds = 5 * 60,
  prefixed = true,
): Promise<string> {
  const k = prefixed ? prefixedKey(key) : key;
  return getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: k, ContentType: contentType }),
    { expiresIn: ttlSeconds },
  );
}

export function publicUrlFor(key: string): string | undefined {
  if (!env.R2_PUBLIC_URL) return undefined;
  const base = env.R2_PUBLIC_URL.replace(/\/+$/, "");
  return `${base}/${key}`;
}
