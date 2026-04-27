import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { DWLogo } from "./Logo";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  const { theme, toggle } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <div className="dw-grid-bg absolute inset-0 opacity-30" />
      <div className="dw-bloom -left-[240px] -top-[240px]" />

      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link href="/">
          <DWLogo size={18} />
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]"
        >
          <HugeiconsIcon icon={theme === "dark" ? Sun03Icon : Moon02Icon} size={15} />
        </button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] max-w-[440px] place-items-center px-6 pb-24">
        <div className="w-full">
          <h1 className="dw-display-sm text-[40px] leading-[1.02]">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-[15px] leading-[1.5] text-[color:var(--dw-text-dim)]">
              {subtitle}
            </p>
          )}
          <div className="mt-10">{children}</div>
          {footer && (
            <div className="mt-8 border-t border-[color:var(--dw-border)] pt-6 text-center text-[13px] text-[color:var(--dw-text-dim)]">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
