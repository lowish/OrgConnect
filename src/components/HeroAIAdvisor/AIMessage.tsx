import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "./advisor";
import { RecommendationCard } from "./RecommendationCard";
import { SuggestionChip } from "./SuggestionChip";

interface AIMessageProps {
  message: ChatMessage;
  /** Chips are interactive only while this is the newest message. */
  showChips: boolean;
  onChipSelect: (label: string) => void;
  chipsDisabled: boolean;
}

export function AIMessage({ message, showChips, onChipSelect, chipsDisabled }: AIMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex max-w-[92%] gap-2.5 self-start"
    >
      <span
        aria-hidden
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg
          bg-gradient-to-br from-cardinal-600 to-gold-500 text-white"
      >
        <Sparkles className="size-3.5" />
      </span>

      <div className="min-w-0 space-y-3">
        {message.text && (
          <div
            className="rounded-2xl rounded-tl-md bg-white/80 px-4 py-3 text-sm leading-relaxed
              whitespace-pre-line text-stone-800 dark:bg-white/[0.07] dark:text-stone-200"
          >
            {message.text}
          </div>
        )}

        {message.recommendations && (
          <div className="space-y-3">
            {message.recommendations.map((rec, i) => (
              <RecommendationCard key={rec.org.id} recommendation={rec} index={i} />
            ))}
          </div>
        )}

        {showChips && message.chips && (
          <div className="flex flex-wrap gap-1.5" aria-label="Suggested replies">
            {message.chips.map((chip) => (
              <SuggestionChip
                key={chip}
                label={chip}
                onSelect={onChipSelect}
                disabled={chipsDisabled}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
