export type ProductContext = {
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  originalImages?: string[];
};

export type TargetingContext = {
  persona: string;
  angle: string;
  targetLanguage: string;
  targetMarket?: string;
};

export function formatPrice(priceCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(priceCents / 100);
  } catch {
    return `${currency} ${(priceCents / 100).toFixed(2)}`;
  }
}

export function describeProduct(product: ProductContext): string {
  const description = product.description.slice(0, 1200);
  return [
    `Title: ${product.title}`,
    `Description: ${description}`,
    `Price: ${formatPrice(product.priceCents, product.currency)}`,
  ].join("\n");
}

export function describeTargeting(targeting: TargetingContext): string {
  const lines = [
    `Target persona: ${targeting.persona}`,
    `Marketing angle: ${targeting.angle}`,
    `Target language: ${targeting.targetLanguage}`,
  ];
  if (targeting.targetMarket) lines.push(`Target market: ${targeting.targetMarket}`);
  return lines.join("\n");
}
