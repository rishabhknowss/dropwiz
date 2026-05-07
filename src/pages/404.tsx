import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#1B2559]">
      <header className="flex h-14 items-center border-b border-[#E5E7EB] bg-white px-6">
        <Link href="/">
          <DWLogo size={32} />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <div className="text-[120px] font-bold leading-none tracking-tight text-[#5235EF] md:text-[180px]">
            404
          </div>
          <div className="mt-4 text-[20px] font-semibold text-[#1B2559] md:text-[24px]">
            Page not found
          </div>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.back()}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              Go back
            </Button>
            <Button asChild className="gap-2 bg-gradient-to-r from-[#5235EF] to-[#8771FF] hover:opacity-90">
              <Link href="/">
                <HugeiconsIcon icon={Home01Icon} size={14} />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white px-6 py-4 text-center">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#9CA3AF]">
          Dropwiz
        </span>
      </footer>
    </div>
  );
};

export default NotFoundPage;
