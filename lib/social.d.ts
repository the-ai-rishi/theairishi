export function isHttpsUrl(value: unknown): boolean;
export function isInternalHref(value: unknown): boolean;
export function isPlaceholderUrl(value: unknown): boolean;
export function channelKind(channel: unknown): "external" | "internal";
export function destinationUrl(channel: unknown): string;
export function isEnabledChannel(channel: unknown): boolean;
export function isPublicDestination(channel: unknown): boolean;
export function showDestinationOn(
  channel: unknown,
  surface: "footer" | "homepage" | "header" | "about"
): boolean;
export function publicDestinations(platform: unknown, surface?: string): Array<Record<string, unknown>>;
export function includeInSameAs(channel: unknown): boolean;
export function sameAsUrls(platform: unknown, extra?: string[]): string[];
export function isInternalChannel(channel: unknown): boolean;
export function collectSocialErrors(social: unknown): string[];
export const INSTAGRAM_PROFILE_RE: RegExp;
