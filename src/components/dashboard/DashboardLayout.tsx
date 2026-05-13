import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Store01Icon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  ChartHistogramIcon,
  SparklesIcon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Store01Icon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/app/stores", icon: Home01Icon },
  { label: "Analytics", href: "/app/integrations", icon: ChartHistogramIcon },
];

const IconNavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link
    href={item.href}
    className={cn(
      "flex size-10 items-center justify-center rounded-xl transition-all",
      isActive
        ? "bg-[#F5F5F5] text-[#0A0A0A]"
        : "text-[#999999] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
    )}
    title={item.label}
  >
    <HugeiconsIcon icon={item.icon} size={20} strokeWidth={isActive ? 2 : 1.5} />
  </Link>
);

type DashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const DashboardLayout = ({ children, title, subtitle, action }: DashboardLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const me = api.auth.me.useQuery();
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();

  const handleSignOut = () => {
    const id = toast.loading("Signing out...");
    signOut.mutate(undefined, {
      onSuccess: async () => {
        toast.success("Signed out", { id });
        await utils.auth.me.invalidate();
        router.push("/");
      },
      onError: (err) => toast.error(getErrorMessage(err), { id }),
    });
  };

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r border-[#E5E5E5] bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center justify-center border-b border-[#E5E5E5]">
          <Link href="/app/stores">
            <img src="/logo.png" alt="dropwiz" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-2">
          {NAV_ITEMS.map((item) => (
            <IconNavLink key={item.href} item={item} isActive={isActive(item.href)} />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3 border-t border-[#E5E5E5] py-4">
          <Link
            href="/app/settings"
            className="flex size-10 items-center justify-center rounded-xl text-[#666666] transition-all hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
            title="Settings"
          >
            <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.5} />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-[var(--dw-accent)] text-[13px] font-bold text-[#0A0A0A] transition-all hover:ring-2 hover:ring-[var(--dw-accent)]/30">
              {me.data?.image ? (
                <img src={me.data.image} alt="" className="size-full object-cover" />
              ) : (
                me.data?.email?.[0]?.toUpperCase() ?? "?"
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-[180px]">
              <div className="flex items-center gap-2 px-2 py-2 border-b border-[#F0F0F0] mb-1">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <HugeiconsIcon icon={SparklesIcon} size={12} className="text-[#D97706]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0A0A0A]">{me.data?.imageCredits ?? 0} credits</p>
                  <p className="text-[10px] text-[#999999]">AI image credits</p>
                </div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/app/settings" className="flex items-center gap-2 text-[13px]">
                  <HugeiconsIcon icon={ShoppingBag01Icon} size={14} />
                  Buy Credits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={signOut.isPending}
                className="flex items-center gap-2 text-[13px] text-[#DC2626] focus:text-[#DC2626]"
              >
                <HugeiconsIcon icon={Logout01Icon} size={14} />
                {signOut.isPending ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-16">
        <header className="sticky top-0 z-40 flex h-14 items-center border-b border-[#E5E5E5] bg-white/95 px-4 backdrop-blur-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-[#666666] transition-all hover:bg-[#F5F5F5]"
          >
            <HugeiconsIcon icon={Menu01Icon} size={18} />
          </button>
          <Link href="/app/stores" className="ml-3 flex items-center gap-2">
            <img src="/logo.png" alt="dropwiz" className="h-6 w-auto" />
            <span className="text-[15px] font-semibold text-[#0A0A0A]">dropwiz</span>
          </Link>
        </header>

        {(title || action) && (
          <header className="hidden h-16 border-b border-[#E5E5E5] bg-white px-6 lg:flex lg:items-center lg:px-8">
            <div className="flex flex-1 items-center justify-between">
              <div>
                {title && <h1 className="text-[18px] font-semibold text-[#0A0A0A]">{title}</h1>}
                {subtitle && <p className="text-[12px] text-[#666666]">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          </header>
        )}
        <main className="flex-1">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex w-[280px] flex-col bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-[#E5E5E5] px-4">
              <Link href="/app/stores" className="flex items-center gap-2">
                <img src="/logo.png" alt="dropwiz" className="h-7 w-auto" />
                <span className="text-[16px] font-semibold text-[#0A0A0A]">dropwiz</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-[#666666] transition-all hover:bg-[#F5F5F5]"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-all",
                    isActive(item.href)
                      ? "bg-[#F5F5F5] text-[#0A0A0A]"
                      : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-[#E5E5E5] p-4">
              <button
                onClick={handleSignOut}
                disabled={signOut.isPending}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[#666666] transition-all hover:bg-red-50 hover:text-[var(--dw-error)]"
              >
                <HugeiconsIcon icon={Logout01Icon} size={18} />
                {signOut.isPending ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
