import { router } from "../trpc";
import { authRouter } from "./auth";
import { billingRouter } from "./billing";
import { storesRouter } from "./stores";
import { adsRouter } from "./ads";
import { shopifyRouter } from "./shopify";
import { scrapeRouter } from "./scrape";
import { analyticsRouter } from "./analytics";

export const appRouter = router({
  auth: authRouter,
  billing: billingRouter,
  stores: storesRouter,
  ads: adsRouter,
  shopify: shopifyRouter,
  scrape: scrapeRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
