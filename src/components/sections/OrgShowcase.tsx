import { SectionHeader } from "../ui/SectionHeader";
import { OrgCard } from "../ui/OrgCard";
import { organizations } from "../../data/organizations";
import type { Organization } from "../../types";

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
          title="Find the org that fits you"
          description="Review each official org in one place and quickly understand its focus, benefits, and opportunities."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <OrgCard key={org.id} org={org} onSelect={onSelectOrg} />
          ))}
        </div>
      </div>
    </section>
  );
}
