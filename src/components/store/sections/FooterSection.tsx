import Link from "next/link";
import type { Store } from "@/db/schema";
import type { FooterData } from "@/types/store-sections";

export const FooterSection = ({
  data,
  store,
}: {
  data: FooterData;
  store: Store;
}) => (
  <footer className="border-t border-black/5 px-5 py-9 @3xl/store:px-12 @3xl/store:py-12">
    <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-2.5 text-[11.5px] opacity-60 @3xl/store:flex-row @3xl/store:flex-wrap @3xl/store:items-center @3xl/store:gap-4 @3xl/store:text-[12px]">
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
  </footer>
);
