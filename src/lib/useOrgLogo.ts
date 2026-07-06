import { useEffect, useState } from "react";
import type { Organization } from "../types";
import { fetchOrgLogo, readCachedLogo, writeCachedLogo } from "./orgLogo";

export type LogoStatus =
  /** Resolving — no cached result yet, a lookup is in flight. */
  | "loading"
  /** A real logo was resolved; `url` is set. */
  | "resolved"
  /** No logo available (no source, or nothing loaded) → show placeholder. */
  | "placeholder";

export interface OrgLogoState {
  status: LogoStatus;
  url: string | null;
}

/**
 * Automatically resolves an org's logo when it mounts (i.e. when the details
 * page opens) and caches the result so repeat visits skip the network entirely.
 *
 * Fetches the LOGO ONLY — all other org fields come straight from the database.
 * Falls back to `status: "placeholder"` whenever a logo can't be resolved.
 */
export function useOrgLogo(org: Organization): OrgLogoState {
  const [state, setState] = useState<OrgLogoState>(() => {
    const cached = readCachedLogo(org.id);
    if (cached === undefined) return { status: "loading", url: null };
    return cached
      ? { status: "resolved", url: cached }
      : { status: "placeholder", url: null };
  });

  useEffect(() => {
    const cached = readCachedLogo(org.id);
    if (cached !== undefined) {
      setState(
        cached
          ? { status: "resolved", url: cached }
          : { status: "placeholder", url: null },
      );
      return;
    }

    // Cache miss — resolve, then persist. Aborts if the org changes/unmounts.
    setState({ status: "loading", url: null });
    const controller = new AbortController();

    fetchOrgLogo(org, controller.signal).then((url) => {
      if (controller.signal.aborted) return;
      writeCachedLogo(org.id, url);
      setState(
        url
          ? { status: "resolved", url }
          : { status: "placeholder", url: null },
      );
    });

    return () => controller.abort();
  }, [org]);

  return state;
}
