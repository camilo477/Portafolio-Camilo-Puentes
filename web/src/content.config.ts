import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectIds, languages } from './lib/routes';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    projectId: z.enum(projectIds),
    lang: z.enum(languages),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    media: z.enum(['screenshot', 'video']).default('screenshot'),
    repository: z.url().startsWith('https://github.com/camilo477/'),
  }),
});

export const collections = { projects };
