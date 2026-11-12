# Tecnologías y nombre — incremento de la portada

Registro de la primera implementación. La presentación y la distinción posterior
de aprendizaje/exploración se actualizan en [REDISENO_VISUAL.md](REDISENO_VISUAL.md),
según la petición más reciente de Camilo.

## Alcance y contenido

El título del navegador es «Portafolio Camilo Puentes» en ES y «Camilo Puentes
Portfolio» en EN. El encabezado principal muestra «Camilo Alberto Puentes Valencia».

En la revisión posterior, Camilo pidió retirar el enlace textual «camilo / puentes»
de la cabecera. Se elimina esa marca y sus estilos; la navegación conserva Inicio,
Proyectos, Tecnologías, ES/EN y tema. El nombre completo permanece en la portada.

Se incorpora el inventario proporcionado por Camilo, tanto en su mensaje como en
el adjunto. Su petición explícita de omitir experiencia prevalece sobre la propuesta
del adjunto de diferenciar niveles. No hay porcentajes, rangos, etiquetas de dominio,
años, descripciones de experiencia ni prioridades profesionales inferidas.

Ocho categorías agrupan los nombres: lenguajes y desarrollo; frameworks y bibliotecas;
bases de datos; Linux, infraestructura y DevOps; datos, BI y analítica; IA y modelos
locales; videojuegos y sistemas embebidos; ingeniería de software. Protocolos,
autenticación y prácticas de pruebas se agrupan en ingeniería. Bash scripting se
consolida con Bash / Shell. Las herramientas compartidas entre áreas usan referencias
al mismo registro, sin duplicar sus datos.

## Presentación e interacción

La sección se integra después de Proyectos, con un enlace visible en la navegación.
El título humano está acompañado por `$ cat ~/skills/stack.yaml`. Los lenguajes
se presentan como una lista editorial abierta; las otras siete categorías utilizan
`details/summary` nativos e independientes. Las claves monoespaciadas recuerdan un
archivo de configuración, sin simular una terminal ni su salida.

Los nombres son enlaces convencionales a documentación o fuentes del proyecto.
Hover y foco reutilizan el controlador de la franja inferior: Python muestra
`python3 --version`, Java `java -version`, PostgreSQL `psql --version`, Docker
`docker ps`, Git `git log --oneline`, Bash `echo $SHELL` y Kubernetes
`kubectl get pods`. Para herramientas sin comando específico se conserva el comando
de la sección. No se ejecutan comandos ni se muestran resultados.

Se conservan la cancelación del tipeo, movimiento reducido y ajuste de animación.
En móvil, las categorías se abren con un toque y los enlaces navegan normalmente.
Sin JavaScript, listas, enlaces y desplegables siguen funcionando. La sincronización
de la franja y del ancla al alternar ES/EN necesita JavaScript, como en el resto del sitio.
El cambio de idioma conserva la sección; los desplegables de tecnologías empiezan
cerrados en el nuevo idioma. No se guardan sus estados en almacenamiento.

Las rutas son `/es/#tecnologias` y `/en/#technologies`. La sincronización de proyectos
respeta esta sección al cerrar un proyecto mediante navegación o Atrás/Adelante.
No se crean páginas nuevas ni se cambia el backend.

## Archivos y extensión

- `web/src/data/technologies.ts`: inventario, categorías y tipos explícitos. El campo
  opcional `projects` permite asociaciones verificadas con los proyectos existentes;
  actualmente ninguna está asignada. No se infieren relaciones a partir de los ejemplos.
- `TechnologySection.astro` y `TechnologyList.astro`: estructura y listas semánticas.
- `web/src/styles/technologies.css`: composición adaptable, con los tokens neutrales
  provisionales existentes. No se añaden dependencias, logos, tarjetas ni colores.
- Layout, portada, traducciones, rutas y controladores existentes: nombre, navegación
  y comandos. `technologies.spec.ts` prueba los recorridos de la nueva sección.

Las capturas reales se guardan localmente en `docs/capturas/` y siguen ignoradas por
Git, junto con los documentos de instrucciones originales y los archivos privados.

## Validación ejecutada

Entorno: Node 24.22.2 y Chromium 156.0.8078.79. Servidor de pruebas en 4322,
independiente del servidor de desarrollo en 4321.

| Comprobación | Resultado |
| --- | --- |
| `make lint` | Formato correcto |
| `make check` | 22 archivos; 0 errores, 0 advertencias, 0 sugerencias |
| `make build` | 9 documentos estáticos generados |
| `npm test` | 49 aprobadas y 3 omitidas: hover no disponible en táctil |
| Accesibilidad automatizada | Sin infracciones axe en las categorías abiertas, ES/EN y ambos temas/tamaños; se mantienen los recorridos de proyectos |
| Teclado y navegación | Tab, Enter, foco visible, enlaces convencionales, Atrás/Adelante y cambio de idioma |
| Sin JavaScript | Apertura/cierre de todas las categorías y enlaces en ambos idiomas, con ratón y toque |
| Movimiento | Comandos completos con movimiento reducido; cancelación al cambiar de objetivo y restauración al salir |
| Adaptación | 320, 390, 768 y 1440 px, sin desbordamiento horizontal ni enlaces enfocados tapados por la franja |
| `npm run screenshots` | 1 prueba aprobada; 16 capturas nuevas de Tecnologías, más las vistas existentes actualizadas |

Se revisaron visualmente capturas reales del nombre completo y de la sección en
escritorio y móvil, ambos temas y textos ES/EN. Los nombres largos se distribuyen
en varias líneas y la lista pasa de tres columnas a dos. Se conserva una composición
editorial con categorías desplegables, sin mosaicos de tarjetas ni indicadores de nivel.

Se revisaron 81 destinos de referencia. Se corrigió un enlace obsoleto de Stable
Diffusion. MySQL y Raspberry Pi bloquearon la petición automatizada directa, pero
sus páginas oficiales se pudieron consultar mediante búsqueda web. El manual GNU
de Bash bloqueó o agotó ambas consultas; se conserva su dirección oficial conocida,
sin afirmar una comprobación HTTP satisfactoria. No se ejecutaron comandos del inventario.

Estos resultados son locales. No equivalen a una auditoría manual con lector de
pantalla ni al resultado remoto de GitHub Actions. La revisión estética final sigue
correspondiendo a Camilo.
