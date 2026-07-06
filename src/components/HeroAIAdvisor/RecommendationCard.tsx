import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Recommendation } from "./advisor";
import { CompatibilityBadge } from "./CompatibilityBadge";

/**
 * A rich recommendation rendered inside the conversation: who, how well they
 * fit, why, and what they'd learn. Opaque surface so it reads perfectly over
 * the glass panel.
 */
export function RecommendationCard({
  recommendation,
  index,
}: {
  recommendation: Recommendation;
  index: number;
}) {
  const { org, score, reasons } = recommendation;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.15 }}
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-md shadow-stone-900/5
        dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/30"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-xl
            bg-gradient-to-br from-cardinal-600 to-cardinal-800
            font-mono text-xs font-semibold text-white"
        >
          {org.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-stone-900 dark:text-white">
            {org.shortName}
          </h4>
          <p className="font-mono text-[10px] text-stone-500 dark:text-stone-400">
            {org.category}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <CompatibilityBadge score={score} />
      </div>

      {reasons.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label={`Why ${org.shortName} fits you`}>
          {reasons.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-1.5 text-xs leading-snug text-stone-600 dark:text-stone-400"
            >
              <Check className="mt-0.5 size-3 shrink-0 text-cardinal-600 dark:text-cardinal-400" />
              {reason}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-1" aria-label={`Skills at ${org.shortName}`}>
        {org.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded border border-stone-200 px-1.5 py-0.5 font-mono text-[9px]
              text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            {skill}
          </span>
        ))}
      </div>

      <a
        href="#organizations"
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cardinal-600
          transition-colors hover:text-cardinal-700
          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
          dark:text-cardinal-400 dark:hover:text-cardinal-300"
      >
        View Organization
        <ArrowRight className="size-3" />
      </a>
    </motion.article>
  );
}
