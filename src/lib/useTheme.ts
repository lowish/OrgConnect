import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Class-based dark mode. index.html applies the saved theme before first
 * paint; this hook keeps React state, the <html> class, and localStorage in
 * sync after hydration.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("oc-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
