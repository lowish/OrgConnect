import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { contrastText } from "../../lib/color";

/** Show the bar once the reader has scrolled past the header region. */
const REVEAL_AFTER_PX = 360;

/**
 * A floating action bar that appears after the reader scrolls past the header.
 * It keeps the org's identity and primary action in reach on long pages.
 */
export function StickyActionBar({
  orgName,
  accentColor,
  actionLabel = "How to join",
  targetId = "how-to-join",
}: {
  orgName: string;
  accentColor: string;
  actionLabel?: string;
  targetId?: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShown(window.scrollY > REVEAL_AFTER_PX);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  if (!shown) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(92%,42rem)] items-center
        justify-between gap-4 rounded-2xl border border-stone-200 bg-white/90 px-4 py-3
        shadow-lg shadow-stone-900/10 backdrop-blur-md dark:border-stone-700
        dark:bg-stone-900/90 dark:shadow-black/40"
    >
      <span className="min-w-0 truncate text-sm font-semibold text-stone-900 dark:text-white">
        {orgName}
      </span>
      <button
        type="button"
        onClick={jump}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm
          font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: accentColor,
          color: contrastText(accentColor),
          outlineColor: accentColor,
        }}
      >
        {actionLabel}
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
