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
    role: "E-commerce Entrepreneur",
    quote: "In my 5 years of dropshipping, I've never seen anything make building stores as easy as Dropwiz. If you're not using it, you're wasting time.",
    avatar: "/testimonials/sarah.jpg",
  },
  {
    name: "Marcus Webb",
    role: "Shopify Store Owner",
    quote: "With Dropwiz, everything just clicks. I built 6 stores in a weekend. It's saved me countless hours and my conversion rates are up 40%.",
    avatar: "/testimonials/marcus.jpg",
  },
  {
    name: "Jessica Park",
    role: "Agency Owner",
    quote: "Dropwiz is extremely efficient when it comes to building product pages. It's saved me so much time, money, and unnecessary headache!",
    avatar: "/testimonials/jessica.jpg",
  },
  {
    name: "David Miller",
    role: "6-Figure Seller",
    quote: "I used to waste hours on product pages manually. Dropwiz lets me focus on what matters - marketing and growing my business.",
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
          className="mt-10 rounded-2xl bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF] p-6 text-center sm:mt-16 sm:rounded-3xl sm:p-8 lg:p-12"
        >
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white sm:mb-6 sm:px-4 sm:py-2 sm:text-[13px]">
              From the founder
            </div>
            <blockquote className="mb-6 text-[16px] font-medium leading-relaxed text-white sm:mb-8 sm:text-[20px] lg:text-[24px]">
              &ldquo;We built Dropwiz to help entrepreneurs launch stores faster. Seeing thousands of successful stores built on our platform is incredibly rewarding.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-[16px] font-bold text-white sm:size-14 sm:text-[20px]">
                D
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-white sm:text-base">Dropwiz Team</p>
                <p className="text-[12px] text-white/60 sm:text-[14px]">Building the future of e-commerce</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
