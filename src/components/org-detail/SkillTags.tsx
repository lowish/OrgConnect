/**
 * Skill tags. Each is a link to the browse page filtered by that skill, so a
 * reader can jump from "what you'll learn" straight into other orgs teaching
 * the same thing. The org accent tints the hover and focus state so the tags
 * feel native to this org's page.
 */
export function SkillTags({
  skills,
  accentColor,
}: {
  skills: string[];
  accentColor: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Skills you can learn">
      {skills.map((skill) => (
        <li key={skill}>
          <a
            href={`/browse?skill=${encodeURIComponent(skill)}`}
            className="group inline-flex items-center rounded-md border border-stone-200 px-3 py-1.5
              font-mono text-xs text-stone-600 transition-colors hover:border-transparent
              hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2
              dark:border-stone-700 dark:text-stone-300 dark:hover:text-white"
            style={{ outlineColor: accentColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${accentColor}1f`;
              e.currentTarget.style.borderColor = accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.borderColor = "";
            }}
          >
            {skill}
          </a>
        </li>
      ))}
    </ul>
  );
}
