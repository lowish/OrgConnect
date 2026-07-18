import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { StudentCard } from "../ui/StudentCard";
import { useStudents } from "../../lib/useStudents";
import { FORM_URL } from "./ConnectStudents";

/**
 * The full student directory page (#students/all).
 *
 * The landing section only has room for the first few profiles, so once the
 * board outgrows that preview every profile lives here instead.
 */
export function StudentsDirectory({ onBack }: { onBack: () => void }) {
  const { students, status } = useStudents();

  // Arriving from the landing section leaves the scroll mid-page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <section className="relative isolate pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium
            text-stone-500 focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-cardinal-600
            dark:text-stone-400"
        >
          <ArrowLeft className="size-4" />
          BACK TO HOME
        </button>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-500">
              // Connect
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl dark:text-white">
              Every student on the board.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-600 dark:text-stone-400">
              {status === "loading"
                ? "Loading profiles…"
                : `${students.length} profile${students.length === 1 ? "" : "s"} from across the School of Computing.`}
            </p>
          </div>

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

        {students.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student, i) => (
              <StudentCard key={student.id ?? `${student.name}-${i}`} student={student} />
            ))}
          </div>
        )}

        {status !== "loading" && students.length === 0 && (
          <p className="mt-12 text-sm text-stone-500 dark:text-stone-400">
            No profiles yet — be the first to add yours.
          </p>
        )}
      </div>
    </section>
  );
}
