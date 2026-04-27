import Head from "next/head";
import Link from "next/link";

const Privacy = () => (
  <>
    <Head>
      <title>Privacy Policy · Dropwiz</title>
      <meta
        name="description"
        content="How Dropwiz collects, uses, and protects your data."
      />
    </Head>
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <main className="mx-auto max-w-[760px] px-6 py-16">
        <Link
          href="/"
          className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
        >
          ← Back
        </Link>

        <h1 className="dw-display-sm mt-6 text-[40px] leading-[1.05] tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <div className="dw-mono mt-2 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Last updated · 27 April 2026
        </div>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-[14.5px] leading-[1.65] text-[color:var(--dw-text-dim)]">
          <Section title="Who we are">
            Dropwiz (“we”, “us”) operates an AI-powered store builder for
            Shopify and direct-to-consumer commerce. This policy explains what
            personal data we collect, how we use it, and the rights you have.
            Contact: <a href="mailto:hello@dropwiz.ai" className="dw-link">hello@dropwiz.ai</a>.
          </Section>

          <Section title="Data we collect">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Account data</b>: email,
                hashed password (or Google OAuth ID), display name, locale.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Workspace data</b>: stores
                you create — product details you enter or import, AI-generated
                copy, AI-generated and uploaded images, and theme tokens.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Shopify shop data</b>:
                when you connect a Shopify shop, we receive an OAuth access
                token, the shop domain, and read/write access scoped to
                products and publications. We do not access customer or order
                PII from your shop.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Usage telemetry</b>:
                request paths, IP, user-agent, and timing — used for security,
                rate limiting, and reliability.
              </li>
            </ul>
          </Section>

          <Section title="Where data is stored">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Postgres (Neon)</b> —
                user accounts, stores, generations, audit events.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Cloudflare R2</b> — all
                generated and uploaded images.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Redis (Upstash)</b> —
                short-lived rate-limit counters and session caches.
              </li>
            </ul>
          </Section>

          <Section title="Third-party services we share data with">
            We send the minimum data required to perform the task. We do not
            sell or rent your data. The services are:
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Anthropic Claude</b> —
                generates store copy. Receives the product context (title,
                description, persona, angle) and our prompts.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Wavespeed AI</b>{" "}
                (Bytedance Seedream / Flux / GPT Image 2) — generates and edits
                images. Receives the prompt and any reference image URL.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Firecrawl</b> — scrapes
                product URLs you submit so we can analyze the listing. Receives
                only the URL.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Shopify</b> — when you
                publish, we send the product, variant, and design metafields to
                your connected shop. We never read or share your shop’s
                customer or order data.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Google OAuth</b> —
                if you sign in with Google, we receive your email and profile.
              </li>
            </ul>
          </Section>

          <Section title="Cookies">
            We use first-party HttpOnly cookies for authentication
            (<code>dw_access</code>, <code>dw_refresh</code>) and
            short-lived OAuth flow cookies. We do not use third-party
            advertising cookies.
          </Section>

          <Section title="Your rights (GDPR / CCPA)">
            You can request a copy of your data, correction of inaccuracies,
            or deletion at any time. Email{" "}
            <a href="mailto:privacy@dropwiz.ai" className="dw-link">
              privacy@dropwiz.ai
            </a>{" "}
            — we’ll respond within 30 days.
            <br />
            Shopify merchants: when you uninstall the Dropwiz app, your shop
            access tokens and connection are deleted automatically. Shopify
            also fires <code>customers/data_request</code>,{" "}
            <code>customers/redact</code>, and <code>shop/redact</code> webhooks
            to our servers — we honor these per Shopify’s 30-day SLA.
          </Section>

          <Section title="Retention">
            Account and workspace data is kept until you delete your account
            or 24 months after last activity. Telemetry is retained for 90
            days. R2 images are retained until the parent store is deleted.
          </Section>

          <Section title="Security">
            Tokens are encrypted at rest. All transport is HTTPS. Webhook
            signatures are verified via constant-time HMAC. We rotate refresh
            tokens on use to limit replay risk.
          </Section>

          <Section title="Changes to this policy">
            We will post an updated date at the top of this page when we make
            material changes. Continued use after changes constitutes
            acceptance.
          </Section>
        </div>
      </main>
    </div>
  </>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="text-[18px] font-medium tracking-[-0.01em] text-[color:var(--dw-text)]">
      {title}
    </h2>
    <div className="mt-2">{children}</div>
  </section>
);

export default Privacy;
