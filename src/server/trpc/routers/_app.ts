import { router } from "../trpc";
import { authRouter } from "./auth";
import { storesRouter } from "./stores";
import { adsRouter } from "./ads";
import { shopifyRouter } from "./shopify";
import { scrapeRouter } from "./scrape";

export const appRouter = router({
  auth: authRouter,
  stores: storesRouter,
  ads: adsRouter,
  shopify: shopifyRouter,
  scrape: scrapeRouter,
});

export type AppRouter = typeof appRouter;
