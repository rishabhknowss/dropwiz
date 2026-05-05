const ALLOWED_DOMAINS = [
  "amazon.com",
  "amazon.co.uk",
  "amazon.de",
  "amazon.fr",
  "amazon.ca",
  "amazon.com.au",
  "aliexpress.com",
  "aliexpress.ru",
  "etsy.com",
  "shopify.com",
  "myshopify.com",
  "ebay.com",
  "ebay.co.uk",
  "tiktok.com",
  "walmart.com",
  "target.com",
];

const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /\.local$/i,
  /\.internal$/i,
  /\.localhost$/i,
];

export type UrlValidationResult = {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
};

export const validateProductUrl = (input: string): UrlValidationResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, error: "URL is required" };
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return { valid: false, error: "URL must start with http:// or https://" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
  }

  const hostname = parsed.hostname.toLowerCase();

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: "This URL is not allowed" };
    }
  }

  const isAllowedDomain = ALLOWED_DOMAINS.some((domain) => {
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });

  if (!isAllowedDomain) {
    return {
      valid: true,
      normalizedUrl: parsed.href,
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.href,
  };
};

export const isValidProductUrl = (input: string): boolean => {
  return validateProductUrl(input).valid;
};
