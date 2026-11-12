export function initializeHeader() {
  const header = document.querySelector<HTMLElement>('.site-header')!;
  let frame = 0;
  let followAnchor = Boolean(location.hash);
  let anchorBehavior: ScrollBehavior = 'instant';

  const anchorTarget = () => {
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return null;
    }
    const target = document.getElementById(id);
    if (!target) return null;
    const story = target.closest<HTMLElement>('.project-story');
    // The first preview also introduces the section: keep its heading in view.
    if (story && !story.previousElementSibling)
      return story.closest<HTMLElement>('.projects');
    return story ?? target;
  };
  const alignAnchor = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (followAnchor)
          anchorTarget()?.scrollIntoView({
            block: 'start',
            behavior: anchorBehavior,
          });
      });
    });
  };
  const measure = () => {
    document.documentElement.style.setProperty(
      '--header-height',
      `${header.getBoundingClientRect().height}px`,
    );
    if (followAnchor) alignAnchor();
  };
  const navigate = () => {
    anchorBehavior = 'instant';
    followAnchor = Boolean(location.hash);
    alignAnchor();
  };
  const releaseAnchor = () => {
    followAnchor = false;
    cancelAnimationFrame(frame);
  };

  measure();
  new ResizeObserver(measure).observe(header);
  // Fonts can move the target as well as change the header height.
  void document.fonts.ready.then(() => {
    if (followAnchor) alignAnchor();
  });
  window.addEventListener('hashchange', navigate);
  window.addEventListener('popstate', navigate);
  window.addEventListener('pageshow', navigate);
  window.addEventListener('portfolio:indexnavigate', () => {
    anchorBehavior =
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'off'
        ? 'instant'
        : 'smooth';
    followAnchor = Boolean(location.hash);
    alignAnchor();
  });
  window.addEventListener('pagehide', releaseAnchor);
  window.addEventListener('wheel', releaseAnchor, { passive: true });
  window.addEventListener('touchstart', releaseAnchor, { passive: true });
  window.addEventListener('pointerdown', releaseAnchor, { passive: true });
  window.addEventListener('keydown', releaseAnchor);
  // A repeated click on the current hash does not dispatch hashchange.
  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[href]')
        : null;
    if (!link || link.target === '_blank' || link.hasAttribute('download'))
      return;
    const destination = new URL(link.href);
    if (
      destination.origin === location.origin &&
      destination.pathname === location.pathname &&
      destination.hash === location.hash &&
      destination.hash
    )
      navigate();
  });
}
