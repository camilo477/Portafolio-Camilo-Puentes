---
projectId: dianimilo
lang: en
title: DianiMilo
description: A progressive web app (PWA) for organizing shared watchlists, plans and goals.
category: Shared planning
demoNote: Demo with fictional profiles. Changes stay in the current browser tab.
problem:
  Bring watchlists, plans and shared goals into one place, with clear states for following each
  idea through.
features:
  - Movie and series watchlists with tracking states.
  - Plans grouped as ideas, planned activities or completed activities.
  - Goals with priorities, checklists and savings progress.
  - A demo with fictional data and an option to reset the examples.
decisions:
  - The demo uses a local store independent of private access. Changes are saved in sessionStorage, with
    an in-memory fallback when storage is blocked.
  - Demo mode does not initialize Firebase or query TMDB. Visitors can explore examples without sharing
    credentials.
repository: https://github.com/camilo477/watchlist-plans-goals-pwa
demoUrl: https://diamilo.camiska.lat/?demo=1#/
technologies:
  - React
  - TypeScript
  - Vite
  - Firebase
  - Node.js
contribution: null
architecture:
  summary:
    A React and TypeScript interface built with Vite. The demo uses a local store; the private
    application integrates Firebase and a Node.js authentication server.
  diagram: null
media:
  cover: null
  gallery: []
  videos:
    - src: /media/projects/dianimilo/videos/navigation-tour.mp4
      poster: /media/projects/dianimilo/images/navigation-tour.jpg
      title: A tour of DianiMilo's tabs
      description:
        A 41-second tour of Our space, Movies, Plans, Goals, Roulette and Zanahoria
        in the public demo. No audio; ES/EN captions.
      width: 1440
      height: 900
      silent: true
      captions:
        - src: /media/projects/dianimilo/captions/navigation-tour-es.vtt
          lang: es
          label: Español
        - src: /media/projects/dianimilo/captions/navigation-tour-en.vtt
          lang: en
          label: English
videoPlanned: false
sources:
  - label: README.md
    url: https://github.com/camilo477/watchlist-plans-goals-pwa/blob/main/README.md
  - label: package.json
    url: https://github.com/camilo477/watchlist-plans-goals-pwa/blob/main/package.json
  - label: src/lib/demoStore.ts
    url: https://github.com/camilo477/watchlist-plans-goals-pwa/blob/main/src/lib/demoStore.ts
---

DianiMilo brings watchlists, plans and goals into a shared space. Its demo lets visitors explore the workflows using fictional profiles and content.

Plan states and goal tracking are available within the same interface. The project page explains how the demo is separated from private access.
