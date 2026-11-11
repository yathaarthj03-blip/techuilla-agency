/* ==========================================================================
   TECHUILLA HIGH-PERFORMANCE SERVICE WORKER (Cache-First + Range Support)
   Provides instant 0ms offline/cached loading for:
   - 3D Character Models (.fbx, .obj) & Textures
   - 4K/HD Video files (.mp4) with HTTP 206 Partial Content byte slicing
   - Core libraries (Three.js, fflate, FBXLoader)
   - Fonts & Images
   ========================================================================== */

const CACHE_NAME = 'techuilla-media-cache-v2';

// Priority static assets to pre-cache immediately upon activation
const PRECACHE_ASSETS = [
  'three.min.js',
  'fflate.min.js',
  'FBXLoader.js',
  'assets/character_frank/FBX/Frank.fbx',
  'Techuilla_logo.png',
  'Techuilla_logo_extreme.png',
  'favicon-32x32.png',
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
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests for our origin
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  const pathname = url.pathname.toLowerCase();
  const isMediaOr3D = (
    pathname.endsWith('.mp4') ||
    pathname.endsWith('.webm') ||
    pathname.endsWith('.fbx') ||
    pathname.endsWith('.obj') ||
    pathname.endsWith('.mtl') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css')
  );

  // For HTML navigations: ALWAYS fetch live from network first, bypass cache
  if (req.mode === 'navigate' || pathname.endsWith('.html') || pathname === '/' || pathname.endsWith('/techuilla-agency') || pathname.endsWith('/techuilla-agency/')) {
    event.respondWith(
      fetch(req, { cache: 'no-cache' }).catch(() => caches.match(req))
    );
    return;
  }

  // Handle Range Requests (Video playback / seeking from cache)
  const rangeHeader = req.headers.get('range');
  if (rangeHeader && isMediaOr3D) {
    event.respondWith(handleRangeRequest(req, rangeHeader));
    return;
  }

  // Cache-First strategy for media, 3D character, textures, and scripts
  if (isMediaOr3D) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(req).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, clone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});

// HTTP 206 Partial Content synthesizer for cached videos
async function handleRangeRequest(request, rangeHeader) {
  const cache = await caches.open(CACHE_NAME);
  // Match clean URL without Range header
  const cleanReq = new Request(request.url);
  let response = await cache.match(cleanReq);

  if (!response) {
    response = await fetch(request);
    // If network returns 200 or 206, return it directly
    if (response.status === 206 || !response.ok) {
      return response;
    }
    // Cache the full 200 response
    const clone = response.clone();
    cache.put(cleanReq, clone);
  }

  const arrayBuffer = await response.arrayBuffer();
  const total = arrayBuffer.byteLength;

  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return response;

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : total - 1;

  if (start >= total || end >= total || start > end) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${total}`,
        'Accept-Ranges': 'bytes'
      }
    });
  }

  const slicedData = arrayBuffer.slice(start, end + 1);

  return new Response(slicedData, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': slicedData.byteLength.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
