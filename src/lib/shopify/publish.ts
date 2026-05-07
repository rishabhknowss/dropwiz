import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stores, accounts, type Store } from "@/db/schema";
import { env } from "@/env";
import { shopifyGraphql } from "./client";
import { buildThemeFiles } from "./theme-export";
import { pushDropwizTheme } from "./theme-push";

type ProductNode = {
  id: string;
  handle: string;
  onlineStoreUrl: string | null;
  variants: { nodes: Array<{ id: string }> };
};

type ProductCreateResponse = {
  productCreate: {
    product: ProductNode;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};
type ProductUpdateResponse = {
  productUpdate: {
    product: ProductNode;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};
type VariantsBulkUpdateResponse = {
  productVariantsBulkUpdate: {
    productVariants: Array<{ id: string; price: string }>;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};
type MetafieldsSetResponse = {
  metafieldsSet: {
    metafields: Array<{ id: string; key: string; namespace: string }>;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

const PRODUCT_CREATE_MUTATION = `
  mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
    productCreate(product: $product, media: $media) {
      product {
        id
        handle
        onlineStoreUrl
        variants(first: 1) { nodes { id } }
      }
      userErrors { field message }
    }
  }
`;

const PRODUCT_UPDATE_MUTATION = `
  mutation productUpdate($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        id
        handle
        onlineStoreUrl
        variants(first: 1) { nodes { id } }
      }
      userErrors { field message }
    }
  }
`;

const VARIANTS_BULK_UPDATE_MUTATION = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }
`;

const METAFIELDS_SET_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id key namespace }
      userErrors { field message }
    }
  }
`;

const PUBLICATIONS_QUERY = `
  query publications {
    publications(first: 50) {
      nodes {
        id
        name
        catalog { title }
        app { handle title }
      }
    }
  }
`;

const PUBLISHABLE_PUBLISH_MUTATION = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`;

const METAFIELD_DEFINITION_CREATE_MUTATION = `
  mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id key namespace }
      userErrors { field message code }
    }
  }
`;

export type PublishOptions = {
  withTheme?: boolean;
};

export type PublishResult = {
  productUrl: string;
  productAdminUrl: string;
  productId: string;
  shopDomain: string;
  themeEditorUrl: string;
  themeId?: number;
  themeCreated?: boolean;
};

const log = (event: string, data: Record<string, unknown> = {}) => {
  const ts = new Date().toISOString();
  console.log(`[shopify-publish ${ts}] ${event}`, JSON.stringify(data));
};

const since = (start: number) => `${Date.now() - start}ms`;

export async function publishStoreToShopify(
  storeId: string,
  userId: string,
  options: PublishOptions = {},
): Promise<PublishResult> {
  const t0 = Date.now();
  log("start", { storeId, userId, options });

  const rows = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);
  const store = rows[0];
  if (!store) throw new Error("Store not found");
  if (store.userId !== userId) throw new Error("Forbidden");

  const defaultPage = store.pages.find((p) => p.isDefault) ?? store.pages[0];
  const sectionsForPublish = defaultPage?.sections ?? store.sections;

  log("store.loaded", {
    storeId: store.id,
    name: store.name,
    sectionsCount: sectionsForPublish.length,
    sectionTypes: sectionsForPublish.map((s) => s.type),
    hasPages: store.pages.length > 0,
    persona: store.persona,
    angle: store.angle,
    publishedShopifyProductId: store.publishedShopifyProductId,
  });

  const accountRows = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId))
    .limit(10);
  const shopify = accountRows.find((a) => a.provider === "shopify");
  if (!shopify || !shopify.accessToken) {
    throw new Error("Shopify not connected. Install the app first.");
  }
  const shopDomain = shopify.providerAccountId;
  log("shopify.connection", {
    shopDomain,
    scope: shopify.scope,
    hasAccessToken: !!shopify.accessToken,
  });

  const { title, descriptionHtml, priceText, images } = buildProductInput(store);
  log("product.input", {
    title,
    descriptionHtmlLength: descriptionHtml.length,
    priceText,
    imageCount: images.length,
    images,
  });

  let themeId: number | undefined;
  let themeCreated = false;
  if (options.withTheme) {
    log("theme.push.start", { storeId });
    const files = buildThemeFiles(store);
    const pushed = await pushDropwizTheme({
      shop: shopDomain,
      accessToken: shopify.accessToken,
      storeId: store.id,
      storeName: store.name ?? "Dropwiz store",
      files,
    });
    themeId = pushed.themeId;
    themeCreated = pushed.created;
    log("theme.push.done", { themeId, themeCreated, fileCount: files.length });
  }

  const existingProductId =
    store.publishedShopifyShop === shopDomain
      ? store.publishedShopifyProductId
      : null;

  const baseProductFields = {
    title,
    descriptionHtml,
    vendor: "Dropwiz",
    productType: "Dropwiz generated",
    ...(options.withTheme ? { templateSuffix: "dropwiz" } : {}),
  };

  let product: ProductNode;

  if (existingProductId) {
    log("product.update.start", { productId: existingProductId, title });
    const tStep = Date.now();
    const updateData = await shopifyGraphql<ProductUpdateResponse>(
      shopDomain,
      shopify.accessToken,
      PRODUCT_UPDATE_MUTATION,
      {
        product: { id: existingProductId, ...baseProductFields },
      },
    );
    if (updateData.productUpdate.userErrors.length > 0) {
      log("product.update.rejected", {
        errors: updateData.productUpdate.userErrors,
      });
      throw new Error(
        `Shopify rejected update: ${updateData.productUpdate.userErrors
          .map((e) => e.message)
          .join(", ")}`,
      );
    }
    product = updateData.productUpdate.product;
    log("product.update.done", {
      productId: product.id,
      handle: product.handle,
      onlineStoreUrl: product.onlineStoreUrl,
      took: since(tStep),
    });
  } else {
    log("product.create.start", { title, imageCount: images.length });
    const tStep = Date.now();
    const createData = await shopifyGraphql<ProductCreateResponse>(
      shopDomain,
      shopify.accessToken,
      PRODUCT_CREATE_MUTATION,
      {
        product: { ...baseProductFields, status: "ACTIVE" },
        media: images.map((url) => ({
          mediaContentType: "IMAGE",
          originalSource: url,
        })),
      },
    );
    if (createData.productCreate.userErrors.length > 0) {
      log("product.create.rejected", {
        errors: createData.productCreate.userErrors,
      });
      throw new Error(
        `Shopify rejected product: ${createData.productCreate.userErrors
          .map((e) => e.message)
          .join(", ")}`,
      );
    }
    product = createData.productCreate.product;
    log("product.create.done", {
      productId: product.id,
      handle: product.handle,
      onlineStoreUrl: product.onlineStoreUrl,
      took: since(tStep),
    });
  }

  const defaultVariantId = product.variants.nodes[0]?.id;
  if (defaultVariantId) {
    log("variant.update.start", { variantId: defaultVariantId, priceText });
    const tStep = Date.now();
    const variantData = await shopifyGraphql<VariantsBulkUpdateResponse>(
      shopDomain,
      shopify.accessToken,
      VARIANTS_BULK_UPDATE_MUTATION,
      {
        productId: product.id,
        variants: [{ id: defaultVariantId, price: priceText }],
      },
    );
    if (variantData.productVariantsBulkUpdate.userErrors.length > 0) {
      log("variant.update.rejected", {
        errors: variantData.productVariantsBulkUpdate.userErrors,
      });
      throw new Error(
        `Shopify rejected variant price: ${variantData.productVariantsBulkUpdate.userErrors
          .map((e) => e.message)
          .join(", ")}`,
      );
    }
    log("variant.update.done", { took: since(tStep) });
  }

  await ensureDropwizMetafieldDefinitions(shopDomain, shopify.accessToken);

  await writeDropwizMetafields(
    shopDomain,
    shopify.accessToken,
    product.id,
    store,
  );

  await publishToOnlineStore(shopDomain, shopify.accessToken, product.id);

  const numericProductId = product.id.split("/").pop();
  const productAdminUrl = `https://${shopDomain}/admin/products/${numericProductId}`;
  const productUrl = product.onlineStoreUrl ?? productAdminUrl;
  const apiKey = env.SHOPIFY_API_KEY;
  const themeEditorUrl = apiKey
    ? `https://${shopDomain}/admin/themes/current/editor` +
      `?previewPath=${encodeURIComponent(`/products/${product.handle}`)}` +
      `&template=product` +
      `&addAppBlockId=${apiKey}/dropwiz-product-page` +
      `&target=mainSection`
    : `https://${shopDomain}/admin/themes/current/editor` +
      `?previewPath=${encodeURIComponent(`/products/${product.handle}`)}` +
      `&template=product` +
      `&context=apps`;

  await db
    .update(stores)
    .set({
      status: "published",
      publishedShopifyShop: shopDomain,
      publishedShopifyProductId: product.id,
      publishedShopifyUrl: productUrl,
      lastPublishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId));

  log("complete", {
    storeId,
    shopDomain,
    productId: product.id,
    productHandle: product.handle,
    productUrl,
    productAdminUrl,
    themeEditorUrl,
    themeId,
    themeCreated,
    totalTook: since(t0),
  });

  return {
    productUrl,
    productAdminUrl,
    productId: product.id,
    shopDomain,
    themeEditorUrl,
    themeId,
    themeCreated,
  };
}

type CopyShape = {
  hero?: { headline?: string; subheadline?: string };
  bundles?: { bundles?: Array<{ name: string; description: string }> };
  faq?: { faqs?: Array<{ question: string; answer: string }> };
};

function buildProductInput(store: Store): {
  title: string;
  descriptionHtml: string;
  priceText: string;
  images: string[];
} {
  const copy = (store.copy ?? {}) as CopyShape;
  const productSection = store.sections.find((s) => s.type === "product");
  const data = (productSection?.data ?? {}) as {
    priceCents?: number;
    currency?: string;
    imageUrl?: string;
  };

  const priceCents = data.priceCents ?? 4900;
  const priceText = (priceCents / 100).toFixed(2);

  const bullets =
    copy.bundles?.bundles?.map((b) => `<li>${escapeHtml(b.description)}</li>`).join("") ??
    "";
  const faqHtml =
    copy.faq?.faqs
      ?.map(
        (f) =>
          `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`,
      )
      .join("") ?? "";

  const descriptionHtml = [
    copy.hero?.headline
      ? `<h2>${escapeHtml(copy.hero.headline)}</h2>`
      : "",
    copy.hero?.subheadline
      ? `<p>${escapeHtml(copy.hero.subheadline)}</p>`
      : "",
    bullets ? `<ul>${bullets}</ul>` : "",
    faqHtml,
  ]
    .filter(Boolean)
    .join("\n");

  const heroImage = store.sections.find((s) => s.type === "hero")?.data as
    | { imageUrl?: string }
    | undefined;
  const images = [data.imageUrl, heroImage?.imageUrl].filter(
    (u): u is string => !!u,
  );

  return {
    title: store.name ?? "Product",
    descriptionHtml,
    priceText,
    images,
  };
}

type MetafieldDefinitionCreateResponse = {
  metafieldDefinitionCreate: {
    createdDefinition: { id: string; key: string; namespace: string } | null;
    userErrors: Array<{ field: string[] | null; message: string; code: string }>;
  };
};

const DROPWIZ_METAFIELD_KEYS: Array<{ key: string; name: string }> = [
  { key: "layout", name: "Dropwiz layout" },
  { key: "theme_tokens", name: "Dropwiz theme tokens" },
  { key: "pages", name: "Dropwiz pages" },
  { key: "announcement", name: "Dropwiz announcement" },
  { key: "header", name: "Dropwiz header" },
  { key: "hero", name: "Dropwiz hero" },
  { key: "product", name: "Dropwiz product" },
  { key: "bundles", name: "Dropwiz bundles" },
  { key: "trust", name: "Dropwiz trust badges" },
  { key: "faq", name: "Dropwiz FAQ" },
  { key: "lifestyle", name: "Dropwiz lifestyle" },
  { key: "gallery", name: "Dropwiz gallery" },
  { key: "testimonials", name: "Dropwiz testimonials" },
  { key: "value_props", name: "Dropwiz value props" },
  { key: "footer", name: "Dropwiz footer" },
];

const definitionCache = new Set<string>();

async function ensureDropwizMetafieldDefinitions(
  shopDomain: string,
  accessToken: string,
): Promise<void> {
  if (definitionCache.has(shopDomain)) {
    log("metafieldDefinitions.cached", { shopDomain });
    return;
  }
  log("metafieldDefinitions.start", {
    shopDomain,
    keys: DROPWIZ_METAFIELD_KEYS.map((k) => k.key),
  });
  const tStep = Date.now();

  let created = 0;
  let alreadyExists = 0;
  let failed = 0;

  await Promise.all(
    DROPWIZ_METAFIELD_KEYS.map(async ({ key, name }) => {
      try {
        const result = await shopifyGraphql<MetafieldDefinitionCreateResponse>(
          shopDomain,
          accessToken,
          METAFIELD_DEFINITION_CREATE_MUTATION,
          {
            definition: {
              namespace: "dropwiz",
              key,
              name,
              type: "json",
              ownerType: "PRODUCT",
            },
          },
        );
        const errors = result.metafieldDefinitionCreate.userErrors;
        const taken = errors.find((e) => e.code === "TAKEN");
        const blocking = errors.filter((e) => e.code !== "TAKEN");
        if (blocking.length > 0) {
          failed += 1;
          log("metafieldDefinitions.error", { key, errors: blocking });
        } else if (taken) {
          alreadyExists += 1;
        } else {
          created += 1;
        }
      } catch (err) {
        failed += 1;
        log("metafieldDefinitions.threw", {
          key,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }),
  );

  log("metafieldDefinitions.done", {
    created,
    alreadyExists,
    failed,
    took: since(tStep),
  });
  definitionCache.add(shopDomain);
}

type PublicationNode = {
  id: string;
  name: string | null;
  catalog: { title: string } | null;
  app: { handle: string | null; title: string | null } | null;
};
type PublicationsResponse = {
  publications: { nodes: PublicationNode[] };
};
type PublishablePublishResponse = {
  publishablePublish: {
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

function findOnlineStorePublication(
  nodes: PublicationNode[],
): PublicationNode | undefined {
  return (
    nodes.find((p) => p.app?.handle === "online_store") ??
    nodes.find((p) => p.name === "Online Store") ??
    nodes.find((p) => p.catalog?.title === "Online Store") ??
    nodes.find((p) => p.app?.title === "Online Store")
  );
}

async function publishToOnlineStore(
  shopDomain: string,
  accessToken: string,
  productGid: string,
): Promise<void> {
  log("publishToChannel.start", { productGid });
  const tStep = Date.now();
  const pubs = await shopifyGraphql<PublicationsResponse>(
    shopDomain,
    accessToken,
    PUBLICATIONS_QUERY,
    {},
  );
  log("publishToChannel.publications", {
    count: pubs.publications.nodes.length,
    publications: pubs.publications.nodes.map((p) => ({
      name: p.name,
      app: p.app?.handle ?? p.app?.title,
      catalog: p.catalog?.title,
    })),
  });
  const onlineStore = findOnlineStorePublication(pubs.publications.nodes);
  if (!onlineStore) {
    const summary = pubs.publications.nodes
      .map(
        (p) =>
          `{name=${p.name} catalog=${p.catalog?.title} app=${p.app?.handle ?? p.app?.title}}`,
      )
      .join(", ");
    log("publishToChannel.notFound", { summary });
    throw new Error(
      `Online Store publication not found. App may be missing read_publications scope. Got: ${summary || "(empty)"}`,
    );
  }
  log("publishToChannel.matched", { publicationId: onlineStore.id });
  const result = await shopifyGraphql<PublishablePublishResponse>(
    shopDomain,
    accessToken,
    PUBLISHABLE_PUBLISH_MUTATION,
    {
      id: productGid,
      input: [{ publicationId: onlineStore.id }],
    },
  );
  if (result.publishablePublish.userErrors.length > 0) {
    log("publishToChannel.rejected", {
      errors: result.publishablePublish.userErrors,
    });
    throw new Error(
      `Shopify rejected publish to Online Store: ${result.publishablePublish.userErrors
        .map((e) => `${e.field?.join(".")}: ${e.message}`)
        .join(", ")}`,
    );
  }
  log("publishToChannel.done", { took: since(tStep) });
}

async function writeDropwizMetafields(
  shopDomain: string,
  accessToken: string,
  productGid: string,
  store: Store,
): Promise<void> {
  const pages = store.pages ?? [];
  const hasPages = pages.length > 0;

  const sectionsToUse = hasPages
    ? pages.find((p) => p.isDefault)?.sections ?? store.sections
    : store.sections;

  const sectionsByType = new Map<string, unknown>();
  for (const section of sectionsToUse) {
    if (!sectionsByType.has(section.type)) {
      sectionsByType.set(section.type, section.data);
    }
  }

  const layout = sectionsToUse
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => s.type);

  const tokens = (store.themeTokens ?? {}) as {
    colors?: { primary?: string; accent?: string; background?: string; text?: string };
    radius?: number;
    typography?: { display?: string };
  };

  const themeTokensFlat = {
    primary: tokens.colors?.primary ?? "#0a0a0a",
    accent: tokens.colors?.accent ?? "#fef08a",
    bg: tokens.colors?.background ?? "#ffffff",
    text: tokens.colors?.text ?? "#0a0a0a",
    radius: tokens.radius ? `${tokens.radius}px` : "12px",
    font_display: tokens.typography?.display ?? "inherit",
  };

  const sectionKeyMap: Record<string, string> = {
    valueProps: "value_props",
  };

  const pagesData = pages.map((page) => ({
    id: page.id,
    type: page.type,
    name: page.name,
    slug: page.slug,
    isDefault: page.isDefault,
    order: page.order,
    sections: page.sections.map((s) => ({
      id: s.id,
      type: s.type,
      order: s.order,
      data: s.data,
    })),
  }));

  const metafields = [
    {
      ownerId: productGid,
      namespace: "dropwiz",
      key: "layout",
      type: "json",
      value: JSON.stringify(layout),
    },
    {
      ownerId: productGid,
      namespace: "dropwiz",
      key: "theme_tokens",
      type: "json",
      value: JSON.stringify(themeTokensFlat),
    },
    ...(hasPages
      ? [
          {
            ownerId: productGid,
            namespace: "dropwiz",
            key: "pages",
            type: "json",
            value: JSON.stringify(pagesData),
          },
        ]
      : []),
    ...Array.from(sectionsByType.entries()).map(([type, data]) => ({
      ownerId: productGid,
      namespace: "dropwiz",
      key: sectionKeyMap[type] ?? type,
      type: "json",
      value: JSON.stringify(data ?? {}),
    })),
  ];

  log("metafields.write.start", {
    productGid,
    count: metafields.length,
    keys: metafields.map((m) => m.key),
    layoutOrder: layout,
    bytesPerKey: metafields.reduce<Record<string, number>>((acc, m) => {
      acc[m.key] = m.value.length;
      return acc;
    }, {}),
    totalBytes: metafields.reduce((sum, m) => sum + m.value.length, 0),
  });
  const tStep = Date.now();
  const result = await shopifyGraphql<MetafieldsSetResponse>(
    shopDomain,
    accessToken,
    METAFIELDS_SET_MUTATION,
    { metafields },
  );

  if (result.metafieldsSet.userErrors.length > 0) {
    log("metafields.write.rejected", {
      errors: result.metafieldsSet.userErrors,
    });
    throw new Error(
      `Shopify rejected metafields: ${result.metafieldsSet.userErrors
        .map((e) => `${e.field?.join(".")}: ${e.message}`)
        .join(", ")}`,
    );
  }
  log("metafields.write.done", {
    written: result.metafieldsSet.metafields.length,
    took: since(tStep),
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
