# Portafolio de Camilo Puentes

Primera entrega para revisar composición e interacción. Astro + TypeScript, CSS
propio, contenido Markdown y salida estática. No hay API, base de datos ni despliegue.

## Ejecutar localmente

Desde la raíz, para iniciar el portafolio y abrirlo en el navegador:

```bash
make
```

Abre **http://127.0.0.1:4321/es/**. La versión en inglés está en
**http://127.0.0.1:4321/en/**. Detener el servidor con **Ctrl+C**.
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
    components/          Proyectos desplegables, tecnologías y material pendiente
    content/projects/    Tres proyectos, cada uno en español e inglés
    data/                Inventario tipado de tecnologías y categorías
    layouts/             HTML, navegación y controles comunes
    lib/                 Traducciones y mapa tipado de rutas/comandos
    pages/               Portadas bilingües y redirección de URLs anteriores
    scripts/             Proyectos, comandos, tema y movimiento
    styles/              CSS y tokens neutrales provisionales
  tests/                 Playwright, axe y generación de capturas
  public/                Favicon y licencias
api-status/              Reservado; Java 21 + Spring Boot en una etapa posterior
infra/                   Reservado; sin conexión a Raspberry
docs/                    Documentación técnica y verificación de la implementación
.github/workflows/       Verificación del frontend, sin despliegue
```

## Alcance de esta versión

- Portada ES/EN con DianiMilo, Nube Camiska y Convertix, en ese orden.
- Título «Portafolio Camilo Puentes» y nombre completo Camilo Alberto Puentes Valencia.
- Tecnologías y lenguajes en ocho categorías: lenguajes, frameworks, bases de datos,
  Linux/infraestructura, datos/BI, IA local, videojuegos/embebidos e ingeniería.
  Solo nombres, sin niveles ni descripciones de experiencia. Lenguajes visibles
  y otras categorías desplegables, también sin JavaScript.
- Navegación a `/es/#tecnologias` y `/en/#technologies`; nombres con enlaces a
  documentación y comandos visuales en la franja existente, mediante hover o foco.
- Proyectos que se amplían en la misma página al pulsar su fila. Otro clic los
  cierra; al abrir uno se cierra el anterior. Funciona con teclado y sin JavaScript.
- Enlaces directos como `/es/#convertix`, idioma y Atrás/Adelante conservan el
  proyecto abierto con JavaScript. Las URLs de fichas anteriores redirigen a la portada.
- Franja visual: hover/foco, tipeo de 180 ms, cancelación y restauración.
- Temas claro/oscuro, preferencia persistente y esquema inicial del sistema.
- Movimiento reducido y control adicional para desactivar efectos.
- Capturas y vídeo de Convertix pendientes, identificados como tales. No se simulan demos.

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

El repositorio contiene código, contenido del sitio, pruebas, configuración de
compilación e integración continua y documentación técnica. Las instrucciones de
agentes, prompts, el kit de diseño inicial y los prototipos de trabajo se conservan
solo localmente. `.gitignore` también excluye credenciales, dependencias instaladas,
compilaciones, cachés, registros, respaldos y capturas de revisión.

Antes de cada push, revisar `git status`, el diff preparado y la lista completa de
archivos rastreados con `git ls-files`. `git ls-files -ci --exclude-standard` debe
estar vacío: añadir una regla a `.gitignore` no retira archivos ya versionados.

La siguiente etapa queda pendiente de revisión visual y autorización de Camilo.
