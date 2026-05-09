import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  Shield01Icon,
  ShippingTruck01Icon,
  SecurityLockIcon,
  CreditCardIcon,
  TimeQuarterIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import type { TrustData, TrustBadge, TrustVariant } from "@/types/store-sections";
import { StoreIcon } from "@/components/editor/inspectors/fields/IconPickerField";

const ICONS = [Shield01Icon, ShippingTruck01Icon, SecurityLockIcon, Award01Icon, TimeQuarterIcon, CreditCardIcon];
const DEFAULT_ICON_NAMES = ["Shield01Icon", "ShippingTruck01Icon", "SecurityLockIcon", "Award01Icon", "TimeQuarterIcon", "CreditCardIcon"];

type Props = { data: TrustData };

export const TrustSection = ({ data }: Props) => {
  const variant: TrustVariant = data.variant ?? "simple";
  switch (variant) {
    case "detailed":
      return <TrustDetailed data={data} />;
    case "timeline":
      return <TrustTimeline data={data} />;
    default:
      return <TrustSimple data={data} />;
  }
};

const PaymentBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {["visa", "mastercard", "amex", "paypal", "applepay", "gpay", "shopify"].map((p) => (
      <div
        key={p}
        className="flex h-10 w-14 items-center justify-center rounded-md"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "var(--store-bg)",
        }}
      >
        <img
          src={`/payment/${p}.png`}
          alt={p}
          className="h-5 w-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    ))}
  </div>
);

const getBadgeContent = (badge: string | TrustBadge): { icon?: string; title: string; description?: string } => {
  if (typeof badge === "string") {
    return { title: badge };
  }
  return badge;
};

const TrustSimple = ({ data }: Props) => (
  <section
    className="px-5 py-8 @3xl/store:px-12 @3xl/store:py-10"
    style={{
      borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)",
      background: "color-mix(in srgb, var(--store-text) 2%, var(--store-bg))",
    }}
  >
    <div className="mx-auto max-w-[1100px]">
      <div className="grid grid-cols-1 gap-4 @3xl/store:grid-cols-3 @3xl/store:gap-6">
        {data.badges.map((badge, i) => {
          const content = getBadgeContent(badge);
          return (
            <div
              key={i}
              className="flex items-center gap-3 @3xl/store:gap-3.5"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full @3xl/store:size-11"
                style={{
                  background: "color-mix(in oklab, var(--store-primary) 8%, transparent)",
                  color: "var(--store-primary)",
                }}
              >
                <StoreIcon
                  name={content.icon || DEFAULT_ICON_NAMES[i] || "ShieldCheckIcon"}
                  size={18}
                  className="@3xl/store:!h-[20px] @3xl/store:!w-[20px]"
                />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold @3xl/store:text-[14px]">
                  {content.title}
                </div>
                {content.description && (
                  <div className="mt-0.5 text-[11px] opacity-60 @3xl/store:text-[12px]">
                    {content.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {data.showPaymentBadges && (
        <div className="mt-6 @3xl/store:mt-8">
          <PaymentBadges />
        </div>
      )}
    </div>
  </section>
);

const TrustDetailed = ({ data }: Props) => (
  <section
    className="px-5 py-12 @3xl/store:px-12 @3xl/store:py-16"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[1100px]">
      <div className="grid grid-cols-1 gap-4 @3xl/store:grid-cols-3 @3xl/store:gap-5">
        {data.badges.map((badge, i) => {
          const content = getBadgeContent(badge);
          return (
            <div
              key={i}
              className="flex flex-col items-center p-5 text-center @3xl/store:p-6"
              style={{
                borderRadius: "var(--store-radius)",
                border: "1px solid rgba(10,10,10,0.08)",
                background: "var(--store-bg)",
              }}
            >
              <div
                className="mb-4 flex size-12 items-center justify-center rounded-full @3xl/store:size-14"
                style={{
                  background: "color-mix(in oklab, var(--store-accent) 18%, transparent)",
                  color: "var(--store-primary)",
                }}
              >
                <StoreIcon
                  name={content.icon || DEFAULT_ICON_NAMES[i] || "ShieldCheckIcon"}
                  size={22}
                  className="@3xl/store:!h-[24px] @3xl/store:!w-[24px]"
                />
              </div>
              <div className="text-[14px] font-semibold @3xl/store:text-[15px]">
                {content.title}
              </div>
              {content.description && (
                <div className="mt-1.5 text-[12px] leading-[1.5] opacity-65 @3xl/store:text-[13px]">
                  {content.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {data.showPaymentBadges && (
        <div className="mt-8 @3xl/store:mt-10">
          <PaymentBadges />
        </div>
      )}
    </div>
  </section>
);

const TrustTimeline = ({ data }: Props) => (
  <section
    className="px-5 py-12 @3xl/store:px-12 @3xl/store:py-16"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[900px]">
      {data.shippingTimeline && data.shippingTimeline.length > 0 && (
        <div className="mb-8 @3xl/store:mb-10">
          <div className="relative flex items-center justify-between">
            <div
              className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2"
              style={{ background: "color-mix(in oklab, var(--store-primary) 20%, transparent)" }}
            />
            {data.shippingTimeline.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className="mb-2 flex size-10 items-center justify-center rounded-full @3xl/store:size-12"
                  style={{
                    background: i === 0 ? "var(--store-primary)" : "var(--store-bg)",
                    color: i === 0 ? "var(--store-bg)" : "var(--store-primary)",
                    border: i === 0 ? "none" : "2px solid var(--store-primary)",
                  }}
                >
                  <StoreIcon name={step.icon} size={16} className="@3xl/store:!h-[18px] @3xl/store:!w-[18px]" />
                </div>
                <div className="text-center">
                  <div className="text-[12px] font-semibold @3xl/store:text-[13px]">
                    {step.label}
                  </div>
                  {step.date && (
                    <div className="mt-0.5 text-[10px] opacity-60 @3xl/store:text-[11px]">
                      {step.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 @3xl/store:grid-cols-3 @3xl/store:gap-5">
        {data.badges.map((badge, i) => {
          const content = getBadgeContent(badge);
          return (
            <div
              key={i}
              className="flex items-start gap-3 @3xl/store:gap-3.5"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full @3xl/store:size-10"
                style={{
                  background: "color-mix(in oklab, var(--store-primary) 10%, transparent)",
                  color: "var(--store-primary)",
                }}
              >
                <StoreIcon
                  name={content.icon || DEFAULT_ICON_NAMES[i] || "ShieldCheckIcon"}
                  size={16}
                  className="@3xl/store:!h-[18px] @3xl/store:!w-[18px]"
                />
              </div>
              <div>
                <div className="text-[13px] font-semibold @3xl/store:text-[14px]">
                  {content.title}
                </div>
                {content.description && (
                  <div className="mt-0.5 text-[11px] leading-[1.5] opacity-65 @3xl/store:text-[12px]">
                    {content.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {data.showPaymentBadges && (
        <div className="mt-8 flex justify-center @3xl/store:mt-10">
          <PaymentBadges />
        </div>
      )}
    </div>
  </section>
);
