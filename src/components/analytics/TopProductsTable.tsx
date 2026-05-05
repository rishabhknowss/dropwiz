type TopProduct = {
  title: string;
  revenue: number;
  quantity: number;
};

type TopProductsTableProps = {
  products: TopProduct[];
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

export const TopProductsTable = ({ products, currency, isLoading }: TopProductsTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
        <div className="mt-3 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
      <h3 className="text-[13px] font-medium text-[var(--dw-text)]">Top Products</h3>
      {products.length === 0 ? (
        <div className="mt-3 text-center text-[12px] text-[var(--dw-text-muted)]">
          No products sold
        </div>
      ) : (
        <div className="mt-3">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--dw-border)]">
                <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wide text-[var(--dw-text-muted)]">
                  Product
                </th>
                <th className="pb-2 text-right text-[10px] font-medium uppercase tracking-wide text-[var(--dw-text-muted)]">
                  Qty
                </th>
                <th className="pb-2 text-right text-[10px] font-medium uppercase tracking-wide text-[var(--dw-text-muted)]">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} className="border-b border-[var(--dw-border)] last:border-0">
                  <td className="py-2 pr-3">
                    <span className="line-clamp-1 text-[12px] text-[var(--dw-text)]">
                      {product.title}
                    </span>
                  </td>
                  <td className="py-2 text-right text-[12px] tabular-nums text-[var(--dw-text-muted)]">
                    {product.quantity}
                  </td>
                  <td className="py-2 text-right text-[12px] font-medium tabular-nums text-[var(--dw-text)]">
                    {formatCurrency(product.revenue, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
