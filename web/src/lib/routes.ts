export const languages = ['es', 'en'] as const;
export type Language = (typeof languages)[number];
export const projectIds = ['dianimilo', 'nube-camiska'] as const;
export type ProjectId = (typeof projectIds)[number];
export type RouteId = 'home' | 'projects' | ProjectId;

export const commands: Record<RouteId, string> = {
  home: 'cd ~',
  projects: 'ls ~/proyectos',
  dianimilo: 'cd ~/proyectos/dianimilo',
  'nube-camiska': 'cd ~/proyectos/nube-camiska',
};

export const projectAnchor = (lang: Language) =>
  lang === 'es' ? 'proyectos' : 'projects';
export const homePath = (lang: Language) => `/${lang}/`;
export const projectsPath = (lang: Language) =>
  `${homePath(lang)}#${projectAnchor(lang)}`;
export const projectPath = (lang: Language, id: ProjectId) =>
  `${homePath(lang)}${projectAnchor(lang)}/${id}/`;
export const localizedPath = (lang: Language, route: RouteId) =>
  route === 'home'
    ? homePath(lang)
    : route === 'projects'
      ? projectsPath(lang)
      : projectPath(lang, route);
