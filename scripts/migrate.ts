import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const rawUrl = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("✗ DATABASE_URL or DATABASE_MIGRATION_URL must be set");
    process.exit(1);
  }

  const url = rawUrl.replace("-pooler.", ".");
  const host = url.match(/@([^/?]+)/)?.[1] ?? "unknown";
  console.log(`→ migrating against ${host}`);

  const client = postgres(url, {
    max: 1,
    ssl: "require",
    connect_timeout: 30,
    idle_timeout: 20,
  });

  const db = drizzle(client);

  try {
    console.log("→ applying migrations from ./drizzle");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✓ migrations applied");
  } catch (err) {
    console.error("✗ migration failed:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
