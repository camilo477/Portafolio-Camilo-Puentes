# Paleta de KDE Plasma — pendiente de identificación exacta

Camilo eligió los colores que usa en KDE Plasma y recuerda el nombre aproximado «Viking». No se ha podido confirmar un tema con ese nombre mediante las fuentes consultadas. **No asociar códigos HEX a «Viking» hasta ver el esquema instalado.**

## Cómo localizarlo en Fedora KDE (Plasma 6)

```bash
kreadconfig6 --file kdeglobals --group General --key ColorScheme
kreadconfig6 --file plasmarc --group Theme --key name
```

También se puede abrir **Configuración del sistema → Colores y temas → Colores** para ver el nombre exacto.

Los archivos de esquemas de color suelen estar en:

- `~/.local/share/color-schemes/`
- `/usr/share/color-schemes/`

El usuario puede compartir el nombre exacto o el archivo `.colors` correspondiente (no necesita subir toda su configuración personal). Si el tema es un *Plasma Style* con su propio archivo `colors`, habrá que consultar también `~/.local/share/plasma/desktoptheme/<tema>/colors` o `/usr/share/plasma/desktoptheme/<tema>/colors`.

Referencia oficial KDE: https://develop.kde.org/docs/plasma/ (distingue el esquema global de colores y el estilo Plasma, que puede aportar colores propios).

## Una vez confirmado
1. Extraer tokens semánticos `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--focus` y `--link`.
2. Diseñar por separado el claro y el oscuro; si solo existe uno, crear una variante complementaria coherente y etiquetarla como **derivada**, no «oficial».
3. Probar contraste texto/fondo, enlaces, foco, hover, botones y código para ambos temas.
4. Documentar la fuente del color y la decisión de adaptación web.

## Estado
Identidad de tema: **pendiente**. Interacción, estructura y bilingüismo: **confirmados**.
