import { motion } from "motion/react";

const BRAND_LOGOS = [
  {
    alt: "Amazon",
    light: "/landing/amazon-dark.svg",
    dark: "/landing/amazon-light.svg",
  },
  {
    alt: "AliExpress",
    light: "/landing/aliexpress-dark.svg",
    dark: "/landing/aliexpress-light.svg",
  },
  {
    alt: "Shopify",
    light: "/landing/shopify-dark.svg",
    dark: "/landing/shopify-light.svg",
  },
  {
    alt: "eBay",
    light: "/landing/ebay-dark.svg",
    dark: "/landing/ebay-light.svg",
  },
  {
    alt: "TikTok",
    light: "/landing/tiktok-dark.svg",
    dark: "/landing/tiktok-light.svg",
  },
];

export const StatsBar = () => {
  return (
    <section className="overflow-x-hidden border-y border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] py-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4"
      >
        <p className="mb-8 text-center text-[13px] font-medium uppercase tracking-wider text-[var(--dw-text-subtle)]">
          Import products from top marketplaces
        </p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[var(--dw-bg-secondary)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[var(--dw-bg-secondary)] to-transparent" />

          <div className="animate-marquee pause-animation flex items-center gap-16">
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
              <div key={i} className="flex h-12 w-36 shrink-0 items-center justify-center">
                <img
                  src={logo.light}
                  alt={logo.alt}
                  className="block h-10 w-auto max-w-[120px] object-contain opacity-70 transition-opacity hover:opacity-100 dark:hidden"
                />
                <img
                  src={logo.dark}
                  alt={logo.alt}
                  className="hidden h-10 w-auto max-w-[120px] object-contain opacity-70 transition-opacity hover:opacity-100 dark:block"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
