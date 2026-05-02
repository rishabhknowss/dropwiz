CREATE TYPE "public"."page_type" AS ENUM('product', 'landing', 'about', 'faq', 'gallery', 'blog');--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "pages" jsonb DEFAULT '[]'::jsonb NOT NULL;