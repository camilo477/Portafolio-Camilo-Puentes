# Dirección visual aprobada — v0.2

## En una frase
Portafolio **editorial, personal y juguetón en los detalles**, como la experiencia de lectura y microinteracción de Josh W. Comeau, pero con un **lenguaje propio de Linux/KDE**: comandos contextuales, estructura limpia y proyectos reales. No es un clon de Josh ni una web de consola exclusivamente.

## Referencia principal
- https://www.joshwcomeau.com/ — inspiración por la lectura cómoda, composición deliberada, atención a las pequeñas interacciones y una estética hecha a medida.
- Autor declara que su sitio usa un diseño propio sin plantilla ni librería de componentes de UI preestilizados: https://www.joshwcomeau.com/contact/ . Esto es un principio, no una obligación de usar su stack Next.js.
- Referencia personal de Camilo: escritorios KDE Plasma / configuraciones Linux personalizadas.

## Señales de identidad que SÍ queremos
1. Encabezados semánticos con una línea de comando al lado/encima: **Proyectos** + `$ ls ~/proyectos`.
2. Enlaces a proyectos que provocan microinteracciones de **previsualización de comandos** en la franja inferior, pero conservan clic normal.
3. Pequeños acentos de UI de escritorio: barra de estado discreta, divisores precisos, tipografía monoespaciada en rutas y snippets, sin falsificar un sistema operativo entero.
4. Composiciones diferenciadas: inicio editorial, proyectos como lista de casos con imágenes reales, experiencia como cronología narrativa, homelab como diagrama/documentación.
5. Dos idiomas (ES/EN) y dos temas (claro/oscuro) con controles VISIBLES en el encabezado en escritorio y móvil.
6. Detalles interactivos deliberados, rápidos y poco numerosos. Nada que tape información, produzca scroll-jank o dependa del hover.

## Señales que NO queremos
- Landing de startup AI: titular gigante centrado, dos CTA brillantes, tres cajas de «habilidades» y degradados de fondo.
- Un mosaico de tarjetas idénticas como respuesta a cualquier contenido.
- Consola falsa para introducir comandos reales; prompt como decoración pura, no como única forma de llegar a proyectos.
- Exageración retro (lluvia Matrix, glitches, sonido al escribir, ventanas superpuestas, neones intensos).
- Copias de arte, personajes, diagramación exacta, assets o tipografía exclusiva de otra web.

## Composición inicial, sujeta a revisión visual
- Header limpio: logo textual/identidad, menú `Inicio · Proyectos · Experiencia · Linux · Contacto`, ES/EN y botón claro/oscuro.
- Primer bloque editorial no necesariamente centrado: nombre, rol, una frase concreta de trabajo técnico, dos enlaces útiles.
- Proyectos: lista asimétrica con capturas reales y descripciones; un proyecto destacado ocupa más espacio y los demás usan filas; no tarjetas clonadas.
- Sección experiencia: texto humano y responsabilidades concretas, quizá líneas de tiempo sin adornos.
- Zona homelab: mapa de servicios sencillo que comunique Raspberry + Docker + despliegue sin revelar información privada.
- Franja inferior de un solo renglón: pequeña, legible, no invasiva; no tapar contenido en móvil.

## Tipografía
- Fuente proporcional de lectura legible para párrafos y títulos (seleccionar/fundamentar antes de fijar).
- Monoespaciada solo para comandos, rutas, código y metadatos.
- Evitar automatismos de usar Inter/Roboto, exceso de negrita, etiquetas pequeñas y todo centrado.

## Colores
El usuario dijo «Plasma Viking, creo que se llama así». **No está confirmado el nombre ni la paleta.** No elegir HEX supuestamente oficiales. Ver `PALETA_PLASMA.md`. Los valores neutrales de la maqueta de comportamiento no constituyen aprobación cromática.

## Etapas del diseño
1. Aprobar interacción Linux y jerarquía de contenido (este documento + `INTERACCIONES_LINUX.md`).
2. Identificar la paleta real de Plasma y construir tokens claro/oscuro.
3. Implementar una página inicial y estados de hover, foco, clic, teclado y móvil.
4. Revisar capturas reales, composición y contraste; corregir señales genéricas antes de extender a otras páginas.

## Política de contenido
- Proyectos: Nube Camiska, DianiMilo, Vision Evaluator, Convertix, Raspberry/Camiska Hub y caso de Power BI si hay material verificado.
- No usar capturas inventadas que parezcan reales. Si no hay captura, indicar `CAPTURA PENDIENTE` en desarrollo, sin publicarla como demo.
- No incluir afirmaciones laborales, cifras ni resultados no comprobados.
