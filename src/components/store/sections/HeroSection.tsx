import type { HeroData, HeroVariant } from "@/types/store-sections";

type Props = { data: HeroData };

export const HeroSection = ({ data }: Props) => {
  const variant: HeroVariant = data.variant ?? "split";
  switch (variant) {
    case "centered":
      return <HeroCentered data={data} />;
    case "full-bleed":
      return <HeroFullBleed data={data} />;
    case "minimal":
      return <HeroMinimal data={data} />;
    case "magazine":
      return <HeroMagazine data={data} />;
    default:
      return <HeroSplit data={data} />;
  }
};

const PrimaryCta = ({ label }: { label: string }) => (
  <button
    className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-semibold @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
      borderRadius: "var(--store-radius)",
    }}
  >
    {label}
  </button>
);

const SecondaryCta = ({ label }: { label: string }) => (
  <button
    className="inline-flex items-center gap-2 border px-5 py-3 text-[13px] font-medium @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      borderColor: "rgba(10,10,10,0.18)",
      color: "var(--store-text)",
      borderRadius: "var(--store-radius)",
    }}
  >
    {label}
  </button>
);

const Badge = ({ label }: { label: string }) => (
  <div
    className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] @3xl/store:text-[11px]"
    style={{
      background: "var(--store-accent)",
      color: "var(--store-primary)",
    }}
  >
    {label}
  </div>
);

const HeroImage = ({
  url,
  aspect = "square",
}: {
  url?: string;
  aspect?: "square" | "video" | "tall";
}) => {
  const ratio =
    aspect === "video"
      ? "aspect-[16/10]"
      : aspect === "tall"
        ? "aspect-[3/4]"
        : "aspect-square";
  return (
    <div
      className={`relative w-full overflow-hidden ${ratio}`}
      style={{ borderRadius: "var(--store-radius)" }}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
          }}
        />
      )}
    </div>
  );
};

const HeroSplit = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-10 pb-12 @3xl/store:px-12 @3xl/store:pt-20 @3xl/store:pb-24">
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 @3xl/store:grid-cols-2 @3xl/store:gap-10">
      <div>
        {data.urgencyBadge && (
          <div className="mb-5 @3xl/store:mb-6">
            <Badge label={data.urgencyBadge} />
          </div>
        )}
        <h1
          className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[52px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[64px]"
          style={{ color: "var(--store-text)" }}
        >
          {data.headline}
        </h1>
        <p className="mt-4 max-w-[520px] text-[15px] leading-[1.5] opacity-70 @3xl/store:mt-5 @3xl/store:text-[17px]">
          {data.subheadline}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 @3xl/store:mt-8">
          <PrimaryCta label={data.primaryCta} />
          {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
        </div>
        {data.socialProof && (
          <div className="mt-5 text-[12.5px] opacity-60 @3xl/store:mt-6 @3xl/store:text-[13px]">
            {data.socialProof}
          </div>
        )}
      </div>
      <HeroImage url={data.imageUrl} aspect="square" />
    </div>
  </section>
);

const HeroCentered = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-12 pb-12 @3xl/store:px-12 @3xl/store:pt-24 @3xl/store:pb-24">
    <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
      {data.urgencyBadge && (
        <div className="mb-5 @3xl/store:mb-6">
          <Badge label={data.urgencyBadge} />
        </div>
      )}
      <h1
        className="text-[36px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[60px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[72px]"
        style={{ color: "var(--store-text)" }}
      >
        {data.headline}
      </h1>
      <p className="mt-4 max-w-[620px] text-[15px] leading-[1.5] opacity-70 @3xl/store:mt-5 @3xl/store:text-[18px]">
        {data.subheadline}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 @3xl/store:mt-8">
        <PrimaryCta label={data.primaryCta} />
        {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
      </div>
      {data.socialProof && (
        <div className="mt-5 text-[12.5px] opacity-60 @3xl/store:mt-6 @3xl/store:text-[13px]">
          {data.socialProof}
        </div>
      )}
      <div className="mt-9 w-full max-w-[860px] @3xl/store:mt-12">
        <HeroImage url={data.imageUrl} aspect="video" />
      </div>
    </div>
  </section>
);

const HeroFullBleed = ({ data }: Props) => {
  const overlay = data.overlayDarkness ?? 0.45;
  const navLinks = data.navLinks ?? [];
  return (
    <section className="relative h-[88svh] min-h-[520px] w-full overflow-hidden @3xl/store:h-[100svh] @3xl/store:min-h-[640px]">
      <div className="absolute inset-0">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
            }}
          />
        )}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlay * 0.6}) 0%, rgba(0,0,0,${overlay}) 60%, rgba(0,0,0,${overlay * 1.2}) 100%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex items-center justify-between gap-3 px-5 pt-5 @3xl/store:px-12 @3xl/store:pt-6">
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-white @3xl/store:text-[15px]">
            {data.brandName ?? "Brand"}
          </span>
          <div className="hidden items-center gap-7 @3xl/store:flex">
            {navLinks.map((l, i) => (
              <a
                key={i}
                href={l.href}
                className="text-[13px] text-white/85 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-medium text-white backdrop-blur @3xl/store:px-4 @3xl/store:text-[12px]"
            style={{ borderRadius: "var(--store-radius)" }}
          >
            {data.primaryCta}
          </button>
        </nav>
        <div className="mt-auto px-5 pb-12 @3xl/store:px-12 @3xl/store:pb-24">
          <div className="max-w-[820px] text-white">
            {data.urgencyBadge && (
              <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur @3xl/store:mb-5 @3xl/store:text-[11px]">
                {data.urgencyBadge}
              </div>
            )}
            <h1 className="text-[38px] font-medium leading-[1.02] tracking-[-0.03em] @3xl/store:text-[64px] @3xl/store:leading-[1] @3xl/store:tracking-[-0.035em] @5xl/store:text-[80px]">
              {data.headline}
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.5] text-white/85 @3xl/store:mt-5 @3xl/store:text-[17px]">
              {data.subheadline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 @3xl/store:mt-7">
              <PrimaryCta label={data.primaryCta} />
              {data.secondaryCta && (
                <button
                  className="border border-white/40 px-5 py-3 text-[13px] font-medium text-white @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
                  style={{ borderRadius: "var(--store-radius)" }}
                >
                  {data.secondaryCta}
                </button>
              )}
            </div>
            {data.socialProof && (
              <div className="mt-4 text-[12.5px] text-white/70 @3xl/store:mt-5 @3xl/store:text-[13px]">
                {data.socialProof}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroMinimal = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-10 pb-10 @3xl/store:px-12 @3xl/store:pt-20 @3xl/store:pb-16">
    <div className="mx-auto max-w-[1100px]">
      {data.urgencyBadge && (
        <div className="dw-mono mb-3 text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-4 @3xl/store:text-[11px]">
          {data.urgencyBadge}
        </div>
      )}
      <div className="grid grid-cols-1 items-end gap-8 @3xl/store:grid-cols-[1.4fr_1fr] @3xl/store:gap-12">
        <h1
          className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[60px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[76px]"
          style={{ color: "var(--store-text)" }}
        >
          {data.headline}
        </h1>
        <div className="space-y-4 @3xl/store:space-y-5">
          <p className="text-[14.5px] leading-[1.55] opacity-70 @3xl/store:text-[15px]">
            {data.subheadline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryCta label={data.primaryCta} />
            {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
          </div>
          {data.socialProof && (
            <div className="text-[12px] opacity-55">{data.socialProof}</div>
          )}
        </div>
      </div>
      {data.imageUrl && (
        <div className="mt-8 @3xl/store:mt-10">
          <HeroImage url={data.imageUrl} aspect="video" />
        </div>
      )}
    </div>
  </section>
);

const HeroMagazine = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-10 pb-14 @3xl/store:px-12 @3xl/store:pt-16 @3xl/store:pb-20">
    <div className="mx-auto max-w-[1200px]">
      <div className="dw-mono mb-6 flex items-center justify-between text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-8 @3xl/store:text-[11px]">
        <span>{data.urgencyBadge ?? "Volume 01"}</span>
        <span>{data.brandName ?? "Editorial"}</span>
      </div>
      <div
        className="overflow-hidden"
        style={{ borderRadius: "var(--store-radius)" }}
      >
        <div className="relative aspect-[4/5] w-full @3xl/store:aspect-[16/9]">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 @3xl/store:mt-10 @3xl/store:grid-cols-[1.5fr_1fr] @3xl/store:gap-10">
        <h1
          className="text-[36px] font-medium leading-[1.02] tracking-[-0.035em] @3xl/store:text-[68px] @3xl/store:leading-[1] @3xl/store:tracking-[-0.04em] @5xl/store:text-[88px]"
          style={{
            fontFamily: "var(--store-font-display)",
            color: "var(--store-text)",
          }}
        >
          {data.headline}
        </h1>
        <div className="border-t border-black/15 pt-4 text-[14.5px] leading-[1.55] opacity-75 @3xl/store:pt-5 @3xl/store:text-[15px]">
          <p>{data.subheadline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 @3xl/store:mt-6">
            <PrimaryCta label={data.primaryCta} />
            {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
          </div>
          {data.socialProof && (
            <div className="mt-4 text-[12px] opacity-55 @3xl/store:mt-5">
              {data.socialProof}
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);
