import { z } from "zod";

/**
 * Student schema for the "Connect With Students" board.
 *
 * Profiles arrive from an UNTRUSTED source — a Google Sheet fed by a Google
 * Form (see google-apps-script/). Every field is normalized and validated here
 * at the boundary before it ever reaches a component, mirroring how
 * schemas/organization.ts guards the details page.
 *
 * Consent is a soft gate, not a hard one: submitting the form IS the opt-in, so
 * a row is shown by default. If (and only if) the form adds an explicit consent
 * checkbox and a student leaves it unchecked, `consent` is false and the row is
 * dropped downstream (see lib/students.ts).
 */

/** Split a delimited string (or pass an array through) into a clean string list. */
function toList(value: unknown): string[] {
  const parts = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,\n;]+/)
      : [];
  return parts.map((p) => String(p).trim()).filter(Boolean);
}

/** Trim to a non-empty string, or undefined when blank/absent. */
function toOptionalText(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s.length ? s : undefined;
}

/** Turn a bare handle/domain into an absolute https URL, or undefined if blank. */
function toOptionalUrl(value: unknown): string | undefined {
  const s = toOptionalText(value);
  if (!s) return undefined;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

/** Pull a Google Drive file id out of any of its share-URL shapes. */
function driveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([\w-]+)/, // .../file/d/<id>/view
    /[?&]id=([\w-]+)/, //     open?id=<id> or uc?id=<id>
    /\/d\/([\w-]+)/, //       .../d/<id>
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Normalize a profile-photo cell into a directly embeddable image URL.
 *
 * A Form file-upload answer is a Drive link (and may list several, comma
 * separated). We take the first and rewrite Drive links to the thumbnail host,
 * which serves the raw image for files shared "Anyone with the link". A plain
 * pasted image URL passes through untouched.
 */
function toImageUrl(value: unknown): string | undefined {
  const raw = toOptionalText(Array.isArray(value) ? value[0] : value);
  if (!raw) return undefined;
  // An inlined base64 image from the Apps Script — use exactly as-is (it contains
  // a comma, so it must be handled before the delimiter split below).
  if (/^data:image\//i.test(raw)) return raw;
  const first = raw.split(/[,\s]+/).find(Boolean) ?? raw;
  const withScheme = /^https?:\/\//i.test(first) ? first : `https://${first}`;
  if (/(drive|docs)\.google\.com|googleusercontent\.com/i.test(withScheme)) {
    const id = driveFileId(withScheme);
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
  }
  return withScheme;
}

/** Truthy checkbox/consent values from a spreadsheet cell. Absent → consented. */
function toConsent(value: unknown): boolean {
  if (value === true) return true;
  if (value == null) return true; // no consent column → the submission is the opt-in
  const s = String(value).trim().toLowerCase();
  if (!s) return true; // present but blank cell → still treat the submission as consent
  return !["no", "false", "0", "unchecked", "off", "n"].includes(s);
}

export const studentSchema = z.object({
  id: z.preprocess(toOptionalText, z.string().optional()),
  name: z.preprocess((v) => toOptionalText(v) ?? "", z.string().min(1)),
  /** Circular avatar. Drive-upload links are rewritten to a viewable thumbnail. */
  photoUrl: z.preprocess(toImageUrl, z.string().url().optional()),
  course: z.preprocess(toOptionalText, z.string().optional()),
  yearLevel: z.preprocess(toOptionalText, z.string().optional()),
  organization: z.preprocess(toOptionalText, z.string().optional()),
  /** Short introduction — the quote shown on the card. */
  intro: z.preprocess(toOptionalText, z.string().optional()),
  interests: z.preprocess(toList, z.array(z.string()).default([])),
  /** Roles/collaborators the student is seeking. Optional in the form. */
  lookingFor: z.preprocess(toList, z.array(z.string()).default([])),
  github: z.preprocess(toOptionalUrl, z.string().url().optional()),
  linkedin: z.preprocess(toOptionalUrl, z.string().url().optional()),
  /** Personal site / portfolio. */
  portfolio: z.preprocess(toOptionalUrl, z.string().url().optional()),
  facebook: z.preprocess(toOptionalUrl, z.string().url().optional()),
  /** Display consent. Defaults to true (see toConsent); a card is dropped only
   * when an explicit consent field is present and negative. */
  consent: z.preprocess(toConsent, z.boolean()),
  /** Marks fallback sample cards until the live form is connected. */
  isSample: z.boolean().optional(),
});

export type Student = z.infer<typeof studentSchema>;

/** Validate one unknown row into a Student, or null if it fails to parse. */
export function safeParseStudent(input: unknown): Student | null {
  const result = studentSchema.safeParse(input);
  return result.success ? result.data : null;
}
