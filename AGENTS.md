# AGENTS.md — Portafolio profesional

## Propósito
Implementar el portafolio profesional de Camilo Puentes con una identidad visual propia: cuidado editorial y microinteracciones inspirados en Josh W. Comeau, reinterpretados con lenguaje visual de Linux/KDE. El sitio mostrará proyectos reales y aportes técnicos verificables; no debe parecer una landing page SaaS genérica ni una terminal simulada que reemplace la navegación normal.

## Leer obligatoriamente antes de cambiar código
1. `PORTAFOLIO_PLAN_Y_DISENO.md` — alcance de producto y arquitectura.
2. `docs/DIRECCION_VISUAL.md` — referencias y principios estéticos aprobados.
3. `docs/INTERACCIONES_LINUX.md` — comportamiento exacto del hover, foco, navegación y comandos.
4. `docs/EVITAR_APARIENCIA_IA.md` — texto aportado por Camilo; aplicar sus restricciones y auditoría.
5. `docs/PALETA_PLASMA.md` — colores todavía pendientes de confirmar; no inventar la paleta «Viking».

Si los documentos discrepan, priorizar una instrucción posterior explícita de Camilo y señalar la diferencia. No afirmar que hay decisiones tomadas cuando aún están pendientes.

## Tecnología y organización
- Monorepositorio: `web/` (Astro + TypeScript; React solo para componentes que lo requieran), `api-status/` (Java 21 + Spring Boot + Maven, fase posterior), `infra/`, `docs/`.
- Páginas principalmente estáticas y contenido de proyectos en Markdown; interfaz usable sin API.
- Sin base de datos inicial. PostgreSQL solo con justificación futura.
- No introducir una librería visual o de animación por defecto para acelerar una maqueta; preferir CSS propio y componentes con intención.
- Cuando se solicite la API, mantenerla aislada y validar su contrato, seguridad y resiliencia.

## Dirección artística innegociable
- Inspiración, no clonación, de `https://www.joshwcomeau.com/`: lectura clara, composiciones editoriales y microinteracciones con propósito; no copiar diseño, arte o código ajeno.
- En muchas secciones habrá detalles Unix/Linux. Cada encabezado tiene etiqueta humana clara y un comando contextual discreto: «Proyectos» + `ls ~/proyectos`.
- La franja inferior representa la navegación mediante comandos VISUALES. Ejemplo obligatorio: hover/foco sobre DianiMilo => `cd ~/proyectos/dianimilo`; clic/Enter => navegación normal; al salir sin activar => restaurar la ruta activa.
- No ejecutar shell en el navegador. No inventar salida de comandos, estado operativo, números, logros o métricas.
- No hero genérico centrado + tarjetas idénticas, efectos neón, blobs, glassmorphism, parallax, fondos cuadriculados ni símbolos sin función.
- Capturas y videos reales de proyectos; usar placeholders explícitos cuando falten activos.

## Idiomas, temas y accesibilidad
- Español (`/es/`) e inglés (`/en/`) desde la primera versión; controles visibles para alternar idioma sin perder página cuando haya traducción.
- Modo claro/oscuro con control visible, persistencia de preferencia y respeto inicial al esquema del sistema; diseñar ambos modos, no solo inversión de colores.
- La paleta cromática final dependerá del tema real de KDE Plasma de Camilo. Hasta que se confirme, emplear **tokens neutrales marcados como provisionales**, nunca venderlos como «Viking».
- Uso por teclado, enlaces semánticos, estados de foco visibles, contraste accesible, labels correctos y `prefers-reduced-motion`.
- Las animaciones jamás deben bloquear navegación, lectura, móvil o lectores de pantalla.

## Comportamiento de la terminal inferior
- `idle`: representar sección/ruta actual con texto estable.
- `preview`: en `pointerenter` (cuando existe hover) o `focus`, teclear el comando correspondiente en un tiempo total orientativo de 120–250 ms. Interrumpir la animación al cambiar de objetivo.
- `revert`: en `pointerleave` o `blur`, recuperar la ruta activa (sin flashes ni colas pendientes).
- `navigate`: el clic o Enter actualiza la URL inmediatamente. El destino aparece aunque falle JavaScript; el comando se sincroniza con la ruta.
- En dispositivos táctiles, no asumir hover. Si se pide movimiento reducido, escribir sin animación. La franja nunca debe tapar controles en móvil.
- No robar el foco; evitar anuncios letra a letra a tecnologías asistivas.

## Trabajo incremental
- Antes de implementar, describir el alcance de la tarea, qué componentes toca y cómo comprobarlos.
- No generar el sitio completo de golpe. Comenzar por estructura y un slice navegable que demuestre encabezados Linux, la franja y los dos controles visibles.
- Mantener casos de estudio específicos en lugar de datos inventados o marketing genérico.
- Añadir o actualizar pruebas: navegación sin JS donde aplique, teclado/foco, cambios rápidos de hover, móvil, idioma, tema y movimiento reducido.
- No dar por revisada visualmente una pantalla que no se haya podido abrir o capturar.

## Git y GitHub
- Trabajar en una rama de feature (por ejemplo `codex/portfolio-base`), nunca hacer push directo a `main` ni force push.
- Antes de cada commit: inspeccionar `git status`, `git diff`, ejecutar comprobaciones disponibles y revisar que no existan secretos ni archivos personales.
- Crear commits pequeños por incremento funcional, con mensajes descriptivos (ejemplo `feat(web): add Linux command preview footer`).
- Hacer `git push` a la rama actual **solo** si las pruebas requeridas pasaron, el remoto corresponde al repositorio previsto y hay autenticación/permisos. Si el entorno solicita aprobación, pedirla.
- No usar `git add .` sin revisar archivos nuevos ni mezclar cambios ajenos. No usar `git reset --hard`, borrar ramas, sobrescribir trabajo o desplegar producción sin autorización.
- Al terminar cada tarea: informar archivos, pruebas corridas, resultado real del commit/push y posibles bloqueos. Nunca afirmar que hubo push sin evidencia.

## Seguridad y privacidad
- No subir `.env`, credenciales, certificados, claves, tokens, respaldos, registros sensibles o datos privados de trabajo.
- No exponer rutas internas, IPs privadas o endpoints administrativos en el contenido público.
- No ejecutar código proporcionado por visitantes ni consultas a URLs elegidas por el visitante.
- No conectar ni desplegar en Raspberry/producción sin autorización específica.

## Definición de terminado
Una tarea se considera terminada cuando cumple su alcance, la navegación continúa siendo usable, los tests correspondientes pasan, los temas y el idioma funcionan donde aplique, los efectos no degradan accesibilidad y el diff está documentado. Una maqueta no equivale a publicación ni a backend listo.
