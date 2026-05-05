import type { HowItWorksData } from "@/types/store-sections";
import { cn } from "@/lib/utils";

type Props = { data: HowItWorksData };

export const HowItWorksSection = ({ data }: Props) => {
  const variant = data.variant ?? "cards";

  switch (variant) {
    case "timeline":
      return <HowItWorksTimeline data={data} />;
    case "numbered":
      return <HowItWorksNumbered data={data} />;
    default:
      return <HowItWorksCards data={data} />;
  }
};

const HowItWorksCards = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[1100px]">
      {data.title && (
        <h2 className="mb-8 text-center text-[26px] font-semibold tracking-[-0.02em] @3xl/store:mb-12 @3xl/store:text-[34px]">
          {data.title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 @2xl/store:grid-cols-3 @3xl/store:gap-6">
        {data.steps.map((step, i) => (
          <div
            key={i}
            className="relative overflow-hidden p-6 @3xl/store:p-8"
            style={{
              background: "color-mix(in oklab, var(--store-accent) 6%, var(--store-bg))",
              borderRadius: "var(--store-radius)",
            }}
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold @3xl/store:h-12 @3xl/store:w-12 @3xl/store:text-[18px]"
              style={{
                background: "var(--store-primary)",
                color: "var(--store-bg)",
              }}
            >
              {step.icon ?? i + 1}
            </div>
            <h3 className="mb-2 text-[17px] font-semibold @3xl/store:text-[19px]">
              {step.title}
            </h3>
            <p className="text-[14px] leading-[1.6] opacity-70 @3xl/store:text-[15px]">
              {step.description}
            </p>
            {step.imageUrl && (
              <div className="mt-4 overflow-hidden rounded-lg">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksTimeline = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[800px]">
      {data.title && (
        <h2 className="mb-10 text-center text-[26px] font-semibold tracking-[-0.02em] @3xl/store:mb-14 @3xl/store:text-[34px]">
          {data.title}
        </h2>
      )}
      <div className="relative">
        <div className="absolute left-5 top-0 hidden h-full w-px bg-black/10 @2xl/store:block @3xl/store:left-6" />
        <div className="space-y-8 @3xl/store:space-y-10">
          {data.steps.map((step, i) => (
            <div key={i} className="flex gap-5 @3xl/store:gap-8">
              <div className="relative z-10 shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold @3xl/store:h-12 @3xl/store:w-12 @3xl/store:text-[16px]"
                  style={{
                    background: "var(--store-primary)",
                    color: "var(--store-bg)",
                  }}
                >
                  {step.icon ?? i + 1}
                </div>
              </div>
              <div className="flex-1 pb-2">
                <h3 className="mb-1.5 text-[17px] font-semibold @3xl/store:text-[19px]">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.6] opacity-70 @3xl/store:text-[15px]">
                  {step.description}
                </p>
                {step.imageUrl && (
                  <div className="mt-4 max-w-[400px] overflow-hidden rounded-lg border border-black/5">
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksNumbered = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[900px]">
      {data.title && (
        <h2 className="mb-10 text-center text-[26px] font-semibold tracking-[-0.02em] @3xl/store:mb-14 @3xl/store:text-[34px]">
          {data.title}
        </h2>
      )}
      <div className="space-y-6 @3xl/store:space-y-8">
        {data.steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-5 @3xl/store:flex-row @3xl/store:items-center @3xl/store:gap-8",
              i % 2 === 1 && "@3xl/store:flex-row-reverse"
            )}
          >
            {step.imageUrl && (
              <div className="@3xl/store:w-2/5">
                <div
                  className="aspect-[4/3] overflow-hidden"
                  style={{ borderRadius: "var(--store-radius)" }}
                >
                  <img
                    src={step.imageUrl}
                    alt={step.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className={cn("flex-1", !step.imageUrl && "text-center")}>
              <div className="mb-3 flex items-center gap-3 @3xl/store:mb-4">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold @3xl/store:h-10 @3xl/store:w-10 @3xl/store:text-[15px]"
                  style={{
                    background: "var(--store-accent)",
                    color: "var(--store-primary)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium uppercase tracking-[0.1em] opacity-50 @3xl/store:text-[13px]">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-[20px] font-semibold @3xl/store:text-[24px]">
                {step.title}
              </h3>
              <p className="text-[14px] leading-[1.65] opacity-70 @3xl/store:text-[15px]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
