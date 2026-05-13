import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItemProps = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItemProps[] = [
  { label: "Features", href: "/#features" },
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
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-0 right-0 top-0 z-50 bg-[var(--dw-bg)] transition-all duration-300"
      >
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
          )}
        >
          <div className="mx-auto max-w-6xl lg:px-8">
            <div className="border-b border-[var(--dw-border)] bg-[#EEF4FF] px-4 py-2.5 text-center lg:px-8">
              <p className="text-[13px] font-medium text-[var(--dw-text-secondary)]">
                Launch your Shopify store in minutes with AI —{" "}
                <Link href="/get-started" className="text-[var(--dw-text)] underline underline-offset-2">
                  Try It Free!
                </Link>
              </p>
            </div>
          </div>
        </div>
        <header className="border-b border-[var(--dw-border)]">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:h-16 lg:px-8">
            <Link href="/" className="flex items-center gap-1 lg:pl-8">
              <img src="/logo.png" alt="dropwiz" className="h-7 w-auto lg:h-8" />
              <span className="text-[18px] font-bold text-[var(--dw-text)] lg:text-[20px]">dropwiz</span>
            </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-[14px] font-medium text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 lg:pr-8">
            {isLoggedIn ? (
              <Button size="lg" className="hidden h-10 rounded-lg px-5 lg:flex" asChild>
                <Link href="/app/stores">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden text-[14px] font-medium text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)] lg:block"
                >
                  Login
                </Link>
                <Button size="lg" className="hidden h-10 rounded-lg px-5 lg:flex" asChild>
                  <Link href="/auth/signup">Try For Free</Link>
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-lg text-[var(--dw-text-muted)] transition hover:bg-[var(--dw-surface2)] hover:text-[var(--dw-text)] lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </button>
          </div>
          </div>
        </header>
      </motion.div>
      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "h-14 lg:h-16" : "h-[104px] lg:h-[112px]"
        )}
      />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--dw-bg)] lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--dw-border)] px-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-1">
                <img src="/logo.png" alt="dropwiz" className="h-7 w-auto" />
                <span className="text-[18px] font-bold text-[var(--dw-text)]">dropwiz</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 items-center justify-center rounded-lg text-[var(--dw-text-muted)] hover:bg-[var(--dw-surface2)]"
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
                    className="block rounded-xl px-4 py-4 text-[17px] font-medium text-[var(--dw-text-secondary)] transition hover:bg-[var(--dw-surface2)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-[var(--dw-border)] p-4">
              <Button size="lg" className="h-12 w-full gap-2 rounded-lg" asChild>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  Get Started Free
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
