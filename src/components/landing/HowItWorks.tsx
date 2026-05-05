import { motion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Import products",
    description:
      "Paste any product URL from Amazon, AliExpress, or Shopify. Our AI extracts all product data, images, and pricing automatically.",
  },
  {
    number: "02",
    title: "AI generates your store",
    description:
      "Get a fully-built product page based on proven high-converting designs. Includes AI-written copy, trust badges, FAQs, and more.",
  },
  {
    number: "03",
    title: "Publish & sell",
    description:
      "One-click publish to your Shopify store. Start accepting orders immediately with optimized product pages that convert.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[var(--dw-bg-secondary)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center lg:mb-20"
        >
          <h2 className="text-[36px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
            From URL to store
            <br />
            in 3 steps
          </h2>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8 lg:space-y-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group flex gap-6"
              >
                <div className="relative">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--dw-text)] text-[18px] font-bold text-[var(--dw-bg)] shadow-lg transition-transform group-hover:scale-110">
                    {step.number}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-1/2 top-14 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--dw-text)]/30 to-transparent" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="mb-2 text-[22px] font-bold text-[var(--dw-text)] lg:text-[26px]">
                    {step.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-[var(--dw-text-muted)]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--dw-text)]/5 to-transparent" />
            <div className="relative overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] shadow-2xl lg:rounded-3xl">
              <img
                src="/landing/landing1.png"
                alt="Workflow steps"
                className="w-full"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] px-5 py-4 shadow-2xl"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--dw-text)]/10">
                <svg className="size-6 text-[var(--dw-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[var(--dw-text)]">Available on all devices</p>
                <div className="mt-1 flex gap-2">
                  <svg className="size-4 text-[var(--dw-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <svg className="size-4 text-[var(--dw-text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12V6.75l6-1.32v6.48L3 12zm.014 6.736L9 17.878v-5.534l-5.986.848v5.544zm6.83.124L17.99 18V11.79l-8.146.987v5.083zm8.146-8.018V5.1l-8.146.89v5.016l8.146-.164zm.01 8.158l4-1.2V6.75l-4 .9v11.1z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
