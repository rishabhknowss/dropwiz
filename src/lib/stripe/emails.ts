import { env } from "@/env";
import { sendEmail } from "@/lib/email/transport";

const dashboardUrl = (): string => `${env.NEXT_PUBLIC_APP_URL}/app/stores`;

const welcomeTemplate = (): string => `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#333">
      Hi there,<br><br>
      Welcome to Dropwiz PRO! 🚀<br><br>
      Your subscription is now active and you have access to all PRO features:<br><br>
      • Unlimited AI copywriter<br>
      • Bundle app<br>
      • AI image generation<br>
      • One-click import<br>
      • Free .store domain<br><br>
      Ready to publish your first store?<br><br>
      <a href="${dashboardUrl()}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px">Go to Dashboard</a><br><br>
      If you have any questions, just reply to this email.<br><br>
      Best,<br>
      Dropwiz Team
    </body>
  </html>
`;

export const sendProWelcomeEmail = async (to: string): Promise<void> => {
  await sendEmail({
    to,
    subject: "Welcome to Dropwiz PRO! 🚀",
    html: welcomeTemplate(),
  });
};
