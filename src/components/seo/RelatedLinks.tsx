import Link from "next/link";

type RelatedLink = {
  title: string;
  href: string;
  description?: string;
};

type RelatedLinksProps = {
  title: string;
  links: RelatedLink[];
};

export const RelatedLinks = ({ title, links }: RelatedLinksProps) => {
  return (
    <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--dw-text-muted)]">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group block text-sm transition-colors hover:text-[color:var(--dw-accent)]"
            >
              <span className="font-medium">{link.title}</span>
              {link.description && (
                <span className="mt-0.5 block text-xs text-[color:var(--dw-text-muted)] group-hover:text-[color:var(--dw-text)]">
                  {link.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CTASidebar = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-br from-[color:var(--dw-accent)]/5 to-transparent p-5">
        <h3 className="mb-2 font-semibold">Build Your Store with AI</h3>
        <p className="mb-4 text-sm text-[color:var(--dw-text-muted)]">
          Generate high-converting product pages in seconds. Just paste any product URL.
        </p>
        <Link
          href="/build/new"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--dw-accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Start Free →
        </Link>
      </div>
    </div>
  );
};
