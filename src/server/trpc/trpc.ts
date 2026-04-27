import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";
import { checkLimits } from "./rate-limit";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zod: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }
  return next({ ctx: { ...ctx, session: ctx.session, user: ctx.session.user } });
});

const isVerified = middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!ctx.session.user.emailVerified) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Email not verified" });
  }
  return next({ ctx: { ...ctx, session: ctx.session, user: ctx.session.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const verifiedProcedure = t.procedure.use(isVerified);

type RateLimitInit = { limit: number; windowMs: number; scope: string };

function buildRateLimit(init: RateLimitInit) {
  return middleware(async ({ ctx, next }) => {
    const key = `${init.scope}:ip:${ctx.ip}`;
    const result = await checkLimits([
      { key, limit: init.limit, windowMs: init.windowMs },
    ]);
    if (!result.success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many attempts. Please try again later.",
      });
    }
    return next();
  });
}

export const rateLimitedProcedure = (init: RateLimitInit) =>
  t.procedure.use(buildRateLimit(init));
