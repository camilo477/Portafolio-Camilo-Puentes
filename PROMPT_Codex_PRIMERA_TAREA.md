# Prompt 01 para Codex — base del portafolio e interacción Linux

Lee primero `AGENTS.md`, `PORTAFOLIO_PLAN_Y_DISENO.md` y los cuatro archivos de `docs/`. No cambies la dirección artística aprobada.

## Propósito
Preparar el monorepositorio de mi portafolio y una **primera rebanada vertical pequeña** que permita comprobar la estética Linux y las interacciones antes de construir todas las páginas. La referencia de personalidad y atención a las microinteracciones es https://www.joshwcomeau.com/, pero no debes copiar su sitio ni usar una plantilla SaaS.

## Alcance de esta tarea
1. Crear la estructura `web/`, `api-status/` (puede quedar sin implementar), `infra/`, `docs/` y configuración mínima del repositorio.
2. Inicializar Astro + TypeScript con React únicamente para interactividad necesaria. CSS propio y tokens semánticos.
3. Implementar una portada mínima con navegación convencional, bloque de presentación realista y dos proyectos de muestra con contenido verificable o claramente marcado como pendiente.
4. Añadir encabezado semántico **Proyectos** con `$ ls ~/proyectos` cerca del título.
5. Implementar una franja inferior de comandos visuales. Al pasar cursor o enfocar DianiMilo, escribir rápidamente `cd ~/proyectos/dianimilo`; al salir/blur, volver al comando activo; al hacer clic o Enter, navegar normalmente. La animación debe cancelarse si el usuario cambia rápido de destino. Respetar móvil y `prefers-reduced-motion`.
6. Incorporar ES/EN y claro/oscuro desde el comienzo, con botones visibles. Rutas `/es/` y `/en/`, traducciones naturales, persistencia de tema y preferencia inicial del sistema.
7. **No afirmar que los colores provisionales son Plasma Viking**. Usar tokens neutrales temporales hasta que entregue el esquema real. Diseñar ambos modos en la demo.
8. Añadir tests básicos (especialmente hover, focus, clic, cambio rápido, idioma/tema y reduced motion) y scripts de lint/build disponibles.
9. Preparar GitHub Actions para ejecutar verificaciones del frontend cuando exista código; sin despliegue automático a Raspberry.

## Exclusiones de esta tarea
- No construir el backend Java todavía.
- No añadir formularios de contacto, estadísticas falsas ni terminal libre.
- No publicar a producción ni modificar mi Raspberry.
- No inventar capturas, experiencia laboral, logros ni datos de los proyectos.
- No entregar el portafolio «completo» en un solo cambio.

## Política de Git
Usa la rama `codex/portfolio-base`; inspecciona diff y status; ejecuta los tests pertinentes; haz commits descriptivos por incremento funcional y **push a la rama remota solo si tienes permisos, el repo es el correcto y la validación pasó**. Nunca hagas push a main ni force push. Si no puedes autenticarte o la red/permiso está bloqueado, informa el bloqueo en vez de afirmar que hiciste el push.

## Al terminar, entrégame
- Resumen de estructura y decisiones.
- Comandos para levantar el frontend localmente.
- Pruebas ejecutadas y sus resultados (sin inventarlos).
- Capturas reales de desktop/móvil en ambos temas si es posible; si no, dilo.
- Commit, rama y estado real del push.
- Dudas de diseño pendientes, sobre todo el archivo de colores de Plasma.
