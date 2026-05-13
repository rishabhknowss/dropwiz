import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store04Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ShoppingCart01Icon,
  UserMultiple02Icon,
  MoneyBag02Icon,
  Loading03Icon,
  LinkSquare02Icon,
  ChartHistogramIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/utils/api";

type DateRange = "today" | "7d" | "30d" | "90d";
type Shop = RouterOutputs["analytics"]["getConnectedShops"][number];

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#0A0A0A",
  },
} satisfies ChartConfig;

const ordersChartConfig = {
  quantity: {
    label: "Quantity Sold",
    color: "#0A0A0A",
  },
} satisfies ChartConfig;

const IntegrationsPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const shops = api.analytics.getConnectedShops.useQuery(undefined, {
    enabled: !!me.data,
  });

  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const selectedShop = shops.data?.find((s) => s.id === selectedShopId) ?? shops.data?.[0] ?? null;

  const handleSelectShop = (shop: Shop) => {
    setSelectedShopId(shop.id);
  };

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  const overview = api.analytics.getOverview.useQuery(
    { shopDomain: selectedShop?.shopDomain ?? "", range: dateRange },
    { enabled: !!selectedShop?.hasOrdersScope }
  );

  const timeSeries = api.analytics.getRevenueTimeSeries.useQuery(
    { shopDomain: selectedShop?.shopDomain ?? "", range: dateRange },
    { enabled: !!selectedShop?.hasOrdersScope }
  );

  const topProducts = api.analytics.getTopProducts.useQuery(
    { shopDomain: selectedShop?.shopDomain ?? "", range: dateRange, limit: 5 },
    { enabled: !!selectedShop?.hasOrdersScope }
  );

  if (!me.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-xl" />
          <div className="relative h-10 w-10 rounded-full border-2 border-[#E5E5E5] border-t-[var(--dw-accent)] animate-spin" />
        </div>
        <div className="text-[13px] font-medium text-[#666666]">Loading...</div>
      </div>
    );
  }

  const hasShops = (shops.data?.length ?? 0) > 0;
  const hasOrdersScope = selectedShop?.hasOrdersScope ?? false;

  const shopsConnectedBadge = (
    <div className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-1.5">
      <div className="flex size-5 items-center justify-center rounded bg-[#96BF48]">
        <HugeiconsIcon icon={Store04Icon} size={12} className="text-white" />
      </div>
      <span className="text-[13px] font-medium text-[#0A0A0A]">
        {shops.data?.length ?? 0} shop{(shops.data?.length ?? 0) !== 1 ? "s" : ""} connected
      </span>
    </div>
  );

  return (
    <DashboardLayout title="Analytics" subtitle="Track your Shopify store performance" action={shopsConnectedBadge}>
      <div className="p-6 lg:p-8">
        {hasShops && hasOrdersScope && (
          <div className="mb-6 flex justify-end">
            <div className="flex items-center gap-2">
              {shops.data && shops.data.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 border-[#E5E5E5] text-[12px]">
                      <HugeiconsIcon icon={FilterIcon} size={14} />
                      {selectedShop?.shopDomain ?? "Select shop"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px]">
                    {shops.data.map((shop) => (
                      <DropdownMenuItem
                        key={shop.id}
                        onClick={() => handleSelectShop(shop)}
                        className="flex items-center justify-between text-[13px]"
                      >
                        <span className="truncate">{shop.shopDomain}</span>
                        {selectedShop?.id === shop.id && (
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-[#059669]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-[#E5E5E5] text-[12px]">
                    {DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setDateRange(option.value)}
                      className="flex items-center justify-between text-[13px]"
                    >
                      {option.label}
                      {dateRange === option.value && (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-[#059669]" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {!hasShops ? (
          <EmptyState />
        ) : !hasOrdersScope ? (
          <ReconnectState shopDomain={selectedShop?.shopDomain ?? ""} />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(overview.data?.totalRevenue ?? 0)}
                change={overview.data?.changes.revenue}
                icon={MoneyBag02Icon}
                loading={overview.isLoading}
              />
              <MetricCard
                title="Orders"
                value={overview.data?.orderCount?.toString() ?? "0"}
                change={overview.data?.changes.orders}
                icon={ShoppingCart01Icon}
                loading={overview.isLoading}
              />
              <MetricCard
                title="Avg. Order Value"
                value={formatCurrency(overview.data?.averageOrderValue ?? 0)}
                change={overview.data?.changes.aov}
                icon={ChartHistogramIcon}
                loading={overview.isLoading}
              />
              <MetricCard
                title="Customers"
                value={overview.data?.uniqueCustomers?.toString() ?? "0"}
                change={overview.data?.changes.customers}
                icon={UserMultiple02Icon}
                loading={overview.isLoading}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-[#E8E8E8] bg-white p-5">
                  <h3 className="mb-4 text-[14px] font-semibold text-[#0A0A0A]">Revenue Over Time</h3>
                  {timeSeries.isLoading ? (
                    <div className="flex h-[280px] items-center justify-center">
                      <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin text-[#999999]" />
                    </div>
                  ) : (timeSeries.data?.length ?? 0) > 0 ? (
                    <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
                      <AreaChart data={timeSeries.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E8E8E8" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value: string) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                          }}
                          className="text-[11px]"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                          className="text-[11px]"
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                            />
                          }
                        />
                        <Area
                          dataKey="revenue"
                          type="monotone"
                          fill="url(#fillRevenue)"
                          stroke="#0A0A0A"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-[13px] text-[#999999]">
                      No data available for this period
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#E8E8E8] bg-white p-5">
                <h3 className="mb-4 text-[14px] font-semibold text-[#0A0A0A]">Top Products</h3>
                {topProducts.isLoading ? (
                  <div className="flex h-[280px] items-center justify-center">
                    <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin text-[#999999]" />
                  </div>
                ) : (topProducts.data?.length ?? 0) > 0 ? (
                  <ChartContainer config={ordersChartConfig} className="h-[280px] w-full">
                    <BarChart
                      data={topProducts.data}
                      layout="vertical"
                      margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#E8E8E8" />
                      <XAxis type="number" tickLine={false} axisLine={false} className="text-[11px]" />
                      <YAxis
                        dataKey="title"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={100}
                        tickFormatter={(value: string) =>
                          value.length > 15 ? `${value.slice(0, 15)}...` : value
                        }
                        className="text-[10px]"
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name, item) => [
                              `${value} sold`,
                              item.payload?.title ?? "Product",
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="quantity" fill="#0A0A0A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-[280px] items-center justify-center text-[13px] text-[#999999]">
                    No products sold in this period
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#E8E8E8] bg-white">
              <div className="border-b border-[#E8E8E8] px-5 py-3">
                <h3 className="text-[14px] font-semibold text-[#0A0A0A]">Connected Shops</h3>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {shops.data?.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#96BF48]/10">
                        <HugeiconsIcon icon={Store04Icon} size={16} className="text-[#96BF48]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#0A0A0A]">{shop.shopDomain}</p>
                        <p className="text-[11px] text-[#999999]">
                          Connected {new Date(shop.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {shop.hasOrdersScope ? (
                        <span className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-[10px] font-medium text-[#059669]">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} />
                          Full Access
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#FEF3C7] px-2 py-1 text-[10px] font-medium text-[#92400E]">
                          Limited Access
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const MetricCard = ({
  title,
  value,
  change,
  icon,
  loading,
}: {
  title: string;
  value: string;
  change?: number;
  icon: typeof MoneyBag02Icon;
  loading?: boolean;
}) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#999999]">{title}</span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F5F5F5]">
          <HugeiconsIcon icon={icon} size={14} className="text-[#666666]" />
        </div>
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded bg-[#E5E5E5]" />
      ) : (
        <div className="mt-2">
          <span className="text-[24px] font-bold tracking-tight text-[#0A0A0A]">{value}</span>
          {change !== undefined && (
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-[11px] font-medium",
                isPositive ? "text-[#059669]" : "text-[#DC2626]"
              )}
            >
              <HugeiconsIcon icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon} size={12} />
              {Math.abs(change).toFixed(1)}% vs prev period
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-8 py-16 text-center">
    <div className="relative z-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#96BF48]/10">
        <HugeiconsIcon icon={Store04Icon} size={24} className="text-[#96BF48]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0A0A0A]">Connect your Shopify store</h3>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#666666]">
        Connect your Shopify store to view analytics, track orders, and publish your dropwiz stores.
      </p>
      <Link
        href="/api/auth/shopify"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
      >
        <HugeiconsIcon icon={LinkSquare02Icon} size={16} />
        Connect Shopify
      </Link>
    </div>
  </div>
);

const ReconnectState = ({ shopDomain }: { shopDomain: string }) => (
  <div className="relative overflow-hidden rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] px-8 py-12 text-center">
    <div className="relative z-10">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDE68A]">
        <HugeiconsIcon icon={Store04Icon} size={20} className="text-[#92400E]" />
      </div>
      <h3 className="text-[16px] font-bold text-[#0A0A0A]">Analytics requires additional permissions</h3>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#666666]">
        To view analytics for <span className="font-medium">{shopDomain}</span>, you need to reconnect with
        order read permissions.
      </p>
      <Link
        href="/api/auth/shopify"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
      >
        Reconnect Store
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Link>
    </div>
  </div>
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default IntegrationsPage;
