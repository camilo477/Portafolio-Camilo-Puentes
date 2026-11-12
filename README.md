# Portafolio de Camilo Puentes

Portafolio con presentación, tecnologías y fichas de proyectos bilingües. Astro + TypeScript, CSS
propio, contenido Markdown y salida estática. No hay API, base de datos ni despliegue.

## Ejecutar localmente

Desde la raíz, para iniciar el portafolio y abrirlo en el navegador:

```bash
make
```

Abre **http://127.0.0.1:4321/en/**. Inglés es el idioma predeterminado; la versión
en español está en **http://127.0.0.1:4321/es/**. Detener el servidor con **Ctrl+C**.
`make dev` hace lo mismo y `make help` muestra todos los comandos.

Requiere Node **24.22.2** (fijado en `.nvmrc`), npm y GNU Make.
El Makefile utiliza automáticamente esa versión si ya está instalada en nvm
(`NVM_DIR` o `~/.nvm`), sin cambiar la versión global ni requerir `nvm use` en
cada terminal. Si no encuentra esa instalación, comprueba el Node del `PATH`.

Solo al preparar una copia nueva o instalar las dependencias por primera vez:

```bash
nvm install
make install
```

`nvm` es opcional si ya se dispone de la versión requerida de Node.
`make install` se ejecuta la primera vez o cuando cambian las dependencias.

Si el puerto está ocupado, usar `make PORTFOLIO_PORT=4322` y abrir la URL
que indique Astro. El servidor escucha solo en el equipo local.

Para comprobar la salida estática:

```bash
make preview
```

Astro genera `web/dist/`. El contenido no depende de JavaScript para navegar.
`make preview` compila antes de servir; `make build` permite compilar sin arrancar
un servidor. Los scripts `npm run …` originales siguen disponibles.
Los efectos y la selección manual del tema requieren JavaScript; sin él, el tema
sigue el sistema. Las fuentes se sirven localmente, con sus licencias en
`web/public/licenses/`.

## Estructura

```text
web/
  src/
    components/          Resúmenes, acciones, galerías, tecnologías y experiencia
    content/projects/    Tres fichas, cada una en español e inglés
    content/experience/  Solo entradas profesionales aprobadas
    data/                Inventario de tecnologías y contenido verificado de Homelab
    layouts/             HTML, navegación y controles comunes
    lib/                 Traducciones y mapa tipado de rutas/comandos
    pages/               Portadas, seis fichas y redirecciones de Homelab
    scripts/             Proyectos, comandos, tema y movimiento
    styles/              CSS y tokens de color provisionales
  tests/                 Playwright, axe y generación de capturas
  public/                Favicon, licencias y carpetas para medios reales
api-status/              Reservado; Java 21 + Spring Boot en una etapa posterior
infra/                   Reservado; sin conexión a Raspberry
docs/                    Documentación técnica y verificación de la implementación
.github/workflows/       Verificación del frontend, sin despliegue
```

## Alcance de esta versión

- Portada ES/EN con DianiMilo, Nube Camiska, Convertix y el propio portafolio, en ese orden.
  La ficha del portafolio explica su construcción con Astro, TypeScript y CSS propio,
  su arquitectura estática y sus comprobaciones, con enlaces al código en GitHub.
- Título «Portafolio Camilo Puentes» y nombre completo Camilo Alberto Puentes Valencia.
- Tecnologías y lenguajes en ocho categorías: lenguajes, frameworks, bases de datos,
  Linux/infraestructura, datos/BI, IA local, videojuegos/embebidos e ingeniería.
  Cinco áreas principales visibles, aprendizaje/exploración según lo declarado por
  Camilo e inventario complementario por categorías desplegables, también sin JavaScript.
  Se evita repetir las herramientas ya visibles y las compartidas entre categorías.
  Sin porcentajes ni niveles de dominio inventados.
- Navegación a `/es/#tecnologias` y `/en/#technologies`; tecnologías como texto,
  sin enlaces externos ni paradas de teclado, con comandos decorativos en hover.
- Descripciones de los cuatro proyectos siempre visibles en la portada, también sin JavaScript.
  Los títulos y «Ver proyecto» enlazan a las fichas individuales; no hay controles de abrir o cerrar.
- Enlaces directos como `/es/#convertix`, idioma y Atrás/Adelante conservan el
  contexto de lectura. Los hashes de proyecto siguen funcionando como anclas.
- Fichas en `/es/proyectos/{id}/` y `/en/projects/{id}/`, con `id` igual a
  `dianimilo`, `nube-camiska`, `convertix` o `portafolio`, e idiomas equivalentes.
- «Abrir demo» lleva a las URLs reales aprobadas de DianiMilo y Nube Camiska en
  otra pestaña. Convertix es una aplicación de escritorio y enlaza su repositorio.
- Franja visual: hover/foco, tipeo de 180 ms, cancelación y restauración.
- Temas claro/oscuro, preferencia persistente y esquema inicial del sistema.
- Movimiento reducido y control adicional para desactivar efectos.
- Galerías y vídeos preparados; sin archivos se omite la sección multimedia.
  Las capturas reales, diagramas y el detalle de las contribuciones quedan pendientes.
- Experiencia profesional preparada con borrador local excluido de Git. La sección
  y el acceso principal aparecen solo cuando exista contenido aprobado.
- Homelab cierra la portada, después de Tecnologías y de Experiencia cuando haya
  contenido aprobado. Se amplía en la misma página (`/es/#homelab` y `/en/#homelab`), con diagrama
  de la Raspberry, Docker y Cloudflare Tunnel contrastado por SSH de solo lectura.
  Nginx se distingue como servicio estático independiente. Las rutas antiguas
  redirigen al bloque; se conserva apertura nativa sin JavaScript.
- Índice lateral y navegación de secciones en el footer. ES/EN y el control de tema
  están justo encima de «En esta página» en el lateral derecho; en pantallas pequeñas
  permanecen arriba a la derecha. Sin barra de menú ni franja de fondo.
  Los desplazamientos a secciones reservan espacio superior solo cuando hay controles arriba.
- Se conserva el diseño de Tarea 02: proyectos con distintas proporciones,
  acciones visibles y paleta turquesa/ámbar provisional.
- Refinamiento Tarea 03: presentación concreta, nota de homelab sin ilustración
  del escritorio y apertura/cierre de proyectos en 240 ms.
  Movimiento reducido y navegación por historial omiten esa transición.

La paleta **no es una identificación del tema Plasma**. Falta recibir su esquema
real. GitHub, LinkedIn y correo están disponibles; el CV espera el PDF definitivo. React no se añadió: la interacción actual no necesita una isla.

## Verificar

```bash
make browsers
make verify
make screenshots
```

`make lint` comprueba formato con Prettier; `make check` valida Astro y TypeScript.
`make verify` ejecuta formato, tipos, compilación, esquemas de contenido y pruebas en orden.
`make test` y `make screenshots` también compilan antes de ejecutar Playwright.
`make browsers` instala el navegador una vez o al actualizar Playwright.
Playwright inicia y cierra su servidor en el puerto 4322, separado de `make` (4321).
Se puede elegir otro con `PORTFOLIO_TEST_PORT=4323 make test`.
En Linux, si faltan dependencias del navegador, usar
`npx playwright install --with-deps chromium`.

Las capturas reales se generan en `docs/capturas/` (ignoradas por Git). Para usar un
Chromium ya instalado, definir `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` con su ruta.
`ASTRO_TELEMETRY_DISABLED=1` permite ejecutar Astro sin escribir configuración de
telemetría fuera del proyecto, útil en entornos restringidos.

GitHub Actions ejecuta formato, tipos, build y pruebas de Chromium en escritorio
y móvil emulado. La revisión automática no sustituye la revisión visual de Camilo
ni una evaluación manual con lector de pantalla.

## Documentación y archivos versionados

[Entrega, decisiones técnicas y verificación](docs/PRIMERA_ENTREGA.md).
[Sección de tecnologías y actualización del nombre](docs/TECNOLOGIAS.md).
[Rediseño visual, paleta y decisiones de Tarea 02](docs/REDISENO_VISUAL.md).
[Refinamiento de textos, navegación y proyectos de Tarea 03](docs/REFINAMIENTO.md).
[Fichas, demos, fuentes y guía para añadir medios de Tarea 04](docs/PROYECTOS_Y_MULTIMEDIA.md).
[Contenido profesional y ajustes de navegación de Tarea 05](docs/CONTENIDO_Y_UX.md).
[Homelab: evidencia, arquitectura y límites](docs/HOMELAB.md).
[Navegación lateral, enlaces profesionales e idioma predeterminado](docs/NAVEGACION_LATERAL.md).

El repositorio contiene código, contenido del sitio, pruebas, configuración de
compilación e integración continua y documentación técnica. Las instrucciones de
agentes, prompts, el kit de diseño inicial y los prototipos de trabajo se conservan
solo localmente. `.gitignore` también excluye credenciales, dependencias instaladas,
compilaciones, cachés, registros, respaldos y capturas de revisión.

Antes de cada push, revisar `git status`, el diff preparado y la lista completa de
archivos rastreados con `git ls-files`. `git ls-files -ci --exclude-standard` debe
estar vacío: añadir una regla a `.gitignore` no retira archivos ya versionados.

La siguiente etapa queda pendiente de revisión visual y autorización de Camilo.
