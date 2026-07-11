import { useEffect, useState } from "react";
import type { Officer } from "../../schemas/organization";

/** Initials for an officer whose photo is missing or fails to load. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ officer }: { officer: Officer }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [officer.photoUrl]);

  const base =
    "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 dark:border-stone-700";

  if (!officer.photoUrl || broken) {
    return (
      <div
        aria-hidden
        className={`${base} bg-stone-100 font-mono text-sm font-semibold text-stone-500 dark:bg-stone-800 dark:text-stone-300`}
      >
        {initialsOf(officer.name)}
      </div>
    );
  }

  return (
    <div className={`${base} bg-white dark:bg-stone-800`}>
      <img
        src={officer.photoUrl}
        alt={`${officer.name}, ${officer.role}`}
        loading="lazy"
        onError={() => setBroken(true)}
        className="size-full object-cover"
      />
    </div>
  );
}

/** A grid of officer cards. Rendered only when officers are present. */
export function Officers({ officers }: { officers: Officer[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" aria-label="Officers">
      {officers.map((officer) => (
        <li
          key={`${officer.name}-${officer.role}`}
          className="flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-white p-4
            dark:border-stone-800 dark:bg-stone-900"
        >
          <Avatar officer={officer} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">
              {officer.name}
            </p>
            <p className="truncate font-mono text-xs text-stone-500 dark:text-stone-400">
              {officer.role}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
