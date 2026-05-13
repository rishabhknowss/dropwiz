import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const TickDivider = () => (
  <div className="-mx-4 overflow-hidden border-y border-[var(--dw-border)] bg-[var(--dw-bg)] lg:-mx-8">
    <div
      className="flex h-16 lg:h-24"
      style={{
        width: "200%",
        animation: "tickScroll 30s linear infinite",
      }}
    >
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={i}
          className="h-full border-r border-[var(--dw-border)]/30"
          style={{ width: "8px", flexShrink: 0 }}
        />
      ))}
    </div>
    <style jsx>{`
      @keyframes tickScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}</style>
  </div>
);

const FAQS = [
  {
    question: "What is Dropwiz?",
    answer:
      "Dropwiz is the fastest way to launch a dropshipping store. Paste any product URL from AliExpress, Amazon, or any supplier — our AI builds a complete, high-converting Shopify product page with professional copy and design.",
  },
  {
    question: "Which suppliers does Dropwiz support?",
    answer:
      "Dropwiz works with any product URL. Import from AliExpress, Amazon, CJ Dropshipping, Temu, 1688, Alibaba, or any e-commerce site. Our AI extracts product data, images, and variants automatically.",
  },
  {
    question: "How does product import work?",
    answer:
      "Simply paste a product URL. Our AI scrapes the product title, description, images, variants, and pricing. Then it generates persuasive sales copy, trust badges, FAQs, and a conversion-optimized layout — all in under 60 seconds.",
  },
  {
    question: "How do credits work?",
    answer:
      "Credits power AI features like copywriting, image generation, and store builds. Each store generation uses credits based on complexity. PRO subscribers get a monthly credit allowance that resets each billing cycle. You can purchase additional credits anytime if you need more.",
  },
  {
    question: "Can I publish directly to Shopify?",
    answer:
      "Yes! Connect your Shopify store with one click. Dropwiz pushes your product pages directly to your store, complete with products, images, and optimized content. No copy-pasting required.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! Start free and build unlimited store designs. The free plan includes 57+ premium sections and AI-powered layouts. Upgrade to PRO when you're ready to publish to Shopify and unlock AI copywriting.",
  },
  {
    question: "Can I run multiple dropshipping stores?",
    answer:
      "Absolutely. Create and manage unlimited stores from one dashboard. Test multiple niches, scale your winners, and manage everything in one place.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--dw-bg)]">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <TickDivider />

          <div className="-mx-4 bg-[var(--dw-bg-secondary)] lg:-mx-8">
            <div className="grid gap-8 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--dw-border)] bg-[var(--dw-bg)] px-4 py-2">
                <div className="size-2 rounded-full bg-[var(--dw-accent)]" />
                <span className="text-[13px] font-medium text-[var(--dw-text)]">FAQ</span>
              </div>
              <h2 className="text-[28px] font-bold leading-tight tracking-tight text-[var(--dw-text)] lg:text-[40px]">
                Frequently Asked
                <br />
                Questions
              </h2>
            </motion.div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full border border-[var(--dw-border)] bg-[var(--dw-bg)] p-5 text-left transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[15px] font-semibold text-[var(--dw-text)]">{faq.question}</span>
                      <svg
                        className={`size-5 shrink-0 text-[var(--dw-text-muted)] transition-transform duration-200 ${
                          openIndex === i ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-[14px] leading-relaxed text-[var(--dw-text-muted)]">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
