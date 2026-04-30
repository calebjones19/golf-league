/* Fairway Service Worker */
const CACHE = 'golf-league-v4';
const ICON  = '/golf-league/icon-192-v3.png';

// ── Install / Activate ──────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));

// ── Fetch: cache-first for the app shell ────────────────────────
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
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

// ── Badge helpers ────────────────────────────────────────────────
// Use self.navigator (WorkerNavigator) — more explicit than bare `navigator` in SW scope
function swSetBadge(count) {
  const nav = self.navigator;
  if (nav && 'setAppBadge' in nav) nav.setAppBadge(count).catch(() => {});
}
function swClearBadge() {
  const nav = self.navigator;
  if (nav && 'clearAppBadge' in nav) nav.clearAppBadge().catch(() => {});
}

// ── Messages from the page ───────────────────────────────────────
self.addEventListener('message', e => {
  if (!e.data) return;

  // Allow page to force this SW to activate immediately
  if (e.data.type === 'SKIP_WAITING') { self.skipWaiting(); return; }

  if (e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, badgeCount } = e.data;

    // Update OS badge from SW so it persists when the tab is in background
    if (badgeCount > 0) swSetBadge(badgeCount);

    e.waitUntil(
      self.registration.showNotification(title || 'League Chat', {
        body:      body || '',
        icon:      ICON,
        badge:     ICON,
        tag:       tag || 'league-chat',
        renotify:  true,
        vibrate:   [150, 80, 150],
        data:      { url: self.location.origin + '/golf-league/', badgeCount }
      })
    );
  }

  if (e.data.type === 'SET_BADGE') {
    const count = e.data.count || 0;
    count > 0 ? swSetBadge(count) : swClearBadge();
  }

  if (e.data.type === 'CLEAR_BADGE') {
    swClearBadge();
  }
});

// ── Push (future server-side push) ──────────────────────────────
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) {}
  if (data.badgeCount) swSetBadge(data.badgeCount);
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

// ── Notification click → focus/open app + clear badge ──────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  swClearBadge();

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
