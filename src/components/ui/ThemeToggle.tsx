import { useTheme } from "@/lib/theme-context";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun02Icon, Moon02Icon } from "@hugeicons/core-free-icons";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--dw-bg-tertiary)] ${className ?? ""}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <HugeiconsIcon
        icon={theme === "dark" ? Sun02Icon : Moon02Icon}
        size={18}
        className="text-[var(--dw-text-muted)]"
      />
    </button>
  );
};
