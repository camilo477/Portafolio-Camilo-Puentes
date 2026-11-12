import type { Language } from '../lib/routes';

// Public sources plus an authorized, read-only SSH inspection on 2026-11-11.
// Only sanitized architecture facts belong here; never host configuration.
export const homelabSources = [
  {
    label: 'Nube Camiska · Dockerfile',
    url: 'https://github.com/camilo477/nube-camiska/blob/c9864bde816d67036be6edc708eaf0528bdbd4a1/Dockerfile',
  },
  {
    label: 'Nube Camiska · deploy-raspberry.sh',
    url: 'https://github.com/camilo477/nube-camiska/blob/c9864bde816d67036be6edc708eaf0528bdbd4a1/scripts/deploy-raspberry.sh',
  },
  {
    label: 'DianiMilo · Dockerfile',
    url: 'https://github.com/camilo477/watchlist-plans-goals-pwa/blob/76470e40c830f4039b074ebc1f88866aed3db8ac/Dockerfile',
  },
  {
    label: 'DianiMilo · nginx.conf',
    url: 'https://github.com/camilo477/watchlist-plans-goals-pwa/blob/76470e40c830f4039b074ebc1f88866aed3db8ac/docker/nginx.conf',
  },
  {
    label: 'Camiska Hub · README',
    url: 'https://github.com/camilo477/camiska-hub/blob/53d20f55b5445fc44af41451908268c8ad12e26b/README.md',
  },
  {
    label: 'Camiska Hub · Dockerfile',
    url: 'https://github.com/camilo477/camiska-hub/blob/53d20f55b5445fc44af41451908268c8ad12e26b/Dockerfile',
  },
];

export const homelabContent = {
  es: {
    eyebrow: 'Raspberry Pi 4 Model B · Debian 13 · ARM64',
    verification:
      'Arquitectura verificada mediante una revisión SSH de solo lectura el 11 de noviembre de 2026. Es una descripción del sistema observado, no un panel de estado en tiempo real.',
    purposeTitle: 'Alojar también es desarrollar',
    purpose:
      'El homelab reúne aplicaciones con necesidades distintas: archivos personales, una aplicación compartida y un punto de entrada privado. El trabajo no termina al compilar la interfaz: también hay que conservar los datos y poder actualizar cada servicio.',
    diagramTitle: 'Del navegador a cada aplicación',
    diagramLabel: 'Arquitectura de aplicaciones del homelab',
    access: 'Navegador → Cloudflare Tunnel',
    connector: 'cloudflared · servicio Linux',
    connectorText:
      'Cada aplicación tiene una ruta del túnel hacia su contenedor.',
    host: 'Servidor personal · Raspberry Pi 4 con Debian 13',
    nginx: 'Nginx · servicio independiente',
    nginxText:
      'Sirve contenido estático. No interviene en las rutas del túnel de estas tres aplicaciones.',
    containers: 'Aplicaciones en contenedores Docker',
    diagramNube: 'Node.js · archivos y demo de solo lectura',
    diagramDiani: 'Node.js + React · aplicación compartida',
    diagramHub: 'Node.js · acceso privado a las aplicaciones',
    persistence: 'Datos fuera de las imágenes',
    persistenceText:
      'Nube usa directorios montados; DianiMilo combina directorios y volúmenes; Hub utiliza un volumen. Los datos persisten fuera de la imagen de cada aplicación.',
    diagramCaption:
      'El túnel dirige las solicitudes a los servicios de Docker. Nginx se muestra por separado porque su configuración inspeccionada no contiene un proxy hacia estas aplicaciones. Se omiten direcciones, puertos y configuración privada.',
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
        id: null,
        title: 'Camiska Hub',
        text: 'Es el punto de entrada privado a las aplicaciones. Funciona en su propio contenedor Node.js, con un volumen para conservar sus datos y una ruta independiente del túnel. No es una demo pública.',
      },
    ],
    operationTitle: 'Actualizar sin perder el punto de retorno',
    operationIntro:
      'El script de despliegue de Nube Camiska hace explícitas las decisiones de operación:',
    operation: [
      {
        title: 'Comprobar el almacenamiento',
        text: 'Antes de iniciar el nuevo contenedor, revisa la disponibilidad del disco personal y conserva separados el estado de la aplicación y la demo.',
      },
      {
        title: 'Construir y sustituir',
        text: 'Construye la nueva imagen y mantiene el contenedor anterior mientras arranca el reemplazo con los montajes persistentes.',
      },
      {
        title: 'Comprobar la respuesta',
        text: 'Solo da por terminado el despliegue cuando la aplicación responde. Si falla, el script intenta recuperar el contenedor anterior.',
      },
    ],
    recovery:
      'Esto describe el código del repositorio, no una prueba de recuperación realizada en producción. Volver al contenedor anterior recupera una versión de la aplicación; no sustituye una copia de los archivos.',
    publishingTitle: 'Servicios Linux y mantenimiento',
    publishing:
      'Docker, cloudflared y Nginx están gestionados por systemd y habilitados para iniciar con el sistema. Cloudflare Tunnel tiene rutas independientes hacia Nube, DianiMilo y Hub. Nginx mantiene un sitio estático separado; no está entre el túnel y los contenedores.',
    scope:
      'Los montajes persistentes y el retorno a una versión anterior resuelven problemas distintos de una copia de seguridad. La revisión no incluyó reinicios, despliegues ni una restauración de datos; no se presenta como un ensayo de recuperación.',
    sourceTitle: 'Fuentes del caso',
    sourceNote:
      'Estos archivos explican las aplicaciones y su despliegue. La relación actual entre el túnel, Nginx y los contenedores se contrastó directamente en el servidor, sin publicar su configuración.',
  },
  en: {
    eyebrow: 'Raspberry Pi 4 Model B · Debian 13 · ARM64',
    verification:
      'Architecture checked through a read-only SSH inspection on November 11, 2026. This describes the observed system; it is not a live status dashboard.',
    purposeTitle: 'Hosting is part of the work',
    purpose:
      'The homelab brings together applications with different needs: personal files, a shared application and a private entry point. The work continues after building the interface: data must persist and each service needs an update path.',
    diagramTitle: 'From the browser to each application',
    diagramLabel: 'Homelab application architecture',
    access: 'Browser → Cloudflare Tunnel',
    connector: 'cloudflared · Linux service',
    connectorText: 'Each application has a tunnel route to its container.',
    host: 'Personal server · Raspberry Pi 4 running Debian 13',
    nginx: 'Nginx · independent service',
    nginxText:
      'Serves static content. It is outside the tunnel routes for these three applications.',
    containers: 'Applications in Docker containers',
    diagramNube: 'Node.js · files and a read-only demo',
    diagramDiani: 'Node.js + React · shared application',
    diagramHub: 'Node.js · private access to the applications',
    persistence: 'Data outside the images',
    persistenceText:
      'Nube uses bind mounts; DianiMilo combines bind mounts and volumes; Hub uses a volume. Data persists outside each application image.',
    diagramCaption:
      'The tunnel routes requests to Docker services. Nginx is separate because its inspected configuration has no proxy to these applications. Addresses, ports and private configuration are omitted.',
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
        id: null,
        title: 'Camiska Hub',
        text: 'Provides a private entry point to the applications. It runs in its own Node.js container, with a volume for persistent data and an independent tunnel route. It is not a public demo.',
      },
    ],
    operationTitle: 'Updating with a way back',
    operationIntro:
      'Nube Camiska’s deployment script makes its operational decisions explicit:',
    operation: [
      {
        title: 'Check storage',
        text: 'Before starting the new container, it checks the personal disk and keeps application state and the demo separate.',
      },
      {
        title: 'Build and replace',
        text: 'It builds the new image and keeps the previous container while starting its replacement with persistent mounts.',
      },
      {
        title: 'Check the response',
        text: 'Deployment is complete only when the application responds. If it fails, the script attempts to restore the previous container.',
      },
    ],
    recovery:
      'This describes repository code, not a recovery exercise performed in production. Returning to the previous container recovers an application version; it does not replace a file backup.',
    publishingTitle: 'Linux services and maintenance',
    publishing:
      'Docker, cloudflared and Nginx are managed by systemd and enabled at boot. Cloudflare Tunnel has separate routes to Nube, DianiMilo and Hub. Nginx serves a separate static site; it is not between the tunnel and the containers.',
    scope:
      'Persistent mounts and returning to a previous version solve different problems from a backup. The inspection did not include restarts, deployments or a data restore; it is not presented as a recovery exercise.',
    sourceTitle: 'Case sources',
    sourceNote:
      'These files explain the applications and their deployment. The current relationship between the tunnel, Nginx and the containers was checked on the server without publishing its configuration.',
  },
} satisfies Record<Language, unknown>;
