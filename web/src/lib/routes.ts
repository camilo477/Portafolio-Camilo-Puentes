export const defaultLanguage = 'en';
export const homeAnchor = (lang: Language) =>
  lang === 'es' ? 'inicio' : 'home';
export const languages = ['es', 'en'] as const;
export type Language = (typeof languages)[number];
export const projectIds = [
  'dianimilo',
  'nube-camiska',
  'convertix',
  'portafolio',
] as const;
export type ProjectId = (typeof projectIds)[number];
export type RouteId =
  'home' | 'projects' | 'technologies' | 'experience' | 'homelab' | ProjectId;

export const commands: Record<RouteId, string> = {
  home: 'cd ~',
  projects: 'ls ~/proyectos',
  technologies: 'cat ~/skills/stack.yaml',
  experience: 'cat ~/experiencia.md',
  homelab: 'cd ~/homelab',
  dianimilo: 'cd ~/proyectos/dianimilo',
  'nube-camiska': 'cd ~/proyectos/nube-camiska',
  convertix: 'cd ~/proyectos/convertix',
  portafolio: 'cd ~/proyectos/portafolio',
};

export const projectAnchor = (lang: Language) =>
  lang === 'es' ? 'proyectos' : 'projects';
export const homePath = (lang: Language) => `/${lang}/`;
export const technologiesAnchor = (lang: Language) =>
  lang === 'es' ? 'tecnologias' : 'technologies';
export const technologiesPath = (lang: Language) =>
  `${homePath(lang)}#${technologiesAnchor(lang)}`;
export const projectsPath = (lang: Language) =>
  `${homePath(lang)}#${projectAnchor(lang)}`;
export const projectPath = (lang: Language, id: ProjectId) =>
  `${homePath(lang)}${projectAnchor(lang)}/${id}/`;
export const projectPreviewPath = (lang: Language, id: ProjectId) =>
  `${homePath(lang)}#${id}`;
export const experienceAnchor = (lang: Language) =>
  lang === 'es' ? 'experiencia' : 'experience';
export const experiencePath = (lang: Language) =>
  `${homePath(lang)}#${experienceAnchor(lang)}`;
export const homelabPath = (lang: Language) => `${homePath(lang)}#homelab`;
export const routeFromHash = (lang: Language, hash: string): RouteId => {
  const id = hash.slice(1);
  if (projectIds.includes(id as ProjectId)) return id as ProjectId;
  if (id === 'homelab') return 'homelab';
  if (id === technologiesAnchor(lang)) return 'technologies';
  if (id === experienceAnchor(lang)) return 'experience';
  return id === projectAnchor(lang) ? 'projects' : 'home';
};
export const localizedPath = (
  lang: Language,
  route: RouteId,
  context: 'page' | 'preview' = 'page',
) =>
  route === 'home'
    ? homePath(lang)
    : route === 'projects'
      ? projectsPath(lang)
      : route === 'technologies'
        ? technologiesPath(lang)
        : route === 'experience'
          ? experiencePath(lang)
          : route === 'homelab'
            ? homelabPath(lang)
            : context === 'preview'
              ? projectPreviewPath(lang, route)
              : projectPath(lang, route);
