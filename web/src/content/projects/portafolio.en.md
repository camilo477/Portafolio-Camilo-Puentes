---
projectId: portafolio
lang: en
title: Camilo Puentes Portfolio
description: 'How this site is built: static content, custom design and navigation inspired by Linux.'
category: Web design and development
problem:
  Bring projects, technical decisions and source code together in a site that works on mobile and with
  a keyboard, with its own visual identity and equivalent content in English and Spanish.
features:
  - Project descriptions always visible on the home page and technical case studies with their own URLs.
  - English and Spanish navigation that preserves the project or section when switching languages.
  - Light and dark themes with a saved preference and an initial choice based on the system setting.
  - A bottom bar that previews commands on hover or focus and restores the current route when leaving a link.
  - A categorized technology inventory and a Homelab section that expands on the same page.
  - A contextual reading index on desktop and links to repositories, demos and professional profiles.
decisions:
  - Astro generates static HTML from components and Markdown content. Reading and following links require no API or database.
  - TypeScript adds route, history, preference and command synchronization to native HTML elements. Project descriptions are fully visible and their links work without JavaScript.
  - Custom CSS defines typography, responsive layouts and separate tokens for both themes. Commands provide navigation context and never execute a shell.
  - Microinteractions respect reduced motion and can be disabled. Visible focus and conventional links preserve keyboard navigation.
  - Playwright checks navigation, languages, themes, mobile layouts and use without JavaScript; axe checks the tested states. GitHub Actions is configured to run formatting, type checks, builds and tests.
repository: https://github.com/camilo477/Portafolio-Camilo-Puentes
demoUrl: null
technologies:
  - Astro
  - TypeScript
  - HTML
  - CSS
  - Markdown
  - Playwright
  - axe-core
  - GitHub Actions
contribution: null
architecture:
  summary:
    The monorepo keeps the site in web/. Markdown entries are validated against schemas and supply both
    home page overviews and individual case studies. Astro components generate the HTML, CSS handles
    presentation and small TypeScript modules manage interaction. The build produces static files in
    web/dist/, ready to be hosted on my Raspberry Pi as part of the homelab.
  diagram: null
media:
  cover: null
  gallery: []
  videos: []
sources:
  - label: Astro configuration
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/astro.config.mjs
  - label: Content collections and validation
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/src/content.config.ts
  - label: Command bar interaction
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/src/scripts/commands.ts
  - label: GitHub Actions checks
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/.github/workflows/frontend.yml
---

This is the site you are browsing. Astro generates its pages from components and Markdown project entries. TypeScript coordinates interactions, while custom CSS defines the layout, themes and mobile presentation.

The portfolio is ready to be hosted as a static site on my Raspberry Pi alongside the homelab projects.

The Linux identity appears in the headings and bottom bar: commands accompany navigation without running a terminal. Project descriptions are always visible; history, direct links and the ES/EN switch preserve the reading context.

Development is organized into reviewable increments. Playwright checks desktop and mobile navigation, including keyboard use, themes and browsing without JavaScript. The repository contains the source code, tests and implementation decisions.
