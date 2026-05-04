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

const APP_URL = 'https://calebjones19.github.io/golf-league/';

if (VAPID_PRIVATE) {
  webpush.setVapidDetails('mailto:caleb.jones@planningcenter.com', VAPID_PUBLIC, VAPID_PRIVATE);
}

exports.sendChatNotification = onDocumentWritten('leagues/main', async (event) => {
  if (!VAPID_PRIVATE) {
    console.error('VAPID_PRIVATE not set — push notifications disabled');
    return null;
  }

  const before = event.data.before.exists ? event.data.before.data() : {};
  const after  = event.data.after.exists  ? event.data.after.data()  : {};

  // notifications = [{ payload: string, excludeUserId: string }]
  const notifications = [];

  // ── 1. New chat messages ──────────────────────────────────────────────────
  const oldMsgs    = (before.messages || []).filter(m => !m.deleted);
  const newMsgs    = (after.messages  || []).filter(m => !m.deleted);
  const oldMsgIds  = new Set(oldMsgs.map(m => m.id));
  const addedMsgs  = newMsgs.filter(m => !oldMsgIds.has(m.id));

  for (const msg of addedMsgs) {
    const title = msg.senderName || 'League Chat';
    const body  = msg.attachment
      ? ((msg.text || '') + (msg.attachment.type === 'gif' ? ' 🎞️' : ' 📎'))
      : (msg.text || '');
    notifications.push({
      payload: JSON.stringify({ title, body, tag: 'league-chat', badgeCount: newMsgs.length, data: { url: APP_URL } }),
      excludeUserId: msg.senderId || ''
    });
  }

  // ── 2. New announcements ──────────────────────────────────────────────────
  const oldAnns   = before.announcements || [];
  const newAnns   = after.announcements  || [];
  const oldAnnIds = new Set(oldAnns.map(a => a.id));
  const addedAnns = newAnns.filter(a => !oldAnnIds.has(a.id));

  for (const ann of addedAnns) {
    notifications.push({
      payload: JSON.stringify({
        title: '📢 ' + ann.title,
        body:  ann.body || '',
        tag:   'announcement-' + ann.id,
        data:  { url: APP_URL }
      }),
      excludeUserId: '' // everyone gets announcements
    });
  }

  // ── 3. Round submissions ──────────────────────────────────────────────────
  const oldRounds   = before.rounds || [];
  const newRounds   = after.rounds  || [];
  const oldRoundIds = new Set(oldRounds.map(r => r.id));
  const addedRounds = newRounds.filter(r => !oldRoundIds.has(r.id));
  const teams       = after.teams || [];

  for (const round of addedRounds) {
    const tA = teams.find(t => t.id === round.teamAId);
    const tB = teams.find(t => t.id === round.teamBId);
    if (!tA || !tB) continue;
    const pA = round.pointsA, pB = round.pointsB;
    const winner = pA > pB ? tA.name : pB > pA ? tB.name : null;
    const body = tA.name + '  ' + pA + ' – ' + pB + '  ' + tB.name
               + (winner ? '\n' + winner + ' wins! 🏆' : '\nAll square — tied!');
    notifications.push({
      payload: JSON.stringify({
        title: 'Week ' + round.week + ' Results 🏌️',
        body,
        tag:  'round-' + round.id,
        data: { url: APP_URL }
      }),
      excludeUserId: '' // everyone wants to see the result
    });
  }

  // ── 4. Birdie / Eagle / Albatross ─────────────────────────────────────────
  const beforeLive = before.liveMatch;
  const afterLive  = after.liveMatch;

  if (afterLive && afterLive.scores) {
    // Resolve pars for this week's nine
    const schedule  = after.schedule || [];
    const league    = after.league   || {};
    const schedWeek = schedule.find(s => s.week === afterLive.week);
    const nine      = (schedWeek && schedWeek.nine) || 'back';
    const holes     = league.holes || 9;
    const pars      = nine === 'front'
      ? (league.parFront && league.parFront.length > 0 ? league.parFront : Array(holes).fill(4))
      : (league.par      && league.par.length      > 0 ? league.par      : Array(holes).fill(4));
    const holeOffset = nine === 'back' ? 9 : 0;

    const players   = after.players || [];
    const playerMap = {};
    players.forEach(p => { playerMap[p.id] = p.name; });

    const beforeScores = (beforeLive && beforeLive.scores) || {};

    for (const [pid, holeScores] of Object.entries(afterLive.scores)) {
      const prevScores = beforeScores[pid] || [];
      for (let h = 0; h < holeScores.length; h++) {
        const newScore = holeScores[h];
        const oldScore = prevScores[h];
        if (newScore == null) continue;          // hole not scored yet
        if (oldScore != null) continue;          // score was already set — not new
        const par  = pars[h];
        if (!par) continue;
        const diff = newScore - par;
        if (diff > -1) continue;                 // par or worse, no celebration needed
        const playerName = playerMap[pid] || 'Someone';
        const holeNum    = h + 1 + holeOffset;
        let emoji, label;
        if      (diff <= -3) { emoji = '🦅'; label = 'Albatross'; }
        else if (diff === -2) { emoji = '🦅'; label = 'Eagle'; }
        else                  { emoji = '🐦'; label = 'Birdie'; }
        notifications.push({
          payload: JSON.stringify({
            title: emoji + ' ' + label + '!',
            body:  playerName + ' — Hole ' + holeNum,
            tag:   'score-' + pid + '-h' + holeNum,
            data:  { url: APP_URL }
          }),
          excludeUserId: '' // everyone celebrates birdies
        });
      }
    }
  }

  if (notifications.length === 0) return null;

  // ── Fetch subscriptions once, fan out all notifications ───────────────────
  const db       = getFirestore();
  const subsSnap = await db.collection('leagues/main/pushSubscriptions').get();
  if (subsSnap.empty) return null;

  const subs = [];
  subsSnap.forEach(doc => subs.push({ doc, ...doc.data() }));

  const sends = [];
  for (const notif of notifications) {
    for (const sub of subs) {
      if (notif.excludeUserId && sub.userId === notif.excludeUserId) continue;
      if (!sub.subscription || !sub.subscription.endpoint) continue;
      sends.push(
        webpush.sendNotification(sub.subscription, notif.payload)
          .catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) return sub.doc.ref.delete();
            console.error('Push failed:', err.statusCode, err.message);
          })
      );
    }
  }

  await Promise.all(sends);
  return null;
});
