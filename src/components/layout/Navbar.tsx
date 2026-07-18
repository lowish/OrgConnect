import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Circle } from "lucide-react";
import { Button } from "../ui/Button";
import { VercelLogo } from "../ui/VercelLogo";
import { useTheme } from "../../lib/useTheme";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Organizations", href: "#organizations" },
  { label: "Events", href: "#events" },
  { label: "Students", href: "#students" },
];

const STUDENT_PROFILE_FORM_URL = "https://forms.gle/rB4Uid1sAvmaQR98A";

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    height: "auto",
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const mobileItemVariants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 520, damping: 34 } },
};

/**
 * The AI Assistant now lives in the floating <ChatWidget>, not an on-page
 * section — so its nav link opens the widget instead of jumping to an anchor.
 */
function handleNavClick(href: string, event: { preventDefault: () => void }) {
  if (href !== "#ai-assistant") return;
  event.preventDefault();
  window.dispatchEvent(new Event("orgconnect:open-chat"));
}

function Brand() {
  return (
    <a href="#home" className="flex items-center gap-2">
      <VercelLogo className="h-4 w-4 text-stone-900 dark:text-white" />
      <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        OrgConnect
      </span>
    </a>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-800
        transition-colors hover:bg-stone-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cardinal-600
        dark:text-stone-100 dark:hover:bg-stone-800"
    >
      <span
        aria-hidden="true"
        className={`relative flex h-4 w-4 items-center justify-center rounded-full border border-current transition-transform duration-300 ${
          theme === "dark" ? "rotate-180" : "rotate-0"
        }`}
      >
        <span className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-current opacity-90" />
        <Circle className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled
          ? "border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-xl dark:border-stone-800/70 dark:bg-stone-950/80"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(link.href, e)}
              className="
                group relative px-3.5 py-2 text-sm font-medium
                text-stone-600 dark:text-stone-400
                transition-colors hover:text-stone-900 dark:hover:text-white
              "
            >
              {link.label}

              <span
                className="
                  absolute left-0 -bottom-1 h-[2px] w-full
                  origin-left scale-x-0
                  bg-[#00FF66]
                  transition-transform duration-300 ease-out
                  group-hover:scale-x-100
                "
              />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <motion.button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.92 }}
            animate={menuOpen ? "open" : "closed"}
            className="relative flex size-9 items-center justify-center rounded-full text-stone-600
              hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <motion.span
                className="absolute h-0.5 w-5 rounded-full bg-current"
                variants={{
                  closed: { rotate: 0, y: -5 },
                  open: { rotate: 45, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 550, damping: 28 }}
              />
              <motion.span
                className="absolute h-0.5 w-5 rounded-full bg-current"
                variants={{
                  closed: { rotate: 0, y: 5 },
                  open: { rotate: -45, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 550, damping: 28 }}
              />
            </span>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="overflow-hidden border-b border-stone-200 bg-stone-50/95 backdrop-blur-xl
              md:hidden dark:border-stone-800 dark:bg-stone-950/95"
          >
            <motion.div variants={mobileMenuVariants} className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(link.href, e);
                    setMenuOpen(false);
                  }}
                  variants={mobileItemVariants}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl px-4 py-3 text-base font-medium text-stone-700
                    hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div variants={mobileItemVariants}>
                <Button
                  href={STUDENT_PROFILE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  Submit Profile
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
