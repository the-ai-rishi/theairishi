/** Public measurement ID only. Never invent a GA property. */
export function getGaMeasurementId(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    "";
  const id = raw.trim();
  if (!/^G-[A-Z0-9]+$/i.test(id)) return null;
  return id;
}

export function getGoogleSiteVerification(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "";
  const token = raw.trim();
  return token || null;
}
