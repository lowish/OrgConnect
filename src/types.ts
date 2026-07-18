export interface Organization {
  id: string;
  name: string;
  /** Short handle used in chips, the AI mock, and event cards. */
  shortName: string;
  category: string;
  description: string;
  skills: string[];
  /**
   * The official knowledge base's goal statement, stored imperatively ("Build a
   * community of…") so the advisor can compose it into a sentence. Absent only
   * when the org's focus is still unconfirmed.
   */
  goal?: string;
  mission?: string;
  /**
   * "What the organization offers", verbatim from the knowledge base. This is
   * the ONLY list the advisor may draw activities from — it must never name a
   * workshop, event, or technology that doesn't appear here.
   */
  offers?: string[];
  /** "Best suited for students who…", verbatim. Drives the why-it-fits sentence. */
  bestFor?: string[];
  /**
   * "What you'll gain" — short outcome summaries shown on the details page.
   * UI-only and grounded in the org's stated goal/offers; NOT an advisor source
   * (the advisor still draws activities only from `offers`).
   */
  gains?: string[];
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
  /**
   * The org's own website, when it has one beyond its official social page.
   * Shown as a primary link on the details page and in "Contact us".
   */
  website?: string;
}

export interface OrgEvent {
  id: string;
  title: string;
  orgShortName: string;
  /** ISO date string, e.g. "2026-08-28" */
  date: string;
  description: string;
  /** Sample events are labeled in the UI until official calendars are connected. */
  isSample: boolean;
}
