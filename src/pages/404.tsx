import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
    <header className="flex h-14 items-center border-b border-[color:var(--dw-border)] px-6">
      <Link href="/">
        <DWLogo size={18} />
      </Link>
    </header>

    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="dw-bloom absolute -top-40" />
      <div className="relative">
        <div className="dw-display-sm text-[120px] leading-none tracking-tight text-[color:var(--dw-accent)] md:text-[180px]">
          404
        </div>
        <div className="mt-4 text-[20px] font-medium md:text-[24px]">
          Page not found
        </div>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[color:var(--dw-text-dim)] md:text-[15px]">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href="javascript:history.back()">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Go back
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/">
              <HugeiconsIcon icon={Home01Icon} size={14} />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </main>

    <footer className="border-t border-[color:var(--dw-border)] px-6 py-4 text-center">
      <span className="dw-mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--dw-text-muted)]">
        Dropwiz
      </span>
    </footer>
  </div>
);

export default NotFoundPage;
