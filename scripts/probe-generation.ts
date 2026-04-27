import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function main() {
  const { db } = await import("../src/db");
  const { stores, generations, assets } = await import("../src/db/schema");
  const {
    generateHero,
    generateBundles,
    generateFaq,
    generateHooks,
  } = await import("../src/lib/ai/prompts");
  const { generateImage } = await import("../src/lib/ai/wavespeed");

  const slug = `probe-${nanoid(8).toLowerCase()}`;
  const [store] = await db
    .insert(stores)
    .values({
      slug,
      status: "draft",
      themeTokens: {},
      sections: [],
      copy: {},
      currency: "USD",
      targetLanguage: "en",
    })
    .returning();

  console.log(`→ probe store: ${store.id} (${slug})`);

  const productCtx = {
    product: {
      title: "Posture Brace — Memory Foam",
      description:
        "Soft-touch posture corrector. 4-step memory training. Trains upper back in 14 days.",
      priceCents: 4900,
      currency: "USD",
      originalImages: [],
    },
    targeting: {
      persona: "Desk worker, back pain",
      angle: "Fix slouch in 14 days",
      targetLanguage: "en",
    },
    storeId: store.id,
    userId: null,
  };

  let claudeOk = true;
  let wavespeedOk = true;

  try {
    console.log("\n→ [1/5] Claude: hero");
    const hero = await generateHero(productCtx);
    console.log(`  headline: ${hero.headline}`);
    console.log(`  primaryCta: ${hero.primaryCta}`);

    console.log("\n→ [2/5] Claude: bundles");
    const bundles = await generateBundles(productCtx);
    console.log(`  ${bundles.bundles.length} bundles generated`);
    for (const b of bundles.bundles) {
      console.log(`    - ${b.name} × ${b.quantity} (-${b.discountPercent}%) ${b.recommended ? "⭐" : ""}`);
    }

    console.log("\n→ [3/5] Claude: faq");
    const faq = await generateFaq(productCtx);
    console.log(`  ${faq.faqs.length} FAQs generated`);
    console.log(`  q1: ${faq.faqs[0]?.question}`);

    console.log("\n→ [4/5] Claude: hooks");
    const hooks = await generateHooks(productCtx);
    console.log(`  ${hooks.hooks.length} hooks generated`);
    console.log(`  h1 [${hooks.hooks[0]?.style}]: ${hooks.hooks[0]?.text}`);
  } catch (err) {
    claudeOk = false;
    console.error("\n✗ Claude generation failed:", err instanceof Error ? err.message : err);
  }

  try {
    console.log("\n→ [5/5] Wavespeed: hero image (FLUX Schnell)");
    const img = await generateImage({
      model: "flux_schnell",
      prompt:
        "Studio product shot of a memory foam posture brace on a cream background, editorial premium photography, centered, no text",
      width: 1024,
      height: 1024,
      numImages: 1,
      storeId: store.id,
      kind: "hero",
    });
    console.log(`  asset id: ${img.assets[0]?.id}`);
    console.log(`  r2 key:   ${img.assets[0]?.r2Key}`);
    console.log(`  url:      ${img.assets[0]?.publicUrl}`);
    console.log(`  cost:     $${img.costUsd.toFixed(4)} | ${img.latencyMs}ms`);
  } catch (err) {
    wavespeedOk = false;
    console.error("\n✗ Wavespeed failed:", err instanceof Error ? err.message : err);
  }

  console.log("\n→ generations logged:");
  const gens = await db
    .select({
      kind: generations.kind,
      model: generations.model,
      costUsd: generations.costUsd,
      latencyMs: generations.latencyMs,
      success: generations.success,
    })
    .from(generations)
    .where(eq(generations.storeId, store.id));
  let totalCost = 0;
  for (const g of gens) {
    const cost = Number(g.costUsd);
    totalCost += cost;
    console.log(
      `  ${g.success ? "✓" : "✗"} ${g.kind.padEnd(8)} ${g.model.padEnd(32)} $${cost.toFixed(6)}  ${g.latencyMs}ms`,
    );
  }
  console.log(`\n→ total cost: $${totalCost.toFixed(6)}`);
  console.log(`→ claude: ${claudeOk ? "✓" : "✗"}   wavespeed: ${wavespeedOk ? "✓" : "✗"}`);

  await db.delete(assets).where(eq(assets.storeId, store.id));
  await db.delete(stores).where(eq(stores.id, store.id));
  console.log("→ cleaned up probe store + assets\n");

  if (!claudeOk || !wavespeedOk) process.exit(1);
}

main().catch((err) => {
  console.error("✗ probe crashed:", err);
  process.exit(1);
});
