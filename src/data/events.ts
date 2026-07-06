import type { OrgEvent } from "../types";

/**
 * SAMPLE DATA — every event below is illustrative and labeled as such in the
 * UI. Replace with real event data once official org calendars are connected.
 */
export const events: OrgEvent[] = [
  {
    id: "gdg-info-session",
    title: "GDG on Campus: Info Session",
    orgShortName: "GDG on Campus HAU",
    date: "2026-08-28",
    venue: "SJH Auditorium",
    description:
      "Meet the core team, hear what's planned for the year, and find out how to join the campus developer community.",
    isSample: true,
  },
  {
    id: "cia-ctf-freshman",
    title: "Capture the Flag: Freshman Edition",
    orgShortName: "CIA",
    date: "2026-09-12",
    venue: "Computing Labs, PGN Building",
    description:
      "A beginner-friendly security challenge — crack ciphers, find hidden flags, and get a taste of ethical hacking.",
    isSample: true,
  },
  {
    id: "loop-algorithm-night",
    title: "Algorithm Night",
    orgShortName: "LOOP",
    date: "2026-09-19",
    venue: "PGN 3F Lecture Hall",
    description:
      "Three hours, ten problems, live leaderboard. Bring a laptop and your favorite language.",
    isSample: true,
  },
  {
    id: "maia-design-jam",
    title: "Design Jam: Multimedia Showcase",
    orgShortName: "MAIA",
    date: "2026-09-26",
    venue: "Multimedia Studio",
    description:
      "An open studio night — student work on the walls, live design challenges, and portfolio feedback.",
    isSample: true,
  },
];
