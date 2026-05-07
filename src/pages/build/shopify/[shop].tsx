import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
  ShoppingBag03Icon,
} from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { formatPrice } from "@/lib/format";
import type { RouterOutputs } from "@/utils/api";

type Product = RouterOutputs["shopify"]["listProducts"]["products"][number];

const ShopifyPicker = () => {
  const router = useRouter();
  const shopDomain = typeof router.query.shop === "string" ? router.query.shop : "";
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [picking, setPicking] = useState<string | null>(null);

  const me = api.auth.me.useQuery();
  const list = api.shopify.listProducts.useQuery(
    { shopDomain, search: search || undefined },
    { enabled: !!shopDomain && !!me.data },
  );
  const create = api.stores.create.useMutation();

  const products = useMemo(() => list.data?.products ?? [], [list.data]);

  const handlePick = (product: Product) => {
    setPicking(product.id);
    runWithToast(
      create,
      {
        shopifyShopDomain: shopDomain,
        shopifyProductId: product.id,
        targetLanguage: language,
        currency: product.currency || currency,
      },
      {
        loading: `Importing ${product.title}…`,
        success: "Working on your store",
        toastId: "shopify-import",
        onSuccess: (data) => {
          const claim = data.claimToken
            ? `?claim=${encodeURIComponent(data.claimToken)}`
            : "";
          router.push(`/build/${data.storeId}/generating${claim}`);
        },
        onError: () => setPicking(null),
      },
    );
  };

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav active="Product" />
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <button
          onClick={() => router.push("/build/new")}
          className="dw-mono inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={11} />
          Back to source
        </button>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]">
            <HugeiconsIcon icon={ShoppingBag03Icon} size={18} />
          </div>
          <div>
            <h1 className="dw-display-sm text-[28px] leading-[1.05] tracking-[-0.02em] @3xl/store:text-[36px]">
              Pick a product to import
            </h1>
            <div className="dw-mono mt-1 text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              {shopDomain}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
            />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title…"
              className="h-11 bg-[color:var(--dw-surface)] pl-10 text-[14px]"
            />
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-11 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-3 text-[14px]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-11 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-3 text-[14px]"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {list.isLoading ? (
          <div className="dw-mono mt-12 text-center text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Loading products…
          </div>
        ) : list.isError ? (
          <ErrorBlock
            message={list.error.message}
            onRetry={() => list.refetch()}
          />
        ) : products.length === 0 ? (
          <EmptyBlock shopDomain={shopDomain} />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                loading={picking === p.id}
                onPick={() => handlePick(p)}
              />
            ))}
          </div>
        )}

        {list.data?.hasMore && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" disabled>
              Load more (paging coming soon)
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  product,
  loading,
  onPick,
}: {
  product: Product;
  loading: boolean;
  onPick: () => void;
}) => (
  <button
    type="button"
    onClick={onPick}
    disabled={loading}
    className="group flex flex-col overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] text-left transition hover:-translate-y-0.5 hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg disabled:opacity-60"
  >
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--dw-surface2)]">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          unoptimized
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--dw-accent) 0%, var(--dw-text-muted) 100%)",
            opacity: 0.25,
          }}
        />
      )}
    </div>
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="line-clamp-2 text-[13.5px] font-medium leading-[1.4]">
        {product.title}
      </div>
      <div className="dw-mono mt-auto flex items-center justify-between text-[10.5px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
        <span>{formatPrice(product.priceCents, product.currency)}</span>
        <span
          className={
            product.status === "ACTIVE"
              ? "text-[color:var(--dw-jade)]"
              : "text-[color:var(--dw-text-muted)]"
          }
        >
          {product.status.toLowerCase()}
        </span>
      </div>
      <div className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-[color:var(--dw-text)] opacity-70 group-hover:opacity-100">
        {loading ? "Importing…" : "Import this product"}
        {!loading && (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={11}
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
      </div>
    </div>
  </button>
);

const EmptyBlock = ({ shopDomain }: { shopDomain: string }) => (
  <div className="mt-10 rounded-[14px] border border-dashed border-[color:var(--dw-border)] p-10 text-center">
    <div className="text-[15px] font-medium">No products in this shop yet</div>
    <p className="mt-2 text-[13px] text-[color:var(--dw-text-dim)]">
      Add products in the Shopify admin for{" "}
      <span className="dw-mono">{shopDomain}</span>, then come back.
    </p>
  </div>
);

const ErrorBlock = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="mt-10 rounded-[14px] border border-[color:var(--dw-signal)]/40 bg-[color:var(--dw-signal)]/8 p-6 text-center">
    <div className="text-[14px] font-medium">Couldn&apos;t load Shopify products</div>
    <div className="mt-1 text-[12px] text-[color:var(--dw-text-dim)]">{message}</div>
    <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
      Try again
    </Button>
  </div>
);

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

export default ShopifyPicker;
