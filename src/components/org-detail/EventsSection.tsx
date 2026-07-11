import { ArrowUpRight, CalendarPlus, MapPin } from "lucide-react";
import type { OrgEventItem, PastEventItem } from "../../schemas/organization";

/** Format an ISO date like "2026-08-28" into "Aug 28, 2026". */
function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UpcomingCard({ event }: { event: OrgEventItem }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <p className="font-mono text-xs font-medium text-stone-500 dark:text-stone-400">
        <time dateTime={event.date}>{formatDate(event.date)}</time>
      </p>
      <h3 className="mt-1.5 text-base font-semibold tracking-tight text-stone-900 dark:text-white">
        {event.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {event.description}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        {event.venue}
      </p>
    </article>
  );
}

/**
 * Upcoming events as cards, with a compact past-events log beneath. When there
 * are no upcoming events, the empty state is an invitation: it links out to the
 * org's page so a reader can follow along, never a dead line of text.
 */
export function EventsSection({
  upcoming = [],
  past = [],
  followUrl,
  followLabel = "Follow for updates",
  accentColor,
}: {
  upcoming?: OrgEventItem[];
  past?: PastEventItem[];
  followUrl?: string;
  followLabel?: string;
  accentColor: string;
}) {
  return (
    <div className="space-y-6">
      {upcoming.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {upcoming.map((event) => (
            <UpcomingCard key={`${event.title}-${event.date}`} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 p-6 dark:border-stone-700">
          <div className="flex items-start gap-3">
            <CalendarPlus className="mt-0.5 size-5 shrink-0 text-stone-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                No upcoming events yet.
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                New sessions are announced on the org's page.
              </p>
              {followUrl && (
                <a
                  href={followUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold
                    focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ color: accentColor, outlineColor: accentColor }}
                >
                  {followLabel}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="font-mono text-[11px] font-medium tracking-[0.15em] text-stone-400 uppercase dark:text-stone-500">
            Past
          </h3>
          <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
            {past.map((event) => (
              <li
                key={`${event.title}-${event.date}`}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <span className="min-w-0 truncate text-sm text-stone-600 dark:text-stone-300">
                  {event.title}
                </span>
                <time
                  dateTime={event.date}
                  className="shrink-0 font-mono text-xs text-stone-400 dark:text-stone-500"
                >
                  {formatDate(event.date)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
