/* Golf League Service Worker */
const CACHE = 'golf-league-v1';
const ICON  = '/golf-league/icon-192.png';

// ── Install / Activate ──────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));

// ── Fetch: cache-first for the app shell ────────────────────────
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
  // Only cache same-origin HTML/JS/CSS
  if (!url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Messages from the page ───────────────────────────────────────
self.addEventListener('message', e => {
  if (!e.data) return;

  if (e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = e.data;
    e.waitUntil(
      self.registration.showNotification(title || 'League Chat', {
        body:      body || '',
        icon:      ICON,
        badge:     ICON,
        tag:       tag || 'league-chat',
        renotify:  true,
        vibrate:   [150, 80, 150],
        data:      { url: self.location.origin + '/golf-league/' }
      })
    );
  }
});

// ── Push (future server-side push) ──────────────────────────────
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'League Chat', {
      body:     data.body || '',
      icon:     ICON,
      badge:    ICON,
      tag:      'league-push',
      renotify: true,
      data:     data
    })
  );
});

// ── Notification click → focus / open the app ───────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) ||
                 self.location.origin + '/golf-league/';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        for (const client of list) {
          if (client.url.includes('golf-league') && 'focus' in client) {
            client.postMessage({ type: 'OPEN_CHAT' });
            return client.focus();
          }
        }
        return self.clients.openWindow(target);
      })
  );
});
