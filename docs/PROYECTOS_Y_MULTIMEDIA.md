# Tarea 04: proyectos reales y páginas individuales

Registro de la entrega. [Tarea 05](CONTENIDO_Y_UX.md) retira los avisos públicos
de pendientes, oculta Experiencia sin contenido aprobado y completa Homelab.
El modelo y las instrucciones de integración multimedia siguen vigentes.

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
KDE, por lo que no se inventó una demo web. Su vídeo de uso queda pendiente.

`contribution: null` conserva el detalle de la aportación personal pendiente de
confirmación. Los resúmenes de arquitectura describen componentes documentados;
`architecture.diagram: null` deja pendiente el diagrama. No se publican endpoints
administrativos, topología de red ni configuración privada del homelab.

## Incorporar material auténtico

Cada proyecto tiene contenido en `web/src/content/projects/<id>.es.md` y `.en.md`.
El cuerpo Markdown es el resumen ampliable de portada. El frontmatter alimenta
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
