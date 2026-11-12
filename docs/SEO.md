# SEO y publicación

El origen canónico es `https://camiska.lat`. Astro lo toma de `web/src/lib/site.ts`, que también delimita las diez páginas canónicas: dos portadas y cuatro proyectos en cada idioma. Las redirecciones de `/` y de las antiguas rutas de Homelab quedan fuera del sitemap.

## Metadatos

`Seo.astro` genera título, descripción, canonical, Open Graph, Twitter Cards y JSON-LD en el HTML estático. Cada idioma tiene canonical propia. Las alternativas ES/EN usan las rutas traducidas reales (`proyectos` / `projects`); `x-default` apunta a la versión inglesa equivalente, también el destino inicial de la raíz. Las anclas y parámetros no forman parte de la canonical.

Las fichas conservan las descripciones de su colección. El JSON-LD describe el sitio (`WebSite`), el perfil público (`Person`) y las fichas (`CreativeWork`). No incorpora autoría individual de componentes, credenciales académicas, fechas, valoraciones ni estadísticas no aprobadas.

La integración oficial `@astrojs/sitemap` genera `sitemap-index.xml` y `sitemap-0.xml`. Las traducciones están declaradas en el HTML; no se duplican en el XML. El endpoint estático `robots.txt` permite rastrear el sitio e indica la URL absoluta del índice. Esto sigue los mecanismos documentados por [Astro](https://docs.astro.build/en/guides/integrations-guide/sitemap/) y [Google para sitios localizados](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Vista previa al compartir

Las imágenes `web/public/social/portfolio-es.png` y `portfolio-en.png` son composiciones tipográficas originales de 1200 × 630 píxeles. Reutilizan las fuentes y los tokens provisionales de la web; no representan una captura de un proyecto. Las referencias Open Graph son absolutas e incluyen tipo, tamaño y texto alternativo, según el [protocolo Open Graph](https://ogp.me/).

Para regenerarlas con las dependencias del proyecto y Chromium instalado:

```sh
node web/scripts/generate-social-images.mjs
```

Si se utiliza Chromium del sistema, indicar su ubicación mediante `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Las imágenes se versionan y el build normal no necesita iniciar un navegador.

## Comprobaciones

```sh
make verify
```

Las pruebas comprueban las diez páginas sin JavaScript, canonicals, alternativas recíprocas, metadatos específicos, JSON-LD, ausencia de redirecciones en el sitemap, robots y dimensiones reales de los PNG servidos. No equivalen a indexación o validación en una cuenta de Google.

Después de un despliegue **autorizado por separado**, comprobar públicamente:

- `https://camiska.lat/robots.txt`: permite búsqueda y contiene la línea Sitemap.
- `https://camiska.lat/sitemap-index.xml` y `sitemap-0.xml`: HTTP 200 y diez URLs correctas.
- `https://camiska.lat/social/portfolio-es.png` y `portfolio-en.png`: HTTP 200, MIME `image/png` e imagen visible.
- Código fuente de ambas portadas y una ficha por idioma: canonical y Open Graph absolutos.
- El correo público conserva su enlace `mailto:` y es legible sin JavaScript.

Cloudflare puede añadir contenido a robots o transformar HTML. Revisar la respuesta pública, además del build. Las políticas de robots para otros usos no deben confundirse con un bloqueo del rastreador de búsqueda.

Los enlaces de correo aprobados llevan los comentarios `email_off` que [Cloudflare documenta para excluir direcciones concretas de la ofuscación](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/). Así el HTML conserva el contacto sin depender del script de decodificación. Esta excepción vive en el código; no requiere cambiar la configuración global de Cloudflare. Su comportamiento público debe verificarse tras desplegar.

## Google Search Console — pasos manuales

1. Iniciar sesión personalmente en [Search Console](https://search.google.com/search-console/) y añadir una propiedad de tipo **Dominio** para `camiska.lat`, sin protocolo ni ruta.
2. Copiar el registro TXT de verificación que muestre Google. En el panel DNS de Cloudflare, añadirlo al dominio raíz (`@`), conservando los registros existentes. No cambiar el túnel ni compartir credenciales.
3. Volver a Search Console y verificar. Si Google todavía no encuentra el TXT, esperar la propagación y volver a comprobarlo. Conservar el registro después de verificar. [Instrucciones oficiales de verificación](https://support.google.com/webmasters/answer/9008080).
4. **Solo cuando el sitemap esté desplegado y responda HTTP 200**, abrir Sitemaps y enviar `https://camiska.lat/sitemap-index.xml`. Revisar el resultado de procesamiento. [Guía oficial de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
5. Inspeccionar `/en/`, `/es/` y una ficha de cada idioma; revisar que Google pueda obtenerlas y que no haya bloqueos o canonicals inesperadas. Solicitar indexación manualmente si procede y revisar después el informe de páginas.

Verificar la propiedad o enviar el sitemap no garantiza indexación ni una fecha de aparición. Este trabajo no accede a la cuenta de Search Console, no crea registros DNS y no envía solicitudes de indexación.
