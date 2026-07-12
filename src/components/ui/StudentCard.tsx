import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Facebook, Github, Globe, Linkedin, Quote } from "lucide-react";
import type { Student } from "../../schemas/student";
import { fadeUp } from "../../lib/motion";

const MAX_VISIBLE_INTERESTS = 5;

/** First letters of the first two words, e.g. "Ana Reyes" → "AR". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/** Circular photo with a graceful initials fallback when the image is missing. */
function Avatar({ student }: { student: Student }) {
  const [failed, setFailed] = useState(false);
  const showImage = student.photoUrl && !failed;

  return (
    <div
      className="relative size-20 shrink-0 overflow-hidden rounded-full border border-stone-200
        bg-stone-100 dark:border-stone-700 dark:bg-stone-800"
    >
      {showImage ? (
        <img
          src={student.photoUrl}
          alt={student.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-full items-center justify-center font-mono text-xl font-semibold
            text-stone-500 dark:text-stone-400"
        >
          {initials(student.name)}
        </span>
      )}
    </div>
  );
}

/** A labeled row of tag chips; renders nothing when the list is empty. */
function TagRow({
  label,
  items,
  max = items.length,
}: {
  label: string;
  items: string[];
  max?: number;
}) {
  if (items.length === 0) return null;
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;

  return (
    <div>
      <p className="font-mono text-[10px] font-medium tracking-[0.15em] text-stone-400 uppercase dark:text-stone-500">
        {label}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label={label}>
        {visible.map((item) => (
          <li
            key={item}
            className="rounded-md border border-stone-200 px-2 py-1 font-mono text-[11px]
              text-stone-600 dark:border-stone-700 dark:text-stone-300"
          >
            {item}
          </li>
        ))}
        {hidden > 0 && (
          <li className="px-2 py-1 font-mono text-[11px] text-stone-400 dark:text-stone-500">
            +{hidden} more
          </li>
        )}
      </ul>
    </div>
  );
}

type IconType = ComponentType<{ className?: string }>;

function SocialLinks({ student }: { student: Student }) {
  const links: { url: string; label: string; Icon: IconType }[] = [
    student.github && { url: student.github, label: "GitHub", Icon: Github },
    student.linkedin && { url: student.linkedin, label: "LinkedIn", Icon: Linkedin },
    student.portfolio && { url: student.portfolio, label: "Portfolio", Icon: Globe },
    student.facebook && { url: student.facebook, label: "Facebook", Icon: Facebook },
  ].filter(Boolean) as { url: string; label: string; Icon: IconType }[];

  if (links.length === 0) return null;

  return (
    <div className="mt-5 flex items-center gap-1.5 border-t border-stone-100 pt-4 dark:border-stone-800">
      {links.map(({ url, label, Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${student.name} on ${label}`}
          className="flex size-9 items-center justify-center rounded-full text-stone-500
            transition-colors hover:bg-stone-100 hover:text-stone-900
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardinal-600
            dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <Icon className="size-4.5" />
        </a>
      ))}
    </div>
  );
}

export function StudentCard({ student }: { student: Student }) {
  const meta = [student.course, student.yearLevel].filter(Boolean).join(" · ");

  return (
    <motion.article
      variants={fadeUp}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:border-cardinal-200 hover:shadow-xl hover:shadow-stone-900/5
        dark:border-stone-800 dark:bg-stone-900
        dark:hover:border-cardinal-700 dark:hover:shadow-black/40"
    >
      <header className="flex items-start gap-4">
        <Avatar student={student} />
        <div className="min-w-0 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
              {student.name}
            </h3>
            {student.isSample && (
              <span
                title="Illustrative profile — connect the Google Form to show real students."
                className="rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[10px]
                  text-stone-500 dark:bg-stone-800 dark:text-stone-400"
              >
                sample
              </span>
            )}
          </div>
          {meta && (
            <p className="mt-0.5 font-mono text-xs text-stone-500 dark:text-stone-400">{meta}</p>
          )}
          {student.organization && (
            <span
              className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 font-mono text-[11px]
                font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400"
            >
              {student.organization}
            </span>
          )}
        </div>
      </header>

      {student.intro && (
        <blockquote className="mt-5 flex gap-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          <Quote className="size-4 shrink-0 text-stone-300 dark:text-stone-600" aria-hidden />
          <p>{student.intro}</p>
        </blockquote>
      )}

      <div className="mt-5 flex flex-1 flex-col gap-4">
        <TagRow label="Interests" items={student.interests} max={MAX_VISIBLE_INTERESTS} />
        <TagRow label="Looking for" items={student.lookingFor} />
      </div>

      <SocialLinks student={student} />
    </motion.article>
  );
}
