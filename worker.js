const ALLOWED_ORIGIN = 'https://mandelatorrerubio.github.io';
const YT_BASE = 'https://www.googleapis.com/youtube/v3/';

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
}
function json(data, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), { status, headers: cors(origin) });
}
function safeOrigin(request) {
  return request.headers.get('Origin') || '';
}
function allowed(request) {
  const o = safeOrigin(request);
  return o === ALLOWED_ORIGIN;
}
async function yt(env, path, params) {
  const u = new URL(YT_BASE + path);
  for (const [k, v] of Object.entries({ ...params, key: env.YOUTUBE_API_KEY })) {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  }
  const r = await fetch(u.toString(), {
    cf: { cacheTtl: 300, cacheEverything: true }
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = body?.error?.message || `YouTube API HTTP ${r.status}`;
    throw new Error(msg);
  }
  return body;
}
function parseISO(s = '') {
  const m = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
}

export default {
  async fetch(request, env) {
    const origin = safeOrigin(request);
    if (request.method === 'OPTIONS') {
      if (!allowed(request)) return json({ error: 'Origen no autorizado' }, 403, origin);
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== 'GET') return json({ error: 'Método no permitido' }, 405, origin);
    if (!allowed(request)) return json({ error: 'Origen no autorizado' }, 403, origin);
    if (!env.YOUTUBE_API_KEY) return json({ error: 'Falta el secreto YOUTUBE_API_KEY en el Worker' }, 500, origin);

    const u = new URL(request.url);
    try {
      if (u.pathname === '/health') return json({ ok: true }, 200, origin);

      if (u.pathname === '/channel') {
        const id = (u.searchParams.get('id') || '').trim();
        const handle = (u.searchParams.get('handle') || '').trim();
        if (!id && !handle) return json({ error: 'Falta id o handle' }, 400, origin);
        if (id && !/^UC[\w-]{20,}$/.test(id)) return json({ error: 'ID de canal no válido' }, 400, origin);
        if (handle && !/^@[\w.-]{2,100}$/.test(handle)) return json({ error: 'Handle no válido' }, 400, origin);
        const params = { part: 'snippet,contentDetails' };
        if (id) params.id = id; else params.forHandle = handle;
        const d = await yt(env, 'channels', params);
        const c = d.items?.[0];
        if (!c) return json({ error: 'Canal no encontrado' }, 404, origin);
        return json({ id: c.id, name: c.snippet?.title || c.id, uploads: c.contentDetails?.relatedPlaylists?.uploads || '' }, 200, origin);
      }

      if (u.pathname === '/videos') {
        const channelId = (u.searchParams.get('channelId') || '').trim();
        if (!/^UC[\w-]{20,}$/.test(channelId)) return json({ error: 'channelId no válido' }, 400, origin);
        const cd = await yt(env, 'channels', { part: 'snippet,contentDetails', id: channelId });
        const c = cd.items?.[0];
        if (!c) return json({ error: 'Canal no encontrado' }, 404, origin);
        const uploads = c.contentDetails?.relatedPlaylists?.uploads;
        if (!uploads) return json({ channel: { id: c.id, name: c.snippet?.title || c.id }, videos: [] }, 200, origin);
        const pl = await yt(env, 'playlistItems', { part: 'snippet,contentDetails', playlistId: uploads, maxResults: 20 });
        const rows = (pl.items || []).map(x => ({
          id: x.contentDetails?.videoId || x.snippet?.resourceId?.videoId,
          title: x.snippet?.title || 'Sin título',
          channel: x.snippet?.videoOwnerChannelTitle || c.snippet?.title || c.id,
          publishedAt: x.contentDetails?.videoPublishedAt || x.snippet?.publishedAt,
          thumb: x.snippet?.thumbnails?.medium?.url || x.snippet?.thumbnails?.high?.url || ''
        })).filter(x => x.id);
        const ids = rows.map(x => x.id).join(',');
        if (ids) {
          const vd = await yt(env, 'videos', { part: 'contentDetails', id: ids });
          const dm = new Map((vd.items || []).map(v => [v.id, parseISO(v.contentDetails?.duration || '')]));
          rows.forEach(v => { v.duration = dm.get(v.id) || 0; });
        }
        return json({ channel: { id: c.id, name: c.snippet?.title || c.id, uploads }, videos: rows }, 200, origin);
      }

      return json({ error: 'Ruta no encontrada' }, 404, origin);
    } catch (e) {
      return json({ error: e?.message || 'Error del servicio' }, 502, origin);
    }
  }
};
