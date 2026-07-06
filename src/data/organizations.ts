import type { Organization } from "../types";

/**
 * DATA PROVENANCE — read before editing.
 *
 * Organization names and official Facebook pages were verified on 2026-07-05
 * against each page's og:title. `officialUrl` points at the org's official
 * Facebook page; the LOGO is auto-fetched from it at runtime (see lib/orgLogo).
 *
 * Descriptions and skills below are NOT fetched — a Facebook page's About text
 * is behind a login wall and can't be scraped from a static frontend. They live
 * here in our database, governed by the `verified` flag:
 *   verified: true  → description and skills confirmed from official sources.
 *   verified: false → the org NAME + page are real, but descriptions/skills are
 *                     conservative inferences from the org's stated focus and
 *                     must be confirmed with the org (UI shows a badge).
 *
 * To promote a `verified: false` org: paste its official About/offerings text
 * from Facebook, replace the inferred copy, and flip the flag.
 */
export const organizations: Organization[] = [
  {
    id: "gdg-on-campus-hau",
    name: "GDG on Campus — Holy Angel University",
    shortName: "GDG on Campus HAU",
    category: "Developer Community",
    description:
      "The Google-supported developer community on campus. Students of any program build real projects together through workshops, study jams, and collaborative events.",
    skills: ["Web Development", "Mobile Development", "Cloud", "AI / ML"],
    verified: true,
    initials: "GDG",
    officialUrl: "https://www.facebook.com/gdsc.hau",
  },
  {
    id: "soc-student-council",
    name: "School of Computing Student Council",
    shortName: "SoC Student Council",
    category: "Student Government",
    description:
      "The highest governing student body of the School of Computing — representing students, organizing school-wide initiatives, and connecting orgs together.",
    skills: ["Leadership", "Event Management", "Public Speaking", "Community Building"],
    verified: true,
    initials: "SC",
    officialUrl: "https://www.facebook.com/haucscsoc",
  },
  {
    id: "code-geeks",
    name: "Code Geeks",
    shortName: "Code Geeks",
    category: "Programming",
    description:
      "A programming-focused community for students who want to sharpen their craft beyond the classroom — from fundamentals to building things that ship.",
    skills: ["Programming", "Software Development", "Collaboration"],
    verified: false,
    initials: "CG",
    officialUrl: "https://www.facebook.com/TheCodeGeeks",
  },
  {
    id: "cybersecurity-intelligence-alliance",
    name: "Cybersecurity Intelligence Alliance",
    shortName: "CIA",
    category: "Cybersecurity",
    description:
      "The home for students drawn to the defensive and offensive sides of security — think capture-the-flag competitions, threat analysis, and security research.",
    skills: ["Cybersecurity", "CTF Competitions", "Network Defense", "Ethical Hacking"],
    verified: false,
    initials: "CIA",
    officialUrl: "https://www.facebook.com/csia.hausoc",
  },
  {
    id: "league-of-outstanding-programmers",
    name: "League of Outstanding Programmers",
    shortName: "LOOP",
    category: "Competitive Programming",
    description:
      "Where problem solvers train. Algorithmic thinking, timed contests, and the kind of pattern recognition that makes technical interviews feel easy.",
    skills: ["Algorithms", "Data Structures", "Competitive Programming", "Problem Solving"],
    verified: false,
    initials: "LP",
    officialUrl: "https://www.facebook.com/hausoc.loop",
  },
  {
    id: "multimedia-aficionados",
    name: "Multimedia Aficionados For Interested Artists",
    shortName: "MAFIA",
    category: "Multimedia & Design",
    description:
      "For the visually inclined — digital art, motion, and multimedia production for students who express computing through creative work.",
    skills: ["Digital Art", "Multimedia Production", "Visual Design", "Motion Graphics"],
    verified: false,
    initials: "MA",
    officialUrl: "https://www.facebook.com/mafia.org.hau",
  },
  {
    id: "aws-student-builder-group",
    name: "AWS Student Builder Group — Holy Angel University",
    shortName: "AWS SBG HAU",
    category: "Cloud Community",
    description:
      "An AWS-supported student community for cloud computing — hands-on with AWS services, cloud projects, and paths toward AWS certifications.",
    skills: ["Cloud Computing", "AWS", "Serverless", "DevOps"],
    verified: false,
    initials: "AWS",
    officialUrl: "https://www.facebook.com/awssbghau",
  },
  {
    id: "the-access-point",
    name: "The Access Point",
    shortName: "The Access Point",
    category: "Student Organization",
    // Official name + page confirmed; the org's focus and offerings are pending
    // confirmation from its official channels — intentionally not guessed here.
    description:
      "An official School of Computing student organization. Its focus and what it offers students are pending confirmation from the org's official channels.",
    skills: [],
    verified: false,
    initials: "AP",
    officialUrl: "https://www.facebook.com/theaccesspointhau",
  },
];
