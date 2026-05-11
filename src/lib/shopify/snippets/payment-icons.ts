export const PAYMENT_METHODS = [
  "visa",
  "mastercard",
  "amex",
  "paypal",
  "applepay",
  "googlepay",
] as const;

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

export const generatePaymentIconsSnippet = (): string => {
  return `{%- comment -%}
  Dropwiz Payment Icons Snippet
  Usage: {% render 'dw-payment-icons' %}
{%- endcomment -%}

<div class="dw-payment-badges">
  <div class="dw-payment-badge">
    <img src="{{ 'visa.png' | asset_url }}" alt="Visa" loading="lazy" />
  </div>
  <div class="dw-payment-badge">
    <img src="{{ 'mastercard.png' | asset_url }}" alt="Mastercard" loading="lazy" />
  </div>
  <div class="dw-payment-badge">
    <img src="{{ 'amex.png' | asset_url }}" alt="American Express" loading="lazy" />
  </div>
  <div class="dw-payment-badge">
    <img src="{{ 'paypal.png' | asset_url }}" alt="PayPal" loading="lazy" />
  </div>
  <div class="dw-payment-badge">
    <img src="{{ 'applepay.png' | asset_url }}" alt="Apple Pay" loading="lazy" />
  </div>
  <div class="dw-payment-badge">
    <img src="{{ 'gpay.png' | asset_url }}" alt="Google Pay" loading="lazy" />
  </div>
</div>`;
};
