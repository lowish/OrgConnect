import bgHome from "../../assets/background1.jpg";
import bgPortrait from "../../assets/background.jpg";
import bgEvents from "../../assets/eventbackground.jpg";


/**
 * Section-scoped background artwork, à la omsimos.com.
 *
 * - <HeroArt/>   the green-glow plate, filling the home hero (glow on the right).
 * - <EventsArt/> twin rails like <SideRails/>, but with the green-glow plate —
 *                a section-specific accent for the Events section.
 * - <SideRails/> twin full-height portrait strips, one flush against each edge,
 *                both fading inward so the copy always sits on a clean centre
 *                field. Responsive: full-width + full-strength on desktop,
 *                narrower + dimmer on tablet, and gone on mobile (centre only).
 *
 * Both are decorative (aria-hidden) and pointer-events-none. Drop one in as the
 * FIRST child of a `relative isolate` section; it renders at -z-10, behind the
 * section's content but scoped to that section (never behind the page base).
 */

export function HeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src={bgHome}
        alt=""
        draggable={false}
        className="h-full w-full object-cover object-right"
      />

      {/* Dark mode: soft vignette biased to the left so centred copy stays
          legible while the right-side green glow reads through. */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(120% 100% at 38% 40%, rgba(2,12,7,0.20), rgba(2,12,7,0.55))",
        }}
      />

      {/* Light mode: wash the emerald plate back to a quiet mint texture. */}
      <div className="absolute inset-0 bg-[#eef3ee]/82 dark:hidden" />
    </div>
  );
}

export function EventsArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Left edge — green-glow strip flush left, fading rightward inward.
          Hidden on mobile; narrow + dim on tablet, wide + strong on desktop. */}
      <img
        src={bgEvents}
        alt=""
        draggable={false}
        className="absolute inset-y-0 left-0 hidden h-full min-w-[120px] max-w-[300px]
          object-cover object-right opacity-50 md:block md:w-[16%]
          lg:w-[24%] lg:opacity-90 dark:opacity-70 dark:lg:opacity-100"
        style={{
          maskImage: "linear-gradient(to right, black 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black 30%, transparent)",
        }}
      />

      {/* Right edge — mirror of the left: flush right, fading leftward inward. */}
      <img
        src={bgEvents}
        alt=""
        draggable={false}
        className="absolute inset-y-0 right-0 hidden h-full min-w-[120px] max-w-[300px]
          object-cover object-left opacity-50 md:block md:w-[16%]
          lg:w-[24%] lg:opacity-90 dark:opacity-70 dark:lg:opacity-100"
        style={{
          maskImage: "linear-gradient(to left, black 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black 30%, transparent)",
        }}
      />

      {/* Light mode: mute the artwork to a faint frame so copy stays crisp. */}
      <div className="absolute inset-0 bg-[#eef3ee]/70 dark:hidden" />
    </div>
  );
}

export function SideRails() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Left edge — full-height strip flush left, fading rightward inward.
          Hidden on mobile; narrow + dim on tablet, wide + strong on desktop. */}
      <img
        src={bgPortrait}
        alt=""
        draggable={false}
        className="absolute inset-y-0 left-0 hidden h-full min-w-[120px] max-w-[300px]
          object-cover object-right opacity-50 md:block md:w-[16%]
          lg:w-[24%] lg:opacity-90 dark:opacity-70 dark:lg:opacity-100"
        style={{
          maskImage: "linear-gradient(to right, black 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black 30%, transparent)",
        }}
      />

      {/* Right edge — mirror of the left: flush right, fading leftward inward. */}
      <img
        src={bgPortrait}
        alt=""
        draggable={false}
        className="absolute inset-y-0 right-0 hidden h-full min-w-[120px] max-w-[300px]
          object-cover object-left opacity-50 md:block md:w-[16%]
          lg:w-[24%] lg:opacity-90 dark:opacity-70 dark:lg:opacity-100"
        style={{
          maskImage: "linear-gradient(to left, black 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black 30%, transparent)",
        }}
      />

      {/* Light mode: mute the artwork to a faint frame so copy stays crisp. */}
      <div className="absolute inset-0 bg-[#eef3ee]/70 dark:hidden" />
    </div>
  );
}
