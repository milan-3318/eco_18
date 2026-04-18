// EcoWarriors — Leaderboard Page JS

let allData = [], activeFilter = 'all';
const username = localStorage.getItem('username');
if (username) document.getElementById('navLoginBtn').textContent = '👤 ' + username;

async function loadLeaderboard() {
  try {
    const res = await fetch('http://localhost:5000/api/game/leaderboard');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Bad data');
    allData = data.sort((a, b) => b.score - a.score);
    buildPodium(allData);
    renderTable();
    showYourRank();
  } catch (e) {
    document.getElementById('leaderboardBody').innerHTML = `
      <div class="empty-state">
        <div style="font-size:3rem;margin-bottom:12px">🌐</div>
        <p style="font-weight:700;color:#374151;margin-bottom:8px">Server Offline</p>
        <p style="font-size:.9rem;margin-bottom:16px">Make sure your backend is running on <strong>localhost:5000</strong></p>
        <a href="game.html" class="btn btn-green">Play a Game First!</a>
      </div>`;
  }
}

function buildPodium(data) {
  const medals = ['🥇', '🥈', '🥉'], classes = ['p1', 'p2', 'p3'], order = [1, 0, 2];
  const podium = document.getElementById('podium');
  podium.innerHTML = '';
  order.forEach(pos => {
    const p = data[pos];
    if (!p) return;
    const card = document.createElement('div');
    card.className = 'podium-card ' + classes[pos];
    card.innerHTML = `
      <div class="podium-medal">${medals[pos]}</div>
      <div class="podium-avatar">${(p.username || '?')[0].toUpperCase()}</div>
      <div class="podium-name">${p.username || 'Unknown'}</div>
      <div class="podium-score">${p.score} pts</div>
    `;
    podium.appendChild(card);
  });
}

function filterLevel(lv, btn) {
  activeFilter = lv;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTable();
}

function renderTable() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  let data = [...allData];
  if (activeFilter !== 'all') data = data.filter(d => d.level == activeFilter);
  if (search) data = data.filter(d => (d.username || '').toLowerCase().includes(search));
  const body = document.getElementById('leaderboardBody');
  if (data.length === 0) {
    body.innerHTML = `<div class="empty-state"><div style="font-size:3rem">😅</div><p style="margin-top:12px">No players found.</p></div>`;
    return;
  }
  body.innerHTML = '';
  data.forEach((p, i) => {
    const isMe = p.username === username;
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
    const lvNum = p.level || 1;
    const timeStr = p.time ? `${Math.floor(p.time / 60)}:${String(p.time % 60).padStart(2, '0')}` : '—';
    const row = document.createElement('div');
    row.className = 'lb-row' + (isMe ? ' me' : '');
    row.style.animationDelay = (i * 0.04) + 's';
    row.innerHTML = `
      <div><div class="rank-badge ${rankClass}">${medal}</div></div>
      <div class="player-info">
        <div class="avatar-circle">${(p.username || '?')[0].toUpperCase()}</div>
        <div><div class="player-name">${p.username || 'Unknown'}${isMe ? ' 👈' : ''}  </div><div class="player-school">${p.school || 'EcoWarriors Player'}</div></div>
      </div>
      <div style="text-align:center"><span class="score-val">${p.score}</span></div>
      <div style="text-align:center;font-weight:700;color:var(--gray)">${p.itemsSorted || '—'}</div>
      <div style="text-align:center"><span class="level-tag lv${lvNum}-tag">Lv ${lvNum}</span></div>
      <div style="text-align:center;font-size:.82rem;color:var(--gray)">${timeStr}</div>
    `;
    body.appendChild(row);
  });
}

function showYourRank() {
  if (!username) return;
  const me = allData.find(d => d.username === username);
  if (!me) return;
  const rank = allData.indexOf(me) + 1;
  const section = document.getElementById('yourRankSection');
  const row = document.getElementById('yourRankRow');
  section.style.display = 'block';
  const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
  row.innerHTML = `
    <div><div class="rank-badge ${rankClass}" style="margin:0">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</div></div>
    <div class="player-info">
      <div class="avatar-circle">${username[0].toUpperCase()}</div>
      <div><div class="player-name">${username}</div><div class="player-school">Your best score</div></div>
    </div>
    <div><span class="score-val">${me.score} pts</span></div>
    <div style="font-weight:700;color:var(--gray)">${me.itemsSorted || '—'} sorted</div>
  `;
}

loadLeaderboard();
