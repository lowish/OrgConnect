import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { OrgCard } from "../ui/OrgCard";
import { organizations } from "../../data/organizations";
import type { Organization } from "../../types";
import { stagger, viewportOnce } from "../../lib/motion";

export function OrgShowcase({
  onSelectOrg,
}: {
  onSelectOrg: (org: Organization) => void;
}) {
  return (
    <section id="organizations" className="relative isolate py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Organizations"
          title="Every official org, side by side"
          description="No more piecing it together from posters and group chats. Compare what each organization does and what you'll walk away knowing."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {organizations.map((org) => (
            <OrgCard key={org.id} org={org} onSelect={onSelectOrg} />
          ))}
        </motion.div>

        <p className="mt-8 font-mono text-xs text-stone-500 dark:text-stone-500">
          Organization names verified against official HAU sources. Cards marked
          “Needs verification” carry details pending confirmation from the org itself.
        </p>
      </div>
    </section>
  );
}
