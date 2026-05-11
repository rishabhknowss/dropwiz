import Link from "next/link";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Moon02Icon,
  Sun03Icon,
  Menu01Icon,
  Cancel01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { DWLogo } from "./Logo";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

type NavItem = { label: string; href: string };

const DEFAULT_NAV: NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "Pricing", href: "/#pricing" },
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
  showCredits?: boolean;
};

export const DWTopNav = ({
  active = "Product",
  items = DEFAULT_NAV,
  ctaLabel,
  ctaHref,
  ctaOnClick,
  secondaryLabel,
  secondaryHref,
  secondaryOnClick,
  secondaryDisabled,
  showCredits = false,
}: TopNavProps) => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const me = api.auth.me.useQuery();

  const isLoggedIn = !!me.data;
  const resolvedCtaLabel = ctaLabel ?? (isLoggedIn ? "Dashboard" : "Get started");
  const resolvedCtaHref = ctaHref ?? (isLoggedIn ? "/app/stores" : "/auth/signup");
  const resolvedSecondaryLabel = secondaryLabel ?? (isLoggedIn ? undefined : "Sign in");
  const resolvedSecondaryHref = secondaryHref ?? "/auth/signin";

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:gap-8 md:px-6">
          <Link href="/" className="flex items-center">
            <DWLogo size={32} />
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[14px] text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]",
                  active === item.label &&
                    "bg-[color:var(--dw-surface)] text-[color:var(--dw-text)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            {showCredits && me.data && (
              <Link
                href="/app/settings"
                className="flex items-center gap-1.5 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2.5 py-1 transition hover:border-[#2563EB]/40"
                title={`${me.data.imageCredits} image credits remaining`}
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={12}
                  className="text-[#2563EB]"
                />
                <span className="text-[12px] font-semibold text-[color:var(--dw-text)]">
                  {me.data.imageCredits}
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun03Icon : Moon02Icon}
                size={15}
              />
            </button>

            <div className="hidden items-center gap-2 md:flex">
              {resolvedSecondaryLabel && (secondaryOnClick ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-[13px] text-[color:var(--dw-text-dim)] hover:text-[color:var(--dw-text)]"
                  onClick={secondaryOnClick}
                  disabled={secondaryDisabled}
                >
                  {resolvedSecondaryLabel}
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-[13px] text-[color:var(--dw-text-dim)] hover:text-[color:var(--dw-text)]">
                  <Link href={resolvedSecondaryHref}>{resolvedSecondaryLabel}</Link>
                </Button>
              ))}
              {ctaOnClick ? (
                <Button
                  size="sm"
                  className="h-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 text-[13px] font-medium text-white"
                  onClick={ctaOnClick}
                >
                  {resolvedCtaLabel}
                </Button>
              ) : (
                <Button asChild size="sm" className="h-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-4 text-[13px] font-medium text-white">
                  <Link href={resolvedCtaHref}>{resolvedCtaLabel}</Link>
                </Button>
              )}
            </div>

            {ctaOnClick ? (
              <Button
                size="sm"
                className="h-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-3 text-[12px] font-medium text-white md:hidden"
                onClick={ctaOnClick}
              >
                {resolvedCtaLabel}
              </Button>
            ) : (
              <Button asChild size="sm" className="h-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-3 text-[12px] font-medium text-white md:hidden">
                <Link href={resolvedCtaHref}>{resolvedCtaLabel}</Link>
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)] md:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={16} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[color:var(--dw-bg)] md:hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4">
            <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
              <DWLogo size={32} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto bg-[color:var(--dw-bg)] px-4 py-6">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-[15px] font-medium text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]",
                  active === item.label &&
                    "bg-[color:var(--dw-surface)] text-[color:var(--dw-text)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {resolvedSecondaryLabel && (
            <div className="shrink-0 border-t border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] p-4">
              {secondaryOnClick ? (
                <Button
                  variant="outline"
                  className="w-full border-[color:var(--dw-border)] text-[color:var(--dw-text-dim)]"
                  onClick={() => {
                    secondaryOnClick();
                    setMobileOpen(false);
                  }}
                  disabled={secondaryDisabled}
                >
                  {resolvedSecondaryLabel}
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full border-[color:var(--dw-border)] text-[color:var(--dw-text-dim)]">
                  <Link href={resolvedSecondaryHref} onClick={() => setMobileOpen(false)}>
                    {resolvedSecondaryLabel}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
