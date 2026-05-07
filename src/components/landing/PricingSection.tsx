import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free Trial",
    description: "Everything you need to get started",
    price: "$0",
    features: [
      "Unlimited store creation",
      "57+ premium sections",
      "Fresh sections monthly",
      "Basic product import",
      "Community support",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Dropwiz PRO",
    description: "For serious sellers ready to scale",
    price: "$79",
    features: [
      "Everything in Free, plus:",
      "Unlimited AI copywriter",
      "AI image generation",
      "One-click product import",
      "Publish to Shopify",
      "Priority support",
    ],
    cta: "Upgrade to PRO",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="bg-[var(--dw-bg)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center lg:mb-16"
        >
          <h2 className="text-[36px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
            Simple, transparent
            <br />
            pricing
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--dw-text-muted)]">
            Start free and upgrade when you're ready to publish. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative rounded-3xl p-8 transition-all lg:p-10",
                plan.highlight
                  ? "bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF] text-white"
                  : "border border-[var(--dw-border)] bg-[var(--dw-surface)] hover:border-[var(--dw-accent)]/20 hover:shadow-xl"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-[var(--dw-accent)] shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={cn(
                    "mb-2 text-[20px] font-bold",
                    plan.highlight ? "text-white" : "text-[var(--dw-text)]"
                  )}
                >
                  {plan.name}
                </h3>
                <p className={cn("text-[14px]", plan.highlight ? "text-white/70" : "text-[var(--dw-text-muted)]")}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className={cn("text-[56px] font-bold tracking-tight", plan.highlight ? "text-white" : "text-[var(--dw-text)]")}>
                  {plan.price}
                </span>
                <span className={cn("text-[16px]", plan.highlight ? "text-white/60" : "text-[var(--dw-text-muted)]")}>
                  /month
                </span>
              </div>

              <Button
                asChild
                className={cn(
                  "mb-8 w-full rounded-xl py-6 text-[15px] font-semibold transition-all duration-300",
                  plan.highlight
                    ? "bg-white text-[var(--dw-text)] shadow-lg shadow-black/10 hover:!bg-[var(--dw-text)] hover:!text-white hover:shadow-2xl hover:shadow-black/30 hover:scale-[1.03]"
                    : "bg-[var(--dw-text)] text-[var(--dw-bg)] shadow-lg shadow-black/20 hover:opacity-90 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.03]"
                )}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <div>
                <p className={cn("mb-4 text-[13px] font-medium", plan.highlight ? "text-white/80" : "text-[var(--dw-text-muted)]")}>
                  Included features:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        className={cn("size-5 shrink-0", plan.highlight ? "text-white" : "text-[var(--dw-accent)]")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={cn("text-[15px]", plan.highlight ? "text-white/80" : "text-[var(--dw-text-muted)]")}>
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
    </section>
  );
};
