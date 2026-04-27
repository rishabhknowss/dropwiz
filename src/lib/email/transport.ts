import nodemailer from "nodemailer";
import { env } from "@/env";

let transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const port = parseInt(env.SMTP_PORT, 10);
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
  return transporter;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const info = await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      replyTo: env.EMAIL_REPLY_TO ?? env.EMAIL_FROM,
      to: input.to,
      bcc: input.bcc ?? env.BCC_EMAIL,
      subject: input.subject,
      html: input.html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL] send failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
