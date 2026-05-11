import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: "default" | "light";
  textClassName?: string;
};

export const DWLogo = ({
  size = 28,
  className,
  showText = true,
  variant = "default",
  textClassName
}: LogoProps) => {
  const logoSrc = variant === "light" ? "/logowithbg.png" : "/logo.png";
  const textColor = variant === "light" ? "text-[#0A0A0A]" : "text-[var(--dw-text)]";

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={logoSrc}
        alt="Dropwiz"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
        <span
          className={cn("font-bold", textColor, textClassName)}
          style={{
            fontSize: size * 0.75,
            letterSpacing: "-0.02em",
          }}
        >
          Dropwiz
        </span>
      )}
    </div>
  );
};

export const DWLogoIcon = ({
  size = 32,
  className,
  variant = "default"
}: Omit<LogoProps, "showText" | "textClassName">) => {
  const logoSrc = variant === "light" ? "/logowithbg.png" : "/logo.png";

  return (
    <Image
      src={logoSrc}
      alt="Dropwiz"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
};

export const DWLogoText = ({
  size = 24,
  className,
  variant = "default"
}: {
  size?: number;
  className?: string;
  variant?: "default" | "light";
}) => {
  const textColor = variant === "light" ? "text-[#0A0A0A]" : "text-[var(--dw-text)]";

  return (
    <span
      className={cn("font-bold", textColor, className)}
      style={{
        fontSize: size,
        letterSpacing: "-0.02em",
      }}
    >
      Dropwiz
    </span>
  );
};
