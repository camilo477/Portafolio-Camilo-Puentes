# Tarea 05: contenido profesional, Homelab y navegación

> Actualización posterior: Camilo autorizó la inspección SSH y pidió Homelab
> desplegable en portada. [Estado actual y evidencia](HOMELAB.md). El texto siguiente
> documenta la entrega original, previa a esa inspección.

Se conservan Astro, los tokens cromáticos, las fuentes, el stack principal,
las tres fichas, las demos y las microinteracciones. No se añaden dependencias,
backend ni despliegue. La petición posterior de Camilo reemplaza los avisos públicos
de desarrollo requeridos en el plan original: la paleta continúa pendiente de
identificación en esta documentación y en los comentarios de CSS, no en el footer.

## Navegación y scroll

La cabecera incorpora Homelab como enlace principal. En móvil mantiene dos filas:
preferencias y navegación, omitiendo únicamente los prefijos decorativos de los
enlaces. Los textos humanos siguen visibles. Experiencia utiliza la misma
navegación principal cuando haya entradas aprobadas; no se enlaza una sección vacía.

El offset sigue la altura real de la cabecera. Al abrir un hash se espera a que el
estado de los desplegables y el layout se hayan asentado; la carga de fuentes y los
cambios de altura pueden reajustar el ancla. En `#dianimilo`, el destino visual es
el comienzo de Proyectos para conservar su encabezado junto al primer resumen.
Los otros hashes sitúan su proyecto correspondiente bajo la cabecera.

El ajuste no intercepta la navegación, no cambia el foco ni espera una animación.
Rueda, toque, pulsación y teclado cancelan el seguimiento del ancla para no arrastrar
al lector después de desplazarse. Se cubren enlaces directos, recarga, historial y
clic repetido sobre el hash actual. CSS aporta un margen de respaldo para los
hashes sin JavaScript. Las capturas ahora registran el scroll real de navegación,
sin llamar a `scrollIntoView` sobre la tarjeta para corregirlo solo en la imagen.

## Homelab

[El caso y sus fuentes](HOMELAB.md) explican la Raspberry personal, Docker, la
separación de servicios y datos, el script de actualización y los límites de
recuperación. Los archivos Nginx y las referencias a Cloudflare se distinguen de
una configuración operativa confirmada. El diagrama muestra solo componentes
documentados y no publica información de red ni credenciales.

## Experiencia profesional: revisión local

El borrador editorial ES/EN está en `docs/borradores/EXPERIENCIA_PROFESIONAL.md`,
excluido por `.gitignore` y fuera de las colecciones de Astro. No se versiona en el
repositorio público. Se basa en la presentación de Camilo ya suministrada:
backend/full stack, aplicaciones, APIs, Python, Django, React, PostgreSQL,
integraciones y despliegues Linux. Distingue esas declaraciones de un historial
laboral y detalla qué evidencia falta para contribuciones y responsabilidad en
bases de datos. No agrega empleadores, periodos ni cifras.

Las listas públicas de experiencia siguen vacías. El helper `publishedExperience`
alimenta tanto la sección como los enlaces, y la validación sigue exigiendo
`approvedForPublication: true`. La marca solo se establece después de aprobación
real. Mientras tanto no se renderiza experiencia ni un mensaje de preparación.
Un hash antiguo de esa sección no anuncia un destino que ya no existe.

## Inventario complementario

El stack principal y Spring Boot/Lua en aprendizaje/exploración se conservan.
El inventario complementario mantiene ocho categorías, abiertas mediante
`details/summary` nativos; puede explorarse una a la vez con ratón, teclado, toque
y sin JS. Los nombres siguen siendo texto, sin enlaces ni paradas de tabulación.

En escritorio, las categorías se reparten en dos columnas independientes: expandir
una no aumenta el espacio de las categorías de la otra columna. En móvil se apilan
en una sola columna, conservando el orden de lectura y de teclado. Una comprobación
de geometría verifica que abrir Linux no cambie la altura de Bases de datos ni
desplace las categorías de la otra columna.

Una selección derivada evita repetir tecnologías del stack visible o de otras
categorías. pandas y NumPy se agrupan en datos. Ninguna herramienta confirmada se
pierde: una prueba compara la unión visible y complementaria con el inventario
original. Se conservan las eliminaciones explícitas de Tarea 03 y no se infiere
nivel profesional para el inventario secundario.

## Interfaz sin mensajes de desarrollo

El footer identifica el portafolio, sin «en construcción» ni aviso cromático.
Las fichas omiten contribuciones no aprobadas, medios ausentes y diagramas vacíos;
el contenido pendiente sigue en el modelo. Se mantiene el componente de galería,
reproductor y validación de archivos. Se elimina el componente de placeholder,
sin sustituirlo por imágenes genéricas. Las condiciones reales de las demos y los
límites del caso de ingeniería permanecen visibles porque sí orientan al visitante.

## Comprobaciones

Las pruebas cubren anclas con fuentes retrasadas, historial, resize, texto ampliado,
lectura después de desplazarse, ausencia de JS, navegación principal compacta,
publicación condicional, privacidad, integridad del inventario, ES/EN, temas y
fichas existentes. Homelab conserva las comprobaciones axe en ambos idiomas,
temas y tamaños. Las ocho categorías se verifican abiertas, una por una.

Las capturas se generan en `docs/capturas/`, ignoradas por Git, e incluyen Homelab
completo, su diagrama, viewport y navegación por hashes.

Resultados de validación local:

- `make verify` aprobado: formato correcto, Astro/TypeScript con 0 errores,
  advertencias y sugerencias, y 11 páginas estáticas compiladas.
- 4 pruebas de contenido y 99 pruebas de navegador aprobadas. Se omiten 3 casos
  de hover en móvil; la interacción táctil tiene sus propias comprobaciones.
- Axe sin infracciones en los estados evaluados, incluidas las ocho categorías
  abiertas individualmente y Homelab en ambos temas e idiomas.
- La prueba de geometría de la transición comprueba primero los 240 ms reales y
  ralentiza solo el reloj de animación de Chromium durante su muestreo. Esto evita
  resultados dependientes de la carga del equipo sin cambiar la animación del sitio.
- Comprobación pública separada: ambas demos respondieron HTTP 200; se abrió la
  demo de solo lectura de Nube y se verificó el aviso de perfiles ficticios de
  DianiMilo conservando `?demo=1#/`. No se probaron todos sus flujos ni se modificaron
  datos o credenciales.
- El borrador está ignorado por Git, no aparece entre los archivos candidatos al
  commit y no se sirve en la compilación pública. El escaneo de candidatos no
  encontró claves privadas, patrones de tokens ni rutas personales del entorno.
- `npm run screenshots` aprobado: 174 capturas locales, incluidas 36 de Homelab,
  con combinaciones de escritorio, tableta, móvil, ES/EN y claro/oscuro.
  Se inspeccionaron visualmente el diagrama de Homelab en escritorio y móvil,
  el inventario compacto oscuro y la navegación móvil a `#dianimilo`: el encabezado
  de Proyectos queda visible bajo la cabecera sin modificar el scroll para la foto.

Los resultados corresponden a Chromium en escritorio y móvil emulado. No equivalen
a una evaluación manual con lector de pantalla, a pruebas en dispositivos físicos
ni a una certificación de las aplicaciones externas.
