import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import {
  fetchOrdersForDateRange,
  fetchOrders,
  aggregateMetrics,
  getTopSellingProducts,
  getRevenueTimeSeries,
  getDateRangeFromPreset,
  type Order,
} from "@/lib/shopify/analytics";
import { protectedProcedure, router } from "../trpc";

const getShopAccount = async (userId: string, shopDomain: string) => {
  const rows = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, userId),
        eq(accounts.provider, "shopify"),
        eq(accounts.providerAccountId, shopDomain)
      )
    )
    .limit(1);
  return rows[0] ?? null;
};

const dateRangeSchema = z.enum(["today", "7d", "30d", "90d"]).default("7d");

export const analyticsRouter = router({
  getConnectedShops: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        id: accounts.id,
        shopDomain: accounts.providerAccountId,
        scope: accounts.scope,
        createdAt: accounts.createdAt,
      })
      .from(accounts)
      .where(
        and(eq(accounts.userId, ctx.user.id), eq(accounts.provider, "shopify"))
      );

    return rows.map((r) => ({
      ...r,
      hasOrdersScope: r.scope?.includes("read_orders") ?? false,
    }));
  }),

  getOverview: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        range: dateRangeSchema,
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      if (!account.scope?.includes("read_orders")) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Shop needs to be reconnected with read_orders scope",
        });
      }

      const { startDate, endDate } = getDateRangeFromPreset(input.range);

      const orders = await fetchOrdersForDateRange(
        input.shopDomain,
        account.accessToken,
        startDate,
        endDate
      );

      const metrics = aggregateMetrics(orders);

      const previousStartDate = new Date(
        startDate.getTime() - (endDate.getTime() - startDate.getTime())
      );
      const previousOrders = await fetchOrdersForDateRange(
        input.shopDomain,
        account.accessToken,
        previousStartDate,
        startDate
      );
      const previousMetrics = aggregateMetrics(previousOrders);

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        ...metrics,
        changes: {
          revenue: calculateChange(metrics.totalRevenue, previousMetrics.totalRevenue),
          orders: calculateChange(metrics.orderCount, previousMetrics.orderCount),
          aov: calculateChange(metrics.averageOrderValue, previousMetrics.averageOrderValue),
          customers: calculateChange(metrics.uniqueCustomers, previousMetrics.uniqueCustomers),
        },
      };
    }),

  getRevenueTimeSeries: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        range: dateRangeSchema,
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      if (!account.scope?.includes("read_orders")) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Shop needs to be reconnected with read_orders scope",
        });
      }

      const { startDate, endDate } = getDateRangeFromPreset(input.range);

      const orders = await fetchOrdersForDateRange(
        input.shopDomain,
        account.accessToken,
        startDate,
        endDate
      );

      return getRevenueTimeSeries(orders);
    }),

  getTopProducts: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        range: dateRangeSchema,
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      if (!account.scope?.includes("read_orders")) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Shop needs to be reconnected with read_orders scope",
        });
      }

      const { startDate, endDate } = getDateRangeFromPreset(input.range);

      const orders = await fetchOrdersForDateRange(
        input.shopDomain,
        account.accessToken,
        startDate,
        endDate
      );

      return getTopSellingProducts(orders, input.limit);
    }),

  getRecentOrders: protectedProcedure
    .input(
      z.object({
        shopDomain: z.string().min(4).max(255),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await getShopAccount(ctx.user.id, input.shopDomain);
      if (!account || !account.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Shop not connected" });
      }
      if (!account.scope?.includes("read_orders")) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Shop needs to be reconnected with read_orders scope",
        });
      }

      const result = await fetchOrders(input.shopDomain, account.accessToken, {
        first: input.limit,
      });

      return result.orders;
    }),
});
