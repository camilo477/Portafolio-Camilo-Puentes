---
projectId: nube-camiska
lang: es
title: Nube Camiska
description: Un servicio de archivos personal, con operación en Linux y Docker.
category: Archivos y alojamiento propio
demoNote: En la pantalla de acceso, elige «Explorar demo». Utiliza archivos ficticios de solo lectura.
problem:
  Organizar y consultar archivos desde el navegador, manteniendo espacios independientes por cuenta
  y control sobre su alojamiento.
features:
  - Organización en carpetas, búsqueda por nombre y orden por fecha o tamaño.
  - Vista de lista o galería y previsualización de archivos multimedia y PDF.
  - Subidas múltiples con cola y progreso para las cuentas autorizadas.
  - Demo de solo lectura con archivos ficticios, separada de las cuentas personales.
decisions:
  - El frontend utiliza TypeScript y Vite; el servidor Node.js gestiona archivos sin una base de datos.
  - La cuenta de demostración tiene su propio espacio y permisos de solo lectura. Permite explorar ejemplos
    sin exponer archivos personales.
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
    Interfaz web en TypeScript, servidor Node.js y almacenamiento en archivos. Docker empaqueta
    la aplicación para su operación en Linux; la demo utiliza el servidor con un espacio separado.
  diagram: null
media:
  cover: null
  gallery: []
  videos: []
videoPlanned: false
sources:
  - label: README.md
    url: https://github.com/camilo477/nube-camiska/blob/main/README.md
  - label: package.json
    url: https://github.com/camilo477/nube-camiska/blob/main/package.json
  - label: src/main.ts
    url: https://github.com/camilo477/nube-camiska/blob/main/src/main.ts
---

Nube Camiska permite organizar y consultar archivos desde el navegador. Combina carpetas, búsqueda y previsualización con una interfaz adaptada a escritorio y móvil.

El acceso público ofrece una demo de solo lectura con archivos ficticios. Las operaciones de subida y administración pertenecen a las cuentas autorizadas.
