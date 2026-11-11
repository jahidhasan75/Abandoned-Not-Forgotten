import { useSyncExternalStore } from 'react';

/** Dark or light page theme. The choice is stored per browser; with no stored choice the
 *  system setting decides. index.html applies the stored value before React loads, so the
 *  page never flashes the wrong theme. */
export type Theme = 'dark' | 'light';

const KEY = 'exoarchive-theme';
const listeners = new Set<() => void>();

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export const setTheme = (theme: Theme) => {
  const root = document.documentElement;
  // Cross-fade the colours for a moment, unless the visitor asked for reduced motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-fading');
    window.setTimeout(() => root.classList.remove('theme-fading'), 260);
  }
  root.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage blocked: the choice lasts for this visit only */
  }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  return { theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
};
