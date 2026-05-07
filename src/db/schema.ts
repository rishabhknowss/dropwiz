import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  timestamp,
  integer,
  text,
  numeric,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const storeStatusEnum = pgEnum("store_status", [
  "draft",
  "scraping",
  "generating",
  "ready",
  "failed",
  "published",
]);

export const sourcePlatformEnum = pgEnum("source_platform", [
  "aliexpress",
  "amazon",
  "etsy",
  "shopify",
  "tiktok_shop",
  "other",
]);

export const assetKindEnum = pgEnum("asset_kind", [
  "hero",
  "lifestyle",
  "product",
  "logo",
  "screenshot",
  "ad",
]);

export const assetSourceEnum = pgEnum("asset_source", [
  "scraped",
  "generated",
  "uploaded",
]);

export const generationKindEnum = pgEnum("generation_kind", [
  "copy",
  "image",
  "ad",
  "hook",
  "chat",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "starter",
  "pro",
  "agency",
  "enterprise",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "incomplete",
  "paused",
]);

export const billingSourceEnum = pgEnum("billing_source", ["stripe", "shopify"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull(),
    normalizedEmail: varchar("normalized_email", { length: 320 }).notNull(),
    passwordHash: text("password_hash"),
    name: varchar("name", { length: 200 }),
    image: text("image"),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    verificationToken: varchar("verification_token", { length: 128 }),
    verificationTokenExpiresAt: timestamp("verification_token_expires_at", {
      withTimezone: true,
    }),
    resetToken: varchar("reset_token", { length: 128 }),
    resetTokenExpiresAt: timestamp("reset_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenVersion: integer("refresh_token_version").notNull().default(0),
    lastRefreshAt: timestamp("last_refresh_at", { withTimezone: true }),
    tier: subscriptionTierEnum("tier").notNull().default("free"),
    billingSource: billingSourceEnum("billing_source"),
    stripeCustomerId: varchar("stripe_customer_id", { length: 64 }),
    imageCredits: integer("image_credits").notNull().default(5),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_unique").on(t.email),
    uniqueIndex("users_normalized_email_unique").on(t.normalizedEmail),
    index("users_verification_token_idx").on(t.verificationToken),
    index("users_reset_token_idx").on(t.resetToken),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 40 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    scope: text("scope"),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_unique").on(t.provider, t.providerAccountId),
    index("accounts_user_idx").on(t.userId),
  ],
);

export const authEvents = pgTable(
  "auth_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    kind: varchar("kind", { length: 40 }).notNull(),
    email: varchar("email", { length: 320 }),
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),
    success: integer("success").notNull().default(1),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("auth_events_user_idx").on(t.userId),
    index("auth_events_kind_idx").on(t.kind),
    index("auth_events_created_idx").on(t.createdAt.desc()),
    index("auth_events_user_kind_created_idx").on(t.userId, t.kind, t.createdAt.desc()),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceUrl: text("source_url").notNull(),
    sourceUrlHash: varchar("source_url_hash", { length: 64 }).notNull(),
    sourcePlatform: sourcePlatformEnum("source_platform")
      .notNull()
      .default("other"),
    title: text("title"),
    description: text("description"),
    priceCents: integer("price_cents"),
    estCostCents: integer("est_cost_cents"),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    originalImages: jsonb("original_images").$type<string[]>().notNull().default([]),
    variants: jsonb("variants").$type<Record<string, unknown>[]>().default([]),
    rawPayload: jsonb("raw_payload").$type<Record<string, unknown>>(),
    scrapedAt: timestamp("scraped_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("products_source_url_hash_unique").on(t.sourceUrlHash),
    index("products_platform_idx").on(t.sourcePlatform),
  ],
);

export type ThemeTokens = {
  preset?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: { sans?: string; display?: string; mono?: string };
  radius?: number;
  buttons?: { shape?: "sharp" | "rounded" | "pill"; size?: "sm" | "md" | "lg" };
  icons?: string;
};

export type StoreSection = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

export const pageTypeEnum = pgEnum("page_type", [
  "product",
  "landing",
  "about",
  "faq",
  "gallery",
  "blog",
]);

export type StorePage = {
  id: string;
  type: "product" | "landing" | "about" | "faq" | "gallery" | "blog";
  name: string;
  slug: string;
  sections: StoreSection[];
  order: number;
  isDefault: boolean;
};

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 200 }),
    persona: varchar("persona", { length: 80 }),
    angle: varchar("angle", { length: 80 }),
    targetLanguage: varchar("target_language", { length: 10 })
      .notNull()
      .default("en"),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    themeTokens: jsonb("theme_tokens").$type<ThemeTokens>().notNull().default({}),
    sections: jsonb("sections").$type<StoreSection[]>().notNull().default([]),
    pages: jsonb("pages").$type<StorePage[]>().notNull().default([]),
    copy: jsonb("copy").$type<Record<string, unknown>>().notNull().default({}),
    score: integer("score"),
    status: storeStatusEnum("status").notNull().default("draft"),
    failureReason: text("failure_reason"),
    claimToken: varchar("claim_token", { length: 128 }),
    claimTokenExpiresAt: timestamp("claim_token_expires_at", {
      withTimezone: true,
    }),
    screenshotKey: text("screenshot_key"),
    publishedShopifyShop: varchar("published_shopify_shop", { length: 255 }),
    publishedShopifyProductId: varchar("published_shopify_product_id", {
      length: 64,
    }),
    publishedShopifyUrl: text("published_shopify_url"),
    publishedSubdomain: varchar("published_subdomain", { length: 120 }),
    lastPublishedAt: timestamp("last_published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("stores_slug_unique").on(t.slug),
    uniqueIndex("stores_published_subdomain_unique").on(t.publishedSubdomain),
    index("stores_user_idx").on(t.userId),
    index("stores_product_idx").on(t.productId),
    index("stores_status_idx").on(t.status),
    index("stores_claim_token_idx").on(t.claimToken),
    index("stores_created_idx").on(t.createdAt.desc()),
  ],
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    kind: assetKindEnum("kind").notNull(),
    source: assetSourceEnum("source").notNull(),
    r2Key: text("r2_key").notNull(),
    contentType: varchar("content_type", { length: 80 }),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),
    prompt: text("prompt"),
    model: varchar("model", { length: 80 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("assets_store_idx").on(t.storeId),
    index("assets_kind_idx").on(t.kind),
    uniqueIndex("assets_r2_key_unique").on(t.r2Key),
    index("assets_store_kind_idx").on(t.storeId, t.kind),
    index("assets_created_idx").on(t.createdAt.desc()),
  ],
);

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id").references(() => stores.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    kind: generationKindEnum("kind").notNull(),
    model: varchar("model", { length: 80 }).notNull(),
    promptVersion: varchar("prompt_version", { length: 40 }),
    inputHash: varchar("input_hash", { length: 64 }).notNull(),
    input: jsonb("input").$type<Record<string, unknown>>(),
    output: jsonb("output").$type<Record<string, unknown>>(),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    cachedTokens: integer("cached_tokens"),
    costUsd: numeric("cost_usd", { precision: 10, scale: 6 })
      .notNull()
      .default("0"),
    latencyMs: integer("latency_ms"),
    success: integer("success").notNull().default(1),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("generations_store_idx").on(t.storeId),
    index("generations_user_idx").on(t.userId),
    index("generations_kind_idx").on(t.kind),
    index("generations_input_hash_idx").on(t.inputHash),
    index("generations_created_idx").on(t.createdAt.desc()),
    index("generations_store_kind_created_idx").on(t.storeId, t.kind, t.createdAt.desc()),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    billingSource: billingSourceEnum("billing_source").notNull(),
    tier: subscriptionTierEnum("tier").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 64 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }),
    stripePriceId: varchar("stripe_price_id", { length: 64 }),
    shopifyChargeId: varchar("shopify_charge_id", { length: 64 }),
    shopifyShop: varchar("shopify_shop", { length: 255 }),
    interval: varchar("interval", { length: 16 }),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: integer("cancel_at_period_end").notNull().default(0),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("subscriptions_user_idx").on(t.userId),
    index("subscriptions_status_idx").on(t.status),
    uniqueIndex("subscriptions_stripe_sub_unique").on(t.stripeSubscriptionId),
    uniqueIndex("subscriptions_shopify_charge_unique").on(t.shopifyChargeId),
  ],
);

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls?: {
    id: string;
    name: string;
    args: Record<string, unknown>;
    status: "pending" | "applied" | "rejected";
    result?: unknown;
  }[];
  createdAt: string;
};

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messages: jsonb("messages").$type<ChatMessage[]>().notNull().default([]),
    totalCostUsd: numeric("total_cost_usd", { precision: 10, scale: 6 })
      .notNull()
      .default("0"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("ai_conversations_store_idx").on(t.storeId),
    index("ai_conversations_user_idx").on(t.userId),
    uniqueIndex("ai_conversations_store_user_unique").on(t.storeId, t.userId),
  ],
);

export const curatedProducts = pgTable(
  "curated_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    imageUrl: text("image_url").notNull(),
    sourceUrl: text("source_url").notNull(),
    sourcePlatform: sourcePlatformEnum("source_platform")
      .notNull()
      .default("other"),
    niche: varchar("niche", { length: 80 }),
    metric: varchar("metric", { length: 120 }),
    score: integer("score"),
    priceCents: integer("price_cents"),
    estCostCents: integer("est_cost_cents"),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    featured: integer("featured").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("curated_products_niche_idx").on(t.niche),
    index("curated_products_featured_idx").on(t.featured),
    index("curated_products_published_idx").on(t.publishedAt.desc()),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  authEvents: many(authEvents),
  stores: many(stores),
  subscriptions: many(subscriptions),
  generations: many(generations),
  aiConversations: many(aiConversations),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  stores: many(stores),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, { fields: [stores.userId], references: [users.id] }),
  product: one(products, { fields: [stores.productId], references: [products.id] }),
  assets: many(assets),
  generations: many(generations),
  conversations: many(aiConversations),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  store: one(stores, { fields: [assets.storeId], references: [stores.id] }),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  store: one(stores, { fields: [generations.storeId], references: [stores.id] }),
  user: one(users, { fields: [generations.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  store: one(stores, { fields: [aiConversations.storeId], references: [stores.id] }),
  user: one(users, { fields: [aiConversations.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type AuthEvent = typeof authEvents.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type AiConversation = typeof aiConversations.$inferSelect;
export type NewAiConversation = typeof aiConversations.$inferInsert;
export type CuratedProduct = typeof curatedProducts.$inferSelect;
export type NewCuratedProduct = typeof curatedProducts.$inferInsert;
