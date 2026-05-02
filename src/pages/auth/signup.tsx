import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  UserIcon,
  GoogleIcon,
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

const PERKS = [
  "Unlimited draft stores on free tier",
  "60-second store generation",
  "Nightly agentic optimization",
];

type Errors = Partial<Record<"name" | "email" | "password", string>>;

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const signUp = api.auth.signUp.useMutation();

  const handleGoogleAuth = () => {
    const pending = getPendingBuild();
    if (pending) {
      document.cookie = "dropwiz_google_redirect=build; path=/; max-age=600; SameSite=Lax";
    }
    window.location.href = "/api/auth/signin/google";
  };

  const passwordStatus = useMemo(
    () => passwordChecks.map((c) => ({ ...c, passed: c.test(password) })),
    [password],
  );
  const passwordValid = passwordStatus.every((c) => c.passed);

  const validate = (): boolean => {
    const result = signUpSchema.safeParse({
      name: name || undefined,
      email,
      password,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "password") {
        if (!next[field]) next[field] = issue.message;
      }
    }
    setErrors(next);
    return false;
  };

  const handleBlur = (field: "name" | "email" | "password") => {
    setTouched((t) => ({ ...t, [field]: true }));
    validate();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!validate()) {
      toast.error("Please fix the errors above");
      return;
    }

    const id = toast.loading("Creating account...");
    signUp.mutate(
      { name: name || undefined, email, password },
      {
        onSuccess: (data) => {
          toast.success(data.message, { id });
          setSubmitted(true);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err), { id });
          const fieldErrors = err.data?.zod?.fieldErrors;
          if (fieldErrors) {
            const next: Errors = {};
            for (const [key, msgs] of Object.entries(fieldErrors)) {
              if (
                (key === "name" || key === "email" || key === "password") &&
                Array.isArray(msgs) &&
                msgs[0]
              ) {
                next[key] = String(msgs[0]);
              }
            }
            setErrors(next);
            setTouched({ name: true, email: true, password: true });
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
            <span className="text-[color:var(--dw-accent)]">.</span>
          </>
        }
        subtitle="If the email is available, we sent a verification link. Open it to finish signing up."
        footer={
          <Link
            href="/auth/signin"
            className="font-medium text-[color:var(--dw-text)] hover:underline"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 text-[13px] text-[color:var(--dw-text-dim)]">
          <div className="dw-mono mb-3 text-[10px] uppercase tracking-[0.14em] text-[color:var(--dw-text-muted)]">
            What happens next
          </div>
          <ol className="space-y-2.5">
            <li className="flex gap-3">
              <span className="dw-mono text-[color:var(--dw-accent)]">01</span>
              <span>Open the email we just sent to {email}</span>
            </li>
            <li className="flex gap-3">
              <span className="dw-mono text-[color:var(--dw-accent)]">02</span>
              <span>Click the verification link (expires in 24h)</span>
            </li>
            <li className="flex gap-3">
              <span className="dw-mono text-[color:var(--dw-accent)]">03</span>
              <span>Sign in and build your first store</span>
            </li>
          </ol>
        </div>
      </AuthShell>
    );
  }

  const showError = (field: "name" | "email" | "password") =>
    touched[field] && errors[field];

  return (
    <AuthShell
      title={
        <>
          Build a store
          <br />
          in 60 seconds
          <span className="text-[color:var(--dw-accent)]">.</span>
        </>
      }
      subtitle="Free forever. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-[color:var(--dw-text)] hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-7 space-y-2">
        {PERKS.map((p) => (
          <div
            key={p}
            className="flex items-center gap-2.5 text-[13px] text-[color:var(--dw-text-dim)]"
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              size={13}
              className="text-[color:var(--dw-accent)]"
            />
            {p}
          </div>
        ))}
      </div>

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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          id="name"
          label="Name (optional)"
          icon={UserIcon}
          value={name}
          onChange={setName}
          onBlur={() => handleBlur("name")}
          error={showError("name") ? errors.name : undefined}
        />

        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail01Icon}
          placeholder="you@company.com"
          value={email}
          onChange={setEmail}
          onBlur={() => handleBlur("email")}
          error={showError("email") ? errors.email : undefined}
        />

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-[12px] text-[color:var(--dw-text-dim)]"
          >
            Password
          </Label>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              aria-invalid={!!showError("password")}
              className={cn(
                "h-11 bg-[color:var(--dw-surface)] pl-10 pr-10 text-[14px]",
                showError("password") &&
                  "border-[color:var(--dw-signal)] focus-visible:ring-[color:var(--dw-signal)]/30",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                size={15}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {passwordStatus.map((c) => (
              <span
                key={c.label}
                className={cn(
                  "dw-mono inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] tracking-[0.08em] uppercase transition",
                  c.passed
                    ? "border-[color:var(--dw-jade)]/30 bg-[color:var(--dw-jade)]/10 text-[color:var(--dw-jade)]"
                    : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] text-[color:var(--dw-text-muted)]",
                )}
              >
                {c.passed ? "✓" : "·"} {c.label}
              </span>
            ))}
          </div>

          {showError("password") && (
            <p className="pt-0.5 text-[11px] text-[color:var(--dw-signal)]">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full gap-2 text-[14px] font-medium"
          disabled={signUp.isPending || !passwordValid}
        >
          {signUp.isPending ? "Creating..." : "Create account"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Button>
      </form>
    </AuthShell>
  );
};

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  icon: typeof Mail01Icon;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
};

const Field = ({
  id,
  label,
  type = "text",
  autoComplete,
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-[12px] text-[color:var(--dw-text-dim)]">
      {label}
    </Label>
    <div className="relative">
      <HugeiconsIcon
        icon={icon}
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
      />
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(
          "h-11 bg-[color:var(--dw-surface)] pl-10 text-[14px]",
          error &&
            "border-[color:var(--dw-signal)] focus-visible:ring-[color:var(--dw-signal)]/30",
        )}
      />
    </div>
    {error && (
      <p className="pt-0.5 text-[11px] text-[color:var(--dw-signal)]">{error}</p>
    )}
  </div>
);

export default SignUp;
