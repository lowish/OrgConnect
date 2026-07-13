import { motion } from "framer-motion";
import { ArrowRight} from "lucide-react";
import { Button } from "../ui/Button";
import { fadeUp, stagger } from "../../lib/motion";

/** Opens the floating AI Advisor widget (see ChatWidget). */
const openChat = () => window.dispatchEvent(new Event("orgconnect:open-chat"));

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs font-medium tracking-[0.2em] text-cardinal-600 uppercase dark:text-cardinal-400"
          >
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-5xl font-semibold tracking-tight text-balance
              text-stone-900 sm:text-6xl lg:text-7xl dark:text-white"
          >
            Discover Organizations {" "}
            <span
              className="mt-5 text-5xl font-semibold tracking-tight text-balance
              text-stone-900 sm:text-6xl lg:text-7xl dark:text-white"
            >
            Connect with Students
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300"
          >
            Explore official School of Computing organizations, and find where you belong. 
            Let the AI Advisor recommend organizations that match your interests and goals, and connect with fellow School of Computing.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="#students" size="lg" className="rounded-none">
              Build Your Network
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-8 font-mono text-xs text-stone-500 dark:text-stone-400"
          >
            <p className="font-mono text-xs text-stone-500 dark:text-white">
              {"Holy Angel University · School of Computing"}
            </p>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
