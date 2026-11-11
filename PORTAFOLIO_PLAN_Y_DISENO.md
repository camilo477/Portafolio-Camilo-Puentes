**Portafolio de Camilo Puentes — plan de producto, diseño y tecnologías**

Versión 0.2 · 11 de noviembre de 2026 · Dirección artística y UX Linux actualizadas.

Este documento define una propuesta de implementación; la web y la API todavía no se han construido. Se han confirmado el bilingüismo (ES/EN), los temas claro/oscuro con controles visibles, la referencia artística de Josh W. Comeau y la identidad Linux con encabezados de comandos y una franja inferior reactiva. La identificación exacta de la paleta «Plasma Viking» sigue pendiente; no se inventarán sus códigos de color.

**1. Objetivo y requisitos confirmados**

Presentar experiencia backend y full stack mediante proyectos que puedan entenderse, explorarse y explicarse técnicamente. Integrar el interés de Camilo por Linux, Raspberry y alojamiento propio.

Requisitos expresados por Camilo:

- Interfaz fácil de utilizar, con inspiración moderada en una consola Linux.
- Navegación normal mediante pestañas o enlaces.
- Una franja inferior escribe rápidamente comandos contextuales en hover o foco, como `cd ~/proyectos/dianimilo` al señalar DianiMilo, y refleja la ruta activa después de navegar.
- Encabezados comprensibles con guiños Linux: «Proyectos» acompañado de `ls ~/proyectos`, no solo un comando críptico.
- Español e inglés desde la primera versión; controles visibles ES/EN y tema claro/oscuro.
- Algunos proyectos, especialmente Convertix, se presentan con vídeo y enlace al repositorio.
- Evaluar una separación frontend/backend y Java como posible tecnología del servidor.
- Registrar decisiones en Markdown y continuar el diseño mediante preguntas.

**2. Recomendación de arquitectura**

Frontend recomendado: **Astro + TypeScript + React para la interacción de consola**, CSS propio y fichas de proyecto en Markdown. Astro genera las páginas; React se reserva para componentes interactivos.

Backend propuesto: **OpenJDK 21 + Spring Boot + Maven**, como servicio independiente y acotado de estado de las demos. Se incorpora en una segunda fase si demostrar Java o consultar disponibilidad real resulta prioritario. El contenido, CV, vídeos y navegación deben funcionar aunque la API esté apagada.

Para el alcance actual, los comandos animados se resuelven en el navegador. Si Camilo prefiere maximizar reutilización de React, **React + Vite + TypeScript** es una alternativa válida; no es necesario implementar ambas opciones.

El motivo de preferir Astro es el predominio de contenido y fichas. No se ha medido cuál opción sería más rápida de desarrollar para Camilo. Astro admite Markdown e interactividad selectiva con React. [Astro](https://docs.astro.build/en/concepts/why-astro/), [componentes interactivos](https://docs.astro.build/en/guides/framework-components/).

| Capa | Elección propuesta | Alcance |
| --- | --- | --- |
| Páginas y contenido | Astro + TypeScript | Inicio, proyectos, experiencia, homelab, contacto |
| Interacción | React | Franja de comandos y, si hace falta, filtros |
| Estilos | CSS con variables | Tema, espaciado, tarjetas y adaptación móvil |
| Contenido editorial | Markdown con esquema validado | Una ficha por proyecto; textos separados por idioma |
| Backend opcional | OpenJDK 21 + Spring Boot + Maven | Comprobaciones de estado y respuesta pública mínima |
| Almacenamiento inicial | Archivos para contenido; caché en memoria para estado | Sin base de datos en la primera versión |
| Persistencia posterior | PostgreSQL, solo si se pide historial | Migraciones, retención y respaldo como trabajo adicional |
| Alojamiento en Raspberry | Docker; Nginx si no existe un servidor equivalente | Archivos estáticos y proxy hacia la API |
| Integración continua propuesta | GitHub Actions | Comprobaciones y compilación |
| Verificación propuesta | Playwright; JUnit y Spring Test si hay API | Recorridos de usuario y comportamiento ante errores |

La documentación consultada muestra Spring Boot 4.1.2 compatible con Java 21. Al implementar se fijará el parche estable compatible y las dependencias; no se utilizarán versiones flotantes. Java 21 está identificado como LTS. Estas fuentes no prueban capacidad ni consumo en la Raspberry. [Spring Boot](https://docs.spring.io/spring-boot/system-requirements.html), [Java](https://www.oracle.com/java/technologies/java-se-support-roadmap.html).

**3. Estructura de navegación**

Usar enlaces de navegación que puedan abrirse directamente, compartirse y funcionar con Atrás/Adelante. Su apariencia puede recordar pestañas; la semántica debe corresponder a navegación entre páginas.

| Etiqueta visible | Guiño Linux | Destino orientativo |
| --- | --- | --- |
| Inicio | `~` | `/` |
| Proyectos | `ls ~/proyectos` | `/proyectos/` |
| Experiencia | `cat experiencia.md` | `/experiencia/` |
| Raspberry y Linux | `cd ~/homelab` | `/homelab/` |
| Contacto | `cat contacto.txt` | `/contacto/` |
| DianiMilo | `cd ~/proyectos/dianimilo` | `/proyectos/dianimilo/` |

Las rutas tendrán prefijos estables `/es/` y `/en/`, preservando la página actual al cambiar de idioma cuando exista su traducción. Los comandos son referencias de rutas técnicas y no se traducen automáticamente. Los enlaces del documento ilustran la estructura; todavía no son URLs publicadas.

La portada presenta nombre, perfil profesional, dos proyectos destacados y accesos al CV, GitHub y contacto. Los títulos humanos permanecen visibles junto a los comandos.

**4. Comportamiento de la consola visual**

Al pasar el cursor sobre DianiMilo (o enfocarlo con teclado):

1. La franja inferior muestra una previsualización rápida de `cd ~/proyectos/dianimilo`, sin ejecutar nada y sin navegar todavía.
2. La escritura es breve (objetivo orientativo: 120–250 ms por comando completo). Cambiar de objetivo cancela inmediatamente la animación previa.
3. Al salir del hover o perder el foco sin activar el enlace, la franja restaura el comando de la página activa.
4. Al pulsar el enlace, la navegación ocurre inmediatamente y, en la nueva página, el comando queda reflejado como estado actual.
5. En táctil no hay dependencia de hover: el clic/tap navega normalmente y actualiza la ruta.
6. En movimiento reducido se muestra directamente el comando final, sin animar caracteres.

Es una representación de la navegación. La primera versión no recibe comandos libres, ejecuta una shell, ni conecta el teclado con la Raspberry.

Reglas de interacción:

- La consola no toma el foco automáticamente.
- No simula resultados de pruebas, despliegues correctos o estados de servicio.
- Animación propuesta: alrededor de 300 ms en total, ajustable después de probarla; no es una medición.
- Sin sonidos, parpadeo continuo ni arranque obligatorio.
- Respetar `prefers-reduced-motion` y ofrecer un ajuste para desactivar efectos.
- El texto decorativo no se anuncia letra a letra mediante un lector de pantalla.
- El contenido debe seguir siendo accesible mediante enlaces si no carga JavaScript.
- En móvil, la franja ocupa poco espacio y nunca tapa controles o texto.

La recomendación de permitir desactivar movimiento no esencial se apoya en [W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). El sitio todavía no ha pasado una evaluación de accesibilidad.

**5. Dirección visual provisional**

Dirección artística confirmada: inspiración editorial y microinteractiva de [Josh W. Comeau](https://www.joshwcomeau.com/) reinterpretada con identidad Linux/KDE y diseño propio, nunca replicada literalmente. No usar plantillas SaaS ni un falso escritorio completo. Usar tipografía de lectura para textos y monoespaciada para comandos.

Paleta elegida conceptualmente: la del tema de KDE Plasma al que Camilo llama «Viking» (nombre no confirmado). **Pendiente:** obtener su nombre real y archivo `.colors` antes de fijar tokens HEX; diseñar versiones oscuro y claro deliberadamente, no invertir automáticamente. Los HEX de la versión 0.1 eran exploratorios y dejan de ser una decisión vigente. Véase `docs/DIRECCION_VISUAL.md` y `docs/PALETA_PLASMA.md`.

Distribución orientativa:

```text
camilo@portfolio:~     Inicio  Proyectos  Experiencia  Homelab  Contacto

Camilo Puentes
Desarrollo backend y full stack
APIs, integraciones y aplicaciones que despliego en Linux.

[Ver proyectos]  [Descargar CV]  [GitHub]

Proyectos                                  $ ls ~/proyectos
[Nube Camiska: caso + demo + código] [DianiMilo: caso + demo + código]
[Vision Evaluator: caso + evidencia] [Convertix: vídeo + código]

──────────────────────────────────────────────────────────────────────
$ cd ~/proyectos/dianimilo
```

Tarjetas en dos columnas cuando haya espacio y una columna en móvil. En el encabezado de cada proyecto debe entenderse su propósito antes de leer las tecnologías.

**6. Proyectos y contenido**

| Proyecto | Presentación | Evidencia que preparar |
| --- | --- | --- |
| Nube Camiska | Caso principal y demo de lectura | Permisos, archivos, integridad, pruebas y despliegue |
| DianiMilo | Caso principal y demo ficticia | Flujos compartidos, integración y separación de la demo |
| Vision Evaluator | Caso de Python e integración | Arquitectura, aporte personal, ejemplo y resultados reproducibles |
| Convertix / Converter-files | Vídeo, capturas y repositorio | Una conversión completa, entrada/salida y un error controlado |
| Raspberry / Camiska Hub | Caso de operación | Servicios, actualización, recuperación y límites medidos |
| ProyectoPowerbiForm | Caso adicional orientado a datos | Pregunta analítica, datos ficticios, limpieza y conclusiones |

Cada ficha tendrá: problema y usuario previsto; tipo de proyecto; aporte personal; tecnologías y motivos; arquitectura breve; decisiones y dificultades; demostración; pruebas realmente ejecutadas; límites; enlaces y fecha de revisión.

Fuentes del inventario: [Nube](https://github.com/camilo477/nube-camiska), [DianiMilo](https://github.com/camilo477/watchlist-plans-goals-pwa), [Vision](https://github.com/camilo477/vision-evaluator-monorepo), [Convertix](https://github.com/camilo477/Converter-files), [Hub](https://github.com/camilo477/camiska-hub).

Las inspecciones previas comprobaron documentación y muestras de código; no certificaron funcionamiento integral de los despliegues.

**7. Vídeos**

Convertix puede explicarse con un vídeo de una tarea concreta: archivo de entrada, opciones, conversión y resultado. Acompañarlo con una captura y texto permite entenderlo sin reproducirlo.

Propuesta de duración inicial: 60–120 segundos, ajustable al caso. Es un objetivo editorial, no un requisito técnico.

Reproductor convencional con controles, imagen previa y carga de vídeo bajo demanda. Sin reproducción automática. Incluir subtítulos o transcripción breve, tecnología utilizada, fecha y enlace visible al repositorio.

El alojamiento de los archivos se decidirá según tamaño, conexión y capacidad real de la Raspberry. La primera versión no requiere un servicio propio de conversión o streaming adaptativo. Grabar con datos ficticios y revisar cuentas, rutas y documentos visibles.

**8. API Java opcional: alcance definido**

Función propuesta: ofrecer el último resultado de comprobación de las demos seleccionadas. Endpoint inicial: `GET /api/v1/services/status`.

Contrato orientativo:

```json
{
  "services": [
    {
      "id": "dianimilo",
      "status": "unknown",
      "checkedAt": null,
      "latencyMs": null
    }
  ]
}
```

Estados previstos: `reachable`, `unreachable`, `unknown`. Un resultado HTTP satisfactorio acredita la comprobación definida, no todas las funciones de una aplicación. La interfaz mostrará alcance y fecha.

- El servidor comprueba destinos previamente autorizados y configurados.
- Un visitante no puede introducir URLs, comandos ni rutas internas.
- Consultas programadas con tiempo de espera y frecuencia acotados; respuesta almacenada temporalmente.
- Consultar la API pública no dispara una nueva comprobación por visitante.
- Mostrar “Sin datos recientes” cuando expire la comprobación o falle la API.
- Respuesta pública mínima, sin sesiones, eventos privados o direcciones internas.
- Caché en memoria inicialmente. Al reiniciar, el estado es desconocido hasta comprobarlo.
- Añadir PostgreSQL únicamente si se acuerda conservar y consultar histórico.
- Documentar contrato, errores y pruebas de tiempos de espera, caché y datos vencidos.

Presentar esta API como un caso técnico propio si se implementa. La primera publicación del contenido puede precederla.

**9. Raspberry y despliegue**

Propuesta: compilar el frontend en el equipo de desarrollo o en integración continua; servir el resultado estático en la Raspberry. Mantener una copia estática externa para que CV y fichas sigan accesibles durante mantenimiento doméstico.

```text
Visitante
  └─ Dominio público → servidor HTTP → páginas y vídeos
                            └─ /api/... → Spring Boot opcional
                                            └─ demos autorizadas

Copia estática externa → contenido y CV, independiente de la API
```

Astro genera una salida desplegable en `dist`; Nginx puede servir archivos y actuar como proxy. Antes de elegir Nginx, revisar si la instalación existente ya cubre esa función. [Astro](https://docs.astro.build/en/guides/deploy/), [Nginx](https://nginx.org/en/docs/beginners_guide.html).

Confirmar modelo, RAM, arquitectura del sistema, espacio, servicios existentes y acceso HTTPS/DNS antes de fijar imágenes y límites. No se ha afirmado que Java o Vision completo quepan holgadamente en el equipo.

El caso de homelab explicará configuración real, actualización, logs aptos para compartir, copias y recuperación comprobada. El script de Nube ya contiene lógica de comprobación del disco y retorno al contenedor anterior; una futura demostración debe distinguir código existente de comportamiento observado. [Script inspeccionado](https://github.com/camilo477/nube-camiska/blob/main/scripts/deploy-raspberry.sh).

**10. Organización propuesta del trabajo**

```text
portfolio/
  web/          páginas, componentes, fichas Markdown y recursos
  api-status/   servicio Java, si se confirma
  infra/        configuración de despliegue sin secretos
  docs/         arquitectura, decisiones y evidencias
```

Esta estructura es una propuesta; no se han creado esos directorios. El contenido de los proyectos tiene una sola fuente editorial en Markdown. El backend no mantiene una copia del currículo.

**11. Tres hitos y criterios de finalización**

1. **Contenido y diseño:** portada, dos fichas completas, navegación y wireframe móvil; decisiones de idioma y tema registradas. Se entiende el aporte personal sin abrir una demo.
2. **Frontend publicable:** rutas directas y Atrás/Adelante funcionan; clic y teclado permiten navegar; la animación no bloquea; movimiento reducido y móvil comprobados; vídeos y enlaces funcionan; CV disponible. Verificar también el recorrido sin API.
3. **Java y operación, si se confirman:** contrato probado, errores y estados vencidos visibles, despliegue documentado, recuperación ensayada y recursos medidos en la Raspberry. Si el servicio no está listo, conservar publicada la parte estática.

No se asignan fechas ni costes sin conocer disponibilidad de Camilo. Preparar más efectos o endpoints no debe impedir terminar las fichas acordadas.

**12. Decisiones confirmadas y pendientes**

Confirmadas por Camilo (11 de noviembre de 2026):

- Referencia favorita: Josh W. Comeau (`https://www.joshwcomeau.com/`), por el cuidado editorial y las microinteracciones; no copiar ilustraciones ni identidad ajena.
- Estética Linux integrada en múltiples zonas: encabezados con comandos, barra inferior con escritura rápida de comandos en hover/foco y rutas coherentes al navegar.
- Español e inglés desde el primer lanzamiento, con botón/selector visible y rutas localizadas.
- Tema claro y oscuro desde el primer lanzamiento, con botón visible.
- Evitar todas las prácticas descritas en `docs/EVITAR_APARIENCIA_IA.md`.

Por verificar antes de cerrar el sistema cromático:

- Nombre exacto y archivo de colores del tema KDE Plasma que Camilo identifica tentativamente como «Viking»; no adivinar valores.
- Recursos visuales originales, capturas reales y material listo para publicar.
- Dominio/despliegue final y capacidad disponible de Raspberry para la etapa Java.

Decisión técnica conservada del plan: primero frontend publicable; API Java independiente en una fase posterior. No impedir una primera publicación por retrasos del backend.

**13. Registro del Consejo**

Consulta COMPLETO: respondieron ingeniería, producto, creatividad, carrera, estrategia, finanzas, crítico, ejecución, riesgos, ética, evidencia y bienestar: 12/12. Una ronda; sin revisión adicional.

La diferencia principal fue preferir Astro para el contenido o React/Vite para reutilizar experiencia. Se recomienda Astro con React por el alcance editorial; cambiaría a React/Vite si la reutilización real reduce trabajo o la interfaz requiere estado compartido extenso.

Confianza media: la compatibilidad documental se comprobó, pero las preferencias finales, la capacidad de la Raspberry y el comportamiento de una implementación siguen pendientes.

**14. Contrato de interacción visual Linux (aprobado como dirección)**

- Nombres claros + comandos discretos: por ejemplo «Proyectos» y `$ ls ~/proyectos`, «Experiencia» y `$ cat experiencia.md`. La navegación normal es prioritaria.
- La franja inferior interpreta la selección actual y previsualiza interacciones mediante comandos *ficticios y solo visuales*. No permitir ejecución de comandos ni terminal real.
- Estado `idle`: muestra ruta activa, por ejemplo `camilo@portfolio:~$ pwd` o la última ruta válida. Estado `preview`: al hover/foco escribe `cd ~/proyectos/dianimilo`. Estado `active`: después de navegar refleja la sección visible.
- `pointerleave`/`blur` restaura el estado activo; `focus` y `hover` son equivalentes para la previsualización; clic y Enter navegan. En móvil se omite hover, sin perder contenido.
- No bloquear navegación, evitar layout shift y respetar `prefers-reduced-motion`. La consola es decorativa y no debe anunciar actualizaciones letra por letra a lectores de pantalla.
- Ninguna sección existe únicamente para insertar un comando: lo Linux es una capa de identidad, no una simulación obligatoria.
- Pruebas mínimas: desktop, móvil, teclado, cambios rápidos de hover, ES/EN, claro/oscuro y movimiento reducido.

**15. Documentos normativos de diseño y operación**

- `docs/DIRECCION_VISUAL.md`: referencia visual y decisiones artísticas.
- `docs/INTERACCIONES_LINUX.md`: tabla de comandos, eventos y criterios de aceptación.
- `docs/EVITAR_APARIENCIA_IA.md`: reglas de diseño proporcionadas por Camilo, preservadas íntegramente.
- `docs/PALETA_PLASMA.md`: procedimiento para confirmar los colores KDE sin inventarlos.
- `AGENTS.md`: instrucciones permanentes de Codex, pruebas y Git.
- `PROMPT_Codex_PRIMERA_TAREA.md`: primer encargo de implementación controlada.
