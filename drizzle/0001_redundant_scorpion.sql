CREATE TYPE "public"."asset_kind" AS ENUM('hero', 'lifestyle', 'product', 'logo', 'screenshot', 'ad');--> statement-breakpoint
CREATE TYPE "public"."asset_source" AS ENUM('scraped', 'generated', 'uploaded');--> statement-breakpoint
CREATE TYPE "public"."billing_source" AS ENUM('stripe', 'shopify');--> statement-breakpoint
CREATE TYPE "public"."generation_kind" AS ENUM('copy', 'image', 'ad', 'hook', 'chat');--> statement-breakpoint
CREATE TYPE "public"."source_platform" AS ENUM('aliexpress', 'amazon', 'etsy', 'shopify', 'tiktok_shop', 'other');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('draft', 'scraping', 'generating', 'ready', 'failed', 'published');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'paused');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'starter', 'pro', 'agency', 'enterprise');--> statement-breakpoint
CREATE TABLE "ai_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_cost_usd" numeric(10, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"kind" "asset_kind" NOT NULL,
	"source" "asset_source" NOT NULL,
	"r2_key" text NOT NULL,
	"content_type" varchar(80),
	"width" integer,
	"height" integer,
	"bytes" integer,
	"prompt" text,
	"model" varchar(80),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curated_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"source_url" text NOT NULL,
	"source_platform" "source_platform" DEFAULT 'other' NOT NULL,
	"niche" varchar(80),
	"metric" varchar(120),
	"score" integer,
	"price_cents" integer,
	"est_cost_cents" integer,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"featured" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid,
	"user_id" uuid,
	"kind" "generation_kind" NOT NULL,
	"model" varchar(80) NOT NULL,
	"prompt_version" varchar(40),
	"input_hash" varchar(64) NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"input_tokens" integer,
	"output_tokens" integer,
	"cached_tokens" integer,
	"cost_usd" numeric(10, 6) DEFAULT '0' NOT NULL,
	"latency_ms" integer,
	"success" integer DEFAULT 1 NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_url" text NOT NULL,
	"source_url_hash" varchar(64) NOT NULL,
	"source_platform" "source_platform" DEFAULT 'other' NOT NULL,
	"title" text,
	"description" text,
	"price_cents" integer,
	"est_cost_cents" integer,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"original_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"variants" jsonb DEFAULT '[]'::jsonb,
	"raw_payload" jsonb,
	"scraped_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"product_id" uuid,
	"slug" varchar(80) NOT NULL,
	"name" varchar(200),
	"persona" varchar(80),
	"angle" varchar(80),
	"target_language" varchar(10) DEFAULT 'en' NOT NULL,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"theme_tokens" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"copy" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"score" integer,
	"status" "store_status" DEFAULT 'draft' NOT NULL,
	"failure_reason" text,
	"claim_token" varchar(128),
	"claim_token_expires_at" timestamp with time zone,
	"screenshot_key" text,
	"published_shopify_shop" varchar(255),
	"published_shopify_product_id" varchar(64),
	"published_shopify_url" text,
	"published_subdomain" varchar(120),
	"last_published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"billing_source" "billing_source" NOT NULL,
	"tier" "subscription_tier" NOT NULL,
	"status" "subscription_status" NOT NULL,
	"stripe_customer_id" varchar(64),
	"stripe_subscription_id" varchar(64),
	"stripe_price_id" varchar(64),
	"shopify_charge_id" varchar(64),
	"shopify_shop" varchar(255),
	"interval" varchar(16),
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" integer DEFAULT 0 NOT NULL,
	"canceled_at" timestamp with time zone,
	"trial_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tier" "subscription_tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "billing_source" "billing_source";--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_conversations_store_idx" ON "ai_conversations" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "ai_conversations_user_idx" ON "ai_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_conversations_store_user_unique" ON "ai_conversations" USING btree ("store_id","user_id");--> statement-breakpoint
CREATE INDEX "assets_store_idx" ON "assets" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "assets_kind_idx" ON "assets" USING btree ("kind");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_r2_key_unique" ON "assets" USING btree ("r2_key");--> statement-breakpoint
CREATE INDEX "curated_products_niche_idx" ON "curated_products" USING btree ("niche");--> statement-breakpoint
CREATE INDEX "curated_products_featured_idx" ON "curated_products" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "curated_products_published_idx" ON "curated_products" USING btree ("published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "generations_store_idx" ON "generations" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "generations_user_idx" ON "generations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generations_kind_idx" ON "generations" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "generations_input_hash_idx" ON "generations" USING btree ("input_hash");--> statement-breakpoint
CREATE INDEX "generations_created_idx" ON "generations" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "products_source_url_hash_unique" ON "products" USING btree ("source_url_hash");--> statement-breakpoint
CREATE INDEX "products_platform_idx" ON "products" USING btree ("source_platform");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_slug_unique" ON "stores" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_published_subdomain_unique" ON "stores" USING btree ("published_subdomain");--> statement-breakpoint
CREATE INDEX "stores_user_idx" ON "stores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stores_product_idx" ON "stores" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stores_status_idx" ON "stores" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stores_claim_token_idx" ON "stores" USING btree ("claim_token");--> statement-breakpoint
CREATE INDEX "stores_created_idx" ON "stores" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_stripe_sub_unique" ON "subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_shopify_charge_unique" ON "subscriptions" USING btree ("shopify_charge_id");