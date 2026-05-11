import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const usersTable = {
  id: "id",
  email: "email",
  imageCredits: "image_credits",
};

async function main() {
  const email = process.argv[2];
  const credits = parseInt(process.argv[3] ?? "100", 10);

  if (!email) {
    console.error("Usage: pnpm tsx scripts/add-credits.ts <email> [credits]");
    console.error("Example: pnpm tsx scripts/add-credits.ts user@example.com 100");
    process.exit(1);
  }

  const rawUrl = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("✗ DATABASE_URL or DATABASE_MIGRATION_URL must be set");
    process.exit(1);
  }

  const url = rawUrl.replace("-pooler.", ".");
  const host = url.match(/@([^/?]+)/)?.[1] ?? "unknown";
  console.log(`→ connecting to ${host}`);

  const client = postgres(url, {
    max: 1,
    ssl: "require",
    connect_timeout: 30,
    idle_timeout: 20,
  });

  try {
    const result = await client`
      UPDATE users
      SET image_credits = image_credits + ${credits},
          updated_at = NOW()
      WHERE email = ${email}
      RETURNING id, email, image_credits as credits
    `;

    if (result.length === 0) {
      console.error(`✗ User with email "${email}" not found`);
      process.exit(1);
    }

    const user = result[0];
    console.log(`✓ Added ${credits} credits to ${email}`);
    console.log(`  New balance: ${user.credits} credits`);
  } catch (err) {
    console.error("✗ Failed to add credits:");
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
