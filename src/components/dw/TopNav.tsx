import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { DWLogo } from "./Logo";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

const DEFAULT_NAV: NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Academy", href: "/academy" },
  { label: "Changelog", href: "/changelog" },
];

type TopNavProps = {
  active?: string;
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryOnClick?: () => void;
  secondaryDisabled?: boolean;
};

export const DWTopNav = ({
  active = "Product",
  items = DEFAULT_NAV,
  ctaLabel = "Build free",
  ctaHref = "/auth/signup",
  ctaOnClick,
  secondaryLabel = "Sign in",
  secondaryHref = "/auth/signin",
  secondaryOnClick,
  secondaryDisabled,
}: TopNavProps) => {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-8 px-10">
        <Link href="/" className="flex items-center">
          <DWLogo size={18} />
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]",
                active === item.label &&
                  "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]"
          >
            <HugeiconsIcon
              icon={theme === "dark" ? Sun03Icon : Moon02Icon}
              size={15}
            />
          </button>
          {secondaryOnClick ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[13px]"
              onClick={secondaryOnClick}
              disabled={secondaryDisabled}
            >
              {secondaryLabel}
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-[13px]">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
          {ctaOnClick ? (
            <Button
              size="sm"
              className="h-8 px-3 text-[13px] font-medium"
              onClick={ctaOnClick}
            >
              {ctaLabel}
            </Button>
          ) : (
            <Button asChild size="sm" className="h-8 px-3 text-[13px] font-medium">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
