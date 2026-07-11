import { CalendarClock } from "lucide-react";
import type { Organization } from "../../schemas/organization";

/**
 * Numbered join steps with an optional recruitment-period chip. The numerals
 * take the org accent so the sequence reads as the page's call to action.
 */
export function HowToJoin({
  howToJoin,
  accentColor,
}: {
  howToJoin: NonNullable<Organization["howToJoin"]>;
  accentColor: string;
}) {
  return (
    <div>
      {howToJoin.recruitmentPeriod && (
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{ backgroundColor: `${accentColor}1f`, color: accentColor }}
        >
          <CalendarClock className="size-3.5" aria-hidden />
          Recruitment: {howToJoin.recruitmentPeriod}
        </p>
      )}

      <ol className="space-y-3" aria-label="How to join, step by step">
        {howToJoin.steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3.5">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-lg font-mono
                text-xs font-semibold"
              style={{ backgroundColor: `${accentColor}1f`, color: accentColor }}
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm leading-snug text-stone-700 dark:text-stone-200">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
