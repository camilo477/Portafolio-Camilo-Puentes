import type { Language } from '../lib/routes';

// Public sources, SSH inspection and portfolio deployment on 2026-11-12.
// Only sanitized architecture facts belong here; never host configuration.
export const homelabContent = {
  es: {
    eyebrow: 'Raspberry Pi 4 Model B · Debian 13 · ARM64',
    verification:
      'Arquitectura verificada el 12 de noviembre de 2026, incluida la publicación del portafolio. Es una descripción del sistema observado, no un panel de estado en tiempo real.',
    purposeTitle: 'Alojar también es desarrollar',
    purpose:
      'El homelab reúne aplicaciones con necesidades distintas: archivos personales, una aplicación compartida y un punto de entrada privado. El trabajo no termina al compilar la interfaz: también hay que conservar los datos y poder actualizar cada servicio.',
    diagramTitle: 'Del navegador a cada aplicación',
    diagramLabel: 'Arquitectura de aplicaciones del homelab',
    access: 'Navegador → Cloudflare Tunnel',
    connector: 'cloudflared · servicio Linux',
    connectorText:
      'El túnel dirige el portafolio a Nginx y las otras aplicaciones a sus contenedores.',
    host: 'Servidor personal · Raspberry Pi 4 con Debian 13',
    nginx: 'Nginx · servicio independiente',
    nginxText:
      'Sirve el portafolio estático. Nube, DianiMilo y Hub tienen rutas directas a sus contenedores.',
    containers: 'Aplicaciones en contenedores Docker',
    diagramNube: 'Node.js · archivos y demo de solo lectura',
    diagramDiani: 'Node.js + React · aplicación compartida',
    diagramHub: 'Node.js · acceso privado a las aplicaciones',
    portfolioTitle: 'Portafolio Camilo Puentes',
    diagramPortfolio:
      'Astro · sitio estático alojado en la Raspberry Pi y servido por Nginx.',
    persistence: 'Datos fuera de las imágenes',
    persistenceText:
      'Nube usa directorios montados; DianiMilo combina directorios y volúmenes; Hub utiliza un volumen. Los datos persisten fuera de la imagen de cada aplicación.',
    diagramCaption:
      'Cada dominio tiene su propia ruta: el portafolio llega a Nginx; Nube, DianiMilo y Hub llegan a sus contenedores. Se omiten direcciones internas, puertos y configuración privada.',
    servicesTitle: 'Qué aporta cada servicio',
    services: [
      {
        id: 'nube-camiska',
        title: 'Nube Camiska',
        text: 'Organiza archivos desde el navegador. Su despliegue separa los archivos personales del estado y los ejemplos de la demo. Esta separación evita tratar un disco ausente como si fuera una nube personal vacía.',
      },
      {
        id: 'dianimilo',
        title: 'DianiMilo',
        text: 'Reúne películas, planes y metas. La aplicación privada integra Firebase y un servidor Node.js; la demo usa datos ficticios en el navegador y puede compilarse como un sitio estático independiente.',
      },
      {
        id: 'portafolio',
        title: 'Portafolio Camilo Puentes',
        text: 'Este sitio reúne mis proyectos, experiencia y tecnologías. Astro genera los archivos estáticos que sirvo con Nginx en mi Raspberry Pi, sin necesitar una API para consultar el contenido.',
      },
      {
        id: null,
        title: 'Camiska Hub',
        text: 'Es el punto de entrada privado a las aplicaciones. Funciona en su propio contenedor Node.js, con un volumen para conservar sus datos y una ruta independiente del túnel. No es una demo pública.',
      },
    ],
    publishingTitle: 'Servicios Linux y mantenimiento',
    publishing:
      'Docker, cloudflared y Nginx están gestionados por systemd y habilitados para iniciar con el sistema. Cloudflare Tunnel tiene rutas independientes hacia el portafolio, Nube, DianiMilo y Hub. Nginx sirve el portafolio; las otras aplicaciones conservan sus contenedores.',
    scope:
      'Los montajes persistentes y el retorno a una versión anterior resuelven problemas distintos de una copia de seguridad. La recuperación comprobada corresponde a la publicación del sitio estático, no a los archivos personales ni a los datos de las aplicaciones.',
  },
  en: {
    eyebrow: 'Raspberry Pi 4 Model B · Debian 13 · ARM64',
    verification:
      'Architecture checked on November 12, 2026, including the portfolio deployment. This describes the observed system; it is not a live status dashboard.',
    purposeTitle: 'Hosting is part of the work',
    purpose:
      'The homelab brings together applications with different needs: personal files, a shared application and a private entry point. The work continues after building the interface: data must persist and each service needs an update path.',
    diagramTitle: 'From the browser to each application',
    diagramLabel: 'Homelab application architecture',
    access: 'Browser → Cloudflare Tunnel',
    connector: 'cloudflared · Linux service',
    connectorText:
      'The tunnel routes the portfolio to Nginx and the other applications to their containers.',
    host: 'Personal server · Raspberry Pi 4 running Debian 13',
    nginx: 'Nginx · independent service',
    nginxText:
      'Serves the static portfolio. Nube, DianiMilo and Hub have direct routes to their containers.',
    containers: 'Applications in Docker containers',
    diagramNube: 'Node.js · files and a read-only demo',
    diagramDiani: 'Node.js + React · shared application',
    diagramHub: 'Node.js · private access to the applications',
    portfolioTitle: 'Camilo Puentes Portfolio',
    diagramPortfolio:
      'Astro · static site hosted on the Raspberry Pi and served by Nginx.',
    persistence: 'Data outside the images',
    persistenceText:
      'Nube uses bind mounts; DianiMilo combines bind mounts and volumes; Hub uses a volume. Data persists outside each application image.',
    diagramCaption:
      'Each domain has its own route: the portfolio goes to Nginx; Nube, DianiMilo and Hub go to their containers. Internal addresses, ports and private configuration are omitted.',
    servicesTitle: 'The role of each service',
    services: [
      {
        id: 'nube-camiska',
        title: 'Nube Camiska',
        text: 'Organizes files in the browser. Its deployment separates personal files from application state and demo examples. This prevents a missing disk from being treated as an empty personal cloud.',
      },
      {
        id: 'dianimilo',
        title: 'DianiMilo',
        text: 'Brings together watchlists, plans and goals. The private application integrates Firebase and a Node.js server; the demo uses fictional data in the browser and can be built as an independent static site.',
      },
      {
        id: 'portafolio',
        title: 'Camilo Puentes Portfolio',
        text: 'This site brings together my projects, experience and technologies. Astro generates the static files I serve with Nginx on my Raspberry Pi; reading the content requires no API.',
      },
      {
        id: null,
        title: 'Camiska Hub',
        text: 'Provides a private entry point to the applications. It runs in its own Node.js container, with a volume for persistent data and an independent tunnel route. It is not a public demo.',
      },
    ],
    publishingTitle: 'Linux services and maintenance',
    publishing:
      'Docker, cloudflared and Nginx are managed by systemd and enabled at boot. Cloudflare Tunnel has separate routes to the portfolio, Nube, DianiMilo and Hub. Nginx serves the portfolio; the other applications keep their containers.',
    scope:
      'Persistent mounts and returning to a previous version solve different problems from a backup. The tested recovery applies to the static site deployment, not to personal files or application data.',
  },
} satisfies Record<Language, unknown>;
