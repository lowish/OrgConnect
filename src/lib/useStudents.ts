import { useEffect, useState } from "react";
import { fetchStudents, hasLiveEndpoint } from "./students";
import { sampleStudents } from "../data/students";
import type { Student } from "../schemas/student";

export type StudentsStatus = "loading" | "ready" | "error";

export interface UseStudentsResult {
  students: Student[];
  status: StudentsStatus;
  /** True while showing built-in samples (no endpoint set, or a fetch failed). */
  usingSamples: boolean;
}

/**
 * Loads the student directory once on mount. Because the fetch runs on mount, a
 * new form submission shows up simply by refreshing the page — no polling and
 * no manual editing required.
 *
 * On failure it falls back to the sample profiles so the section is never empty
 * or broken; `status` still reports "error" for anyone who wants to surface it.
 */
export function useStudents(): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [status, setStatus] = useState<StudentsStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetchStudents(controller.signal)
      .then((data) => {
        setStudents(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return; // unmounted; ignore
        console.error("Failed to load students:", error);
        setStudents(sampleStudents);
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const usingSamples = status === "error" || (status === "ready" && !hasLiveEndpoint);

  return { students, status, usingSamples };
}
