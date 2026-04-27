import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { generateHero, generateBundles, generateFaq, generateHooks } =
    await import("../src/lib/ai/prompts");

  const ctx = {
    product: {
      title: "Posture Brace — Memory Foam with 4-Step Training",
      description:
        "A soft-touch posture corrector brace that trains your upper back over 14 days using a 4-step memory program. Adjustable straps. Machine washable. Backed by 12,000+ reviews.",
      priceCents: 4900,
      currency: "USD",
    },
    targeting: {
      persona: "Desk worker, 35-55, neck / upper-back pain, office-bound",
      angle: "Fix-your-slouch transformation in 14 days",
      targetLanguage: "en",
      targetMarket: "United States",
    },
  };

  console.log("→ hero");
  const hero = await generateHero(ctx);
  console.log(JSON.stringify(hero, null, 2));

  console.log("\n→ bundles");
  const bundles = await generateBundles(ctx);
  console.log(JSON.stringify(bundles, null, 2));

  console.log("\n→ faq (5 of N)");
  const faq = await generateFaq(ctx);
  console.log(JSON.stringify(faq.faqs.slice(0, 5), null, 2));

  console.log("\n→ hooks");
  const hooks = await generateHooks(ctx);
  console.log(JSON.stringify(hooks, null, 2));
}

main().catch((err) => {
  console.error("✗ claude probe failed:", err);
  process.exit(1);
});
