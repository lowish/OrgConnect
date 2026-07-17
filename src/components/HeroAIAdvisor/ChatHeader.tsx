import { RotateCcw, X } from "lucide-react";

interface ChatHeaderProps {
  onReset: () => void;
  /** When provided (floating widget), renders a close button. */
  onClose?: () => void;
}

/** Identity strip: who you're talking to, that it's live, and a restart. */
export function ChatHeader({ onReset, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-stone-200/60 px-4 py-3 dark:border-white/10">
      <div className="flex items-center gap-2.5">
        <div className="leading-tight">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-stone-900 dark:text-white">
            <span aria-hidden className="size-1.5 rounded-full bg-stone-900 dark:bg-emerald-500" />
            OrgConnect AI Advisor
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          aria-label="Restart conversation"
          title="Restart conversation"
          className="flex size-8 items-center justify-center rounded-full text-stone-500
            transition-colors hover:bg-stone-200/60 hover:text-stone-900
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
            dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <RotateCcw className="size-4" />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            title="Close chat"
            className="flex size-8 items-center justify-center rounded-full text-stone-500
              transition-colors hover:bg-stone-200/60 hover:text-stone-900
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
              dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
