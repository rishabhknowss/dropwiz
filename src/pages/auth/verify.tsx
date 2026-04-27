import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import { AuthShell } from "@/components/dw/AuthShell";
import { DWChip } from "@/components/dw/Chip";
import { api } from "@/utils/api";

type VerifyState = "pending" | "success" | "error";

const VerifyEmail = () => {
  const router = useRouter();
  const verifyEmail = api.auth.verifyEmail.useMutation();
  const token = typeof router.query.token === "string" ? router.query.token : null;
  const ran = useRef(false);

  useEffect(() => {
    if (!router.isReady || !token || ran.current) return;
    ran.current = true;
    const id = toast.loading("Verifying your email...");
    verifyEmail.mutate(
      { token },
      {
        onSuccess: () => toast.success("Email verified. Sign in now.", { id }),
        onError: (err) => toast.error(err.message, { id }),
      },
    );
  }, [router.isReady, token, verifyEmail]);

  const state: VerifyState = !router.isReady
    ? "pending"
    : !token
      ? "error"
      : verifyEmail.isSuccess
        ? "success"
        : verifyEmail.isError
          ? "error"
          : "pending";

  const titles: Record<VerifyState, string> = {
    pending: "Verifying…",
    success: "Email verified",
    error: "Verification failed",
  };

  const subs: Record<VerifyState, string> = {
    pending: "One moment while we check your link.",
    success: "Your account is ready. Sign in to start building.",
    error: "The link is invalid or has expired. Request a new one from the sign-in page.",
  };

  return (
    <AuthShell
      title={
        <>
          {titles[state]}
          <span className="text-[color:var(--dw-accent)]">.</span>
        </>
      }
      subtitle={subs[state]}
      footer={
        <Link
          href="/auth/signin"
          className="font-medium text-[color:var(--dw-text)] hover:underline"
        >
          Continue to sign in
        </Link>
      }
    >
      <div className="flex justify-center">
        <DWChip
          variant={state === "success" ? "live" : state === "error" ? "signal" : "neutral"}
        >
          {state === "pending"
            ? "Checking token"
            : state === "success"
              ? "All set"
              : "Invalid / expired"}
        </DWChip>
      </div>
    </AuthShell>
  );
};

export default VerifyEmail;
