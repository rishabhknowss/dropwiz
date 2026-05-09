import type { HeaderData } from "@/types/store-sections";

type Props = { data: HeaderData };

export const HeaderSection = ({ data }: Props) => (
  <header className="px-5 py-4 @3xl/store:px-12 @3xl/store:py-5">
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-2.5">
        {data.logoUrl && (
          <img
            src={data.logoUrl}
            alt={data.storeName ?? "Store"}
            className="h-8 w-auto object-contain @3xl/store:h-10"
          />
        )}
        {(!data.logoUrl || data.showNameWithLogo) && data.storeName && (
          <span
            className="text-[16px] font-semibold tracking-[-0.01em] @3xl/store:text-[18px]"
            style={{ color: "var(--store-text)" }}
          >
            {data.storeName}
          </span>
        )}
      </div>
      {data.showCartIcon !== false && (
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition @3xl/store:h-10 @3xl/store:w-10"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--store-text) 5%, transparent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          aria-label="Cart"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="@3xl/store:h-[22px] @3xl/store:w-[22px]"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      )}
    </div>
  </header>
);
