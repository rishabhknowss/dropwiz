import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--dw-bg)] text-[var(--dw-text)]">
      <header className="flex h-14 items-center border-b border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] px-6">
        <Link href="/">
          <DWLogo size={32} />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <div className="text-[120px] font-bold leading-none tracking-tight text-[var(--dw-accent)] md:text-[180px]">
            404
          </div>
          <div className="mt-4 text-[20px] font-semibold text-[var(--dw-text)] md:text-[24px]">
            Page not found
          </div>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--dw-text-muted)] md:text-[15px]">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-[var(--dw-border)]"
              onClick={() => router.back()}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Go back
            </Button>
            <Button asChild className="gap-2 bg-[var(--dw-accent)] text-[#0A0A0A] hover:brightness-110">
              <Link href="/">
                <HugeiconsIcon icon={Home01Icon} size={14} />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] px-6 py-4 text-center">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--dw-text-subtle)]">
          Dropwiz
        </span>
      </footer>
    </div>
  );
};

export default NotFoundPage;
