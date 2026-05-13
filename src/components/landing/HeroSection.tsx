import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--dw-bg)] pb-0 pt-12 lg:pt-16">
      <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-[var(--dw-border)] bg-[var(--dw-bg)] px-1.5 py-1.5 pr-4 shadow-sm"
          >
            <span className="rounded-md bg-[var(--dw-accent)] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--dw-text)]">
              New
            </span>
            <span className="whitespace-nowrap text-[11px] text-[var(--dw-text-muted)] sm:text-[14px]">
              AI-powered Shopify store builder
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--dw-text)] sm:text-[40px] lg:text-[72px]"
          >
            Build High-Converting
            <br />
            Stores With AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-[280px] text-[14px] leading-relaxed text-[var(--dw-text-muted)] sm:max-w-xl sm:text-[16px] lg:text-[18px]"
          >
            Your AI partner that generates store designs, writes product copy, and creates stunning images—so you can launch faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center gap-3"
          >
            <Button variant="outline" size="lg" className="h-12 rounded-lg px-7" asChild>
              <Link href="/#features">Learn More</Link>
            </Button>
            <Button size="lg" className="h-12 gap-2 rounded-lg px-7" asChild>
              <Link href="/get-started">
                Get Started
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </Button>
          </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative mt-16 lg:mt-20"
      >
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="px-4 lg:px-8">
            <div className="-mx-4 flex border-y border-[var(--dw-border)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
              {["Winning Products", "Image Generation", "Store Builder", "Import Products", "Shopify Export"].map((label, i, arr) => (
                <div
                  key={label}
                  className={`flex-1 whitespace-nowrap px-4 py-4 text-center text-[12px] font-medium text-[var(--dw-text-muted)] transition-colors hover:bg-[#E8F0FE] hover:text-[var(--dw-text)] sm:text-[13px] lg:py-5 lg:text-[15px] ${i !== arr.length - 1 ? "border-r border-[var(--dw-border)]" : ""}`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-black shadow-2xl lg:mt-12">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/zPcnuS8HWpE?rel=0"
                  title="Dropwiz Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
