import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  ShoppingCart01Icon,
  UserMultipleIcon,
  DollarCircleIcon,
  Refresh04Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  DateRangePicker,
  AnalyticsStatCard,
  RevenueChart,
  TopProductsTable,
  RecentOrdersList,
  type DateRange,
} from "@/components/analytics";
import { api } from "@/utils/api";
import { useShop } from "@/lib/shop-context";

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const AnalyticsPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const { selectedShop: shopDomain } = useShop();
  const range = ((router.query.range as string) || "7d") as DateRange;

  const shops = api.analytics.getConnectedShops.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });

  const selectedShopData = shops.data?.find((s) => s.shopDomain === shopDomain);
  const hasOrdersScope = selectedShopData?.hasOrdersScope ?? false;

  const overview = api.analytics.getOverview.useQuery(
    { shopDomain: shopDomain!, range },
    {
      enabled: !!shopDomain && hasOrdersScope,
      refetchOnWindowFocus: false,
    }
  );

  const timeSeries = api.analytics.getRevenueTimeSeries.useQuery(
    { shopDomain: shopDomain!, range },
    {
      enabled: !!shopDomain && hasOrdersScope,
      refetchOnWindowFocus: false,
    }
  );

  const topProducts = api.analytics.getTopProducts.useQuery(
    { shopDomain: shopDomain!, range, limit: 10 },
    {
      enabled: !!shopDomain && hasOrdersScope,
      refetchOnWindowFocus: false,
    }
  );

  const recentOrders = api.analytics.getRecentOrders.useQuery(
    { shopDomain: shopDomain!, limit: 10 },
    {
      enabled: !!shopDomain && hasOrdersScope,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  const handleRangeChange = (newRange: DateRange) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, range: newRange } },
      undefined,
      { shallow: true }
    );
  };

  const handleRefresh = () => {
    overview.refetch();
    timeSeries.refetch();
    topProducts.refetch();
    recentOrders.refetch();
  };

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dw-bg)]">
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading...</div>
      </div>
    );
  }

  const currency = overview.data?.currency ?? "USD";
  const isLoading = overview.isLoading || timeSeries.isLoading;

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Track your store's performance"
      action={
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
          className="h-8 w-8 border-[var(--dw-border)]"
        >
          <HugeiconsIcon
            icon={Refresh04Icon}
            size={14}
            className={isLoading ? "animate-spin" : ""}
          />
        </Button>
      }
    >
      {shops.isLoading ? (
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading...</div>
      ) : shops.data?.length === 0 ? (
        <EmptyState />
      ) : !shopDomain ? (
        <NoShopSelected />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <DateRangePicker value={range} onChange={handleRangeChange} />
          </div>

          {selectedShopData && !hasOrdersScope ? (
            <ScopeWarning shopDomain={selectedShopData.shopDomain} />
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <AnalyticsStatCard
                  title="Revenue"
                  value={overview.data ? formatCurrency(overview.data.totalRevenue, currency) : "$0"}
                  change={overview.data?.changes.revenue}
                  icon={Wallet01Icon}
                  isLoading={overview.isLoading}
                />
                <AnalyticsStatCard
                  title="Orders"
                  value={String(overview.data?.orderCount ?? 0)}
                  change={overview.data?.changes.orders}
                  icon={ShoppingCart01Icon}
                  isLoading={overview.isLoading}
                />
                <AnalyticsStatCard
                  title="Avg. Order"
                  value={overview.data ? formatCurrency(overview.data.averageOrderValue, currency) : "$0"}
                  change={overview.data?.changes.aov}
                  icon={DollarCircleIcon}
                  isLoading={overview.isLoading}
                />
                <AnalyticsStatCard
                  title="Customers"
                  value={String(overview.data?.uniqueCustomers ?? 0)}
                  change={overview.data?.changes.customers}
                  icon={UserMultipleIcon}
                  isLoading={overview.isLoading}
                />
              </div>

              <RevenueChart
                data={timeSeries.data ?? []}
                currency={currency}
                isLoading={timeSeries.isLoading}
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <TopProductsTable
                  products={topProducts.data ?? []}
                  currency={currency}
                  isLoading={topProducts.isLoading}
                />
                <RecentOrdersList
                  orders={recentOrders.data ?? []}
                  isLoading={recentOrders.isLoading}
                />
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

const EmptyState = () => (
  <div className="rounded-lg border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--dw-accent-subtle)]">
      <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-[var(--dw-accent)]" />
    </div>
    <h3 className="text-[16px] font-semibold text-[var(--dw-text)]">No shops connected</h3>
    <p className="mx-auto mt-1 max-w-sm text-[13px] text-[var(--dw-text-muted)]">
      Connect a Shopify store to see your analytics data.
    </p>
    <Link href="/app/shopify">
      <Button className="mt-4 gap-1.5 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]">
        Connect Shop
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Button>
    </Link>
  </div>
);

const NoShopSelected = () => (
  <div className="rounded-lg border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--dw-accent-subtle)]">
      <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-[var(--dw-accent)]" />
    </div>
    <h3 className="text-[16px] font-semibold text-[var(--dw-text)]">Select a store</h3>
    <p className="mx-auto mt-1 max-w-sm text-[13px] text-[var(--dw-text-muted)]">
      Select a store from the sidebar to view analytics.
    </p>
  </div>
);

const ScopeWarning = ({ shopDomain }: { shopDomain: string }) => {
  const handleReconnect = () => {
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(shopDomain)}`;
  };

  return (
    <div className="rounded-lg border border-[var(--dw-warning)]/30 bg-[var(--dw-warning-bg)] p-4">
      <div className="flex gap-3">
        <HugeiconsIcon icon={AlertCircleIcon} size={18} className="mt-0.5 shrink-0 text-[var(--dw-warning)]" />
        <div>
          <h3 className="text-[13px] font-medium text-[var(--dw-text)]">Permissions required</h3>
          <p className="mt-0.5 text-[12px] text-[var(--dw-text-muted)]">
            Reconnect <strong>{shopDomain}</strong> to grant order read permissions for analytics.
          </p>
          <Button
            onClick={handleReconnect}
            size="sm"
            className="mt-3 h-8 gap-1.5 bg-[var(--dw-accent)] text-[12px] hover:bg-[var(--dw-accent-hover)]"
          >
            Reconnect
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
