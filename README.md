# Inicio Deliberado v2

Página de inicio minimalista para Chrome/Android.

## Qué cambia en v2
- Añadir canales acepta directamente la URL de YouTube, @handle, nombre o ID `UC…`.
- Si un servidor público Piped falla, prueba automáticamente varios servidores alternativos.
- Los errores de red se muestran de forma comprensible en lugar de `Failed to fetch`.
- Incluye `manifest.webmanifest`, `sw.js` e icono para instalación PWA real.

## Actualizar GitHub Pages
Sube/reemplaza **todos** estos archivos en la raíz del repositorio:
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`
- `README.md`

Después de confirmar el commit, GitHub Pages volverá a publicar automáticamente.

## Añadir un canal
Abre el canal en YouTube, copia la URL de la barra de direcciones y pégala en **Canales**. Las URL con `/channel/UC…` se pueden añadir sin resolver nada; las URL modernas con `/@handle` se resuelven mediante uno de los servidores públicos configurados.
