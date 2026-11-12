# Tarea 04: proyectos reales y páginas individuales

Registro de la entrega. [Tarea 05](CONTENIDO_Y_UX.md) retira los avisos públicos
de pendientes, oculta Experiencia sin contenido aprobado y completa Homelab.
El modelo y las instrucciones de integración multimedia siguen vigentes.

Actualización posterior: Camilo pidió que los resúmenes estén siempre visibles.
La sección [Descripciones siempre visibles](#descripciones-siempre-visibles)
sustituye el comportamiento de apertura y cierre registrado en esta entrega.

Se conserva el diseño de Tarea 03: tipografía, paleta provisional, composiciones
propias de los tres proyectos, navegación sticky y comandos visuales de Linux.
La instrucción de esta tarea añade páginas individuales y conserva el resumen
expandible de la portada; sustituye la decisión anterior de redirigir las fichas
hacia hashes. No se implementó el backend ni se desplegó el sitio.

## Rutas y acciones

| Proyecto | Español | Inglés |
| --- | --- | --- |
| DianiMilo | `/es/proyectos/dianimilo/` | `/en/projects/dianimilo/` |
| Nube Camiska | `/es/proyectos/nube-camiska/` | `/en/projects/nube-camiska/` |
| Convertix | `/es/proyectos/convertix/` | `/en/projects/convertix/` |
| Portafolio Camilo Puentes | `/es/proyectos/portafolio/` | `/en/projects/portafolio/` |

La incorporación posterior del portafolio conserva el orden de los tres proyectos
anteriores y añade un cuarto resumen desplegable (`#portafolio`). Sus entradas
Markdown ES/EN documentan el frontend estático, las interacciones, los temas, la
arquitectura del contenido y las comprobaciones existentes. Los enlaces de evidencia
apuntan a una revisión publicada del repositorio; GitHub se abre en otra pestaña.
La ficha no atribuye un backend, despliegue público ni métricas al sitio.

Esta incorporación se validó con formato y tipos sin incidencias, 13 páginas
compiladas y 131 pruebas de navegador aprobadas (67 en escritorio y 64 en móvil
emulado; tres casos de hover omitidos en móvil). Se revisaron capturas reales del
resumen y la ficha en ambos temas, guardadas localmente en `docs/capturas/`.

También se prepararon `/es/homelab/` y `/en/homelab/`. Experiencia está en
`/es/#experiencia` y `/en/#experience`.

- **Ampliar resumen** abre el `details` nativo de la portada, con la transición
  existente de 240 ms. Conserva idioma, historial y hashes anteriores con JS.
- **Ver proyecto** navega a una ficha estática mediante un enlace normal.
- **Abrir demo** abre la aplicación en otra pestaña, con `noopener noreferrer`.
- El selector ES/EN mantiene la ficha equivalente. Desde un resumen de portada
  mantiene el hash. Sin JS, las fichas, demos y enlaces de regreso siguen funcionando;
  el cambio dinámico del hash del resumen sigue requiriendo JS.
- Hover y foco muestran comandos en 180 ms; al salir se restaura la ruta actual.
  Movimiento reducido omite el tipeo. La franja no ejecuta comandos.

## Enlaces y evidencia del contenido

URLs aprobadas, conservadas exactamente:

- DianiMilo: <https://diamilo.camiska.lat/?demo=1#/>
- Nube Camiska: <https://nube.camiska.lat/>

El 11 de noviembre de 2026 se abrieron ambas URLs en contextos nuevos de Chromium.
Respondieron HTTP 200. En DianiMilo se verificó el aviso de datos ficticios y la
navegación a Planes conservando `?demo=1`. En Nube se pulsó «Explorar demo» y se
verificó la vista de archivos ficticios y el aviso de solo lectura. No se utilizaron
credenciales, no se accedió a cuentas personales y no se modificaron archivos.
Esta comprobación cubre el acceso inicial y esa navegación; no certifica todos los
flujos de las aplicaciones ni su disponibilidad futura.

El contenido técnico procede de los repositorios públicos del propietario:

| Proyecto | Archivos contrastados |
| --- | --- |
| [DianiMilo](https://github.com/camilo477/watchlist-plans-goals-pwa) | `README.md`, `package.json`, `src/lib/demoStore.ts` |
| [Nube Camiska](https://github.com/camilo477/nube-camiska) | `README.md`, `package.json`, `src/main.ts` |
| [Convertix](https://github.com/camilo477/Converter-files) | `README.md`, `pyproject.toml`, `src/convertix/adapters/images.py` |

Cada ficha enlaza estas fuentes. Las funcionalidades y decisiones descritas se
limitan a lo documentado en esos archivos; no se atribuyen pruebas ejecutadas en
esos repositorios. Convertix es una aplicación de escritorio Python/PySide6 para
KDE, por lo que no se inventó una demo web. El vídeo de uso se incorporó después
de la revisión de Camilo; su alcance se detalla al final de este documento.

`contribution: null` conserva el detalle de la aportación personal pendiente de
confirmación. Los resúmenes de arquitectura describen componentes documentados;
`architecture.diagram: null` deja pendiente el diagrama. No se publican endpoints
administrativos, topología de red ni configuración privada del homelab.

## Incorporar material auténtico

Cada proyecto tiene contenido en `web/src/content/projects/<id>.es.md` y `.en.md`.
El cuerpo Markdown es el resumen siempre visible de portada. El frontmatter alimenta
la ficha, sus enlaces y los medios. Las carpetas reservadas son:

```text
web/public/media/projects/
  dianimilo/
  nube-camiska/
  convertix/
    images/
    videos/
    captions/
    architecture/
```

Los cuatro subdirectorios existen en los tres proyectos. Guardar solo archivos
aprobados para publicación, optimizados y revisados para evitar datos privados.
No hay capturas, diagramas ni vídeos ficticios en el sitio.

Ejemplo de estructura para **cuando existan los archivos reales**; estas rutas de
ejemplo no están activadas en el contenido:

```yaml
media:
  cover:
    src: /media/projects/convertix/images/portada.webp
    alt: Descripción de la pantalla real, traducida para cada idioma.
    width: 1600
    height: 1000
    caption: Contexto de la captura, opcional.
  gallery:
    - src: /media/projects/convertix/images/conversion.webp
      alt: Descripción de la operación mostrada.
      width: 1600
      height: 1000
  videos:
    - src: /media/projects/convertix/videos/demostracion.webm
      title: Conversión de un archivo
      description: Descripción de lo que se ve en el vídeo real.
      width: 1280
      height: 720
      poster: /media/projects/convertix/images/video.webp
      captions:
        - src: /media/projects/convertix/captions/demo-es.vtt
          lang: es
          label: Español
      transcript: Transcripción o descripción ampliada, opcional.
```

Usar las dimensiones reales; los componentes conservan la proporción y ajustan
el ancho a la pantalla. Las imágenes inferiores y galerías usan `loading="lazy"`;
la portada de una ficha se carga de forma normal. Los vídeos usan controles
nativos, `preload="none"`, reproducción inline y nunca autoplay. Un vídeo sin
audio puede declarar `silent: true`; los demás requieren pistas VTT. Traducir alt,
caption, título, descripción y transcripción en las dos entradas de contenido.

Los esquemas rechazan imágenes sin alt o dimensiones positivas, rutas externas o
fuera de la carpeta del proyecto, medios inexistentes y vídeos con audio sin
subtítulos. Una URL de demo distinta de la aprobada también hace fallar la
validación. Para un diagrama usar la misma estructura de imagen en
`architecture.diagram`. Sin archivos, las galerías se omiten y aparece una nota
breve, sin reservar grandes bloques vacíos.

## Experiencia y Homelab

`web/src/content/experience/es.json` y `en.json` contienen listas vacías.
Cada entrada futura requiere `company`, `role`, `period`, `responsibilities`,
`technologies`, `contributions` y `approvedForPublication: true`. Este último
campo registra la aprobación editorial; no sustituye pedir y obtener autorización
para publicar la información profesional concreta. La validación rechaza entradas
sin esa marca. No se generaron fechas, empresas, cargos ni logros.

Homelab conserva la descripción proporcionada por Camilo sobre Raspberry Pi,
Linux, Docker y alojamiento de sus proyectos web. La documentación de
infraestructura queda pendiente. No se conectó a la Raspberry ni a producción.

## Validación

Las pruebas cubren las seis URLs directas, idioma equivalente, tema persistente,
regreso a Proyectos, hashes antiguos, interacción por teclado y táctil, ausencia de
JS, comandos, movimiento reducido, enlaces internos y accesibilidad con axe en
ambos idiomas, temas y tamaños. Las pruebas de enlaces de demo interceptan la
navegación externa en el navegador para comprobar URL, nueva pestaña y aislamiento
sin depender de la aplicación real. La comprobación pública descrita arriba se
realizó por separado.

`make verify` comprueba formato, tipos, compilación, esquemas de contenido y
pruebas de Chromium. `make screenshots` produce capturas reales de portada,
resúmenes, tecnologías, fichas y Homelab en escritorio, tablet y móvil, en ambos
temas e idiomas, dentro de `docs/capturas/` (ignorado por Git).

La galería y el reproductor también se prueban en una copia temporal con material
sintético identificado exclusivamente como fixture técnico. Ese material no forma
parte del contenido ni de los archivos versionados del portafolio.

Resultados del cierre de esta tarea:

- `make verify`: formato correcto; Astro/TypeScript con 0 errores, 0 advertencias
  y 0 sugerencias; 11 páginas estáticas generadas; 3 pruebas de esquemas y 85
  pruebas de navegador aprobadas. Se omiten 3 casos de hover en móvil, donde
  corresponde comprobar interacción táctil.
- Axe no encontró infracciones en las combinaciones evaluadas de idioma, tema y
  tamaño. Esta comprobación no sustituye una revisión con lector de pantalla.
- Prueba multimedia aislada a 1440 y 390 px: portada, galería y diagrama cargados;
  ningún request del vídeo antes de reproducir; reproducción, pista de subtítulos
  y transcripción disponibles, sin desbordamiento ni errores de JavaScript.
- Capturas completas y de viewport generadas para revisión local. Se inspeccionaron
  visualmente, entre otras, DianiMilo en escritorio claro, Nube Camiska en móvil
  oscuro, Convertix en escritorio oscuro/inglés y la galería de portada.

Quedan pendientes los archivos auténticos de medios, los diagramas, la descripción
aprobada de las contribuciones personales, la experiencia profesional autorizada
y la documentación pública de la infraestructura. La siguiente etapa requiere
la revisión visual de Camilo.

## Vídeo aprobado de Convertix — 12 de noviembre de 2026

Se incorpora la grabación de 44 segundos aprobada por Camilo: JPG → PNG → PDF,
con Dolphin, Convertix, Gwenview y Okular. Procede de una sesión real de KDE/KWin
aislada, capturada con PipeWire; muestra clics, conversiones y apertura de resultados.
Se conserva el archivo JPG original. Se verificaron su hash, los píxeles del PNG
respecto al JPG decodificado y la página del PDF. La entrada es una captura del
portafolio; no aparecen documentos privados ni credenciales.

El vídeo aparece junto a Convertix en la portada y al inicio de sus dos fichas.
El índice lateral incluye la sección de demostración. Por petición de Camilo,
solo se muestra el reproductor: se retiran el título visible, la descripción,
el enlace de descarga y la transcripción debajo del vídeo, tanto en portada como
en las fichas ES/EN. El título se conserva como nombre accesible del reproductor.
Los controles nativos permiten pausa, búsqueda y pantalla completa; el vídeo se
carga al reproducirlo, sin autoplay. Los subtítulos VTT ES/EN seleccionan por
defecto el idioma de la página.

Recursos publicados en `web/public/media/projects/convertix/`:

- `videos/desktop-demo.mp4`: H.264, 1440 × 900, 30 fps, 44 segundos, sin audio.
- `images/desktop-demo.jpg`: fotograma real usado como portada del vídeo.
- `captions/desktop-demo-es.vtt` y `desktop-demo-en.vtt`: 12 bloques por idioma.

Los ensayos, scripts de grabación y archivos de trabajo permanecen en las capturas
locales ignoradas por Git. El vídeo de Homelab no forma parte de este incremento.

Validación de la incorporación inicial: formato correcto, Astro/TypeScript sin errores ni
advertencias y 13 páginas compiladas. Pasaron 4 pruebas de contenido y las suites
completas por separado: 68 pruebas de escritorio y 65 de móvil emulado, con 3 casos
de hover omitidos en móvil. Se verificaron carga bajo demanda, reproducción con
teclado, búsqueda en el vídeo, las dos pistas VTT, transcripción y funcionamiento
sin JavaScript. Se generaron 24 capturas de portada/ficha en ES/EN, claro/oscuro y
escritorio/móvil; se inspeccionaron las vistas del reproductor sin desbordamiento.

Tras simplificar el reproductor, pasan formato, Astro/TypeScript, compilación y
validación de contenido. Pasan 8 pruebas de navegador en escritorio y móvil que
cubren reproducción, subtítulos, teclado, ausencia de JavaScript, enlaces,
desbordamiento y accesibilidad en ambos idiomas y temas. Se generaron 4 capturas
locales y se revisaron visualmente la portada en escritorio y la ficha en móvil.

## Recorrido de DianiMilo y aplicaciones PWA

La grabación aprobada de DianiMilo aparece junto al proyecto en la portada y en
la sección de demostración de sus fichas ES/EN, enlazada desde el índice lateral.
Son 40,83 segundos de navegación por Nosotros, Películas, Planes, Metas, Ruleta
y Zanahoria, con regreso al inicio. La demo utiliza los perfiles ficticios Alex
y Sam. El recorrido solo abre pestañas y desplaza la página.

El reproductor conserva controles nativos, carga bajo demanda y subtítulos ES/EN,
sin autoplay ni textos o enlaces adicionales debajo. Los recursos publicados en
`web/public/media/projects/dianimilo/` son:

- `videos/navigation-tour.mp4`: H.264, 1440 × 900, 30 fps, sin audio.
- `images/navigation-tour.jpg`: fotograma de la grabación.
- `captions/navigation-tour-es.vtt` y `navigation-tour-en.vtt`: siete bloques por idioma.

Las descripciones de DianiMilo y Nube Camiska indican que son aplicaciones web
progresivas (PWA), tanto en portada como en sus fichas y en ambos idiomas. La
clasificación está respaldada por el README y la configuración `VitePWA` de
DianiMilo, y por el README, manifiesto y service worker de Nube Camiska. No se
añaden afirmaciones sobre disponibilidad de archivos privados sin conexión.

Los archivos de trabajo de la grabación permanecen en las capturas locales
ignoradas por Git. Solo se incorporan los cuatro recursos finales al sitio.

Validación: formato correcto, Astro/TypeScript sin errores ni advertencias,
13 páginas compiladas, 4 pruebas de contenido y 135 pruebas de navegador
aprobadas. Se omiten los 3 casos de hover que no corresponden a móvil. La suite
comprueba ambos reproductores, pistas de subtítulos, navegación sin JavaScript,
teclado, idiomas, temas, índice y accesibilidad. Se generaron 24 capturas locales
y se inspeccionaron la portada y la ficha en escritorio y móvil.

## Recorrido de Nube Camiska

El vídeo de 45 segundos muestra una sesión nueva de la demo pública: entrada por
«Explorar demo», Mis archivos, Documentos, Proyectos, vistas de lista y galería,
búsqueda por nombre, Fotos, previsualización de la imagen ficticia, Notas,
Recientes y regreso a Mis archivos. La grabación utiliza exclusivamente el espacio
de demostración de solo lectura. No se suben, editan ni eliminan archivos.

La previsualización de texto dentro del visor no forma parte del recorrido: durante
la grabación, el servidor respondía con `X-Frame-Options: DENY` y el navegador
bloqueaba su iframe. Se muestra la sección Notas con el archivo de ejemplo, sin
atribuirle una lectura dentro del visor que no funcionó. No se modificó la aplicación.

El vídeo aparece junto al proyecto en portada y en sus fichas ES/EN. Conserva
controles nativos, carga bajo demanda, subtítulos seleccionables y ausencia de
autoplay. No hay títulos visibles, transcripción ni enlaces de descarga debajo.
Los recursos finales de `web/public/media/projects/nube-camiska/` son:

- `videos/navigation-tour.mp4`: H.264, 1440 × 900, 30 fps, sin audio.
- `images/navigation-tour.jpg`: fotograma real de Mis archivos.
- `captions/navigation-tour-es.vtt` y `navigation-tour-en.vtt`: once bloques por idioma.

Los originales, scripts y capturas de revisión permanecen locales e ignorados.

Validación: formato y Astro/TypeScript sin incidencias, 13 páginas compiladas,
validación de contenido y 18 pruebas de navegador aprobadas. Se comprueban los
tres vídeos, carga bajo demanda, teclado, subtítulos, búsqueda temporal, navegación
sin JavaScript, enlaces, índice y accesibilidad. Se generaron 18 capturas locales
y se revisaron la portada en escritorio, la ficha en móvil y un fotograma con
subtítulos en ambos tamaños. Los fotogramas del recorrido se revisaron por separado.

## Descripciones siempre visibles

Se retiran «Expand overview / Close overview» y sus equivalentes en español.
`ProjectStory.astro` presenta cada proyecto con encabezado, descripción y cuerpo
Markdown visibles desde el HTML inicial. Los títulos y «Ver proyecto» son enlaces
convencionales a la ficha individual; hover y foco conservan el comando contextual.

Se elimina el controlador de acordeón de proyectos y sus estilos de transición.
Las anclas `#dianimilo`, `#nube-camiska`, `#convertix` y `#portafolio` conservan sus
destinos, historial, idioma y posición bajo los controles. La lectura no requiere
JavaScript. Los vídeos conservan sus controles y carga bajo demanda. Homelab y el
inventario de tecnologías mantienen sus desplegables independientes.

Las pruebas del acordeón retirado se reemplazan por comprobaciones de contenido
visible, enlaces reales, teclado, toque, navegación por anclas y lectura sin
JavaScript. README y el caso de estudio del propio portafolio describen el nuevo
comportamiento en ambos idiomas.

Validación de este ajuste: formato correcto, Astro/TypeScript sin errores ni
advertencias y 13 páginas compiladas. Pasan 4 pruebas de contenido y 127 de
navegador; se omiten 3 casos de hover en móvil. Se generaron 16 capturas de los
proyectos en ES/EN, claro/oscuro y escritorio/móvil. Se inspeccionaron DianiMilo,
Nube Camiska y el propio portafolio con el texto completo visible.
