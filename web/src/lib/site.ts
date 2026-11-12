import { homePath, languages, projectIds, projectPath } from './routes';

export const siteOrigin = 'https://camiska.lat';
export const absoluteURL = (path: string) => new URL(path, siteOrigin).href;

// Only real content pages belong in the sitemap; redirects and anchors do not.
export const canonicalPages = languages.flatMap((lang) => [
  absoluteURL(homePath(lang)),
  ...projectIds.map((id) => absoluteURL(projectPath(lang, id))),
]);
