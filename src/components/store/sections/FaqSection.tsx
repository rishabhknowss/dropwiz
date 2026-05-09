import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { FaqData, FaqVariant } from "@/types/store-sections";

type Props = { data: FaqData };

export const FaqSection = ({ data }: Props) => {
  const variant: FaqVariant = data.variant ?? "accordion";
  switch (variant) {
    case "two-column":
      return <FaqTwoColumn data={data} />;
    case "cards":
      return <FaqCards data={data} />;
    default:
      return <FaqAccordion data={data} />;
  }
};

const FaqAccordion = ({ data }: Props) => (
  <section
    className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[820px]">
      <h2 className="mb-7 text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
        Common questions
      </h2>
      <div>
        {data.faqs.map((f, i) => (
          <details
            key={i}
            className="group py-4 @3xl/store:py-5"
            style={{
              borderBottom: i < data.faqs.length - 1 ? "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" : "none",
            }}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-[15px] font-medium @3xl/store:text-[16px]">
              <span className="flex-1">{f.question}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={15}
                className="shrink-0 opacity-60 transition group-open:rotate-180"
              />
            </summary>
            <div className="mt-3 text-[13.5px] leading-[1.6] opacity-75 @3xl/store:text-[14px]">
              {f.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const FaqTwoColumn = ({ data }: Props) => (
  <section
    className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 @3xl/store:gap-12 @5xl/store:grid-cols-[0.9fr_1.4fr]">
      <div>
        <div className="dw-mono mb-3 text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-4 @3xl/store:text-[11px]">
          Help & FAQ
        </div>
        <h2 className="text-[28px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[40px] @5xl/store:text-[44px]">
          Everything you might want to ask.
        </h2>
        <p className="mt-3 max-w-[280px] text-[13.5px] leading-[1.55] opacity-65 @3xl/store:mt-4 @3xl/store:text-[14px]">
          Still curious? Drop us a line and we&apos;ll come back to you fast.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 @3xl/store:gap-y-7 @3xl/store:grid-cols-2">
        {data.faqs.map((f, i) => (
          <div key={i}>
            <div className="text-[14.5px] font-semibold leading-[1.4] @3xl/store:text-[15px]">
              {f.question}
            </div>
            <div className="mt-2 text-[13px] leading-[1.6] opacity-72 @3xl/store:text-[13.5px]">
              {f.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FaqCards = ({ data }: Props) => (
  <section
    className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-7 flex items-end justify-between gap-3 @3xl/store:mb-10">
        <h2 className="text-[26px] font-medium tracking-[-0.03em] @3xl/store:text-[36px] @5xl/store:text-[40px]">
          Questions?
        </h2>
        <span className="dw-mono shrink-0 text-[10px] tracking-[0.14em] uppercase opacity-55 @3xl/store:text-[11px]">
          {data.faqs.length} answers
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 @3xl/store:grid-cols-2">
        {data.faqs.map((f, i) => (
          <details
            key={i}
            data-card-styled
            className="group p-4 @3xl/store:p-5"
            style={{
              border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
              borderRadius: "var(--store-radius)",
            }}
          >
            <summary className="flex cursor-pointer items-start justify-between gap-3 text-[14px] font-semibold leading-[1.4] @3xl/store:text-[15px]">
              <span>{f.question}</span>
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full transition group-open:rotate-45"
                style={{
                  background:
                    "color-mix(in oklab, var(--store-primary) 8%, transparent)",
                  color: "var(--store-primary)",
                }}
              >
                <HugeiconsIcon icon={PlusSignIcon} size={11} />
              </span>
            </summary>
            <div className="mt-2.5 text-[13px] leading-[1.6] opacity-72 @3xl/store:mt-3 @3xl/store:text-[13.5px]">
              {f.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);
