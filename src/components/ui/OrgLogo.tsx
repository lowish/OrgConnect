import { useEffect, useState } from "react";
import type { Organization } from "../../types";
import { useOrgLogo } from "../../lib/useOrgLogo";

/**
 * Default placeholder logo: org initials on a brand-tinted tile. Shown while a
 * logo resolves, and whenever one can't be fetched.
 */
export function LogoPlaceholder({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-xl
        bg-gradient-to-br from-cardinal-600 to-cardinal-800
        font-mono font-semibold text-white shadow-sm shadow-cardinal-900/20
        ${className}`}
    >
      {initials}
    </div>
  );
}

/**
 * An org's logo, resolved automatically from its official public source and
 * cached. Falls back to <LogoPlaceholder> on load or on any failure.
 *
 * `className` controls the size/shape of the tile (e.g. "size-12 text-sm").
 */
export function OrgLogo({
  org,
  className = "size-12 text-sm",
}: {
  org: Organization;
  className?: string;
}) {
  const { status, url } = useOrgLogo(org);
  // Guards against a cached URL that later 404s: fall back on <img> error.
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [url]);

  if (status !== "resolved" || !url || broken) {
    return (
      <LogoPlaceholder initials={org.initials} className={className} />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl
        border border-stone-200 bg-white shadow-sm shadow-stone-900/5
        dark:border-stone-700 dark:bg-stone-800 ${className}`}
    >
      <img
        src={url}
        alt={`${org.name} logo`}
        loading="lazy"
        onError={() => setBroken(true)}
        className="size-full object-cover"
      />
    </div>
  );
}
