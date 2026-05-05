import Link from "next/link";
import { motion } from "motion/react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-x-hidden overflow-y-visible">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dw-accent)]/20 via-[var(--dw-bg-secondary)] to-[var(--dw-bg)]" />

      <div className="relative px-4 pb-16 pt-8 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--dw-border)] bg-[var(--dw-surface)]/80 px-4 py-2 shadow-sm backdrop-blur-sm"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="size-4 text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[13px] font-medium text-[var(--dw-text-muted)]">
                100k+ stores generated
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto max-w-4xl text-[32px] font-bold leading-[1.15] tracking-tight text-[var(--dw-text)] sm:text-[64px] sm:leading-[1.05] lg:text-[90px]"
            >
              <span className="sm:hidden">
                Build your Shopify store with AI.
              </span>
              <span className="hidden sm:inline">
                Build your <span className="inline-flex items-center gap-3"><span className="inline-flex size-18 items-center justify-center rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/90 lg:size-24"><img src="/shopify-logo.png" alt="Shopify" className="size-12 lg:size-16" /></span>Shopify</span>
                <br />
                store with AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-[17px] leading-relaxed text-[var(--dw-text-muted)] lg:text-[18px]"
            >
              Import any product URL, and our AI builds a complete, high-converting
              product page in seconds. Launch your Shopify store faster
              with <span className="font-semibold text-[var(--dw-text)]">AI-generated copy</span> and optimized designs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12"
            >
              <Link
                href="/auth/signup"
                className="group inline-flex h-14 items-center gap-3 rounded-[30px] border border-[var(--dw-accent)] bg-[var(--dw-accent)] px-8 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(82,53,239,0.6)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(82,53,239,0.7)]"
              >
                <span>Get Started • it&apos;s free</span>
                <span className="flex size-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                  <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative mt-20 lg:mt-24"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />

              <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] lg:rounded-3xl">
                <div className="flex items-center gap-2 border-b border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-[#FF5F57]" />
                    <div className="size-3 rounded-full bg-[#FFBD2E]" />
                    <div className="size-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 rounded-lg bg-[var(--dw-surface)] px-4 py-1.5 text-[12px] text-[var(--dw-text-subtle)]">
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    dropwiz.ai
                  </div>
                </div>
                <img
                  src="/landing/landing1.png"
                  alt="Dropwiz Dashboard"
                  className="w-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40, rotate: -3 }}
                animate={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -left-8 top-[15%] hidden w-[200px] overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] backdrop-blur-sm lg:block"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[var(--dw-text-muted)]">Conversions</span>
                  <span className="rounded-full bg-[var(--dw-success)] px-2 py-0.5 text-[10px] font-bold text-white">+42%</span>
                </div>
                <div className="flex items-end gap-1">
                  {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ duration: 0.6, delay: 0.9 + i * 0.1, ease: "easeOut" }}
                      className="flex-1 rounded-t bg-gradient-to-t from-[var(--dw-accent)] to-[#8771FF]"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, rotate: 3 }}
                animate={{ opacity: 1, x: 0, rotate: 3 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -right-8 top-[25%] hidden w-[180px] overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] backdrop-blur-sm lg:block"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF]" />
                  <div>
                    <p className="text-[12px] font-semibold text-[var(--dw-text)]">Store Live</p>
                    <p className="text-[10px] text-[var(--dw-text-muted)]">Just now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="size-2 rounded-full bg-[var(--dw-success)]"
                  />
                  <span className="text-[11px] text-[var(--dw-text-muted)]">Synced to Shopify</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 px-6 py-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:flex"
              >
                <div className="flex -space-x-2">
                  {["sarah", "marcus", "jessica", "david"].map((name) => (
                    <img key={name} src={`/testimonials/${name}.jpg`} alt={name} className="size-9 rounded-full border-2 border-[var(--dw-surface)] object-cover" />
                  ))}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--dw-text)]">2,500+ stores built</p>
                  <p className="text-[11px] text-[var(--dw-text-muted)]">Join dropshippers worldwide</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
