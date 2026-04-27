import type {
  ValuePropsData,
  ValuePropsVariant,
} from "@/types/store-sections";

type Props = { data: ValuePropsData };

export const ValuePropsSection = ({ data }: Props) => {
  const variant: ValuePropsVariant = data.variant ?? "grid";
  switch (variant) {
    case "alternating":
      return <ValuePropsAlternating data={data} />;
    case "list":
      return <ValuePropsList data={data} />;
    default:
      return <ValuePropsGrid data={data} />;
  }
};

const IconBadge = ({ icon }: { icon?: string }) => (
  <div
    className="flex size-11 items-center justify-center @3xl/store:size-12"
    style={{
      borderRadius: "var(--store-radius)",
      background: "color-mix(in oklab, var(--store-accent) 18%, transparent)",
      color: "var(--store-primary)",
    }}
  >
    <span className="text-[20px] @3xl/store:text-[22px]">{icon ?? "✦"}</span>
  </div>
);

const ValuePropsGrid = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[1100px]">
      {data.title && (
        <h2 className="mb-7 text-center text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
          {data.title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-7 @3xl/store:grid-cols-3 @3xl/store:gap-8 @5xl/store:gap-10">
        {data.props.map((p, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto mb-4 inline-flex">
              <IconBadge icon={p.icon} />
            </div>
            <div className="text-[16px] font-semibold @3xl/store:text-[17px]">
              {p.title}
            </div>
            <div className="mt-2 text-[13.5px] leading-[1.55] opacity-70 @3xl/store:text-[14px]">
              {p.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ValuePropsAlternating = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[920px]">
      {data.title && (
        <h2 className="mb-9 text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-12 @3xl/store:text-[36px] @5xl/store:text-[40px]">
          {data.title}
        </h2>
      )}
      <div className="space-y-8 @3xl/store:space-y-10">
        {data.props.map((p, i) => (
          <div
            key={i}
            className={`flex flex-col items-start gap-5 @3xl/store:items-center @3xl/store:gap-6 @5xl/store:flex-row ${
              i % 2 === 1 ? "@5xl/store:flex-row-reverse" : ""
            }`}
          >
            <div className="shrink-0">
              <IconBadge icon={p.icon} />
            </div>
            <div className="flex-1">
              <div className="text-[18px] font-semibold tracking-[-0.01em] @3xl/store:text-[22px] @5xl/store:text-[24px]">
                {p.title}
              </div>
              <div className="mt-2 max-w-[520px] text-[14px] leading-[1.55] opacity-72 @3xl/store:text-[14.5px]">
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ValuePropsList = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 @3xl/store:gap-12 @5xl/store:grid-cols-[0.9fr_1.4fr]">
      <div>
        <div className="dw-mono mb-3 text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:text-[11px]">
          What you get
        </div>
        {data.title && (
          <h2 className="text-[28px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[40px] @5xl/store:text-[44px]">
            {data.title}
          </h2>
        )}
      </div>
      <div className="divide-y divide-black/5">
        {data.props.map((p, i) => (
          <div key={i} className="flex items-start gap-4 py-4 @3xl/store:py-5">
            <div
              className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "color-mix(in oklab, var(--store-primary) 8%, transparent)",
                color: "var(--store-primary)",
              }}
            >
              <span className="text-[13.5px] @3xl/store:text-[14px]">
                {p.icon ?? "✦"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold @3xl/store:text-[16px]">
                {p.title}
              </div>
              <div className="mt-1 text-[13px] leading-[1.55] opacity-72 @3xl/store:text-[13.5px]">
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
