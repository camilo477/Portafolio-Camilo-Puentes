# Primera entrega — portada e interacción Linux

Fecha: 11 de noviembre de 2026. Alcance: portada bilingüe, proyectos desplegables
y navegación visual Linux.
Esta entrega termina en la revisión visual; no inicia la siguiente etapa.

La ampliación posterior solicitada por Camilo —nombre completo y sección de
tecnologías— se documenta con sus pruebas en [TECNOLOGIAS.md](TECNOLOGIAS.md).
Los resultados siguientes corresponden al incremento de proyectos desplegables.
La composición y paleta actuales se describen en [REDISENO_VISUAL.md](REDISENO_VISUAL.md).

## Decisiones de implementación

Se consultaron la [referencia de Josh W. Comeau](https://www.joshwcomeau.com/),
la [instalación de Astro](https://docs.astro.build/en/install-and-setup/) y su
[API de colecciones](https://docs.astro.build/en/guides/content-collections/).
La aplicación de la referencia sigue la dirección de Camilo: lectura clara, ritmo
editorial y efectos útiles. No se reutilizaron arte, código ni una plantilla ajena.

Resoluciones de alcance:

- La interacción se resuelve con un controlador TypeScript pequeño, sin React.
- El tipeo tiene un objetivo de 180 ms dentro del intervalo previsto de 120–250 ms.
- Tras la revisión de Camilo, Proyectos presenta DianiMilo, Nube Camiska y Convertix
  como filas que se amplían dentro de la portada. Esta petición reemplaza las
  fichas en vistas separadas. El contenido sigue siendo preliminar.
- Se retira «software & Linux» del encabezado, tal como se solicitó.
- No se añaden enlaces vacíos a Experiencia, Contacto, CV o páginas futuras.
- No se identifican los colores como Viking. La confirmación cromática sigue pendiente.

## Sistema visual provisional

Noto Sans aporta lectura consistente y un carácter cercano a interfaces Linux;
JetBrains Mono diferencia rutas y comandos sin convertir toda la página en código.
Ambas fuentes se alojan localmente, con licencias OFL incluidas. No se solicita una
fuente a Google ni se usa una librería visual o de animación.

La composición tiene un margen común y un ancho máximo de 1120 px. Presentación
alineada a la izquierda, nota lateral sobre Linux y lista de proyectos con columnas
alineadas para nombre, descripción y acción. Al abrir una fila aparecen sus notas,
repositorio y espacio para captura o vídeo. En móvil se apilan los bloques y la
navegación ocupa una segunda fila, con ES/EN y tema siempre visibles.
Los bordes de 1 px y radios de 3–4 px remiten a controles de escritorio discretos.

| Token | Claro | Oscuro |
| --- | --- | --- |
| Fondo | `#f7f6f2` | `#191d1f` |
| Superficie | `#eeede7` | `#22282b` |
| Texto | `#292f31` | `#e7e9e5` |
| Texto secundario | `#5a6262` | `#b0bab9` |
| Borde | `#c9cdc6` | `#495254` |
| Acento | `#414f4b` | `#c5d3cc` |
| Enlace | `#304e45` | `#c1d7cc` |
| Foco | `#274c41` | `#d0e5d9` |

Estos valores son un estudio neutral provisional, no una paleta KDE oficial.
El CSS utiliza `light-dark()`: el esquema del sistema funciona también sin JavaScript.
La elección manual se aplica antes de renderizar y se conserva en almacenamiento local.

## Comportamiento implementado

El mapa tipado de rutas y comandos es único. Los enlaces y resúmenes llevan
`data-preview-command`; pointer/focus cambian el estado visual sin interceptar
clics ni Enter. Un `requestAnimationFrame` cancelable escribe el comando en un
tiempo total fijo. Las entradas y salidas próximas se agrupan para evitar un flash
del estado activo. La preferencia del sistema y el control de efectos anulan el tipeo.

Los proyectos utilizan `details/summary` nativos, agrupados para mantener uno
abierto. Clic, tap, Enter y Espacio abren o cierran la fila sin cargar otro documento.
JavaScript añade anclas compartibles (`/es/#convertix`, `/en/#convertix`), historial
y conservación del proyecto al cambiar de idioma. Las URLs anteriores como
`/es/proyectos/dianimilo/` redirigen a la portada con el proyecto seleccionado.
La franja vuelve al proyecto abierto al terminar una previsualización y a
`ls ~/proyectos` al cerrar la fila.

La franja está oculta a lectores de pantalla y no contiene controles ni un campo
de entrada. El contenido, títulos, enlaces, foco visible y enlace para saltar al
contenido conservan su propia semántica. Hay espacio inferior para alcanzar todos
los controles al desplazarse, incluido el área segura de móviles.

Sin JavaScript, los tres proyectos siguen abriéndose y cerrándose, los repositorios
son enlaces normales y se puede cambiar de idioma. La conservación del proyecto
abierto entre idiomas, las anclas, la barra reactiva y la selección manual del tema
dependen de JavaScript. El tema del sistema se aplica mediante CSS.

## Contenido y privacidad

DianiMilo, Nube Camiska y Convertix se describen con el inventario proporcionado, sin afirmar
haber verificado una demo. Cada idioma tiene su Markdown y un esquema validado.
Las contribuciones, tecnologías no confirmadas, resultados y pruebas de los
proyectos permanecen pendientes. El vídeo de Convertix también está pendiente del
material que entregará Camilo. Los marcadores no imitan pantallas reales.

No hay API, solicitudes a servicios administrativos, formularios, estadísticas ni
comandos ejecutables. `api-status/` e `infra/` contienen solo notas de alcance.
Las capturas de esta web son evidencias locales ignoradas por Git; se regeneran
con `npm run screenshots`. Los archivos de configuración privados y secretos están
excluidos. Los materiales de trabajo locales están fuera del seguimiento de Git.

## Verificación ejecutada

Entorno local: Node 24.22.2, Astro 7.4.11, Chromium 156.0.8078.79. `make` selecciona
el Node del proyecto instalado en nvm. Playwright usa el navegador
instalado cuando se proporciona `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

| Comprobación | Resultado |
| --- | --- |
| `npm run lint` | Formato Prettier correcto |
| `npm run check` | 0 errores, 0 advertencias |
| `npm run build` | 9 documentos estáticos: 2 portadas y 7 redirecciones |
| `npm test` | 32 aprobadas, 2 omitidas (hover en móvil táctil) |
| axe, WCAG A/AA | 0 infracciones detectadas en 2 idiomas × 2 temas × 4 estados × 2 tamaños |
| Sin JavaScript | Apertura y cierre de los tres proyectos, enlaces e idioma comprobados |
| Vista estrecha | 320, 390, 768 y 1440 px sin desbordamiento horizontal |
| Capturas | Inicio, lista y cada proyecto ampliado; claro/oscuro, escritorio/móvil |

Se probaron teclado real con Tab/Enter/Espacio, foco y blur, hover y cambios rápidos,
tap, apertura sin solicitudes de otro documento, cierre exclusivo, Atrás/Adelante,
anclas, URLs antiguas, persistencia de tema y movimiento, movimiento reducido y
bloqueo de `localStorage`. Las pruebas identifican `summary` como control nativo
y verifican su nombre accesible, sin forzar un rol ARIA distinto.

La configuración de pruebas usa el puerto 4322, separado del desarrollo en 4321,
y `astro preview --ignore-lock` para mantener el
servidor en primer plano y permitir que Playwright gestione su cierre. No se
conecta a un servidor de desarrollo ajeno. GitHub Actions contiene las mismas
verificaciones con el Chromium de Playwright; su resultado remoto se reporta por
separado del resultado local.

## Revisión visual y auditoría del brief

Se abrieron capturas reales de escritorio y móvil en ambos temas, incluyendo
portadas en español e inglés y los tres proyectos ampliados. Las vistas de inicio y Proyectos
se capturan por separado a 1440×1000 y 390×844; no se altera el CSS para capturarlas.

- Composición: presentación lateral, jerarquía de lectura y proyectos ordenados
  en una lista desplegable. No hay cuadrícula de tarjetas ni hero centrado.
- Identidad: comandos asociados a destinos, nota sobre el entorno y barra de
  navegación. Sin escritorio falso, neón, resplandores ni símbolos animados de relleno.
- Contenido: textos concretos, origen documentado y material faltante identificado.
- Interacción: apertura nativa, indicador de despliegue y tipeo breve; sin aparición por
  scroll, parallax, sonidos, reproducción automática ni esperas artificiales.
- Coherencia: mismos tokens y escala en ambos idiomas; contraste comprobado
  automáticamente en ambos temas. La aprobación estética corresponde a Camilo.

Límites: móvil emulado en Chromium, sin revisión en un dispositivo físico,
Safari/Firefox o lector de pantalla. Axe no constituye una certificación de accesibilidad.
No se publicó el sitio ni se ejecutó código en Raspberry.

## Pendiente de revisión

Recibir el esquema real `.colors` de Plasma; valorar la composición, tipografía,
espaciado y franja de esta primera versión; preparar capturas y contenido verificable.
El siguiente incremento de producto requiere la revisión de Camilo.
