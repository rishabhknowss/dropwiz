import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DailyRevenue = {
  date: string;
  revenue: number;
  orders: number;
};

type RevenueChartProps = {
  data: DailyRevenue[];
  currency: string;
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

export const RevenueChart = ({ data, currency, isLoading }: RevenueChartProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
        <div className="mt-3 h-[200px] animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
        <h3 className="text-[13px] font-medium text-[var(--dw-text)]">Revenue</h3>
        <div className="mt-3 flex h-[200px] items-center justify-center text-[12px] text-[var(--dw-text-muted)]">
          No data for this period
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
      <h3 className="text-[13px] font-medium text-[var(--dw-text)]">Revenue</h3>
      <div className="mt-3 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--dw-accent)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--dw-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dw-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: "var(--dw-text-muted)" }}
              axisLine={{ stroke: "var(--dw-border)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value, currency)}
              tick={{ fontSize: 10, fill: "var(--dw-text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--dw-surface)",
                border: "1px solid var(--dw-border)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelFormatter={(label) => formatDate(label)}
              formatter={(value) => [formatCurrency(Number(value), currency), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--dw-accent)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
