import { TrendingUp } from "lucide-react";

/**
 * "What you'll gain" as a grid of cards. Each gain is an outcome, so it gets
 * more presence than a bullet: a bordered card with an accent icon. This is one
 * of the heavier blocks in the Fit zone.
 */
function GainCard({ gain, accentColor }: { gain: string; accentColor: string }) {
  return (
    <li
      className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/60 p-4
        text-sm leading-snug text-stone-700 dark:border-stone-800 dark:bg-white/[0.03]
        dark:text-stone-200"
    >
      <span
        aria-hidden
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accentColor}1f`, color: accentColor }}
      >
        <TrendingUp className="size-4" />
      </span>
      {gain}
    </li>
  );
}

export function GainsGrid({
  gains,
  accentColor,
}: {
  gains: string[];
  accentColor: string;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" aria-label="What you'll gain">
      {gains.map((gain) => (
        <GainCard key={gain} gain={gain} accentColor={accentColor} />
      ))}
    </ul>
  );
}
