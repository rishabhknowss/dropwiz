import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/dw/AuthShell";
import { api } from "@/utils/api";
import { getErrorMessage } from "@/lib/trpc-errors";
import { passwordSchema } from "@/lib/auth/schemas";

const resetFormSchema = z.object({
  password: passwordSchema,
});

type ResetForm = z.infer<typeof resetFormSchema>;

const Reset = () => {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const reset = api.auth.resetPassword.useMutation();

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: ResetForm) => {
    const token = typeof router.query.token === "string" ? router.query.token : null;
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    const id = toast.loading("Updating password...");
    reset.mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          toast.success("Password updated. Sign in with your new password.", { id });
          setDone(true);
        },
        onError: (err) => toast.error(getErrorMessage(err), { id }),
      },
    );
  };

  return (
    <AuthShell
      title={
        <>
          Set a new password
          <span className="text-[color:var(--dw-accent)]">.</span>
        </>
      }
      subtitle="Choose something strong. We'll sign you out of other sessions."
      footer={
        <Link
          href="/auth/signin"
          className="font-medium text-[color:var(--dw-text)] hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 text-center text-[13px] text-[color:var(--dw-text-dim)]">
          Password updated. You can sign in now.
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-[12px] text-[color:var(--dw-text-dim)]"
            >
              New password
            </Label>
            <div className="relative">
              <HugeiconsIcon
                icon={LockPasswordIcon}
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
              />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...form.register("password")}
                className="h-11 bg-[color:var(--dw-surface)] pl-10 text-[14px]"
              />
            </div>
            <p className="text-[11px] text-[color:var(--dw-text-muted)]">
              Min 10 chars · uppercase · lowercase · number
            </p>
            {form.formState.errors.password && (
              <p className="text-[11px] text-[var(--dw-error)]">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="h-11 w-full gap-2 text-[14px] font-medium"
            disabled={reset.isPending}
          >
            {reset.isPending ? "Updating..." : "Update password"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default Reset;
