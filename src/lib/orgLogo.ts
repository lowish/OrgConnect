import type { Organization } from "../types";

/**
 * Automatic org-logo resolution.
 *
 * Given an org's official public source (its website or social profile URL),
 * we derive a logo image URL from that source's domain via public favicon/logo
 * services — no backend and no API keys required, so it runs in a static build.
 *
 * The logo is the ONLY thing fetched. Every other field (name, description,
 * skills, …) comes from our database in data/organizations.ts.
 *
 * NOTE ON ACCURACY: true logo extraction (parsing a site's og:image /
 * apple-touch-icon, or reading a social profile picture) requires a server-side
 * fetch — the browser can't scrape arbitrary origins (CORS). If a backend proxy
 * is added later, implement it as another entry in LOGO_PROVIDERS and the rest
 * of this module (cache, verification, hook) keeps working unchanged.
 */

const CACHE_PREFIX = "oc-logo:";
/** Bump to invalidate every cached logo (e.g. when providers change). */
const CACHE_VERSION = 2;
/** Re-attempt a previously failed lookup after this long. */
const FAILURE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
/** How long to wait for a candidate image before treating it as failed. */
const LOAD_TIMEOUT_MS = 6000;

/** A cache entry. `url: null` records a confirmed failure so we don't refetch. */
interface CacheEntry {
  v: number;
  url: string | null;
  ts: number;
}

/** Extract a bare hostname from an official-source URL, or null if unusable. */
export function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Extract a Facebook page handle (e.g. "gdsc.hau") from a facebook.com URL, or
 * null if the URL isn't a usable Facebook page.
 */
export function getFacebookHandle(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    const isFacebook =
      /(^|\.)facebook\.com$/.test(hostname) || /(^|\.)fb\.com$/.test(hostname);
    if (!isFacebook) return null;
    const handle = pathname.split("/").filter(Boolean)[0];
    // Numeric-id and people URLs don't work with the /{handle}/picture edge.
    if (!handle || handle === "profile.php" || handle === "people") return null;
    return handle;
  } catch {
    return null;
  }
}

/**
 * Ordered logo providers. The first candidate whose image actually loads wins,
 * so cheaper/higher-quality sources go first. Add a backend proxy here later.
 */
const LOGO_PROVIDERS: Array<(host: string) => string> = [
  (host) => `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
  (host) => `https://icons.duckduckgo.com/ip3/${host}.ico`,
];

/** Candidate logo image URLs for an org, best-first. Empty if no source. */
export function resolveLogoCandidates(org: Organization): string[] {
  if (!org.officialUrl) return [];

  // Facebook pages: the Graph picture endpoint redirects to the page's actual
  // profile photo with no access token required. We store THIS url (not the
  // fbcdn.net image it redirects to) because the graph url is stable, while the
  // signed cdn url expires — so the cache stays valid and always loads a fresh
  // image. A wrong/removed page yields an error response → <img> onerror →
  // placeholder, so verification still holds.
  const fbHandle = getFacebookHandle(org.officialUrl);
  if (fbHandle) {
    return [`https://graph.facebook.com/${fbHandle}/picture?type=large`];
  }

  const host = getHostname(org.officialUrl);
  if (!host) return [];
  return LOGO_PROVIDERS.map((provider) => provider(host));
}

const cacheKey = (orgId: string) => `${CACHE_PREFIX}${orgId}`;

/**
 * Read a cached logo result.
 * Returns `undefined` when there's no usable cache entry (never looked up, or a
 * stale failure worth retrying), a `string` for a known logo, or `null` for a
 * still-fresh confirmed failure (→ show the placeholder without refetching).
 */
export function readCachedLogo(orgId: string): string | null | undefined {
  try {
    const raw = localStorage.getItem(cacheKey(orgId));
    if (!raw) return undefined;
    const entry = JSON.parse(raw) as CacheEntry;
    if (entry.v !== CACHE_VERSION) return undefined;
    if (entry.url === null && Date.now() - entry.ts > FAILURE_TTL_MS) {
      return undefined; // stale failure — allow a fresh attempt
    }
    return entry.url;
  } catch {
    return undefined;
  }
}

/** Persist a resolved logo URL (or `null` for a confirmed failure). */
export function writeCachedLogo(orgId: string, url: string | null): void {
  try {
    const entry: CacheEntry = { v: CACHE_VERSION, url, ts: Date.now() };
    localStorage.setItem(cacheKey(orgId), JSON.stringify(entry));
  } catch {
    // Storage full or unavailable (private mode) — degrade to re-fetching.
  }
}

/**
 * Resolve to `true` if the image at `src` loads within the timeout, else
 * `false`. Verifying the pixels — not just the request — is what lets us fall
 * back to the placeholder when a provider has no logo for the domain.
 * Aborts cleanly when `signal` fires (component unmounted / org changed).
 */
export function verifyImage(src: string, signal?: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve(false);

    const img = new Image();
    let settled = false;

    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      img.onload = img.onerror = null;
      img.src = "";
      resolve(ok);
    };

    const onAbort = () => done(false);
    const timer = setTimeout(() => done(false), LOAD_TIMEOUT_MS);

    signal?.addEventListener("abort", onAbort, { once: true });
    img.onload = () => done(img.naturalWidth > 0);
    img.onerror = () => done(false);
    img.src = src;
  });
}

/**
 * Full resolution flow used by the hook: try each candidate in order, return the
 * first that loads, else `null`. Callers cache the result.
 */
export async function fetchOrgLogo(
  org: Organization,
  signal?: AbortSignal,
): Promise<string | null> {
  for (const candidate of resolveLogoCandidates(org)) {
    if (signal?.aborted) return null;
    if (await verifyImage(candidate, signal)) return candidate;
  }
  return null;
}
