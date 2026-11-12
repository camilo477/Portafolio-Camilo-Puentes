# Tarea 03 — refinamiento del portafolio

## Alcance

Se mantiene la paleta provisional de Tarea 02, las fuentes, el orden de los
proyectos, sus proporciones y el diseño de las cinco áreas del stack principal.
No se añaden páginas, dependencias, backend ni despliegues.

La petición nueva reemplaza la ilustración del escritorio y la decisión anterior
de enlazar las tecnologías a documentación. Las referencias históricas de otras
entregas describen su versión, no la interfaz actual.

## Textos y contenido

- Presentación: «Desarrollador backend y full stack» y el texto exacto suministrado
  sobre Python, Django, React, PostgreSQL, integraciones y servicios Linux.
  La versión inglesa utiliza una traducción natural, también en la metadescripción.
- Homelab: el texto suministrado describe la Raspberry Pi como servidor personal
  para proyectos web, servicios Linux, contenedores Docker y despliegues. Se
  integra como una nota editorial junto a la presentación, sin tarjeta o dibujo.
  Conserva `cd ~/homelab` y su preview visual. No se enlaza a una página futura
  que todavía no existe.
- Se retiran «En mi escritorio», su SVG, los textos Linux/KDE de ese bloque y los
  subtítulos generales de Proyectos y Tecnologías. La identidad Linux y la nota
  sobre la paleta KDE provisional permanecen en sus ubicaciones correspondientes.
- Los nombres de tecnologías son `span`, sin URL, subrayado, cursor de enlace,
  `tabindex` ni manejador de clic. El hover de comandos es decorativo. El teclado
  recorre las acciones reales: navegación, proyectos, inventario y preferencias.
- Se eliminan openpyxl, Streamlit, Microsoft Fabric, Azure Data Services,
  AWS Data Services y Databricks del inventario y de los datos utilizados por
  todas las vistas. Se actualiza el texto de exploración en ambos idiomas.
  Spring Boot conserva «En aprendizaje»; el resto del stack principal no cambia.
- Los enlaces reales a repositorios y al perfil de GitHub se conservan.

## Apertura y cierre

Los proyectos siguen siendo `details/summary`, con apertura exclusiva mediante
el atributo `name`. El navegador gestiona clic, toque, Enter, Espacio y el estado
accesible; JavaScript sincroniza el hash, el historial y la consola.

Se añade un contenedor `.project-reveal` y se anima la fila de CSS Grid de
`::details-content` entre `0fr` y `1fr`, durante **240 ms**. El contenido define su
altura natural: no hay `max-height` arbitrario, mediciones de texto ni temporizadores
de apertura. `content-visibility` usa transición discreta para permitir el cierre.
La técnica se activa mediante `@supports`; los navegadores sin esas capacidades
conservan el desplegable nativo funcional, con apertura inmediata.

La referencia de la plataforma es
[MDN: `::details-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content).
Se utiliza Grid para evitar depender de la interpolación experimental de tamaños
intrínsecos.

Se alinean texto y medios desde arriba dentro de las composiciones existentes,
evitando que el título cambie de posición al crecer su propio contenido. El
anclaje de scroll del navegador compensa el cierre de un proyecto anterior;
se comprueba que el siguiente título permanezca visible bajo la cabecera.

`prefers-reduced-motion` y el ajuste manual existente desactivan la transición,
incluido el pseudoelemento. Los enlaces directos y Atrás/Adelante resuelven el
estado sin transición mediante `data-instant`, antes de posicionar las anclas.
Los clics rápidos invierten la transición actual de CSS, sin colas de animación.

## Cabecera y anclas

`BaseLayout.astro` envuelve los controles en `.header-inner`; `.site-header` ocupa
todo el ancho y usa `position: sticky`, `top: 0`, fondo opaco del tema y `z-index`.
Permanece en el flujo del documento, sin salto al comenzar el scroll. El padre es
`body`, sin un contenedor con overflow que limite el sticky.

`header.ts` mide la altura real mediante `ResizeObserver` y actualiza
`--header-height` cuando cambian las fuentes, el ancho o el tamaño del texto.
`scroll-padding-block` reserva espacio para la cabecera y la consola inferior;
se mantienen los márgenes de los elementos enfocados. Hay valores CSS de respaldo
para escritorio y móvil si JavaScript está desactivado.

La comprobación existente que mantiene visible el proyecto activado considera
ahora el borde inferior de la cabecera. El enlace «Saltar al contenido» tiene una
prioridad de apilamiento superior, y los controles móviles se distribuyen en dos
filas compactas.

## Archivos

- `web/src/lib/i18n.ts`, `web/src/pages/[lang]/index.astro`, `home.css`: contenido
  bilingüe y nota de homelab; se elimina `EnvironmentNote.astro`.
- `TechnologyList.astro`, `TechnologySection.astro`, `technologies.ts` y
  `technologies.css`: inventario textual y retirada de las seis herramientas.
- `ProjectDisclosure.astro`, `projects.css`, `projects.ts`: transición nativa,
  restauración de estado y ajuste de visibilidad con la cabecera.
- `BaseLayout.astro`, `global.css` y el nuevo `scripts/header.ts`: sticky y anclas.
- `tests/refinements.spec.ts`, `tests/technologies.spec.ts` y
  `playwright.config.ts`: nuevas comprobaciones y actualización de recorridos.
- README y documentación de las iteraciones: estado actual y decisiones.

## Validación y revisión visual

- `make verify`: formato aprobado; Astro/TypeScript, cero errores, advertencias
  o sugerencias; build estático correcto, nueve documentos generados.
- Playwright con Chromium: **67 pruebas aprobadas y 3 omitidas** porque hover no
  aplica al dispositivo táctil. Incluye ES/EN, claro/oscuro, teclado, ratón,
  móvil emulado, movimiento reducido, preferencias y funcionamiento sin JavaScript.
- Nuevas pruebas: cabecera visible y opaca al desplazarse, controles accesibles,
  anclas sin ocultarse, texto ampliado, transición con alturas intermedias al
  abrir/cerrar, contenido dinámico, clics rápidos, historial y ausencia de navegación
  en los nombres de tecnologías. Se verifica la retirada de las seis herramientas.
- Se registra la posición durante la animación: abrir/cerrar el mismo proyecto
  no desplaza el viewport; al cerrar un proyecto anterior, el título del siguiente
  permanece bajo la cabecera. El historial restaura la altura sin transición.
- axe no detecta infracciones en las 40 combinaciones existentes de idioma, tema,
  dispositivo y estados de proyectos/inventario.
- Comprobación adicional de homelab: hover y restauración del comando correctos
  en ambos idiomas.
- Capturas: `npm run screenshots`, una prueba aprobada, 66 imágenes en
  `docs/capturas/`, excluidas de Git. Se revisaron la portada clara en móvil y oscura
  en escritorio, tecnologías oscuras en inglés, proyectos claros en tablet y
  Convertix ampliado en móvil. No se afirma haber inspeccionado cada archivo.

La revisión conserva la jerarquía, paleta y distribución aprobadas. La eliminación
del dibujo y los subtítulos deja más protagonismo al contenido, sin añadir tarjetas
decorativas ni efectos ajenos a la tarea. Las capturas de los proyectos siguen
siendo espacios explícitamente pendientes.

Las pruebas usan Chromium; no se realizó una evaluación manual con lector de
pantalla ni se probó en dispositivos físicos o motores Safari/Firefox.
