import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { accounts, authEvents, stores } from "@/db/schema";
import { publishStoreToShopify } from "@/lib/shopify/publish";
import {
  listShopifyProducts,
  getShopifyProduct,
} from "@/lib/shopify/import";
import { protectedProcedure, router } from "../trpc";

async function getShopAccount(userId: string, shopDomain: string) {
  const rows = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, userId),
        eq(accounts.provider, "shopify"),
        eq(accounts.providerAccountId, shopDomain),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export const shopifyRouter = router({
  listShops: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        id: accounts.id,
        shopDomain: accounts.providerAccountId,
        scope: accounts.scope,
        createdAt: accounts.createdAt,
        updatedAt: accounts.updatedAt,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, ctx.user.id),
          eq(accounts.provider, "shopify"),
        ),
      );
    return rows;
  }),

  disconnectShop: protectedProcedure
    .input(z.object({ shopDomain: z.string().min(4).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, ctx.user.id),
            eq(accounts.provider, "shopify"),
            eq(accounts.providerAccountId, input.shopDomain),
          ),
        )
        .returning({ id: accounts.id });
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });

      await db.insert(authEvents).values({
        userId: ctx.user.id,
        kind: "shopify.disconnected",
        email: ctx.user.email,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        success: 1,
        metadata: JSON.stringify({ shop: input.shopDomain }),
      });

      return { success: true };
    }),

  listProducts: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        search: z.string().max(120).optional(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      try {
        return await listShopifyProducts(input.shopDomain, account.accessToken, {
          search: input.search,
          cursor: input.cursor ?? null,
          pageSize: 24,
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Shopify list failed",
        });
      }
    }),

  getProduct: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        productId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      const product = await getShopifyProduct(
        input.shopDomain,
        account.accessToken,
        input.productId,
      );
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  publishStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string().uuid(),
        withTheme: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const storeRows = await db
        .select()
        .from(stores)
        .where(and(eq(stores.id, input.storeId), eq(stores.userId, ctx.user.id)))
        .limit(1);
      if (!storeRows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      if (storeRows[0].status !== "ready" && storeRows[0].status !== "published") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Store is not ready to publish",
        });
      }

      const shops = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.userId, ctx.user.id),
            eq(accounts.provider, "shopify"),
          ),
        );
      if (shops.length === 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Connect a Shopify shop first",
        });
      }

      try {
        const result = await publishStoreToShopify(input.storeId, ctx.user.id, {
          withTheme: input.withTheme,
        });
        return result;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Publish failed",
        });
      }
    }),
});
