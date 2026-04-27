import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
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
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";
import { DWLogo } from "@/components/dw/Logo";
import { FeatureViz, type VizKind } from "@/components/dw/FeatureViz";
import { FlowStepViz, type FlowVizKind } from "@/components/dw/FlowStepViz";
import { CtaAtmosphere } from "@/components/dw/CtaAtmosphere";
import { Backlight } from "@/components/ui/backlight";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  desc: string;
  icon: typeof Target02Icon;
  span: number;
  viz: VizKind;
};

const FEATURES: Feature[] = [
  {
    title: "60-second store generation",
    desc: "Paste a product URL. Dropwiz scrapes it, writes positioning, copy and FAQ, generates imagery, and assembles a designed storefront in under a minute.",
    icon: MagicWand01Icon,
    span: 2,
    viz: "timer",
  },
  {
    title: "Real product, real photos",
    desc: "Image generation runs img2img on your actual product photo. Hero, lifestyle, ads — all preserve your bottle, your packaging, your colors.",
    icon: SparklesIcon,
    span: 1,
    viz: "loop",
  },
  {
    title: "Live workspace activity",
    desc: "Product imported, copy generated, sections placed, ads shipped, store published — every Dropwiz event streams in real time. Watch it build.",
    icon: Layers01Icon,
    span: 1,
    viz: "sections",
  },
  {
    title: "Static ads in 30 seconds",
    desc: "Pick a format. Get a photoreal ad with your product, your hook, your palette. Powered by Seedream v4.5 Edit. $0.04 per image.",
    icon: PlayIcon,
    span: 2,
    viz: "ads",
  },
  {
    title: "Native Shopify publish",
    desc: "One click sends product, variants, images and design to Shopify via Theme App Extension. No theme exemption. Works on Dawn and every OS 2.0 theme.",
    icon: Store01Icon,
    span: 2,
    viz: "winners",
  },
  {
    title: "Always-current preview",
    desc: "Every store gets a public /p/<slug> URL — share with team or client before you go live. Live editor with Desktop / Tablet / Mobile viewports.",
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
    title: "Paste a product URL",
    desc: "AliExpress, Amazon, your existing Shopify product, any DTC listing. Dropwiz scrapes title, description, price and images in under 10s.",
    viz: "url",
  },
  {
    num: "02",
    title: "AI builds the store",
    desc: "Persona + angle + hero copy + bundles + FAQ + footer + imagery — all generated and laid out in a Dropwiz-designed template.",
    viz: "build",
  },
  {
    num: "03",
    title: "Edit and polish",
    desc: "Drag sections, swap variants, regenerate any image with your product as reference. Switch viewport — every breakpoint is responsive.",
    viz: "edit",
  },
  {
    num: "04",
    title: "Publish to Shopify",
    desc: "One click — product, variants, design metafields, Online Store channel. Drop the Dropwiz block into your theme once. Done forever.",
    viz: "publish",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Cut our launch cycle from 3 days to 20 minutes. The img2img keeping our actual bottle in every shot is the real unlock.",
    name: "Marie L.",
    role: "Agency operator",
    metric: "14 brands",
  },
  {
    quote:
      "Static ads in 30 seconds with our real product and our brand palette. Replaced the freelance ad designer.",
    name: "Dev P.",
    role: "Solo DTC operator",
    metric: "7 stores live",
  },
  {
    quote:
      "Theme block snaps into Shopify, design just renders. My agency went from theme-tweaking to copywriting overnight.",
    name: "Sana K.",
    role: "DTC consultant",
    metric: "34 client stores",
  },
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
  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav active="Product" />

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[96px]">
        <div className="dw-bloom -right-[200px] -top-[200px]" />
        <div className="dw-grid-bg absolute inset-0 opacity-40" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <div className="dw-reveal mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] py-1.5 pl-1.5 pr-2.5 md:mb-8 md:gap-2.5 md:pr-3">
            <span className="shrink-0 rounded-full bg-[color:var(--dw-accent)] px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] text-[color:var(--dw-accent-ink)] md:text-[11px]">
              NEW
            </span>
            <span className="truncate text-[11.5px] text-[color:var(--dw-text-dim)] md:text-[13px]">
              <span className="md:hidden">Shopify publish via TAE</span>
              <span className="hidden md:inline">
                Pixel-perfect Shopify publish via Theme App Extension
              </span>
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className="shrink-0 text-[color:var(--dw-text-muted)] md:size-[13px]"
            />
          </div>

          <h1
            className="dw-reveal dw-display max-w-[1000px] text-[44px] sm:text-[56px] md:text-[68px] lg:text-[84px]"
            style={{ animationDelay: "40ms" }}
          >
            Ship a store.
            <br />
            Find a winner.
            <br />
            <span className="text-[color:var(--dw-text-muted)]">Scale</span>
            <span className="text-[color:var(--dw-accent)]">.</span>
          </h1>

          <p
            className="dw-reveal mt-6 max-w-[640px] text-[15px] leading-[1.5] tracking-[-0.01em] text-[color:var(--dw-text-dim)] md:mt-8 md:text-[17px] md:leading-[1.45] md:tracking-[-0.015em] lg:text-[19px]"
            style={{ animationDelay: "80ms" }}
          >
            Paste a product URL. Get a Shopify-native storefront in 60 seconds —
            with AI copy, generated imagery and static ads, all built around your
            actual product photo.
          </p>

          <div
            className="dw-reveal mt-8 flex w-full flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:mt-10"
            style={{ animationDelay: "120ms" }}
          >
            <Button asChild size="lg" className="h-11 px-5 text-[14px] font-medium">
              <Link href="/auth/signup">
                Build a store free
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 gap-2 px-5 text-[14px] font-medium"
            >
              <HugeiconsIcon icon={PlayIcon} size={12} />
              Watch 90-sec demo
            </Button>
            <span className="dw-mono mt-1 text-center text-xs text-[color:var(--dw-text-muted)] sm:ml-2 sm:mt-0">
              No card · 60s build
            </span>
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
              ["60s", "median build time"],
              ["17+", "section variants"],
              ["$0.04", "per AI ad image"],
              ["1-click", "Shopify publish"],
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

      {/* TECH STRIP */}
      <section className="border-t border-[color:var(--dw-border)] px-5 py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="dw-mono mb-6 text-center text-[10px] uppercase tracking-[0.18em] text-[color:var(--dw-text-muted)] md:mb-7 md:text-[11px]">
            Built on the best models. Ships to Shopify today.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 opacity-70 md:justify-between md:gap-10">
            {[
              "Shopify",
              "Anthropic Claude",
              "Bytedance Seedream",
              "GPT Image 2",
              "Cloudflare R2",
              "Firecrawl",
            ].map((b) => (
              <div
                key={b}
                className="text-[14px] font-medium tracking-[-0.02em] text-[color:var(--dw-text-dim)] md:text-[16px] lg:text-[20px]"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="product"
        className="border-t border-[color:var(--dw-border)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]"
      >
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            Everything needed to test, launch & scale
            <span className="text-[color:var(--dw-accent)]">.</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="border-t border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            URL to paying customer in one afternoon.
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

      {/* TESTIMONIALS */}
      <section className="border-t border-[color:var(--dw-border)] px-5 py-16 md:px-8 md:py-24 lg:px-10 lg:py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="dw-display-sm max-w-[800px] text-[32px] md:text-[44px] lg:text-[56px]">
            Used by the people actually shipping.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 md:p-7"
              >
                <div className="mb-6 text-[15px] leading-[1.55] tracking-[-0.005em] md:mb-7 md:text-[16px]">
                  &ldquo;{t.quote}&rdquo;
                </div>
                <div className="flex items-center gap-3 border-t border-[color:var(--dw-border)] pt-4">
                  <div
                    className="size-9 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--dw-accent), var(--dw-citrus))",
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium">{t.name}</div>
                    <div className="text-xs text-[color:var(--dw-text-muted)]">
                      {t.role}
                    </div>
                  </div>
                  <div className="dw-mono text-[11px] text-[color:var(--dw-accent)]">
                    {t.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                ["Features", "#"],
                ["Templates", "#"],
                ["Pricing", "#"],
                ["Changelog", "#"],
                ["Roadmap", "#"],
              ]],
              ["Resources", [
                ["Winning products", "#"],
                ["Academy", "#"],
                ["Ad library", "#"],
                ["API docs", "#"],
              ]],
              ["Company", [
                ["About", "#"],
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

export default Home;
