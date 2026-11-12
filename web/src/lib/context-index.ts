import { copy } from './i18n';
import {
  commands,
  homeAnchor,
  projectAnchor,
  technologiesAnchor,
  experienceAnchor,
  type Language,
} from './routes';

export interface IndexEntry {
  id: string;
  label: string;
  command: string;
  number?: string;
}

export function homeIndex(
  lang: Language,
  hasExperience: boolean,
): IndexEntry[] {
  const t = copy[lang];
  return [
    {
      id: homeAnchor(lang),
      label: t.home,
      command: commands.home,
      number: '01',
    },
    {
      id: technologiesAnchor(lang),
      label: t.technologies,
      command: commands.technologies,
      number: '02',
    },
    ...(hasExperience
      ? [
          {
            id: experienceAnchor(lang),
            label: t.experienceShort,
            command: commands.experience,
            number: '03',
          },
        ]
      : []),
    {
      id: projectAnchor(lang),
      label: t.projects,
      command: commands.projects,
      number: '04',
    },
    {
      id: 'homelab',
      label: t.homelab,
      command: commands.homelab,
      number: '05',
    },
  ];
}
