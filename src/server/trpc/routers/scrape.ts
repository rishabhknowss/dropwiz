import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { scrapeProduct } from "@/lib/scraper";
import { publicProcedure, router } from "../trpc";

export const scrapeRouter = router({
  preview: publicProcedure
    .input(
      z.object({
        url: z.string().url().max(2048),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const scraped = await scrapeProduct(input.url);

        const rawPayload = scraped.rawPayload as {
          features?: string[];
          reviewCount?: number;
          rating?: number;
          brand?: string;
        } | null;

        return {
          title: scraped.title ?? "Untitled Product",
          description: scraped.description ?? "",
          priceCents: scraped.priceCents ?? 0,
          currency: scraped.currency ?? "USD",
          images: (scraped.originalImages ?? []) as string[],
          sourcePlatform: scraped.sourcePlatform ?? "other",
          features: rawPayload?.features ?? [],
          reviewCount: rawPayload?.reviewCount ?? 0,
          rating: rawPayload?.rating ?? 0,
          brand: rawPayload?.brand ?? "",
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to scrape product";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),
});
