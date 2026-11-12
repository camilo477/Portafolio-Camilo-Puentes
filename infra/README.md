# Publicación en Raspberry Pi

El portafolio se sirve como archivos estáticos con Nginx. Se puede compilar en el
equipo de desarrollo o en la Raspberry mediante Docker. Node.js se usa durante la
compilación; no es un servicio del sitio. DianiMilo, Nube y Hub conservan sus propios
contenedores.

## Actualizar directamente en la Raspberry

La copia de trabajo utiliza `~/portafolio` y la rama `codex/portfolio-base`.
Preparación inicial, una sola vez:

```bash
git clone --branch codex/portfolio-base --single-branch \
  https://github.com/camilo477/Portafolio-Camilo-Puentes.git ~/portafolio
install -d ~/bin
install -m 755 ~/portafolio/scripts/pullportafolio ~/bin/pullportafolio
```

Con `~/bin` en el PATH, las actualizaciones se realizan con:

```bash
pullportafolio
pullportafolio --status
```

El comando utiliza `git pull --ff-only`, comprueba rama y remoto y se detiene si
hay cambios locales. Después compila en una imagen oficial de Node, compatible con
ARM64 y con la versión de `.nvmrc`. Docker comprueba formato y tipos antes de
compilar. `.dockerignore` limita el contexto a los archivos de la aplicación.
Se extrae únicamente `web/dist/` y se activa la versión con el mismo mecanismo de
comprobación y recuperación que el despliegue desde el PC. Si esa revisión ya está
publicada y responde, no se vuelve a compilar. No se cambian las rutas del túnel.

La primera compilación descarga la imagen y las dependencias. Las siguientes
aprovechan la caché de Docker. El contenedor usado para extraer el resultado se
elimina al terminar; Nginx sigue sirviendo el sitio.

Para consultar el resultado:

```bash
ls /var/www/portfolio/current/
curl -I http://127.0.0.1:3003/en/
```

El código está en `~/portafolio`; los archivos publicados están en
`/var/www/portfolio/current`. Desde un navegador, abre `https://camiska.lat/`.

## Preparación y actualización

La Raspberry debe tener Nginx, rsync, curl y flock instalados. El usuario SSH debe
poder ejecutar los comandos de instalación y recarga de Nginx mediante `sudo -n`.
Comprueba que el puerto local 3003 esté libre antes del primer despliegue.

Desde la raíz del repositorio, con la versión de Node indicada en `.nvmrc`:

```bash
make verify
make deploy PORTFOLIO_SSH=usuario@servidor
```

`make deploy` valida formato y tipos, compila y transfiere **solo `web/dist/`** y
los archivos de `infra/raspberry/`. No transfiere el repositorio completo,
archivos de entorno, credenciales ni documentación local.

Cada publicación tiene su propio directorio en `/var/www/portfolio/releases/`.
El enlace `current` cambia de forma atómica. El script comprueba Nginx y ambas
portadas; si falla, restablece el enlace y la configuración anteriores. Las
versiones anteriores se conservan; no se borran automáticamente.

Nginx escucha únicamente en `127.0.0.1:3003`. Devuelve un 404 real para rutas
inexistentes, admite peticiones parciales de vídeos y redirige `/` a `/en/`.
Las redirecciones son relativas para no filtrar el puerto interno a través del
túnel. El PDF y los medios públicos se incluyen en la compilación.

## Cloudflare Tunnel: cambio inicial de dominios

Se reutiliza el túnel existente. En un túnel gestionado localmente, el fichero
`config.yml` de `cloudflared` contiene las reglas `ingress`; el panel DNS y estas
reglas son dos partes distintas de la publicación.

1. Guarda una copia privada del fichero de configuración del túnel.
2. Añade `hub.camiska.lat` con el mismo servicio de origen que utiliza actualmente
   el Hub. Conserva por ahora la ruta de `camiska.lat`.
3. Valida las reglas con `cloudflared tunnel --config RUTA_CONFIG ingress validate`
   y reinicia el servicio `cloudflared` para cargarlas.
4. Crea el DNS del nuevo nombre con
   `cloudflared tunnel route dns NOMBRE_O_UUID hub.camiska.lat`. Necesita el
   certificado de administración local; no se guarda en este repositorio.
5. Comprueba que `https://hub.camiska.lat/` muestra el acceso del Hub. Las cookies
   son específicas de cada dominio: hay que iniciar sesión otra vez.
6. Publica el portafolio con `make deploy` y comprueba su origen local.
7. Cambia **solo** el servicio de `camiska.lat` a `http://127.0.0.1:3003`, valida
   y recarga el túnel. Conserva las reglas de DianiMilo, Nube y el 404 final.
   El DNS del dominio principal ya apunta al mismo túnel y no necesita reemplazo.
8. Comprueba por HTTPS ES/EN, proyectos, CV y vídeos, además de los otros servicios.

Las políticas de Cloudflare Access, WAF o caché que estén ligadas al dominio se
revisan aparte en el panel si afectan a la nueva ruta. No se desactivan protecciones
automáticamente. No hace falta abrir puertos entrantes en el router.

`web/public/sw.js` retira el service worker antiguo del Hub cuando el navegador
lo actualiza. Solo elimina su caché estática; el portafolio no registra otro worker.

## Volver a una versión anterior

El despliegue muestra la ruta de la versión anterior. En la Raspberry, apunta
`current` a esa versión existente mediante un enlace temporal y `mv -Tf`:

```bash
cd /var/www/portfolio
ln -s /var/www/portfolio/releases/VERSION_ANTERIOR current-restore
mv -Tf current-restore current
curl --fail http://127.0.0.1:3003/en/ -o /dev/null
```

Si falla el cambio inicial del túnel, restaura su copia privada y reinicia
`cloudflared`. Esto devuelve el dominio principal al Hub; no modifica los datos de
ninguna aplicación. No elimines la copia hasta verificar los dominios.

La integración continua comprueba el sitio; no despliega en la Raspberry.

Referencias: [reglas de configuración](https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/configuration-file/)
y [DNS de Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/dns/).
