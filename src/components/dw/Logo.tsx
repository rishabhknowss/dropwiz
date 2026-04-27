import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  className?: string;
};

export const DWLogo = ({ size = 20, className }: LogoProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1.5"
          y="1.5"
          width="21"
          height="21"
          rx="5"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <path
          d="M7 7h6a5 5 0 015 5v0a5 5 0 01-5 5H7V7z"
          fill="currentColor"
        />
        <circle cx="16.5" cy="12" r="1.5" fill="var(--dw-accent)" />
      </svg>
      <span
        className="dw-display-sm text-foreground"
        style={{ fontSize: size * 0.85, letterSpacing: "-0.04em" }}
      >
        dropwiz
      </span>
    </div>
  );
};
