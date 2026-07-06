import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { AIMessage } from "./AIMessage";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { UserMessage } from "./UserMessage";
import { useChat } from "./hooks/useChat";

/**
 * The AI Organization Advisor — a glassmorphism chat panel living in the
 * hero's right column. Fully client-side: the conversation runs on the
 * rule-based engine in advisor.ts over verified org data.
 */
export function AIChat({ onClose }: { onClose?: () => void }) {
  const { messages, isTyping, send, reset } = useChat();
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [messages, isTyping, reducedMotion]);

  const lastMessage = messages[messages.length - 1];

  return (
    <section
      id="ai-assistant"
      aria-label="OrgConnect AI Advisor"
      className="flex w-full flex-col overflow-hidden rounded-3xl border border-white/40
        bg-white/60 shadow-2xl shadow-stone-900/10 backdrop-blur-2xl
        dark:border-white/10 dark:bg-stone-950/55 dark:shadow-black/40"
    >
      <ChatHeader onReset={reset} onClose={onClose} />

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the AI Advisor"
        className="flex h-[380px] flex-col gap-3 overflow-y-auto scroll-smooth p-4
          [scrollbar-width:thin] sm:h-[420px]"
      >
        {messages.map((message) =>
          message.role === "ai" ? (
            <AIMessage
              key={message.id}
              message={message}
              showChips={message === lastMessage}
              onChipSelect={send}
              chipsDisabled={isTyping}
            />
          ) : (
            <UserMessage key={message.id} message={message} />
          ),
        )}
        {isTyping && <TypingIndicator />}
      </div>

      <ChatInput onSend={send} sending={isTyping} />
    </section>
  );
}
