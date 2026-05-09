const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "https://assets.dropwiz.ai";

export function r2PublicUrl(key: string): string {
  const base = PUBLIC_BASE.replace(/\/+$/, "");
  return `${base}/${key}`;
}
