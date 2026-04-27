import { env } from "@/env";
import { sendEmail } from "@/lib/email/transport";

function verifyUrl(token: string): string {
  return `${env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${encodeURIComponent(token)}`;
}

function resetUrl(token: string): string {
  return `${env.NEXT_PUBLIC_APP_URL}/auth/reset?token=${encodeURIComponent(token)}`;
}

function verificationTemplate(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#333">
        Hi there,<br><br>
        Welcome to Dropwiz. Please verify your email to get started.<br><br>
        Click here to verify: <a href="${url}">${url}</a><br><br>
        This link expires in 24 hours.<br><br>
        If you did not sign up, ignore this email.<br><br>
        Best,<br>
        Dropwiz Team
      </body>
    </html>
  `;
}

function resetTemplate(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#333">
        Hi there,<br><br>
        We received a request to reset your Dropwiz password.<br><br>
        Click here to reset: <a href="${url}">${url}</a><br><br>
        This link expires in 1 hour. If you didn't request this, ignore this email.<br><br>
        Best,<br>
        Dropwiz Team
      </body>
    </html>
  `;
}

function signupAttemptTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#333">
        Hi there,<br><br>
        Someone tried to create a new Dropwiz account using your email. If this wasn't you, no action is needed — your account is safe.<br><br>
        If you forgot your password, you can reset it from the sign-in page.<br><br>
        Best,<br>
        Dropwiz Team
      </body>
    </html>
  `;
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your Dropwiz email",
    html: verificationTemplate(verifyUrl(token)),
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your Dropwiz password",
    html: resetTemplate(resetUrl(token)),
  });
}

export async function sendSignupAttemptNotice(to: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Someone tried to sign up with your email",
    html: signupAttemptTemplate(),
  });
}
