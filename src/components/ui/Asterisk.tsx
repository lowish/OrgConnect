/**
 * A bold six-point geometric asterisk with a solid green fill.
 * No glow, no shadow, no filter.
 */
export function Asterisk({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="#00FF66"
      aria-hidden
    >
      {[0, 60, 120].map((deg) => (
        <rect
          key={deg}
          x="8"
          y="51"
          width="104"
          height="18"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
    </svg>
  );
}