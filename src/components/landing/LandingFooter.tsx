import Link from "next/link";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Get Started", href: "/auth/signup" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Tutorials", href: "#" },
    { label: "Contact Us", href: "mailto:hello@dropwiz.ai" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@dropwiz.ai",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const TickDivider = () => (
  <div className="-mx-4 overflow-hidden border-t border-white/10 lg:-mx-8">
    <div
      className="flex h-14 lg:h-20"
      style={{
        width: "200%",
        animation: "tickScroll 30s linear infinite",
      }}
    >
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={i}
          className="h-full border-r border-white/10"
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

export const LandingFooter = () => {
  return (
    <footer className="relative bg-[#0A0A0A]">
      <div className="pointer-events-none absolute inset-0 z-[110] mx-auto hidden max-w-6xl lg:block">
        <div className="relative size-full">
          <div className="absolute bottom-0 left-4 top-0 flex w-[3px] justify-center bg-[#0A0A0A] lg:left-8">
            <div className="h-full w-px bg-white/10" />
          </div>
          <div className="absolute bottom-0 right-4 top-0 flex w-[3px] justify-center bg-[#0A0A0A] lg:right-8">
            <div className="h-full w-px bg-white/10" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
            <div className="col-span-2 lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-1">
                <img src="/logo.png" alt="dropwiz" className="h-7 w-auto brightness-0 invert lg:h-8" />
                <span className="text-[18px] font-bold text-white lg:text-[20px]">dropwiz</span>
              </Link>
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/80">
                Dropwiz is designed to help dropshippers build high-converting Shopify stores in minutes with AI.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all hover:border-white/40 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 lg:col-start-6">
              <h4 className="mb-5 text-[13px] font-medium text-white/70">
                Product
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <h4 className="mb-5 text-[13px] font-medium text-white/70">
                Resources
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <h4 className="mb-5 text-[13px] font-medium text-white/70">
                Legal
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="-mx-4 border-t border-white/10 lg:-mx-8" />

          <div className="py-6 text-center">
            <p className="text-[13px] text-white/70">
              © {new Date().getFullYear()} Dropwiz. All rights reserved.
            </p>
          </div>

          <TickDivider />
        </div>
      </div>
    </footer>
  );
};
