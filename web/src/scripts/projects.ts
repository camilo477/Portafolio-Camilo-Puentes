import {
  localizedPath,
  routeFromHash,
  type Language,
  type ProjectId,
} from '../lib/routes';

export function initializeProjects() {
  const lang = document.documentElement.lang as Language;
  const panels = [
    ...document.querySelectorAll<HTMLDetailsElement>('[data-project]'),
  ];

  function syncFromLocation() {
    const active = routeFromHash(lang, location.hash);
    // Native disclosure remains responsible for focus and keyboard activation.
    panels.forEach((panel) => {
      panel.open = panel.dataset.project === active;
    });
  }

  panels.forEach((panel) => {
    panel.addEventListener('toggle', () => {
      const opened = panels.find((item) => item.open);
      const current = routeFromHash(lang, location.hash);
      const next = opened?.dataset.project as ProjectId | undefined;
      // Toggle events also follow history navigation. Do not add history for them.
      if (
        next === current ||
        (!next && (current === 'home' || current === 'projects'))
      )
        return;
      history.pushState(null, '', localizedPath(lang, next ?? 'projects'));
      window.dispatchEvent(new Event('portfolio:locationchange'));

      if (opened) {
        const summary = opened.querySelector('summary')!;
        const rect = summary.getBoundingClientRect();
        const barTop = document
          .querySelector('[data-command-bar]')!
          .getBoundingClientRect().top;
        // Closing an earlier row can move the activated summary above the viewport.
        if (rect.top < 16 || rect.bottom > barTop)
          summary.scrollIntoView({ block: 'nearest' });
      }
    });
  });

  window.addEventListener('hashchange', syncFromLocation);
  window.addEventListener('popstate', syncFromLocation);
  window.addEventListener('pageshow', syncFromLocation);
  syncFromLocation();
}
