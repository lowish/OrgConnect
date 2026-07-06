import { motion } from "framer-motion";

/** Three pulsing dots in an AI bubble while a reply is "being written". */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md
        bg-white/80 px-4 py-3 dark:bg-white/[0.07]"
      role="status"
      aria-label="AI Advisor is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-stone-400 dark:bg-stone-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </motion.div>
  );
}
