import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Background } from "./components/layout/Background";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Wordmark } from "./components/sections/Wordmark";
import { OrgShowcase } from "./components/sections/OrgShowcase";
import { EventsPreview } from "./components/sections/EventsPreview";
import { OrgDetail } from "./components/sections/OrgDetail";
import { ChatWidget } from "./components/HeroAIAdvisor/ChatWidget";
import type { Organization } from "./types";

export default function App() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const selectOrg = useCallback((org: Organization) => setSelectedOrg(org), []);
  const clearOrg = useCallback(() => setSelectedOrg(null), []);

  // Jump to the top whenever we switch between the landing and a details view.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedOrg]);

  return (
    // reducedMotion="user" stills every animation for prefers-reduced-motion users.
    <MotionConfig reducedMotion="user">
      <Background />
      <Navbar />
      <main>
        {selectedOrg ? (
          <OrgDetail org={selectedOrg} onBack={clearOrg} />
        ) : (
          <>
            <Hero />
            <Wordmark />
            <OrgShowcase onSelectOrg={selectOrg} />
            <EventsPreview />
          </>
        )}
      </main>
      <Footer />
      <ChatWidget />
    </MotionConfig>
  );
}
