import { getCollection } from 'astro:content';
import type { Language } from './routes';

export async function publishedExperience(lang: Language) {
  const content = await getCollection(
    'experience',
    ({ data }) => data.lang === lang,
  );
  return content
    .flatMap(({ data }) => data.entries)
    .filter((entry) => entry.approvedForPublication === true);
}
