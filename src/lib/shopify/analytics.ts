import { shopifyGraphql } from "./client";

type Money = {
  amount: string;
  currencyCode: string;
};

type OrderLineItem = {
  quantity: number;
  title: string;
  variant?: {
    price: string;
  } | null;
};

type ShopifyOrder = {
  id: string;
  name: string;
  createdAt: string;
  totalPriceSet: { shopMoney: Money };
  customer: { email: string; displayName: string } | null;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  lineItems: { edges: { node: OrderLineItem }[] };
};

type OrdersResponse = {
  orders: {
    edges: { node: ShopifyOrder }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

const ORDERS_QUERY = `
  query Orders($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet { shopMoney { amount currencyCode } }
          customer { email displayName }
          displayFinancialStatus
          displayFulfillmentStatus
          lineItems(first: 10) {
            edges {
              node {
                quantity
                title
                variant { price }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export type Order = {
  id: string;
  name: string;
  createdAt: string;
  total: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: { quantity: number; title: string; price: number }[];
};

const mapOrder = (node: ShopifyOrder): Order => ({
  id: node.id,
  name: node.name,
  createdAt: node.createdAt,
  total: parseFloat(node.totalPriceSet.shopMoney.amount),
  currency: node.totalPriceSet.shopMoney.currencyCode,
  customerEmail: node.customer?.email ?? null,
  customerName: node.customer?.displayName ?? null,
  financialStatus: node.displayFinancialStatus,
  fulfillmentStatus: node.displayFulfillmentStatus,
  lineItems: node.lineItems.edges.map((e) => ({
    quantity: e.node.quantity,
    title: e.node.title,
    price: parseFloat(e.node.variant?.price ?? "0"),
  })),
});

export const fetchOrders = async (
  shop: string,
  accessToken: string,
  opts: { after?: string | null; first?: number; query?: string }
): Promise<{ orders: Order[]; hasNextPage: boolean; endCursor: string | null }> => {
  const data = await shopifyGraphql<OrdersResponse>(shop, accessToken, ORDERS_QUERY, {
    first: opts.first ?? 50,
    after: opts.after ?? null,
    query: opts.query ?? null,
  });
  return {
    orders: data.orders.edges.map((e) => mapOrder(e.node)),
    hasNextPage: data.orders.pageInfo.hasNextPage,
    endCursor: data.orders.pageInfo.endCursor,
  };
};

export const fetchOrdersForDateRange = async (
  shop: string,
  accessToken: string,
  startDate: Date,
  endDate: Date,
  maxOrders: number = 500
): Promise<Order[]> => {
  const query = `created_at:>=${startDate.toISOString()} created_at:<=${endDate.toISOString()}`;
  const allOrders: Order[] = [];
  let cursor: string | null = null;

  while (allOrders.length < maxOrders) {
    const result = await fetchOrders(shop, accessToken, {
      after: cursor,
      first: Math.min(50, maxOrders - allOrders.length),
      query,
    });
    allOrders.push(...result.orders);
    if (!result.hasNextPage || !result.endCursor) break;
    cursor = result.endCursor;
  }

  return allOrders;
};

export type AnalyticsOverview = {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  currency: string;
};

export const aggregateMetrics = (orders: Order[]): AnalyticsOverview => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = orders.length;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
  const uniqueEmails = new Set(orders.map((o) => o.customerEmail).filter(Boolean));
  const currency = orders[0]?.currency ?? "USD";

  return {
    totalRevenue,
    orderCount,
    averageOrderValue,
    uniqueCustomers: uniqueEmails.size,
    currency,
  };
};

export type TopProduct = {
  title: string;
  revenue: number;
  quantity: number;
};

export const getTopSellingProducts = (orders: Order[], limit: number = 10): TopProduct[] => {
  const productMap = new Map<string, { revenue: number; quantity: number }>();

  for (const order of orders) {
    for (const item of order.lineItems) {
      const existing = productMap.get(item.title) ?? { revenue: 0, quantity: 0 };
      productMap.set(item.title, {
        revenue: existing.revenue + item.price * item.quantity,
        quantity: existing.quantity + item.quantity,
      });
    }
  }

  return Array.from(productMap.entries())
    .map(([title, data]) => ({ title, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

export type DailyRevenue = {
  date: string;
  revenue: number;
  orders: number;
};

export const getRevenueTimeSeries = (orders: Order[]): DailyRevenue[] => {
  const dailyMap = new Map<string, { revenue: number; orders: number }>();

  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    const date = orderDate.toISOString().split("T")[0]!;
    const existing = dailyMap.get(date) ?? { revenue: 0, orders: 0 };
    dailyMap.set(date, {
      revenue: existing.revenue + order.total,
      orders: existing.orders + 1,
    });
  }

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getDateRangeFromPreset = (
  preset: "today" | "7d" | "30d" | "90d"
): { startDate: Date; endDate: Date; periodDays: number } => {
  const now = new Date();
  const endDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  let periodDays: number;
  switch (preset) {
    case "today":
      periodDays = 1;
      break;
    case "7d":
      periodDays = 7;
      break;
    case "30d":
      periodDays = 30;
      break;
    case "90d":
      periodDays = 90;
      break;
    default:
      periodDays = 7;
  }

  const startDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - (periodDays - 1),
    0, 0, 0, 0
  ));

  return { startDate, endDate, periodDays };
};

export const getPreviousPeriod = (
  startDate: Date,
  endDate: Date,
  periodDays: number
): { prevStartDate: Date; prevEndDate: Date } => {
  const prevEndDate = new Date(startDate.getTime() - 1);
  const prevStartDate = new Date(prevEndDate.getTime() - (periodDays - 1) * 24 * 60 * 60 * 1000);
  prevStartDate.setUTCHours(0, 0, 0, 0);
  return { prevStartDate, prevEndDate };
};
