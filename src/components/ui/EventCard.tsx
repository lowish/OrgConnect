import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { OrgEvent } from "../../types";
import { fadeUp } from "../../lib/motion";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function DateBlock({ iso }: { iso: string }) {
  const date = new Date(`${iso}T00:00:00`);
  return (
    <time
      dateTime={iso}
      className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl
        border border-stone-200 bg-stone-50 font-mono
        dark:border-stone-700 dark:bg-stone-800"
    >
      <span className="text-[10px] font-medium tracking-widest text-cardinal-600 dark:text-cardinal-400">
        {MONTHS[date.getMonth()]}
      </span>
      <span className="text-lg leading-tight font-semibold text-stone-900 dark:text-white">
        {date.getDate()}
      </span>
    </time>
  );
}

export function EventCard({ event }: { event: OrgEvent }) {
  return (
    <motion.article
      variants={fadeUp}
      className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5
        dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:shadow-black/40"
    >
      <DateBlock iso={event.date} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-white">
            {event.title}
          </h3>
          {event.isSample && (
            <span
              title="Illustrative event — official calendars are not connected yet."
              className="rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[10px]
                text-stone-500 dark:bg-stone-800 dark:text-stone-400"
            >
              sample
            </span>
          )}
        </div>

        <p className="mt-0.5 font-mono text-xs text-cardinal-600 dark:text-cardinal-400">
          {event.orgShortName}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {event.description}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-500">
          <MapPin className="size-3.5" />
          {event.venue}
        </p>
      </div>
    </motion.article>
  );
}
