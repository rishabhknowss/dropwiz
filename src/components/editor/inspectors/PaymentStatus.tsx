import { api } from "@/utils/api";

type Props = {
  storeId: string;
};

export const PaymentStatus = ({ storeId }: Props) => {
  const paymentSettings = api.stores.getPaymentSettings.useQuery(
    { storeId },
    { staleTime: 60_000, refetchOnWindowFocus: false }
  );

  if (paymentSettings.isLoading) {
    return (
      <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] p-3">
        <div className="text-[11px] text-[color:var(--dw-text-muted)]">
          Loading Shopify payment status...
        </div>
      </div>
    );
  }

  const data = paymentSettings.data;

  if (!data?.connected) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="text-[11px] font-medium text-amber-600">
            Not published to Shopify
          </div>
        </div>
        <div className="mt-1 text-[10px] text-[color:var(--dw-text-muted)]">
          Payment badges will show after publishing to Shopify
        </div>
      </div>
    );
  }

  if (!data.hasPaymentsEnabled) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="text-[11px] font-medium text-amber-600">
            No payment providers configured
          </div>
        </div>
        <div className="mt-1 text-[10px] text-[color:var(--dw-text-muted)]">
          Configure payments in Shopify Admin → Settings → Payments
        </div>
      </div>
    );
  }

  const walletLabels: Record<string, string> = {
    APPLE_PAY: "Apple Pay",
    GOOGLE_PAY: "Google Pay",
    SHOPIFY_PAY: "Shop Pay",
    META_PAY: "Meta Pay",
    AMAZON_PAY: "Amazon Pay",
  };

  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <div className="text-[11px] font-medium text-emerald-600">
          Payments enabled on {data.shopDomain}
        </div>
      </div>
      {data.supportedDigitalWallets.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.supportedDigitalWallets.map((wallet) => (
            <span
              key={wallet}
              className="rounded-md bg-[color:var(--dw-surface)] px-1.5 py-0.5 text-[10px] text-[color:var(--dw-text-muted)]"
            >
              {walletLabels[wallet] ?? wallet}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
