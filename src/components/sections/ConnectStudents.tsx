import { motion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { StudentCard } from "../ui/StudentCard";
import { useStudents } from "../../lib/useStudents";
import { stagger, viewportOnce } from "../../lib/motion";

/** Google Form students fill out to add themselves to the board. */
const FORM_URL = "https://forms.gle/hkVhGCbKEYMssQsT6";

/** Placeholder cards shown while the sheet is loading. */
function LoadingGrid() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-2xl border border-stone-200 bg-white
            dark:border-stone-800 dark:bg-stone-900"
        />
      ))}
    </div>
  );
}

/** Shown when the sheet is connected but has no submissions yet. */
function EmptyState() {
  return (
    <div
      className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-stone-300
        bg-white/50 px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900/50"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
        <Users className="size-6 text-stone-500 dark:text-stone-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-white">
        No profiles yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-stone-600 dark:text-stone-400">
        Be the first to introduce yourself. Fill out the form and your profile
        appears here on the next refresh.
      </p>
      <Button href={FORM_URL} target="_blank" rel="noopener noreferrer" className="mt-6">
        Add your profile
        <ArrowUpRight className="size-4" />
      </Button>
    </div>
  );
}

export function ConnectStudents() {
  const { students, status } = useStudents();

  return (
    <section id="students" className="relative isolate py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Connect"
            title="Meet the students behind the orgs"
            description="Real people from across the School of Computing — what they're into and what they're looking for. Submit the form and you'll show up here too."
          />
          <Button
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="shrink-0 self-start sm:self-auto"
          >
            Add your profile
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        {status === "loading" ? (
          <LoadingGrid />
        ) : students.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {students.map((student, i) => (
              <StudentCard key={student.id ?? `${student.name}-${i}`} student={student} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
