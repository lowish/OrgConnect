import { Check } from "lucide-react";

/**
 * A plain, scannable checklist of what the org offers. Deliberately quiet: it
 * is a feature list, and the visual weight belongs to gains and fit below it.
 */
export function OffersList({
  offers,
  accentColor,
}: {
  offers: string[];
  accentColor: string;
}) {
  return (
    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2" aria-label="What the org offers">
      {offers.map((offer) => (
        <li
          key={offer}
          className="flex items-start gap-2 text-sm leading-snug text-stone-700 dark:text-stone-300"
        >
          <Check
            className="mt-0.5 size-4 shrink-0"
            style={{ color: accentColor }}
            aria-hidden
          />
          {offer}
        </li>
      ))}
    </ul>
  );
}
