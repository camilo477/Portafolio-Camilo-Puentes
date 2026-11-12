import type { Language } from '../lib/routes';

// Public source revisions checked for Tarea 05. No deployment state is inferred.
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
    eyebrow: 'Raspberry Pi · Linux · aplicaciones propias',
    purposeTitle: 'Alojar también es desarrollar',
    purpose:
      'El homelab reúne aplicaciones con necesidades distintas: archivos personales, una aplicación compartida y un punto de entrada privado. El trabajo no termina al compilar la interfaz: también hay que conservar los datos y poder actualizar cada servicio.',
    diagramTitle: 'Un servidor, servicios separados',
    diagramLabel: 'Arquitectura de aplicaciones del homelab',
    host: 'Servidor personal · Raspberry Pi con Linux',
    containers: 'Aplicaciones en contenedores Docker',
    diagramNube: 'Node.js · archivos y demo de solo lectura',
    diagramDiani: 'Node.js + React · aplicación compartida',
    diagramHub: 'Node.js · acceso privado a las aplicaciones',
    persistence: 'Datos fuera de las imágenes',
    persistenceText:
      'Nube separa archivos, estado y demo. DianiMilo y Hub documentan volúmenes persistentes para sus datos de aplicación.',
    diagramCaption:
      'Esquema de componentes basado en los repositorios públicos y el alojamiento descrito por Camilo. Representa las aplicaciones, no la topología de red ni el estado actual del servidor.',
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
        text: 'Es el punto de entrada privado a las aplicaciones. El repositorio documenta un servidor Node.js y persistencia para sus datos. Se presenta aquí su función dentro del homelab; no es una demo pública.',
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
    publishingTitle: 'Publicación web y límites del esquema',
    publishing:
      'Los Dockerfiles actuales de las tres aplicaciones ejecutan Node.js. DianiMilo también conserva una configuración Nginx para servir el frontend estático, con reglas de caché y resolución de rutas. Ese archivo no demuestra que Nginx sea hoy el proxy del homelab.',
    scope:
      'La configuración de acceso externo y una restauración completa de datos no forman parte de la evidencia comprobada para este caso. El esquema se limita a los componentes documentados.',
    sourceTitle: 'Fuentes del caso',
    sourceNote:
      'Archivos públicos consultados; enlaces fijados a la revisión examinada.',
  },
  en: {
    eyebrow: 'Raspberry Pi · Linux · personal applications',
    purposeTitle: 'Hosting is part of the work',
    purpose:
      'The homelab brings together applications with different needs: personal files, a shared application and a private entry point. The work continues after building the interface: data must persist and each service needs an update path.',
    diagramTitle: 'One server, separate services',
    diagramLabel: 'Homelab application architecture',
    host: 'Personal server · Raspberry Pi running Linux',
    containers: 'Applications in Docker containers',
    diagramNube: 'Node.js · files and a read-only demo',
    diagramDiani: 'Node.js + React · shared application',
    diagramHub: 'Node.js · private access to the applications',
    persistence: 'Data outside the images',
    persistenceText:
      'Nube separates files, state and demo data. DianiMilo and Hub document persistent volumes for application data.',
    diagramCaption:
      'Component diagram based on the public repositories and hosting described by Camilo. It represents the applications, not network topology or the server’s current state.',
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
        text: 'Provides a private entry point to the applications. Its repository documents a Node.js server and persistent application data. This case describes its role in the homelab; it is not a public demo.',
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
    publishingTitle: 'Web publishing and the scope of the diagram',
    publishing:
      'The current Dockerfiles for all three applications run Node.js. DianiMilo also retains an Nginx configuration for its static frontend, including caching and route resolution. That file does not establish that Nginx currently acts as the homelab’s proxy.',
    scope:
      'The external access configuration and a full data restore are outside the evidence verified for this case. The diagram is limited to documented components.',
    sourceTitle: 'Case sources',
    sourceNote: 'Public files consulted, linked to the examined revision.',
  },
} satisfies Record<Language, unknown>;
