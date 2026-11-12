import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  imageSchema,
  videoSchema,
  mediaSchema,
  experienceSchema,
} from '../src/lib/content-models.ts';

const image = {
  src: '/media/projects/dianimilo/images/cover.webp',
  alt: 'Project screen description',
  width: 1600,
  height: 1000,
};
const video = {
  src: '/media/projects/convertix/videos/demo.webm',
  title: 'File conversion',
  description: 'Demonstration of local image conversion.',
  width: 1280,
  height: 720,
};

test('empty media is valid; published images require accessible text, dimensions and a project path', () => {
  assert.deepEqual(mediaSchema.parse({}), {
    cover: null,
    gallery: [],
    videos: [],
  });
  assert.equal(imageSchema.safeParse(image).success, true);
  for (const invalid of [
    { ...image, alt: '  ' },
    { ...image, width: 0 },
    { ...image, height: -1 },
    { ...image, src: 'https://example.com/fake.png' },
    { ...image, src: '/media/projects/dianimilo/../../secret.png' },
  ]) {
    assert.equal(imageSchema.safeParse(invalid).success, false);
  }
});

test('videos require descriptive text and captions unless explicitly silent', () => {
  assert.equal(videoSchema.safeParse(video).success, false);
  assert.equal(videoSchema.safeParse({ ...video, silent: true }).success, true);
  assert.equal(
    videoSchema.safeParse({
      ...video,
      captions: [
        {
          src: '/media/projects/convertix/captions/demo-es.vtt',
          lang: 'es',
          label: 'Español',
        },
      ],
    }).success,
    true,
  );
  assert.equal(
    videoSchema.safeParse({ ...video, silent: true, description: '' }).success,
    false,
  );
});

test('experience accepts no entries and rejects entries without explicit publication approval', () => {
  const entry = {
    company: 'Test fixture only',
    role: 'Test role',
    period: 'Test period',
    responsibilities: ['Test responsibility'],
    technologies: ['Python'],
    contributions: [],
  };
  assert.equal(
    experienceSchema.safeParse({ lang: 'es', entries: [] }).success,
    true,
  );
  for (const approval of [undefined, false]) {
    assert.equal(
      experienceSchema.safeParse({
        lang: 'es',
        entries: [{ ...entry, approvedForPublication: approval }],
      }).success,
      false,
    );
  }
  assert.equal(
    experienceSchema.safeParse({
      lang: 'en',
      entries: [{ ...entry, approvedForPublication: true }],
    }).success,
    true,
  );
});
