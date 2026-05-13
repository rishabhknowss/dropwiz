import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";

type PageLayoutProps = {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href: string }>;
  sidebar?: React.ReactNode;
};

export const PageLayout = ({
  children,
  breadcrumbs,
  sidebar,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <header className="border-b border-[color:var(--dw-border)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-1">
            <img src="/logo.png" alt="dropwiz" className="h-7 w-auto lg:h-8" />
            <span className="text-[18px] font-bold text-[#0A0A0A] lg:text-[20px]">dropwiz</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/guides"
              className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-text)]"
            >
              Guides
            </Link>
            <Link
              href="/products"
              className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-text)]"
            >
              Products
            </Link>
            <Link
              href="/tools"
              className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-text)]"
            >
              Tools
            </Link>
            <Link
              href="/niches"
              className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-text)]"
            >
              Niches
            </Link>
          </nav>
          <Link
            href="/build/new"
            className="rounded-lg bg-[#0A0A0A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a1a1a]"
          >
            Start Free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={sidebar ? "grid gap-10 lg:grid-cols-[1fr_300px]" : ""}>
          <article className="prose prose-neutral max-w-none">
            {children}
          </article>
          {sidebar && (
            <aside className="hidden lg:block">
              <div className="sticky top-6">{sidebar}</div>
            </aside>
          )}
        </div>
      </main>

      <footer className="border-t border-[color:var(--dw-border)] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 font-semibold">Product</div>
              <ul className="space-y-2 text-sm text-[color:var(--dw-text-muted)]">
                <li>
                  <Link href="/build/new" className="hover:text-[color:var(--dw-text)]">
                    Store Builder
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-[color:var(--dw-text)]">
                    Free Tools
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-[color:var(--dw-text)]">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 font-semibold">Resources</div>
              <ul className="space-y-2 text-sm text-[color:var(--dw-text-muted)]">
                <li>
                  <Link href="/guides" className="hover:text-[color:var(--dw-text)]">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[color:var(--dw-text)]">
                    Trending Products
                  </Link>
                </li>
                <li>
                  <Link href="/niches" className="hover:text-[color:var(--dw-text)]">
                    Niches
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 font-semibold">Company</div>
              <ul className="space-y-2 text-sm text-[color:var(--dw-text-muted)]">
                <li>
                  <Link href="/terms" className="hover:text-[color:var(--dw-text)]">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[color:var(--dw-text)]">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 font-semibold">Connect</div>
              <ul className="space-y-2 text-sm text-[color:var(--dw-text-muted)]">
                <li>
                  <a
                    href="https://twitter.com/dropwiz_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[color:var(--dw-text)]"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@dropwiz.ai"
                    className="hover:text-[color:var(--dw-text)]"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-[color:var(--dw-border)] pt-6 text-center text-sm text-[color:var(--dw-text-muted)]">
            © {new Date().getFullYear()} Dropwiz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
