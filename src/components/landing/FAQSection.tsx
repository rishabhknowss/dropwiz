import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    <section id="faq" className="bg-[var(--dw-bg-secondary)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center lg:mb-16"
        >
          <h2 className="text-[36px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
            Frequently asked
            <br />
            questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-6 text-left transition-all hover:border-[var(--dw-text)]/20 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[17px] font-semibold text-[var(--dw-text)]">{faq.question}</span>
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all ${
                      openIndex === i ? "bg-[var(--dw-text)] text-[var(--dw-bg)]" : "bg-[var(--dw-bg-tertiary)] text-[var(--dw-text-muted)]"
                    }`}
                  >
                    <svg
                      className={`size-4 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[15px] leading-relaxed text-[var(--dw-text-muted)]">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
