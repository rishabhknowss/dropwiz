import { useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

const STORAGE_KEY = "dw-editor-tour-v1";

const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (typeof window !== "undefined") window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined")
      window.removeEventListener("storage", cb);
  };
};

const getSnapshot = (): boolean => {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
};

const getServerSnapshot = (): boolean => false;

const notify = () => listeners.forEach((l) => l());

type Step = {
  title: string;
  desc: string;
  target: "preview" | "strategy" | "ads";
  position: "center-left" | "left-top" | "left-top-lower";
};

const STEPS: Step[] = [
  {
    title: "This is your store",
    desc: "Click any section on the canvas to edit its copy, layout, and images.",
    target: "preview",
    position: "center-left",
  },
  {
    title: "Change strategy anytime",
    desc: "Tweak persona or angle, then regenerate all copy with one click.",
    target: "strategy",
    position: "left-top",
  },
  {
    title: "Generate ads when ready",
    desc: "10 hooks in 6 styles, ready to copy into Meta or TikTok ads manager.",
    target: "ads",
    position: "left-top-lower",
  },
];

export const OnboardingTour = ({
  onNavigate,
}: {
  onNavigate: (tab: "design" | "strategy" | "studio" | "sections" | "ads") => void;
}) => {
  const show = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [step, setStep] = useState(0);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    notify();
  };

  const next = () => {
    const current = STEPS[step];
    if (current.target === "strategy") onNavigate("strategy");
    if (current.target === "ads") onNavigate("ads");
    if (step === STEPS.length - 1) {
      close();
      return;
    }
    setStep(step + 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const positionStyles: Record<Step["position"], string> = {
    "center-left": "left-[96px] top-1/2 -translate-y-1/2",
    "left-top": "left-[72px] top-[120px]",
    "left-top-lower": "left-[72px] top-[280px]",
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
      <div
        className={`dw-reveal fixed z-[60] w-[320px] rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 shadow-2xl ${positionStyles[current.position]}`}
      >
        <div className="flex items-start justify-between">
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-accent)]">
            {String(step + 1).padStart(2, "0")} /{" "}
            {String(STEPS.length).padStart(2, "0")}
          </div>
          <button
            onClick={close}
            aria-label="Skip tour"
            className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-surface2)]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} />
          </button>
        </div>
        <div className="mt-3 text-[16px] font-medium tracking-[-0.02em]">
          {current.title}
        </div>
        <div className="mt-1.5 text-[13px] leading-[1.5] text-[color:var(--dw-text-dim)]">
          {current.desc}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={close}
            className="text-[12px] text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--dw-accent)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--dw-accent-ink)]"
          >
            {step === STEPS.length - 1 ? "Done" : "Next"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
          </button>
        </div>
      </div>
    </>
  );
};
