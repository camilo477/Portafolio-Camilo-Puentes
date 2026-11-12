# Homelab: Raspberry verificada y caso desplegable

La revisión posterior a Tarea 05 incorpora la petición explícita de Camilo de
inspeccionar su Raspberry mediante SSH y ampliar Homelab dentro de la portada.
Reemplaza la limitación anterior a fuentes públicas y la navegación a una ficha
separada. No modifica servicios, despliegues ni configuración del servidor.

## Evidencia directa: 11 de noviembre de 2026

Se utilizó el mismo destino SSH que la función local `rasp`. Esa función abre una
terminal gráfica; la inspección ejecutó su conexión SSH directamente, de forma no
interactiva y con la identidad del host ya conocida. Solo se realizaron lecturas.

Datos observados:

- Raspberry Pi 4 Model B, arquitectura ARM64, Debian GNU/Linux 13 (trixie).
- Docker, Nginx y cloudflared activos y habilitados para iniciar con systemd.
- Contenedores activos de Nube Camiska, DianiMilo y Camiska Hub.
- Tres rutas de Cloudflare Tunnel hacia los servicios locales de esos contenedores.
- Nginx con un sitio estático predeterminado y sin directivas activas `proxy_pass`.
  No participa en las tres rutas del túnel inspeccionadas.
- Nube utiliza montajes de directorios; DianiMilo combina montajes y volúmenes;
  Hub utiliza un volumen. Los datos están separados de las imágenes.

La configuración se procesó en memoria en el servidor y solo se devolvieron
campos permitidos: identidades de las aplicaciones públicas, tipos de montajes,
estados de servicios y relaciones entre componentes. No se copiaron archivos de
configuración, variables de entorno, credenciales, certificados, direcciones,
puertos, rutas de almacenamiento ni registros. No se navegaron archivos personales.

## Arquitectura publicada

```text
Navegador → Cloudflare Tunnel
                  ↓
Raspberry Pi 4 / Debian 13
├─ cloudflared (systemd)
│  └─ rutas hacia Docker
│     ├─ Nube Camiska (Node.js)
│     ├─ DianiMilo (Node.js + React)
│     └─ Camiska Hub (Node.js)
├─ Nginx: sitio estático independiente
└─ Persistencia: directorios montados y volúmenes
```

El diagrama HTML/CSS conserva texto accesible y apila los componentes en móvil.
Distingue la ruta de acceso de Nginx, en lugar de presentar todos los servicios
como una única cadena. Los tres contenedores se observaron activos durante la
inspección; el portafolio no monitoriza disponibilidad ni expone un indicador en vivo.

DianiMilo conserva la integración Firebase de su aplicación privada. Su demo
con datos ficticios puede compilarse de forma independiente; el diagrama describe
el alojamiento de las aplicaciones, no todas sus dependencias externas.

## Fuentes verificadas

Los enlaces de la página están fijados a los commits examinados:

| Repositorio | Revisión | Evidencia |
| --- | --- | --- |
| [Nube Camiska](https://github.com/camilo477/nube-camiska/tree/c9864bde816d67036be6edc708eaf0528bdbd4a1) | `c9864bde` | Dockerfile con build y servidor Node; script de despliegue con almacenamiento separado, comprobación de respuesta y retorno al contenedor anterior; README con requisitos de la demo |
| [DianiMilo](https://github.com/camilo477/watchlist-plans-goals-pwa/tree/76470e40c830f4039b074ebc1f88866aed3db8ac) | `76470e40` | Dockerfile con runtime Node, README con persistencia e independencia de la demo; archivo Nginx para frontend estático |
| [Camiska Hub](https://github.com/camilo477/camiska-hub/tree/53d20f55b5445fc44af41451908268c8ad12e26b) | `53d20f55` | Dockerfile con runtime Node; README con su papel como entrada privada y volumen de datos |

Los enlaces públicos explican el código y los procedimientos de despliegue.
La configuración operativa privada no se convierte en un enlace público: se
publican únicamente los hechos sanitizados de la revisión autorizada.

## Mantenimiento, actualizaciones y recuperación

El script público de Nube comprueba el almacenamiento personal antes de reemplazar
el servicio, separa archivos, estado y demo, construye una imagen y conserva el
contenedor anterior. Comprueba la respuesta del reemplazo; si falla, intenta
recuperar la versión anterior. No se ejecutó el script durante esta inspección.

Las políticas de reinicio observadas no son uniformes: Nube y DianiMilo utilizan
`unless-stopped`; Hub no tiene reinicio automático configurado. La página no
promete que todos los contenedores vuelvan solos después de reiniciar el host.
No se cambiaron políticas ni se reinició el servidor para probarlas.

Los temporizadores revisados incluyen mantenimiento del sistema. La referencia a
backup correspondía a la base de datos de paquetes del sistema, no a una copia de
los datos de las aplicaciones. No se detectó una tarea de copia de aplicaciones
en los temporizadores y el crontab del usuario consultados; esa observación no
demuestra que no existan copias por otros medios. No se verificó retención ni se
hizo una restauración. Persistencia, retorno a una versión y backup se describen
como mecanismos distintos.

La revisión no mide consumo, rendimiento ni disponibilidad y no certifica el
funcionamiento completo de las aplicaciones o la seguridad del servidor.

## Homelab dentro de la portada

`HomelabDisclosure.astro` reemplaza el enlace del resumen por `details/summary`.
El resumen mantiene su posición junto a la presentación cuando está cerrado. Al
abrirse ocupa el ancho de lectura de la portada, con el caso, el diagrama y sus
fuentes. No hay modal, petición a una API ni nueva vista.

- Menú principal, footer y enlaces compartidos usan `/es/#homelab` o `/en/#homelab`.
- Clic, toque, Enter y Espacio funcionan con el desplegable nativo.
- El controlador sincroniza apertura/cierre, historial, idiomas y la franja Linux.
- El botón final de cierre devuelve el foco al resumen; sin JavaScript se oculta
  y permanece disponible el control nativo del encabezado.
- Sin JavaScript, el enlace de navegación llega al resumen y el usuario lo abre
  de manera nativa. La apertura automática por hash requiere JavaScript.
- Las antiguas rutas `/es/homelab/` y `/en/homelab/` redirigen al ancla equivalente,
  también mediante la redirección HTML estática cuando no hay JavaScript.

El contenido bilingüe sigue en `web/src/data/homelab.ts`; `HomelabDiagram.astro`
representa las relaciones y `homelab.css` adapta el caso al desplegable.
Las fichas independientes de proyectos conservan su funcionamiento.

## Verificación local

Las pruebas específicas cubren apertura en el mismo documento, teclado, toque,
cierre con foco, historial, idioma, tema, recarga, hashes, rutas antiguas,
funcionamiento sin JS, movimiento reducido y anchos de 320 a 1440 px.
La suite general vuelve a comprobar proyectos, inventario y accesibilidad.
Las capturas quedan en `docs/capturas/`, fuera de Git.

Resultado final de `make verify`: formato aprobado; Astro/TypeScript con 0 errores,
advertencias y sugerencias; 11 salidas estáticas (incluidas las dos redirecciones);
4 pruebas de contenido y 107 pruebas de navegador aprobadas. Se omiten 3 casos de
hover en móvil. Las verificaciones axe no encontraron infracciones en los estados
analizados, incluyendo Homelab abierto en ambos temas e idiomas.

La prueba de movimiento reducido ahora selecciona DianiMilo de forma explícita:
Homelab pasó a ser el primer desplegable del documento. La prueba de accesibilidad
de dieciséis estados conserva todas las comprobaciones y dispone de 60 segundos
para analizar el documento ampliado.

El capturador registra el viewport de Homelab antes de la imagen de página completa:
esta última puede alterar el anclaje del scroll en Chromium móvil. Comprueba que
el título esté visible y bajo la cabecera; no reposiciona el scroll para esa foto.
La navegación normal se contrastó por separado en ambos idiomas y tamaños.

Generación de capturas aprobada: 174 imágenes locales. Se revisaron visualmente
la portada con Homelab cerrado, el bloque abierto y el diagrama en escritorio,
y la apertura en móvil claro/español y oscuro/inglés. Se conserva la composición
editorial y la paleta existente; el diagrama comunica relaciones verificadas y no
añade ilustraciones ni métricas ficticias.
