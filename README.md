# Inicio Deliberado — móvil

PWA minimalista diseñada para usarse como página principal del navegador: búsqueda, accesos que tú has elegido y un feed limitado de YouTube con solo tus canales.

## Portada
- Buscador de Google, sin un feed de noticias debajo.
- Accesos directos a Libertad Digital, The Objective, Vozpópuli y ABC Andalucía.
- Feed de YouTube únicamente de los canales añadidos manualmente.
- Solo se muestran 12 vídeos cada vez; para seguir hay que pulsar “Ver anteriores”. No hay scroll infinito.
- El reproductor abre con autoplay desactivado y usando `youtube-nocookie.com`.
- El filtro “Sin cortos ≤ 3 min” oculta cualquier vídeo de tres minutos o menos.

## Cómo usarla como página principal en Chrome para Android
1. Publica esta carpeta en una URL HTTPS (por ejemplo GitHub Pages, Cloudflare Pages, Netlify o Vercel).
2. Abre Chrome → Configuración → Página principal.
3. Activa la página principal y selecciona la opción de URL personalizada.
4. Pega la URL pública de esta PWA.
5. En la página Nueva pestaña de Chrome, desactiva Discover para eliminar el carrusel de noticias.

También puedes instalar la PWA desde Chrome mediante “Instalar aplicación” / “Añadir a pantalla de inicio”.

## Privacidad
La lista de canales y la configuración se guardan localmente en el dispositivo. La app no inicia sesión en tu cuenta de Google. Para consultar vídeos usa una instancia pública de Piped, configurable desde Ajustes.
