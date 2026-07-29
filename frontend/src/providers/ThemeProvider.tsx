import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  ThemeContext,
  type ResolvedTheme,
  type Theme,
  type ThemeContextValue,
} from "./ThemeContext";

const STORAGE_KEY = "finance-ai:theme";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

interface ThemeProviderProps {
  children: ReactNode;
}

function getSystemThemeSnapshot(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches
    ? "dark"
    : "light";
}

function getServerThemeSnapshot(): ResolvedTheme {
  return "light";
}

function subscribeToSystemTheme(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener(
      "change",
      onStoreChange,
    );
  };
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedTheme =
    window.localStorage.getItem(STORAGE_KEY);

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return "system";
}

function applyThemeClass(
  resolvedTheme: ResolvedTheme,
): void {
  const root = document.documentElement;

  root.classList.toggle(
    "dark",
    resolvedTheme === "dark",
  );

  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
}: Readonly<ThemeProviderProps>) {
  const [theme, setThemeState] = useState<Theme>(
    readStoredTheme,
  );

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getServerThemeSnapshot,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (nextTheme: Theme): void => {
      setThemeState(nextTheme);

      window.localStorage.setItem(
        STORAGE_KEY,
        nextTheme,
      );
    },
    [],
  );

  const toggleTheme = useCallback((): void => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    );
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}