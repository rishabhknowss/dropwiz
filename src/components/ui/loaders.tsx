import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
};

export const Skeleton = ({ className, variant = "rectangular" }: SkeletonProps) => {
  const baseClasses = "dw-skeleton";
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-[14px]",
  };

  return <div className={cn(baseClasses, variantClasses[variant], className)} />;
};

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-[2px]",
    md: "h-6 w-6 border-[2px]",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "rounded-full border-[var(--dw-border)] border-t-[var(--dw-accent)] dw-spin",
        sizeClasses[size],
        className
      )}
    />
  );
};

type PulseLoaderProps = {
  className?: string;
};

export const PulseLoader = ({ className }: PulseLoaderProps) => (
  <div className={cn("flex items-center gap-1.5", className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-2 w-2 rounded-full bg-[var(--dw-accent)]"
        style={{
          animation: "dw-bounce-subtle 1s ease-in-out infinite",
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

type ProgressLoaderProps = {
  progress?: number;
  className?: string;
  showPercentage?: boolean;
};

export const ProgressLoader = ({ progress = 0, className, showPercentage }: ProgressLoaderProps) => (
  <div className={cn("w-full", className)}>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--dw-surface2)]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-light)] transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
    {showPercentage && (
      <div className="mt-2 text-right">
        <span className="dw-mono text-[11px] text-[var(--dw-text-muted)]">
          {Math.round(progress)}%
        </span>
      </div>
    )}
  </div>
);

type GlowLoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const GlowLoader = ({ size = "md", className }: GlowLoaderProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-md dw-pulse-glow" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "rounded-full border-2 border-[var(--dw-border)] border-t-[var(--dw-accent)] dw-spin",
            size === "sm" ? "h-5 w-5" : size === "md" ? "h-7 w-7" : "h-10 w-10"
          )}
        />
      </div>
    </div>
  );
};

type CardSkeletonProps = {
  className?: string;
  hasImage?: boolean;
};

export const CardSkeleton = ({ className, hasImage = true }: CardSkeletonProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-[14px] border border-[var(--dw-border)] bg-[var(--dw-surface)]",
      className
    )}
  >
    {hasImage && <Skeleton className="aspect-[16/10] w-full rounded-none" />}
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

type StatsCardSkeletonProps = {
  className?: string;
};

export const StatsCardSkeleton = ({ className }: StatsCardSkeletonProps) => (
  <div
    className={cn(
      "rounded-[14px] border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4",
      className
    )}
  >
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-5 rounded" />
    </div>
    <Skeleton className="h-8 w-12" />
  </div>
);

type PageLoaderProps = {
  message?: string;
};

export const PageLoader = ({ message = "Loading" }: PageLoaderProps) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center gap-6">
    <GlowLoader size="lg" />
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-medium text-[var(--dw-text-muted)]">{message}</span>
      <PulseLoader />
    </div>
  </div>
);

type FullPageLoaderProps = {
  message?: string;
};

export const FullPageLoader = ({ message = "Loading" }: FullPageLoaderProps) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--dw-bg)]">
    <div className="dw-grid-pattern absolute inset-0 opacity-50" />
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-2xl" />
        <GlowLoader size="lg" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-medium text-[var(--dw-text)]">{message}</span>
        <PulseLoader />
      </div>
    </div>
  </div>
);

type StepLoaderProps = {
  steps: Array<{ id: string; label: string }>;
  currentStep: number;
  className?: string;
};

export const StepLoader = ({ steps, currentStep, className }: StepLoaderProps) => (
  <div className={cn("space-y-2", className)}>
    {steps.map((step, index) => {
      const isComplete = index < currentStep;
      const isActive = index === currentStep;
      const isPending = index > currentStep;

      return (
        <div
          key={step.id}
          className={cn(
            "flex items-center gap-3 rounded-[12px] border px-4 py-3 transition-all duration-300",
            isActive && "border-[var(--dw-accent)]/40 bg-[var(--dw-accent-subtle)]",
            isComplete && "border-[var(--dw-border)] bg-[var(--dw-surface)]",
            isPending && "border-[var(--dw-border)] bg-[var(--dw-surface)] opacity-50"
          )}
        >
          <div
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all",
              isComplete && "bg-[var(--dw-success-bg)] text-[var(--dw-success)]",
              isActive && "bg-[var(--dw-accent-subtle)] text-[var(--dw-accent)]",
              isPending && "bg-[var(--dw-surface2)] text-[var(--dw-text-subtle)]"
            )}
          >
            {isComplete ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : isActive ? (
              <Spinner size="sm" />
            ) : (
              <div className="h-1.5 w-1.5 rounded-full bg-current" />
            )}
          </div>
          <span
            className={cn(
              "text-[13px] transition-all",
              isComplete && "text-[var(--dw-text-muted)] line-through",
              isActive && "text-[var(--dw-text)] font-medium",
              isPending && "text-[var(--dw-text-muted)]"
            )}
          >
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
);
