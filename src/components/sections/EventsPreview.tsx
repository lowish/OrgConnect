import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { EventCard } from "../ui/EventCard";
import { events } from "../../data/events";
import { stagger, viewportOnce } from "../../lib/motion";

export function EventsPreview() {
  return (
    <section id="events" className="relative isolate py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Events"
          title="What's happening on campus"
          description="Workshops, competitions, and info sessions from across the School of Computing shown here as archived org events."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>

        <p className="mt-8 font-mono text-sm text-stone-500 dark:text-stone-400">
          For more incoming events, keep updated with their fb pages.
        </p>
      </div>
    </section>
  );
}
