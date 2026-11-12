import {
  commands,
  localizedPath,
  routeFromHash,
  type Language,
  type RouteId,
} from '../lib/routes';
import { copy } from '../lib/i18n';

export function initializeCommands() {
  const output = document.querySelector<HTMLElement>('[data-command]')!;
  const bar = document.querySelector<HTMLElement>('[data-command-bar]')!;
  const label = document.querySelector<HTMLElement>('[data-command-label]')!;
  const lang = document.documentElement.lang as Language;
  const route = document.body.dataset.route as RouteId;
  const supportsHover = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let hovered: HTMLElement | null = null;
  let focused: HTMLElement | null = null;
  let source: 'pointer' | 'focus' = 'pointer';
  let pointerPosition: { x: number; y: number } | null = null;
  let typingFrame = 0;
  let updateFrame = 0;
  let targetCommand = '';
  const activeRoute = (): RouteId =>
    route === 'home' ? routeFromHash(lang, location.hash) : route;

  function show(command: string, animate: boolean) {
    cancelAnimationFrame(typingFrame);
    targetCommand = command;
    if (
      !animate ||
      reducedMotion.matches ||
      document.documentElement.dataset.motion === 'off'
    ) {
      if (output.textContent !== command) output.textContent = command;
      return;
    }
    const start = performance.now();
    // A fixed total duration prevents longer paths from delaying navigation.
    const type = (now: number) => {
      const progress = Math.min((now - start) / 180, 1);
      output.textContent = command.slice(
        0,
        Math.max(1, Math.ceil(progress * command.length)),
      );
      if (progress < 1) typingFrame = requestAnimationFrame(type);
    };
    typingFrame = requestAnimationFrame(type);
  }
  function update() {
    const target =
      source === 'focus' ? (focused ?? hovered) : (hovered ?? focused);
    const preview = target?.dataset.previewCommand;
    bar.dataset.state = preview ? 'preview' : 'idle';
    label.textContent = preview ? copy[lang].preview : copy[lang].route;
    const next = preview ?? commands[activeRoute()];
    if (next !== targetCommand) show(next, Boolean(preview));
  }
  function scheduleUpdate() {
    cancelAnimationFrame(updateFrame);
    // Coalesce adjacent leave/enter and blur/focus events without flashing idle.
    updateFrame = requestAnimationFrame(update);
  }
  function syncRoute() {
    hovered = null;
    focused = null;
    cancelAnimationFrame(updateFrame);
    show(commands[activeRoute()], false);
    bar.dataset.state = 'idle';
    label.textContent = copy[lang].route;
    document
      .querySelectorAll<HTMLAnchorElement>('[data-language]')
      .forEach((link) => {
        link.href = localizedPath(
          link.dataset.language as Language,
          activeRoute(),
        );
      });
    document
      .querySelectorAll<HTMLAnchorElement>('.main-nav a')
      .forEach((link) => {
        const active = activeRoute();
        const navigationRoute =
          active === 'home' || active === 'technologies' ? active : 'projects';
        const isActive =
          link.dataset.previewCommand === commands[navigationRoute];
        if (isActive)
          link.setAttribute(
            'aria-current',
            navigationRoute === 'home' ? 'page' : 'location',
          );
        else link.removeAttribute('aria-current');
      });
  }

  document
    .querySelectorAll<HTMLElement>('[data-preview-command]')
    .forEach((link) => {
      link.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || !supportsHover.matches) return;
        // Scrolling a focused control into view can move another item under a
        // stationary pointer. Only actual pointer movement may replace focus.
        if (source === 'focus') return;
        hovered = link;
        source = 'pointer';
        scheduleUpdate();
      });
      link.addEventListener('pointerleave', () => {
        if (hovered === link) hovered = null;
        scheduleUpdate();
      });
      link.addEventListener('focus', () => {
        hovered = null;
        focused = link;
        source = 'focus';
        scheduleUpdate();
      });
      link.addEventListener('blur', () => {
        if (focused === link) focused = null;
        scheduleUpdate();
      });
      // Anchors and summaries handle activation natively, independent of this controller.
    });
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !supportsHover.matches) return;
    const moved =
      !pointerPosition ||
      pointerPosition.x !== event.clientX ||
      pointerPosition.y !== event.clientY;
    pointerPosition = { x: event.clientX, y: event.clientY };
    if (!moved) return;
    source = 'pointer';
    hovered =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-preview-command]')
        : null;
    scheduleUpdate();
  });
  supportsHover.addEventListener('change', () => {
    hovered = null;
    scheduleUpdate();
  });
  window.addEventListener('hashchange', syncRoute);
  window.addEventListener('popstate', syncRoute);
  window.addEventListener('portfolio:locationchange', syncRoute);
  window.addEventListener('pageshow', syncRoute);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(typingFrame);
    cancelAnimationFrame(updateFrame);
  });
  window.addEventListener('portfolio:motionchange', () =>
    show(targetCommand, false),
  );
  syncRoute();
}
