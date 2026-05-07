import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DWLogo } from "@/components/dw/Logo";

type AuthShellProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 bg-gradient-to-br from-[var(--dw-accent)] to-[#8771FF] lg:block">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center">
            <DWLogo size={44} variant="light" />
          </Link>

          <div className="max-w-md">
            <h2 className="text-[36px] font-bold leading-tight text-white">
              Build AI-powered Shopify stores that convert.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              Join thousands of entrepreneurs using Dropwiz to create high-converting product pages in seconds.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <Image src="/testimonials/sarah.jpg" alt="Sarah" width={44} height={44} className="size-11 rounded-full border-2 border-white/20 object-cover" />
                <Image src="/testimonials/marcus.jpg" alt="Marcus" width={44} height={44} className="size-11 rounded-full border-2 border-white/20 object-cover" />
                <Image src="/testimonials/jessica.jpg" alt="Jessica" width={44} height={44} className="size-11 rounded-full border-2 border-white/20 object-cover" />
                <Image src="/testimonials/david.jpg" alt="David" width={44} height={44} className="size-11 rounded-full border-2 border-white/20 object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">2,500+ stores built</p>
                <p className="text-[13px] text-white/60">by happy merchants</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="size-5 text-[#FEC84B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[14px] text-white/70">Rated 4.9/5 by users</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col bg-[var(--dw-bg)] lg:w-1/2">
        <header className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center lg:hidden">
            <DWLogo size={36} />
          </Link>
          <div className="ml-auto lg:ml-0">
            <ThemeToggle />
          </div>
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
