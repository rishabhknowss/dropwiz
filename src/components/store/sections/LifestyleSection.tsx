import type { LifestyleData } from "@/types/store-sections";

export const LifestyleSection = ({ data }: { data: LifestyleData }) => {
  const imageOnRight = (data.imagePosition ?? "right") === "right";
  return (
    <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
      <div
        className={`mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-7 @3xl/store:grid-cols-2 @3xl/store:gap-10 ${
          imageOnRight ? "" : "@3xl/store:[direction:rtl]"
        }`}
      >
        <div className="@3xl/store:[direction:ltr]">
          <h2 className="text-[26px] font-medium leading-[1.1] tracking-[-0.03em] @3xl/store:text-[36px] @5xl/store:text-[44px]">
            {data.headline}
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.55] opacity-75 @3xl/store:mt-5 @3xl/store:text-[16px]">
            {data.body}
          </p>
        </div>
        <div
          className="overflow-hidden @3xl/store:[direction:ltr]"
          style={{
            borderRadius: "var(--store-radius)",
            aspectRatio: "4 / 5",
          }}
        >
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
                  "linear-gradient(135deg, var(--store-accent), var(--store-primary))",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
