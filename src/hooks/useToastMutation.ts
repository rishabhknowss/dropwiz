import { toast } from "sonner";
import type { UseMutationResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/routers/_app";
import { getErrorMessage } from "@/lib/trpc-errors";

type AnyTRPCMutation<TData, TInput> = UseMutationResult<
  TData,
  TRPCClientErrorLike<AppRouter>,
  TInput
>;

export function runWithToast<TData, TInput>(
  mutation: AnyTRPCMutation<TData, TInput>,
  payload: TInput,
  opts: {
    loading: string;
    success: string | ((data: TData) => string);
    onSuccess?: (data: TData) => void;
    onError?: (message: string) => void;
    toastId?: string;
  },
): void {
  const id = opts.toastId ?? `op:${opts.loading}`;
  toast.loading(opts.loading, { id });
  mutation.mutate(payload, {
    onSuccess: (data) => {
      const msg =
        typeof opts.success === "function" ? opts.success(data) : opts.success;
      toast.success(msg, { id });
      opts.onSuccess?.(data);
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      toast.error(msg, { id });
      opts.onError?.(msg);
    },
  });
}

export function runSilent<TData, TInput>(
  mutation: AnyTRPCMutation<TData, TInput>,
  payload: TInput,
  opts: {
    onSuccess?: (data: TData) => void;
    onError?: (message: string) => void;
  } = {},
): void {
  mutation.mutate(payload, {
    onSuccess: (data) => opts.onSuccess?.(data),
    onError: (err) => {
      const msg = getErrorMessage(err);
      if (opts.onError) opts.onError(msg);
      else toast.error(msg);
    },
  });
}
