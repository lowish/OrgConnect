import { ArrowRight} from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-cardinal-600 uppercase dark:text-cardinal-400">
          </p>

          <h1
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
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            Explore official School of Computing organizations, and find where you belong.
            Let the AI Advisor recommend organizations that match your interests and goals, and connect with fellow students.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="#students" size="lg" className="rounded-none">
              Build Your Network
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <p className="mt-8 font-mono text-xs text-stone-500 dark:text-stone-400">
            <p className="font-mono text-xs text-stone-900 dark:text-white">
              {"Holy Angel University · School of Computing"}
            </p>
          </p>
        </div>
      </div>
    </section>
  );
}
