const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp }     = require('firebase-admin/app');
const { getFirestore }      = require('firebase-admin/firestore');
const webpush               = require('web-push');

initializeApp();

// Public VAPID key is safe to commit (it lives in client-side JS too).
// Private key must be set via a functions/.env file (gitignored) before deploying:
//   VAPID_PRIVATE=<your-private-key>
const VAPID_PUBLIC  = 'BG7H_PDjyGiY1nEAoGj5K2OZ46ZwGQeHsjtkVXElkYm_zDm8CZ84FpJIEot6lEgWoLgOlyYNswEiFtT1ZcTTg9E';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

if (VAPID_PRIVATE) {
  webpush.setVapidDetails(
    'mailto:caleb.jones@planningcenter.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE
  );
}

exports.sendChatNotification = onDocumentWritten('leagues/main', async (event) => {
  if (!VAPID_PRIVATE) {
    console.error('VAPID_PRIVATE not set — push notifications disabled');
    return null;
  }

  const before = event.data.before.exists ? event.data.before.data() : {};
  const after  = event.data.after.exists  ? event.data.after.data()  : {};

  const oldMsgs = (before.messages || []).filter(function(m){ return !m.deleted; });
  const newMsgs = (after.messages  || []).filter(function(m){ return !m.deleted; });

  // Find genuinely new messages (not edits or deletions)
  const oldIds = new Set(oldMsgs.map(function(m){ return m.id; }));
  const added  = newMsgs.filter(function(m){ return !oldIds.has(m.id); });

  if (added.length === 0) return null;

  const latest   = added[added.length - 1];
  const senderId = latest.senderId || '';

  const title = latest.senderName || 'League Chat';
  const body  = latest.attachment
    ? ((latest.text || '') + (latest.attachment.type === 'gif' ? ' 🎞️' : ' 📎'))
    : (latest.text || '');

  const payload = JSON.stringify({
    title,
    body,
    tag:        'league-chat',
    badgeCount: newMsgs.length,
    data:       { url: 'https://calebjones19.github.io/golf-league/' }
  });

  // Fetch all stored push subscriptions
  const db       = getFirestore();
  const subsSnap = await db.collection('leagues/main/pushSubscriptions').get();
  if (subsSnap.empty) return null;

  const sends = [];
  subsSnap.forEach(function(doc) {
    const { subscription, userId } = doc.data();
    if (userId === senderId) return;              // don't notify the sender
    if (!subscription || !subscription.endpoint) return;

    sends.push(
      webpush.sendNotification(subscription, payload)
        .catch(function(err) {
          // Expired or invalid subscription — clean it up
          if (err.statusCode === 410 || err.statusCode === 404) {
            return doc.ref.delete();
          }
          console.error('Push send failed:', err.statusCode, err.message);
        })
    );
  });

  await Promise.all(sends);
  return null;
});
