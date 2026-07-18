import type { ComponentType, ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Compass,
  ExternalLink,
  Facebook,
  Globe,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import type { Organization } from "../../types";
import { OrgLogo } from "../ui/OrgLogo";
import { EventCard } from "../ui/EventCard";
import { events } from "../../data/events";
import { getHostname } from "../../lib/orgLogo";

/**
 * The Organization Details page.
 *
 * On mount, the hero's <OrgLogo> automatically resolves and caches the org's
 * logo from its official public source, falling back to a placeholder. Every
 * other field shown here — about, goal, offers, gains, events, and contacts —
 * comes straight from our database (see data/organizations.ts).
 */
export function OrgDetail({
  org,
  onBack,
}: {
  org: Organization;
  onBack: () => void;
}) {
  const sourceHost = org.officialUrl ? getHostname(org.officialUrl) : null;
  const orgEvents = events.filter((e) => e.orgShortName === org.shortName);

  return (
    <section className="relative isolate pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 font-mono text-xs font-medium
            text-stone-500 focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
            dark:text-stone-400">
          <ArrowLeft className="size-4" />
          BACK TO ORG
        </button>

        {/* HERO — auto-fetched logo lives here. */}
        <div className="mt-8 flex flex-col items-start gap-6 border-b border-stone-200
            pb-10 sm:flex-row sm:items-center dark:border-stone-800">
          <OrgLogo org={org} className="size-24 text-2xl sm:size-28" />

          <div className="min-w-0">
            <span
              className="rounded-full bg-stone-100 px-3 py-1 font-mono text-[11px] font-medium
                text-stone-600 dark:bg-stone-800 dark:text-stone-400"
            >
              {org.category}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
              {org.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {org.verified && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <ShieldCheck className="size-3.5" />
                  Verified
                </span>
              )}

              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-cardinal-600
                    transition-colors hover:text-cardinal-700 focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
                    dark:text-cardinal-400 dark:hover:text-cardinal-300"
                >
                  {getHostname(org.website)}
                  <ExternalLink className="size-3" />
                </a>
              )}

              {org.officialUrl && sourceHost && (
                <a
                  href={org.officialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-500
                    transition-colors hover:text-cardinal-600 focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
                    dark:text-stone-400 dark:hover:text-cardinal-400"
                >
                  {sourceHost}
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ABOUT + goal + mission */}
        <Section title="About">
          <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            {org.description}
          </p>
          {(org.goal || org.mission) && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {org.goal && <PurposeBlock icon={Target} label="Goal" text={org.goal} />}
              {org.mission && <PurposeBlock icon={Compass} label="Mission" text={org.mission} />}
            </div>
          )}
        </Section>

        {/* WHAT THE ORG OFFERS */}
        {org.offers && org.offers.length > 0 && (
          <Section title="What the org offers">
            <ul
              className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2"
              aria-label={`What ${org.shortName} offers`}
            >
              {org.offers.map((offer) => (
                <li
                  key={offer}
                  className="flex items-start gap-2 text-sm leading-snug text-stone-700 dark:text-stone-300"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-cardinal-600 dark:text-cardinal-400" />
                  {offer}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* WHAT YOU'LL LEARN */}
        {org.skills.length > 0 && (
          <Section title="What you'll learn">
            <ul className="flex flex-wrap gap-2" aria-label={`Skills at ${org.shortName}`}>
              {org.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-stone-200 px-3 py-1.5 font-mono text-xs
                    text-stone-600 dark:border-stone-700 dark:text-stone-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* WHAT YOU'LL GAIN */}
        {org.gains && org.gains.length > 0 && (
          <Section title="What you'll gain">
            <ul className="grid gap-3 sm:grid-cols-2" aria-label={`What you gain at ${org.shortName}`}>
              {org.gains.map((gain) => (
                <li
                  key={gain}
                  className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-white/60 p-3.5
                    text-sm leading-snug text-stone-700 dark:border-stone-800 dark:bg-white/[0.03]
                    dark:text-stone-300"
                >
                  <TrendingUp className="mt-0.5 size-4 shrink-0 text-cardinal-600 dark:text-cardinal-400" />
                  {gain}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* IS THIS YOU? — the org's own "best suited for" list. */}
        {org.bestFor && org.bestFor.length > 0 && (
          <Section title="Is this you?">
            <ul className="space-y-2" aria-label={`Best suited for students who…`}>
              {org.bestFor.map((trait) => (
                <li
                  key={trait}
                  className="flex items-start gap-2 text-sm leading-snug text-stone-600 dark:text-stone-400"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cardinal-500 dark:bg-cardinal-400"
                  />
                  {trait}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* EVENTS */}
        <Section title="Events">
          {orgEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {orgEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div
              className="flex items-center gap-3 rounded-2xl border border-dashed border-stone-300
                px-5 py-6 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400"
            >
              <CalendarDays className="size-5 shrink-0" />
              No events posted yet. Check {org.shortName}'s page for the latest.
            </div>
          )}
        </Section>

        {/* CONTACT US */}
        <Section title="Contact us">
          <div className="flex flex-wrap gap-3">
            {org.website && (
              <ContactLink icon={Globe} href={org.website} label="Visit website" />
            )}
            {org.officialUrl && (
              <ContactLink icon={Facebook} href={org.officialUrl} label="Facebook page" />
            )}
          </div>
        </Section>
      </div>
    </section>
  );
}

/** A titled, fade-up content block matching the page's `// heading` rhythm. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="font-mono text-xs font-medium tracking-[0.2em] text-stone-900 uppercase dark:text-white">
        {`// ${title}`}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** A labeled goal/mission card. */
function PurposeBlock({
  icon: Icon,
  label,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/60 p-5 dark:border-stone-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{text}</p>
    </div>
  );
}

/** An outbound contact button (website / social). */
function ContactLink({
  icon: Icon,
  href,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5
        text-sm font-medium text-stone-700 shadow-sm transition-all hover:-translate-y-0.5
        hover:border-stone-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-cardinal-600 dark:border-stone-800 dark:bg-stone-900
        dark:text-stone-200 dark:hover:border-stone-700"
    >
      <Icon className="size-4 text-cardinal-600 dark:text-cardinal-400" />
      {label}
      <ExternalLink className="size-3.5 text-stone-400" />
    </a>
  );
}
