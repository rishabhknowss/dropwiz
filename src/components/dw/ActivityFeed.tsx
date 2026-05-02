"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type ActivityEvent = {
  id: string;
  icon: string;
  label: string;
  sub: string;
  tone?: "default" | "live" | "ai" | "ship" | "stripe";
};

const TONE_STYLES: Record<NonNullable<ActivityEvent["tone"]>, string> = {
  default: "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]",
  ai: "bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]",
  live: "bg-[color:var(--dw-jade)]/15 text-[color:var(--dw-jade)]",
  ship: "bg-[color:var(--dw-citrus)]/14 text-[color:var(--dw-citrus)]",
  stripe: "bg-[#635BFF]/15 text-[#635BFF]",
};

export const ActivityFeed = ({
  events,
  interval = 1500,
  visible = 4,
}: {
  events: ActivityEvent[];
  interval?: number;
  visible?: number;
}) => {
  const [head, setHead] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHead((h) => h + 1), interval);
    return () => clearInterval(t);
  }, [interval]);

  const stack = Array.from({ length: visible }, (_, i) => {
    const cycle = head + i;
    const event = events[cycle % events.length];
    return { ...event, slotKey: `${cycle}-${event.id}` };
  }).reverse();

  return (
    <div className="relative w-full">
      <AnimatePresence initial={false} mode="popLayout">
        {stack.map((item) => (
          <motion.div
            key={item.slotKey}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 36,
              opacity: { duration: 0.18 },
            }}
            className="mb-1.5 last:mb-0"
          >
            <div className="flex items-center gap-2.5 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2.5 py-2 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.3)]">
              <div
                className={`grid size-7 shrink-0 place-items-center rounded-md text-[14px] ${TONE_STYLES[item.tone ?? "default"]}`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium text-[color:var(--dw-text)]">
                  {item.label}
                </div>
                <div className="truncate text-[10px] text-[color:var(--dw-text-muted)]">
                  {item.sub}
                </div>
              </div>
              <span className="dw-mono shrink-0 text-[9px] tracking-[0.1em] text-[color:var(--dw-text-muted)]">
                now
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const DROPWIZ_ACTIVITY: ActivityEvent[] = [
  { id: "import", icon: "🔍", label: "Product imported", sub: "Pro Whey Protein · $49.00", tone: "default" },
  { id: "persona", icon: "🧠", label: "Persona generated", sub: "Fitness enthusiast, 25–35", tone: "ai" },
  { id: "copy", icon: "✨", label: "Hero copy written", sub: "3 variants · Claude Sonnet", tone: "ai" },
  { id: "hero-img", icon: "🎨", label: "Hero image rendered", sub: "47s · Seedream v4.5", tone: "ai" },
  { id: "stripe1", icon: "💰", label: "Sarah earned $2,847", sub: "Stripe · just now", tone: "stripe" },
  { id: "bundle", icon: "🧱", label: "Bundles section added", sub: "Showcase layout · 3 tiers", tone: "default" },
  { id: "faq", icon: "💬", label: "FAQ generated", sub: "8 questions · Cards layout", tone: "default" },
  { id: "stripe2", icon: "💰", label: "James earned $1,249", sub: "Stripe · 2m ago", tone: "stripe" },
  { id: "lifestyle", icon: "📸", label: "Lifestyle image", sub: "62s · img2img preserved product", tone: "ai" },
  { id: "ad", icon: "🎯", label: "Static ad created", sub: "Story 9:16 · Premium · $0.04", tone: "ai" },
  { id: "stripe3", icon: "💰", label: "Emma earned $4,392", sub: "Stripe · 5m ago", tone: "stripe" },
  { id: "ad2", icon: "🟩", label: "Static ad created", sub: "Feed 4:5 · Standard · $0.04", tone: "ai" },
  { id: "tier", icon: "🛍️", label: "Pricing tier set", sub: "Pro $49 · bundle save 30%", tone: "default" },
  { id: "stripe4", icon: "💰", label: "Marcus earned $892", sub: "Stripe · 8m ago", tone: "stripe" },
  { id: "palette", icon: "⚡", label: "Theme palette tuned", sub: "Lime + cream · WCAG AA", tone: "default" },
  { id: "publish", icon: "🚀", label: "Published to Shopify", sub: "Online Store · channel active", tone: "ship" },
  { id: "stripe5", icon: "💰", label: "Aisha earned $3,156", sub: "Stripe · 12m ago", tone: "stripe" },
  { id: "block", icon: "🧩", label: "Theme block placed", sub: "Default product template", tone: "ship" },
  { id: "live", icon: "✅", label: "Store active", sub: "dropwiz-test.myshopify.com", tone: "live" },
  { id: "stripe6", icon: "💰", label: "Chris earned $5,234", sub: "Stripe · 15m ago", tone: "stripe" },
];
