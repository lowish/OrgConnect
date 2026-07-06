/**
 * The fixed, full-viewport base field behind the entire app — soft mint in
 * light mode, an emerald void in dark, with a faint top-glow for depth.
 *
 * The asterisk artwork itself is now section-scoped (see SectionArt.tsx): the
 * landscape plate fills the home hero, and portrait rails frame the content
 * sections. This layer is just the quiet ground they sit on. It never moves,
 * sits at -z-50, and is pointer-events-none.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#eef3ee] dark:bg-[#04140d]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(0,255,102,0.07), transparent 55%)",
        }}
      />
    </div>
  );
}
