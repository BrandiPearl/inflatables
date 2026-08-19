export const BUSINESS_EMAIL = "wonderlandinflatables10@gmail.com";
export const BUSINESS_PHONE_DISPLAY = "0468 292 610";

export function mailHref(email: string) {
  return `mailto:${email}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return `tel:+61468292610`;
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0") && digits.length === 10) {
    return `tel:+61${digits.slice(1)}`;
  }
  if (digits.startsWith("61") && digits.length >= 11) {
    return `tel:+${digits}`;
  }
  return `tel:+${digits}`;
}
