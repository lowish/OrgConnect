import { motion } from "framer-motion";

interface SuggestionChipProps {
  label: string;
  onSelect: (label: string) => void;
  disabled?: boolean;
}

/** Quick-reply chip. Sends its label as if the student typed it. */
export function SuggestionChip({ label, onSelect, disabled }: SuggestionChipProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(label)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-full border border-stone-300/70 bg-white/70 px-3 py-1.5
        text-left text-xs font-medium text-stone-700 backdrop-blur transition-colors
        hover:border-cardinal-400 hover:text-cardinal-700
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
        disabled:opacity-50
        dark:border-stone-600/70 dark:bg-white/[0.06] dark:text-stone-300
        dark:hover:border-cardinal-500 dark:hover:text-cardinal-300"
    >
      {label}
    </motion.button>
  );
}
