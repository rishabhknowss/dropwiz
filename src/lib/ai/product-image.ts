type SectionLike = { type: string; data: Record<string, unknown> };

export function resolveProductImageUrl(
  store: { sections: SectionLike[] },
  product: { originalImages: unknown },
): string | null {
  const findSection = (type: string) =>
    store.sections.find((s) => s.type === type)?.data as
      | { imageUrl?: string }
      | undefined;
  const productSection = findSection("product");
  if (productSection?.imageUrl) return productSection.imageUrl;
  const hero = findSection("hero");
  if (hero?.imageUrl) return hero.imageUrl;
  const originals = product.originalImages;
  if (Array.isArray(originals) && typeof originals[0] === "string") {
    return originals[0];
  }
  return null;
}
