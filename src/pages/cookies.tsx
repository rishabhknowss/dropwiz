import Head from "next/head";
import Link from "next/link";

const Cookies = () => (
  <>
    <Head>
      <title>Cookie Policy · Dropwiz</title>
      <meta
        name="description"
        content="How Dropwiz uses cookies and similar technologies."
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
          Cookie Policy
        </h1>
        <div className="dw-mono mt-2 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Last updated · 13 May 2026
        </div>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-[14.5px] leading-[1.65] text-[color:var(--dw-text-dim)]">
          <Section title="What are cookies?">
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences, keep you
            logged in, and understand how you use the service.
          </Section>

          <Section title="How we use cookies">
            Dropwiz uses cookies strictly for functionality and security. We do
            not use cookies for advertising or tracking across other websites.
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Authentication</b>:
                We use HttpOnly cookies (<code>dw_access</code>,{" "}
                <code>dw_refresh</code>) to keep you securely logged in.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">OAuth flow</b>:
                Short-lived cookies are used during Google sign-in to maintain
                session state.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Security</b>:
                Cookies help us detect and prevent fraudulent activity and
                protect your account.
              </li>
            </ul>
          </Section>

          <Section title="Types of cookies we use">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Essential cookies</b>:
                Required for the site to function. These cannot be disabled.
                They include authentication tokens and CSRF protection.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Functional cookies</b>:
                Remember your preferences such as language and display settings.
              </li>
            </ul>
          </Section>

          <Section title="Third-party cookies">
            We do not use third-party advertising or tracking cookies. The only
            third-party cookies you may encounter are from:
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Google OAuth</b>:
                If you sign in with Google, Google may set cookies to manage
                the authentication flow.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Embedded content</b>:
                If we embed videos (e.g., YouTube), those providers may set
                their own cookies.
              </li>
            </ul>
          </Section>

          <Section title="Cookie duration">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <b className="text-[color:var(--dw-text)]">Session cookies</b>:
                Deleted when you close your browser.
              </li>
              <li>
                <b className="text-[color:var(--dw-text)]">Persistent cookies</b>:
                Our authentication cookies expire after 7 days (access) and 30
                days (refresh) for security.
              </li>
            </ul>
          </Section>

          <Section title="Managing cookies">
            You can control cookies through your browser settings. Most browsers
            allow you to:
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>View and delete existing cookies</li>
              <li>Block all or specific cookies</li>
              <li>Set preferences for certain websites</li>
            </ul>
            <p className="mt-3">
              Note: Blocking essential cookies will prevent you from logging in
              and using Dropwiz.
            </p>
          </Section>

          <Section title="Updates to this policy">
            We may update this policy from time to time. The "Last updated" date
            at the top of this page will reflect the most recent changes.
            Continued use of Dropwiz after changes constitutes acceptance of the
            updated policy.
          </Section>

          <Section title="Contact us">
            If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:hello@dropwiz.ai" className="dw-link">
              hello@dropwiz.ai
            </a>
            .
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

export default Cookies;
