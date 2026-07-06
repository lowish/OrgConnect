import { Star } from "lucide-react";

/** "★★★★★ 96% match" — the advisor's verdict, compact. */
export function CompatibilityBadge({ score }: { score: number }) {
  const stars = Math.min(5, Math.max(3, Math.round((score - 50) / 10)));
  return (
    <div className="flex items-center gap-2">
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`size-3 ${
              i < stars
                ? "fill-gold-400 text-gold-400"
                : "text-stone-300 dark:text-stone-600"
            }`}
          />
        ))}
      </span>
      <span
        className="rounded-full bg-cardinal-600/10 px-2 py-0.5 font-mono text-[11px]
          font-semibold text-cardinal-700 dark:bg-cardinal-500/15 dark:text-cardinal-300"
      >
        {score}% match
      </span>
    </div>
  );
}
