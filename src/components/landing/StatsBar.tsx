import { motion } from "motion/react";

const BRAND_LOGOS = [
  { alt: "eBay", src: "/landing/ebay-light.svg" },
  { alt: "TikTok", src: "/landing/tiktok-light.svg" },
  { alt: "Amazon", src: "/landing/Amazon-logo-white.svg.png" },
  { alt: "AliExpress", src: "/landing/aliexpress-light.svg" },
  { alt: "Shopify", src: "/landing/shopify-light.svg" },
];

export const StatsBar = () => {
  return (
    <section className="bg-[var(--dw-bg)] pt-16 lg:pt-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-[12px] font-medium uppercase tracking-widest text-[var(--dw-text-subtle)] lg:mb-10"
        >
          Import products from top marketplaces
        </motion.p>

        <div className="relative -mx-4 overflow-hidden border-y border-[var(--dw-border)] lg:-mx-8">
          <div className="flex animate-marquee" style={{ "--duration": "25s" } as React.CSSProperties}>
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="flex w-[180px] shrink-0 items-center justify-center border-r border-[var(--dw-border)] py-6 lg:w-[220px] lg:py-8"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-5 w-auto max-w-[80px] object-contain brightness-0 opacity-60 lg:h-7 lg:max-w-[110px]"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
