# Contrato de interacciones Linux (v0.1)

## Objetivo
Que **cada sección importante tenga algún guiño Linux con significado**: encabezados acompañados de comandos plausibles y una franja inferior que narra visualmente la navegación. No reemplazar nunca los nombres comprensibles de las páginas.

## Matriz de navegación (ejemplos)

| Elemento visible (ES / EN) | Comando en encabezado o barra | Ruta orientativa |
| --- | --- | --- |
| Inicio / Home | `cd ~` | `/es/` o `/en/` |
| Proyectos / Projects | `ls ~/proyectos` | `/es/proyectos/` o `/en/projects/` |
| Experiencia / Experience | `cat ~/experiencia.md` | `/es/experiencia/` o `/en/experience/` |
| Linux / Homelab | `cd ~/homelab` | `/es/homelab/` o `/en/homelab/` |
| Contacto / Contact | `cat ~/contacto.txt` | `/es/contacto/` o `/en/contact/` |
| DianiMilo | `cd ~/proyectos/dianimilo` | `/es/proyectos/dianimilo/` o `/en/projects/dianimilo/` |
| Convertix | `cd ~/proyectos/convertix` | ficha de Convertix |
| Nube Camiska | `cd ~/proyectos/nube-camiska` | ficha de Nube Camiska |
| Vision Evaluator | `cd ~/proyectos/vision-evaluator` | ficha de Vision Evaluator |

Notas: son metáforas de interfaz; los comandos no se ejecutan. Las rutas del contenido se localizan; los nombres de directorios en la franja pueden permanecer estables en español para aportar identidad personal. Si más adelante se eligen rutas diferentes, actualizar la tabla antes de implementarlas.

## Máquina de estados propuesta

`ACTIVE(currentRoute) -> PREVIEW(targetCommand) -> ACTIVE(currentRoute)`

- **ACTIVE:** ruta activa y comando estable. Tras navegar a DianiMilo, `cd ~/proyectos/dianimilo` queda completo.
- **PREVIEW:** al `pointerenter` en un enlace con ratón o al `focus` con teclado, escribir rápidamente `cd ~/proyectos/dianimilo` sin navegar.
- **RESTORE:** `pointerleave` / `blur` sin activación restaura el comando activo. Si hay otro enlace apuntado, preferir el nuevo objetivo sin parpadeo intermedio.
- **NAVIGATE:** clic, Enter o tap realizan navegación normal de inmediato; no esperar a la animación ni cancelar un evento de enlace convencional.
- **REDUCED MOTION:** saltar directamente al texto completo (sin tipeo); opcionalmente permitir deshabilitar animaciones.
- **TOUCH:** no diseñar una interacción que requiera hover; el toque navega directamente.

## Animación (criterios, no números absolutos)
- Duración objetivo: 120–250 ms por comando completo, nunca más lenta para cadenas largas.
- Cancelar la animación anterior en cada nuevo destino. Evitar cola, comandos «fantasma» y carreras al cambiar entre proyectos rápidamente.
- No escribir comandos carácter por carácter a lectores de pantalla (`aria-hidden` para la franja visual); navegación y títulos deben ser accesibles por separado.
- La franja ocupa espacio reservado si es fija; no tapar CV, menús, enlaces ni contenido en móvil. En pantallas estrechas puede truncar rutas largas de manera visible, manteniendo el nombre del enlace accesible.

## Distinción entre título y comando

Correcto:

> **Proyectos**  ·  `$ ls ~/proyectos`

Incorrecto:

> `$ ls ~/proyectos` como único título semántico para visitantes no técnicos.

Correcto en un proyecto:

> **DianiMilo** — aplicación para organizar planes y objetivos compartidos; al pasar el cursor, abajo aparece `cd ~/proyectos/dianimilo`.

## Criterios de aceptación
- [ ] Se puede visitar cada sección con ratón, teclado y enlaces directos.
- [ ] Hover DianiMilo -> aparece el comando correspondiente sin navegar.
- [ ] Focus DianiMilo -> mismo resultado que hover.
- [ ] Salir del elemento -> se restaura comando de ruta actual.
- [ ] Hacer clic/Enter -> la URL cambia inmediatamente y el comando activo coincide con la nueva ruta.
- [ ] Alternar entre dos enlaces antes de completar la escritura no deja caracteres mezclados.
- [ ] Tema e idioma cambian por controles visibles, conservando el contexto de navegación.
- [ ] Sin movimiento animado si `prefers-reduced-motion`.
- [ ] Móvil no depende de hover y la franja no tapa la página.
- [ ] Sin shell real, comandos remotos ni resultados ficticios.

## Sugerencia de arquitectura de implementación
- Mapa tipado `routeOrProjectId -> command` en una sola fuente.
- Un controlador pequeño del estado `activeCommand` + `previewCommand` (React island si hace falta; sin hidratar todo Astro).
- Eventos declarados mediante atributos `data-preview-command` para elementos de navegación y fichas. Manejar `focusin/focusout` y `pointerenter/pointerleave` con atención a la delegación y al orden de eventos.
- Usar `matchMedia('(prefers-reduced-motion: reduce)')`, cancelar timers/intervalos y limpiar en desmontaje.
- Pruebas E2E con Playwright que simulen foco, hover, cambio rápido, móviles y rutas bilingües.
