import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  className?: string;
  showText?: boolean;
};

export const DWLogo = ({ size = 20, className, showText = true }: LogoProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Dropwiz"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
        <span
          className="dw-display-sm text-foreground"
          style={{ fontSize: size * 0.85, letterSpacing: "-0.04em" }}
        >
          dropwiz
        </span>
      )}
    </div>
  );
};

export const DWLogoIcon = ({ size = 24, className }: Omit<LogoProps, "showText">) => {
  return (
    <Image
      src="/logo.png"
      alt="Dropwiz"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
};
