/**
 * A bold six-point geometric asterisk — three thick rectangular bars crossing
 * at 0°/60°/120° through the center, with flat (square) ends. Fills with
 * `currentColor`, so the caller sets the tint (neon green `#00FF66` in the
 * marquee band) and any outer glow via a drop-shadow.
 */
export function Asterisk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="currentColor" aria-hidden>
      {[0, 60, 120].map((deg) => (
        <rect key={deg} x="8" y="51" width="104" height="18" transform={`rotate(${deg} 60 60)`} />
      ))}
    </svg>
  );
}
