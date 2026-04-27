import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/routers/_app";

type AppError = TRPCClientErrorLike<AppRouter>;

export function getErrorMessage(err: AppError): string {
  const fieldErrors = err.data?.zod?.fieldErrors;
  if (fieldErrors) {
    for (const messages of Object.values(fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0 && messages[0]) {
        return String(messages[0]);
      }
    }
  }

  const formErrors = err.data?.zod?.formErrors;
  if (Array.isArray(formErrors) && formErrors.length > 0) {
    return String(formErrors[0]);
  }

  try {
    const parsed = JSON.parse(err.message);
    if (Array.isArray(parsed) && parsed[0]?.message) {
      return String(parsed[0].message);
    }
  } catch {}

  return err.message || "Something went wrong";
}
