import type { Organization } from "../types";

/**
 * DATA PROVENANCE — read before editing.
 *
 * `goal`, `mission`, `offers`, and `bestFor` are transcribed from the official
 * OrgConnect Organization Knowledge Base. They are the advisor's only source of
 * truth: it may not name an activity, workshop, event, technology, or benefit
 * that does not appear in an org's `offers` list. Notably, NO org lists
 * hackathons or game development — the advisor says so rather than implying
 * otherwise.
 *
 * `verified` mirrors the knowledge base's status line:
 *   verified: true  → no status line; details confirmed.
 *   verified: false → "Needs Verification" — the org NAME and page are real,
 *                     but its details await official confirmation (UI shows a
 *                     badge, and the advisor says so out loud).
 *
 * Organization names and official Facebook pages were verified on 2026-07-05
 * against each page's og:title. `officialUrl` points at the org's official
 * Facebook page; the LOGO is auto-fetched from it at runtime (see lib/orgLogo).
 * `website` is the org's own site, where one exists.
 *
 * `gains` are short "what you'll gain" outcome summaries for the details page
 * only. They paraphrase each org's stated goal/offers and are NEVER read by the
 * advisor — its activity claims still come solely from `offers`.
 */
export const organizations: Organization[] = [
  {
    id: "gdg-on-campus-hau",
    name: "GDG on Campus — Holy Angel University",
    shortName: "GDG on Campus HAU",
    category: "Developer Community",
    description:
      "The Google-supported developer community on campus. Students of any program build real projects together through workshops, study jams, and collaborative events.",
    goal: "Build a community of student developers who learn modern technologies through collaboration, workshops, study jams, and real-world projects supported by Google's developer ecosystem.",
    mission:
      "Help students grow as software developers by encouraging continuous learning, collaboration, innovation, and practical project experience.",
    offers: [
      "Web Development learning",
      "Mobile Development learning",
      "Cloud Computing exposure",
      "Artificial Intelligence and Machine Learning fundamentals",
      "Hands-on workshops",
      "Study Jams",
      "Collaborative software projects",
      "Networking with fellow student developers",
      "Technical community events",
    ],
    bestFor: [
      "Want to become software engineers",
      "Enjoy programming",
      "Like building real-world applications",
      "Want to participate in collaborative development projects",
      "Are interested in Google technologies",
    ],
    gains: [
      "A portfolio of real, collaborative projects",
      "Hands-on experience across web, mobile, and cloud",
      "A network within Google's developer ecosystem",
      "Confidence shipping software as a team",
    ],
    skills: ["Web Development", "Mobile Development", "Cloud", "AI / ML"],
    verified: true,
    initials: "GDG",
    officialUrl: "https://www.facebook.com/gdsc.hau",
    website: "https://gdsc-hau.pages.dev/",
  },
  {
    id: "soc-student-council",
    name: "School of Computing Student Council",
    shortName: "SoC Student Council",
    category: "Student Government",
    description:
      "The highest governing student body of the School of Computing — representing students, organizing school-wide initiatives, and connecting orgs together.",
    goal: "Represent the interests of every School of Computing student while creating programs, initiatives, and events that strengthen the student community.",
    mission:
      "Develop future student leaders while serving as the official bridge between students, organizations, faculty, and the department.",
    offers: [
      "Leadership opportunities",
      "Event planning experience",
      "Project management",
      "Public speaking",
      "Community engagement",
      "Student representation",
      "Team collaboration",
      "Organizational management",
    ],
    bestFor: [
      "Want leadership experience",
      "Enjoy organizing events",
      "Want to represent fellow students",
      "Like managing projects and teams",
      "Want to improve communication skills",
    ],
    gains: [
      "Hands-on leadership and event-planning experience",
      "A voice in school-wide student initiatives",
      "Practice managing projects and teams",
      "A stronger professional network across every org",
    ],
    skills: ["Leadership", "Event Planning", "Project Management", "Public Speaking"],
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
    goal: "Help students become better programmers by strengthening their technical skills beyond classroom learning.",
    mission:
      "Create an environment where students continuously improve through coding, collaboration, and practical software development.",
    offers: [
      "Programming practice",
      "Software development experience",
      "Coding collaboration",
      "Peer learning",
      "Technical skill development",
      "Real programming projects",
    ],
    bestFor: [
      "Love coding",
      "Want to improve programming skills",
      "Enjoy software development",
      "Want more hands-on coding experience",
    ],
    gains: [
      "Sharper programming fundamentals",
      "Real software you can point to",
      "A habit of coding beyond the classroom",
      "Peers who push your craft forward",
    ],
    skills: ["Programming", "Software Development", "Peer Learning", "Collaboration"],
    // The knowledge base carries no "Needs Verification" status for Code Geeks.
    verified: true,
    initials: "CG",
    officialUrl: "https://www.facebook.com/TheCodeGeeks",
    website: "https://codegeeks.site/",
  },
  {
    id: "cybersecurity-intelligence-alliance",
    name: "Cybersecurity Intelligence Alliance",
    shortName: "CIA",
    category: "Cybersecurity",
    description:
      "The home for students drawn to the defensive and offensive sides of security — think capture-the-flag competitions, threat analysis, and security research.",
    goal: "Introduce students to cybersecurity through practical security learning, ethical hacking concepts, defensive security, and security competitions.",
    mission:
      "Develop future cybersecurity professionals who understand digital security, cyber defense, and responsible ethical hacking.",
    offers: [
      "Cybersecurity learning",
      "Capture The Flag (CTF) competitions",
      "Network defense",
      "Ethical hacking concepts",
      "Threat analysis",
      "Security research",
    ],
    bestFor: [
      "Want to become cybersecurity professionals",
      "Enjoy solving security challenges",
      "Like ethical hacking",
      "Want to join cybersecurity competitions",
    ],
    gains: [
      "Practical security and ethical-hacking skills",
      "Capture-the-Flag competition experience",
      "A defender's mindset for real-world threats",
      "A foothold toward a cybersecurity career",
    ],
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
    goal: "Train students to solve algorithmic problems efficiently and prepare them for programming contests and technical interviews.",
    mission: "Improve logical thinking, algorithmic reasoning, and competitive programming skills.",
    offers: [
      "Competitive programming",
      "Algorithm training",
      "Data Structures practice",
      "Problem-solving exercises",
      "Programming contests",
    ],
    bestFor: [
      "Enjoy solving difficult programming problems",
      "Want to compete in coding contests",
      "Want to strengthen logical thinking",
      "Prepare for technical interviews",
    ],
    gains: [
      "Faster algorithmic problem-solving",
      "Contest-ready pattern recognition",
      "Technical-interview confidence",
      "Stronger logical reasoning under time pressure",
    ],
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
    goal: "Provide a creative space for students interested in digital design, multimedia production, and visual storytelling.",
    mission:
      "Develop students' artistic and multimedia skills using modern digital tools and creative collaboration.",
    offers: [
      "Digital art",
      "Visual design",
      "Multimedia production",
      "Motion graphics",
      "Creative collaboration",
    ],
    bestFor: [
      "Love graphic design",
      "Enjoy creating digital artwork",
      "Want to improve multimedia skills",
      "Like creative projects",
    ],
    gains: [
      "A growing multimedia and design portfolio",
      "Comfort with modern creative tools",
      "Motion and visual-storytelling skills",
      "A community of creatives to build with",
    ],
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
    goal: "Help students explore cloud computing and modern cloud technologies using AWS services and hands-on learning.",
    mission:
      "Prepare students for cloud careers by building practical experience with AWS technologies and cloud-based solutions.",
    offers: [
      "Cloud Computing",
      "AWS Services",
      "Serverless technologies",
      "DevOps fundamentals",
      "Cloud projects",
      "AWS learning pathways",
      "Cloud community activities",
    ],
    bestFor: [
      "Want to become cloud engineers",
      "Are interested in DevOps",
      "Enjoy infrastructure and cloud technologies",
      "Want AWS experience",
    ],
    gains: [
      "Hands-on experience with AWS services",
      "A path toward AWS certifications",
      "Cloud and DevOps fundamentals",
      "Projects that prove your cloud skills",
    ],
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
    description:
      "The official independent student publication of the School of Computing that provides campus news, feature stories, and student-centered journalism while upholding truth, integrity, and public service.",
    goal: "Serve as the voice of the students and the truth through student journalism that informs the School of Computing community.",
    mission:
      "Deliver timely, student-centered stories and perspectives that reflect the events, people, and issues affecting the School of Computing community.",
    offers: [
      "News",
      "Feature writing",
      "Editorial writing",
      "Opinion writing",
      "Literary writing",
    ],
    bestFor: [
      "Want to write for a student publication",
      "Enjoy campus journalism",
      "Like telling student-centered stories",
      "Want experience in news, feature, editorial, opinion, or literary writing",
    ],
    gains: [
      "Experience publishing student journalism",
      "Stronger writing and editorial skills",
      "Practice covering campus stories with a student perspective",
      "A portfolio of publication-ready writing",
    ],
    skills: [
      "Journalism",
      "News Writing",
      "Editing",
      "Photojournalism",
    ],
    verified: false,
    initials: "AP",
    officialUrl: "https://www.facebook.com/theaccesspointhau",
    website: "https://theaccesspointhau.com/",
  },
];
