import { z } from "zod";

/**
 * Organization schema for the details page.
 *
 * This is the single source of truth for everything the details page renders:
 * no component hardcodes display content. Parse untrusted input with
 * `parseOrganization`; author known-good data with the inferred `Organization`
 * type and let the compiler enforce the shape.
 *
 * Optionality follows one rule: any field whose absence should make its section
 * disappear is optional (or a possibly-empty array). The page never renders an
 * empty shell, so the schema lets whole blocks be omitted cleanly.
 */

/** A 3 or 6 digit hex color, e.g. "#34d399". Drives each org's accent. */
const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color like #34d399");

const skillLevel = z.enum([
  "Beginner friendly",
  "Some experience",
  "Advanced",
]);

export const quickFactsSchema = z.object({
  members: z.number().int().positive().optional(),
  eventsPerSemester: z.number().int().nonnegative().optional(),
  cadence: z.string().min(1),
  skillLevel,
});

export const socialSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  /** Key into the social icon registry (see components/org-detail/SocialIcon). */
  icon: z.string().min(1),
});

export const officerSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photoUrl: z.string().url().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1),
  /** ISO date string, e.g. "2026-08-28". */
  date: z.string().min(1),
  description: z.string().min(1),
});

export const pastEventSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
});

export const howToJoinSchema = z.object({
  steps: z.array(z.string().min(1)).min(1),
  recruitmentPeriod: z.string().min(1).optional(),
});

export const organizationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  /** Accent hex, ideally sampled from the logo. Themes markers and active tags. */
  accentColor: hexColor,
  logoUrl: z.string().url(),
  verified: z.boolean(),
  tagline: z.string().min(1).optional(),

  // Identity zone.
  about: z.string().min(1),
  goal: z.string().min(1).optional(),
  mission: z.string().min(1).optional(),

  // Fit zone.
  quickFacts: quickFactsSchema.optional(),
  offers: z.array(z.string().min(1)).default([]),
  /** Renders as clickable tags routing to /browse?skill=<tag>. */
  skills: z.array(z.string().min(1)).default([]),
  gains: z.array(z.string().min(1)).default([]),
  /** The "Is this you?" list. */
  fitStatements: z.array(z.string().min(1)).default([]),

  // Action zone.
  howToJoin: howToJoinSchema.optional(),
  officers: z.array(officerSchema).optional(),
  pastEvents: z.array(pastEventSchema).optional(),
  upcomingEvents: z.array(eventSchema).optional(),
  socials: z.array(socialSchema).default([]),
});

export type Organization = z.infer<typeof organizationSchema>;
export type QuickFacts = z.infer<typeof quickFactsSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Officer = z.infer<typeof officerSchema>;
export type OrgEventItem = z.infer<typeof eventSchema>;
export type PastEventItem = z.infer<typeof pastEventSchema>;
export type SkillLevel = z.infer<typeof skillLevel>;

/** Parse and validate unknown input into an Organization (throws on invalid). */
export function parseOrganization(input: unknown): Organization {
  return organizationSchema.parse(input);
}

/** Non-throwing variant for boundary validation. */
export function safeParseOrganization(input: unknown) {
  return organizationSchema.safeParse(input);
}
