import { cn } from "@/lib/utils";

type Order = {
  id: string;
  name: string;
  createdAt: string;
  total: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  financialStatus: string;
  fulfillmentStatus: string;
};

type RecentOrdersListProps = {
  orders: Order[];
  isLoading?: boolean;
};

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getStatusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("paid") || s.includes("fulfilled")) {
    return "bg-[var(--dw-success-bg)] text-[var(--dw-success)]";
  }
  if (s.includes("pending") || s.includes("unfulfilled")) {
    return "bg-[var(--dw-warning-bg)] text-[var(--dw-warning)]";
  }
  if (s.includes("refund") || s.includes("voided")) {
    return "bg-[var(--dw-error-bg)] text-[var(--dw-error)]";
  }
  return "bg-[var(--dw-bg-tertiary)] text-[var(--dw-text-muted)]";
};

export const RecentOrdersList = ({ orders, isLoading }: RecentOrdersListProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
        <div className="mt-3 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
      <h3 className="text-[13px] font-medium text-[var(--dw-text)]">Recent Orders</h3>
      {orders.length === 0 ? (
        <div className="mt-3 text-center text-[12px] text-[var(--dw-text-muted)]">
          No recent orders
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-md border border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] p-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[var(--dw-text)]">{order.name}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-medium", getStatusStyle(order.financialStatus))}>
                    {order.financialStatus}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--dw-text-muted)]">
                  <span className="truncate">{order.customerName ?? order.customerEmail ?? "Guest"}</span>
                  <span>·</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <span className="ml-3 text-[12px] font-medium tabular-nums text-[var(--dw-text)]">
                {formatCurrency(order.total, order.currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
