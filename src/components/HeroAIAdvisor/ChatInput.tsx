import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  /** Disables submit (not typing) while the advisor is composing a reply. */
  sending: boolean;
}

/** Auto-growing textarea. Enter sends, Shift+Enter adds a newline. */
export function ChatInput({ onSend, sending }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = value.trim();
    if (!text || sending) return;
    onSend(text);
    setValue("");
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-stone-200/60 p-3 dark:border-white/10">
      <div
        className="flex items-end gap-2 rounded-2xl border border-stone-300/70 bg-white/70
          py-2 pr-2 pl-4 backdrop-blur transition-colors
          focus-within:border-cardinal-500
          dark:border-stone-600/70 dark:bg-white/[0.06]"
      >
        <textarea
          ref={textareaRef}
          id="advisor-input"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your interests…"
          className="max-h-28 min-w-0 flex-1 resize-none bg-transparent py-1 text-sm
            text-stone-900 outline-none placeholder:text-stone-400
            dark:text-white dark:placeholder:text-stone-500"
        />
        <motion.button
          type="button"
          onClick={submit}
          disabled={!value.trim() || sending}
          whileTap={{ scale: 0.92 }}
          aria-label="Send message"
          className="flex size-6 shrink-0 items-center justify-center rounded-full
            bg-cardinal-600 text-white shadow-sm shadow-cardinal-900/25 transition-all
            hover:bg-cardinal-700 focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-cardinal-600
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal className="size-4" />
        </motion.button>
      </div>
      <p className="mt-2 px-1 font-mono text-[10px] text-stone-500 dark:text-stone-200">
        Ask me anything about SOC orgs
      </p>
    </div>
  );
}
