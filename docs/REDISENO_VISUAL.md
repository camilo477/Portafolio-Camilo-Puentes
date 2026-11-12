# Tarea 02 — rediseño visual

Registro de la segunda iteración. Los cambios posteriores de textos, tecnologías,
cabecera y transiciones se describen en [REFINAMIENTO.md](REFINAMIENTO.md).

## Alcance y decisiones

Segunda iteración solicitada por Camilo sobre la portada existente. Se conservan
Astro, salida estática, idiomas, temas, preferencias, enlaces y apertura de proyectos
dentro de la portada. No se incorpora backend ni una página nueva.

La paleta suministrada en Tarea 02 reemplaza el estudio neutral anterior, pero sigue
siendo provisional: no identifica el tema instalado de KDE ni se presenta como Viking.
La nueva petición de separar aprendizaje/exploración reemplaza la instrucción anterior
de omitir toda distinción. Se utilizan únicamente las indicaciones ya proporcionadas.

## Referencia y composición propia

Se consultó y capturó la [portada de Josh W. Comeau](https://www.joshwcomeau.com/).
La referencia combina una cabecera cromática reconocible, jerarquía editorial y una
columna lateral secundaria. Se toma la intención de diferenciar zonas y recorridos;
no se copian nubes, ilustraciones, colores, código ni recursos de su sitio.

- **Portada:** nombre en dos líneas, apellido en turquesa y presentación profesional
  con mayor peso. El entorno Linux se integra mediante una composición SVG original
  de planos geométricos, referencias a KDE Plasma y una nota superpuesta sobre homelab.
  La pieza es una ilustración, no una captura ni una representación de servicios activos.
- **DianiMilo:** composición destacada sobre superficie turquesa, texto a la izquierda
  y espacio de captura amplio a la derecha.
- **Nube Camiska:** texto a la derecha, espacio de captura a la izquierda y referencias
  Linux/Docker ya presentes en su descripción. La superficie verde distingue el caso.
- **Convertix:** proporción panorámica para vídeo y un acento ámbar. El indicador de
  vídeo pendiente es estático; no simula un reproductor funcional.
- **Tecnologías:** cinco áreas principales con distinta jerarquía tipográfica y una
  sección secundaria de aprendizaje/exploración. Un solo desplegable nativo abre el
  inventario completo; se retiran las siete filas repetidas de «Explorar».

Los tres espacios de medios están visibles antes de ampliar un proyecto. Sus marcas
de encuadre indican el lugar reservado a material real. No se fabrican capturas, formatos
de conversión, infraestructura, estados, números ni asociaciones con proyectos.

## Tipografía y microinteracciones

Se conservan Noto Sans Variable y JetBrains Mono, alojadas localmente. Noto permite
mantener continuidad y lectura cómoda; se cambia el peso, la escala y la composición.
JetBrains queda reservada a comandos, claves y rutas, con mayor contraste cromático.

La navegación incorpora prefijos decorativos `~/` y `./`, ocultos a lectores de
pantalla. Los comandos de encabezado separan prompt, programa y argumentos por color.
La franja inferior sigue siendo única, con un cursor estable y borde acentuado durante
la previsualización. «Vista previa» sustituye «Destino», ya que algunos comandos son
referencias a herramientas y no a navegación.

Solo se animan brevemente la flecha de apertura, el signo del inventario, un plano de
la ilustración y el tipeo existente. Se respeta tanto movimiento reducido como el
ajuste manual. No hay aparición por scroll, parallax, neón ni reproducción automática.

## Tokens y contraste

| Función | Claro | Oscuro |
| --- | --- | --- |
| Fondo | `#F2F0E9` | `#131B22` |
| Superficie | `#E1E7E5` | `#212D35` |
| Superficie elevada | `#FAF8F3` | `#273740` |
| Texto | `#25343C` | `#EFF3F3` |
| Texto secundario | `#53656F` | `#A9B8C0` |
| Turquesa | `#176D79` | `#80C5C8` |
| Ámbar | `#83521B` | `#E2B675` |
| Verde | `#356C55` | `#81BBA5` |

Las superficies turquesa, ámbar y verde se derivan por separado para cada tema. No
se utilizan gradientes ni inversión automática de colores.

Tres colores claros suministrados requerían ajuste para texto normal: el secundario
`#61737D` daba 3,94:1 sobre la superficie; el ámbar `#96621E`, 4,13:1; y el verde
`#508C76`, 3,13:1. Se sustituyen por los de la tabla. Entre las seis superficies claras
utilizadas, los mínimos resultantes son 4,81:1, 5,22:1 y 4,86:1, respectivamente.
El turquesa original se conserva: su mínimo es 4,76:1. Los valores oscuros suministrados
se conservan. Los contrastes se comprueban también en el navegador con axe.

## Contenido técnico y estados

El stack principal sigue las cinco áreas que Camilo priorizó: Python/Django/DRF,
JavaScript/TypeScript/React, Java/Spring, SQL/PostgreSQL/Oracle y Linux/Docker.
Spring Boot lleva una indicación explícita de aprendizaje; no se presenta como dominio.
La exploración reúne Spring, Lua, Microsoft Fabric, Azure Data Services, AWS Data
Services y Databricks, según el inventario previo. No se asignan niveles al resto.
El inventario completo y los enlaces de documentación permanecen disponibles.

Los proyectos siguen usando `details/summary`: Enter, Espacio o toque abren el caso
sin cargar otro documento. Se mantienen anclas, historial, traducción de la sección
y redirecciones antiguas. Las capturas se separan de la descripción ampliada para
evitar que el contenido visual dependa de abrir el caso.

El controlador de comandos distingue movimiento real del ratón de los eventos
`pointerenter` que puede provocar el scroll. Estos últimos no sustituyen un foco
de teclado. Esto corrige un fallo detectado al desplazar una ficha hasta el foco.

## Organización

- `CommandLabel.astro`: encabezados de comando reutilizables.
- `EnvironmentNote.astro` y `home.css`: composición de portada y arte vectorial propio.
- `ProjectDisclosure.astro`, `MediaPlaceholder.astro` y `projects.css`: casos y medios.
- `TechnologySection.astro`, `TechnologyList.astro`, `technologies.ts` y
  `technologies.css`: áreas principales, exploración e inventario completo.
- `global.css`: tokens, tipografía, navegación, foco y franja común.
- `commands.ts`: prioridad de foco frente a eventos causados por scroll.
- Pruebas y capturas: recorridos existentes adaptados a la nueva presentación.

No se añadieron dependencias, fuentes, imágenes descargadas ni datos de backend.

## Validación y auditoría visual

- `make lint`, `make check` y `make build`: aprobados. Astro informa cero errores,
  advertencias o sugerencias; la compilación produce nueve documentos estáticos.
- Suite de Playwright: **51 pruebas aprobadas y 3 omitidas** porque las pruebas de
  hover no aplican al dispositivo táctil. Se comprueban navegación, apertura inline,
  historial, funcionamiento sin JavaScript, teclado, cambios rápidos de hover,
  idioma, temas, persistencia y movimiento reducido.
- axe: cero infracciones detectadas en 40 combinaciones de idioma, tema,
  dispositivo y estados de los proyectos/inventario. No sustituye una revisión
  manual con lector de pantalla, que no se realizó en esta entrega.
- Anchos de 320, 390, 768 y 1440 px: sin desbordamiento horizontal ni controles
  tapados por la franja inferior en las comprobaciones automatizadas.
- Capturas del navegador: **66 imágenes** locales en `docs/capturas/`, con
  escritorio (1440 px), tablet (820 px) y móvil (390 px), ambos temas e idiomas.
  Se inspeccionaron capturas de portada, proyectos, casos ampliados y tecnologías;
  no se da por revisado cada archivo individual. Las capturas se excluyen de Git.

La revisión detectó y corrigió dos problemas: el tamaño mínimo de los placeholders
provocaba desbordamiento a 320 px, y un puntero inmóvil podía sustituir el comando
del elemento enfocado cuando el navegador hacía scroll. Las pruebas se ejecutaron
de nuevo después de ambas correcciones.

La auditoría visual comprueba una portada asimétrica,
composiciones diferentes para los tres proyectos, jerarquía tipográfica de áreas
técnicas y color con función. No se introducen un hero centrado, cuadrículas de
tarjetas idénticas, gradientes, brillos, efectos de cristal, fondos cuadriculados,
métricas inventadas ni textos publicitarios. Los comandos acompañan etiquetas
legibles y conservan la navegación convencional.

Pendientes de contenido: capturas y vídeo reales de los proyectos, documentación
completa de Convertix y confirmación de la paleta del escritorio KDE de Camilo.
La entrega termina aquí para permitir su revisión visual; no incluye despliegue.
