import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { StudentCard } from "../ui/StudentCard";
import { useStudents } from "../../lib/useStudents";
import { stagger, viewportOnce } from "../../lib/motion";

/** Google Form students fill out to add themselves to the board. */
const FORM_URL = "https://forms.gle/rB4Uid1sAvmaQR98A";

export function ConnectStudents() {
  const { students } = useStudents();

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

        {students.length > 0 && (
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
