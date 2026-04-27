export function normalizeEmail(email: string): string {
  const lower = email.trim().toLowerCase();
  const atIdx = lower.lastIndexOf("@");
  if (atIdx === -1) return lower;

  const local = lower.slice(0, atIdx);
  const domain = lower.slice(atIdx + 1);

  const beforePlus = local.split("+")[0];

  if (domain === "gmail.com" || domain === "googlemail.com") {
    const noDots = beforePlus.replace(/\./g, "");
    return `${noDots}@gmail.com`;
  }

  return `${beforePlus}@${domain}`;
}
