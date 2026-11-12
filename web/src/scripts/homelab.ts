import { homePath, homelabPath, type Language } from '../lib/routes';

export function initializeHomelab() {
  const panel = document.querySelector<HTMLDetailsElement>('[data-homelab]');
  if (!panel) return;
  const lang = document.documentElement.lang as Language;
  const summary = panel.querySelector('summary')!;
  const close = panel.querySelector<HTMLButtonElement>('[data-homelab-close]')!;
  const syncFromLocation = () => {
    panel.open = location.hash === '#homelab';
  };

  panel.addEventListener('toggle', () => {
    if (panel.open === (location.hash === '#homelab')) return;
    // Closing because another section was selected must not replace its URL.
    if (!panel.open && location.hash !== '#homelab') return;
    history.pushState(
      null,
      '',
      panel.open ? homelabPath(lang) : homePath(lang),
    );
    window.dispatchEvent(new Event('portfolio:locationchange'));
  });
  close.hidden = false;
  close.addEventListener('click', () => {
    panel.open = false;
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  });
  window.addEventListener('hashchange', syncFromLocation);
  window.addEventListener('popstate', syncFromLocation);
  window.addEventListener('pageshow', syncFromLocation);
  window.addEventListener('portfolio:locationchange', syncFromLocation);
  syncFromLocation();
}
