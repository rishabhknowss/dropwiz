import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  UserIcon,
  ArrowRight01Icon,
  Tick02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/dw/AuthShell";
import { api } from "@/utils/api";
import { signUpSchema, passwordChecks } from "@/lib/auth/schemas";
import { getErrorMessage } from "@/lib/trpc-errors";
import { cn } from "@/lib/utils";
import { getPendingBuild } from "@/components/dw/FakeBuildModal";
import { ONBOARDING_STORAGE_KEY } from "@/components/onboarding/types";
import type { z } from "zod";

const hasOnboardingData = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(ONBOARDING_STORAGE_KEY);
};

type SignUpForm = z.infer<typeof signUpSchema>;

const getDefaultEmail = (query: { email?: string | string[] }) =>
  typeof query.email === "string" ? query.email : "";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const signUp = api.auth.signUp.useMutation();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: getDefaultEmail(router.query),
      password: "",
    },
  });

  const password = form.watch("password");
  const email = form.watch("email");

  const passwordStatus = useMemo(
    () => passwordChecks.map((c) => ({ ...c, passed: c.test(password) })),
    [password],
  );
  const passwordValid = passwordStatus.every((c) => c.passed);

  const handleGoogleAuth = () => {
    if (hasOnboardingData()) {
      document.cookie = "dropwiz_google_redirect=claim; path=/; max-age=600; SameSite=Lax";
    } else {
      const pending = getPendingBuild();
      if (pending) {
        document.cookie = "dropwiz_google_redirect=build; path=/; max-age=600; SameSite=Lax";
      }
    }
    window.location.href = "/api/auth/signin/google";
  };

  const onSubmit = (data: SignUpForm) => {
    const id = toast.loading("Creating account...");
    signUp.mutate(
      { name: data.name || undefined, email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          toast.success(res.message, { id });
          setSubmitted(true);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err), { id });
          const data = err.data as { zod?: { fieldErrors?: Record<string, string[]> } } | undefined;
          const fieldErrors = data?.zod?.fieldErrors;
          if (fieldErrors) {
            for (const [key, msgs] of Object.entries(fieldErrors)) {
              if (
                (key === "name" || key === "email" || key === "password") &&
                Array.isArray(msgs) &&
                msgs[0]
              ) {
                form.setError(key, { message: String(msgs[0]) });
              }
            }
          }
        },
      },
    );
  };

  if (submitted) {
    return (
      <AuthShell
        title={
          <>
            Verify your email
            <span className="text-[var(--dw-text)]">.</span>
          </>
        }
        subtitle="If the email is available, we sent a verification link. Open it to finish signing up."
        footer={
          <Link
            href="/auth/signin"
            className="font-semibold text-[var(--dw-accent)] hover:underline"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="rounded-xl border border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] p-6 text-[14px] text-[var(--dw-text-muted)]">
          <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-[var(--dw-text-subtle)]">
            What happens next
          </div>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--dw-accent)] text-[11px] font-bold text-[#0A0A0A]">1</span>
              <span className="pt-0.5">Open the email we just sent to <strong className="text-[var(--dw-text)]">{email}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--dw-accent)] text-[11px] font-bold text-[#0A0A0A]">2</span>
              <span className="pt-0.5">Click the verification link (expires in 24h)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--dw-accent)] text-[11px] font-bold text-[#0A0A0A]">3</span>
              <span className="pt-0.5">Sign in and build your first store</span>
            </li>
          </ol>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={
        <>
          Create your account
          <span className="text-[var(--dw-text)]">.</span>
        </>
      }
      subtitle="Start building high-converting stores in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-[var(--dw-accent)] hover:underline">
            Sign in
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

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[13px] font-medium text-[var(--dw-text-secondary)]">
            Name (optional)
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={UserIcon}
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
            />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              {...form.register("name")}
              className="h-12 border-[var(--dw-border)] bg-[var(--dw-surface)] pl-12 text-[15px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20"
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-[12px] text-[var(--dw-error)]">{form.formState.errors.name.message}</p>
          )}
        </div>

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
              {...form.register("email")}
              placeholder="you@company.com"
              className={cn(
                "h-12 border-[var(--dw-border)] bg-[var(--dw-surface)] pl-12 text-[15px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20",
                form.formState.errors.email && "border-[var(--dw-error)] focus:border-[var(--dw-error)] focus:ring-[var(--dw-error)]/20",
              )}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-[12px] text-[var(--dw-error)]">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-medium text-[var(--dw-text-secondary)]">
            Password
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...form.register("password")}
              className={cn(
                "h-12 border-[var(--dw-border)] bg-[var(--dw-surface)] pl-12 pr-12 text-[15px] text-[var(--dw-text)] focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20",
                form.formState.errors.password && "border-[var(--dw-error)] focus:border-[var(--dw-error)] focus:ring-[var(--dw-error)]/20",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)] transition-colors hover:text-[var(--dw-text)]"
            >
              <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {passwordStatus.map((c) => (
              <span
                key={c.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                  c.passed
                    ? "border-[var(--dw-success)]/30 bg-[var(--dw-success-bg)] text-[var(--dw-success)]"
                    : "border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] text-[var(--dw-text-subtle)]",
                )}
              >
                <HugeiconsIcon icon={Tick02Icon} size={10} className={c.passed ? "text-[var(--dw-success)]" : "text-[var(--dw-text-subtle)]"} />
                {c.label}
              </span>
            ))}
          </div>

          {form.formState.errors.password && (
            <p className="text-[12px] text-[var(--dw-error)]">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full gap-2 bg-[var(--dw-accent)] text-[15px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/30 transition-all hover:brightness-110 hover:shadow-[var(--dw-accent)]/40"
          disabled={signUp.isPending || !passwordValid}
        >
          {signUp.isPending ? "Creating account..." : "Create account"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignUp;
