import Link from "next/link";
import { motion } from "motion/react";

export const CTABanner = () => {
  return (
    <section className="bg-[var(--dw-bg)] py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[var(--dw-accent)] px-6 py-16 lg:rounded-3xl lg:px-12 lg:py-24">
            <div className="absolute -left-40 -top-40 size-80 rounded-full bg-[#0A0A0A]/5 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-[#0A0A0A]/5 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-3xl text-center"
            >
              <h2 className="text-[32px] font-bold tracking-tight text-[#0A0A0A] lg:text-[48px]">
                Ready to start
                <br />
                <span className="text-[#0A0A0A]/80">dropshipping?</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#0A0A0A]/70">
                Join thousands of dropshippers using Dropwiz to launch profitable Shopify stores in minutes. No design or coding skills needed.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="flex h-12 items-center gap-3 rounded-lg bg-[#0A0A0A] px-8 text-[15px] font-semibold text-[var(--dw-accent)] shadow-xl shadow-black/20 transition-all duration-300 hover:bg-[#1a1a1a]"
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
              className="relative mx-auto mt-12 max-w-3xl lg:mt-16"
            >
              <div className="relative overflow-hidden rounded-xl border border-[#0A0A0A]/10 shadow-2xl lg:rounded-2xl">
                <img
                  src="/landing/landing1.png"
                  alt="Dashboard Preview"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
