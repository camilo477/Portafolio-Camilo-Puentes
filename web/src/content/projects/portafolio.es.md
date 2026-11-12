---
projectId: portafolio
lang: es
title: Portafolio Camilo Puentes
description: 'Cómo está construido este sitio: contenido estático, diseño propio y navegación con identidad Linux.'
category: Diseño y desarrollo web
problem:
  Reunir proyectos, decisiones técnicas y código en un sitio fácil de recorrer desde el móvil o con teclado,
  con una identidad visual propia y contenido equivalente en español e inglés.
features:
  - Resúmenes de proyectos siempre visibles en la portada y casos técnicos con URL propia.
  - Navegación en español e inglés que conserva el proyecto o la sección al cambiar de idioma.
  - Temas claro y oscuro con preferencia persistente y elección inicial según el sistema.
  - Franja inferior que previsualiza comandos al pasar el cursor o enfocar un enlace y recupera la ruta activa al salir.
  - Inventario de tecnologías por categorías y una sección Homelab desplegable en la misma página.
  - Índice contextual de lectura en escritorio y enlaces a repositorios, demos y perfiles profesionales.
decisions:
  - Astro genera HTML estático a partir de componentes y contenido Markdown. La lectura y los enlaces no dependen de una API ni de una base de datos.
  - TypeScript añade sincronización de rutas, historial, preferencias y comandos sobre elementos HTML nativos. Los resúmenes se muestran completos y sus enlaces funcionan sin JavaScript.
  - El CSS propio define tipografía, composición responsive y tokens separados para ambos temas. Los comandos aportan contexto de navegación y nunca ejecutan una shell.
  - Las microinteracciones respetan el movimiento reducido y pueden desactivarse. El foco visible y los enlaces convencionales conservan la navegación por teclado.
  - Playwright comprueba navegación, idiomas, temas, móvil y ausencia de JavaScript; axe revisa los estados incluidos en las pruebas. GitHub Actions está configurado para ejecutar formato, tipos, compilación y pruebas.
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
contribution: >-
  Construí el sitio con Astro, TypeScript y CSS propio, separando las fichas Markdown de la
  presentación para mantener ambas traducciones desde una estructura común. El reto fue dar
  identidad Linux a la navegación sin convertirla en una terminal: coordiné comandos, foco,
  historial e idioma conservando enlaces convencionales. Incorporé temas persistentes y
  ajustes para móvil y movimiento reducido. Añadí recorridos Playwright a GitHub Actions y
  preparé la publicación estática en mi Raspberry Pi con Nginx y Cloudflare Tunnel,
  manteniendo el contenido accesible sin una API.
architecture:
  summary:
    El monorepositorio concentra el sitio en web/. Las fichas Markdown se validan mediante esquemas
    y alimentan tanto los resúmenes de portada como las páginas individuales. Los componentes Astro
    generan el HTML, el CSS define la presentación y pequeños módulos TypeScript gestionan la
    interacción. La compilación produce archivos estáticos en web/dist/, que Nginx sirve
    desde mi Raspberry Pi como parte del homelab, con acceso mediante Cloudflare Tunnel.
  diagram: null
media:
  cover: null
  gallery: []
  videos: []
sources:
  - label: Configuración de Astro
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/astro.config.mjs
  - label: Colecciones y validación del contenido
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/src/content.config.ts
  - label: Interacción de la franja de comandos
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/web/src/scripts/commands.ts
  - label: Comprobaciones en GitHub Actions
    url: https://github.com/camilo477/Portafolio-Camilo-Puentes/blob/325bf39369a376a386001257876adf2498b50ad3/.github/workflows/frontend.yml
---

Este es el sitio que estás recorriendo. Astro genera sus páginas a partir de componentes y fichas de proyecto en Markdown. TypeScript coordina las interacciones y el CSS propio define la composición, los temas y la adaptación a móvil.

El portafolio está alojado en mi Raspberry Pi como sitio estático servido por Nginx, junto a los proyectos del homelab. Cloudflare Tunnel conecta el dominio público con este servicio.

La identidad Linux aparece en los encabezados y en la franja inferior: los comandos acompañan la navegación sin ejecutar una terminal. Los resúmenes de los proyectos están siempre visibles; el historial, los enlaces directos y el selector ES/EN conservan el contexto de lectura.

El desarrollo se organiza por incrementos revisables. Playwright comprueba los recorridos de navegación en escritorio y móvil, incluidos teclado, temas y uso sin JavaScript. El repositorio contiene el código, las pruebas y las decisiones de implementación.
