import * as HugeIcons from "@hugeicons/core-free-icons";

type IconPathData = [string, Record<string, string>][];

const ICON_NAME_MAP: Record<string, string> = {
  Truck01Icon: "TruckDeliveryIcon",
  Lock01Icon: "LockKeyIcon",
  ShieldCheckIcon: "SecurityCheckIcon",
  UserShieldIcon: "ShieldUserIcon",
};

const iconDataToSvg = (iconData: IconPathData, size = "1em"): string => {
  const paths = iconData
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}></${tag}>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor">${paths}</svg>`;
};

export const getIconSvg = (iconName?: string, size = "1em"): string => {
  if (!iconName) return "";
  const mappedName = ICON_NAME_MAP[iconName] ?? iconName;
  let iconData = (HugeIcons as Record<string, IconPathData>)[mappedName];
  if (!iconData || !Array.isArray(iconData)) {
    const withSuffix = mappedName.endsWith("Icon") ? mappedName : mappedName + "Icon";
    iconData = (HugeIcons as Record<string, IconPathData>)[withSuffix];
  }
  if (!iconData || !Array.isArray(iconData)) {
    const baseName = iconName.replace(/\d+Icon$/, "Icon");
    iconData = (HugeIcons as Record<string, IconPathData>)[baseName];
  }
  if (!iconData || !Array.isArray(iconData)) return "";
  return iconDataToSvg(iconData, size);
};

export const esc = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const formatStaticPrice = (
  cents: number,
  currency: string = "USD"
): string => {
  const amount = (cents / 100).toFixed(2);
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    CAD: "CA$",
    AUD: "A$",
  };
  return `${symbols[currency] ?? currency + " "}${amount}`;
};

export const fmtPrice = (cents: number, currency: string): string => {
  const v = (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${v}`;
};

export const bundlePrice = (
  base: number,
  qty: number,
  discountPct: number
): number => {
  return Math.round(base * qty * (1 - discountPct / 100));
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const PAYMENT_FILE_MAP: Record<string, string> = {
  visa: "visa.png",
  mastercard: "mastercard.png",
  amex: "amex.png",
  paypal: "paypal.png",
  applepay: "applepay.png",
  googlepay: "gpay.png",
  discover: "visa.png",
  stripe: "shopify.png",
};

export const wrapWithSchema = (
  liquidContent: string,
  schema: Record<string, unknown>
): string => {
  return `${liquidContent}

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
};

export const cssAssetTag = (): string => {
  return `{{ 'dw-base.css' | asset_url | stylesheet_tag }}`;
};

export const sectionComment = (name: string): string => {
  return `{%- comment -%} Dropwiz ${name} Section {%- endcomment -%}`;
};
