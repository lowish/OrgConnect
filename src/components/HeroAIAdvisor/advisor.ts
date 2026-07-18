import { organizations } from "../../data/organizations";
import type { Organization } from "../../types";

/**
 * The advisor's brain — a transparent, rule-based adviser over the official
 * organization knowledge base. No API calls.
 *
 * Four layers, in order:
 *   1. understand()  — text → signals, negations, goal, vagueness
 *   2. intent        — one org? two orgs to compare? the roster? unsure?
 *   3. rank()        — signals → scored orgs, evidence drawn from real data
 *   4. compose()     — the above → one or two short paragraphs
 *
 * Three rules the whole file is built around:
 *   - Answer only from organizations.ts. Every activity, technology, and
 *     benefit named in a reply must appear in that org's `offers`. No org lists
 *     hackathons, game development, or robotics — the advisor says so instead of
 *     implying otherwise (see gapFor).
 *   - Orgs marked `verified: false` are "Needs Verification" in the knowledge
 *     base. Any reply naming one says its details await official confirmation.
 *   - Never say the same thing twice. Phrasing is dealt from Cyclers that
 *     exhaust a pool before repeating.
 *
 * Session state (accumulated interests, spent phrasings) lives in the object
 * returned by createAdvisor(). Everything below it is pure.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

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

/** What the student is ultimately after — nudges the wording, not the ranking. */
export type Goal = "career" | "skill" | "belonging" | "explore" | null;

/** One detected interest, carrying the student's own words along with it. */
export interface Signal {
  tag: Tag;
  /** Canonical name of the topic, e.g. "web development". */
  label: string;
  /** The literal phrase the student typed, e.g. "creating websites". */
  phrase: string;
  /** True when its clause negated it ("I don't like design"). */
  negated: boolean;
}

export interface Understanding {
  signals: Signal[];
  /** Positive signals for topics — what they're into. */
  interests: Signal[];
  /** Positive signals for formats — workshops, portfolio projects. */
  experiences: Signal[];
  /** Topics they explicitly ruled out. */
  rejected: Signal[];
  goal: Goal;
  isGreeting: boolean;
  isThanks: boolean;
  /** No topic to work with — ask one question, don't guess. */
  isVague: boolean;
}

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

/** An AI reply, before useChat assigns it an id and a typing delay. */
export type Reply = Omit<ChatMessage, "id" | "role"> & { delay?: number };

/* ------------------------------------------------------------------ */
/* Layer 1 — Understanding the message                                 */
/* ------------------------------------------------------------------ */

interface Matcher {
  tag: Tag;
  label: string;
  re: RegExp;
}

/**
 * Order matters: specific intents first, so "hackathon" isn't swallowed by a
 * looser pattern and "organization" never reads as leadership intent.
 *
 * Word boundaries are load-bearing throughout: without them "unity" matches
 * com·munity, "motion" matches e·motion, and "react" matches react·ion.
 */
const LEXICON: Matcher[] = [
  { tag: "hackathon", label: "hackathons", re: /hackathons?|hack ?(?:days?|nights?)/i },
  {
    tag: "cyber",
    label: "cybersecurity",
    re: /cyber ?securit\w*|cybersec|infosec|securit\w*|ethical hack\w*|pen ?test\w*|\bctf\b|malware|phish\w*|red team|blue team|forensics?|cryptograph\w*|threat analysis/i,
  },
  {
    tag: "webdev",
    label: "web development",
    re: /\bweb\b|front[- ]?end|back[- ]?end|full[- ]?stack|websites?|html|css|javascript|typescript|\breact\b|\bnode\b/i,
  },
  { tag: "mobile", label: "mobile development", re: /mobile|android|\bios\b|flutter|app dev\w*/i },
  {
    tag: "cloud",
    label: "cloud computing",
    re: /cloud|\baws\b|azure|\bgcp\b|devops|serverless|kubernetes|docker|infrastructure/i,
  },
  {
    tag: "ai",
    label: "AI and machine learning",
    re: /\ba\.?i\.?\b|artificial intelligence|machine learning|\bml\b|data scien\w*|data analytic\w*|deep learning|neural net\w*|\bllms?\b/i,
  },
  {
    tag: "uiux",
    label: "UI/UX design",
    re: /\bui\b|\bux\b|user experience|user interfaces?|\binterfaces?\b|figma|wireframe\w*|prototyp\w*|design\w*/i,
  },
  {
    tag: "competitive",
    label: "competitive programming",
    re: /competitive programming|algorithms?|data structures?|problem[- ]solving|leetcode|codeforces|\bicpc\b|hackerrank|logical thinking/i,
  },
  {
    tag: "creative",
    label: "creative and multimedia work",
    re: /creativ\w*|multimedia|digital art\w*|\bart\b|videos?|animation|graphics?|photo\w*|film\w*|\bmotion\b|illustration|editing|visual storytelling/i,
  },
  {
    tag: "gamedev",
    label: "game development",
    re: /\bgames?\b|game ?dev\w*|game ?jams?|\bunity\b|\bgodot\b|\bunreal\b/i,
  },
  {
    tag: "robotics",
    label: "robotics and hardware",
    re: /robot\w*|arduino|\biot\b|hardware|embedded|raspberry ?pi|microcontroller/i,
  },
  // /organiz(e\b|ing)/ deliberately excludes "organization(s)" — that word shows
  // up in nearly every question here and says nothing about leadership intent.
  {
    tag: "leadership",
    label: "leadership",
    re: /\blead\w*|public speaking|speaking|speech\w*|\bhost(?:ing)?\b|organiz(?:e\b|ing)|student government|\bcouncil\b|\bmanag\w*|represent\w*|communication/i,
  },
  {
    tag: "freshman",
    label: "starting out",
    re: /freshm[ae]n|freshie|first[- ]?year|1st year|new student|beginner|newbie|just start\w*|no experience/i,
  },
  {
    tag: "community",
    label: "finding a community",
    re: /friends?|communit\w*|social\w*|people|belong\w*|network\w*|meet\b|collaborat\w*/i,
  },
  // Bare "develop" would fire on phrases like "develops leadership".
  {
    tag: "programming",
    label: "programming",
    re: /programm\w*|coding|\bcode\b|software|\bdevelopers?\b|\bdev\b|python|\bjava\b|\bc\+\+/i,
  },
  {
    tag: "workshops",
    label: "workshops",
    re: /workshops?|trainings?|seminars?|study jams?|hands[- ]on|learn\w*/i,
  },
  { tag: "competitions", label: "competitions", re: /competitions?|compet\w*|contests?|tournaments?/i },
  { tag: "outreach", label: "community outreach", re: /outreach|volunteer\w*|service|advocacy|give back|engagement/i },
  { tag: "portfolio", label: "portfolio projects", re: /portfolios?|projects?|build something|ship\w*/i },
];

const BY_TAG = new Map(LEXICON.map((m) => [m.tag, m]));
const labelFor = (tag: Tag): string => BY_TAG.get(tag)?.label ?? tag;

/**
 * Tags describing WHAT they're into. One of these means we can recommend.
 *
 * `freshman` is deliberately absent: no org in the knowledge base describes
 * itself as beginner-friendly, so "I'm a freshman" is a fact about the student,
 * not a match against any org. It routes to a clarifying question instead.
 */
const INTEREST_TAGS: ReadonlySet<Tag> = new Set([
  "hackathon", "cyber", "webdev", "mobile", "cloud", "ai", "uiux",
  "competitive", "creative", "gamedev", "robotics", "programming",
  "community", "leadership", "competitions", "outreach",
]);

/** Tags describing the FORMAT they want. Useful, never sufficient alone. */
const EXPERIENCE_TAGS: ReadonlySet<Tag> = new Set(["workshops", "portfolio"]);

// `n['’]t\b` catches the contraction in "don't" / "isn't", where a leading \b
// can't exist. Written as one alternation so the match index stays meaningful.
const NEGATOR_RE =
  /\b(?:not|no|never|hate[sd]?|dislikes?|avoid(?:ing)?|without|rather not|less into)\b|n['’]t\b/i;

const CLAUSE_SPLIT_RE = /[.,;!?]|\bbut\b|\balthough\b|\bthough\b|\bhowever\b|\bwhile\b/i;

/** Verbs that, sitting right before a match, are part of how they said it. */
const LEAD_VERB_RE =
  /(?:designing|creating|building|making|learning|studying|practicing|writing|coding|developing|exploring|doing|joining)\s+$/i;

/** Nouns that, sitting right after a match, complete the phrase. */
const TRAIL_NOUN_RE =
  /^\s+(?:development|dev|design|programming|security|engineering|computing|science|work|interfaces?|websites?|apps?|systems?|games?|graphics?|people|events?|projects?)\b/i;

const VAGUE_RE =
  /don'?t know|do ?not know|not sure|unsure|no idea|help me (?:choose|decide|pick|find)|which (?:one|org|organization)|any (?:suggestions?|recommendations?|ideas?)|confus\w*|undecided|i'?m lost|where do i (?:start|begin)|what should i (?:join|do|take)|where (?:do )?i fit/i;

const CAREER_RE =
  /careers?|jobs?|industry|professional\w*|internships?|intern\b|employ\w*|work (?:as|in)|become an?\b|hired|hiring|r[eé]sum[eé]|interviews?|land a|full[- ]?time|engineers?\b/i;
const SKILL_RE =
  /learn\w*|improve\w*|get better|sharpen\w*|skills?|stud(?:y|ying)|practice|master\w*|\bgrow\b|develop my/i;
const BELONG_RE = /friends?|communit\w*|belong\w*|meet people|social\w*|network\w*|alone|lonely/i;

export const GREET_RE = /^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|kumusta|musta)\b/i;
export const THANKS_RE = /thank|salamat|\bthx\b|^\s*ty\s*$/i;

/**
 * Widen a raw regex hit to the phrase the student actually wrote, so we quote
 * them rather than quoting our own lexicon: "web" → "web development",
 * "designing" → "designing interfaces".
 */
function capturePhrase(clause: string, start: number, end: number): string {
  let from = start;
  let to = end;

  const before = clause.slice(0, start);
  const lead = LEAD_VERB_RE.exec(before);
  if (lead) from = before.length - lead[0].length;

  const trail = TRAIL_NOUN_RE.exec(clause.slice(end));
  if (trail) to = end + trail[0].length;

  // Casing is the student's, not ours — so "AWS" is quoted back as "AWS".
  return clause.slice(from, to).trim();
}

/**
 * Read one message. Clause-scoped, so negation stays local: in "I love security
 * but I don't like design", only `uiux` is rejected.
 */
export function understand(text: string): Understanding {
  const signals: Signal[] = [];
  const seen = new Set<Tag>();

  for (const clause of text.split(CLAUSE_SPLIT_RE)) {
    if (!clause.trim()) continue;
    const negator = NEGATOR_RE.exec(clause);

    for (const { tag, label, re } of LEXICON) {
      if (seen.has(tag)) continue;
      const hit = re.exec(clause);
      if (!hit) continue;
      seen.add(tag);
      signals.push({
        tag,
        label,
        phrase: capturePhrase(clause, hit.index, hit.index + hit[0].length),
        // A negator only negates what follows it, so "no experience" reads as
        // a freshman signal rather than a rejection of experience.
        negated: negator !== null && negator.index < hit.index,
      });
    }
  }

  const positive = signals.filter((s) => !s.negated);
  const interests = positive.filter((s) => INTEREST_TAGS.has(s.tag));
  const experiences = positive.filter((s) => EXPERIENCE_TAGS.has(s.tag));
  const rejected = signals.filter((s) => s.negated);

  const isGreeting = GREET_RE.test(text);
  const isThanks = THANKS_RE.test(text);

  let goal: Goal = null;
  if (CAREER_RE.test(text)) goal = "career";
  else if (BELONG_RE.test(text)) goal = "belonging";
  else if (SKILL_RE.test(text)) goal = "skill";
  else if (VAGUE_RE.test(text)) goal = "explore";

  return {
    signals,
    interests,
    experiences,
    rejected,
    goal,
    isGreeting,
    isThanks,
    isVague: interests.length === 0 && !isGreeting && !isThanks,
  };
}

/* ------------------------------------------------------------------ */
/* Layer 2 — Intent: one org, two orgs, or the roster?                 */
/* ------------------------------------------------------------------ */

/**
 * Aliases per org.
 *
 * `strict` names an org and nothing else — seeing it always means the student
 * is asking about that org. `loose` is a word that only sometimes means the
 * org: "AWS" is usually a technology, "loop" is usually a control structure,
 * "CIA" is usually an agency. Those need question framing to count, otherwise
 * "I want to learn AWS" would be answered as an org profile instead of the
 * recommendation request it plainly is.
 */
interface OrgAlias {
  id: string;
  strict?: RegExp;
  loose?: RegExp;
}

const ORG_ALIASES: OrgAlias[] = [
  {
    id: "gdg-on-campus-hau",
    // GDSC is the org's former name. Accepted on the way in; never used on the
    // way out, because the knowledge base calls it GDG on Campus HAU.
    strict: /\bgdgs?\b|\bgdscs?\b|google developer (?:student )?(?:group|club)/i,
  },
  { id: "soc-student-council", strict: /\b(?:soc )?student council\b/i, loose: /\bcouncil\b/i },
  { id: "code-geeks", strict: /\bcode ?geeks\b/i },
  {
    id: "cybersecurity-intelligence-alliance",
    strict: /cybersecurity intelligence alliance/i,
    loose: /\bcia\b/i,
  },
  {
    id: "league-of-outstanding-programmers",
    strict: /league of outstanding programmers/i,
    loose: /\bloop\b/i,
  },
  { id: "multimedia-aficionados", strict: /\bmafia\b|multimedia aficionados/i },
  { id: "aws-student-builder-group", strict: /\baws sbg\b|aws student builder/i, loose: /\baws\b/i },
  { id: "the-access-point", strict: /\bthe access point\b/i, loose: /\baccess point\b/i },
];

/** Framing that turns a loose alias into a question about the org itself. */
const ORG_QUESTION_RE =
  /\?|tell me about|what (?:does|do|is|are|can)|who (?:is|are)|\boffers?\b|\bworth joining\b|good (?:for|choice)|more about|about the|\bcompare\b|\bvs\.?\b|\bversus\b|difference between/i;

/** "What orgs are there?" wants the roster, not a clarifying question. */
const ORG_NOUN = String.raw`(?:orgs?|organizations?|clubs?)`;
const ROSTER_RE = new RegExp(
  [
    String.raw`\b(?:list|show me|name|give me)\s+(?:all\s+|the\s+)*${ORG_NOUN}\b`,
    String.raw`\b${ORG_NOUN}\s+(?:are there|exist|are available|do (?:you|we) have)\b`,
    String.raw`\bwhat(?:'s|s|\s+is|\s+are)?\s+(?:all\s+)?(?:the\s+)?${ORG_NOUN}\b`,
    String.raw`\ball (?:of )?(?:the )?${ORG_NOUN}\b`,
  ].join("|"),
  "i",
);

const orgById = new Map(organizations.map((o) => [o.id, o]));

/** Every org this message names, in the order they appear. */
function detectOrgs(text: string): Organization[] {
  const framed = ORG_QUESTION_RE.test(text);
  const hits: { org: Organization; at: number }[] = [];

  for (const alias of ORG_ALIASES) {
    const org = orgById.get(alias.id);
    if (!org) continue;
    const hit = alias.strict?.exec(text) ?? (framed ? alias.loose?.exec(text) : null);
    if (hit) hits.push({ org, at: hit.index });
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.org);
}

/* ------------------------------------------------------------------ */
/* Layer 3 — Org knowledge and ranking                                 */
/* ------------------------------------------------------------------ */

/**
 * tag → [affinity weight, the evidence line shown on the recommendation card].
 *
 * Every string here paraphrases entries from that org's `offers` list in
 * organizations.ts. Nothing else is admissible. Weights order the ranking; the
 * string is what a student reads, and the two are independent — an org can be
 * the best available answer while the honest sentence says "closest listed
 * offering", not "specializes in".
 *
 * Absences are deliberate. GDG has no design offering, so it earns no `uiux`
 * weight. AWS lists no AI. MAFIA lists no game art. Adding a weight here
 * without a matching `offers` entry is how this advisor starts lying.
 */
const PROFILES: Record<string, Partial<Record<Tag, [number, string]>>> = {
  "gdg-on-campus-hau": {
    webdev: [32, "Web Development learning through hands-on workshops and study jams"],
    mobile: [30, "Mobile Development learning in collaborative software projects"],
    ai: [26, "Artificial Intelligence and Machine Learning fundamentals"],
    programming: [24, "For students who enjoy programming and building real-world applications"],
    cloud: [22, "Cloud Computing exposure through Google's developer ecosystem"],
    community: [18, "Networking with fellow student developers"],
    workshops: [16, "Hands-on workshops and Study Jams"],
    portfolio: [14, "Collaborative software projects and real-world applications"],
    // Below WEAK_SPECIALIST on purpose: GDG lists neither hackathons, games,
    // nor hardware. These weights make it the nearest answer, and gapFor()
    // forces the reply to admit the gap first.
    hackathon: [18, "Collaborative software projects and technical community events"],
    gamedev: [10, "Collaborative software projects"],
    robotics: [10, "Software projects, though no listed offering covers hardware"],
  },
  "soc-student-council": {
    leadership: [34, "Leadership opportunities, public speaking, and project management"],
    outreach: [22, "Community engagement and student representation"],
    community: [20, "Team collaboration and community engagement"],
  },
  "code-geeks": {
    programming: [30, "Programming practice, software development experience, and real projects"],
    community: [14, "Coding collaboration and peer learning"],
    workshops: [12, "Peer learning and technical skill development"],
    portfolio: [12, "Real programming projects"],
  },
  "cybersecurity-intelligence-alliance": {
    cyber: [38, "Cybersecurity learning, network defense, ethical hacking, and threat analysis"],
    competitions: [18, "Capture The Flag (CTF) competitions"],
  },
  "league-of-outstanding-programmers": {
    competitive: [36, "Competitive programming, algorithm training, and data structures practice"],
    competitions: [20, "Programming contests"],
    programming: [18, "Problem-solving exercises and algorithm training"],
  },
  "multimedia-aficionados": {
    creative: [36, "Digital art, multimedia production, and motion graphics"],
    // Comma, not an em dash: this line gets spliced into dash-joined templates.
    uiux: [24, "Visual design and digital art, the closest listed skills to UI/UX"],
    portfolio: [14, "Multimedia production and creative projects"],
    community: [12, "Creative collaboration"],
    gamedev: [12, "Digital art and motion graphics"],
  },
  "aws-student-builder-group": {
    cloud: [36, "Cloud Computing, AWS Services, serverless technologies, and DevOps fundamentals"],
    portfolio: [16, "Cloud projects and AWS learning pathways"],
    workshops: [14, "Hands-on learning and AWS learning pathways"],
    community: [10, "Cloud community activities"],
  },
};

const MIN_AFFINITY = 12;
/** "Recommend the organizations that best match" — two is a comparison, three is a list. */
const MAX_SHOWN = 2;
const MAX_REASONS = 3;
/**
 * Below this, no org actually offers the thing. The reply must lead by saying
 * so — hackathons, game development, and robotics all land here, because no
 * org's `offers` list mentions them.
 */
const WEAK_SPECIALIST = 20;
/** Two matches this close deserve a comparison rather than a ranking. */
const CLOSE_GAP = 9;
/** How much a previous turn's interest still counts on this turn. */
const RECENCY_DECAY = 0.5;

/** The org with the highest raw weight for a tag — its acknowledged specialist. */
const SPECIALIST = new Map<Tag, string>();
for (const [orgId, profile] of Object.entries(PROFILES)) {
  for (const [tag, entry] of Object.entries(profile) as [Tag, [number, string]][]) {
    const held = SPECIALIST.get(tag);
    const heldWeight = held ? (PROFILES[held][tag]?.[0] ?? 0) : 0;
    if (entry[0] > heldWeight) SPECIALIST.set(tag, orgId);
  }
}

/**
 * Map raw affinity to a 0–96 "compatibility" curve. Asymptotic, so strong
 * multi-tag matches land in the low-to-mid 90s without two orgs pinning at an
 * identical cap: 96 − 41·e^(−affinity/30).
 */
function toScore(affinity: number): number {
  return Math.round(96 - 41 * Math.exp(-affinity / 30));
}

interface Ranked extends Recommendation {
  /** Recency-weighted — decides the ordering. */
  affinity: number;
  /** Tags this org actually scored on, strongest first — drives the prose. */
  matched: Tag[];
}

/**
 * Score every org against the student's interests.
 *
 * Two numbers, deliberately: `affinity` applies recency decay so that a pivot
 * ("actually, what about design?") re-ranks, while the displayed `score` counts
 * every interest they still hold at full strength. Without the split, telling
 * the advisor one more true thing about yourself could lower your own match
 * percentage — which is nonsense to look at.
 *
 * Rejected tags don't merely fail to help; they cost an org that leans on them,
 * so "I like coding but not design" pushes MAFIA down rather than just failing
 * to push it up.
 */
function rank(weights: ReadonlyMap<Tag, number>, rejected: ReadonlySet<Tag>): Ranked[] {
  return organizations
    .map((org) => {
      // No confirmed offerings means nothing honest to recommend it on.
      if (!org.offers?.length) return null;
      const profile = PROFILES[org.id] ?? {};

      let affinity = 0;
      let fit = 0;
      const scored: { tag: Tag; weight: number; reason: string }[] = [];

      for (const [tag, recency] of weights) {
        const entry = profile[tag];
        if (!entry) continue;
        const weight = entry[0] * recency;
        affinity += weight;
        fit += entry[0];
        scored.push({ tag, weight, reason: entry[1] });
      }

      for (const tag of rejected) {
        const entry = profile[tag];
        if (!entry) continue;
        affinity -= entry[0] * 0.6;
        fit -= entry[0] * 0.6;
      }

      if (affinity < MIN_AFFINITY) return null;

      scored.sort((a, b) => b.weight - a.weight);
      return {
        org,
        affinity,
        score: toScore(fit),
        matched: scored.map((s) => s.tag),
        reasons: scored.slice(0, MAX_REASONS).map((s) => s.reason),
      };
    })
    .filter((r): r is Ranked => r !== null)
    .sort((a, b) => b.affinity - a.affinity);
}

/**
 * Decide how many orgs to name.
 *
 * One when the leader owns every interest the student raised. But when the
 * runner-up is the acknowledged specialist in something they named — MAFIA for
 * design, next to GDG for the web half — naming only the leader buries the
 * answer they asked for.
 */
function select(recs: Ranked[], interests: ReadonlySet<Tag>): Ranked[] {
  if (recs.length <= 1) return recs;

  const [lead, ...rest] = recs;
  const shown = [lead];

  for (const rec of rest) {
    if (shown.length >= MAX_SHOWN) break;
    const ownsASpecialty = rec.matched.some(
      (tag) => interests.has(tag) && SPECIALIST.get(tag) === rec.org.id,
    );
    const closeCall = lead.affinity - rec.affinity <= CLOSE_GAP;
    if (ownsASpecialty || closeCall) shown.push(rec);
  }
  return shown;
}

/* ------------------------------------------------------------------ */
/* Layer 4 — Language                                                  */
/* ------------------------------------------------------------------ */

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Deals from a shuffled deck, reshuffling only once the pool is spent — so a
 * phrasing cannot recur until every alternative has been used, and never twice
 * across a reshuffle boundary. This is what keeps the advisor off-template.
 */
class Cycler<T> {
  private deck: T[] = [];
  private last: T | undefined;

  constructor(private readonly pool: readonly T[]) {}

  next(): T {
    if (this.deck.length === 0) {
      this.deck = shuffle([...this.pool]);
      if (this.pool.length > 1 && this.deck[0] === this.last) {
        this.deck.push(this.deck.shift() as T);
      }
    }
    const pick = this.deck.shift() as T;
    this.last = pick;
    return pick;
  }
}

/** `["a", "b", "c"]` → `"a, b and c"`. */
function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Lowercase a leading word so a fragment can be spliced mid-sentence — but
 * never when that would damage a name. "AWS Services" is an acronym; "DevOps"
 * carries an internal capital; "Web Development learning" opens with a proper
 * noun, detected by the next word also being capitalised. "The home of…" is
 * none of those.
 */
function lowerFirst(text: string): string {
  const firstWord = text.split(/\s+/)[0] ?? "";
  const isAcronym = /^[A-Z]{2}/.test(text);
  const isCamelCase = /^[A-Za-z]*[a-z][A-Z]/.test(firstWord);
  const isProperNoun = /^[A-Z][a-z]+\s+[A-Z]/.test(text);
  if (isAcronym || isCamelCase || isProperNoun) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/**
 * Rank a list of strings by how well they answer what the student asked about,
 * reusing each tag's own lexicon regex as the matcher. Naming GDG's first three
 * offers would tell someone who asked about machine learning that they'd get
 * "Web Development learning, Mobile Development learning and Cloud Computing
 * exposure" — every word true, and the one that mattered dropped.
 *
 * `hint` is the evidence line we're about to print. When no offer matches the
 * tag directly — "hackathons" matches none, by design — the offers that line
 * already names are still the right ones to lead with.
 */
function byRelevance(items: string[], matched: Tag[], hint = ""): string[] {
  const lowerHint = hint.toLowerCase();
  const relevance = (item: string) => {
    const i = matched.findIndex((tag) => BY_TAG.get(tag)?.re.test(item));
    const byTag = i === -1 ? 1000 : i;
    const namedInHint = lowerHint.includes(item.toLowerCase()) ? 0 : 1;
    // Tag match dominates; the hint only breaks ties.
    return byTag * 2 + namedInHint;
  };
  // Sort is stable, so equally-irrelevant items keep their listed order.
  return [...items].sort((a, b) => relevance(a) - relevance(b));
}

/** What a student would actually get, verbatim from the org's `offers`. */
function offersOf(org: Organization, count: number, matched: Tag[] = [], hint = ""): string {
  return list(byRelevance(org.offers ?? [], matched, hint).slice(0, count).map(lowerFirst));
}

/** "want to become cybersecurity professionals" — verbatim from `bestFor`. */
function bestForOf(org: Organization, matched: Tag[], goal: Goal): string | null {
  const entries = org.bestFor ?? [];
  if (entries.length === 0) return null;

  // "I want to become a cloud engineer" deserves the entry that names the role.
  if (goal === "career") {
    const career = entries.find((e) => /become/i.test(e));
    if (career) return lowerFirst(career);
  }
  return lowerFirst(byRelevance(entries, matched)[0]);
}

/**
 * The honesty valve. Orgs marked "Needs Verification" in the knowledge base get
 * said out loud, once per reply, whenever one is named.
 */
function pendingNote(orgs: Organization[]): string | null {
  const unconfirmed = orgs.filter((o) => !o.verified && o.offers?.length);
  if (unconfirmed.length === 0) return null;
  return `Some details for ${list(unconfirmed.map((o) => o.shortName))} are still awaiting official confirmation.`;
}

/**
 * Interests no org actually offers. Robotics, game development, and hackathons
 * appear in no `offers` list — handing over the nearest match without saying so
 * would be the most misleading thing this advisor could do.
 */
function gapFor(interests: Signal[]): Signal | null {
  return (
    interests.find((s) => {
      const specialist = SPECIALIST.get(s.tag);
      const best = specialist ? (PROFILES[specialist][s.tag]?.[0] ?? 0) : 0;
      return best > 0 && best < WEAK_SPECIALIST;
    }) ?? null
  );
}

/* -- Phrase pools. Each becomes a Cycler per session; none repeats early. -- */

/** Opening of a single-org recommendation: their words → the org → why. */
const SINGLE_LEADS = [
  (phrase: string, name: string, why: string) => `${phrase} points straight at ${name}: ${why}.`,
  (phrase: string, name: string, why: string) => `${name} is where ${phrase} actually lives: ${why}.`,
  (phrase: string, name: string, why: string) => `For ${phrase}, it's ${name} — ${why}.`,
  (phrase: string, name: string, why: string) => `${phrase} lines up with ${name}: ${why}.`,
];

/** Opening of a two-org comparison drawn from the student's own words. */
const COMPARISONS = [
  (a: string, aPhrase: string, aWhy: string, b: string, bPhrase: string, bWhy: string) =>
    `${a} owns ${aPhrase} — ${aWhy} — while ${bPhrase} is ${b}'s ground: ${bWhy}.`,
  (a: string, aPhrase: string, aWhy: string, b: string, bPhrase: string, bWhy: string) =>
    `${aPhrase} points at ${a} (${aWhy}); ${bPhrase} points at ${b} (${bWhy}).`,
  (a: string, aPhrase: string, aWhy: string, b: string, bPhrase: string, bWhy: string) =>
    `Split the difference: ${a} for ${aPhrase} — ${aWhy}; ${b} for ${bPhrase} — ${bWhy}.`,
];

/** Opens the paragraph that says what they'd walk away with. */
const GAIN_LEADS = [
  "You'd come away with",
  "You'd gain",
  "Expect to build",
  "What you'd take away:",
];

/** Same org as before, with an angle we hadn't used yet. */
const REPEAT_LEADS = [
  (name: string, label: string, why: string) => `${name} again, this time for ${label}: ${why}.`,
  (name: string, label: string, why: string) =>
    `That sharpens it rather than changing it — ${name} also covers ${label}: ${why}.`,
  (name: string, label: string, why: string) => `Still ${name}, now on ${label}: ${why}.`,
];

/** Same org, and genuinely nothing new to say. Push back instead of padding. */
const STALE_LINES = [
  (name: string) =>
    `Still ${name} — nothing you've added moves it. Tell me what would change your mind and I'll re-run it.`,
  (name: string) => `Same ground, same answer: ${name}. What's making you hesitate?`,
  (name: string) =>
    `${name} still fits. Say what feels off about it and I'll dig into the alternatives.`,
];

/** One short question, per the rule — never a guess. */
const CLARIFY_QUESTIONS = [
  "What interests you most: programming, design, cybersecurity, cloud, data, or leadership?",
  "Which sounds most like you — building software, breaking into systems, designing interfaces, or running events?",
  "Do you lean toward programming, design, networking, or leadership?",
];

/* -- Public copy: the chat's opening state and its chip affordances. -- */

export const GREETING_TEXT =
  "I'm the OrgConnect advisor, I cover the eight official School of Computing organizations." +
  "Tell me what you're into, ask what a specific org offers, or ask me to compare two of them.";

export const STARTER_CHIPS = [
  "💻 I enjoy building websites.",
  "🔐 I want to work in cybersecurity.",
  "🎨 I'm more into design than code.",
  "☁️ I want to become a cloud engineer.",
  "👔 I want leadership experience.",
  "🤔 I don't know where I fit.",
];

export const AREA_CHIPS = [
  "Web Development",
  "Cybersecurity",
  "UI/UX Design",
  "AI & Data",
  "Cloud & DevOps",
  "Creative & Multimedia",
  "Leadership",
  "Competitive Programming",
];

/** Which tag each area chip stands for, so we never re-offer a covered area. */
const CHIP_TAGS: Record<string, Tag> = {
  "Web Development": "webdev",
  Cybersecurity: "cyber",
  "UI/UX Design": "uiux",
  "AI & Data": "ai",
  "Cloud & DevOps": "cloud",
  "Creative & Multimedia": "creative",
  Leadership: "leadership",
  "Competitive Programming": "competitive",
};

/** The student's own words for whichever interest this org actually matched. */
function phraseFor(rec: Ranked, u: Understanding): string {
  const own = u.interests.find((s) => rec.matched.includes(s.tag));
  if (own) return `“${own.phrase}”`;
  const any = u.signals.find((s) => !s.negated && rec.matched.includes(s.tag));
  if (any) return `“${any.phrase}”`;
  return labelFor(rec.matched[0]);
}

/* ------------------------------------------------------------------ */
/* The session                                                         */
/* ------------------------------------------------------------------ */

export interface Advisor {
  greeting(): ChatMessage;
  reply(text: string): Reply[];
}

/**
 * One conversation. Holds the student's accumulating profile — so a later "what
 * about design?" is read against everything they've already said, newest turn
 * weighted highest — and the spent phrasings, so nothing repeats.
 */
export function createAdvisor(): Advisor {
  const weights = new Map<Tag, number>();
  const rejected = new Set<Tag>();
  /** org id → the tags we've already sold that org on. */
  const argued = new Map<string, Set<Tag>>();

  const pools = {
    singleLeads: new Cycler(SINGLE_LEADS),
    comparisons: new Cycler(COMPARISONS),
    gainLeads: new Cycler(GAIN_LEADS),
    repeatLeads: new Cycler(REPEAT_LEADS),
    staleLines: new Cycler(STALE_LINES),
    clarifyQuestions: new Cycler(CLARIFY_QUESTIONS),
  };

  const hasInterest = () => [...weights.keys()].some((t) => INTEREST_TAGS.has(t));

  /** Age every prior interest, then fold in this turn's at full strength. */
  function absorb(u: Understanding): void {
    for (const [tag, w] of weights) {
      const decayed = w * RECENCY_DECAY;
      if (decayed < 0.1) weights.delete(tag);
      else weights.set(tag, decayed);
    }
    for (const s of u.signals) {
      if (s.negated) {
        rejected.add(s.tag);
        weights.delete(s.tag);
      } else {
        rejected.delete(s.tag);
        weights.set(s.tag, 1);
      }
    }
  }

  /** Areas they haven't raised yet — better than re-offering a fixed list. */
  function unexploredChips(): string[] {
    return AREA_CHIPS.filter((chip) => !weights.has(CHIP_TAGS[chip])).slice(0, 3);
  }

  /** Join paragraphs, dropping any that composed to nothing. */
  const paragraphs = (...parts: (string | null)[]) => parts.filter(Boolean).join("\n\n");

  /** Answer only about the named org, strictly from its record. */
  function orgAnswer(org: Organization): Reply[] {
    if (!org.offers?.length || !org.goal) {
      return [
        {
          text: `I don't have enough verified information about ${org.shortName}. It's an official School of Computing org, but its focus, offerings, and activities are all awaiting confirmation from official sources.`,
          chips: unexploredChips(),
          delay: 800,
        },
      ];
    }

    const gain = `${pools.gainLeads.next()} ${offersOf(org, 4)}.`;
    const note = pendingNote([org]);
    return [
      {
        text: paragraphs(
          `${org.shortName} works to ${lowerFirst(org.goal)}`,
          note ? `${gain} ${note}` : gain,
        ),
        delay: 900,
      },
    ];
  }

  /** "Compare X and Y" — two records, side by side, no ranking invented. */
  function compareAnswer(a: Organization, b: Organization): Reply[] {
    const missing = [a, b].filter((o) => !o.offers?.length);
    if (missing.length) {
      const known = [a, b].find((o) => o.offers?.length);
      const unknown = missing[0];
      return [
        {
          text: paragraphs(
            `I can't compare those fairly: ${unknown.shortName}'s focus and offerings are still awaiting official confirmation.`,
            known
              ? `What I can tell you is that ${known.shortName} offers ${offersOf(known, 3)}.`
              : null,
          ),
          delay: 900,
        },
      ];
    }

    const note = pendingNote([a, b]);
    // "suits students who…" rather than "if you…": the knowledge base writes
    // bestFor in the plural ("Want to become software engineers").
    const choose = `${a.shortName} suits students who ${bestForOf(a, [], null)}; ${b.shortName} suits those who ${bestForOf(b, [], null)}.`;
    return [
      {
        text: paragraphs(
          `${a.shortName} centers on ${offersOf(a, 3)}, while ${b.shortName} centers on ${offersOf(b, 3)}.`,
          note ? `${choose} ${note}` : choose,
        ),
        delay: 1000,
      },
    ];
  }

  /** The honest roster, straight from the data — including the org we can't pitch. */
  function roster(): Reply[] {
    const known = organizations.filter((o) => o.offers?.length);
    const unknown = organizations.filter((o) => !o.offers?.length);

    const first = `The ${known.length} orgs I can speak to: ${list(known.map((o) => o.shortName))}.`;
    const pending = unknown.length
      ? ` ${list(unknown.map((o) => o.shortName))} ${unknown.length > 1 ? "are" : "is"} official too, but ${unknown.length > 1 ? "their details are" : "its details are"} still awaiting confirmation.`
      : "";

    // Naming a Needs-Verification org anywhere — even in a bare list — obliges
    // us to flag it.
    const note = pendingNote(known);

    return [
      {
        text: paragraphs(
          `${first}${pending}`,
          note ? `${note} Tell me what you're into and I'll narrow it down.` : "Tell me what you're into and I'll narrow it down.",
        ),
        chips: AREA_CHIPS.slice(0, 5),
        delay: 900,
      },
    ];
  }

  /** Unsure → exactly one short question. */
  function clarify(u: Understanding): Reply[] {
    const ack = u.rejected.length ? `Noted — ${list(u.rejected.map((s) => s.label))} is out. ` : "";
    return [
      {
        text: `${ack}${pools.clarifyQuestions.next()}`,
        chips: AREA_CHIPS.slice(0, 5),
        delay: 800,
      },
    ];
  }

  /**
   * They named something real that no org offers strongly enough to rank —
   * robotics, say. Answering with a clarifying question would dodge it; naming
   * the nearest org with a recommendation card would overstate it. So: state
   * the gap, name the nearest without pitching it, then ask.
   */
  function noMatch(gap: Signal): Reply[] {
    const closestId = SPECIALIST.get(gap.tag);
    const closest = closestId ? orgById.get(closestId) : undefined;
    const reason = closestId ? PROFILES[closestId]?.[gap.tag]?.[1] : undefined;

    const opening = `No School of Computing org lists ${gap.label} among its offerings.`;
    const nearest =
      closest && reason
        ? ` The nearest is ${closest.shortName}, but it's a partial overlap rather than a home — ${lowerFirst(reason)}.`
        : "";

    return [
      {
        text: paragraphs(`${opening}${nearest}`, pools.clarifyQuestions.next()),
        chips: AREA_CHIPS.slice(0, 5),
        delay: 900,
      },
    ];
  }

  function recommend(u: Understanding): Reply[] {
    const ranked = rank(weights, rejected);
    if (ranked.length === 0) {
      // An interest so weakly covered that nothing cleared MIN_AFFINITY.
      const unserved = u.interests.find((s) => {
        const specialist = SPECIALIST.get(s.tag);
        const best = specialist ? (PROFILES[specialist][s.tag]?.[0] ?? 0) : 0;
        return best > 0 && best < MIN_AFFINITY;
      });
      return unserved ? noMatch(unserved) : clarify(u);
    }

    const interestTags = new Set([...weights.keys()].filter((t) => INTEREST_TAGS.has(t)));
    const shown = select(ranked, interestTags);
    const lead = shown[0];

    // Read `argued` before we mutate it below.
    const revisiting = shown.every((rec) => argued.has(rec.org.id));
    const freshTag = revisiting
      ? lead.matched.find((tag) => !argued.get(lead.org.id)?.has(tag))
      : undefined;

    let text: string;

    if (revisiting && freshTag) {
      const why = lowerFirst(PROFILES[lead.org.id]?.[freshTag]?.[1] ?? "");
      text = pools.repeatLeads.next()(lead.org.shortName, labelFor(freshTag), why);
    } else if (revisiting) {
      text = pools.staleLines.next()(lead.org.shortName);
    } else if (shown.length > 1) {
      const [a, b] = shown;
      const gain = `${pools.gainLeads.next()} ${offersOf(a.org, 2, a.matched, a.reasons[0])} at ${a.org.shortName}, and ${offersOf(b.org, 2, b.matched, b.reasons[0])} at ${b.org.shortName}.`;
      const note = pendingNote([a.org, b.org]);
      text = paragraphs(
        pools.comparisons.next()(
          a.org.shortName,
          phraseFor(a, u),
          lowerFirst(a.reasons[0]),
          b.org.shortName,
          phraseFor(b, u),
          lowerFirst(b.reasons[0]),
        ),
        note ? `${gain} ${note}` : gain,
      );
    } else {
      const gap = gapFor(u.interests);
      const opening =
        gap && gap.tag === lead.matched[0]
          ? `No School of Computing org lists ${gap.label} among its offerings. ${lead.org.shortName} is the closest match — ${lowerFirst(lead.reasons[0])}.`
          : pools.singleLeads.next()(phraseFor(lead, u), lead.org.shortName, lowerFirst(lead.reasons[0]));

      const fit = bestForOf(lead.org, lead.matched, u.goal);
      const gain = `${pools.gainLeads.next()} ${offersOf(lead.org, 3, lead.matched, lead.reasons[0])}.`;
      const note = pendingNote([lead.org]);

      text = paragraphs(
        fit ? `${opening} It's built for students who ${fit}.` : opening,
        note ? `${gain} ${note}` : gain,
      );
    }

    for (const rec of shown) {
      const seen = argued.get(rec.org.id);
      if (seen) rec.matched.forEach((t) => seen.add(t));
      else argued.set(rec.org.id, new Set(rec.matched));
    }

    return [
      {
        text,
        recommendations: shown.map(({ org, score, reasons }) => ({ org, score, reasons })),
        chips: unexploredChips(),
        delay: 1000,
      },
    ];
  }

  return {
    greeting: () => ({ id: 0, role: "ai", text: GREETING_TEXT, chips: STARTER_CHIPS }),

    reply(text: string): Reply[] {
      const u = understand(text);

      // Intent order matters. Named orgs are answered about themselves and
      // nothing else, and neither they nor the roster colour the profile.
      const named = detectOrgs(text);
      if (named.length >= 2) return compareAnswer(named[0], named[1]);
      if (named.length === 1) return orgAnswer(named[0]);
      if (ROSTER_RE.test(text) && u.interests.length === 0) return roster();

      absorb(u);

      if (u.isGreeting && u.interests.length === 0) {
        return [
          {
            text: `Hey. ${pools.clarifyQuestions.next()}`,
            chips: AREA_CHIPS.slice(0, 5),
            delay: 700,
          },
        ];
      }

      if (u.isThanks && u.interests.length === 0) {
        return [
          {
            text: "Anytime. Ask again if a different interest surfaces.",
            chips: unexploredChips(),
            delay: 700,
          },
        ];
      }

      // Unsure, this turn and every earlier one → one question, no guess.
      if (u.isVague && !hasInterest()) return clarify(u);

      return recommend(u);
    },
  };
}
