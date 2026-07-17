import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { AIChat } from "./AIChat";

/**
 * Global floating chat launcher. Collapsed, it's a single "Discover" pill in
 * the bottom-right corner; clicking it reveals the AI Advisor panel above.
 *
 * The <AIChat> stays mounted the whole time so the conversation survives being
 * closed and reopened — we only animate the panel's visibility.
 *
 * Anything on the page can open it by dispatching `window`:
 *   window.dispatchEvent(new Event("orgconnect:open-chat"))
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const openChat = useCallback(() => setOpen(true), []);
  const closeChat = useCallback(() => setOpen(false), []);

  // Let other components (e.g. the hero's "Try AI Assistant" button) open us.
  useEffect(() => {
    window.addEventListener("orgconnect:open-chat", openChat);
    return () => window.removeEventListener("orgconnect:open-chat", openChat);
  }, [openChat]);

  // Escape closes; focus the input once the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => {
      document.getElementById("advisor-input")?.focus();
    }, 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open, closeChat]);

  return (
    // pointer-events-none on the container so its (tall, mostly-empty) fixed box
    // never intercepts page clicks behind it; interactive children opt back in.
    <div className="pointer-events-none fixed right-4 bottom-10 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Kept mounted so the conversation survives close/reopen — we animate
          visibility and only enable pointer events while the panel is open. */}
      <motion.div
        role="dialog"
        aria-label="OrgConnect AI Advisor"
        aria-hidden={!open}
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, scale: 1 }
            : reducedMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.96 }
        }
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`w-[calc(100vw-2rem)] max-w-[400px] origin-bottom-right ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <AIChat onClose={closeChat} />
      </motion.div>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.96 }}
        aria-expanded={open}
        aria-label={open ? "Close AI Advisor" : "Discover organizations with the AI Advisor"}
        className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white
          sm:h-auto sm:w-auto sm:justify-start sm:gap-2.5 sm:py-3 sm:pr-5 sm:pl-3.5
          font-medium text-stone-900 shadow-lg shadow-stone-900/10 ring-1 ring-stone-900/10
          transition-all hover:-translate-y-0.5 hover:shadow-xl
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
          dark:ring-white/15"
      >
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-full
            bg-gradient-to-br from-cardinal-600 to-cardinal-700 text-white"
        >
          {open ? (
            <X className="size-4" />
          ) : (
            <MessageCircle className="size-4" />
          )}
        </span>
        <span className="hidden items-center gap-1.5 text-sm tracking-wide sm:flex">
          {open ? "CLOSE" : "ASK QUESTIONS"}
        </span>
      </motion.button>
    </div>
  );
}
