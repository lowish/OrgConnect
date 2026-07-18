/**
 * Color helpers for applying a per-org accent without breaking contrast.
 *
 * Accents are chosen bright so they read on the near-black theme. That means a
 * solid accent fill needs DARK text, not white, to stay legible. `contrastText`
 * picks the readable foreground for any accent, keeping filled buttons and chips
 * within WCAG AA.
 */

/** Expand a 3 or 6 digit hex into [r, g, b] (0-255), or null if unparseable. */
function toRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Relative luminance (0 = black, 1 = white) per WCAG. */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Near-black or white, whichever reads better on the given accent fill. */
export function contrastText(hex: string): string {
  const rgb = toRgb(hex);
  if (!rgb) return "#ffffff";
  return luminance(rgb) > 0.45 ? "#0b0b0b" : "#ffffff";
}
