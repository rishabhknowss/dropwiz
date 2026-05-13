import Link from "next/link";
import { motion } from "motion/react";

const PLANS = [
  {
    name: "Free Trial",
    description: "Build and preview unlimited stores",
    price: "0",
    features: [
      "Unlimited store designs",
      "57+ premium sections",
      "Product URL import",
      "AI-powered layouts",
      "Community support",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Dropwiz PRO",
    description: "Launch and scale your dropshipping business",
    price: "79",
    features: [
      "Everything in Free, plus:",
      "100 AI credits/month",
      "AI copywriting engine",
      "AI product images",
      "One-click Shopify publish",
      "Priority support",
    ],
    cta: "Go PRO",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="bg-[var(--dw-bg)] py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center lg:mb-14"
          >
            <h2 className="text-[28px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
              Start free,
              <br />
              scale when ready
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--dw-text-muted)]">
              Build unlimited stores for free. Upgrade to PRO when you're ready to publish and start selling.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-2">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative ${
                  plan.highlight
                    ? "bg-[var(--dw-accent)]"
                    : "border border-[var(--dw-border)] bg-[var(--dw-bg)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute right-5 top-5">
                    <span className="bg-[#0A0A0A] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4">
                    <h3
                      className={`mb-1 text-[16px] font-semibold ${
                        plan.highlight ? "text-[#0A0A0A]" : "text-[var(--dw-text)]"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-[12px] ${
                        plan.highlight ? "text-[#0A0A0A]/60" : "text-[var(--dw-text-muted)]"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-5 flex items-baseline">
                    <span
                      className={`mr-0.5 text-[14px] font-medium ${
                        plan.highlight ? "text-[#0A0A0A]" : "text-[var(--dw-text)]"
                      }`}
                    >
                      $
                    </span>
                    <span
                      className={`text-[48px] font-bold leading-none tracking-tight ${
                        plan.highlight ? "text-[#0A0A0A]" : "text-[var(--dw-text)]"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`ml-1 text-[13px] ${
                        plan.highlight ? "text-[#0A0A0A]/50" : "text-[var(--dw-text-muted)]"
                      }`}
                    >
                      /mo
                    </span>
                  </div>

                  <Link
                    href={plan.href}
                    className={`mb-5 flex w-full items-center justify-center gap-2 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                      plan.highlight
                        ? "bg-[#0A0A0A] text-white hover:bg-[#1a1a1a]"
                        : "bg-[var(--dw-text)] text-[var(--dw-bg)] hover:opacity-90"
                    }`}
                  >
                    {plan.cta}
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <div className={`mb-4 h-px ${plan.highlight ? "bg-[#0A0A0A]/10" : "bg-[var(--dw-border)]"}`} />

                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <svg
                          className={`size-3.5 shrink-0 ${
                            plan.highlight ? "text-[#0A0A0A]" : "text-[var(--dw-accent)]"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span
                          className={`text-[13px] ${
                            plan.highlight ? "text-[#0A0A0A]/80" : "text-[var(--dw-text-muted)]"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-[var(--dw-text-muted)]">
            All plans include SSL security, 99.9% uptime, and regular updates.
          </p>
        </div>
      </div>
    </section>
  );
};
