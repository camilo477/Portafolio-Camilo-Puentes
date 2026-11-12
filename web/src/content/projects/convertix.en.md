---
projectId: convertix
lang: en
title: Convertix
description: Local document and image conversion from the KDE desktop.
category: File conversion
problem:
  Convert documents and images within the local desktop workflow, without relying on a conversion
  website or sending files to an external service.
features:
  - A Qt Quick radial menu for selecting conversions.
  - Image conversion with Pillow and document conversion using local engines.
  - Tools for merging or splitting PDFs and resizing images.
  - File selection from the application and a command-line interface.
decisions:
  - Conversion engines run locally. The documentation describes outputs separate from the original files
    and limits on conversion processes.
  - The Qt Quick interface connects to Python logic. Available options depend on the file type and installed
    engines.
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
    A desktop application using Python and PySide6, a QML/Qt Quick interface and adapters for local
    conversion engines. Desktop integration targets KDE Plasma and Dolphin.
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

Convertix brings document and image conversion to the KDE desktop. Its radial menu offers operations that process files using local conversion engines.

It is a desktop application. The repository documents the available engines and the limitations of each conversion.
