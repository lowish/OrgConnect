import type { Student } from "../schemas/student";

/**
 * EXAMPLE DATA — the single profile shown until the live Google Sheet is
 * connected (see google-apps-script/README.md), or as a graceful fallback if
 * the endpoint can't be reached. Once the form is wired up, submissions replace
 * this and appear automatically on refresh.
 *
 * This example is a real profile (no "sample" badge). Personalize the course /
 * year / intro / interests below — those are placeholders you can edit.
 */
export const sampleStudents: Student[] = [
  {
    id: "prince-william-tan",
    name: "Prince William Tan",
    course: "BS Computer Science",
    yearLevel: "4th Year",
    intro:
      "Web developer who likes shipping clean, fast, well-crafted interfaces. Building things at lowish.vercel.app.",
    interests: ["Web Development", "React", "TypeScript", "UI/UX"],
    lookingFor: ["Collaborators", "Open-source projects"],
    portfolio: "https://lowish.vercel.app/",
    github: "https://github.com/lowish",
    linkedin: "https://www.linkedin.com/in/pwtandev/",
    consent: true,
  },
];
