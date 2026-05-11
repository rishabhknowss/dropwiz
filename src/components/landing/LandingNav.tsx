import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

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
        className="sticky top-0 z-50 px-4 py-4 lg:px-6"
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border px-4 transition-all duration-300 lg:px-2 lg:pl-6",
            scrolled
              ? "border-white/10 bg-[#0a0a0a]/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
              : "border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
          )}
        >
          <Link href="/" className="text-[18px] font-bold tracking-tight text-[var(--dw-text)]">
            drop<span className="text-[var(--dw-accent)]">wiz</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative px-4 py-2 text-[14px] font-medium text-white/60 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/app/stores"
                className="hidden h-9 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#0A0A0A] transition-all hover:bg-white/90 lg:flex"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden h-9 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#0A0A0A] transition-all hover:bg-white/90 lg:flex"
              >
                Get Started
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
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
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-[20px] font-bold tracking-tight text-[var(--dw-text)]">
                drop<span className="text-[var(--dw-accent)]">wiz</span>
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
                className="flex h-14 w-full items-center justify-center gap-3 rounded-[30px] border border-[var(--dw-accent)] bg-[var(--dw-accent)] text-[15px] font-semibold text-[#0A0A0A] shadow-[0_6px_20px_rgba(0,255,204,0.3)]"
              >
                <span>Get Started Free</span>
                <span className="flex size-8 items-center justify-center rounded-full bg-[#0A0A0A]/10">
                  <svg className="size-4 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
