import { copy } from '../lib/i18n';
import type { Language } from '../lib/routes';

export function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* The current page still works. */
  }
}

export function initializePreferences() {
  const root = document.documentElement;
  const t = copy[root.lang as Language];
  const themeButton = document.querySelector<HTMLButtonElement>(
    '[data-theme-toggle]',
  )!;
  const themeLabel = document.querySelector<HTMLElement>('[data-theme-label]')!;
  const darkScheme = matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () =>
    root.dataset.theme ?? (darkScheme.matches ? 'dark' : 'light');
  const updateThemeLabel = () => {
    const isDark = currentTheme() === 'dark';
    themeButton.setAttribute(
      'aria-label',
      isDark ? t.switchLight : t.switchDark,
    );
    themeLabel.textContent = isDark ? t.light : t.dark;
  };
  themeButton.disabled = false;
  themeButton.addEventListener('click', () => {
    root.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
    savePreference('portfolio-theme', root.dataset.theme);
    updateThemeLabel();
  });
  darkScheme.addEventListener('change', updateThemeLabel);
  updateThemeLabel();

  const motion = document.querySelector<HTMLInputElement>(
    '[data-motion-toggle]',
  )!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animate = readPreference('portfolio-motion') !== 'off';
  const updateMotion = () => {
    motion.disabled = reduced.matches;
    motion.checked = animate && !reduced.matches;
    root.dataset.motion = motion.checked ? 'on' : 'off';
    window.dispatchEvent(new Event('portfolio:motionchange'));
  };
  motion.addEventListener('change', () => {
    animate = motion.checked;
    savePreference('portfolio-motion', animate ? 'on' : 'off');
    updateMotion();
  });
  reduced.addEventListener('change', updateMotion);
  updateMotion();
}
