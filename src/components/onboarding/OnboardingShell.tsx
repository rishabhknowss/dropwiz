import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";

type OnboardingShellProps = {
  children: ReactNode;
};

const VerticalTickRail = ({ side }: { side: "left" | "right" }) => (
  <div
    className={`absolute top-0 bottom-0 flex ${
      side === "left" ? "left-0 flex-row" : "right-0 flex-row-reverse"
    }`}
  >
    <div className="h-full w-px bg-[var(--dw-border)]" />
    <div className="h-full w-20 overflow-hidden border-x border-[var(--dw-border)] bg-[var(--dw-bg)]">
      <div
        className="flex flex-col"
        style={{
          height: "200%",
          animation: `tickScrollVertical${side === "right" ? "Reverse" : ""} 30s linear infinite`,
        }}
      >
        {Array.from({ length: 400 }).map((_, i) => (
          <div
            key={i}
            className="w-full border-b border-[var(--dw-border)]/40"
            style={{ height: "8px", flexShrink: 0 }}
          />
        ))}
      </div>
    </div>
    <div className="h-full w-px bg-[var(--dw-border)]" />
    <style jsx>{`
      @keyframes tickScrollVertical {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
      @keyframes tickScrollVerticalReverse {
        0% { transform: translateY(-50%); }
        100% { transform: translateY(0); }
      }
    `}</style>
  </div>
);

export const OnboardingShell = ({ children }: OnboardingShellProps) => {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[var(--dw-bg)]">
      <div className="pointer-events-none fixed top-14 bottom-0 left-0 right-0 z-[100] mx-auto hidden max-w-6xl lg:top-16 lg:block">
        <div className="relative size-full border-t border-[var(--dw-border)]">
          <VerticalTickRail side="left" />
          <VerticalTickRail side="right" />
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 shrink-0 border-b border-[var(--dw-border)]"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 lg:h-16 lg:px-8">
          <Link href="/" className="flex items-center gap-1 lg:pl-8">
            <img src="/logo.png" alt="dropwiz" className="h-7 w-auto lg:h-8" />
            <span className="text-[18px] font-bold text-[var(--dw-text)] lg:text-[20px]">dropwiz</span>
          </Link>
        </div>
      </motion.header>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16 lg:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
