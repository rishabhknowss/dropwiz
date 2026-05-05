import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DWLogo } from "@/components/dw/Logo";

type NavItemProps = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItemProps[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export const LandingNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-[var(--dw-bg)]/80 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <DWLogo size={36} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[var(--dw-text-muted)] transition-colors hover:bg-[var(--dw-bg-tertiary)] hover:text-[var(--dw-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link
                href="/app/stores"
                className="hidden h-10 items-center rounded-full border border-[var(--dw-text)] bg-[var(--dw-text)] px-6 text-[14px] font-medium text-[var(--dw-bg)] shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] lg:flex"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden h-10 items-center rounded-full border border-[var(--dw-text)] bg-[var(--dw-text)] px-6 text-[14px] font-medium text-[var(--dw-bg)] shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] lg:flex"
              >
                Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-11 items-center justify-center rounded-full text-[var(--dw-text-secondary)] transition hover:bg-[var(--dw-bg-tertiary)] lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--dw-bg)] lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-[var(--dw-border)] px-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                <DWLogo size={36} />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-11 items-center justify-center rounded-full text-[var(--dw-text-muted)] hover:bg-[var(--dw-bg-tertiary)]"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-4 text-[17px] font-medium text-[var(--dw-text-secondary)] transition hover:bg-[var(--dw-bg-tertiary)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-[var(--dw-border)] p-4">
              <Link
                href="/auth/signup"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-[30px] border border-[var(--dw-accent)] bg-[var(--dw-accent)] text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(82,53,239,0.6)]"
              >
                <span>Get Started Free</span>
                <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
