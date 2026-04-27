import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { generations, stores, assets, products } from "@/db/schema";
import { generateHooks } from "@/lib/ai/prompts";
import { generateAdImage } from "@/lib/ai/wavespeed";
import { composeAdPrompt } from "@/lib/ai/ad-prompt";
import { resolveProductImageUrl } from "@/lib/ai/product-image";
import { protectedProcedure, router } from "../trpc";

export const adsRouter = router({
  generateHooks: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      if (!store.productId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Store product not yet scraped",
        });
      }

      const productRows = await db
        .select()
        .from(products)
        .where(eq(products.id, store.productId))
        .limit(1);
      const product = productRows[0];
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      const hooks = await generateHooks({
        product: {
          title: product.title ?? "Product",
          description: product.description ?? "",
          priceCents: product.priceCents ?? 4900,
          currency: product.currency ?? "USD",
          originalImages: (product.originalImages as string[]) ?? [],
        },
        targeting: {
          persona: store.persona ?? "general consumer",
          angle: store.angle ?? "transformation",
          targetLanguage: store.targetLanguage,
        },
        storeId: store.id,
        userId: ctx.user.id,
      });

      return { hooks: hooks.hooks };
    }),

  listAssets: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        kind: z.enum(["hero", "lifestyle", "product", "logo", "ad"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const storeRows = await db
        .select({ id: stores.id })
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      if (!storeRows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const whereClause = input.kind
        ? and(eq(assets.storeId, input.storeId), eq(assets.kind, input.kind))
        : eq(assets.storeId, input.storeId);

      return db
        .select({
          id: assets.id,
          kind: assets.kind,
          r2Key: assets.r2Key,
          width: assets.width,
          height: assets.height,
          prompt: assets.prompt,
          createdAt: assets.createdAt,
        })
        .from(assets)
        .where(whereClause)
        .orderBy(desc(assets.createdAt));
    }),

  generateStaticAd: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        format: z.enum(["square", "feed", "story", "landscape", "wide"]),
        tone: z
          .enum(["bold", "minimal", "premium", "playful", "editorial"])
          .optional(),
        audience: z.string().max(200).optional(),
        hook: z.string().max(240).optional(),
        customNotes: z.string().max(400).optional(),
        quality: z.enum(["low", "medium", "high"]).optional(),
        resolution: z.enum(["1k", "2k", "4k"]).optional(),
        referenceImageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      const store = rows[0];
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });
      if (!store.productId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Store product not yet scraped",
        });
      }

      const productRows = await db
        .select()
        .from(products)
        .where(eq(products.id, store.productId))
        .limit(1);
      const product = productRows[0];
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      const resolvedReference =
        input.referenceImageUrl ?? resolveProductImageUrl(store, product);

      const { prompt, aspectRatio } = composeAdPrompt({
        store,
        product,
        format: input.format,
        audience: input.audience,
        hook: input.hook,
        tone: input.tone,
        customNotes: input.customNotes,
        hasReferenceImage: !!resolvedReference,
      });

      const result = await generateAdImage({
        prompt,
        aspectRatio,
        quality: input.quality ?? "medium",
        resolution: input.resolution ?? "1k",
        referenceImages: resolvedReference ? [resolvedReference] : undefined,
        storeId: store.id,
        userId: ctx.user.id,
      });

      return {
        assetId: result.assetId,
        imageUrl: result.imageUrl,
        prompt,
        aspectRatio,
        costUsd: result.costUsd,
      };
    }),

  listHookGenerations: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const storeRows = await db
        .select({ id: stores.id })
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      if (!storeRows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      return db
        .select({
          id: generations.id,
          output: generations.output,
          createdAt: generations.createdAt,
          costUsd: generations.costUsd,
        })
        .from(generations)
        .where(and(eq(generations.storeId, input.storeId), eq(generations.kind, "hook")))
        .orderBy(desc(generations.createdAt))
        .limit(10);
    }),
});
