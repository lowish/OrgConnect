import { motion } from "framer-motion";
import type { ChatMessage } from "./advisor";

export function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-cardinal-600 px-4 py-2.5
        text-sm leading-relaxed text-white shadow-sm shadow-cardinal-900/20"
    >
      {message.text}
    </motion.div>
  );
}
