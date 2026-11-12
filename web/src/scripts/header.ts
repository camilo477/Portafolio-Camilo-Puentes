export function initializeHeader() {
  const header = document.querySelector<HTMLElement>('.site-header')!;
  const measure = () => {
    document.documentElement.style.setProperty(
      '--header-height',
      `${header.getBoundingClientRect().height}px`,
    );
  };
  // Font loading, zoom and wrapped controls can change the sticky header's height.
  measure();
  new ResizeObserver(measure).observe(header);
}
