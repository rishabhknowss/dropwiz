import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

const LightRays = dynamic(() => import("@/components/ui/LightRays"), {
  ssr: false,
});

export const HeroSection = () => {
  return (
    <section className="relative -mt-[86px] overflow-hidden pb-16 pt-[110px] lg:pb-24 lg:pt-[130px]">
      <div className="absolute inset-0 bg-[var(--dw-bg)]" />
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={1.2}
        rayLength={1.5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.05}
        className="opacity-50"
      />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--dw-accent)]/10 px-4 py-2"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="size-4 text-[var(--dw-accent)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[14px] font-medium text-white">
              2,500+ stores generated
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[44px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--dw-text)] sm:text-[64px] lg:text-[80px]"
          >
            The <span className="whitespace-nowrap text-[var(--dw-accent)]">#1 store builder</span>
            <br />
            for dropshippers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--dw-text-muted)] lg:text-[19px]"
          >
            Build AI stores for Shopify in minutes.
            <br />
            Store design, copywriting, image generation and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href="/get-started"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-[16px] font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-white/90"
            >
              Get started — Try for <span className="ml-1 italic">FREE</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative mt-16 lg:mt-20"
        >
          
          <div className="relative overflow-hidden rounded-2xl border-4 border-[#2a2a2a] bg-[#1a1a1a] p-3 lg:rounded-3xl lg:border-[6px] lg:p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:rounded-xl">
              <iframe
                src="https://www.youtube.com/embed/zPcnuS8HWpE?rel=0&modestbranding=1"
                title="Dropwiz Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
