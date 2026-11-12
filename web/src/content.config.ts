import { existsSync } from 'node:fs';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectIds, languages } from './lib/routes';
import {
  experienceSchema,
  imageSchema,
  mediaSchema,
} from './lib/content-models';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      projectId: z.enum(projectIds),
      lang: z.enum(languages),
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string().min(1),
      repository: z.url().startsWith('https://github.com/camilo477/'),
      demoUrl: z
        .enum([
          'https://nube.camiska.lat/',
          'https://diamilo.camiska.lat/?demo=1#/',
        ])
        .nullable()
        .default(null),
      demoNote: z.string().nullable().default(null),
      problem: z.string().nullable().default(null),
      features: z.array(z.string().min(1)).default([]),
      technologies: z.array(z.string().min(1)).default([]),
      contribution: z.string().nullable().default(null),
      decisions: z.array(z.string().min(1)).default([]),
      architecture: z
        .object({
          summary: z.string().nullable(),
          diagram: imageSchema.nullable(),
        })
        .default({ summary: null, diagram: null }),
      media: mediaSchema,
      videoPlanned: z.boolean().default(false),
      sources: z
        .array(
          z.object({
            label: z.string().min(1),
            url: z.url().startsWith('https://github.com/camilo477/'),
          }),
        )
        .default([]),
    })
    .superRefine((project, ctx) => {
      const { cover, gallery, videos } = project.media;
      const paths = [
        cover?.src,
        project.architecture.diagram?.src,
        ...gallery.map((image) => image.src),
        ...videos.flatMap((video) => [
          video.src,
          video.poster,
          ...video.captions.map((track) => track.src),
        ]),
      ].filter((path): path is string => Boolean(path));
      for (const path of paths) {
        if (
          !path.startsWith(`/media/projects/${project.projectId}/`) ||
          !existsSync(new URL(`../public${path}`, import.meta.url))
        )
          ctx.addIssue({
            code: 'custom',
            message: `Media must exist and belong to ${project.projectId}: ${path}`,
          });
      }
      const demos = {
        dianimilo: 'https://diamilo.camiska.lat/?demo=1#/',
        'nube-camiska': 'https://nube.camiska.lat/',
        convertix: null,
        portafolio: null,
      };
      if (project.demoUrl !== demos[project.projectId])
        ctx.addIssue({
          code: 'custom',
          message: 'Demo URL must match the approved project URL exactly.',
        });
    }),
});
const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: experienceSchema,
});
export const collections = { projects, experience };
