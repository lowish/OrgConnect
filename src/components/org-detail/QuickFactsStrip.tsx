import type { ComponentType } from "react";
import { BarChart3, CalendarDays, Repeat, Users } from "lucide-react";
import type { QuickFacts } from "../../schemas/organization";

type Fact = { icon: ComponentType<{ className?: string }>; label: string; value: string };

/**
 * A horizontal strip of at-a-glance facts, shown directly under the header and
 * before any prose. Any undefined fact is dropped, so the strip never shows a
 * blank pill. Renders nothing if no facts are present.
 */
export function QuickFactsStrip({ facts }: { facts: QuickFacts }) {
  const items: Fact[] = [];

  if (facts.members !== undefined) {
    items.push({ icon: Users, label: "Members", value: facts.members.toLocaleString() });
  }
  if (facts.eventsPerSemester !== undefined) {
    items.push({
      icon: CalendarDays,
      label: "Events / sem",
      value: String(facts.eventsPerSemester),
    });
  }
  items.push({ icon: Repeat, label: "Cadence", value: facts.cadence });
  items.push({ icon: BarChart3, label: "Skill level", value: facts.skillLevel });

  return (
    <dl className="flex flex-wrap gap-2.5" aria-label="Quick facts">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200
            bg-white px-3.5 py-2 dark:border-stone-800 dark:bg-stone-900"
        >
          <Icon className="size-4 shrink-0 text-stone-400 dark:text-stone-500" aria-hidden />
          <dt className="sr-only">{label}</dt>
          <dd className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-stone-900 dark:text-white">{value}</span>
            <span className="font-mono text-[10px] tracking-wide text-stone-400 uppercase dark:text-stone-500">
              {label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
