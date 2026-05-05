import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MagicWand01Icon,
  SparklesIcon,
  Store01Icon,
  Target02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";
import { cn } from "@/lib/utils";

type OnboardingModalProps = {
  userName?: string;
  onComplete: () => void;
};

const STEPS = [
  {
    id: "welcome",
    title: "Welcome to Dropwiz",
    subtitle: "Let's get you set up in under 60 seconds.",
  },
  {
    id: "how",
    title: "Here's how it works",
    subtitle: "Three simple steps to your first store.",
  },
  {
    id: "start",
    title: "Ready to build?",
    subtitle: "Create your first store now.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Target02Icon,
    title: "Paste any product URL",
    desc: "AliExpress, Amazon, Shopify, TikTok Shop — we extract everything.",
  },
  {
    icon: SparklesIcon,
    title: "AI builds your store",
    desc: "Copy, images, sections — all generated using YOUR actual product.",
  },
  {
    icon: Store01Icon,
    title: "Publish to Shopify",
    desc: "One click deploys everything. You're live in minutes.",
  },
];

export const OnboardingModal = ({ userName, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-2xl transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--dw-accent)]/50 to-transparent" />

        <div className="flex items-center justify-between border-b border-[color:var(--dw-border)] px-6 py-4">
          <DWLogo size={28} />
          <button
            onClick={handleSkip}
            className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)] transition hover:text-[color:var(--dw-text)]"
          >
            Skip
          </button>
        </div>

        <div className="relative min-h-[400px] p-8">
          {step === 0 && (
            <WelcomeStep userName={userName} onNext={handleNext} />
          )}
          {step === 1 && <HowItWorksStep onNext={handleNext} />}
          {step === 2 && <ReadyStep onComplete={handleComplete} />}
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-[color:var(--dw-border)] py-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step
                  ? "w-6 bg-[color:var(--dw-accent)]"
                  : i < step
                    ? "w-1.5 bg-[color:var(--dw-accent)]/50"
                    : "w-1.5 bg-[color:var(--dw-border)]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = ({
  userName,
  onNext,
}: {
  userName?: string;
  onNext: () => void;
}) => {
  const displayName = userName?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-[20px] bg-gradient-to-br from-[color:var(--dw-accent)] to-[color:var(--dw-citrus)]">
        <HugeiconsIcon
          icon={MagicWand01Icon}
          size={36}
          className="text-[#0a0a0a]"
        />
      </div>

      <h2 className="dw-display-sm text-[32px]">
        Hey {displayName}
        <span className="text-[color:var(--dw-accent)]">!</span>
      </h2>

      <p className="mt-3 max-w-[320px] text-[15px] leading-[1.5] text-[color:var(--dw-text-dim)]">
        Welcome to Dropwiz. Build complete Shopify stores in 60 seconds — powered by AI.
      </p>

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        {[
          ["60s", "Build time"],
          ["$0.04", "Per image"],
          ["1-click", "Publish"],
        ].map(([val, label]) => (
          <div
            key={label}
            className="rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3"
          >
            <div className="dw-display-sm text-[20px] text-[color:var(--dw-accent)]">
              {val}
            </div>
            <div className="mt-0.5 text-[11px] text-[color:var(--dw-text-muted)]">
              {label}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="mt-8 w-full gap-2">
        Get Started
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Button>
    </div>
  );
};

const HowItWorksStep = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col">
      <h2 className="dw-display-sm text-center text-[28px]">
        How it works
        <span className="text-[color:var(--dw-accent)]">.</span>
      </h2>

      <div className="mt-8 space-y-4">
        {HOW_IT_WORKS.map((item, i) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]">
              <span className="dw-mono text-[14px] font-bold">{i + 1}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[15px] font-medium">
                <HugeiconsIcon
                  icon={item.icon}
                  size={14}
                  className="text-[color:var(--dw-accent)]"
                />
                {item.title}
              </div>
              <div className="mt-1 text-[13px] leading-[1.5] text-[color:var(--dw-text-dim)]">
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="mt-8 w-full gap-2">
        Continue
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Button>
    </div>
  );
};

const ReadyStep = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full border-2 border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10">
        <HugeiconsIcon
          icon={Tick02Icon}
          size={36}
          className="text-[color:var(--dw-accent)]"
        />
      </div>

      <h2 className="dw-display-sm text-[28px]">
        You're all set
        <span className="text-[color:var(--dw-accent)]">!</span>
      </h2>

      <p className="mt-3 max-w-[320px] text-[15px] leading-[1.5] text-[color:var(--dw-text-dim)]">
        Create your first store by pasting any product URL. AI handles the rest.
      </p>

      <div className="mt-6 w-full rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
        <div className="dw-mono mb-3 text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          What you get
        </div>
        <div className="grid grid-cols-2 gap-2 text-left">
          {[
            "5 free image credits",
            "Unlimited store drafts",
            "All section variants",
            "Shopify publish",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[13px] text-[color:var(--dw-text)]"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                size={12}
                className="text-[color:var(--dw-accent)]"
              />
              {item}
            </div>
          ))}
        </div>
      </div>

      <Button asChild size="lg" className="mt-8 w-full gap-2">
        <Link href="/build/new" onClick={onComplete}>
          Build my first store
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </Button>

      <button
        onClick={onComplete}
        className="dw-mono mt-4 text-[11px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)] transition hover:text-[color:var(--dw-text)]"
      >
        I'll explore first
      </button>
    </div>
  );
};
