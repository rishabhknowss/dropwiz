import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    question: "What is Dropwiz?",
    answer:
      "Dropwiz is an AI-powered platform that helps you create high-converting Shopify stores in minutes. Simply import a product URL, and our AI generates professional product pages with optimized copy, images, and trust elements.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your account will remain active until the end of your billing period.",
  },
  {
    question: "Does Dropwiz work with Shopify?",
    answer:
      "Yes! Dropwiz integrates directly with Shopify. You can connect your store and publish your generated product pages with a single click.",
  },
  {
    question: "How does the AI store generation work?",
    answer:
      "Simply paste a product URL from Amazon, AliExpress, or any e-commerce site. Our AI scrapes the product data, analyzes successful stores, and generates a complete product page with headlines, descriptions, FAQs, and trust badges.",
  },
  {
    question: "Does Dropwiz come with a trial?",
    answer:
      "Yes! You can try Dropwiz with our free plan and get access to core features. Upgrade anytime to unlock more capabilities.",
  },
  {
    question: "Can I manage multiple stores?",
    answer:
      "Absolutely. Depending on your plan, you can create and manage multiple stores. Our Pro and Business plans offer unlimited store creation.",
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
