---
projectId: convertix
lang: es
title: Convertix
description: Conversión local de documentos e imágenes desde el escritorio KDE.
category: Conversión de archivos
problem:
  Convertir documentos e imágenes desde el entorno de trabajo local, sin depender de una web de
  conversión ni enviar los archivos a un servicio externo.
features:
  - Menú radial en Qt Quick para seleccionar conversiones.
  - Conversión de imágenes con Pillow y de documentos con motores locales.
  - Herramientas para unir o dividir PDF y redimensionar imágenes.
  - Selección de archivos desde la aplicación y una interfaz de línea de comandos.
decisions:
  - Los motores se ejecutan localmente. La documentación describe resultados separados del archivo original
    y límites para los procesos de conversión.
  - La interfaz Qt Quick se conecta a la lógica Python. Las opciones dependen del tipo de archivo y de los
    motores disponibles.
repository: https://github.com/camilo477/Converter-files
demoUrl: null
technologies:
  - Python
  - PySide6
  - Qt Quick / QML
  - Pillow
  - LibreOffice
  - Tesseract
contribution: >-
  Desarrollé la interfaz en Python, PySide6 y QML y su entrada desde Dolphin para trabajar con
  los archivos seleccionados. Separé el análisis y la conversión en tareas cancelables, con
  avisos de progreso y errores, para mantener la interfaz disponible mientras trabajan los
  motores locales. Hice que las opciones dependieran del contenido y de las herramientas
  instaladas, y que los resultados se validaran antes de guardarlos junto al original, sin
  sobrescribirlo. El flujo permite convertir documentos e imágenes, abrir el resultado y
  continuar desde el explorador.
architecture:
  summary:
    Aplicación de escritorio en Python y PySide6, con interfaz QML/Qt Quick y adaptadores para
    motores de conversión locales. La integración se orienta a KDE Plasma y Dolphin.
  diagram: null
media:
  cover: null
  gallery: []
  videos:
    - src: /media/projects/convertix/videos/desktop-demo.mp4
      poster: /media/projects/convertix/images/desktop-demo.jpg
      title: De JPG a PNG y PDF en KDE
      description:
        44 segundos de uso real con Dolphin, Convertix, Gwenview y Okular. Dos conversiones locales,
        apertura de los resultados y conservación del archivo original. Sin audio; subtítulos ES/EN.
      width: 1440
      height: 900
      silent: true
      captions:
        - src: /media/projects/convertix/captions/desktop-demo-es.vtt
          lang: es
          label: Español
        - src: /media/projects/convertix/captions/desktop-demo-en.vtt
          lang: en
          label: English
      transcript: |
        00:00 — Abrimos en Gwenview una captura JPG del portafolio desde Dolphin.
        00:06 — En el menú contextual de Dolphin, seleccionamos «Convertir…» y elegimos PNG en Convertix.
        00:15 — Abrimos el PNG generado en Gwenview para comprobar la imagen.
        00:22 — Volvemos a Dolphin, seleccionamos el PNG y lo convertimos a PDF con Convertix.
        00:31 — Abrimos el PDF en Okular y comprobamos la página con la imagen.
        00:40 — Dolphin muestra el JPG original, el PNG y el PDF juntos.
videoPlanned: false
sources:
  - label: README.md
    url: https://github.com/camilo477/Converter-files/blob/main/README.md
  - label: pyproject.toml
    url: https://github.com/camilo477/Converter-files/blob/main/pyproject.toml
  - label: src/convertix/adapters/images.py
    url: https://github.com/camilo477/Converter-files/blob/main/src/convertix/adapters/images.py
---

Convertix lleva la conversión de documentos e imágenes al escritorio KDE. Su menú radial permite elegir operaciones y utiliza motores locales para procesar los archivos.

Es una aplicación de escritorio. El repositorio documenta los motores disponibles y las limitaciones de cada conversión.
