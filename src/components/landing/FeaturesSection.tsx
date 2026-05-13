import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

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

const ImportFeatureVisual = () => (
  <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden p-6 lg:min-h-[420px] lg:p-12">
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, #FFF5E6 0%, #FFE4C4 50%, #FFDAB3 100%)",
      }}
    />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-4 text-sm font-medium text-[var(--dw-text-muted)]">Product Import</div>
      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-[var(--dw-text)]">3</span>
        <span className="text-[var(--dw-text-muted)]">sources connected</span>
      </div>
      <div className="mb-4 flex gap-1">
        <div className="h-3 flex-[3] rounded-full bg-[#FF9900]" />
        <div className="h-3 flex-[2] rounded-full bg-[#E31837]" />
        <div className="h-3 flex-1 rounded-full bg-[var(--dw-accent)]" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#FF9900]" />
            <span className="text-sm text-[var(--dw-text)]">Amazon</span>
          </div>
          <span className="text-sm font-medium text-[var(--dw-text)]">45%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[#E31837]" />
            <span className="text-sm text-[var(--dw-text)]">AliExpress</span>
          </div>
          <span className="text-sm font-medium text-[var(--dw-text)]">35%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-[var(--dw-accent)]" />
            <span className="text-sm text-[var(--dw-text)]">CJ Dropshipping</span>
          </div>
          <span className="text-sm font-medium text-[var(--dw-text)]">20%</span>
        </div>
      </div>
    </motion.div>
  </div>
);

const AIWritingVisual = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const texts = [
    "Upgrade your everyday carry with our sleek minimalist wallet. Crafted from premium Italian leather, it holds up to 12 cards while staying slim enough to fit in your front pocket.",
    "Say goodbye to tangled cords forever. These wireless earbuds deliver studio-quality sound with 36 hours of battery life, perfect for your daily commute or workout sessions.",
    "Transform your morning routine with our smart coffee maker. Schedule your perfect brew from bed and wake up to the aroma of freshly ground beans every single day.",
  ];

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isTyping) {
      if (displayedText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, 25);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("");
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isTyping, textIndex]);

  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden p-6 lg:min-h-[420px] lg:p-12">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #FDF2F0 0%, #FCE8E4 50%, #FADDD7 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-sm font-medium text-[#CC785C]">Powered by</span>
          <div className="flex items-center gap-1.5 rounded-full bg-[#CC785C] px-3 py-1.5">
            <img src="/anthropic-1.svg" alt="Anthropic" className="h-4 w-auto brightness-0 invert" />
            <span className="text-xs font-bold text-white">Claude</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-2xl lg:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CC785C] to-[#D4917A]">
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--dw-text)]">AI Copywriter</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                {isTyping ? "Writing..." : "Done!"}
              </div>
            </div>
          </div>

          <div className="mb-4 min-h-[100px] rounded-xl bg-[#FAF5F3] p-4">
            <p className="text-sm leading-relaxed text-[var(--dw-text-secondary)]">
              {displayedText}
              <motion.span
                className="ml-0.5 inline-block h-4 w-[2px] bg-[#CC785C]"
                animate={{ opacity: isTyping ? [1, 0] : 0 }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#CC785C]/10 px-3 py-1.5 text-xs font-medium text-[#CC785C]">Headlines</span>
            <span className="rounded-full bg-[#CC785C]/10 px-3 py-1.5 text-xs font-medium text-[#CC785C]">Descriptions</span>
            <span className="rounded-full bg-[#CC785C]/10 px-3 py-1.5 text-xs font-medium text-[#CC785C]">SEO</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ShopifySyncVisual = () => {
  const [phase, setPhase] = useState<"idle" | "hovering" | "clicking" | "success">("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnimation = () => {
      setPhase("idle");
      setTimeout(() => setPhase("hovering"), 1000);
      setTimeout(() => setPhase("clicking"), 2000);
      setTimeout(() => {
        setPhase("success");
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;

          confetti({
            particleCount: 100,
            spread: 80,
            origin: { x, y },
            colors: ["#95BF47", "#5E8E3E", "#F9C74F", "#ffffff", "#22c55e"],
            startVelocity: 35,
            gravity: 0.9,
          });
        }
      }, 2300);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden p-6 lg:min-h-[420px] lg:p-12"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <motion.div
            className="absolute -right-2 -top-2 z-20"
            animate={{
              opacity: phase === "hovering" || phase === "clicking" ? 1 : 0,
              x: phase === "clicking" ? 2 : 0,
              y: phase === "clicking" ? 2 : 0,
              scale: phase === "clicking" ? 0.9 : 1,
            }}
            transition={{ duration: 0.15 }}
          >
            <svg className="size-7 drop-shadow-lg lg:size-8" viewBox="0 0 28 28" fill="none">
              <path d="M5.5 2L23 13.5L15.5 14.5L19 23L15.5 24.5L12 16L7 20.5L5.5 2Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          <motion.button
            className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[#95BF47] px-10 py-6 text-[22px] font-bold text-white lg:gap-5 lg:px-14 lg:py-8 lg:text-[32px]"
            animate={{
              scale: phase === "clicking" ? 0.96 : phase === "hovering" ? 1.02 : 1,
              boxShadow:
                phase === "success"
                  ? "0 20px 40px rgba(149, 191, 71, 0.4), 0 8px 16px rgba(0,0,0,0.1)"
                  : phase === "hovering" || phase === "clicking"
                    ? "0 16px 32px rgba(149, 191, 71, 0.35), 0 6px 12px rgba(0,0,0,0.08)"
                    : "0 12px 24px rgba(149, 191, 71, 0.25), 0 4px 8px rgba(0,0,0,0.06)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: phase === "hovering" ? 0.08 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <AnimatePresence mode="wait">
              {phase === "success" ? (
                <motion.div
                  key="success"
                  className="flex items-center gap-4 lg:gap-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Published!
                  </motion.span>
                  <motion.div
                    className="flex size-11 items-center justify-center rounded-xl bg-white/20 lg:size-14"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                  >
                    <img src="/shopify-logo.png" alt="Shopify" className="size-7 lg:size-9" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="publish"
                  className="flex items-center gap-4 lg:gap-5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <span>Publish</span>
                  <motion.div
                    className="flex size-11 items-center justify-center rounded-xl bg-white/20 lg:size-14"
                    animate={{ x: phase === "hovering" ? 3 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <img src="/shopify-logo.png" alt="Shopify" className="size-7 lg:size-9" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {phase === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-xl"
            >
              <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">Your store is live!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="overflow-x-hidden bg-[var(--dw-bg)] pb-0 pt-16 lg:pb-0 lg:pt-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center lg:mb-20"
          >
            <h2 className="text-[22px] font-bold tracking-tight text-[var(--dw-text)] sm:text-[28px] lg:text-[48px]">
              Everything you need to
              <br />
              dominate dropshipping
            </h2>
            <p className="mx-auto mt-5 max-w-[280px] text-[14px] leading-relaxed text-[var(--dw-text-muted)] sm:max-w-xl sm:text-[17px]">
              From supplier product to live Shopify store — Dropwiz handles your entire dropshipping workflow with AI automation.
            </p>
          </motion.div>

          <div>
            <TickDivider />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="-mx-4 grid overflow-hidden lg:-mx-8 lg:grid-cols-2"
            >
              <div className="flex flex-col justify-center px-6 py-10 lg:py-20 lg:pl-8 lg:pr-16">
                <h3 className="mb-4 text-[24px] font-bold leading-tight tracking-tight text-[var(--dw-text)] lg:text-[40px]">
                  Import from
                  <br />
                  any supplier
                </h3>
                <p className="mb-10 text-[16px] leading-relaxed text-[var(--dw-text-muted)] lg:text-[17px]">
                  Paste any product URL from AliExpress, Amazon, or CJ Dropshipping. Our AI extracts everything automatically.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#FF9900]/10">
                      <svg className="size-5 text-[#FF9900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">URL Import</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">Paste any product link</div>
                  </div>
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#E31837]/10">
                      <svg className="size-5 text-[#E31837]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">Auto-extract</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">Images, prices & details</div>
                  </div>
                </div>
              </div>
              <ImportFeatureVisual />
            </motion.div>

            <TickDivider />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="-mx-4 grid overflow-hidden lg:-mx-8 lg:grid-cols-2"
            >
              <div className="order-2 lg:order-1">
                <AIWritingVisual />
              </div>
              <div className="order-1 flex flex-col justify-center px-6 py-10 lg:order-2 lg:py-20 lg:pl-16 lg:pr-8">
                <h3 className="mb-4 text-[24px] font-bold leading-tight tracking-tight text-[var(--dw-text)] lg:text-[40px]">
                  Smartest AI
                  <br />
                  writes your copy
                </h3>
                <p className="mb-10 text-[16px] leading-relaxed text-[var(--dw-text-muted)] lg:text-[17px]">
                  Powered by Claude — the world&apos;s most capable AI. Generate product descriptions that convert, headlines that hook, and SEO content that ranks.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#CC785C]/10">
                      <img src="/anthropic-1.svg" alt="Anthropic" className="size-5" />
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">Claude AI</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">By Anthropic</div>
                  </div>
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-emerald-100">
                      <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">Instant copy</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">Generate in seconds</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <TickDivider />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="-mx-4 grid overflow-hidden lg:-mx-8 lg:grid-cols-2"
            >
              <div className="flex flex-col justify-center px-6 py-10 lg:py-20 lg:pl-8 lg:pr-16">
                <h3 className="mb-4 text-[24px] font-bold leading-tight tracking-tight text-[var(--dw-text)] lg:text-[40px]">
                  One-click
                  <br />
                  Shopify publish
                </h3>
                <p className="mb-10 text-[16px] leading-relaxed text-[var(--dw-text-muted)] lg:text-[17px]">
                  Push your product pages directly to Shopify. Start selling immediately with no manual work.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-emerald-100">
                      <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">Direct sync</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">Push to Shopify instantly</div>
                  </div>
                  <div>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#95BF47]/10">
                      <svg className="size-5 text-[#95BF47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="mb-1 font-semibold text-[var(--dw-text)]">Go live</div>
                    <div className="text-sm text-[var(--dw-text-muted)]">Start selling today</div>
                  </div>
                </div>
              </div>
              <ShopifySyncVisual />
            </motion.div>

            <TickDivider />
          </div>
        </div>
      </div>
    </section>
  );
};
