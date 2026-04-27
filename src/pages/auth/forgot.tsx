import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/dw/AuthShell";
import { api } from "@/utils/api";
import { getErrorMessage } from "@/lib/trpc-errors";
import { emailSchema } from "@/lib/auth/schemas";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const forgot = api.auth.forgotPassword.useMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }
    const id = toast.loading("Sending reset link...");
    forgot.mutate(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message, { id });
          setSent(true);
        },
        onError: (err) => toast.error(getErrorMessage(err), { id }),
      },
    );
  };

  return (
    <AuthShell
      title={
        <>
          Reset your password
          <span className="text-[color:var(--dw-accent)]">.</span>
        </>
      }
      subtitle={
        sent
          ? "If that email exists, a reset link is on its way. Check your inbox."
          : "Enter your email and we'll send a reset link."
      }
      footer={
        <Link
          href="/auth/signin"
          className="font-medium text-[color:var(--dw-text)] hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 text-center text-[13px] text-[color:var(--dw-text-dim)]">
          Email sent. Check spam if you don&apos;t see it.
        </div>
      ) : (
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
          <Button
            type="submit"
            className="h-11 w-full gap-2 text-[14px] font-medium"
            disabled={forgot.isPending}
          >
            {forgot.isPending ? "Sending..." : "Send reset link"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default Forgot;
