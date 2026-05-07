import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { scrapeProduct } from "@/lib/scraper";
import { checkLimits } from "../rate-limit";
import { publicProcedure, router } from "../trpc";

export const scrapeRouter = router({
  preview: publicProcedure
    .input(
      z.object({
        url: z.string().url().max(2048),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rl = await checkLimits([
        { key: `scrape:ip:${ctx.ip}`, limit: 30, windowMs: 60 * 1000 },
      ]);
      if (!rl.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many scrape requests. Please wait a moment.",
        });
      }

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
