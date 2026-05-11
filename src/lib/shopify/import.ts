import { shopifyGraphql } from "./client";

const GET_SHOP_PAYMENT_SETTINGS_QUERY = `
  query GetShopPaymentSettings {
    shop {
      name
      currencyCode
      paymentSettings {
        supportedDigitalWallets
      }
    }
  }
`;

type ShopPaymentSettingsResp = {
  shop: {
    name: string;
    currencyCode: string;
    paymentSettings: {
      supportedDigitalWallets: string[];
    };
  };
};

export type ShopPaymentSettings = {
  shopName: string;
  currencyCode: string;
  supportedDigitalWallets: string[];
  hasPaymentsEnabled: boolean;
};

export async function getShopPaymentSettings(
  shop: string,
  accessToken: string
): Promise<ShopPaymentSettings> {
  const data = await shopifyGraphql<ShopPaymentSettingsResp>(
    shop,
    accessToken,
    GET_SHOP_PAYMENT_SETTINGS_QUERY
  );

  const wallets = data.shop.paymentSettings.supportedDigitalWallets ?? [];

  return {
    shopName: data.shop.name,
    currencyCode: data.shop.currencyCode,
    supportedDigitalWallets: wallets,
    hasPaymentsEnabled: wallets.length > 0,
  };
}

const LIST_PRODUCTS_QUERY = `
  query ListProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query, sortKey: UPDATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          title
          handle
          status
          totalInventory
          featuredImage { url altText }
          priceRangeV2 {
            minVariantPrice { amount currencyCode }
          }
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      descriptionHtml
      vendor
      productType
      tags
      status
      images(first: 8) {
        edges { node { url altText width height } }
      }
      variants(first: 1) {
        edges {
          node {
            id
            title
            sku
            price
            inventoryQuantity
          }
        }
      }
      priceRangeV2 {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
    }
  }
`;

export type ShopifyProductSummary = {
  id: string;
  title: string;
  handle: string;
  status: string;
  totalInventory: number | null;
  imageUrl: string | null;
  priceCents: number;
  currency: string;
  updatedAt: string;
};

export type ShopifyProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: string;
  images: string[];
  priceCents: number;
  currency: string;
  variantId: string | null;
  sku: string | null;
};

type ListResp = {
  products: {
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        title: string;
        handle: string;
        status: string;
        totalInventory: number | null;
        featuredImage: { url: string; altText: string | null } | null;
        priceRangeV2: { minVariantPrice: { amount: string; currencyCode: string } };
        updatedAt: string;
      };
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type DetailResp = {
  product: {
    id: string;
    title: string;
    handle: string;
    descriptionHtml: string;
    vendor: string;
    productType: string;
    tags: string[];
    status: string;
    images: { edges: Array<{ node: { url: string } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          sku: string | null;
          price: string;
          inventoryQuantity: number | null;
        };
      }>;
    };
    priceRangeV2: { minVariantPrice: { amount: string; currencyCode: string } };
  } | null;
};

function toCents(amount: string): number {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function listShopifyProducts(
  shop: string,
  accessToken: string,
  opts: { search?: string; cursor?: string | null; pageSize?: number } = {},
): Promise<{
  products: ShopifyProductSummary[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  const data = await shopifyGraphql<ListResp>(shop, accessToken, LIST_PRODUCTS_QUERY, {
    first: opts.pageSize ?? 24,
    after: opts.cursor ?? null,
    query: opts.search ? `title:*${opts.search}*` : null,
  });
  const products = data.products.edges.map((e) => ({
    id: e.node.id,
    title: e.node.title,
    handle: e.node.handle,
    status: e.node.status,
    totalInventory: e.node.totalInventory,
    imageUrl: e.node.featuredImage?.url ?? null,
    priceCents: toCents(e.node.priceRangeV2.minVariantPrice.amount),
    currency: e.node.priceRangeV2.minVariantPrice.currencyCode,
    updatedAt: e.node.updatedAt,
  }));
  return {
    products,
    nextCursor: data.products.pageInfo.endCursor,
    hasMore: data.products.pageInfo.hasNextPage,
  };
}

export async function getShopifyProduct(
  shop: string,
  accessToken: string,
  productId: string,
): Promise<ShopifyProductDetail | null> {
  const data = await shopifyGraphql<DetailResp>(shop, accessToken, GET_PRODUCT_QUERY, {
    id: productId,
  });
  if (!data.product) return null;
  const variant = data.product.variants.edges[0]?.node ?? null;
  return {
    id: data.product.id,
    title: data.product.title,
    handle: data.product.handle,
    description: stripHtml(data.product.descriptionHtml ?? ""),
    vendor: data.product.vendor,
    productType: data.product.productType,
    tags: data.product.tags,
    status: data.product.status,
    images: data.product.images.edges.map((e) => e.node.url),
    priceCents: toCents(
      variant?.price ?? data.product.priceRangeV2.minVariantPrice.amount,
    ),
    currency: data.product.priceRangeV2.minVariantPrice.currencyCode,
    variantId: variant?.id ?? null,
    sku: variant?.sku ?? null,
  };
}
