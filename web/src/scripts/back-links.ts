import {
  commands,
  projectIds,
  routeFromHash,
  type Language,
} from '../lib/routes';

export function initializeBackLinks() {
  if (!document.referrer || history.length < 2) return;
  const previous = new URL(document.referrer);
  if (previous.origin !== location.origin) return;
  const [lang, , project] = previous.pathname.split('/').filter(Boolean);
  if (lang !== 'es' && lang !== 'en') return;
  const projectId = projectIds.find((id) => id === project);
  const command =
    commands[projectId ?? routeFromHash(lang as Language, previous.hash)];
  document
    .querySelectorAll<HTMLAnchorElement>('[data-back-link]')
    .forEach((link) => {
      link.href = previous.pathname + previous.search + previous.hash;
      link.dataset.previewCommand = command;
      link.addEventListener('click', (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        history.back();
      });
    });
}
