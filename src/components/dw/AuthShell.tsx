import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 bg-[#0A0A0A] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,204,0.08),transparent)]" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="text-[22px] font-bold tracking-tight text-[var(--dw-text)]">
            drop<span className="text-[var(--dw-accent)]">wiz</span>
          </Link>

          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-[var(--dw-accent)]/10 to-transparent blur-2xl" />
              <Image
                src="/imac.png"
                alt="Dropwiz Dashboard"
                width={800}
                height={600}
                className="relative w-full drop-shadow-2xl"
                priority
              />
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-[28px] font-bold leading-tight text-white">
                Launch your dropshipping store in minutes
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/50">
                AI-powered store builder for Shopify dropshippers
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <Image src="/testimonials/sarah.jpg" alt="Sarah" width={36} height={36} className="size-9 rounded-full border-2 border-[#0A0A0A] object-cover" />
                <Image src="/testimonials/marcus.jpg" alt="Marcus" width={36} height={36} className="size-9 rounded-full border-2 border-[#0A0A0A] object-cover" />
                <Image src="/testimonials/jessica.jpg" alt="Jessica" width={36} height={36} className="size-9 rounded-full border-2 border-[#0A0A0A] object-cover" />
              </div>
              <p className="text-[13px] text-white/50">
                <span className="font-semibold text-white">2,500+</span> stores built
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="size-4 text-[var(--dw-accent)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-[13px] text-white/50">4.9</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col bg-[var(--dw-bg)] lg:w-1/2">
        <header className="flex items-center p-6 lg:hidden">
          <Link href="/" className="text-[20px] font-bold tracking-tight text-[var(--dw-text)]">
            drop<span className="text-[var(--dw-accent)]">wiz</span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-[400px]">
            <div className="opacity-0 animate-fade-up">
              <h1 className="text-[32px] font-bold leading-tight text-[var(--dw-text)] lg:text-[36px]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-[15px] text-[var(--dw-text-muted)]">{subtitle}</p>
              )}
            </div>

            <div className="mt-8 opacity-0 animate-fade-up stagger-2">
              {children}
            </div>

            {footer && (
              <div className="mt-8 border-t border-[var(--dw-border)] pt-6 text-center text-[14px] text-[var(--dw-text-muted)] opacity-0 animate-fade-up stagger-3">
                {footer}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
