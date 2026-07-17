import {Facebook, Github, Instagram } from "lucide-react";

const PLATFORM_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Organizations", href: "#organizations" },
  { label: "Events", href: "#events" },
];

const ABOUT_LINKS = [
  { label: "Holy Angel University", href: "https://www.hau.edu.ph" },
  { label: "School of Computing", href: "https://www.hau.edu.ph/academics/school-of-computing" },
  { label: "Student Council SOC", href: "https://www.facebook.com/haucscsoc" },
];

const SUPPORT_LINKS = [
  { label: "Terms of Use", href: "#legal/terms-of-use" },
  { label: "Privacy Policy", href: "#legal/privacy-policy" },
];
const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/holyangel1933", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/holyangel1933", Icon: Instagram },
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
      <h3 className="font-mono text-s font-medium tracking-[0.18em] text-stone-900 uppercase dark:text-white">
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
    <footer className="border-t border-stone-300 dark:border-stone-700">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="text-xl font-semibold tracking-tight text-stone-900 dark:text-white">
                OrgConnect
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Every School of Computing organization in one place, so you can
              find yours.
            </p>
          </div>

          <LinkColumn title="Quick Links" links={PLATFORM_LINKS} />
          <LinkColumn title="About" links={ABOUT_LINKS} external />
          <LinkColumn title="Legal" links={SUPPORT_LINKS} />

        </div>
        <div
          className="mt-14 flex flex-col gap-3 border-t border-stone-300 pt-8
            sm:flex-row sm:items-center sm:justify-between dark:border-stone-700"
        >
          <p className="font-mono text-[13px] text-stone-900 dark:text-white">
            developed by princetan.
          </p>
          <p className="text-[13px] text-stone-900 dark:text-stone-200">
            © 2026 OrgConnect
          </p>
        </div>
      </div>
    </footer>
  );
}
