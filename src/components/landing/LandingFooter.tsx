import Link from "next/link";
import { motion } from "motion/react";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[var(--dw-border)] bg-[var(--dw-bg)] px-4 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <Link href="/" className="text-[22px] font-bold tracking-tight text-[var(--dw-text)]">
              drop<span className="text-[var(--dw-accent)]">wiz</span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--dw-text-muted)]">
              Build, optimize, and publish product pages in real-time — all in one powerful platform.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-[var(--dw-bg-tertiary)] text-[var(--dw-text-muted)] transition-all hover:bg-[var(--dw-text)] hover:text-[var(--dw-bg)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[var(--dw-text)]">
              Product
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[var(--dw-text)]">
              Legal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--dw-border)] pt-8 md:flex-row">
          <p className="text-[14px] text-[var(--dw-text-subtle)]">
            © {new Date().getFullYear()} Dropwiz. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[14px] text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]">
              Privacy
            </Link>
            <Link href="/terms" className="text-[14px] text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
