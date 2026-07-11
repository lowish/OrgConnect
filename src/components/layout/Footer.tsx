import { Compass, Facebook, Github, Instagram } from "lucide-react";

const PLATFORM_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Organizations", href: "#organizations" },
  { label: "Events", href: "#events" },
];

const UNIVERSITY_LINKS = [
  { label: "Holy Angel University", href: "https://www.hau.edu.ph" },
  { label: "School of Computing", href: "https://www.hau.edu.ph/academics/school-of-computing" },
];

const SOCIALS = [
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "GitHub", href: "#", Icon: Github },
];

function LinkColumn({
  title,
  links,
  external = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <h3 className="font-mono text-xs font-medium tracking-[0.18em] text-stone-500 uppercase dark:text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              onClick={(e) => {
                // The AI Assistant lives in the floating widget — open it, don't jump.
                if (link.href === "#ai-assistant") {
                  e.preventDefault();
                  window.dispatchEvent(new Event("orgconnect:open-chat"));
                }
              }}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-stone-600 transition-colors hover:text-cardinal-600
                dark:text-stone-400 dark:hover:text-cardinal-400"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
                OrgConnect
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Every School of Computing organization in one place, so you can
              find yours.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`${label} (coming soon)`}
                  title={`${label} — coming soon`}
                  className="flex size-9 items-center justify-center rounded-full border
                    border-stone-200 text-stone-500 transition-colors
                    hover:border-cardinal-300 hover:text-cardinal-600
                    dark:border-stone-700 dark:text-stone-400
                    dark:hover:border-cardinal-800 dark:hover:text-cardinal-400"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Platform" links={PLATFORM_LINKS} />
          <LinkColumn title="University" links={UNIVERSITY_LINKS} external />

          <div>
            <h3 className="font-mono text-xs font-medium tracking-[0.18em] text-stone-500 uppercase dark:text-white">
              Campus
            </h3>
            <address className="mt-4 text-sm leading-relaxed text-stone-600 not-italic dark:text-stone-400">
              School of Computing
              <br />
              Holy Angel University
              <br />
              Angeles City, Pampanga
            </address>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-3 border-t border-stone-200 pt-8
            sm:flex-row sm:items-center sm:justify-between dark:border-stone-800"
        >
          <p className="font-mono text-[13px] text-stone-400 dark:text-white">
            created by princetan.
          </p>
          <p className="text-[13px] text-stone-500 dark:text-stone-200">
            © 2026 OrgConnect
          </p>
        </div>
      </div>
    </footer>
  );
}
