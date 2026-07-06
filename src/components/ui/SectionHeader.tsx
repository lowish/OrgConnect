import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "../../lib/motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Set for headers sitting on dark surfaces (the AI section). */
  onDark?: boolean;
  align?: "left" | "center";
}

/**
 * Every section opens with the same voice: a mono eyebrow (the "code comment"
 * of the page), a large title, and an optional one-line description.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  onDark = false,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <motion.p
        variants={fadeUp}
        className={`font-mono text-xs font-medium tracking-[0.2em] uppercase ${
          onDark ? "text-cardinal-300" : "text-cardinal-600 dark:text-cardinal-400"
        }`}
      >
        {"// "}
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className={`mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl ${
          onDark ? "text-white" : "text-stone-900 dark:text-white"
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 text-lg leading-relaxed ${
            onDark ? "text-stone-300" : "text-stone-600 dark:text-stone-400"
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
