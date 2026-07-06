import type { Variants } from "framer-motion";

/**
 * Shared motion vocabulary. Every scroll reveal on the page uses these two
 * variants so the whole site moves as one system. Reduced-motion users get
 * static content via <MotionConfig reducedMotion="user"> in App.tsx.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Standard viewport config: animate once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
