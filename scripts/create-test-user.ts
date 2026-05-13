import { config } from "dotenv";
config({ path: ".env.production" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { pgTable, uuid, varchar, timestamp, integer, text, pgEnum } from "drizzle-orm/pg-core";

const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "starter",
  "pro",
  "agency",
  "enterprise",
]);

const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull(),
  normalizedEmail: varchar("normalized_email", { length: 320 }).notNull(),
  passwordHash: text("password_hash"),
  name: varchar("name", { length: 200 }),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  tier: subscriptionTierEnum("tier").notNull().default("free"),
  imageCredits: integer("image_credits").notNull().default(10),
});

const TEST_EMAIL = "test@dropwiz.ai";
const TEST_PASSWORD = "shopify@2026";

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client);

  const normalizedEmail = TEST_EMAIL.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  const { eq } = await import("drizzle-orm");

  const existing = await db.select().from(users).where(eq(users.normalizedEmail, normalizedEmail));

  let user;
  if (existing.length > 0) {
    const [updated] = await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.normalizedEmail, normalizedEmail))
      .returning();
    user = updated;
    console.log("\n✓ Password updated for existing user!");
  } else {
    const [created] = await db
      .insert(users)
      .values({
        email: TEST_EMAIL,
        normalizedEmail,
        passwordHash,
        name: "Shopify Reviewer",
        emailVerified: new Date(),
        tier: "pro",
        imageCredits: 100,
      })
      .returning();
    user = created;
    console.log("\n✓ Test user created successfully!");
  }

  console.log("Email:", TEST_EMAIL);
  console.log("Password:", TEST_PASSWORD);
  console.log("");

  await client.end();
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
