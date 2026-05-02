DO $$ BEGIN
  CREATE TYPE "public"."page_type" AS ENUM('product', 'landing', 'about', 'faq', 'gallery', 'blog');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "pages" jsonb DEFAULT '[]'::jsonb NOT NULL;