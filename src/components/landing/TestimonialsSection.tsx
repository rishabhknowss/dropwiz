import { motion } from "motion/react";

const StarRating = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="size-3 text-[var(--dw-warning)] sm:size-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Full-time Dropshipper",
    quote: "In 5 years of dropshipping, nothing has made launching stores this easy. I tested 12 products last month and found 3 winners. Dropwiz is a game changer.",
    avatar: "/testimonials/sarah.jpg",
  },
  {
    name: "Marcus Webb",
    role: "7-Figure Store Owner",
    quote: "Built 6 stores in one weekend. My conversion rates jumped 40% compared to my old manually-built pages. The AI copy actually converts.",
    avatar: "/testimonials/marcus.jpg",
  },
  {
    name: "Jessica Park",
    role: "Dropshipping Agency",
    quote: "We build stores for clients. Dropwiz cut our delivery time from 2 weeks to 2 days. Our clients are thrilled and we're more profitable.",
    avatar: "/testimonials/jessica.jpg",
  },
  {
    name: "David Miller",
    role: "6-Figure Seller",
    quote: "I used to spend hours building product pages. Now I import from AliExpress and launch in minutes. More time for ads, more money in my pocket.",
    avatar: "/testimonials/david.jpg",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="overflow-x-hidden bg-[var(--dw-bg)] px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center lg:mb-20"
        >
          <h2 className="text-[36px] font-bold tracking-tight text-[var(--dw-text)] lg:text-[48px]">
            Loved by dropshippers
            <br />
            worldwide
          </h2>
        </motion.div>

        <div className="group/marquee relative overflow-hidden">
          <div className="flex animate-marquee gap-4 group-hover/marquee:[animation-play-state:paused] sm:gap-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="group w-[200px] shrink-0 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-3 transition-all hover:border-[var(--dw-accent)]/30 hover:shadow-xl sm:w-[280px] sm:rounded-3xl sm:p-6"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[var(--dw-bg-tertiary)] sm:mb-4 sm:rounded-2xl">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <StarRating />
                <div className="mb-2 mt-2 sm:mb-3 sm:mt-3">
                  <h3 className="text-[13px] font-bold text-[var(--dw-text)] sm:text-[16px]">{t.name}</h3>
                  <p className="text-[11px] text-[var(--dw-text-muted)] sm:text-[13px]">{t.role}</p>
                </div>
                <p className="line-clamp-3 text-[12px] leading-relaxed text-[var(--dw-text-muted)] sm:text-[14px]">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-[var(--dw-accent)] p-6 text-center sm:mt-16 sm:rounded-3xl sm:p-8 lg:p-12"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-block rounded-full bg-[#0A0A0A]/10 px-3 py-1.5 text-[12px] font-medium text-[#0A0A0A] sm:mb-6 sm:px-4 sm:py-2 sm:text-[13px]">
              From the founder
            </div>
            <blockquote className="mb-6 text-[16px] font-medium leading-relaxed text-[#0A0A0A] sm:mb-8 sm:text-[20px] lg:text-[24px]">
              &ldquo;We built Dropwiz because launching a dropshipping store shouldn't take weeks. Our users are launching stores in minutes and scaling to 6 figures. That's what drives us.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#0A0A0A]/20 bg-[#0A0A0A]/10 text-[16px] font-bold text-[#0A0A0A] sm:size-14 sm:text-[20px]">
                D
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-[#0A0A0A] sm:text-base">Dropwiz Team</p>
                <p className="text-[12px] text-[#0A0A0A]/60 sm:text-[14px]">Powering 2,500+ dropshipping stores</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
