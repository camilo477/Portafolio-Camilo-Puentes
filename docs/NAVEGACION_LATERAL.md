# Tarea 06: navegación lateral y enlaces profesionales

## Alcance y decisiones

Se conserva el ancho máximo de lectura de 1120 px, el diseño de proyectos, la
paleta, las fuentes, la cabecera sticky y la consola inferior. No se añaden
bibliotecas, backend ni despliegue. La raíz `/` y `make` abren inglés por petición
explícita; `/es/` sigue disponible y el selector mantiene las rutas equivalentes.

La referencia del encargo a una página independiente de Homelab describe un estado
anterior. Homelab ya es un bloque real de portada por la petición previa de Camilo:
el índice utiliza `#homelab`, abre su contenido y conserva las redirecciones antiguas.
Experiencia sigue condicionada a contenido aprobado. No hay enlace a una sección
vacía; se reserva su número 04 y Homelab conserva el 05 solicitado.

## Márgenes y presentación

Cada lateral mide el espacio entre el borde de la ventana y el contenido de 1120 px.
Una consulta CSS de contenedor muestra sus controles solo con al menos 14 rem de
margen por lado y suficiente altura de ventana. No se estrecha el texto para que
quepan. El criterio también se adapta al aumento del tamaño de fuente. En portátil,
tableta y móvil se ocultan las barras, conservando los enlaces en el footer.

La izquierda utiliza iconos, foco visible y tooltips de nombre y descripción.
Los tooltips aparecen al hover o foco, permiten mover el puntero sobre su contenido
y se descartan con Escape. La derecha muestra un índice compacto con números,
texto y un indicador lateral; `aria-current="location"` identifica la sección activa.

## Destinos profesionales

La configuración pública está en `web/src/data/professional.ts`:

- GitHub: perfil público proporcionado por Camilo.
- LinkedIn: `https://www.linkedin.com/in/camilo-puentes-6671a6262/`, confirmado por Camilo.
- Correo: `mailto:camilopuentes.av@gmail.com` y dirección seleccionable en el footer.
- CV: `null`, sin enlace ni comando de consola hasta recibir el PDF público.

GitHub y LinkedIn abren en una pestaña nueva, tanto en el lateral como en el footer.
El acceso a GitHub de la introducción tiene el mismo comportamiento. Se utiliza
`target="_blank"` con `rel="noopener noreferrer"` y aviso accesible traducido.
El correo conserva su enlace `mailto:`. Los repositorios, demos y fuentes de los
proyectos ya abrían en otra pestaña; la navegación interna conserva la actual.

Para el CV, añadir el PDF aprobado bajo `web/public/media/cv/`, configurar su ruta pública y comprobar
que se descarga correctamente. No hay documento de ejemplo ni destino inventado.

El botón de copiar se habilita solo cuando existe la API de portapapeles. Al copiar,
una región `role="status"` confirma el resultado en el idioma actual. Si el permiso
se deniega se explica cómo seleccionar la dirección visible; sin API o sin JS no
aparece un botón inoperante. Abrir el correo utiliza el cliente configurado por el
visitante; el sitio no envía mensajes.

El icono de GitHub procede de [Primer Octicons](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg),
archivo revisado con SHA de blob `0e55a8ef2db1913cb35f81ae09ffdb58b5422319`.
Su licencia MIT se incluye en `web/public/licenses/octicons.txt`. Los demás símbolos
son SVG sencillos propios. No se instaló una dependencia de iconos.

## Índice y navegación

Las entradas de portada proceden de un modelo tipado; cada ficha genera las suyas
según su contenido real. Se omiten contribuciones, medios u otras secciones vacías.
Los IDs de las fichas son estables entre idiomas y se conservan al traducir un ancla.

`IntersectionObserver` detecta la zona de lectura bajo la cabecera. El scroll solo
actualiza el resaltado: no modifica la URL, no añade historial y no cambia el foco.
No hay sondeo periódico ni listeners de scroll. ResizeObserver reajusta la zona
si cambia la cabecera; los gestos de lectura liberan una selección explícita.

Al activar un enlace se actualiza la URL inmediatamente y se desplaza al destino
con el offset real de la cabecera. Movimiento reducido o efectos desactivados omiten
el desplazamiento suave. Atrás/Adelante y enlaces directos siguen funcionando.
En secciones cortas al final de una ficha, el destino elegido permanece marcado
hasta que el visitante vuelva a desplazarse: no necesita llegar a la parte superior
para considerarse seleccionado. Los enlaces siguen siendo nativos sin JavaScript.

El evento interno del índice sincroniza el scroll, los desplegables y la consola.
Se reutilizan `data-preview-command`, la escritura de 180 ms y las preferencias
existentes; no se añade otro motor de animación ni se ejecutan comandos reales.

## Verificación

Las pruebas específicas cubren idioma inicial incluso sin JS, anchuras entre 320 y
2560 px, texto ampliado, enlaces públicos, correo, copia real y permiso denegado,
tooltips/foco/Escape, comandos, seguimiento de lectura sin historial adicional,
scroll suave/reducido, Homelab, anclas de fichas traducidas y navegación nativa.
Axe comprueba ambos temas e idiomas con tooltips y mensajes de copia visibles.

Las capturas incluyen escritorio de 1920 px, escritorio de 1440 px, portátil de
1280 px, tableta y móvil, en ambos temas e idiomas. Se guardan en `docs/capturas/`,
excluidas de Git.

Resultados de esta iteración:

- `make verify`: formato correcto, 0 errores/advertencias de Astro y TypeScript,
  compilación de 11 páginas, 4 pruebas de contenido y 125 pruebas de navegador
  aprobadas. Se omiten 3 casos de hover en móvil por no aplicar a dispositivos táctiles.
- Tras la optimización final del seguimiento de lectura: `make lint check build`
  y las 18 pruebas de `sidebars.spec.ts` aprobadas de nuevo.
- `make screenshots`: captura completada; revisión visual de escritorio grande
  claro, ficha de proyecto oscura, portátil oscuro, tooltip y footer móvil claro.
  Los márgenes mantienen el ancho de lectura y los enlaces móviles quedan por
  encima de la consola.

La verificación de navegador utiliza Chromium, con tamaños móviles emulados.
Incluye Axe, teclado, texto ampliado y movimiento reducido; no equivale a una
evaluación manual con lector de pantalla o en un teléfono físico.

Actualización de enlaces profesionales: `make lint check build` y las 20 pruebas
de `sidebars.spec.ts` aprobadas. Se comprueba la apertura de GitHub y LinkedIn en
otra pestaña, conservando la URL del portafolio, en ambos idiomas y tamaños.
Las respuestas externas se interceptan en la prueba para no depender de terceros.
Capturas nuevas en ambos temas; revisión visual del lateral oscuro y footer móvil
claro con LinkedIn disponible.
