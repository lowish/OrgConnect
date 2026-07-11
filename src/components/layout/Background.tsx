/**
 * The fixed, full-viewport base field behind the entire app: a static rotated
 * square grid — hairline gray rules on an off-white canvas.
 *
 * Drawn entirely in CSS (no images, no gradients, no animation). The grid plane
 * is rotated a few degrees and over-sized so the tilt never exposes an edge.
 * It never moves, sits at -z-50, and is pointer-events-none.
 */

/** Cell pitch and hairline weight for the grid rules. */
const CELL = "88px";
const LINE = "1px";

/** One set of rules per axis, drawn as hard 1px stops (not a gradient wash). */
const grid = (stroke: string) =>
  `repeating-linear-gradient(to right, ${stroke} 0 ${LINE}, transparent ${LINE} ${CELL}),` +
  `repeating-linear-gradient(to bottom, ${stroke} 0 ${LINE}, transparent ${LINE} ${CELL})`;

export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#fafaf9] dark:bg-[#0b0b0b]" />

      {/* Rotated grid plane, scaled past the viewport so corners stay covered. */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: grid("rgba(0,0,0,0.09)"),
          transform: "rotate(-6deg) scale(1.4)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: grid("rgba(255,255,255,0.07)"),
          transform: "rotate(-6deg) scale(1.4)",
        }}
      />
    </div>
  );
}
