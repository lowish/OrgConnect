import { Sparkles } from "lucide-react";

/**
 * The "Is this you?" list. Given a distinct treatment on purpose so it does not
 * read as a third feature list: each statement is a card with a thick accent
 * left rule and a marker glyph, phrased as a self-check the reader answers.
 */
export function FitList({
  statements,
  accentColor,
}: {
  statements: string[];
  accentColor: string;
}) {
  return (
    <ul className="space-y-2.5" aria-label="Signs this org is a fit for you">
      {statements.map((statement) => (
        <li
          key={statement}
          className="flex items-start gap-3 rounded-r-xl border-l-[3px] bg-stone-50 py-3 pr-4 pl-4
            text-sm leading-snug text-stone-700 dark:bg-white/[0.04] dark:text-stone-200"
          style={{ borderColor: accentColor }}
        >
          <Sparkles
            className="mt-0.5 size-4 shrink-0"
            style={{ color: accentColor }}
            aria-hidden
          />
          {statement}
        </li>
      ))}
    </ul>
  );
}
