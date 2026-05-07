import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[color:var(--dw-text-muted)]">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="text-[color:var(--dw-text)]">{item.label}</span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[color:var(--dw-text)]"
                  >
                    {item.label}
                  </Link>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={12}
                    className="opacity-50"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
