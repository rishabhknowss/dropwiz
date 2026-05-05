import { motion } from "motion/react";

const ImportFeatureVisual = () => (
  <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dw-accent)]/10 to-[var(--dw-accent)]/5">
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-14 items-center justify-center rounded-xl bg-[var(--dw-surface)] shadow-lg">
          <svg className="size-8" viewBox="0 0 24 24" fill="none">
            <path d="M15.5 9.5L11 14l-3-3" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#FF9900" strokeWidth="2"/>
          </svg>
        </div>
        <span className="text-[10px] font-medium text-[var(--dw-text-muted)]">Amazon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-14 items-center justify-center rounded-xl bg-[var(--dw-surface)] shadow-lg">
          <svg className="size-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#E31837"/>
            <path d="M2 17l10 5 10-5" stroke="#E31837" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12l10 5 10-5" stroke="#E31837" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[10px] font-medium text-[var(--dw-text-muted)]">AliExpress</span>
      </div>
      <svg className="size-6 text-[var(--dw-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-14 items-center justify-center rounded-xl bg-[var(--dw-accent)] shadow-lg">
          <svg className="size-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-[var(--dw-accent)]">Dropwiz</span>
      </div>
    </div>
  </div>
);

const AIWritingVisual = () => (
  <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
    <div className="w-full max-w-[200px] space-y-3 px-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF] p-1.5">
          <svg className="size-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-[var(--dw-accent)]">AI Writing...</span>
      </div>
      <div className="space-y-2 rounded-xl bg-[var(--dw-surface)] p-3 shadow-lg">
        <div className="h-2 w-full animate-pulse rounded bg-[var(--dw-accent)]/20" />
        <div className="h-2 w-4/5 animate-pulse rounded bg-[var(--dw-accent)]/15" />
        <div className="h-2 w-3/5 animate-pulse rounded bg-[var(--dw-accent)]/10" />
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-full bg-[var(--dw-surface)] px-2 py-0.5 text-[9px] font-medium text-[var(--dw-success)] shadow">Headlines</span>
        <span className="rounded-full bg-[var(--dw-surface)] px-2 py-0.5 text-[9px] font-medium text-[var(--dw-warning)] shadow">FAQs</span>
        <span className="rounded-full bg-[var(--dw-surface)] px-2 py-0.5 text-[9px] font-medium text-[var(--dw-accent)] shadow">Copy</span>
      </div>
    </div>
  </div>
);

const ShopifySyncVisual = () => (
  <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dw-success)]/10 to-[var(--dw-success)]/5">
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--dw-surface)] shadow-lg">
          <img src="/shopify-logo.png" alt="Shopify" className="size-10" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-[var(--dw-success)] text-white shadow"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </div>
      <div className="space-y-1.5">
        <div className="text-[13px] font-bold text-[var(--dw-text)]">Published!</div>
        <div className="text-[11px] text-[var(--dw-text-muted)]">your-store.myshopify.com</div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--dw-success)]">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--dw-success)]" />
          Live now
        </div>
      </div>
    </div>
  </div>
);

const FEATURES = [
  {
    title: "AI-powered product pages",
    description: "Paste any product URL and get a complete, high-converting product page in seconds.",
    Visual: ImportFeatureVisual,
  },
  {
    title: "Smart copy generation",
    description: "Our AI writes compelling product descriptions, headlines, and FAQs that sell.",
    Visual: AIWritingVisual,
  },
  {
    title: "One-click Shopify sync",
    description: "Publish directly to your Shopify store with a single click. No manual work.",
    Visual: ShopifySyncVisual,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="overflow-x-hidden bg-[var(--dw-bg)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center lg:mb-20"
        >
          <h2 className="text-[36px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
            Everything you need to
            <br />
            build winning stores
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--dw-text-muted)]">
            From product import to published store — Dropwiz handles it all with
            AI-powered automation.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-[var(--dw-bg-secondary)] transition-all hover:shadow-xl"
            >
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br from-[var(--dw-accent)]/5 to-[var(--dw-accent)]/10 blur-2xl transition-all group-hover:scale-150" />

              <div className="relative overflow-hidden p-3">
                <feature.Visual />
              </div>

              <div className="relative p-6 pt-4">
                <h3 className="mb-2 text-[18px] font-bold text-[var(--dw-text)]">{feature.title}</h3>
                <p className="text-[15px] leading-relaxed text-[var(--dw-text-muted)]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid gap-6 lg:grid-cols-2 lg:gap-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF] p-8 text-white lg:p-10">
            <div className="absolute -right-20 -top-20 size-60 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-[13px] font-medium">Multi-store</span>
              </div>
              <h3 className="mb-4 text-[26px] font-bold lg:text-[32px]">Manage multiple stores</h3>
              <p className="max-w-md text-[16px] leading-relaxed text-white/70">
                Create and manage unlimited Shopify stores from one dashboard. Perfect for agencies and power sellers.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[var(--dw-bg-secondary)] p-8 lg:p-10">
            <div className="absolute -right-20 -top-20 size-60 rounded-full bg-[var(--dw-success)]/10 blur-3xl" />
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--dw-success)]/10 px-4 py-2">
                <svg className="size-5 text-[var(--dw-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[13px] font-medium text-[var(--dw-text)]">Optimized</span>
              </div>
              <h3 className="mb-4 text-[26px] font-bold text-[var(--dw-text)] lg:text-[32px]">Built-in conversion optimization</h3>
              <p className="max-w-md text-[16px] leading-relaxed text-[var(--dw-text-muted)]">
                Every page is optimized for conversions with trust badges, urgency timers, and proven layouts that drive sales.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
