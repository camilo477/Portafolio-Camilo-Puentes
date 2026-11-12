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
contribution: >-
  I built the Python, PySide6 and QML interface and its Dolphin entry point to work with
  selected files. I moved file analysis and conversion into cancellable tasks with progress
  and error reporting, keeping the interface responsive while local engines run. I made
  available options depend on file content and installed tools, and added output validation
  before saving results beside the original without overwriting it. This connects document and
  image conversion to a desktop workflow: choose files, run an operation and open the result
  from the file manager.
architecture:
  summary:
    A desktop application using Python and PySide6, a QML/Qt Quick interface and adapters for local
    conversion engines. Desktop integration targets KDE Plasma and Dolphin.
  diagram: null
media:
  cover: null
  gallery: []
  videos:
    - src: /media/projects/convertix/videos/desktop-demo.mp4
      poster: /media/projects/convertix/images/desktop-demo.jpg
      title: From JPG to PNG and PDF on KDE
      description:
        44 seconds of actual use with Dolphin, Convertix, Gwenview and Okular. Two local conversions,
        opening the results and keeping the original file. No audio; ES/EN captions.
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
        00:00 — From Dolphin, open a JPG screenshot of the portfolio in Gwenview.
        00:06 — Choose “Convertir…” from Dolphin’s context menu, then select PNG in Convertix.
        00:15 — Open the generated PNG in Gwenview to check the image.
        00:22 — Back in Dolphin, select the PNG and convert it to PDF with Convertix.
        00:31 — Open the PDF in Okular and check the page containing the image.
        00:40 — Dolphin shows the original JPG, PNG and PDF together.
videoPlanned: false
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
