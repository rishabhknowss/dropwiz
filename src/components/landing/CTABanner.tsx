import Link from "next/link";
import { motion } from "motion/react";

export const CTABanner = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--dw-accent)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="absolute -left-40 -top-40 size-80 rounded-full bg-[#0A0A0A]/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-[#0A0A0A]/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <h2 className="text-[32px] font-bold tracking-tight text-[#0A0A0A] lg:text-[48px]">
          Ready to start
          <br />
          <span className="text-[#0A0A0A]/80">dropshipping?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[#0A0A0A]/70">
          Join thousands of dropshippers using Dropwiz to launch profitable Shopify stores in minutes. No design or coding skills needed.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="flex h-14 items-center gap-3 rounded-full bg-[#0A0A0A] px-8 text-[15px] font-semibold text-[var(--dw-accent)] shadow-xl shadow-black/20 transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.02]"
          >
            Get Started
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <p className="text-[13px] text-[#0A0A0A]/50">No credit card required</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mx-auto mt-16 max-w-5xl lg:mt-20"
      >
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-[#0A0A0A]/10 to-transparent" />
        <div className="relative overflow-hidden rounded-2xl border border-[#0A0A0A]/20 shadow-2xl lg:rounded-3xl">
          <img
            src="/landing/landing1.png"
            alt="Dashboard Preview"
            className="w-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute -right-4 bottom-8 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] px-5 py-4 shadow-2xl lg:-right-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--dw-accent)]">
              <svg className="size-5 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[var(--dw-text)]">Get it for FREE</p>
              <p className="text-[11px] text-[var(--dw-text-muted)]">No credit card required</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
