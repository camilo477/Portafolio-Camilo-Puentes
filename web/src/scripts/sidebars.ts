import { copy } from '../lib/i18n';
import type { Language } from '../lib/routes';

export function initializeSidebars() {
  const lang = document.documentElement.lang as Language;
  document
    .querySelectorAll<HTMLButtonElement>('[data-copy-email]')
    .forEach((button) => {
      if (!navigator.clipboard?.writeText) return;
      button.hidden = false;
      button.addEventListener('click', async () => {
        const status = button
          .closest('[data-professional-links]')!
          .querySelector<HTMLElement>('[data-copy-status]')!;
        status.textContent = '';
        button.disabled = true;
        button.closest<HTMLElement>(
          '[data-tooltip-item]',
        )!.dataset.tooltipDismissed = '';
        try {
          await navigator.clipboard.writeText(button.dataset.copyEmail!);
          status.textContent = copy[lang].emailCopied;
        } catch {
          status.textContent = copy[lang].emailCopyFailed;
        } finally {
          button.disabled = false;
        }
      });
    });
  const tooltipItems = document.querySelectorAll<HTMLElement>(
    '[data-tooltip-item]',
  );
  tooltipItems.forEach((item) => {
    item.addEventListener(
      'pointerleave',
      () => delete item.dataset.tooltipDismissed,
    );
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget as Node | null))
        delete item.dataset.tooltipDismissed;
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape')
      tooltipItems.forEach((item) => {
        if (item.matches(':hover') || item.contains(document.activeElement))
          item.dataset.tooltipDismissed = '';
      });
  });

  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('[data-index-target]'),
  ];
  const entries = links.flatMap((link) => {
    const target = document.getElementById(link.dataset.indexTarget!);
    if (!target) return [];
    // Observe the section's reading area, rather than only its heading's pixels.
    const area = target.matches('h2')
      ? target.closest<HTMLElement>('section')!
      : target;
    return [{ link, target, area }];
  });
  if (!entries.length) return;
  const header = document.querySelector<HTMLElement>('.site-header')!;
  let observer: IntersectionObserver;
  let frame = 0;
  let navigationTarget: string | undefined;
  let atPageEnd = false;
  const intersecting = new Set<Element>();
  const setActive = (id: string) =>
    entries.forEach(({ link, target }) => {
      if (target.id === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  const update = () => {
    // A short final section may never reach the reading band. Keep an explicit
    // destination selected until the reader starts scrolling independently.
    if (navigationTarget) {
      setActive(navigationTarget);
      return;
    }
    const last = entries.at(-1)!;
    // The final collapsed section can be read before it reaches the top band.
    if (
      atPageEnd &&
      scrollY > 1 &&
      last.area.getBoundingClientRect().top < innerHeight
    ) {
      setActive(last.target.id);
      return;
    }
    const visible = entries.filter((entry) => intersecting.has(entry.area));
    visible.sort(
      (a, b) =>
        b.area.getBoundingClientRect().top - a.area.getBoundingClientRect().top,
    );
    if (visible[0]) setActive(visible[0].target.id);
    else if (scrollY <= 1) setActive(entries[0].target.id);
  };
  const observe = () => {
    observer?.disconnect();
    intersecting.clear();
    const top = Math.ceil(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height',
        ),
      ) + 24,
    );
    const bottom = Math.max(0, innerHeight - top - 80);
    observer = new IntersectionObserver(
      (changes) => {
        changes.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) intersecting.add(target);
          else intersecting.delete(target);
        });
        update();
      },
      { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 },
    );
    entries.forEach(({ area }) => observer.observe(area));
  };
  const scheduleObserve = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(observe);
  };
  const syncLocation = () => {
    const matched = entries.find(
      ({ target }) => `#${target.id}` === location.hash,
    );
    navigationTarget = matched?.target.id;
    if (matched) setActive(matched.target.id);
    else if (!location.hash) setActive(entries[0].target.id);
    scheduleObserve();
  };
  entries.forEach(({ link, area }) => {
    link.addEventListener('click', (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      )
        return;
      event.preventDefault();
      if (location.href !== link.href) history.pushState(null, '', link.href);
      window.dispatchEvent(new Event('portfolio:indexnavigate'));
    });
    if (area instanceof HTMLDetailsElement)
      area.addEventListener('toggle', scheduleObserve);
  });
  new ResizeObserver(scheduleObserve).observe(header);
  const endObserver = new IntersectionObserver(
    ([entry]) => {
      atPageEnd = entry.intersectionRatio === 1;
      update();
    },
    { threshold: 1 },
  );
  const footer = document.querySelector('.site-footer');
  const observeEnd = () => {
    if (entries.at(-1)!.area instanceof HTMLDetailsElement && footer)
      endObserver.observe(footer);
  };
  observeEnd();
  window.addEventListener('pageshow', observeEnd);
  const resumeReading = () => {
    if (!navigationTarget) return;
    navigationTarget = undefined;
    update();
  };
  window.addEventListener('wheel', resumeReading, { passive: true });
  window.addEventListener('touchmove', resumeReading, { passive: true });
  window.addEventListener(
    'pointerdown',
    (event) => {
      // A scrollbar interaction starts reading; clicking a theme control does not.
      if (event.target === document.documentElement) resumeReading();
    },
    { passive: true },
  );
  window.addEventListener('keydown', (event) => {
    if (
      [
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        ' ',
      ].includes(event.key)
    )
      resumeReading();
  });
  window.addEventListener('resize', scheduleObserve);
  for (const event of [
    'hashchange',
    'popstate',
    'pageshow',
    'portfolio:locationchange',
    'portfolio:indexnavigate',
  ])
    window.addEventListener(event, syncLocation);
  window.addEventListener('pagehide', () => {
    observer?.disconnect();
    endObserver.disconnect();
    cancelAnimationFrame(frame);
  });
  syncLocation();
}
