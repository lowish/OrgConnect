import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Organization } from "../../types";
import { OrgLogo } from "../ui/OrgLogo";
import { fadeUp, stagger } from "../../lib/motion";
import { getHostname } from "../../lib/orgLogo";
import { SideRails } from "../layout/SectionArt";

/**
 * The Organization Details page.
 *
 * On mount, the hero's <OrgLogo> automatically resolves and caches the org's
 * logo from its official public source, falling back to a placeholder. Every
 * other field shown here comes straight from our database.
 */
export function OrgDetail({
  org,
  onBack,
}: {
  org: Organization;
  onBack: () => void;
}) {
  const sourceHost = org.officialUrl ? getHostname(org.officialUrl) : null;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="relative isolate pt-28 pb-20 sm:pt-32 sm:pb-24"
    >
      <SideRails />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          variants={fadeUp}
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium
            text-stone-500 transition-colors hover:text-cardinal-600
            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
            dark:text-stone-400 dark:hover:text-cardinal-400"
        >
          <ArrowLeft className="size-4" />
          All organizations
        </motion.button>

        {/* HERO — auto-fetched logo lives here. */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-start gap-6 border-b border-stone-200
            pb-10 sm:flex-row sm:items-center dark:border-stone-800"
        >
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
              {org.verified ? (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <ShieldCheck className="size-3.5" />
                </span>
              ) : (
                <span
                  title="This organization's details are pending confirmation from official sources."
                  className="inline-flex items-center gap-1 rounded-full bg-gold-300/30 px-2.5 py-1
                    font-mono text-[10px] font-medium text-gold-500 dark:bg-gold-500/10 dark:text-gold-400"
                >
                  <ShieldAlert className="size-3" />
                </span>
              )}

              {org.officialUrl && sourceHost && (
                <a
                  href={org.officialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-cardinal-600
                    transition-colors hover:text-cardinal-700 focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
                    dark:text-cardinal-400 dark:hover:text-cardinal-300"
                >
                  {sourceHost}
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Body — all sourced from the database. */}
        <motion.div variants={fadeUp} className="mt-10">
          <h2 className="font-mono text-xs font-medium tracking-[0.2em] text-cardinal-600 uppercase dark:text-cardinal-400">
            {"// About"}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            {org.description}
          </p>
        </motion.div>

        {org.skills.length > 0 && (
          <motion.div variants={fadeUp} className="mt-10">
            <h2 className="font-mono text-xs font-medium tracking-[0.2em] text-cardinal-600 uppercase dark:text-cardinal-400">
              {"// What you'll learn"}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Skills at ${org.shortName}`}>
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
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
