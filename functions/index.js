const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp }     = require('firebase-admin/app');
const { getFirestore }      = require('firebase-admin/firestore');
const webpush               = require('web-push');

initializeApp();

const VAPID_PUBLIC  = 'BG7H_PDjyGiY1nEAoGj5K2OZ46ZwGQeHsjtkVXElkYm_zDm8CZ84FpJIEot6lEgWoLgOlyYNswEiFtT1ZcTTg9E';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

const APP_URL = 'https://calebjones19.github.io/golf-league/';

if (VAPID_PRIVATE) {
  webpush.setVapidDetails('mailto:caleb.jones@planningcenter.com', VAPID_PUBLIC, VAPID_PRIVATE);
}

// ── Skins calculation helper ──────────────────────────────────────────────────
function computeSkinsNotification(round, data) {
  const cfg = data.scoringConfig || {};
  if (!cfg.skinsEnabled) return null;

  const fee           = cfg.skinsFee || 5;
  const weeklyLineups = data.weeklyLineups || {};
  const lineup        = weeklyLineups[round.week] || {};
  const skinsIn       = lineup.skinsIn || [];
  if (skinsIn.length === 0) return null;

  const teams = data.teams || [];
  const tA    = teams.find(t => t.id === round.teamAId);
  const tB    = teams.find(t => t.id === round.teamBId);

  // Effective player IDs accounting for subs
  const idsA   = tA ? tA.playerIds.map(pid => (round.subs && round.subs[pid]) || pid) : [];
  const idsB   = tB ? tB.playerIds.map(pid => (round.subs && round.subs[pid]) || pid) : [];
  const allPids = [...idsA, ...idsB].filter(pid => skinsIn.includes(pid));
  if (allPids.length === 0) return null;

  const potPerHole = allPids.length * fee;
  const numHoles   = (data.league && data.league.holes) || 9;

  let carryover = 0;
  const winningsByPid = {};

  for (let h = 0; h < numHoles; h++) {
    const holeSc = allPids
      .map(pid => ({ pid, score: round.scores && round.scores[pid] && round.scores[pid][h] }))
      .filter(s => s.score != null);
    if (holeSc.length === 0) continue;

    const minScore = Math.min(...holeSc.map(s => s.score));
    const winners  = holeSc.filter(s => s.score === minScore);
    carryover++;

    if (winners.length === 1) {
      const pid = winners[0].pid;
      winningsByPid[pid] = (winningsByPid[pid] || 0) + potPerHole * carryover;
      carryover = 0;
    }
    // else tie — pot carries to next hole
  }

  const allPlayers = [...(data.players || []), ...(data.subs || [])];
  const playerMap  = {};
  allPlayers.forEach(p => { playerMap[p.id] = p.name; });

  const winnerList = Object.entries(winningsByPid)
    .map(([pid, amt]) => ({ name: playerMap[pid] || '?', amt }))
    .sort((a, b) => b.amt - a.amt);

  let body;
  if (winnerList.length === 0) {
    body = 'All holes tied — pot carries to next week!';
  } else {
    body = winnerList.map(w => w.name + ' $' + w.amt).join(' · ');
    if (carryover > 0) body += ' · ' + carryover + ' hole' + (carryover > 1 ? 's' : '') + ' carry';
  }

  return {
    payload: JSON.stringify({
      title: 'Week ' + round.week + ' Skins 💰',
      body,
      tag:  'skins-' + round.id,
      data: { url: APP_URL }
    }),
    excludeUserId: ''
  };
}

// ── Main trigger ──────────────────────────────────────────────────────────────
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
  const oldMsgs   = (before.messages || []).filter(m => !m.deleted);
  const newMsgs   = (after.messages  || []).filter(m => !m.deleted);
  const oldMsgIds = new Set(oldMsgs.map(m => m.id));
  const addedMsgs = newMsgs.filter(m => !oldMsgIds.has(m.id));

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
      excludeUserId: ''
    });
  }

  // ── 3. Round submissions + skins ─────────────────────────────────────────
  const oldRounds   = before.rounds || [];
  const newRounds   = after.rounds  || [];
  const oldRoundIds = new Set(oldRounds.map(r => r.id));
  const addedRounds = newRounds.filter(r => !oldRoundIds.has(r.id));
  const teams       = after.teams || [];

  for (const round of addedRounds) {
    const tA = teams.find(t => t.id === round.teamAId);
    const tB = teams.find(t => t.id === round.teamBId);
    if (!tA || !tB) continue;
    const pA     = round.pointsA, pB = round.pointsB;
    const winner = pA > pB ? tA.name : pB > pA ? tB.name : null;
    const body   = tA.name + '  ' + pA + ' – ' + pB + '  ' + tB.name
                 + (winner ? '\n' + winner + ' wins! 🏆' : '\nAll square — tied!');
    notifications.push({
      payload: JSON.stringify({
        title: 'Week ' + round.week + ' Results 🏌️',
        body,
        tag:  'round-' + round.id,
        data: { url: APP_URL }
      }),
      excludeUserId: ''
    });

    // Skins results for this same round
    const skinsNotif = computeSkinsNotification(round, after);
    if (skinsNotif) notifications.push(skinsNotif);
  }

  // ── 4. Birdie / Eagle / Albatross / Hole-in-One ───────────────────────────
  const beforeLive = before.liveMatch;
  const afterLive  = after.liveMatch;

  if (afterLive && afterLive.scores) {
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
        if (newScore == null) continue;   // hole not scored yet
        if (oldScore != null) continue;   // score was already set — not new
        const par  = pars[h];
        if (!par) continue;
        const diff = newScore - par;
        if (diff > -1) continue;          // par or worse

        const playerName = playerMap[pid] || 'Someone';
        const holeNum    = h + 1 + holeOffset;

        let emoji, label;
        if      (newScore === 1)  { emoji = '🕳️'; label = 'Hole-in-One'; }  // replaces eagle/albatross
        else if (diff <= -3)      { emoji = '🦅'; label = 'Albatross'; }
        else if (diff === -2)     { emoji = '🦅'; label = 'Eagle'; }
        else                      { emoji = '🐦'; label = 'Birdie'; }

        notifications.push({
          payload: JSON.stringify({
            title: emoji + ' ' + label + '!',
            body:  playerName + ' — Hole ' + holeNum,
            tag:   'score-' + pid + '-h' + holeNum,
            data:  { url: APP_URL }
          }),
          excludeUserId: ''
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
