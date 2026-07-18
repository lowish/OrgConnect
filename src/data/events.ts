import type { OrgEvent } from "../types";

/**
 * ARCHIVED EVENT DATA — these entries represent older org activities that the
 * UI can show without implying a future calendar or live event prediction.
 */
export const events: OrgEvent[] = [
  {
    id: "gdg-info-session",
    title: "AI Conference",
    orgShortName: "GDG on Campus HAU",
    date: "2025-08-28",
    description:
      "The 1st Regional AI Conference, 'Reinventing Learning Through AI,' brought together students and developers for the AI Hack, Tech Talk, speakers, and a shared focus on career readiness and AI innovation.",
    isSample: false,
  },
  {
    id: "soc-leadership-forum",
    title: "Tech Talk",
    orgShortName: "SoC Student Council",
    date: "2025-11-21",
    description:
      "Cultivating Career Readiness Among Foxes Through Dialogue and Technology Roadmap. This Tech Talk focuses on career readiness, technology pathways, and industry expectations.",
    isSample: false,
  },
  {
    id: "code-geeks-byteback",
    title: "ByteBack",
    orgShortName: "Code Geeks",
    date: "2025-09-08",
    description:
      "An HTML and CSS competition that challenged participants to build, style, and present polished web pages.",
    isSample: false,
  },
  {
    id: "cia-ctf-freshman",
    title: "Capture the Flag",
    orgShortName: "CIA",
    date: "2025-09-12",
    description:
      "A beginner-friendly security challenge — crack ciphers, find hidden flags, and get a taste of ethical hacking.",
    isSample: false,
  },
  {
    id: "loop-algorithm-night",
    title: "Code-To-Death: Alpha Sapphire Version",
    orgShortName: "LOOP",
    date: "2025-09-19",
    description:
      "A Pokémon-inspired coding battle with fun and challenging tasks that test coding speed and problem-solving skills.",
    isSample: false,
  },
  {
    id: "aws-howsome-serverless-workshop",
    title: "How AWSome works?",
    orgShortName: "AWS SBG HAU",
    date: "2025-08-23",
    description:
      "A serverless workshop covering API Gateway, AWS Lambda, DynamoDB, S3, and CloudWatch for School of Computing students.",
    isSample: false,
  },
  {
    id: "mafia-emc-short-animations",
    title: "MAFIA presents EMC Seniors' Short Animations",
    orgShortName: "MAFIA",
    date: "2025-04-26",
    description:
      "Annual animated film viewing featuring the outputs of BS Entertainment Multimedia Computing seniors.",
    isSample: false,
  },
  {
    id: "access-point-editorial-workshop",
    title: "Editorial Workshop",
    orgShortName: "The Access Point",
    date: "2025-09-30",
    description:
      "A writing and editing session for student journalists covering news, opinion, feature, and literary pieces.",
    isSample: false,
  },
];
