export interface Organization {
  id: string;
  name: string;
  /** Short handle used in chips, the AI mock, and event cards. */
  shortName: string;
  category: string;
  description: string;
  skills: string[];
  /**
   * True only when description/skills were confirmed against an official
   * source. Unverified orgs render a "Details need verification" badge —
   * never silently guessed content.
   */
  verified: boolean;
  /** Placeholder logo: initials on a brand-tinted tile until real assets arrive. */
  initials: string;
  /**
   * The org's official public source — its website or official social profile.
   * Used ONLY to auto-resolve the org's logo on the details page (see
   * lib/orgLogo). All other org data comes from this file, never fetched.
   * Optional: omit when no official source has been confirmed, and the org
   * falls back to the initials placeholder.
   */
  officialUrl?: string;
}

export interface OrgEvent {
  id: string;
  title: string;
  orgShortName: string;
  /** ISO date string, e.g. "2026-08-28" */
  date: string;
  venue: string;
  description: string;
  /** Sample events are labeled in the UI until official calendars are connected. */
  isSample: boolean;
}
