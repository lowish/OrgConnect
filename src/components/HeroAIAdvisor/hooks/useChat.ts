import { useCallback, useEffect, useRef, useState } from "react";
import { createAdvisor, type Advisor, type ChatMessage, type Reply } from "../advisor";

/**
 * Owns the presentation side of the conversation: the message log, the typing
 * pause, and the timers. All reasoning and wording belongs to the advisor
 * session in advisor.ts, which is stateful across a conversation (it remembers
 * what the student has said, and which phrasings it has already spent) and so
 * is created once per chat and thrown away on reset.
 */
export function useChat() {
  const advisorRef = useRef<Advisor>();
  advisorRef.current ??= createAdvisor();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [advisorRef.current!.greeting()]);
  const [isTyping, setIsTyping] = useState(false);

  const nextIdRef = useRef(1);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const queueReplies = useCallback((replies: Reply[]) => {
    setIsTyping(true);
    let elapsed = 0;
    replies.forEach((reply, index) => {
      elapsed += reply.delay ?? 900;
      timersRef.current.push(
        window.setTimeout(() => {
          const { delay: _delay, ...body } = reply;
          setMessages((prev) => [...prev, { ...body, id: nextIdRef.current++, role: "ai" }]);
          if (index === replies.length - 1) setIsTyping(false);
        }, elapsed),
      );
    });
  }, []);

  const send = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || isTyping) return;

      setMessages((prev) => [...prev, { id: nextIdRef.current++, role: "user", text }]);
      queueReplies(advisorRef.current!.reply(text));
    },
    [isTyping, queueReplies],
  );

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    // A fresh session: the student's accumulated profile and the spent phrasing
    // pools both go with it.
    advisorRef.current = createAdvisor();
    setIsTyping(false);
    setMessages([advisorRef.current.greeting()]);
  }, []);

  return { messages, isTyping, send, reset };
}
