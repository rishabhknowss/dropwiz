import { TRPCError } from "@trpc/server";
import { and, eq, gt, isNotNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users, authEvents } from "@/db/schema";
import { clearAuthCookies, sendAuthCookies } from "@/lib/auth/cookies";
import { normalizeEmail } from "@/lib/auth/email-normalize";
import {
  sendPasswordResetEmail,
  sendSignupAttemptNotice,
  sendVerificationEmail,
} from "@/lib/auth/emails";
import {
  dummyCompare,
  hashPassword,
  passwordSchema,
  verifyPassword,
} from "@/lib/auth/password";
import {
  HOUR_MS,
  generateSecureToken,
  getExpiryFromNow,
  timingSafeEqualHex,
} from "@/lib/auth/tokens";
import { checkLimits } from "../rate-limit";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const emailSchema = z.string().email().max(320);

async function logEvent(input: {
  userId?: string | null;
  kind: string;
  email?: string | null;
  ip: string;
  userAgent: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(authEvents).values({
      userId: input.userId ?? null,
      kind: input.kind,
      email: input.email ?? null,
      ip: input.ip,
      userAgent: input.userAgent,
      success: input.success ? 1 : 0,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });
  } catch {}
}

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.session?.user) return null;
    const u = ctx.session.user;
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      locale: u.locale,
      emailVerified: !!u.emailVerified,
    };
  }),

  signUp: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
        name: z.string().min(1).max(200).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rl = await checkLimits([
        { key: `signup:ip:${ctx.ip}`, limit: 10, windowMs: 15 * 60 * 1000 },
        {
          key: `signup:email:${normalizeEmail(input.email)}`,
          limit: 3,
          windowMs: 60 * 60 * 1000,
        },
      ]);
      if (!rl.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many signup attempts. Try again later.",
        });
      }

      const emailLower = input.email.trim().toLowerCase();
      const normalized = normalizeEmail(input.email);

      const existing = await db
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(or(eq(users.email, emailLower), eq(users.normalizedEmail, normalized)))
        .limit(1);

      if (existing[0]) {
        await hashPassword(input.password);
        await sendSignupAttemptNotice(existing[0].email).catch(() => {});
        await logEvent({
          userId: existing[0].id,
          kind: "signup.duplicate",
          email: emailLower,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: false,
        });
        return {
          success: true,
          message: "If this email is available, we sent a verification link.",
        };
      }

      const passwordHash = await hashPassword(input.password);
      const verificationToken = generateSecureToken();

      const [created] = await db
        .insert(users)
        .values({
          email: emailLower,
          normalizedEmail: normalized,
          passwordHash,
          name: input.name,
          verificationToken,
          verificationTokenExpiresAt: getExpiryFromNow(24 * HOUR_MS),
        })
        .returning();

      await sendVerificationEmail(emailLower, verificationToken).catch(() => {});

      await logEvent({
        userId: created.id,
        kind: "signup.success",
        email: emailLower,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        success: true,
      });

      return {
        success: true,
        message: "If this email is available, we sent a verification link.",
      };
    }),

  signIn: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        password: z.string().min(1).max(128),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const emailLower = input.email.trim().toLowerCase();

      const rl = await checkLimits([
        { key: `signin:ip:${ctx.ip}`, limit: 10, windowMs: 15 * 60 * 1000 },
        { key: `signin:email:${emailLower}`, limit: 5, windowMs: 15 * 60 * 1000 },
      ]);
      if (!rl.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many attempts. Please try again later.",
        });
      }

      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, emailLower))
        .limit(1);
      const user = rows[0];

      if (!user || !user.passwordHash) {
        await dummyCompare();
        await logEvent({
          userId: user?.id,
          kind: "signin.fail",
          email: emailLower,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: false,
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const ok = await verifyPassword(input.password, user.passwordHash);
      if (!ok) {
        await logEvent({
          userId: user.id,
          kind: "signin.fail",
          email: emailLower,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: false,
        });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      if (!user.emailVerified) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Please verify your email before signing in.",
        });
      }

      await sendAuthCookies(ctx.res, user.id, user.refreshTokenVersion);

      await logEvent({
        userId: user.id,
        kind: "signin.success",
        email: emailLower,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        success: true,
      });

      return { success: true };
    }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(users)
      .set({
        refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.user.id));

    clearAuthCookies(ctx.res);

    await logEvent({
      userId: ctx.user.id,
      kind: "signout",
      email: ctx.user.email,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      success: true,
    });

    return { success: true };
  }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string().length(64) }))
    .mutation(async ({ ctx, input }) => {
      const rows = await db
        .select()
        .from(users)
        .where(
          and(
            isNotNull(users.verificationToken),
            gt(users.verificationTokenExpiresAt, new Date()),
          ),
        );

      const match = rows.find(
        (u) => u.verificationToken && timingSafeEqualHex(u.verificationToken, input.token),
      );

      if (!match) {
        await logEvent({
          kind: "verify.fail",
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: false,
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification link",
        });
      }

      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          verificationToken: null,
          verificationTokenExpiresAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, match.id));

      await logEvent({
        userId: match.id,
        kind: "verify.success",
        email: match.email,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        success: true,
      });

      return { success: true };
    }),

  resendVerification: publicProcedure
    .input(z.object({ email: emailSchema }))
    .mutation(async ({ input }) => {
      const rl = await checkLimits([
        {
          key: `resend:email:${normalizeEmail(input.email)}`,
          limit: 3,
          windowMs: 60 * 60 * 1000,
        },
      ]);
      if (!rl.success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const emailLower = input.email.trim().toLowerCase();
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, emailLower))
        .limit(1);
      const user = rows[0];

      if (user && !user.emailVerified) {
        const token = generateSecureToken();
        await db
          .update(users)
          .set({
            verificationToken: token,
            verificationTokenExpiresAt: getExpiryFromNow(24 * HOUR_MS),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
        await sendVerificationEmail(user.email, token).catch(() => {});
      }

      return { success: true };
    }),

  forgotPassword: publicProcedure
    .input(z.object({ email: emailSchema }))
    .mutation(async ({ ctx, input }) => {
      const rl = await checkLimits([
        { key: `forgot:ip:${ctx.ip}`, limit: 10, windowMs: 60 * 60 * 1000 },
        {
          key: `forgot:email:${normalizeEmail(input.email)}`,
          limit: 3,
          windowMs: 60 * 60 * 1000,
        },
      ]);
      if (!rl.success) {
        return {
          success: true,
          message: "If that email exists, we sent a reset link.",
        };
      }

      const emailLower = input.email.trim().toLowerCase();
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, emailLower))
        .limit(1);
      const user = rows[0];

      if (user && user.passwordHash) {
        const token = generateSecureToken();
        await db
          .update(users)
          .set({
            resetToken: token,
            resetTokenExpiresAt: getExpiryFromNow(HOUR_MS),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
        await sendPasswordResetEmail(user.email, token).catch(() => {});
        await logEvent({
          userId: user.id,
          kind: "forgot.sent",
          email: emailLower,
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: true,
        });
      }

      return {
        success: true,
        message: "If that email exists, we sent a reset link.",
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().length(64),
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rl = await checkLimits([
        { key: `reset:ip:${ctx.ip}`, limit: 10, windowMs: 60 * 60 * 1000 },
      ]);
      if (!rl.success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const rows = await db
        .select()
        .from(users)
        .where(and(isNotNull(users.resetToken), gt(users.resetTokenExpiresAt, new Date())));

      const match = rows.find(
        (u) => u.resetToken && timingSafeEqualHex(u.resetToken, input.token),
      );

      if (!match) {
        await logEvent({
          kind: "reset.fail",
          ip: ctx.ip,
          userAgent: ctx.userAgent,
          success: false,
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset link",
        });
      }

      const newHash = await hashPassword(input.password);
      await db
        .update(users)
        .set({
          passwordHash: newHash,
          resetToken: null,
          resetTokenExpiresAt: null,
          refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
          emailVerified: match.emailVerified ?? new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, match.id));

      await logEvent({
        userId: match.id,
        kind: "reset.success",
        email: match.email,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        success: true,
      });

      return { success: true };
    }),
});
