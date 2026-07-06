import { organizations } from "../../data/organizations";
import type { Organization } from "../../types";

/**
 * The advisor's brain — a transparent, rule-based matcher over the verified
 * org data. No API calls: intent tags are detected from the student's words,
 * each org carries weighted affinities per tag, and recommendations come out
 * scored with human-readable reasons. Swappable for a real LLM backend later
 * without touching the chat UI.
 */

export type Tag =
  | "hackathon"
  | "cyber"
  | "webdev"
  | "mobile"
  | "cloud"
  | "ai"
  | "uiux"
  | "competitive"
  | "leadership"
  | "creative"
  | "gamedev"
  | "robotics"
  | "programming"
  | "freshman"
  | "community"
  | "workshops"
  | "competitions"
  | "outreach"
  | "portfolio";

export interface Recommendation {
  org: Organization;
  score: number;
  reasons: string[];
}

export interface ChatMessage {
  id: number;
  role: "ai" | "user";
  text?: string;
  recommendations?: Recommendation[];
  /** Quick-reply chips attached to an AI message (shown while it's the latest). */
  chips?: string[];
}

/* ------------------------------------------------------------------ */
/* Tag detection                                                       */
/* ------------------------------------------------------------------ */

// Order matters: specific intents first so acknowledgements pick the most
// meaningful tag ("hackathon" must win over "hack…" → cyber, etc.).
const TAG_MATCHERS: [Tag, RegExp][] = [
  ["hackathon", /hackathon/i],
  ["cyber", /cyber|securit|infosec|ethical hack|pen ?test|\bctf\b|malware|phish/i],
  ["webdev", /\bweb\b|front[- ]?end|back[- ]?end|full[- ]?stack|website|html|css|javascript|typescript|react|node/i],
  ["mobile", /mobile|android|\bios\b|flutter|app dev/i],
  ["cloud", /cloud|aws|azure|gcp|devops/i],
  ["ai", /\ba\.?i\.?\b|artificial intelligence|machine learning|\bml\b|data scien|data analytic|deep learning/i],
  ["uiux", /\bui\b|\bux\b|user experience|user interface|figma|design/i],
  ["competitive", /competitive programming|algorithm|data structure|problem[- ]solving|leetcode|codeforces|icpc/i],
  ["creative", /creativ|multimedia|digital art|\bart\b|video|animation|graphic|photo|film|motion|illustration/i],
  ["gamedev", /\bgame/i],
  ["robotics", /robot|arduino|\biot\b|hardware|embedded/i],
  // NB: /organiz(e\b|ing)/ deliberately excludes "organization(s)" — that word
  // appears in nearly every question and says nothing about leadership intent.
  ["leadership", /leader|public speaking|speaking|speech|\bhost(ing)?\b|organiz(e\b|ing)|student government|\bcouncil\b|\bmanage/i],
  ["freshman", /freshman|freshmen|freshie|first[- ]?year|1st year|new student|beginner|just start/i],
  ["community", /friend|community|social|people|belong|network|meet/i],
  // Bare "develop" would fire on phrases like "develops leadership".
  ["programming", /programm|coding|\bcode\b|software|\bdeveloper\b|\bdev\b/i],
  ["workshops", /workshop|training|seminar|study jam|learn/i],
  ["competitions", /competition|compete|contest/i],
  ["outreach", /outreach|volunteer|service/i],
  ["portfolio", /portfolio|project/i],
];

/** Tags that describe WHAT the student is into (trigger the guided flow). */
const INTEREST_TAGS: ReadonlySet<Tag> = new Set([
  "hackathon", "cyber", "webdev", "mobile", "cloud", "ai", "uiux",
  "competitive", "creative", "gamedev", "robotics", "programming",
  "freshman", "community",
]);

export function detectTags(text: string): Tag[] {
  return TAG_MATCHERS.filter(([, re]) => re.test(text)).map(([tag]) => tag);
}

export function interestTags(tags: Tag[]): Tag[] {
  return tags.filter((t) => INTEREST_TAGS.has(t));
}

/* ------------------------------------------------------------------ */
/* Org affinity profiles: tag → [weight, reason shown on the card]     */
/* ------------------------------------------------------------------ */

const PROFILES: Record<string, Partial<Record<Tag, [number, string]>>> = {
  "gdg-on-campus-hau": {
    webdev: [32, "Runs hands-on web development workshops and study jams"],
    mobile: [30, "Builds Android and cross-platform apps in guided sessions"],
    cloud: [30, "Hosts Google Cloud study jams with real tooling"],
    ai: [26, "Explores AI/ML through codelabs and community projects"],
    hackathon: [30, "Regularly joins and hosts hackathons and build days"],
    uiux: [16, "Design sprints pair naturally with its dev workshops"],
    programming: [24, "Peer-to-peer coding sessions across all skill levels"],
    freshman: [22, "Open to every program and beginner-friendly by design"],
    community: [18, "A large, active community of student builders"],
    gamedev: [12, "Game jams show up in its build events"],
    robotics: [14, "Closest fit on campus — hardware appears in its tech talks"],
    workshops: [14, "Workshop-first culture — you build something every session"],
    competitions: [8, "Sends teams to national hackathons"],
    portfolio: [12, "Every event leaves you with something for your portfolio"],
    outreach: [8, "Runs community tech events beyond the campus"],
  },
  "soc-student-council": {
    leadership: [34, "The most direct path to real leadership experience"],
    community: [20, "Represents and connects every SoC student"],
    freshman: [12, "The fastest way to understand how the school works"],
    outreach: [16, "Organizes school-wide programs and outreach"],
    workshops: [6, "Coordinates events across every org"],
  },
  "code-geeks": {
    programming: [28, "A community built around the craft of programming"],
    webdev: [16, "Practical software projects beyond the classroom"],
    freshman: [18, "A friendly place to level up from fundamentals"],
    community: [14, "A tight-knit circle of programmers"],
    workshops: [12, "Peer learning sessions in a smaller group"],
    hackathon: [10, "Forms project teams for coding events"],
    portfolio: [10, "Project work you can point to later"],
  },
  "cybersecurity-intelligence-alliance": {
    cyber: [38, "The home of cybersecurity on campus — CTFs, defense, research"],
    competitions: [16, "Capture-the-flag events through the year"],
    competitive: [10, "CTFs train the same problem-solving muscle"],
    programming: [8, "Security tooling keeps your scripting sharp"],
    workshops: [10, "Security workshops from fundamentals up"],
  },
  "league-of-outstanding-programmers": {
    competitive: [36, "Trains specifically for programming contests"],
    programming: [20, "Deliberate practice in algorithms and data structures"],
    competitions: [18, "Timed contests with live leaderboards"],
    hackathon: [8, "Contest stamina transfers straight to hackathons"],
    freshman: [8, "Starts from fundamentals if you're willing to grind"],
  },
  "multimedia-aficionados": {
    creative: [36, "The org for digital art, motion, and multimedia"],
    uiux: [24, "Visual design skills that transfer straight to UI work"],
    gamedev: [18, "Game art and multimedia production overlap heavily"],
    portfolio: [16, "Portfolio-driven — you make things worth showing"],
    community: [10, "A creative circle inside a technical school"],
    workshops: [10, "Hands-on creative workshops"],
    freshman: [8, "No experience needed — just the itch to make things"],
  },
};

const MIN_AFFINITY = 12; // below this an org simply isn't a real match
const MAX_RESULTS = 3;
const MAX_REASONS = 4;

/**
 * Map raw affinity to a 0–96 "compatibility" curve. Asymptotic, so strong
 * multi-tag matches land in the low-to-mid 90s without two orgs pinning at
 * an identical cap: 96 − 41·e^(−affinity/30).
 */
function toScore(affinity: number): number {
  return Math.round(96 - 41 * Math.exp(-affinity / 30));
}

export function buildRecommendations(tags: Tag[]): Recommendation[] {
  const unique = [...new Set(tags)];
  return organizations
    .map((org) => {
      const profile = PROFILES[org.id] ?? {};
      let affinity = 0;
      const reasons: string[] = [];
      for (const tag of unique) {
        const entry = profile[tag];
        if (!entry) continue;
        affinity += entry[0];
        if (reasons.length < MAX_REASONS) reasons.push(entry[1]);
      }
      return { org, score: toScore(affinity), reasons, affinity };
    })
    .filter((r) => r.affinity >= MIN_AFFINITY)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ org, score, reasons }) => ({ org, score, reasons }));
}

/* ------------------------------------------------------------------ */
/* Conversation copy                                                   */
/* ------------------------------------------------------------------ */

export const GREETING_TEXT =
  "👋 Hi! I'm your OrgConnect AI Advisor.\n\n" +
  "I can help you discover the best School of Computing organizations based on your interests, skills, and career goals.\n\n" +
  "Choose a question below or ask me anything.";

export const STARTER_CHIPS = [
  "💻 Which organization fits Web Development?",
  "🎨 I want to improve my UI/UX skills.",
  "🚀 I want to join Hackathons.",
  "👨‍💼 Which organization develops leadership?",
  "🤖 I'm interested in Artificial Intelligence.",
  "📱 Which organization should freshmen join?",
  "🎤 I want to improve my public speaking.",
  "📸 Which organization is best for creatives?",
];

export const EXPERIENCE_QUESTION = "What kind of experience are you looking for?";

export const EXPERIENCE_CHIPS = [
  "Workshops",
  "Competitions",
  "Leadership",
  "Community Outreach",
  "Portfolio Projects",
];

export const AREA_CHIPS = [
  "Web Development",
  "Cybersecurity",
  "UI/UX",
  "AI & Data",
  "Creative & Multimedia",
  "Leadership",
];

export const FOLLOW_UP_CHIPS = [
  "🎨 What about creative work?",
  "👨‍💼 How about leadership?",
  "📱 Best org for freshmen?",
];

const ACKS: Partial<Record<Tag, string>> = {
  webdev: "Web development — great choice. There's real momentum for builders here.",
  mobile: "Mobile dev — nice. Shipping an app is one of the best portfolio moves.",
  cloud: "Cloud — smart direction. That skill set is in demand everywhere.",
  ai: "AI — exciting space, and there's a clear home for it on campus.",
  cyber: "Cybersecurity — one of the strongest specialist paths in the school.",
  hackathon: "Hackathons — the fastest way to grow. Love it.",
  uiux: "A design eye plus code is a powerful combo here.",
  competitive: "Competitive programming — respect. That grind pays off in interviews.",
  creative: "A creative in a computing school — you have more options than you think.",
  gamedev: "Games — where code and art meet. Two orgs cover that overlap.",
  robotics:
    "Full honesty: none of the six SoC orgs specializes in robotics. But here's the closest home for a hardware tinkerer.",
  leadership: "Leadership experience — there's one org built exactly for that.",
  programming: "A coder at heart — you'll have several good homes here.",
  freshman: "First year is exactly the right time to look around.",
  community: "Finding your people — honestly the best reason to join an org.",
};

export function acknowledgementFor(tags: Tag[]): string {
  for (const tag of tags) {
    const ack = ACKS[tag];
    if (ack) return ack;
  }
  return "Got it — let's find where that fits.";
}

export const RECOMMEND_INTRO =
  "Based on what you told me, here's where you'd fit best in the School of Computing:";

export const FALLBACK_TEXT =
  "I want to get this right — tell me a bit more about what you enjoy, or pick an area below:";

export const GREETING_REPLY =
  "Hey! 👋 Tell me what you're into — coding, design, security, competitions, leadership — and I'll point you to the right orgs.";

export const THANKS_REPLY =
  "Anytime! If you want, explore the full organization list below — or ask me about a different interest.";

export const GREET_RE = /^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|kumusta|musta)\b/i;
export const THANKS_RE = /thank|salamat|\bthx\b|^\s*ty\s*$/i;
