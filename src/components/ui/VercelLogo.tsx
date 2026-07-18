/**
 * The Vercel triangle, used as the OrgConnect brand mark in the navbar and
 * footer.
 *
 * Fills with `currentColor` so it inherits the surrounding text color and
 * flips with the theme automatically — no dark-mode variant needed.
 */
export function VercelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" className={className} fill="currentColor" aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}
