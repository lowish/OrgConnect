import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export type SupportSection =
  | "overview"
  | "terms-of-use"
  | "privacy-policy";

const SUPPORT_SECTIONS: {
  id: SupportSection;
  title: string;
  eyebrow: string;
  body: string;
  points: string[];
}[] = [
  {
    id: "terms-of-use",
    title: "Terms of Use",
    eyebrow: "How to use OrgConnect",
    body:
      "These terms explain the intended use of the site and the limits of the information presented here.",
    points: [
      "Use the directory for informational and student-community purposes.",
      "Organization details are maintained from official and verified sources where available.",
      "Do not assume unverified information is complete or final.",
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "How data is handled",
    body:
      "OrgConnect does not require accounts or collect personal information through these support pages.",
    points: [
      "The app currently works as a static front end and does not ask for sign-in.",
      "If a future feature collects data, it should clearly explain what is collected and why.",
      "External links open the destination site, which may have its own privacy policy.",
    ],
  },
];

function SupportCard({
  id,
  title,
  eyebrow,
  body,
  points,
}: {
  id: SupportSection;
  title: string;
  eyebrow: string;
  body: string;
  points: string[];
}) {
  return (
    <article
      id={`support-${id}`}
      className="rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)] backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/70"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {body}
      </p>
      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cardinal-500 dark:bg-cardinal-400" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function SupportPage({ section }: { section: SupportSection }) {
  useEffect(() => {
    const target = section === "overview" ? "support-overview" : `support-${section}`;
    window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }, [section]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <button
          type="button"
          onClick={() => {
            window.location.hash = "#home";
          }}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium
            text-stone-500 focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
            dark:text-stone-400"
        >
          <ArrowLeft className="size-4" />
          BACK TO HOME
        </button>

        <div id="support-overview" className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-500">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
            Terms of Use and Privacy Policy.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-600 dark:text-stone-400">
            Use these pages for the legal terms that govern how OrgConnect is
            used and how the site handles privacy.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SUPPORT_SECTIONS.map((item) => (
          <SupportCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}