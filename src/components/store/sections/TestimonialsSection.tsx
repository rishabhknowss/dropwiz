import type {
  Testimonial,
  TestimonialsData,
  TestimonialsVariant,
} from "@/types/store-sections";

type Props = { data: TestimonialsData };

export const TestimonialsSection = ({ data }: Props) => {
  const variant: TestimonialsVariant = data.variant ?? "grid";
  switch (variant) {
    case "marquee":
      return <TestimonialsMarquee data={data} />;
    case "feature":
      return <TestimonialsFeature data={data} />;
    default:
      return <TestimonialsGrid data={data} />;
  }
};

const Stars = ({ rating }: { rating: number }) => (
  <div className="text-[13px] @3xl/store:text-[14px]" style={{ letterSpacing: "2px" }}>
    {"★".repeat(Math.round(rating))}
    <span className="opacity-30">{"★".repeat(5 - Math.round(rating))}</span>
  </div>
);

const Avatar = ({ t }: { t: Testimonial }) => (
  <div
    className="size-9 shrink-0 overflow-hidden rounded-full @3xl/store:size-10"
    style={{
      background: t.avatarUrl
        ? undefined
        : "linear-gradient(135deg, var(--store-accent), var(--store-primary))",
    }}
  >
    {t.avatarUrl && (
      <img src={t.avatarUrl} alt={t.name} className="h-full w-full object-cover" />
    )}
  </div>
);

const TestimonialsGrid = ({ data }: Props) => (
  <section
    className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
    style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[1100px]">
      {data.title && (
        <h2 className="mb-7 text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
          {data.title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-3 @2xl/store:grid-cols-2 @3xl/store:gap-4 @4xl/store:grid-cols-3">
        {data.testimonials.map((t, i) => (
          <div
            key={i}
            data-card-styled
            className="flex flex-col p-5 @3xl/store:p-6"
            style={{
              borderRadius: "var(--store-radius)",
              border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
              background: "var(--store-bg)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {t.rating && (
              <div className="mb-3">
                <Stars rating={t.rating} />
              </div>
            )}
            <p className="flex-1 text-[14.5px] leading-[1.55] @3xl/store:text-[15px]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div
              className="mt-4 flex items-center gap-3 pt-4 @3xl/store:mt-5"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
            >
              <Avatar t={t} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium @3xl/store:text-[14px]">
                  {t.name}
                </div>
                {t.role && (
                  <div className="truncate text-[11.5px] opacity-60 @3xl/store:text-[12px]">
                    {t.role}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsMarquee = ({ data }: Props) => {
  const items = [...data.testimonials, ...data.testimonials];
  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        {data.title && (
          <h2 className="mb-7 text-center text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
            {data.title}
          </h2>
        )}
        <div className="relative -mx-5 overflow-hidden @3xl/store:-mx-12">
          <div
            className="flex gap-3 @3xl/store:gap-4"
            style={{
              animation: "dw-marquee 40s linear infinite",
              width: "fit-content",
            }}
          >
            {items.map((t, i) => (
              <div
                key={i}
                data-card-styled
                className="flex w-[280px] shrink-0 flex-col p-4 @3xl/store:w-[340px] @3xl/store:p-5"
                style={{
                  borderRadius: "var(--store-radius)",
                  border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
                  background: "var(--store-bg)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {t.rating && (
                  <div className="mb-2">
                    <Stars rating={t.rating} />
                  </div>
                )}
                <p className="text-[13px] leading-[1.55] opacity-85 @3xl/store:text-[14px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-3 @3xl/store:mt-4">
                  <Avatar t={t} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-medium @3xl/store:text-[13px]">
                      {t.name}
                    </div>
                    {t.role && (
                      <div className="truncate text-[10.5px] opacity-60 @3xl/store:text-[11px]">
                        {t.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsFeature = ({ data }: Props) => {
  const [hero, ...rest] = data.testimonials;
  if (!hero) return null;
  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        {data.title && (
          <div className="dw-mono mb-5 text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-6 @3xl/store:text-[11px]">
            {data.title}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 @3xl/store:gap-10 @5xl/store:grid-cols-[1.5fr_1fr]">
          <div>
            {hero.rating && (
              <div className="mb-5 @3xl/store:mb-6">
                <Stars rating={hero.rating} />
              </div>
            )}
            <p className="text-[22px] font-medium leading-[1.3] tracking-[-0.005em] @3xl/store:text-[30px] @3xl/store:leading-[1.25] @3xl/store:tracking-[-0.01em] @5xl/store:text-[36px]">
              &ldquo;{hero.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3 @3xl/store:mt-7">
              <Avatar t={hero} />
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-medium @3xl/store:text-[14px]">
                  {hero.name}
                </div>
                {hero.role && (
                  <div className="truncate text-[11.5px] opacity-60 @3xl/store:text-[12px]">
                    {hero.role}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {rest.slice(0, 3).map((t, i) => (
              <div
                key={i}
                data-card-styled
                className="flex flex-col p-3.5 @3xl/store:p-4"
                style={{
                  borderRadius: "var(--store-radius)",
                  border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
                  background: "color-mix(in srgb, var(--store-text) 2%, var(--store-bg))",
                }}
              >
                <p className="text-[13px] leading-[1.5] opacity-85 @3xl/store:text-[13.5px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Avatar t={t} />
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-medium @3xl/store:text-[12.5px]">
                      {t.name}
                    </div>
                    {t.role && (
                      <div className="truncate text-[10px] opacity-60 @3xl/store:text-[10.5px]">
                        {t.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
