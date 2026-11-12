---
projectId: nube-camiska
lang: en
title: Nube Camiska
description: A progressive web app (PWA) for personal files, hosted on Linux with Docker.
category: Files and self-hosting
demoNote: On the sign-in screen, choose “Explorar demo”. It uses read-only fictional files.
problem:
  Organize and access files in the browser while keeping each account’s space separate and retaining
  control over hosting.
features:
  - Folders, search by name and sorting by date or size.
  - List and gallery views with media and PDF previews.
  - Multiple uploads with a queue and progress for authorized accounts.
  - A read-only demo with fictional files, separate from personal accounts.
decisions:
  - The frontend uses TypeScript and Vite; the Node.js server manages files without a database.
  - The demo account has its own space and read-only permissions. Visitors can explore examples without
    accessing personal files.
repository: https://github.com/camilo477/nube-camiska
demoUrl: https://nube.camiska.lat/
technologies:
  - TypeScript
  - Vite
  - Node.js
  - Docker
  - Linux
contribution: null
architecture:
  summary:
    A TypeScript web interface, a Node.js server and file-based storage. Docker packages the application
    for Linux; the demo uses the server with a separate storage space.
  diagram: null
media:
  cover: null
  gallery: []
  videos:
    - src: /media/projects/nube-camiska/videos/navigation-tour.mp4
      poster: /media/projects/nube-camiska/images/navigation-tour.jpg
      title: A tour of Nube Camiska's files
      description: >-
        A 45-second tour of the read-only demo: folders, search, list and gallery views,
        a sample image preview, Notes and Recent files. No audio; ES/EN captions.
      width: 1440
      height: 900
      silent: true
      captions:
        - src: /media/projects/nube-camiska/captions/navigation-tour-es.vtt
          lang: es
          label: Español
        - src: /media/projects/nube-camiska/captions/navigation-tour-en.vtt
          lang: en
          label: English
videoPlanned: false
sources:
  - label: README.md
    url: https://github.com/camilo477/nube-camiska/blob/main/README.md
  - label: package.json
    url: https://github.com/camilo477/nube-camiska/blob/main/package.json
  - label: src/main.ts
    url: https://github.com/camilo477/nube-camiska/blob/main/src/main.ts
---

Nube Camiska lets users organize and access files in the browser. It combines folders, search and previews in an interface that adapts to desktop and mobile.

Public access includes a read-only demo with fictional files. Uploading and file management are reserved for authorized accounts.
