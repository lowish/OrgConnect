import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Background } from "./components/layout/Background";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Wordmark } from "./components/sections/Wordmark";
import { OrgShowcase } from "./components/sections/OrgShowcase";
import { EventsPreview } from "./components/sections/EventsPreview";
import { ConnectStudents } from "./components/sections/ConnectStudents";
import { OrgDetail } from "./components/sections/OrgDetail";
import { StudentsDirectory } from "./components/sections/StudentsDirectory";
import { SupportPage, type SupportSection } from "./components/sections/Support";
import { ChatWidget } from "./components/HeroAIAdvisor/ChatWidget";
import { organizations } from "./data/organizations";
import type { Organization } from "./types";

function getSupportSection(hash: string): SupportSection {
  if (!hash.startsWith("#legal")) return "overview";

  const section = hash.split("/")[1] as SupportSection | undefined;
  return section ?? "overview";
}

function isLandingSectionHash(hash: string) {
  return hash === "#home" || hash === "#organizations" || hash === "#events" || hash === "#students";
}

/** The full student directory lives one level below the #students section. */
function isStudentsDirectoryHash(hash: string) {
  return hash === "#students/all";
}

function getOrgFromHash(hash: string) {
  if (!hash.startsWith("#organization/")) return null;

  const orgId = decodeURIComponent(hash.slice("#organization/".length));
  return organizations.find((org) => org.id === orgId) ?? null;
}

export default function App() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [hash, setHash] = useState(() => window.location.hash || "#home");
  const previousScrollY = useRef(0);

  const selectOrg = useCallback((org: Organization) => {
    previousScrollY.current = window.scrollY;
    setSelectedOrg(org);
    const nextHash = `#organization/${encodeURIComponent(org.id)}`;
    window.history.pushState({ orgId: org.id }, "", nextHash);
    setHash(nextHash);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const clearOrg = useCallback(() => {
    setSelectedOrg(null);
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      const nextHash = window.location.hash || "#home";
      setHash(nextHash);
      const orgFromHash = getOrgFromHash(nextHash);
      setSelectedOrg(orgFromHash);
    };

    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    if ((hash.startsWith("#legal") || isStudentsDirectoryHash(hash)) && selectedOrg) {
      clearOrg();
    }
  }, [clearOrg, hash, selectedOrg]);

  useEffect(() => {
    const orgFromHash = getOrgFromHash(hash);

    if (orgFromHash) {
      if (selectedOrg?.id !== orgFromHash.id) {
        setSelectedOrg(orgFromHash);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (!hash.startsWith("#organization/") && selectedOrg && isLandingSectionHash(hash)) {
      clearOrg();
    }
  }, [clearOrg, hash, selectedOrg]);

  const isSupportPage = hash.startsWith("#legal");
  const isStudentsPage = isStudentsDirectoryHash(hash);
  const supportSection = getSupportSection(hash);

  return (
    // reducedMotion="user" stills every animation for prefers-reduced-motion users.
    <MotionConfig reducedMotion="user">
      <Background />
      <Navbar />
      <main>
        {isSupportPage ? (
          <SupportPage section={supportSection} />
        ) : isStudentsPage ? (
          <StudentsDirectory
            onBack={() => {
              window.location.hash = "#students";
            }}
          />
        ) : selectedOrg ? (
          <OrgDetail
            org={selectedOrg}
            onBack={() => {
              clearOrg();
              const nextHash = "#organizations";
              window.history.replaceState(null, "", nextHash);
              setHash(nextHash);
              // Restore after the landing page commits — scrolling while OrgDetail
              // is still mounted clamps to its (shorter) height and lands wrong.
              const restoreY = previousScrollY.current;
              requestAnimationFrame(() => {
                window.scrollTo({ top: restoreY, behavior: "instant" });
              });
            }}
          />
        ) : (
          <>
            <Hero />
            <Wordmark />
            <OrgShowcase onSelectOrg={selectOrg} />
            <EventsPreview />
            <ConnectStudents />
          </>
        )}
      </main>
      <Footer />
      <ChatWidget />
    </MotionConfig>
  );
}
