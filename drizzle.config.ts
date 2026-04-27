import { defineConfig } from "drizzle-kit";

const rawUrl =
  process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL ?? "";
const url = rawUrl.replace("-pooler.", ".");

if (!url) {
  throw new Error(
    "Set DATABASE_URL (or DATABASE_MIGRATION_URL) before running drizzle-kit.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
