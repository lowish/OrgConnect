import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { Organization } from "../../schemas/organization";
import { SocialIcon } from "./SocialIcon";

/** Up to three initials from an org name, for the logo fallback tile. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w))
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Logo({ org }: { org: Organization }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [org.logoUrl]);

  if (broken) {
    return (
      <div
        aria-hidden
        className="flex size-20 shrink-0 items-center justify-center rounded-2xl border
          border-stone-200 bg-stone-100 font-mono text-xl font-semibold text-stone-500
          sm:size-24 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
      >
        {initialsOf(org.name)}
      </div>
    );
  }

  return (
    <div
      className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl
        border border-stone-200 bg-white shadow-sm sm:size-24 dark:border-stone-700 dark:bg-stone-800"
    >
      <img
        src={org.logoUrl}
        alt={`${org.name} logo`}
        loading="lazy"
        onError={() => setBroken(true)}
        className="size-full object-cover"
      />
    </div>
  );
}

export function OrgHeader({ org }: { org: Organization }) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <Logo org={org} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1
              font-mono text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full"
              style={{ backgroundColor: org.accentColor }}
            />
            {org.category}
          </span>

          {org.verified && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-stone-500 dark:text-stone-400">
              <ShieldCheck className="size-3.5" aria-hidden />
              Verified
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
          {org.name}
        </h1>

        {org.tagline && (
          <p className="mt-2 max-w-xl text-base leading-relaxed text-stone-600 dark:text-stone-300">
            {org.tagline}
          </p>
        )}

        {org.socials.length > 0 && (
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Social links">
            {org.socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-lg border
                    border-stone-200 text-stone-600 transition-colors hover:border-stone-300
                    hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2
                    dark:border-stone-700 dark:text-stone-300 dark:hover:text-white"
                  style={{ outlineColor: org.accentColor }}
                >
                  <SocialIcon name={social.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
