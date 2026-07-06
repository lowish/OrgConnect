import { useCallback, useEffect, useRef, useState } from "react";
import {
  acknowledgementFor,
  AREA_CHIPS,
  buildRecommendations,
  detectTags,
  EXPERIENCE_CHIPS,
  EXPERIENCE_QUESTION,
  FALLBACK_TEXT,
  FOLLOW_UP_CHIPS,
  GREET_RE,
  GREETING_REPLY,
  GREETING_TEXT,
  interestTags,
  RECOMMEND_INTRO,
  STARTER_CHIPS,
  THANKS_RE,
  THANKS_REPLY,
  type ChatMessage,
  type Tag,
} from "../advisor";

type Stage = "intro" | "awaitExperience" | "open";

/** An AI reply queued for delivery after a "typing" pause. */
type Draft = Omit<ChatMessage, "id" | "role"> & { delay?: number };

const GREETING: ChatMessage = {
  id: 0,
  role: "ai",
  text: GREETING_TEXT,
  chips: STARTER_CHIPS,
};

/**
 * Conversation state machine:
 *   intro → first interest detected → ask experience preference →
 *   recommend → open (further questions recommend directly).
 * All state is local; the advisor brain is pure functions over verified data.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isTyping, setIsTyping] = useState(false);

  const stageRef = useRef<Stage>("intro");
  const pendingTagsRef = useRef<Tag[]>([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const queueReplies = useCallback((drafts: Draft[]) => {
    setIsTyping(true);
    let elapsed = 0;
    drafts.forEach((draft, index) => {
      elapsed += draft.delay ?? 900;
      timersRef.current.push(
        window.setTimeout(() => {
          const { delay: _delay, ...body } = draft;
          setMessages((prev) => [...prev, { ...body, id: nextIdRef.current++, role: "ai" }]);
          if (index === drafts.length - 1) setIsTyping(false);
        }, elapsed),
      );
    });
  }, []);

  const send = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || isTyping) return;

      setMessages((prev) => [...prev, { id: nextIdRef.current++, role: "user", text }]);

      const tags = detectTags(text);
      const interests = interestTags(tags);
      const drafts: Draft[] = [];

      if (stageRef.current === "awaitExperience") {
        // Their experience answer + the interests they already gave.
        const combined = [...pendingTagsRef.current, ...tags];
        const recommendations = buildRecommendations(combined);
        pendingTagsRef.current = [];
        stageRef.current = "open";
        if (recommendations.length > 0) {
          drafts.push({
            text: RECOMMEND_INTRO,
            recommendations,
            chips: FOLLOW_UP_CHIPS,
            delay: 1100,
          });
        } else {
          drafts.push({ text: FALLBACK_TEXT, chips: AREA_CHIPS });
        }
      } else if (tags.length > 0) {
        const wantsGuidedStep =
          stageRef.current === "intro" &&
          interests.length > 0 &&
          !interests.includes("freshman"); // freshmen get an answer right away

        if (wantsGuidedStep) {
          pendingTagsRef.current = tags;
          stageRef.current = "awaitExperience";
          drafts.push({ text: acknowledgementFor(interests) });
          drafts.push({ text: EXPERIENCE_QUESTION, chips: EXPERIENCE_CHIPS, delay: 800 });
        } else {
          const recommendations = buildRecommendations(tags);
          stageRef.current = "open";
          if (recommendations.length > 0) {
            drafts.push({ text: acknowledgementFor(tags) });
            drafts.push({
              text: RECOMMEND_INTRO,
              recommendations,
              chips: FOLLOW_UP_CHIPS,
              delay: 1000,
            });
          } else {
            drafts.push({ text: FALLBACK_TEXT, chips: AREA_CHIPS });
          }
        }
      } else if (GREET_RE.test(text)) {
        drafts.push({ text: GREETING_REPLY, chips: AREA_CHIPS });
      } else if (THANKS_RE.test(text)) {
        drafts.push({ text: THANKS_REPLY, chips: FOLLOW_UP_CHIPS });
      } else {
        drafts.push({ text: FALLBACK_TEXT, chips: AREA_CHIPS });
      }

      queueReplies(drafts);
    },
    [isTyping, queueReplies],
  );

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    stageRef.current = "intro";
    pendingTagsRef.current = [];
    setIsTyping(false);
    setMessages([GREETING]);
  }, []);

  return { messages, isTyping, send, reset };
}
