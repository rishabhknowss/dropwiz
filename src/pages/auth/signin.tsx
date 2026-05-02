import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  GoogleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/dw/AuthShell";
import { api } from "@/utils/api";
import { getErrorMessage } from "@/lib/trpc-errors";
import { signInSchema } from "@/lib/auth/schemas";
import { getPendingBuild, PENDING_BUILD_KEY } from "@/components/dw/FakeBuildModal";

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
          <span className="text-[color:var(--dw-accent)]">.</span>
        </>
      }
      subtitle="Pick up where you left off."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[color:var(--dw-text)] hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="h-11 w-full justify-center gap-2 text-[14px]"
        onClick={handleGoogleAuth}
      >
        <HugeiconsIcon icon={GoogleIcon} size={15} />
        Continue with Google
      </Button>

      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[color:var(--dw-border)]" />
        </div>
        <div className="dw-mono relative flex justify-center text-[10px] tracking-[0.14em] uppercase">
          <span className="bg-[color:var(--dw-bg)] px-3 text-[color:var(--dw-text-muted)]">
            Or with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[12px] text-[color:var(--dw-text-dim)]">
            Email
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 bg-[color:var(--dw-surface)] pl-10 text-[14px]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[12px] text-[color:var(--dw-text-dim)]"
            >
              Password
            </Label>
            <Link
              href="/auth/forgot"
              className="dw-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
            >
              Forgot
            </Link>
          </div>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-[color:var(--dw-surface)] pl-10 text-[14px]"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-11 w-full gap-2 text-[14px] font-medium"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? "Signing in..." : "Sign in"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignIn;
