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
contribution: null
architecture:
  summary:
    Aplicación de escritorio en Python y PySide6, con interfaz QML/Qt Quick y adaptadores para
    motores de conversión locales. La integración se orienta a KDE Plasma y Dolphin.
  diagram: null
media:
  cover: null
  gallery: []
  videos: []
videoPlanned: true
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
