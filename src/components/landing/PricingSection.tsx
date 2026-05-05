import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    description: "For new dropshippers getting started",
    price: { monthly: "$19", yearly: "$15" },
    features: [
      "1 Shopify store connection",
      "25 AI-generated pages/month",
      "Basic product import",
      "Standard templates",
      "Email support",
      "Community access",
    ],
    cta: "Get Started",
    href: "/auth/signup?plan=starter",
    highlight: false,
  },
  {
    name: "Pro",
    description: "For serious sellers scaling up",
    price: { monthly: "$49", yearly: "$39" },
    features: [
      "3 Shopify store connections",
      "Unlimited AI-generated pages",
      "Advanced product import",
      "Premium templates & customization",
      "Priority email & chat support",
      "Analytics dashboard",
    ],
    cta: "Get Started",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    description: "For agencies & power sellers",
    price: { monthly: "$99", yearly: "$79" },
    features: [
      "Unlimited store connections",
      "Unlimited AI-generated pages",
      "White-label options",
      "Team collaboration tools",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Get Started",
    href: "/auth/signup?plan=agency",
    highlight: false,
  },
];

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="bg-[var(--dw-bg)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
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
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--dw-bg-tertiary)] p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "rounded-full px-5 py-2.5 text-[14px] font-medium transition-all",
                !isYearly ? "bg-[var(--dw-surface)] text-[var(--dw-text)] shadow-sm" : "text-[var(--dw-text-muted)]"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all",
                isYearly ? "bg-[var(--dw-surface)] text-[var(--dw-text)] shadow-sm" : "text-[var(--dw-text-muted)]"
              )}
            >
              Yearly
              <span className="rounded-full bg-[var(--dw-text)] px-2 py-0.5 text-[11px] font-bold text-[var(--dw-bg)]">
                20% off
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
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
              <div className="mb-8">
                <h3
                  className={cn(
                    "mb-2 text-[18px] font-bold",
                    plan.highlight ? "text-white" : "text-[var(--dw-text)]"
                  )}
                >
                  {plan.name}
                </h3>
                <p className={cn("text-[14px]", plan.highlight ? "text-white/60" : "text-[var(--dw-text-muted)]")}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className={cn("text-[48px] font-bold", plan.highlight ? "text-white" : "text-[var(--dw-text)]")}>
                  {isYearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className={cn("text-[15px]", plan.highlight ? "text-white/60" : "text-[var(--dw-text-muted)]")}>
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
      </div>
    </section>
  );
};
