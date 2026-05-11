import { useState, useEffect, useMemo } from "react";
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
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";
import { useShop } from "@/lib/shop-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/loaders";
import type { RouterOutputs } from "@/utils/api";

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

type Shop = RouterOutputs["analytics"]["getConnectedShops"][number];

type NavLinkProps = {
  item: NavItem;
  onClick?: () => void;
  isActive: boolean;
};

const NavLink = ({ item, onClick, isActive }: NavLinkProps) => (
  <Link
    href={item.href}
    onClick={onClick}
    className={cn(
      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
      isActive
        ? "bg-[var(--dw-accent-subtle)] text-[var(--dw-accent)]"
        : "text-[var(--dw-text-muted)] hover:bg-[var(--dw-surface-hover)] hover:text-[var(--dw-text)]"
    )}
  >
    {isActive && (
      <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--dw-accent)]" />
    )}
    <HugeiconsIcon
      icon={item.icon}
      size={18}
      strokeWidth={1.5}
      className={cn(
        "transition-colors",
        isActive ? "text-[var(--dw-accent)]" : "text-[var(--dw-text-subtle)] group-hover:text-[var(--dw-text-muted)]"
      )}
    />
    {item.label}
  </Link>
);

type StoreSelectorProps = {
  shops: Shop[];
  selectedShop: string | null;
  onSelectShop: (shop: string) => void;
};

const StoreSelector = ({ shops, selectedShop, onSelectShop }: StoreSelectorProps) => {
  if (shops.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl bg-[var(--dw-surface2)] px-3 py-2.5 text-left transition-all hover:bg-[var(--dw-surface-hover)]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)]">
          <HugeiconsIcon icon={ShoppingBag01Icon} size={14} className="text-[#0A0A0A]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-[var(--dw-text)]">
            {selectedShop?.replace(".myshopify.com", "") ?? "Select store"}
          </p>
          <p className="text-[10px] text-[var(--dw-text-subtle)]">Connected store</p>
        </div>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-[var(--dw-text-subtle)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {shops.map((shop) => (
          <DropdownMenuItem
            key={shop.id}
            onClick={() => onSelectShop(shop.shopDomain)}
            className="flex items-center gap-2 text-[13px]"
          >
            <span className="flex-1 truncate">
              {shop.shopDomain.replace(".myshopify.com", "")}
            </span>
            {selectedShop === shop.shopDomain && (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-[var(--dw-success)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type SidebarContentProps = {
  onNavClick?: () => void;
  shops: Shop[];
  selectedShop: string | null;
  onSelectShop: (shop: string) => void;
  isActive: (href: string) => boolean;
  onSignOut: () => void;
  isSigningOut: boolean;
};

const SidebarContent = ({
  onNavClick,
  shops,
  selectedShop,
  onSelectShop,
  isActive,
  onSignOut,
  isSigningOut,
}: SidebarContentProps) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center px-5">
      <Link href="/app/stores" className="text-[17px] font-bold tracking-tight text-[var(--dw-text)]">
        drop<span className="text-[var(--dw-accent)]">wiz</span>
      </Link>
    </div>

    <div className="flex-1 overflow-y-auto px-3 py-2">
      {shops.length > 0 && (
        <div className="mb-4">
          <StoreSelector shops={shops} selectedShop={selectedShop} onSelectShop={onSelectShop} />
        </div>
      )}

      <Link
        href="/build/new"
        onClick={onNavClick}
        className="group mb-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] px-4 py-3 text-[13px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
      >
        <HugeiconsIcon icon={SparklesIcon} size={16} className="transition-transform group-hover:scale-110" />
        Create Store
      </Link>

      <div className="mb-2 px-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
          Navigation
        </span>
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.label} item={item} onClick={onNavClick} isActive={isActive(item.href)} />
        ))}
      </nav>
    </div>

    <div className="border-t border-[var(--dw-border)] p-3">
      <Link
        href="/app/settings"
        onClick={onNavClick}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
          isActive("/app/settings")
            ? "bg-[var(--dw-accent-subtle)] text-[var(--dw-accent)]"
            : "text-[var(--dw-text-muted)] hover:bg-[var(--dw-surface-hover)] hover:text-[var(--dw-text)]"
        )}
      >
        <HugeiconsIcon icon={Settings01Icon} size={18} strokeWidth={1.5} className="text-[var(--dw-text-subtle)]" />
        Settings
      </Link>
      <button
        onClick={onSignOut}
        disabled={isSigningOut}
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--dw-text-muted)] transition-all hover:bg-[var(--dw-error-bg)] hover:text-[var(--dw-error)]"
      >
        <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={1.5} />
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  </div>
);

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

  const shopsList = useMemo(() => shops.data ?? [], [shops.data]);

  useEffect(() => {
    if (shopsList.length > 0 && !selectedShop) {
      setSelectedShop(shopsList[0]!.shopDomain);
    }
  }, [shopsList, selectedShop, setSelectedShop]);

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

  const sidebarProps = {
    shops: shopsList,
    selectedShop,
    onSelectShop: setSelectedShop,
    isActive,
    onSignOut: handleSignOut,
    isSigningOut: signOut.isPending,
  };

  return (
    <div className="flex min-h-screen bg-[var(--dw-bg)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[240px] border-r border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] lg:block">
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="flex flex-1 flex-col lg:pl-[240px]">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--dw-border)] bg-[var(--dw-bg)]/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--dw-text-muted)] transition-all hover:bg-[var(--dw-surface)] lg:hidden"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} />
            </button>
            {title && (
              <div>
                <h1 className="text-[16px] font-semibold tracking-tight text-[var(--dw-text)]">{title}</h1>
                {subtitle && <p className="text-[12px] text-[var(--dw-text-muted)]">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {me.data && (
              <div className="hidden items-center gap-2 rounded-xl bg-[var(--dw-surface)] px-3.5 py-2 md:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--dw-secondary-subtle)]">
                  <HugeiconsIcon icon={SparklesIcon} size={12} className="text-[var(--dw-secondary)]" />
                </div>
                <span className="dw-mono text-[13px] font-semibold text-[var(--dw-text)]">
                  {me.data.imageCredits ?? 0}
                </span>
                <span className="text-[11px] text-[var(--dw-text-subtle)]">credits</span>
              </div>
            )}
            {action}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)] text-[12px] font-bold text-[#0A0A0A] transition-all hover:opacity-90">
                {me.data?.email?.[0]?.toUpperCase() ?? "?"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/app/settings" className="flex items-center gap-2 text-[13px]">
                    <HugeiconsIcon icon={Settings01Icon} size={14} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                  className="flex items-center gap-2 text-[13px] text-[var(--dw-error)] focus:text-[var(--dw-error)]"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={14} />
                  {signOut.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-[280px] bg-[var(--dw-bg-secondary)] shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-[var(--dw-text-muted)] transition-all hover:bg-[var(--dw-surface)]"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
            <SidebarContent {...sidebarProps} onNavClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
};
