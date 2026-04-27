export function formatPrice(
  cents: number,
  currency = "USD",
  locale = "en-US",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}

export function formatUsd(value: number, digits = 6): string {
  return `$${value.toFixed(digits)}`;
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale);
}

export function bundlePrice(
  basePriceCents: number,
  qty: number,
  discountPct: number,
): number {
  const subtotal = basePriceCents * qty;
  return Math.round(subtotal * (1 - discountPct / 100));
}
