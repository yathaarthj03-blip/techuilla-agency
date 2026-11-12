/* ==========================================================================
   TECHUILLA HIGH-PERFORMANCE SERVICE WORKER (Cache-First + Range Support)
   Provides instant 0ms offline/cached loading for:
   - 3D Character Models (.fbx, .obj) & Textures
   - 4K/HD Video files (.mp4) with HTTP 206 Partial Content byte slicing
   - Core libraries (Three.js, fflate, FBXLoader)
   - Fonts & Images (including ASCII Hands & Services Zoom Images)
   ========================================================================== */

const CACHE_NAME = 'techuilla-media-cache-v3';

// Priority static assets to pre-cache immediately upon activation
const PRECACHE_ASSETS = [
  'three.min.js',
  'fflate.min.js',
  'FBXLoader.js',
  'assets/character_frank/FBX/Frank.fbx',
  'Techuilla_logo.png',
  'Techuilla_logo_extreme.png',
  'favicon-32x32.png',
  'hand-left.jpg',
  'hand-right.jpg',
  'services_hero_clean.jpg',
  'services_project_1.jpg',
  'services_project_2.jpg',
  'services_project_3.jpg',
  'card_website_dev.mp4',
  'card_application_dev.mp4',
  'card_products_animation.mp4'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best-effort precache: don't fail install if a non-critical file is delayed
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url, { mode: 'no-cors' })
            .then((res) => {
              if (res.ok || res.type === 'opaque') {
                return cache.put(url, res);
              }
            })
            .catch(() => {})
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. Handle HTTP Range Requests (Critical for large .mp4 video seeking)
  const rangeHeader = event.request.headers.get('range');
  if (rangeHeader && url.endsWith('.mp4')) {
    event.respondWith(handleRangeRequest(event.request));
    return;
  }

  // 2. Cache-First Strategy for Images, Fonts, Scripts, 3D Assets
  if (
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.png') ||
    url.endsWith('.webp') ||
    url.endsWith('.woff2') ||
    url.endsWith('.woff') ||
    url.endsWith('.fbx') ||
    url.endsWith('.obj') ||
    url.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Stale-While-Revalidate for HTML Documents
  if (event.request.mode === 'navigate' || url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Default network pass-through
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

/**
 * Handle HTTP Range Requests for MP4 video scrubbing / slicing
 */
async function handleRangeRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(request);

  if (!response) {
    // Fetch full video and store in cache
    const netRes = await fetch(request);
    if (netRes.status === 200 || netRes.type === 'opaque') {
      await cache.put(request, netRes.clone());
    }
    response = netRes;
  }

  const rangeHeader = request.headers.get('range');
  if (!rangeHeader || !response || response.status !== 200) {
    return response;
  }

  const buffer = await response.arrayBuffer();
  const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!rangeMatch) return response;

  const start = parseInt(rangeMatch[1], 10);
  const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : buffer.byteLength - 1;
  const sliced = buffer.slice(start, end + 1);

  return new Response(sliced, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
      'Content-Length': sliced.byteLength,
      'Accept-Ranges': 'bytes'
    }
  });
}
