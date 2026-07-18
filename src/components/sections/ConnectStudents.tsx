import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { StudentCard } from "../ui/StudentCard";
import { useStudents } from "../../lib/useStudents";

/** Google Form students fill out to add themselves to the board. */
export const FORM_URL = "https://forms.gle/rB4Uid1sAvmaQR98A";

/** Profiles shown on the landing page; the rest live on #students/all. */
const PREVIEW_LIMIT = 3;

export function ConnectStudents() {
  const { students } = useStudents();
  const preview = students.slice(0, PREVIEW_LIMIT);
  const hasMore = students.length > PREVIEW_LIMIT;

  return (
    <section id="students" className="relative isolate py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Connect"
            title="Meet the students behind the orgs"
            description="Real people from across the School of Computing what they're into and what they're looking for. Submit the form and you'll show up here too."
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

        {preview.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((student, i) => (
              <StudentCard key={student.id ?? `${student.name}-${i}`} student={student} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button href="#students/all" variant="secondary">
              View all {students.length} students
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
