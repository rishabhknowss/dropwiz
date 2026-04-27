import Head from "next/head";
import Link from "next/link";

const Terms = () => (
  <>
    <Head>
      <title>Terms of Service · Dropwiz</title>
      <meta name="description" content="The terms governing use of Dropwiz." />
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
          Terms of Service
        </h1>
        <div className="dw-mono mt-2 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Last updated · 27 April 2026
        </div>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-[14.5px] leading-[1.65] text-[color:var(--dw-text-dim)]">
          <Section title="Acceptance">
            By creating an account or using Dropwiz, you agree to these Terms
            and to our{" "}
            <Link href="/privacy" className="dw-link">
              Privacy Policy
            </Link>
            . If you don’t agree, don’t use the service.
          </Section>

          <Section title="What you can do">
            You may use Dropwiz to generate, edit, and publish e-commerce
            stores. You retain ownership of your content (text, uploaded
            images, brand). You grant us a non-exclusive license to host,
            process, and display your content as needed to operate the
            service.
          </Section>

          <Section title="What you can't do">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Resell access to Dropwiz without a written agreement.</li>
              <li>
                Generate content that infringes intellectual property,
                impersonates a brand, or violates applicable law.
              </li>
              <li>
                Abuse the AI image / copy generation pipeline (rate-limit
                evasion, automated bulk generation outside intended use).
              </li>
              <li>
                Use the service for products that are illegal in the
                jurisdictions you sell into (CBD/THC, weapons, regulated
                healthcare, etc.) — Shopify’s acceptable use policy also
                applies when publishing to Shopify.
              </li>
            </ul>
          </Section>

          <Section title="AI-generated content">
            Output is produced by third-party AI models (Anthropic, Wavespeed)
            based on your prompts. We don’t guarantee accuracy, fitness for
            purpose, or non-infringement. You are responsible for reviewing
            output before publishing.
          </Section>

          <Section title="Shopify integration">
            When you connect a Shopify shop, you authorize Dropwiz to read and
            write products and publications on that shop using OAuth. Your
            shop’s customer and order data is never accessed. Uninstalling the
            Dropwiz app from your Shopify admin revokes our access
            immediately.
          </Section>

          <Section title="Subscriptions and billing">
            Paid plans are billed through Shopify’s Billing API on the cadence
            shown at checkout. Subscriptions auto-renew until canceled. You
            can cancel any time from your Shopify admin or by uninstalling
            the app — billing stops at the end of the current period. Refunds
            are at our discretion; email{" "}
            <a href="mailto:billing@dropwiz.ai" className="dw-link">
              billing@dropwiz.ai
            </a>
            .
          </Section>

          <Section title="Service availability">
            We aim for high availability but make no SLA guarantees on the
            free tier. Paid plans may receive support response targets
            described on the pricing page.
          </Section>

          <Section title="Termination">
            We may suspend or terminate your account if you violate these
            Terms or if required to protect the service. You may delete your
            account at any time — your data is removed within 30 days
            (audit logs may be retained longer where required by law).
          </Section>

          <Section title="Limitation of liability">
            To the maximum extent permitted by law, Dropwiz is not liable for
            indirect, incidental, or consequential damages, or for lost
            profits or revenue arising from use of the service. Our total
            liability is capped at the fees you paid us in the 12 months
            preceding the claim.
          </Section>

          <Section title="Governing law">
            These Terms are governed by the laws of India. Disputes will be
            resolved in courts of competent jurisdiction in Bengaluru, India,
            unless local consumer-protection law requires otherwise.
          </Section>

          <Section title="Changes">
            We may update these Terms with notice. Material changes take
            effect 14 days after we update the page. Continued use after the
            effective date constitutes acceptance.
          </Section>

          <Section title="Contact">
            <a href="mailto:hello@dropwiz.ai" className="dw-link">
              hello@dropwiz.ai
            </a>
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

export default Terms;
