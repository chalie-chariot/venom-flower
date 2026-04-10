/* eslint-disable no-restricted-globals */
/* App shell: Cache First. 동적 업로드·클라우드 API는 캐시하지 않음. */
const CACHE_NAME = 'gibonjgi-v1';

const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@300;400;500;600&display=swap';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  FONT_CSS
];

function isPassthroughRequest(req) {
  if (req.method !== 'GET') return true;
  const url = new URL(req.url);
  if (url.protocol === 'chrome-extension:') return true;
  if (url.hostname.includes('firebasestorage.googleapis.com')) return true;
  if (url.hostname === 'firestore.googleapis.com') return true;
  if (url.hostname.endsWith('.firebaseio.com')) return true;
  return false;
}

function shouldStoreRuntimeCopy(req, res) {
  if (!res || res.status !== 200 || res.type === 'opaque') return false;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) return true;
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return true;
  if (url.hostname === 'www.gstatic.com' && url.pathname.includes('firebasejs')) return true;
  return false;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((u) =>
            cache.add(u).catch((err) => {
              console.warn('[sw] precache skip:', u, err && err.message);
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (isPassthroughRequest(req)) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && shouldStoreRuntimeCopy(req, res)) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return caches.match(req);
        });
    })
  );
});
