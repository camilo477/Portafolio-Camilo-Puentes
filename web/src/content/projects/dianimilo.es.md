---
projectId: dianimilo
lang: es
title: DianiMilo
description: Una aplicación web progresiva (PWA) para organizar películas, planes y metas compartidas.
category: Organización compartida
demoNote: Demo con perfiles ficticios. Los cambios se conservan solo en la pestaña actual.
problem:
  Reunir en un mismo lugar las películas por ver, los planes y las metas compartidas, con estados
  que permitan dar seguimiento a cada idea.
features:
  - Lista de películas y series con estados de seguimiento.
  - Planes organizados como ideas, planeados o realizados.
  - Metas con prioridad, listas de tareas y seguimiento de ahorro.
  - Demostración con datos ficticios y una opción para restablecer el ejemplo.
decisions:
  - La demo utiliza un almacén local independiente del acceso privado. Sus cambios se guardan en sessionStorage,
    con respaldo en memoria si el almacenamiento está bloqueado.
  - El modo de demostración no inicializa Firebase ni consulta TMDB. Esto permite explorar ejemplos sin
    compartir credenciales.
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
    Una interfaz React y TypeScript compilada con Vite. La demo usa un almacén local; la aplicación
    privada integra Firebase y un servidor de autenticación Node.js.
  diagram: null
media:
  cover: null
  gallery: []
  videos:
    - src: /media/projects/dianimilo/videos/navigation-tour.mp4
      poster: /media/projects/dianimilo/images/navigation-tour.jpg
      title: Recorrido por las pestañas de DianiMilo
      description:
        41 segundos de navegación por Nosotros, Películas, Planes, Metas, Ruleta y Zanahoria
        en la demo pública. Sin audio; subtítulos ES/EN.
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

DianiMilo reúne películas, planes y metas en un espacio compartido. Su demostración permite recorrer los flujos con perfiles y contenido ficticios.

Los estados de los planes y el seguimiento de las metas se pueden explorar desde la misma interfaz. La página del proyecto detalla la separación entre la demo y el acceso privado.
