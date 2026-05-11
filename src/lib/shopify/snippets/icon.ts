import * as HugeIcons from "@hugeicons/core-free-icons";

type IconPathData = [string, Record<string, string>][];

const ICON_NAME_MAP: Record<string, string> = {
  Truck01Icon: "TruckDeliveryIcon",
  Lock01Icon: "LockIcon",
  ShieldCheckIcon: "SecurityCheckIcon",
  ShieldUserIcon: "UserShieldIcon",
  CheckmarkCircle01Icon: "CheckmarkCircle02Icon",
  CheckmarkSquare01Icon: "CheckmarkSquare02Icon",
  CheckmarkBadge01Icon: "CheckmarkBadge02Icon",
  Clock01Icon: "Clock02Icon",
  Time01Icon: "Time02Icon",
  Home01Icon: "Home02Icon",
  Store01Icon: "Store02Icon",
  Building01Icon: "Building02Icon",
};

const iconDataToSvg = (iconData: IconPathData): string => {
  const paths = iconData
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}></${tag}>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor">${paths}</svg>`;
};

const COMMON_ICONS = [
  "TruckDeliveryIcon",
  "LockIcon",
  "SecurityCheckIcon",
  "CheckmarkCircle02Icon",
  "StarIcon",
  "HeartIcon",
  "ShoppingCartAdd01Icon",
  "CreditCardIcon",
  "RefreshIcon",
  "ShieldCheckIcon",
  "TimeHalfPassIcon",
  "PackageIcon",
  "AwardIcon",
  "ThumbsUpIcon",
  "MessageQuestionIcon",
  "CustomerServiceIcon",
  "GiftIcon",
  "PercentIcon",
  "FlashIcon",
  "LeafIcon",
];

const generateIconSvgMap = (): Record<string, string> => {
  const map: Record<string, string> = {};

  for (const iconName of COMMON_ICONS) {
    const iconData = (HugeIcons as Record<string, IconPathData>)[iconName];
    if (iconData && Array.isArray(iconData)) {
      map[iconName] = iconDataToSvg(iconData);
    }
  }

  for (const [alias, canonical] of Object.entries(ICON_NAME_MAP)) {
    const iconData = (HugeIcons as Record<string, IconPathData>)[canonical];
    if (iconData && Array.isArray(iconData)) {
      map[alias] = iconDataToSvg(iconData);
    }
  }

  return map;
};

export const generateIconSnippet = (): string => {
  const iconMap = generateIconSvgMap();

  let caseStatements = "";
  for (const [name, svg] of Object.entries(iconMap)) {
    caseStatements += `  {% when '${name}' %}\n    ${svg}\n`;
  }

  return `{%- comment -%}
  Dropwiz Icon Snippet
  Usage: {% render 'dw-icon', icon: 'TruckDeliveryIcon' %}
{%- endcomment -%}

{%- case icon -%}
${caseStatements}  {% else %}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
    </svg>
{%- endcase -%}`;
};
