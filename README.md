# Portafolio de Camilo Puentes

Primera entrega para revisar composición e interacción. Astro + TypeScript, CSS
propio, contenido Markdown y salida estática. No hay API, base de datos ni despliegue.

## Ejecutar localmente

Requiere Node **24.22.2** (fijado en `.nvmrc`), npm y GNU Make. Desde la raíz:

```bash
nvm install
nvm use
make install
make dev
```

Abrir **http://127.0.0.1:4321/es/** o **http://127.0.0.1:4321/en/**.
`nvm` es opcional si ya se dispone de la versión requerida de Node.
`make install` se ejecuta la primera vez o cuando cambian las dependencias.
Para las siguientes sesiones basta con `nvm use` y `make dev`.
Detener el servidor con **Ctrl+C**. `make help` muestra todos los comandos.

Si el puerto está ocupado, usar `make dev PORTFOLIO_PORT=4322` y abrir la URL
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
    components/          Marcador explícito de capturas pendientes
    content/projects/    Dos proyectos, cada uno en español e inglés
    layouts/             HTML, navegación y controles comunes
    lib/                 Traducciones y mapa tipado de rutas/comandos
    pages/               Portadas y fichas mínimas bilingües
    scripts/             Comandos, tema y movimiento
    styles/              CSS y tokens neutrales provisionales
  tests/                 Playwright, axe y generación de capturas
  public/                Favicon y licencias
api-status/              Reservado; Java 21 + Spring Boot en una etapa posterior
infra/                   Reservado; sin conexión a Raspberry
docs/                    Documentación técnica y verificación de la implementación
.github/workflows/       Verificación del frontend, sin despliegue
```

## Alcance de esta versión

- Portada ES/EN y fichas mínimas de DianiMilo y Nube Camiska.
- Navegación por enlaces, ancla Proyectos, rutas directas y Atrás/Adelante.
- Franja visual: hover/foco, tipeo de 180 ms, cancelación y restauración.
- Temas claro/oscuro, preferencia persistente y esquema inicial del sistema.
- Movimiento reducido y control adicional para desactivar efectos.
- Capturas de proyectos pendientes, identificadas como tales. No se simulan demos.

La paleta **no es una identificación del tema Plasma**. Falta recibir su esquema
real. Las demás secciones, el CV, el contacto y los casos completos no están
implementados. React no se añadió: la interacción actual no necesita una isla.

## Verificar

```bash
make browsers
make verify
make screenshots
```

`make lint` comprueba formato con Prettier; `make check` valida Astro y TypeScript.
`make verify` ejecuta formato, tipos, compilación y pruebas en orden.
`make test` y `make screenshots` también compilan antes de ejecutar Playwright.
`make browsers` instala el navegador una vez o al actualizar Playwright.
Playwright inicia y cierra su servidor en el puerto 4321: dejarlo libre antes de probar.
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

El repositorio contiene código, contenido del sitio, pruebas, configuración de
compilación e integración continua y documentación técnica. Las instrucciones de
agentes, prompts, el kit de diseño inicial y los prototipos de trabajo se conservan
solo localmente. `.gitignore` también excluye credenciales, dependencias instaladas,
compilaciones, cachés, registros, respaldos y capturas de revisión.

Antes de cada push, revisar `git status`, el diff preparado y la lista completa de
archivos rastreados con `git ls-files`. `git ls-files -ci --exclude-standard` debe
estar vacío: añadir una regla a `.gitignore` no retira archivos ya versionados.

La siguiente etapa queda pendiente de revisión visual y autorización de Camilo.
