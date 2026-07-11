import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

/** Kebab-case an anchor id from a section label. */
function toId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * A titled content block with the app's `// LABEL` monospace header. The marker
 * takes the org's accent so each page has its own identity on a shared layout.
 *
 * Renders as a labelled <section> (heading tied to content via aria-labelledby)
 * and fades up on mount when nested in a stagger container.
 */
export function Section({
  label,
  accentColor,
  children,
  id,
}: {
  label: string;
  accentColor: string;
  children: ReactNode;
  /** Optional explicit anchor id (defaults to a slug of the label). */
  id?: string;
}) {
  const anchor = id ?? toId(label);
  const headingId = `${anchor}-heading`;

  return (
    <motion.section
      id={anchor}
      variants={fadeUp}
      aria-labelledby={headingId}
      className="scroll-mt-24"
    >
      <h2
        id={headingId}
        className="font-mono text-xs font-medium tracking-[0.2em] uppercase"
      >
        <span aria-hidden style={{ color: accentColor }}>
          {"// "}
        </span>
        <span className="text-stone-500 dark:text-stone-400">{label}</span>
      </h2>
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}
