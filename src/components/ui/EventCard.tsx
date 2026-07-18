import type { OrgEvent } from "../../types";
import { organizations } from "../../data/organizations";
import { OrgLogo } from "./OrgLogo";

function getEventOrg(shortName: string) {
  return organizations.find((org) => org.shortName === shortName) ?? null;
}

export function EventCard({ event }: { event: OrgEvent }) {
  const org = getEventOrg(event.orgShortName);

  return (
    <article
      className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5
        dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:shadow-black/40"
    >
      <div className="min-w-0">
        <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-white">
          {event.title}
        </h3>

        <p className="mt-0.5 font-mono text-xs text-cardinal-600 dark:text-cardinal-400">
          {event.orgShortName}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {event.description}
        </p>
      </div>

      {org ? (
        <OrgLogo org={org} className="size-14 text-xs" />
      ) : (
        <div
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs font-semibold text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          {event.orgShortName.slice(0, 2).toUpperCase()}
        </div>
      )}
    </article>
  );
}
