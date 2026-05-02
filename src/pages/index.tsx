import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { api } from "@/utils/api";
import {
  ArrowRight01Icon,
  PlayIcon,
  Target02Icon,
  FlashIcon,
  MagicWand01Icon,
  Layers01Icon,
  Globe02Icon,
  Tick02Icon,
  Grid02Icon,
  Store01Icon,
  PackageIcon,
  ChartIcon,
  CreditCardIcon,
  SparklesIcon,
  LinkSquare01Icon,
  ShoppingBag03Icon,
  PackageDeliveredIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";
import { DWLogo } from "@/components/dw/Logo";
import { FeatureViz, type VizKind } from "@/components/dw/FeatureViz";
import { FlowStepViz, type FlowVizKind } from "@/components/dw/FlowStepViz";
import { CtaAtmosphere } from "@/components/dw/CtaAtmosphere";
import { FakeBuildModal } from "@/components/dw/FakeBuildModal";
import { Backlight } from "@/components/ui/backlight";
import { Marquee } from "@/components/ui/marquee";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Source = "shopify" | "supplier" | "competitor" | "ai";

type Feature = {
  title: string;
  desc: string;
  icon: typeof Target02Icon;
  span: number;
  viz: VizKind;
};

const FEATURES: Feature[] = [
  {
    title: "One URL. One minute. One store.",
    desc: "Paste any product link — AliExpress, Amazon, your supplier. AI scrapes everything, writes conversion copy, generates pro-grade imagery, and builds your entire storefront. Ready to sell.",
    icon: MagicWand01Icon,
    span: 2,
    viz: "timer",
  },
  {
    title: "Your product. AI-perfect photos.",
    desc: "Unlike generic AI, Dropwiz runs img2img on YOUR actual product. Every hero shot, lifestyle image, and ad creative preserves your exact packaging, colors, and brand.",
    icon: SparklesIcon,
    span: 1,
    viz: "loop",
  },
  {
    title: "Watch the magic happen.",
    desc: "Real-time activity feed: product scraped, copy generated, sections built, store published. Every step streamed live. Transparency you can trust.",
    icon: Layers01Icon,
    span: 1,
    viz: "sections",
  },
  {
    title: "Scroll-stopping ads. Instantly.",
    desc: "Select your format. AI generates photorealistic creatives with your product and your hook. Professional ad campaigns in seconds, not days. From $0.04 per image.",
    icon: PlayIcon,
    span: 2,
    viz: "ads",
  },
  {
    title: "One-click Shopify deployment.",
    desc: "Product, variants, images, and your complete design — all pushed to Shopify instantly. Works with Dawn and every 2.0 theme. No code. No hassle.",
    icon: Store01Icon,
    span: 2,
    viz: "winners",
  },
  {
    title: "Share before you ship.",
    desc: "Every store gets a live preview URL. Share with your team, clients, or partners. Test on desktop, tablet, mobile. Ship when it's perfect.",
    icon: Globe02Icon,
    span: 1,
    viz: "platforms",
  },
];

const FLOW_STEPS: Array<{
  num: string;
  title: string;
  desc: string;
  viz: FlowVizKind;
}> = [
  {
    num: "01",
    title: "Drop a link. Any link.",
    desc: "AliExpress, Amazon, Shopify, TikTok Shop — paste the URL and Dropwiz extracts everything: title, images, pricing, specs. 10 seconds flat.",
    viz: "url",
  },
  {
    num: "02",
    title: "AI does the heavy lifting.",
    desc: "Your target persona. Killer angles. Hero headlines. Bundle offers. FAQs. Studio-quality images. Complete storefront built by AI, designed by pros.",
    viz: "build",
  },
  {
    num: "03",
    title: "Tweak until it's perfect.",
    desc: "Drag sections. Swap designs. Regenerate images. Test every viewport. Your store, your way. No design skills needed.",
    viz: "edit",
  },
  {
    num: "04",
    title: "Ship it. Start selling.",
    desc: "One click publishes everything to Shopify. Products, variants, images, metafields — all synced. Add the block to your theme once. You're live.",
    viz: "publish",
  },
];

const TESTIMONIALS = [
  {
    quote: "We went from 3-day launches to 20-minute launches. The AI uses OUR actual product in every image. Game changer.",
    name: "Marie Laurent",
    role: "Agency Owner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Fired my freelance designer. Dropwiz generates scroll-stopping ads in 30 seconds with MY product colors.",
    name: "Dev Patel",
    role: "7-Figure Dropshipper",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "My agency used to spend days tweaking themes. Now we focus on strategy while Dropwiz handles execution.",
    name: "Sana Kim",
    role: "E-commerce Consultant",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "Built 12 stores in one weekend. Each one looks like a $10k custom Shopify build. My clients can't tell.",
    name: "Marcus Chen",
    role: "Store Builder",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote: "The AI-generated product shots saved me $2,000 on photography alone. Studio quality, zero effort.",
    name: "Priya Sharma",
    role: "Brand Owner",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    quote: "Went from idea to first sale in under 3 hours. This tool is insane for testing new niches fast.",
    name: "Jake Morrison",
    role: "Serial Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    quote: "Our conversion rate jumped 34% after switching to Dropwiz-generated pages. The copy just hits different.",
    name: "Lisa Wang",
    role: "Growth Lead",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    quote: "Finally a tool that understands dropshipping. No more generic themes — every store feels premium.",
    name: "Omar Hassan",
    role: "Dropship Mentor",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const STORE_SHOWCASES = [
  { name: "Nimbus Posture", category: "Health & Wellness", template: "Clean DTC", image: "/stores/store-1.png" },
  { name: "GlowSkin Co", category: "Beauty", template: "Editorial", image: "/stores/store-2.png" },
  { name: "Peak Focus", category: "Supplements", template: "Bold Sale", image: "/stores/store-3.png" },
  { name: "Terra Roots", category: "Organic", template: "Forest", image: "/stores/store-4.png" },
  { name: "Volt Energy", category: "Energy", template: "Midnight", image: "/stores/store-5.png" },
  { name: "SereneNight", category: "Sleep", template: "Calm", image: "/stores/store-6.png" },
  { name: "AquaPure", category: "Hydration", template: "Clean DTC", image: "/stores/store-7.png" },
  { name: "IronCore", category: "Fitness", template: "Bold Sale", image: "/stores/store-8.png" },
  { name: "ZenMind", category: "Mindfulness", template: "Minimal", image: "/stores/store-9.png" },
  { name: "VitaBoost", category: "Vitamins", template: "Warm", image: "/stores/store-10.png" },
  { name: "FlexJoint", category: "Joint Health", template: "Forest", image: "/stores/store-11.png" },
  { name: "LuxeCollagen", category: "Anti-Aging", template: "Premium", image: "/stores/store-12.png" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    sub: "forever",
    features: [
      "3 draft stores",
      "All section variants",
      "50 AI copy + image generations / mo",
      "Dropwiz watermark on /p/<slug>",
    ],
    cta: "Start free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$79",
    sub: "/ month",
    features: [
      "Unlimited stores",
      "Unlimited AI copy + imagery",
      "Unlimited static ads",
      "Shopify publish (TAE)",
      "No watermark · custom subdomain",
      "Priority support",
    ],
    cta: "Go Pro",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$199",
    sub: "/ month",
    features: [
      "Everything in Pro",
      "Client workspaces · unlimited seats",
      "White-label storefronts",
      "Concierge onboarding",
      "Dedicated Slack channel",
    ],
    cta: "Book a call",
    href: "mailto:hello@dropwiz.ai",
    highlight: false,
  },
];

const Home = () => {
  const [url, setUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [source, setSource] = useState<Source>("supplier");
  const [showBuildModal, setShowBuildModal] = useState(false);

  const me = api.auth.me.useQuery();
  const isLoggedIn = !!me.data;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (source === "ai") {
      if (!aiPrompt.trim()) {
        toast.error("Describe your product");
        return;
      }
      setShowBuildModal(true);
      return;
    }

    if (!url.trim()) {
      toast.error("Enter a product URL");
      return;
    }
    if (!url.startsWith("http")) {
      toast.error("Enter a valid URL starting with http");
      return;
    }
    setShowBuildModal(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active={isLoggedIn ? "Product" : "Product"}
        items={isLoggedIn ? [
          { label: "Product", href: "/" },
          { label: "Stores", href: "/app/stores" },
          { label: "New store", href: "/build/new" },
        ] : undefined}
        ctaLabel={isLoggedIn ? "My stores" : "Build free"}
        ctaHref={isLoggedIn ? "/app/stores" : "/auth/signup"}
        secondaryLabel={isLoggedIn ? undefined : "Sign in"}
        secondaryHref={isLoggedIn ? undefined : "/auth/signin"}
      />

      {showBuildModal && (
        <FakeBuildModal
          mode={source === "ai" ? "ai" : "url"}
          url={source !== "ai" ? url : undefined}
          aiPrompt={source === "ai" ? aiPrompt : undefined}
          source={source}
          onClose={() => setShowBuildModal(false)}
        />
      )}

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-5 sm:pb-16 sm:pt-14 md:px-8 md:pb-24 md:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[96px]">
        <div className="dw-bloom -right-[200px] -top-[200px]" />
        <div className="dw-grid-bg absolute inset-0 opacity-40" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <div className="dw-reveal mb-5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#1a3d2a] bg-[#0d1f15] py-1.5 pl-2 pr-3 sm:mb-6 sm:gap-2 md:mb-8 md:gap-2.5 md:pl-2.5 md:pr-4">
            <span className="flex shrink-0 items-center gap-0.5 text-[#22c55e]">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="size-3 md:size-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="truncate text-[12px] font-medium text-[#fafaf7] md:text-[13px]">
              <span className="text-[#22c55e]">100k+</span> stores generated
            </span>
          </div>

          <h1
            className="dw-reveal dw-display max-w-[1000px] text-[36px] leading-[1.05] sm:text-[48px] md:text-[68px] lg:text-[84px]"
            style={{ animationDelay: "40ms" }}
          >
            Build stores that
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            <span className="text-[color:var(--dw-accent)]">print money</span>
            <span className="text-[color:var(--dw-text-muted)]">.</span>
          </h1>

          <p
            className="dw-reveal mt-5 max-w-[640px] px-2 text-[14px] leading-[1.55] tracking-[-0.01em] text-[color:var(--dw-text-dim)] sm:px-0 sm:text-[15px] md:mt-8 md:text-[17px] md:leading-[1.45] md:tracking-[-0.015em] lg:text-[19px]"
            style={{ animationDelay: "80ms" }}
          >
            Paste any product URL. AI generates a complete Shopify store in 60 seconds — with conversion copy, studio-quality images, and ads that actually convert.
          </p>

          <form
            onSubmit={handleSubmit}
            className="dw-reveal mt-6 w-full max-w-[640px] sm:mt-8 md:mt-10"
            style={{ animationDelay: "120ms" }}
          >
            <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-1">
              {(
                [
                  { id: "supplier", label: "Supplier", icon: PackageDeliveredIcon },
                  { id: "competitor", label: "Competitor", icon: Store01Icon },
                  { id: "ai", label: "AI Prompt", icon: MagicWand01Icon },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium transition sm:py-1.5",
                    source === s.id
                      ? "bg-[color:var(--dw-accent)] text-[color:var(--dw-accent-ink)]"
                      : "bg-[color:var(--dw-surface)] text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface2)]"
                  )}
                >
                  <HugeiconsIcon icon={s.icon} size={12} />
                  {s.label}
                </button>
              ))}
            </div>
            {source === "ai" ? (
              <div className="space-y-3">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your product... e.g. 'Premium wireless earbuds with noise cancellation, sleek black design, for audiophiles and commuters'"
                  rows={3}
                  className="w-full resize-none rounded-[16px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-4 py-3 text-[14px] placeholder:text-[color:var(--dw-text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--dw-accent)]/50"
                />
                <Button type="submit" size="lg" className="h-12 w-full gap-2 rounded-full text-[14px] font-medium">
                  <HugeiconsIcon icon={MagicWand01Icon} size={14} />
                  Generate store
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={LinkSquare01Icon}
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
                  />
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste any product URL..."
                    className="h-12 w-full rounded-full bg-[color:var(--dw-surface)] pl-11 pr-4 text-[14px] placeholder:text-[color:var(--dw-text-muted)]"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 w-full gap-2 rounded-full px-6 text-[14px] font-medium sm:w-auto">
                  Build store
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </div>
            )}
          </form>

          <div className="dw-reveal mt-4 flex flex-col items-center justify-center gap-2 sm:mt-5 sm:flex-row sm:gap-3" style={{ animationDelay: "140ms" }}>
            <span className="text-[13px] text-[color:var(--dw-text-muted)]">or</span>
            <Link
              href="/auth/signin?redirect=connect-shopify"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-5 py-2.5 text-[14px] font-medium text-[color:var(--dw-text)] transition hover:bg-[color:var(--dw-surface2)] sm:w-auto"
            >
              <img src="/shopify-logo.png" alt="Shopify" className="size-5" />
              Connect your Shopify store
            </Link>
          </div>

          {/* hero video w/ backlight */}
          <div
            className="dw-reveal relative mt-12 w-full overflow-hidden md:mt-20"
            style={{ animationDelay: "200ms" }}
          >
            <Backlight blur={30} className="w-full">
              <iframe
                className="mx-auto aspect-video w-full max-w-[960px] rounded-[14px] border border-[color:var(--dw-border)] md:rounded-[20px]"
                src="https://www.youtube.com/embed/9CJLtzzUphU?autoplay=1&mute=1&loop=1&playlist=9CJLtzzUphU&controls=0&showinfo=0&rel=0&modestbranding=1"
                title="Dropwiz product demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </Backlight>
          </div>

          {/* stats bar */}
          <div className="mt-12 grid w-full grid-cols-2 gap-y-6 border-y border-[color:var(--dw-border)] py-6 text-left md:mt-16 md:grid-cols-4 md:gap-y-0 md:py-7">
            {[
              ["100k+", "stores generated"],
              ["$4.2M+", "merchant revenue"],
              ["4.9★", "average rating"],
              ["60s", "median build time"],
            ].map(([n, l], i) => (
              <div
                key={i}
                className={cn(
                  "px-4 md:px-8",
                  i % 2 === 1 && "border-l border-[color:var(--dw-border)]",
                  "md:[&:not(:first-child)]:border-l md:border-[color:var(--dw-border)]",
                )}
              >
                <div className="dw-display-sm text-[24px] md:text-[32px]">{n}</div>
                <div className="mt-1 text-[12px] text-[color:var(--dw-text-muted)] md:text-[13px]">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPATIBLE PLATFORMS */}
      <section className="overflow-hidden border-t border-[color:var(--dw-border)] py-10 md:py-14">
        <div className="dw-mono mb-6 text-center text-[10px] uppercase tracking-[0.18em] text-[color:var(--dw-text-muted)] md:mb-8 md:text-[11px]">
          Import from any platform
        </div>
        <div className="relative">
          <Marquee className="[--duration:30s] [--gap:5rem]" pauseOnHover>
            <PlatformLogo src="https://www.pngall.com/wp-content/uploads/15/Amazon-Logo-White.png" alt="Amazon" />
            <PlatformLogo src="https://framerusercontent.com/images/Ah6ouOqy89Y3fCJFT6n7CHJMc.png?scale-down-to=512" alt="AliExpress" />
            <PlatformLogo src="https://framerusercontent.com/images/SdBTKnXfyIOFsxjXldr2Vfl7Uw.png?width=400" alt="Etsy" />
            <PlatformLogo src="https://framerusercontent.com/images/sxj87CkW4ny1z0RxKvSRRm2HSo.png?width=214" alt="TikTok Shop" />
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[color:var(--dw-bg)] to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--dw-bg)] to-transparent md:w-32" />
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="product"
        className="border-t border-[color:var(--dw-border)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            The unfair advantage for
            <span className="text-[color:var(--dw-accent)]"> winning.</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* STORE SHOWCASE */}
      <section className="border-t border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[100px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm mb-4 max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            Stores built with
            <span className="text-[color:var(--dw-accent)]"> Dropwiz.</span>
          </h2>
          <p className="mb-10 max-w-[600px] text-[15px] leading-[1.5] text-[color:var(--dw-text-dim)] md:mb-14 md:text-[17px]">
            Every template. Every niche. Real stores launched in minutes, not weeks.
          </p>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {STORE_SHOWCASES.map((store, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="group relative overflow-hidden rounded-[16px] border border-[color:var(--dw-border)] shadow-lg">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        {store.template}
                      </div>
                      <div className="text-[18px] font-semibold tracking-[-0.02em] text-white">
                        {store.name}
                      </div>
                      <div className="mt-0.5 text-[13px] text-white/70">
                        {store.category}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden md:flex" />
            <CarouselNext className="right-2 hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* FLOW - Commented out per request
      <section className="border-t border-[color:var(--dw-border)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            From idea to income in
            <span className="text-[color:var(--dw-accent)]"> 60 seconds.</span>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-4">
            {FLOW_STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div className="mb-5">
                  <FlowStepViz kind={step.viz} />
                </div>
                <div className="dw-mono mb-3 text-[11px] tracking-[0.14em] text-[color:var(--dw-accent)] md:mb-4">
                  {step.num}
                </div>
                <div className="mb-2 text-[18px] font-medium tracking-[-0.015em] md:text-[20px]">
                  {step.title}
                </div>
                <div className="text-[14px] leading-[1.55] text-[color:var(--dw-text-dim)]">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* TESTIMONIALS */}
      <section className="overflow-hidden border-t border-[color:var(--dw-border)] py-16 md:py-24 lg:py-[100px]">
        <div className="mx-auto mb-10 max-w-[1200px] px-5 md:mb-14 md:px-8 lg:px-10">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            Loved by
            <span className="text-[color:var(--dw-accent)]"> 10,000+ merchants.</span>
          </h2>
        </div>
        <div className="relative">
          <Marquee className="[--duration:50s] [--gap:1rem]" pauseOnHover>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="w-[340px] shrink-0 rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5"
              >
                <div className="mb-5 text-[14px] leading-[1.55] text-[color:var(--dw-text)]">
                  &ldquo;{t.quote}&rdquo;
                </div>
                <div className="flex items-center gap-3 border-t border-[color:var(--dw-border)] pt-4">
                  <img
                    src={t.avatar}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[13px] font-medium">{t.name}</div>
                    <div className="text-[11px] text-[color:var(--dw-text-muted)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          <Marquee reverse className="mt-4 [--duration:55s] [--gap:1rem]" pauseOnHover>
            {[...TESTIMONIALS].reverse().map((t, i) => (
              <div
                key={i}
                className="w-[340px] shrink-0 rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5"
              >
                <div className="mb-5 text-[14px] leading-[1.55] text-[color:var(--dw-text)]">
                  &ldquo;{t.quote}&rdquo;
                </div>
                <div className="flex items-center gap-3 border-t border-[color:var(--dw-border)] pt-4">
                  <img
                    src={t.avatar}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[13px] font-medium">{t.name}</div>
                    <div className="text-[11px] text-[color:var(--dw-text-muted)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[color:var(--dw-bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[color:var(--dw-bg)] to-transparent" />
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="border-t border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]"
      >
        <div className="mx-auto max-w-[1100px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            Start free. Pay when it prints.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <PricingCard key={i} plan={p} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-[color:var(--dw-border)] px-5 py-20 md:px-8 md:py-28 lg:px-10 lg:py-[140px]">
        <CtaAtmosphere />
        <div className="relative z-10 mx-auto max-w-[900px] text-center">
          <h2 className="dw-display text-[44px] sm:text-[56px] md:text-[72px] lg:text-[88px]">
            Stop theming.
            <br />
            Start shipping
            <span className="text-[color:var(--dw-accent)]">.</span>
          </h2>
          <div className="mt-8 flex justify-center md:mt-10">
            <Button asChild size="lg" className="h-12 px-6 text-[14px] font-medium">
              <Link href="/auth/signup">
                Build a store free
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[color:var(--dw-border)] px-5 pb-9 pt-12 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 md:flex md:flex-wrap md:items-start md:justify-between md:gap-10">
          <div className="max-w-[300px]">
            <DWLogo size={18} />
            <div className="mt-3.5 text-[13px] leading-[1.5] text-[color:var(--dw-text-muted)]">
              The operator&apos;s storefront stack. Made in SF & Paris.
            </div>
          </div>
          {(
            [
              ["Product", [
                ["Features", "/#product"],
                ["Pricing", "/#pricing"],
                ["Demo Stores", "/demo/stores"],
              ]],
              ["Get Started", [
                ["Sign Up", "/auth/signup"],
                ["Sign In", "/auth/signin"],
                ["Build Store", "/build/new"],
              ]],
              ["Company", [
                ["Contact", "mailto:hello@dropwiz.ai"],
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
              ]],
            ] as const
          ).map(([h, links]) => (
            <div key={h}>
              <div className="dw-mono mb-3.5 text-[11px] uppercase tracking-[0.14em] text-[color:var(--dw-text-muted)]">
                {h}
              </div>
              <div className="flex flex-col gap-2.5">
                {links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-[13px] text-[color:var(--dw-text-dim)] transition hover:text-[color:var(--dw-text)]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-[color:var(--dw-border)] pt-6 text-xs text-[color:var(--dw-text-muted)]">
          <span>© 2026 Dropwiz Inc.</span>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="transition hover:text-[color:var(--dw-text)]"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="transition hover:text-[color:var(--dw-text)]"
            >
              Terms
            </a>
            <span className="dw-mono">v2.4.1 — shipped today</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[320px] flex-col overflow-hidden rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 md:min-h-[380px] md:p-7",
        feature.span === 2 ? "md:col-span-2" : "md:col-span-1",
      )}
    >
      <div className="mb-auto flex size-9 items-center justify-center rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-accent)]">
        <HugeiconsIcon icon={feature.icon} size={17} />
      </div>
      <div className="my-5">
        <FeatureViz kind={feature.viz} />
      </div>
      <div className="mt-auto">
        <div className="mb-1.5 text-[19px] font-medium tracking-[-0.02em]">
          {feature.title}
        </div>
        <div className="max-w-[460px] text-[14px] leading-[1.5] text-[color:var(--dw-text-dim)]">
          {feature.desc}
        </div>
      </div>
    </div>
  );
};

type Plan = (typeof PLANS)[number];

const PricingCard = ({ plan }: { plan: Plan }) => {
  return (
    <div
      className={cn(
        "relative rounded-[20px] border p-6 md:p-8",
        plan.highlight
          ? "border-[color:var(--dw-accent)] bg-[#0A0A0A] text-[#FAFAF7]"
          : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] text-[color:var(--dw-text)]",
      )}
    >
      {plan.highlight && (
        <DWChip variant="accent" className="absolute right-5 top-5">
          Most popular
        </DWChip>
      )}
      <div
        className={cn(
          "mb-1 text-[14px] font-medium",
          plan.highlight ? "text-white/60" : "text-[color:var(--dw-text-dim)]",
        )}
      >
        {plan.name}
      </div>
      <div className="mb-6 flex items-baseline gap-1">
        <span className="dw-display-sm text-[48px]">{plan.price}</span>
        <span
          className={cn(
            "text-sm",
            plan.highlight ? "text-white/60" : "text-[color:var(--dw-text-muted)]",
          )}
        >
          {plan.sub}
        </span>
      </div>
      <div className="mb-7 flex min-h-[180px] flex-col gap-2.5">
        {plan.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5 text-[13.5px]">
            <HugeiconsIcon
              icon={Tick02Icon}
              size={14}
              className="mt-0.5 shrink-0 text-[color:var(--dw-accent)]"
            />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <Button
        asChild
        variant={plan.highlight ? "default" : "outline"}
        className={cn(
          "w-full",
          plan.highlight &&
            "bg-[color:var(--dw-accent)] text-[#0A0A0A] hover:bg-[color:var(--dw-accent)]/90",
        )}
      >
        <Link href={plan.href}>{plan.cta}</Link>
      </Button>
    </div>
  );
};

const HeroProductMock = () => {
  return (
    <div className="grid min-h-[520px] grid-cols-[220px_1fr_320px]">
      {/* sidebar */}
      <div className="border-r border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] p-[18px]">
        <div className="mb-5 flex items-center gap-2">
          <DWLogo size={14} />
        </div>
        {(
          [
            ["Overview", Grid02Icon],
            ["Stores", Store01Icon],
            ["Products", PackageIcon],
            ["Ad creatives", PlayIcon],
            ["Analytics", ChartIcon],
            ["Billing", CreditCardIcon],
          ] as const
        ).map(([label, Icon], i) => (
          <div
            key={label}
            className={cn(
              "mb-0.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px]",
              i === 1
                ? "bg-[color:var(--dw-surface)] text-[color:var(--dw-text)]"
                : "text-[color:var(--dw-text-dim)]",
            )}
          >
            <HugeiconsIcon
              icon={Icon}
              size={13}
              className={
                i === 1
                  ? "text-[color:var(--dw-accent)]"
                  : "text-[color:var(--dw-text-muted)]"
              }
            />
            {label}
          </div>
        ))}
      </div>

      {/* canvas */}
      <div className="flex flex-col gap-3.5 p-5">
        <div className="flex items-center gap-2.5 text-xs text-[color:var(--dw-text-dim)]">
          <span>Stores</span>
          <span className="opacity-50">/</span>
          <span className="text-[color:var(--dw-text)]">Nimbus Posture</span>
          <DWChip variant="live">live</DWChip>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Preview
          </Button>
          <Button size="sm" className="h-7 text-xs">
            Publish
          </Button>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)]">
          <MiniStorefront />
        </div>
      </div>

      {/* inspector */}
      <div className="flex flex-col gap-3.5 border-l border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] p-[18px]">
        <div className="dw-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--dw-text-muted)]">
          Hero · Section 01
        </div>
        <div>
          <div className="mb-1 text-[11px] text-[color:var(--dw-text-muted)]">
            Headline
          </div>
          <div className="rounded-md border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2.5 py-2 text-[13px]">
            Fix your slouch in 14 days.
          </div>
        </div>
        <div>
          <div className="mb-1 text-[11px] text-[color:var(--dw-text-muted)]">
            AI variants
          </div>
          {[
            "End back pain without surgery.",
            "The posture fix doctors recommend.",
            "Stand taller by Friday.",
          ].map((v) => (
            <div
              key={v}
              className="mb-1 cursor-pointer rounded-md px-2.5 py-1.5 text-[12.5px] text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface)]"
            >
              {v}
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-1 w-full gap-1.5 text-xs">
            <HugeiconsIcon icon={SparklesIcon} size={12} />
            Generate 3 more
          </Button>
        </div>
        <div className="mt-auto border-t border-[color:var(--dw-border)] pt-3.5">
          <div className="mb-2 text-[11px] text-[color:var(--dw-text-muted)]">
            Agent activity · tonight
          </div>
          {[
            "Testing 3 hero variants",
            "Rewriting FAQ for SEO",
            "Optimizing image alt text",
          ].map((x) => (
            <div
              key={x}
              className="mb-1 flex items-start gap-2 text-[11.5px] text-[color:var(--dw-text-dim)]"
            >
              <span className="mt-1.5 size-1 rounded-full bg-[color:var(--dw-accent)]" />
              {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MiniStorefront = () => {
  return (
    <div className="flex flex-col gap-2.5 p-3.5 text-[10px] text-[color:var(--dw-text-dim)]">
      <div className="flex justify-between border-b border-[color:var(--dw-border)] pb-2 text-[10px]">
        <span className="text-[11px] font-semibold text-[color:var(--dw-text)]">
          NIMBUS
        </span>
        <div className="flex gap-3.5">
          <span>Shop</span>
          <span>Science</span>
          <span>Reviews</span>
          <span className="text-[color:var(--dw-text)]">Bag · 1</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 py-2">
        <div>
          <div className="text-[22px] font-medium leading-[1.05] tracking-[-0.02em] text-[color:var(--dw-text)]">
            Fix your slouch in 14 days.
          </div>
          <div className="mt-2 text-[10px] leading-[1.45]">
            Soft-touch brace, 4-step posture memory training. Backed by 12k reviews.
          </div>
          <div className="mt-2.5 flex gap-1.5">
            <div className="rounded-sm bg-[color:var(--dw-text)] px-2.5 py-1 text-[9px] font-semibold text-[color:var(--dw-bg)]">
              ADD TO BAG — $49
            </div>
            <div className="rounded-sm border border-[color:var(--dw-border)] px-2.5 py-1 text-[9px] text-[color:var(--dw-text)]">
              14-day trial
            </div>
          </div>
          <div className="mt-2.5 text-[9px] tracking-[0.03em] text-[color:var(--dw-text-muted)]">
            ★ ★ ★ ★ ★ &nbsp; 4.9 / 12,481 reviews
          </div>
        </div>
        <div
          className="relative rounded-lg"
          style={{
            aspectRatio: "1.1",
            background:
              "linear-gradient(135deg, var(--dw-border-strong), color-mix(in oklab, var(--dw-accent) 10%, var(--dw-surface2)))",
          }}
        >
          <div className="absolute left-2 top-2 rounded-sm bg-[color:var(--dw-accent)] px-1.5 py-0.5 text-[8px] font-semibold text-[color:var(--dw-accent-ink)]">
            BEST SELLER
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Clinically tested", "30-day fit guarantee", "Free US shipping"].map((x) => (
          <div
            key={x}
            className="rounded-md border border-[color:var(--dw-border)] p-2 text-[10px]"
          >
            <div className="mb-1 size-3 rounded-sm bg-[color:var(--dw-accent)]" />
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

const PlatformLogo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex h-14 items-center px-6 opacity-70 transition-opacity hover:opacity-100">
    <div className="rounded-lg bg-[#0a0a0a] px-4 py-2 dark:bg-transparent">
      <img
        src={src}
        alt={alt}
        className="h-6 w-auto max-w-[140px] object-contain md:h-8"
        loading="lazy"
      />
    </div>
  </div>
);

const TechLogo = ({ name }: { name: string }) => {
  const logos: Record<string, React.ReactNode> = {
    Shopify: (
      <svg className="h-8 w-auto" viewBox="0 0 109 40" fill="currentColor">
        <path d="M25.9 8.4c0-.1-.1-.2-.2-.2s-.3 0-.5 0c0 0-1-.1-1.7-.1-.5-.5-1.1-1-1.9-1.3 0 0 0 0 0-.1-.4-.2-.9-.3-1.4-.4-.2-.6-.5-1.1-.9-1.5-1-1.1-2.4-1.6-4.1-1.5-1.1 0-2.1.3-3 .7-.9.5-1.6 1.1-2.1 1.9-.6.9-.9 1.9-1.1 3.1-.2 1-.2 2.1-.1 3.2.1.8.3 1.5.5 2.1.2.5.4 1 .7 1.4l-1.9 0c-.2 0-.3.1-.4.2l-.7 2.2c0 .1 0 .3.1.4s.2.2.4.2h2.4l-2.2 7.5c-.4 1.3-.3 2.5.4 3.4.6.8 1.6 1.3 2.9 1.3 1 0 1.9-.2 2.8-.7.1-.1.2-.2.2-.4l.5-1.9c0-.2 0-.3-.1-.4-.1-.1-.3-.2-.4-.1-.5.2-1 .4-1.5.4-.5 0-.9-.1-1.1-.4-.2-.3-.3-.7-.1-1.2l2.3-7.5h3.2c.2 0 .3-.1.4-.2l.7-2.2c0-.1 0-.3-.1-.4s-.2-.2-.4-.2h-3c.3-1.5.8-2.6 1.5-3.4.5-.5 1-.9 1.6-1.1.5-.2 1.1-.3 1.7-.2.4 0 .8.1 1.1.2.3.1.5.2.7.4.1.1.3.1.4.1.1 0 .3-.1.3-.2l1-1.9c.1-.2.1-.4 0-.5zm29.8 9.5c-.6-.3-1.3-.6-2-.8-.8-.3-1.4-.5-1.7-.7-.3-.2-.5-.4-.5-.8 0-.3.1-.5.4-.7.3-.2.7-.3 1.2-.3s1 .1 1.5.3c.4.2.8.4 1.1.7.1.1.3.1.4.1.1 0 .3-.1.3-.2l.9-1.7c.1-.2.1-.4-.1-.6-.4-.3-.9-.6-1.5-.8-.7-.2-1.4-.4-2.2-.4-1.3 0-2.4.3-3.2 1-.8.7-1.3 1.6-1.3 2.7 0 .9.2 1.6.7 2.2.5.5 1.3 1 2.5 1.4.8.3 1.4.5 1.8.7.4.2.5.5.5.9 0 .4-.2.6-.5.8-.3.2-.8.3-1.4.3-.6 0-1.2-.1-1.7-.4-.5-.2-.9-.5-1.2-.9-.1-.1-.3-.2-.5-.1-.2 0-.3.1-.4.3l-.8 1.9c-.1.2 0 .4.1.5.4.4 1 .7 1.8 1 .7.2 1.6.4 2.5.4 1.4 0 2.6-.4 3.4-1.1.9-.7 1.3-1.7 1.3-2.9 0-1-.3-1.7-.8-2.3-.5-.5-1.2-.9-2.2-1.3zm11.4-4.6c-1.1 0-2 .4-2.8 1.1v-.7c0-.2-.1-.3-.2-.4-.1-.1-.2-.1-.4-.1h-2.4c-.2 0-.3.1-.4.2s-.2.3-.2.4v14.9c0 .2.1.3.2.4.1.1.2.2.4.2h2.5c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4v-5c.7.5 1.6.8 2.5.8 1.5 0 2.8-.6 3.7-1.7.9-1.1 1.4-2.6 1.4-4.4 0-1.8-.4-3.2-1.3-4.2-.7-1.1-1.9-1.6-3.3-1.6zm.6 8.2c-.5.5-1.1.8-1.9.8-.5 0-1-.1-1.4-.4v-5.1c.5-.4 1-.6 1.6-.6.7 0 1.2.3 1.6.8.4.5.5 1.3.5 2.3 0 .9-.1 1.7-.5 2.2zm11.3-8.2c-1.6 0-2.9.5-3.8 1.6-.9 1.1-1.4 2.5-1.4 4.4 0 1.8.5 3.3 1.4 4.3.9 1.1 2.2 1.6 3.8 1.6 1.6 0 2.9-.5 3.8-1.6.9-1.1 1.4-2.5 1.4-4.3 0-1.9-.5-3.3-1.4-4.4-.9-1.1-2.2-1.6-3.8-1.6zm1.6 7.9c-.4.5-.9.8-1.6.8-.7 0-1.2-.3-1.6-.8-.4-.5-.6-1.2-.6-2.2 0-1 .2-1.8.6-2.3.4-.5.9-.8 1.6-.8.7 0 1.2.3 1.6.8.4.5.6 1.3.6 2.3s-.2 1.7-.6 2.2zm11.1-7.5h-2.5c-.2 0-.3.1-.4.2-.1.1-.2.3-.2.4v7.3c-.5.3-1.1.5-1.8.5-.5 0-.9-.1-1.1-.4-.2-.3-.4-.7-.4-1.3v-6.2c0-.2-.1-.3-.2-.4-.1-.1-.2-.2-.4-.2h-2.5c-.2 0-.3.1-.4.2s-.2.3-.2.4v6.7c0 1.3.3 2.3 1 3 .7.7 1.6 1 2.9 1 1.2 0 2.2-.4 3.1-1.1v.6c0 .2.1.3.2.4.1.1.2.2.4.2h2.5c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4V14c0-.2-.1-.3-.2-.4-.1-.1-.2-.2-.4-.2zm7.3-1c-.8-.4-1.8-.6-2.8-.6-1 0-2 .2-2.9.6-.1.1-.2.2-.2.4l.5 1.9c0 .2.1.3.3.4.1.1.3.1.4 0 .6-.3 1.3-.4 2-.4.6 0 1.1.1 1.4.4.3.3.5.7.5 1.2v.4c-.5-.2-1.1-.3-1.7-.3-1.4 0-2.5.4-3.3 1.1-.8.7-1.2 1.7-1.2 3 0 1.1.3 2 1 2.7.7.7 1.6 1 2.7 1 1.1 0 2-.4 2.7-1.1v.6c0 .2.1.3.2.4.1.1.2.2.4.2h2.4c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4v-6.8c0-1.5-.4-2.7-1.1-3.4-.6-.5-1.5-.9-2.5-1.1zm0 8.6c-.4.3-.9.5-1.5.5-.5 0-.8-.1-1.1-.4-.2-.2-.4-.5-.4-.9 0-.5.2-.8.5-1 .3-.3.8-.4 1.4-.4.5 0 .9.1 1.3.2l-.2 2zm16.6-7.8c-.7-.5-1.5-.8-2.5-.8-1 0-1.9.4-2.7 1.1v-.6c0-.2-.1-.3-.2-.4-.1-.1-.2-.2-.4-.2h-2.4c-.2 0-.3.1-.4.2s-.2.3-.2.4v9.1c0 .2.1.3.2.4.1.1.2.2.4.2h2.5c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4V17c.5-.4 1.1-.6 1.6-.6.4 0 .7.1.9.3.2.2.3.5.3.9v5c0 .2.1.3.2.4.1.1.2.2.4.2h2.5c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4v-5.5c0-1.2-.3-2.1-.9-2.8zm-70.9-1h-2.4c-.2 0-.3.1-.4.2s-.2.3-.2.4v.9c-.7-.6-1.5-1-2.5-1.1h-.3c-1.4 0-2.5.5-3.4 1.6-.9 1.1-1.3 2.5-1.3 4.2 0 2 .5 3.5 1.4 4.5.9 1 2.1 1.5 3.6 1.5 1 0 1.8-.2 2.6-.7v4.6c0 .2.1.3.2.4.1.1.2.2.4.2h2.5c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.4V14c0-.2-.1-.3-.2-.4-.2-.2-.4-.2-.5-.2zm-2.5 8.1c-.5.4-1 .6-1.6.6-.7 0-1.2-.3-1.6-.8-.4-.5-.6-1.3-.6-2.3 0-.9.2-1.6.5-2.2.4-.5.9-.8 1.6-.8.6 0 1.2.2 1.6.5v5z"/>
      </svg>
    ),
    Anthropic: (
      <svg className="h-6 w-auto" viewBox="0 0 120 24" fill="currentColor">
        <path d="M17.6 0h-4.3L6.6 18h4.1l1.3-3.6h6.5l1.3 3.6h4.2L17.6 0zm-4.3 11.2l2-5.8 2 5.8h-4zM32.8 5.1c-1.7 0-3.1.5-4.1 1.6-1 1-1.5 2.5-1.5 4.3v7h3.7v-6.8c0-1 .2-1.7.6-2.1.4-.4 1-.7 1.7-.7.6 0 1.1.2 1.5.5.4.4.5.9.5 1.6v7.5h3.7V10.5c0-1.7-.5-3-1.4-3.9-.9-.9-2.2-1.4-3.8-1.4h-.9zm14.9 0c-1.1 0-2.1.2-2.9.7-.9.5-1.5 1.1-2 2l-.1.1v-2.5h-3.6v12.4h3.7v-6.5c0-.9.3-1.6.8-2.2.5-.5 1.2-.8 2.1-.8.7 0 1.2.2 1.6.6.4.4.5.9.5 1.6V18h3.7v-7.7c0-1.6-.5-2.9-1.4-3.8-.9-.9-2.1-1.4-3.7-1.4h-.7zm14.9 0h-.4c-1.5 0-2.7.5-3.6 1.4-.9.9-1.4 2.2-1.4 3.8v2.2c0 1.6.5 3 1.4 3.9 1 1 2.2 1.5 3.7 1.5h.4c1.1 0 2.1-.3 2.9-.8v.7h3.6V1.1h-3.7v6.5c-.7-.5-1.6-.8-2.7-.8h-.2zm-.3 9.6c-.8 0-1.4-.2-1.8-.7-.5-.5-.7-1.1-.7-2v-1.5c0-.9.2-1.6.7-2.1.4-.5 1-.7 1.8-.7.7 0 1.3.2 1.7.7.4.5.7 1.1.7 2V12c0 .8-.2 1.5-.7 2-.4.5-1 .7-1.7.7zm14.7-9.6h-.3c-1.3 0-2.4.3-3.3.8v-4h-3.7v15.9h3.7v-7.1c0-.7.2-1.2.6-1.6.4-.4.9-.6 1.6-.6.6 0 1.1.2 1.4.5.3.4.5.9.5 1.5v7.4h3.7v-7.9c0-1.5-.4-2.7-1.2-3.6-.8-.9-2-1.3-3.3-1.3h-.7zm12.6 0h-.4c-1.7 0-3.1.5-4.1 1.5-1 1-1.5 2.3-1.5 3.9v2.3c0 1.6.5 2.9 1.5 3.9 1 1 2.3 1.5 4 1.5h.6c1.4 0 2.6-.4 3.6-1.1l-1.3-2.5c-.6.5-1.3.7-2.1.7-.8 0-1.4-.2-1.9-.6-.5-.4-.7-1-.7-1.7h6.5v-2.2c0-1.7-.5-3-1.4-4-1-1-2.2-1.5-3.8-1.5l-.9-.2zm-2.3 5c.1-.7.3-1.2.7-1.6.4-.4 1-.6 1.7-.6.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5l-4.5.1zm18.9-4.7h-3.6v2.7c-.8-.5-1.7-.8-2.8-.8h-.3c-1.4 0-2.6.5-3.5 1.4-1 1-1.4 2.2-1.4 3.8v2.3c0 1.6.5 2.9 1.4 3.8.9 1 2.1 1.4 3.5 1.4h.4c1.1 0 2-.3 2.8-.8v.6h3.6l-.1-14.4zm-6 11.4c-.7 0-1.3-.2-1.7-.6-.4-.4-.6-1.1-.6-1.9v-1.6c0-.8.2-1.4.6-1.9.4-.4 1-.6 1.7-.6.7 0 1.2.2 1.6.7.4.4.6 1.1.6 1.9v1.6c0 .8-.2 1.4-.6 1.8-.4.4-1 .6-1.6.6zm11.9-11.7h-3.7V18h3.7V5.1zm-1.9-5c-1.2 0-2 .6-2 1.7 0 1.1.8 1.8 2 1.8 1.2 0 2-.6 2-1.8 0-1.1-.8-1.7-2-1.7z"/>
      </svg>
    ),
    OpenAI: (
      <svg className="h-6 w-auto" viewBox="0 0 120 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm.8-14.7c-2.5-.7-5.1.8-5.8 3.3-.7 2.5.8 5.1 3.3 5.8 2.5.7 5.1-.8 5.8-3.3.7-2.5-.8-5.1-3.3-5.8zM36.5 5.4c-3.6 0-6.6 2.9-6.6 6.6s2.9 6.6 6.6 6.6c3.6 0 6.6-2.9 6.6-6.6s-3-6.6-6.6-6.6zm0 10.8c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2zm16.4-10.4h-2.2v.8c-.8-.6-1.7-1-2.8-1-2.9 0-5.2 2.4-5.2 5.5s2.4 5.5 5.2 5.5c1.1 0 2.1-.4 2.8-1v.8h2.2V5.8zm-4.8 8.7c-1.8 0-3.2-1.5-3.2-3.4 0-1.9 1.4-3.4 3.2-3.4 1.8 0 3.2 1.5 3.2 3.4.1 1.9-1.4 3.4-3.2 3.4zm11.5-8.7h-2.4v11.4h2.4v-6.3c0-1.6 1-2.8 2.4-2.8.4 0 .8.1 1.1.2V5.9c-.3-.1-.6-.1-.9-.1-1.2 0-2.2.6-2.6 1.5V5.8zm13.1 0h-2.4l-3.6 9.3-3.6-9.3h-2.5l4.8 11.4h2.5l4.8-11.4zm8.5 0h-2.2v11.4h2.2V5.8zm-1.1-4.6c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4c.8 0 1.4-.6 1.4-1.4s-.6-1.4-1.4-1.4z"/>
      </svg>
    ),
    Cloudflare: (
      <svg className="h-6 w-auto" viewBox="0 0 120 24" fill="currentColor">
        <path d="M19.7 14.9l-.7-2.4c-.1-.3-.3-.5-.6-.5h-7.2c-.2 0-.3-.1-.3-.3 0-.2.1-.3.3-.3h7.3c.7 0 1.4-.5 1.6-1.2l.9-2.9c.1-.2 0-.4-.2-.5-.6-.3-1.3-.4-2-.4-3.6 0-6.6 2.5-7.4 5.9H8c-.2 0-.3.1-.3.3v1.8c0 .2.1.3.3.3h2.8c0 .4 0 .8.1 1.2H8c-.2 0-.3.1-.3.3v1.8c0 .2.1.3.3.3h3.3c.9 2.7 3.4 4.6 6.4 4.6 1.5 0 2.9-.5 4.1-1.3.2-.1.2-.3.1-.5l-1.2-1.7c-.1-.2-.4-.2-.5-.1-.7.5-1.5.7-2.4.7-1.6 0-3-.9-3.8-2.2h4.6c.7 0 1.4-.5 1.6-1.2l.5-1.7c0-.3-.3-.5-.5-.5h-6.6c0-.4 0-.8.1-1.2h6.5c.7 0 1.4-.5 1.6-1.2zm18.1-2.8c-.8-2.7-3.3-4.7-6.3-4.7-2.5 0-4.7 1.4-5.8 3.5-.5-.2-1-.4-1.6-.4-2 0-3.7 1.5-3.9 3.5-1.5.6-2.6 2.1-2.6 3.8 0 2.3 1.9 4.1 4.1 4.1h14.6c2.3 0 4.1-1.9 4.1-4.1.1-1.8-1.1-3.4-2.6-4.1v-1.6zm-15.5 8.4c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2h.4c.2-1 1.1-1.8 2.2-1.8.2 0 .5 0 .7.1.6-2.1 2.5-3.6 4.8-3.6 2.4 0 4.4 1.7 4.8 4 .1 0 .2 0 .3 0 1.2 0 2.2 1 2.2 2.2s-1 2.2-2.2 2.2H22.3v1.3zM50.8 7.7c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c3.6 0 6.5-2.9 6.5-6.5s-2.9-6.5-6.5-6.5zm0 10.8c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3 4.3 1.9 4.3 4.3-1.9 4.3-4.3 4.3zm17.8-10.8c-3.6 0-6.5 2.9-6.5 6.5v5.9h2.2v-5.9c0-2.4 1.9-4.3 4.3-4.3s4.3 1.9 4.3 4.3v5.9h2.2v-5.9c0-3.6-2.9-6.5-6.5-6.5zm16.6 0c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c1.8 0 3.4-.7 4.6-1.9l-1.6-1.5c-.8.8-1.8 1.2-3 1.2-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3c1.2 0 2.2.5 3 1.2l1.6-1.5c-1.2-1.2-2.8-1.9-4.6-1.9zm18.7 0c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5-2.9-6.5-6.5-6.5zm0 10.8c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3 4.3 1.9 4.3 4.3-1.9 4.3-4.3 4.3z"/>
      </svg>
    ),
    Vercel: (
      <svg className="h-5 w-auto" viewBox="0 0 76 20" fill="currentColor">
        <path d="M13.2 1L26.3 19H0L13.2 1zM40.6 7.5h-3.8L32 19h3.2l.9-2.4h4.8l.9 2.4h3.2l-4.4-11.5zm-3 6.9l1.5-4.1 1.5 4.1h-3zm16.8-6.9c-2.1 0-3.6.7-4.6 2l2.2 1.5c.6-.7 1.4-1.1 2.4-1.1 1.3 0 2.1.7 2.1 1.8v.3h-2.7c-2.7 0-4.3 1.3-4.3 3.5 0 2.1 1.6 3.5 3.9 3.5 1.3 0 2.4-.5 3.1-1.3v1.1h3v-7c0-2.8-2.1-4.3-5.1-4.3zm2.1 7.9c0 1.1-.9 1.8-2.3 1.8-1.1 0-1.7-.5-1.7-1.3 0-.9.7-1.3 2-1.3h2v.8zm15.8-7.7h-3.6l-2.8 8.4-2.8-8.4h-3.6l4.6 11.3h3.6l4.6-11.3zm4.9-.2c-3.5 0-5.8 2.4-5.8 5.9s2.3 5.9 5.8 5.9c2.3 0 4.1-1.1 5-2.9l-2.7-1.3c-.4.9-1.3 1.5-2.3 1.5-1.6 0-2.6-1.1-2.6-3.2 0-2.1 1-3.2 2.6-3.2 1 0 1.9.5 2.3 1.5l2.7-1.3c-.9-1.8-2.7-2.9-5-2.9zm8.9 0c-1.6 0-2.8.7-3.5 1.8V7.5h-3.1V19h3.1v-6.4c0-1.8 1-2.6 2.4-2.6 1.3 0 2.1.8 2.1 2.3V19h3.1v-7.2c0-2.7-1.9-4.3-4.1-4.3z"/>
      </svg>
    ),
    Stripe: (
      <svg className="h-6 w-auto" viewBox="0 0 60 25" fill="currentColor">
        <path d="M5 10.2c0-.7.6-1 1.5-1 1.3 0 3 .4 4.4 1.1V6.5c-1.5-.6-2.9-.8-4.4-.8C3.3 5.7.8 7.6.8 10.5c0 4.5 6.2 3.8 6.2 5.7 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.8c1.7.7 3.4 1 4.9 1 3.3 0 5.6-1.6 5.6-4.6.1-4.8-6.2-4-6.2-5.9zM15.5 5.8l-4.1.9v3.2l4.1-.9V5.8zm0 4.5h-4.1V21h4.1V10.3zm4.7 0l-.3-1.8h-3.6V21h4.1v-7.3c1-1.3 2.6-1 3.1-.9V8.5c-.6-.2-2.6-.6-3.5 1.2l.2.6zm8.6-1.8c-1.4 0-2.3.7-2.9 1.1l-.2-.9H22v14.6l4.1-.9v-3.5c.5.4 1.3.9 2.6.9 2.7 0 5.1-2.1 5.1-6.9.1-4.3-2.4-6.5-5-6.5v2.1zm-.9 8.3c-.9 0-1.4-.3-1.7-.7v-5.5c.4-.4.9-.8 1.7-.8 1.3 0 2.2 1.5 2.2 3.5 0 2.1-.9 3.5-2.2 3.5zm16.6-3.5c0-3.9-1.9-7-5.5-7-3.6 0-5.9 3.1-5.9 7 0 4.6 2.6 6.9 6.3 6.9 1.9 0 3.2-.4 4.3-1V15c-1 .5-2.1.8-3.6.8-1.4 0-2.7-.5-2.8-2.2h7.2zm-7.2-1.4c0-1.6 1-2.3 1.9-2.3.9 0 1.8.7 1.8 2.3h-3.7z"/>
      </svg>
    ),
  };

  return (
    <div className="flex h-10 items-center px-4 opacity-60 transition-opacity hover:opacity-100">
      {logos[name] ?? <span className="text-[16px] font-medium">{name}</span>}
    </div>
  );
};

export default Home;
