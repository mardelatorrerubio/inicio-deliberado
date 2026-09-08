# Inicio Deliberado v4 — clave de YouTube fuera del navegador

Esta versión usa un Cloudflare Worker como intermediario. La clave `YOUTUBE_API_KEY` se guarda como **Secret** en Cloudflare y nunca se incluye en GitHub ni en el JavaScript de la página.

## Archivos para GitHub Pages

Sube/reemplaza en tu repositorio estos archivos:
- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`

`worker.js` NO va en GitHub Pages: se pega en Cloudflare Workers.

## Crear el Worker desde el panel de Cloudflare

1. Crea una cuenta en Cloudflare y abre **Workers & Pages**.
2. Crea un Worker nuevo. Puedes llamarlo `inicio-deliberado-youtube`.
3. Abre el editor del Worker y sustituye el código por el contenido de `worker.js`. Despliega.
4. Ve al Worker > **Settings** > **Variables and Secrets** > **Add**.
5. Tipo: **Secret**. Nombre exacto: `YOUTUBE_API_KEY`. Valor: tu clave de YouTube Data API v3. Despliega/guarda el cambio.
6. Copia la URL pública del Worker, con forma `https://inicio-deliberado-youtube.<tu-subdominio>.workers.dev`.
7. Abre Inicio Deliberado > **Canales** y pega esa URL en **Servicio privado**. Pulsa **Guardar servicio**.
8. Si el estado dice “Servicio conectado”, pulsa actualizar. Tus canales de v3 se conservan porque usan la misma clave local `yd_channels_v3`.

## Google Cloud después de migrar

La API key debe mantener **Restricciones de API: YouTube Data API v3**. Como ahora la llamada a Google sale desde Cloudflare Workers y no desde tu navegador, no uses la restricción “Sitios web (HTTP referrers)” para esa clave. Déjala sin restricción de aplicación. La clave ya no está expuesta en el navegador: queda guardada como Secret cifrado en Cloudflare.

## Seguridad

El Worker solo acepta peticiones CORS procedentes de `https://mandelatorrerubio.github.io`, limita las rutas a consultar canales/vídeos y no devuelve nunca la API key. CORS/Origin reduce uso casual desde otras webs, aunque no constituye autenticación criptográfica frente a clientes que falsifiquen cabeceras. Para un uso personal, el principal salto de seguridad es que la clave deja de formar parte del almacenamiento y tráfico del navegador.
