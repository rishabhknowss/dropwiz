import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/dw/AuthShell";
import { api } from "@/utils/api";
import { getErrorMessage } from "@/lib/trpc-errors";
import { signInSchema } from "@/lib/auth/schemas";
import { getPendingBuild } from "@/components/dw/FakeBuildModal";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = api.auth.signIn.useMutation();

  const getRedirectUrl = () => {
    const pending = getPendingBuild();
    if (router.query.redirect === "build" && pending) {
      return `/build/new?pending=true`;
    }
    if (router.query.redirect === "connect-shopify") {
      return `/app/stores?action=connect-shopify`;
    }
    if (router.query.redirect === "ai-build") {
      return `/build/new?mode=ai`;
    }
    return "/app";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your inputs");
      return;
    }
    const id = toast.loading("Signing in...");
    signIn.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Welcome back", { id });
          router.push(getRedirectUrl());
        },
        onError: (err) => toast.error(getErrorMessage(err), { id }),
      },
    );
  };

  const handleGoogleAuth = () => {
    const pending = getPendingBuild();
    if (pending) {
      document.cookie = "dropwiz_google_redirect=build; path=/; max-age=600; SameSite=Lax";
    } else if (router.query.redirect === "connect-shopify") {
      document.cookie = "dropwiz_google_redirect=connect-shopify; path=/; max-age=600; SameSite=Lax";
    } else if (router.query.redirect === "ai-build") {
      document.cookie = "dropwiz_google_redirect=ai-build; path=/; max-age=600; SameSite=Lax";
    }
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <AuthShell
      title={
        <>
          Welcome back
          <span className="text-[var(--dw-text)]">.</span>
        </>
      }
      subtitle="Sign in to continue building your stores."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[var(--dw-accent)] hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="h-12 w-full justify-center gap-3 border-[var(--dw-border)] bg-[var(--dw-surface)] text-[15px] font-medium text-[var(--dw-text)] transition-all hover:border-[var(--dw-border-strong)] hover:bg-[var(--dw-surface-hover)]"
        onClick={handleGoogleAuth}
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--dw-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--dw-bg)] px-4 text-[13px] text-[var(--dw-text-subtle)]">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-[var(--dw-text-secondary)]">
            Email
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-12 border-[var(--dw-border)] bg-[var(--dw-surface)] pl-12 text-[15px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] font-medium text-[var(--dw-text-secondary)]">
              Password
            </Label>
            <Link
              href="/auth/forgot"
              className="text-[13px] font-medium text-[var(--dw-accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-[var(--dw-border)] bg-[var(--dw-surface)] pl-12 text-[15px] text-[var(--dw-text)] focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full gap-2 bg-[var(--dw-accent)] text-[15px] font-semibold text-white shadow-lg shadow-[var(--dw-accent)]/25 transition-all hover:bg-[var(--dw-accent-hover)] hover:shadow-[var(--dw-accent)]/30"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? "Signing in..." : "Sign in"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignIn;
