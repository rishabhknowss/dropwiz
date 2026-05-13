import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const TickDivider = () => (
  <div className="-mx-4 overflow-hidden border-y border-[var(--dw-border)] bg-[var(--dw-bg)] lg:-mx-8">
    <div
      className="flex h-16 lg:h-24"
      style={{
        width: "200%",
        animation: "tickScroll 30s linear infinite",
      }}
    >
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={i}
          className="h-full border-r border-[var(--dw-border)]/30"
          style={{ width: "8px", flexShrink: 0 }}
        />
      ))}
    </div>
    <style jsx>{`
      @keyframes tickScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}</style>
  </div>
);

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="size-4 text-[var(--dw-accent)]"
          viewBox="0 0 20 20"
          fill={i < fullStars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < fullStars ? 0 : 1.5}
        >
          {i === fullStars && hasHalfStar ? (
            <>
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-${i})`}
                stroke="currentColor"
                strokeWidth={1}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      ))}
    </div>
  );
};

const TESTIMONIALS = [
  {
    name: "Marcus Johnson",
    role: "6-Figure Store Owner",
    image: "/testimonials/men.jpeg",
    rating: 5,
    quote: {
      highlight: "We tested multiple store builders, but Dropwiz stood out instantly. The speed, AI quality, and ease of use are unmatched.",
      faded: " It helped us reduce store setup time by over 80% while improving conversion rates.",
    },
  },
  {
    name: "Sarah Mitchell",
    role: "Full-time Dropshipper",
    image: "/testimonials/girl.jpeg",
    rating: 5,
    quote: {
      highlight: "In 5 years of dropshipping, nothing has made launching stores this easy. I tested 12 products last month and found 3 winners.",
      faded: " Dropwiz is a complete game changer for anyone serious about scaling.",
    },
  },
  {
    name: "David Chen",
    role: "E-commerce Agency",
    image: "/testimonials/men2.jpeg",
    rating: 5,
    quote: {
      highlight: "We build stores for clients daily. Dropwiz cut our delivery time from 2 weeks to 2 days.",
      faded: " Our clients are thrilled with the quality and we're significantly more profitable.",
    },
  },
  {
    name: "James Wilson",
    role: "7-Figure Seller",
    image: "/testimonials/men3.jpeg",
    rating: 5,
    quote: {
      highlight: "Built 6 stores in one weekend. My conversion rates jumped 40% compared to my old manually-built pages.",
      faded: " The AI copy actually converts and the designs look professionally made.",
    },
  },
];

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="overflow-x-hidden bg-[var(--dw-bg)] py-6 lg:py-10">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <div className="mb-6 text-sm font-medium uppercase tracking-widest text-[var(--dw-text-muted)]">
            Loved by dropshippers
          </div>

          <div className="relative min-h-[240px] lg:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="py-4 lg:py-6"
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className="size-12 overflow-hidden rounded-full lg:size-14">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="size-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-[var(--dw-text)]">
                        {testimonial.name}
                      </span>
                      <StarRating rating={testimonial.rating} />
                    </div>
                    <div className="text-sm text-[var(--dw-text-muted)]">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <blockquote className="max-w-4xl">
                  <p className="text-[20px] font-medium leading-snug tracking-tight lg:text-[36px]">
                    <span className="text-[var(--dw-text)]">
                      "{testimonial.quote.highlight}
                    </span>
                    <span className="text-[var(--dw-text-muted)]">
                      {testimonial.quote.faded}"
                    </span>
                  </p>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-[var(--dw-accent)]"
                      : "w-1.5 bg-[var(--dw-border)] hover:bg-[var(--dw-text-muted)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-12">
            <TickDivider />
          </div>
        </div>
      </div>
    </section>
  );
};
