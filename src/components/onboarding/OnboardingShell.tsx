import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";

type OnboardingShellProps = {
  children: ReactNode;
};

export const OnboardingShell = ({ children }: OnboardingShellProps) => {
  return (
    <div className="relative min-h-screen bg-[var(--dw-bg)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,204,0.06),transparent)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link href="/" className="text-[20px] font-bold tracking-tight text-[var(--dw-text)]">
          drop<span className="text-[var(--dw-accent)]">wiz</span>
        </Link>
        <Link
          href="/auth/signin"
          className="text-[13px] font-medium text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]"
        >
          Sign in
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-[1100px] px-5 pb-16 pt-4 md:px-8 md:pb-20 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
