import Link from "next/link";
import type { Store } from "@/db/schema";
import type { FooterData } from "@/types/store-sections";

const PAYMENT_METHODS = ["visa", "mastercard", "amex", "paypal", "applepay", "gpay", "shopify"];

const PaymentBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {PAYMENT_METHODS.map((p) => (
      <div
        key={p}
        className="flex h-10 w-14 items-center justify-center rounded-md"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "var(--store-bg)",
        }}
      >
        <img
          src={`/payment/${p}.png`}
          alt={p}
          className="h-5 w-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
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
  return (
    <footer
      className="px-5 py-9 @3xl/store:px-12 @3xl/store:py-12"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex justify-center">
          <PaymentBadges />
        </div>
        <div className="flex flex-col items-center justify-between gap-2.5 text-center text-[11.5px] opacity-60 @3xl/store:flex-row @3xl/store:text-left @3xl/store:text-[12px]">
          <span>
            © {new Date().getFullYear()} {data.storeName}
          </span>
          <span>
            Built with Dropwiz ·{" "}
            <Link href="/" className="underline">
              dropwiz.ai
            </Link>
            {store.lastPublishedAt && <span className="ml-3">· Published</span>}
          </span>
        </div>
      </div>
    </footer>
  );
};
