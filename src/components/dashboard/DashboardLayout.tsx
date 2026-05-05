import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  Add01Icon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  ShoppingBag01Icon,
  ChartLineData02Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";
import { useShop } from "@/lib/shop-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DWLogo } from "@/components/dw/Logo";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Store01Icon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Stores", href: "/app/stores", icon: Store01Icon },
  { label: "Shopify", href: "/app/shopify", icon: ShoppingBag01Icon },
  { label: "Analytics", href: "/app/analytics", icon: ChartLineData02Icon },
];

type DashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const DashboardLayout = ({
  children,
  title,
  subtitle,
  action,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const me = api.auth.me.useQuery();
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();
  const { selectedShop, setSelectedShop } = useShop();

  const shops = api.analytics.getConnectedShops.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (shops.data && shops.data.length > 0 && !selectedShop) {
      setSelectedShop(shops.data[0]!.shopDomain);
    }
  }, [shops.data, selectedShop, setSelectedShop]);

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

  const isActive = (href: string) => router.pathname === href;

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
        isActive(item.href)
          ? "bg-[var(--dw-accent-subtle)] text-[var(--dw-accent)]"
          : "text-[var(--dw-text-muted)] hover:bg-[var(--dw-bg-tertiary)] hover:text-[var(--dw-text)]"
      )}
    >
      <HugeiconsIcon icon={item.icon} size={18} />
      {item.label}
    </Link>
  );

  const StoreSelector = () => {
    if (!shops.data || shops.data.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--dw-surface-hover)]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--dw-accent)] text-white">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[var(--dw-text)]">
              {selectedShop?.replace(".myshopify.com", "") ?? "Select store"}
            </p>
          </div>
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-[var(--dw-text-subtle)]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          {shops.data.map((shop) => (
            <DropdownMenuItem
              key={shop.id}
              onClick={() => setSelectedShop(shop.shopDomain)}
              className="flex items-center gap-2 text-[14px]"
            >
              <span className="flex-1 truncate">
                {shop.shopDomain.replace(".myshopify.com", "")}
              </span>
              {selectedShop === shop.shopDomain && (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-[var(--dw-success)]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="flex h-16 items-center px-5">
        <Link href="/app/stores" className="flex items-center">
          <DWLogo size={40} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4">
        {shops.data && shops.data.length > 0 && (
          <div className="mb-4">
            <StoreSelector />
          </div>
        )}

        <Link
          href="/build/new"
          onClick={onNavClick}
          className="mb-5 flex items-center justify-center gap-2.5 rounded-lg bg-[var(--dw-accent)] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--dw-accent-hover)]"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          New Store
        </Link>

        <nav className="flex-1 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} item={item} onClick={onNavClick} />
          ))}
        </nav>

        <div className="border-t border-[var(--dw-border)] py-4">
          <Link
            href="/app/settings"
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
              isActive("/app/settings")
                ? "bg-[var(--dw-accent-subtle)] text-[var(--dw-accent)]"
                : "text-[var(--dw-text-muted)] hover:bg-[var(--dw-bg-tertiary)] hover:text-[var(--dw-text)]"
            )}
          >
            <HugeiconsIcon icon={Settings01Icon} size={18} />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signOut.isPending}
            className="mt-1.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[var(--dw-text-muted)] transition-colors hover:bg-[var(--dw-error-bg)] hover:text-[var(--dw-error)]"
          >
            <HugeiconsIcon icon={Logout01Icon} size={18} />
            {signOut.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--dw-bg)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--dw-border)] bg-[var(--dw-bg)] px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--dw-text-muted)] transition-colors hover:bg-[var(--dw-bg-tertiary)] lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </button>
            {title && (
              <div>
                <h1 className="text-[17px] font-semibold text-[var(--dw-text)]">{title}</h1>
                {subtitle && <p className="text-[13px] text-[var(--dw-text-muted)]">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {me.data && (
              <div className="hidden items-center gap-2 rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 py-2 md:flex">
                <span className="text-[13px] font-medium text-[var(--dw-text)]">
                  {me.data.imageCredits ?? 0}
                </span>
                <span className="text-[12px] text-[var(--dw-text-muted)]">credits</span>
              </div>
            )}
            <ThemeToggle />
            {action}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dw-accent)] text-[13px] font-semibold text-white">
              {me.data?.email?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex w-72 flex-col bg-[var(--dw-bg-secondary)]">
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--dw-text-muted)] hover:bg-[var(--dw-bg-tertiary)]"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </button>
            </div>
            <SidebarContent onNavClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
};
