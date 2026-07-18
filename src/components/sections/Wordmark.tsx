import { Asterisk } from "../ui/Asterisk";

/**
 * A single, centered wordmark line — "School of Computing ✳ Discover" — with
 * one static neon-green asterisk as the divider, à la omsimos.com. Purely
 * decorative (aria-hidden); the same message is stated in the hero.
 */
const gradientText =
  "bg-gradient-to-t from-stone-900 to-stone-600 bg-clip-text text-transparent " +
  "font-semibold uppercase tracking-tight whitespace-nowrap dark:from-[#8c8c8c] dark:to-white";

export function Wordmark() {
  return (
    <section
      aria-hidden
      className="relative overflow-x-hidden border-y border-stone-200/60 py-10
        sm:py-14 dark:border-white/10"
    >
      <div className="flex items-center justify-center gap-5 px-4 text-2xl sm:gap-8 sm:text-6xl lg:text-8xl">
        <span className={gradientText}>EXPLORE</span>
        <Asterisk className="size-7 shrink-0 text-neon sm:size-9 lg:size-30" />
        <span className={gradientText}>CONNECT</span>
      </div>
    </section>
  );
}
