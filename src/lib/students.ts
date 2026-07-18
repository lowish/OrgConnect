import { safeParseStudent, type Student } from "../schemas/student";
import { sampleStudents } from "../data/students";

/**
 * Data access for the "Connect With Students" board.
 *
 * The one place the app talks to the Google Sheet. It fetches the Apps Script
 * Web App (VITE_STUDENTS_ENDPOINT), then validates every row through the student
 * schema so no unvalidated, untrusted data reaches a component. Rows that fail
 * to parse — or whose consent flag is explicitly negative — are dropped.
 */

/** The deployed Apps Script /exec URL. See google-apps-script/README.md. */
const ENDPOINT = import.meta.env.VITE_STUDENTS_ENDPOINT;

/** True when a live endpoint is configured (vs. showing sample data). */
export const hasLiveEndpoint = Boolean(ENDPOINT);

/** Pull the array of rows out of whatever envelope the endpoint returns. */
function extractRows(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    for (const key of ["students", "data", "rows", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
}

/**
 * Fetch and validate the student directory.
 *
 * - No endpoint configured → returns the built-in sample profiles.
 * - Endpoint configured → fetches, validates, and returns only consenting rows.
 *   Throws on network / HTTP / JSON errors so callers can decide how to fall
 *   back (see useStudents).
 */
export async function fetchStudents(signal?: AbortSignal): Promise<Student[]> {
  if (!ENDPOINT) return sampleStudents;

  const res = await fetch(ENDPOINT, {
    signal,
    headers: { Accept: "application/json" },
    // The Apps Script /exec URL 302-redirects to googleusercontent.com; fetch
    // follows it automatically. Default CORS mode is fine for a GET.
  });
  if (!res.ok) {
    throw new Error(`Students endpoint responded ${res.status}`);
  }

  const rows = extractRows(await res.json());
  return rows
    .map(safeParseStudent)
    .filter((s): s is Student => s !== null && s.consent);
}
