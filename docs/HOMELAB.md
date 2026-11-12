# Homelab: evidencia pública y límites del caso

La página `/es/homelab/` (y `/en/homelab/`) documenta el servidor personal de
Camilo sin representar una inspección de producción. Camilo confirmó el alojamiento
de sus aplicaciones web en Raspberry Pi, la administración de Linux, Docker y los
despliegues. El resto del caso se limita a componentes y comportamientos descritos
en los repositorios públicos examinados el 11 de noviembre de 2026.

## Componentes confirmados

```text
Raspberry Pi / Linux — alojamiento declarado por Camilo
└─ Contenedores Docker — configuración publicada
   ├─ Nube Camiska: Node.js, archivos y demo de solo lectura
   ├─ DianiMilo: Node.js + React; acceso privado integrado con Firebase
   └─ Camiska Hub: Node.js, entrada privada a las aplicaciones

Persistencia fuera de las imágenes:
- Nube: archivos personales, estado y demo separados.
- DianiMilo y Hub: datos de aplicación en volúmenes persistentes.
```

El diagrama de la página es HTML/CSS semántico, con título, leyenda y texto real.
En móvil apila los nodos manteniendo la relación servidor → Docker → aplicaciones.
No depende de JavaScript, imágenes ficticias ni una biblioteca de diagramas. No
incluye puertos, nombres de contenedores operativos, direcciones, rutas del host,
credenciales o endpoints administrativos.

El esquema describe una organización de componentes. No afirma que todos los
servicios estén activos, que exista un único proxy, ni qué ruta sigue actualmente
el tráfico externo. La demo de DianiMilo tiene además una compilación estática que
puede funcionar independientemente del backend; no se dibuja Firebase como una
dependencia de esa demo.

## Fuentes verificadas

Los enlaces de la página están fijados a los commits examinados:

| Repositorio | Revisión | Evidencia |
| --- | --- | --- |
| [Nube Camiska](https://github.com/camilo477/nube-camiska/tree/c9864bde816d67036be6edc708eaf0528bdbd4a1) | `c9864bde` | Dockerfile con build y servidor Node; script de despliegue con almacenamiento separado, comprobación de respuesta y retorno al contenedor anterior; README con requisitos de la demo |
| [DianiMilo](https://github.com/camilo477/watchlist-plans-goals-pwa/tree/76470e40c830f4039b074ebc1f88866aed3db8ac) | `76470e40` | Dockerfile con runtime Node, README con persistencia e independencia de la demo; archivo Nginx para frontend estático |
| [Camiska Hub](https://github.com/camilo477/camiska-hub/tree/53d20f55b5445fc44af41451908268c8ad12e26b) | `53d20f55` | Dockerfile con runtime Node; README con su papel como entrada privada y volumen de datos |

No se ejecutaron scripts de esos repositorios, no se usaron credenciales y no se
conectó a la Raspberry. Los archivos de configuración originales no se copiaron
al portafolio.

## Despliegue y recuperación de Nube

El script público comprueba el almacenamiento personal antes de reemplazar el
servicio. Mantiene separados los archivos del estado y los datos de demostración;
la ausencia de un disco no se interpreta como una nueva nube personal vacía.
Después construye una imagen, conserva el contenedor anterior e inicia el nuevo.
Solo completa el cambio cuando la aplicación responde; en caso contrario, su
manejador de salida intenta recuperar el contenedor anterior.

Es una lectura del código. No prueba que el rollback siempre tenga éxito ni
constituye un ensayo de recuperación sobre el servidor real. Tampoco equivale a
restaurar datos desde una copia de seguridad. La página mantiene esta distinción.

## Publicación web: qué no se puede afirmar todavía

- **Nginx:** existe `docker/nginx.conf` en DianiMilo con reglas para archivos
  estáticos, caché y rutas. El Dockerfile actual no utiliza ese archivo y ejecuta
  Node.js. No se identificó una configuración pública que confirme Nginx como
  proxy actual del homelab. Se explica el archivo sin añadir un nodo ficticio.
- **Cloudflare Tunnel:** el README de Nube lo recomienda como opción de acceso
  externo; no se encontró una configuración `cloudflared`/ingress que demuestre
  su uso actual en los árboles públicos revisados. No aparece como componente
  confirmado en el diagrama. Conocer la tecnología no demuestra que un servicio
  concreto la use.
- **Copias y recuperación:** el README de Nube deja las copias automáticas como
  trabajo posterior. No hay evidencia de periodicidad, retención, destino de
  copias ni un ensayo de restauración completo aprobado para describir aquí.
- **Sistema y hardware:** no se documentan modelo, memoria, distribución concreta,
  topología, consumo, capacidad o disponibilidad porque no se verificaron.

Para ampliar el caso bastaría una descripción sanitizada y aprobada del papel de
cada componente, o una configuración pública ya revisada. No hacen falta secretos
ni un volcado de la configuración del servidor.

## Mantenimiento del contenido

`web/src/data/homelab.ts` contiene el texto ES/EN y las referencias.
`HomelabDiagram.astro` representa los componentes; `homelab.css` conserva los tokens
actuales y los adapta a la composición del caso. La página enlaza las fichas de Nube
y DianiMilo. Hub se describe como acceso privado y no presenta un botón de demo.

Al actualizar evidencia, revisar el texto, el diagrama y sus límites en ambos
idiomas. Añadir una herramienta al inventario de tecnologías no la añade
implícitamente a la arquitectura del homelab.
