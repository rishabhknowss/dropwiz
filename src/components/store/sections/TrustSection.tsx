import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  Shield01Icon,
  ShippingTruck01Icon,
  SecurityLockIcon,
} from "@hugeicons/core-free-icons";
import type { TrustData } from "@/types/store-sections";

const ICONS = [Shield01Icon, ShippingTruck01Icon, SecurityLockIcon];

export const TrustSection = ({ data }: { data: TrustData }) => (
  <section className="border-t border-black/5 bg-black/[0.02] px-5 py-8 @3xl/store:px-12 @3xl/store:py-10">
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-3 @3xl/store:grid-cols-3 @3xl/store:gap-4">
      {data.badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 text-[13.5px] @3xl/store:gap-3 @3xl/store:text-[14px]"
        >
          <HugeiconsIcon
            icon={ICONS[i] ?? Tick02Icon}
            size={17}
            className="shrink-0 opacity-70"
          />
          <span>{badge}</span>
        </div>
      ))}
    </div>
  </section>
);
