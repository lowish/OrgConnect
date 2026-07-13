import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Organization } from "../../types";
import { fadeUp } from "../../lib/motion";
import { OrgLogo } from "./OrgLogo";

const MAX_VISIBLE_SKILLS = 4;

export function OrgCard({
  org,
  onSelect,
}: {
  org: Organization;
  onSelect: (org: Organization) => void;
}) {
  const visibleSkills = org.skills.slice(0, MAX_VISIBLE_SKILLS);
  const hiddenCount = org.skills.length - visibleSkills.length;

  return (
    <motion.article
      variants={fadeUp}
      className="group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:border-cardinal-200 hover:shadow-xl hover:shadow-stone-900/5
        dark:border-stone-800 dark:bg-stone-900
        dark:hover:border-cardinal-900 dark:hover:shadow-black/40"
    >
      <div className="flex items-start justify-between gap-4">
        <OrgLogo org={org} className="size-12 text-sm" />
        <span
          className="rounded-full bg-stone-100 px-3 py-1 font-mono text-[11px] font-medium
            text-stone-600 dark:bg-stone-800 dark:text-stone-400"
        >
          {org.category}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        {org.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {org.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Skills at ${org.shortName}`}>
        {visibleSkills.map((skill) => (
          <li
            key={skill}
            className="rounded-md border border-stone-200 px-2 py-1 font-mono text-[11px]
              text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            {skill}
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className="px-2 py-1 font-mono text-[11px] text-stone-400 dark:text-stone-500">
            +{hiddenCount} more
          </li>
        )}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
        <button
          type="button"
          onClick={() => onSelect(org)}
          className="inline-flex items-center gap-1 text-sm font-medium text-cardinal-600
            transition-colors hover:text-cardinal-700 focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
            dark:text-cardinal-400 dark:hover:text-cardinal-300"
        >
          View Details
          <ArrowUpRight
            className="size-4 transition-transform duration-200
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </motion.article>
  );
}
