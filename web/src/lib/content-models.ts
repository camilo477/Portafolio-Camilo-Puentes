import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const mediaPath = (extension: string) =>
  z
    .string()
    .regex(
      new RegExp(
        `^/media/projects/(dianimilo|nube-camiska|convertix|portafolio)/[a-zA-Z0-9_/-]+\\.(${extension})$`,
      ),
    );
export const imageSchema = z.object({
  src: mediaPath('avif|webp|png|jpe?g|svg'),
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: text.optional(),
});
export const videoSchema = z
  .object({
    src: mediaPath('mp4|webm'),
    title: text,
    description: text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    poster: mediaPath('avif|webp|png|jpe?g').optional(),
    silent: z.boolean().default(false),
    captions: z
      .array(
        z.object({
          src: mediaPath('vtt'),
          lang: z.enum(['es', 'en']),
          label: text,
        }),
      )
      .default([]),
    transcript: text.optional(),
  })
  .refine(
    (video) => video.silent || video.captions.length > 0,
    'Videos with audio require captions.',
  );
export const mediaSchema = z
  .object({
    cover: imageSchema.nullable().default(null),
    gallery: z.array(imageSchema).default([]),
    videos: z.array(videoSchema).default([]),
  })
  .default({ cover: null, gallery: [], videos: [] });
export const experienceSchema = z.object({
  lang: z.enum(['es', 'en']),
  entries: z.array(
    z.object({
      approvedForPublication: z.literal(true),
      company: text,
      role: text,
      period: text,
      progression: text.optional(),
      responsibilities: z.array(text).min(1),
      technologies: z.array(text),
      contributions: z.array(text),
    }),
  ),
});
export type ProjectImage = z.infer<typeof imageSchema>;
export type ProjectVideo = z.infer<typeof videoSchema>;
