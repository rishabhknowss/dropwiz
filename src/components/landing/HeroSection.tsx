import Link from "next/link";
import { motion } from "motion/react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[var(--dw-bg)]" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--dw-accent)]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#8771FF]/15 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-[var(--dw-accent)]/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative px-4 pb-8 pt-8 sm:pt-20 lg:px-8 lg:pb-16 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--dw-accent)]/30 bg-[var(--dw-accent)]/10 px-4 py-1.5"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--dw-accent)] opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-[var(--dw-accent)]" />
                </span>
                <span className="text-[13px] font-medium text-[var(--dw-accent)]">
                  Now with AI image generation
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[36px] font-bold leading-[1.1] tracking-tight text-[var(--dw-text)] sm:text-[52px] lg:text-[64px]"
              >
                Turn any product into a{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-[var(--dw-accent)] to-[#8771FF] bg-clip-text text-transparent">
                    Shopify store
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute -bottom-1 left-0 h-3 w-full origin-left bg-[var(--dw-accent)]/20 lg:-bottom-2 lg:h-4"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-[16px] leading-relaxed text-[var(--dw-text-muted)] sm:text-[18px] lg:max-w-lg"
              >
                Paste any product URL. Get a complete, high-converting landing page with AI-generated copy, images, and optimized design in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
              >
                <Link
                  href="/auth/signup"
                  className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--dw-accent)] px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--dw-accent)] via-[#8771FF] to-[var(--dw-accent)] bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0]" />
                  <span className="relative">Start building free</span>
                  <svg className="relative size-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/50 px-8 text-[15px] font-medium text-[var(--dw-text)] backdrop-blur-sm transition-all duration-300 hover:bg-[var(--dw-surface)] sm:w-auto"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  See how it works
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex flex-col items-center gap-6 sm:flex-row lg:justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["sarah", "marcus", "jessica", "david"].map((name, i) => (
                      <motion.img
                        key={name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        src={`/testimonials/${name}.jpg`}
                        alt={name}
                        className="size-10 rounded-full border-2 border-[var(--dw-bg)] object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="size-4 text-[var(--dw-warning)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[13px] text-[var(--dw-text-muted)]">
                      <span className="font-semibold text-[var(--dw-text)]">2,500+</span> stores launched
                    </p>
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-[var(--dw-border)] sm:block" />
                <div className="flex items-center gap-2">
                  <img src="/shopify-logo.png" alt="Shopify" className="size-6" />
                  <span className="text-[13px] text-[var(--dw-text-muted)]">Official Shopify Partner</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[var(--dw-accent)]/20 via-transparent to-[#8771FF]/20 blur-2xl" />

              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] shadow-2xl shadow-black/10 lg:rounded-3xl">
                  <div className="flex items-center gap-2 border-b border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-[#FF5F57]" />
                      <div className="size-3 rounded-full bg-[#FFBD2E]" />
                      <div className="size-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="mx-auto flex items-center gap-2 rounded-lg bg-[var(--dw-surface)] px-3 py-1 text-[11px] text-[var(--dw-text-subtle)]">
                      <svg className="size-3 text-[var(--dw-success)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      dropwiz.ai/editor
                    </div>
                  </div>
                  <img
                    src="/landing/landing1.png"
                    alt="Dropwiz Dashboard"
                    className="w-full"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-4 -left-4 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 p-4 shadow-xl backdrop-blur-sm lg:-left-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--dw-success)]/10">
                      <svg className="size-5 text-[var(--dw-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--dw-text)]">+42% Conversions</p>
                      <p className="text-[11px] text-[var(--dw-text-muted)]">vs. standard pages</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="absolute -right-4 -top-4 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 p-4 shadow-xl backdrop-blur-sm lg:-right-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--dw-accent)]/10">
                      <svg className="size-5 text-[var(--dw-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--dw-text)]">30 seconds</p>
                      <p className="text-[11px] text-[var(--dw-text-muted)]">Average build time</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -right-4 bottom-1/3 hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]/95 p-3 shadow-xl backdrop-blur-sm lg:-right-12 lg:block"
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="size-2 rounded-full bg-[var(--dw-success)]"
                    />
                    <span className="text-[12px] font-medium text-[var(--dw-text)]">Published to Shopify</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--dw-border)] to-transparent" />
    </section>
  );
};
