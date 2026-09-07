# Inicio Deliberado v3

Esta versión elimina la dependencia de Piped y utiliza directamente la API oficial de YouTube Data API v3.

## Antes de usar la sección de YouTube

Necesitas crear una clave API de Google Cloud con **YouTube Data API v3** habilitada. La clave se pega en `Ajustes` dentro de Inicio Deliberado y se guarda únicamente en el almacenamiento local del navegador.

Por seguridad, conviene restringir la clave en Google Cloud a:

- API: YouTube Data API v3
- Sitio web permitido: `https://mandelatorrerubio.github.io/*`

## Añadir canales

En `Canales`, pega la URL del canal, por ejemplo:

`https://www.youtube.com/@nombreDelCanal`

También admite un ID de canal que empiece por `UC`.

## Publicación

Sustituye en el repositorio los archivos de esta carpeta y haz Commit. GitHub Pages volverá a publicar automáticamente.
