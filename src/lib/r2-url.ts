const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "https://assets.dropwiz.ai";

const R2_PREFIX = "dropwiz";

export function r2PublicUrl(key: string): string {
  const base = PUBLIC_BASE.replace(/\/+$/, "");
  const relativeKey = key.startsWith(`${R2_PREFIX}/`)
    ? key.slice(R2_PREFIX.length + 1)
    : key;
  return `${base}/${relativeKey}`;
}
