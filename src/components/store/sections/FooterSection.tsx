import Link from "next/link";
import type { Store } from "@/db/schema";
import type { FooterData, PaymentMethod } from "@/types/store-sections";

const DEFAULT_METHODS: PaymentMethod[] = ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];

const PAYMENT_FILE_MAP: Record<PaymentMethod, string> = {
  visa: "visa",
  mastercard: "mastercard",
  amex: "amex",
  paypal: "paypal",
  applepay: "applepay",
  googlepay: "gpay",
  discover: "visa",
  stripe: "shopify",
};

const PaymentBadges = ({ methods }: { methods: PaymentMethod[] }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {methods.map((p) => (
      <div
        key={p}
        className="flex h-10 w-14 items-center justify-center rounded-md"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "#fff",
        }}
      >
        <img
          src={`/payment/${PAYMENT_FILE_MAP[p]}.png`}
          alt={p}
          className="h-5 w-auto object-contain"
        />
      </div>
    ))}
  </div>
);

export const FooterSection = ({
  data,
  store,
}: {
  data: FooterData;
  store: Store;
}) => {
  const methods = data.paymentMethods ?? DEFAULT_METHODS;
  const showPayments = data.showPayments !== false && methods.length > 0;
  const showPoweredBy = data.showPoweredBy !== false;

  return (
    <footer
      className="px-5 py-8 @3xl/store:px-12 @3xl/store:py-10"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 @3xl/store:flex-row @3xl/store:items-start @3xl/store:justify-between">
          <div className="flex flex-col items-center gap-2 @3xl/store:items-start">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={data.storeName}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-[15px] font-semibold">{data.storeName}</span>
            )}
            {data.tagline && (
              <span className="text-[12px] opacity-60">{data.tagline}</span>
            )}
          </div>
          {showPayments && (
            <div className="flex justify-center @3xl/store:justify-end">
              <PaymentBadges methods={methods} />
            </div>
          )}
        </div>
        <div
          className="mt-6 flex flex-col items-center justify-between gap-2 pt-5 text-center text-[11px] opacity-50 @3xl/store:flex-row @3xl/store:text-left"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
        >
          <span>
            © {new Date().getFullYear()} {data.storeName}
            {data.copyrightText && ` · ${data.copyrightText}`}
          </span>
          {showPoweredBy && (
            <span>
              Built with{" "}
              <Link href="https://dropwiz.ai" className="underline">
                Dropwiz
              </Link>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};
