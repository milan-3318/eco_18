// EcoWarriors — Game Page JS

// ─── LEVEL CONFIGS ───────────────────────────────────────────
const LEVELS = {
  1: { time: 90, total: 10, pts: 10, title: 'Level 1 — Basic Sort',    desc: 'Sort household waste into the correct bins' },
  2: { time: 60, total: 15, pts: 15, title: 'Level 2 — Speed Sort',    desc: 'Faster pace, tricky items — stay focused!' },
  3: { time: 45, total: 20, pts: 20, title: 'Level 3 — Master Class',  desc: 'E-waste, medical waste, complex recyclables' }
};

// ─── WASTE ITEMS DATABASE ────────────────────────────────────
const ALL_ITEMS = {
  1: [
    { name:'Banana Peel',     emoji:'🍌', bin:'wet',        hint:'Organic food waste' },
    { name:'Apple Core',      emoji:'🍎', bin:'wet',        hint:'Organic food waste' },
    { name:'Orange Peel',     emoji:'🍊', bin:'wet',        hint:'Organic food waste' },
    { name:'Vegetable Scrap', emoji:'🥦', bin:'wet',        hint:'Compostable' },
    { name:'Egg Shell',       emoji:'🥚', bin:'wet',        hint:'Organic waste' },
    { name:'Newspaper',       emoji:'📰', bin:'dry',        hint:'Paper waste' },
    { name:'Cardboard Box',   emoji:'📦', bin:'dry',        hint:'Paper waste' },
    { name:'Tissue Paper',    emoji:'🧻', bin:'dry',        hint:'Non-recyclable paper' },
    { name:'Plastic Bottle',  emoji:'🧴', bin:'recyclable', hint:'Recyclable plastic' },
    { name:'Glass Jar',       emoji:'🫙', bin:'recyclable', hint:'Recyclable glass' },
    { name:'Aluminum Can',    emoji:'🥫', bin:'recyclable', hint:'Recyclable metal' },
    { name:'Battery',         emoji:'🔋', bin:'hazardous',  hint:'Toxic chemicals' },
    { name:'Medicine',        emoji:'💊', bin:'hazardous',  hint:'Chemical waste' },
    { name:'Paint Can',       emoji:'🪣', bin:'hazardous',  hint:'Chemical waste' },
  ],
  2: [
    { name:'Coffee Grounds',   emoji:'☕', bin:'wet',        hint:'Organic — compostable' },
    { name:'Tea Bag',          emoji:'🍵', bin:'wet',        hint:'Organic waste' },
    { name:'Bread Crust',      emoji:'🍞', bin:'wet',        hint:'Food waste' },
    { name:'Flower Waste',     emoji:'🌸', bin:'wet',        hint:'Garden/organic' },
    { name:'Paper Cup',        emoji:'🥤', bin:'dry',        hint:'Not recyclable if coated' },
    { name:'Plastic Straw',    emoji:'🥤', bin:'dry',        hint:'Non-recyclable plastic' },
    { name:'Old Notebook',     emoji:'📓', bin:'dry',        hint:'Paper waste' },
    { name:'Plastic Bag',      emoji:'🛍️', bin:'dry',        hint:'Film plastic — dry bin' },
    { name:'Metal Fork',       emoji:'🍴', bin:'recyclable', hint:'Recyclable metal' },
    { name:'Steel Tin',        emoji:'🥫', bin:'recyclable', hint:'Recyclable metal' },
    { name:'Broken Glass',     emoji:'🔮', bin:'recyclable', hint:'Recyclable with care' },
    { name:'Rubber Gloves',    emoji:'🧤', bin:'dry',        hint:'Non-recyclable rubber' },
    { name:'Syringe',          emoji:'💉', bin:'hazardous',  hint:'Medical waste' },
    { name:'Motor Oil',        emoji:'🛢️', bin:'hazardous',  hint:'Toxic liquid waste' },
    { name:'Pesticide Bottle', emoji:'☠️', bin:'hazardous',  hint:'Chemical hazard' },
    { name:'CFL Bulb',         emoji:'💡', bin:'hazardous',  hint:'Contains mercury' },
    { name:'Pizza Box',        emoji:'🍕', bin:'wet',        hint:'Greasy = organic' },
    { name:'Milk Carton',      emoji:'🥛', bin:'recyclable', hint:'Carton — recyclable' },
  ],
  3: [
    { name:'Old Phone',         emoji:'📱', bin:'hazardous',  hint:'E-waste' },
    { name:'Laptop',            emoji:'💻', bin:'hazardous',  hint:'E-waste' },
    { name:'Charger Cable',     emoji:'🔌', bin:'hazardous',  hint:'E-waste' },
    { name:'Printer Cartridge', emoji:'🖨️', bin:'hazardous',  hint:'Chemical ink waste' },
    { name:'AAA Battery',       emoji:'🔋', bin:'hazardous',  hint:'Toxic chemicals' },
    { name:'X-Ray Film',        emoji:'🩻', bin:'hazardous',  hint:'Medical waste' },
    { name:'Blood Sample Tube', emoji:'🧪', bin:'hazardous',  hint:'Biohazard waste' },
    { name:'Broken TV',         emoji:'📺', bin:'hazardous',  hint:'E-waste — toxic' },
    { name:'Fish Bones',        emoji:'🐟', bin:'wet',        hint:'Organic waste' },
    { name:'Meat Scraps',       emoji:'🥩', bin:'wet',        hint:'Organic food waste' },
    { name:'Cooking Oil',       emoji:'🫒', bin:'hazardous',  hint:'Cannot pour in drain' },
    { name:'Bleach Bottle',     emoji:'🧽', bin:'hazardous',  hint:'Chemical waste' },
    { name:'Cardboard Pulp',    emoji:'📄', bin:'recyclable', hint:'Paper recycling' },
    { name:'Aluminum Foil',     emoji:'✨', bin:'recyclable', hint:'Metal — recyclable' },
    { name:'PET Bottle',        emoji:'🍶', bin:'recyclable', hint:'Plastic type 1' },
    { name:'Steel Scrap',       emoji:'⚙️', bin:'recyclable', hint:'Metal recycling' },
    { name:'Rubber Tyre',       emoji:'🛞', bin:'dry',        hint:'Bulk non-recyclable' },
    { name:'Leather Shoes',     emoji:'👟', bin:'dry',        hint:'Non-recyclable' },
    { name:'Cigarette Butt',    emoji:'🚬', bin:'hazardous',  hint:'Toxic residue' },
    { name:'Hair',              emoji:'💇', bin:'wet',        hint:'Organic — compostable' },
    { name:'Cork',              emoji:'🍾', bin:'recyclable', hint:'Recyclable cork' },
    { name:'Broken Ceramic',    emoji:'🏺', bin:'dry',        hint:'Non-recyclable crockery' },
  ]
};

// ─── STATE ───────────────────────────────────────────────────
let currentLevel = 1, score = 0, sorted = 0, wrong = 0, streak = 0, bestStreak = 0;
let timeLeft, timerInterval, gameActive = false;
let dragItem = null, touchStartX = 0, touchStartY = 0;
let binCounts = { wet: 0, dry: 0, hazardous: 0, recyclable: 0 };
let usedItems = [], activeItems = [];

// ─── INIT ────────────────────────────────────────────────────
function init() {
  // Check if user is logged in
  if (!localStorage.getItem('token')) {
    alert('Please log in or register to play and save your scores! 🌍');
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const lvl = parseInt(params.get('level'));
  if (lvl >= 1 && lvl <= 3) {
    selectLevel(lvl);
  } else {
    document.getElementById('levelSelectOverlay').style.display = 'flex';
  }
}

function selectLevel(lv) {
  currentLevel = lv;
  document.getElementById('levelSelectOverlay').style.display = 'none';
  startGame();
}

function startGame() {
  const cfg = LEVELS[currentLevel];
  score = 0; sorted = 0; wrong = 0; streak = 0; bestStreak = 0;
  binCounts = { wet: 0, dry: 0, hazardous: 0, recyclable: 0 };
  usedItems = []; activeItems = [];
  timeLeft = cfg.time;
  gameActive = true;

  document.getElementById('levelTitle').textContent = cfg.title;
  document.getElementById('levelDesc').textContent = cfg.desc;
  document.getElementById('totalCount').textContent = cfg.total;
  document.getElementById('sortedCount').textContent = 0;
  document.getElementById('scoreDisplay').textContent = 0;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('gameOverModal').classList.remove('show');
  updateBinCounts();
  updateStreak();
  updateTimer();
  loadItems();
  clearInterval(timerInterval);
  timerInterval = setInterval(tick, 1000);
}

function loadItems() {
  const cfg = LEVELS[currentLevel];
  const pool = ALL_ITEMS[currentLevel].filter(i => !usedItems.includes(i.name));
  const need = Math.min(5, cfg.total - sorted, pool.length);
  if (need <= 0) { if (sorted >= cfg.total) endGame(); return; }

  const picked = shuffle(pool).slice(0, need);
  activeItems = picked;
  picked.forEach(i => usedItems.push(i.name));

  const grid = document.getElementById('itemsGrid');
  grid.innerHTML = '';
  picked.forEach(item => {
    const el = document.createElement('div');
    el.className = 'waste-item';
    el.dataset.bin  = item.bin;
    el.dataset.name = item.name;
    el.innerHTML = `<span class="item-emoji">${item.emoji}</span><div class="item-name">${item.name}</div><div class="item-hint">${item.hint}</div>`;
    el.draggable = true;
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragend',   onDragEnd);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);
    grid.appendChild(el);
  });
}

// ─── DESKTOP DRAG ────────────────────────────────────────────
function onDragStart(e) { if (!gameActive) return; dragItem = this; this.classList.add('dragging'); }
function onDragEnd()    { if (dragItem) dragItem.classList.remove('dragging'); dragItem = null; clearBinHighlights(); }

document.querySelectorAll('.bin').forEach(bin => {
  bin.addEventListener('dragover',  e  => { e.preventDefault(); clearBinHighlights(); bin.classList.add('over'); });
  bin.addEventListener('dragleave', () => bin.classList.remove('over'));
  bin.addEventListener('drop',      e  => { e.preventDefault(); bin.classList.remove('over'); if (dragItem) dropOnBin(bin.dataset.bin, dragItem); });
});

// ─── TOUCH DRAG ──────────────────────────────────────────────
let ghost, touchItem;
function onTouchStart(e) {
  if (!gameActive) return;
  e.preventDefault();
  touchItem = this;
  const t = e.touches[0];
  touchStartX = t.clientX; touchStartY = t.clientY;
  ghost = document.getElementById('drag-ghost');
  const item = ALL_ITEMS[currentLevel].find(i => i.name === this.dataset.name);
  ghost.textContent = item ? item.emoji : '📦';
  ghost.style.display = 'block';
  ghost.style.left = t.clientX + 'px';
  ghost.style.top  = t.clientY + 'px';
  this.classList.add('dragging');
}
function onTouchMove(e) {
  if (!touchItem) return;
  e.preventDefault();
  const t = e.touches[0];
  ghost.style.left = t.clientX + 'px';
  ghost.style.top  = t.clientY + 'px';
  clearBinHighlights();
  const el  = document.elementFromPoint(t.clientX, t.clientY);
  const bin = el && el.closest('.bin');
  if (bin) bin.classList.add('over');
}
function onTouchEnd(e) {
  if (!touchItem) return;
  ghost.style.display = 'none';
  touchItem.classList.remove('dragging');
  clearBinHighlights();
  const t   = e.changedTouches[0];
  const el  = document.elementFromPoint(t.clientX, t.clientY);
  const bin = el && el.closest('.bin');
  if (bin) dropOnBin(bin.dataset.bin, touchItem);
  touchItem = null;
}
function clearBinHighlights() { document.querySelectorAll('.bin').forEach(b => b.classList.remove('over')); }

// ─── DROP LOGIC ──────────────────────────────────────────────
function dropOnBin(binType, itemEl) {
  if (!gameActive) return;
  const correct = itemEl.dataset.bin;
  if (binType === correct) {
    const pts = LEVELS[currentLevel].pts;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    const bonus = streak >= 3 ? Math.floor(pts * 0.5) : 0;
    score  += pts + bonus;
    sorted++;
    binCounts[binType]++;
    updateScore(); updateBinCounts(); updateProgress(); updateStreak();
    const bonusText = bonus > 0 ? `+${pts} pts + 🔥${bonus} streak bonus!` : `+${pts} points`;
    showFeedback(true, `✅ Correct! ${itemEl.dataset.name}`, bonusText);
    itemEl.classList.add('sorted');
    setTimeout(() => {
      itemEl.remove();
      const remaining = document.querySelectorAll('#itemsGrid .waste-item:not(.sorted)').length;
      if (sorted >= LEVELS[currentLevel].total) { endGame(); return; }
      if (remaining === 0) loadItems();
    }, 380);
  } else {
    streak = 0; updateStreak(); wrong++;
    itemEl.classList.add('shake');
    setTimeout(() => itemEl.classList.remove('shake'), 400);
    const binLabel = document.querySelector(`.bin.${correct} .bin-label`).textContent;
    showFeedback(false, `❌ Wrong bin!`, `${itemEl.dataset.name} belongs in ${binLabel}`);
  }
}

// ─── FEEDBACK TOAST ──────────────────────────────────────────
let fbTimeout;
function showFeedback(correct, title, sub) {
  const toast = document.getElementById('feedbackToast');
  toast.className = 'feedback-toast ' + (correct ? 'correct' : 'wrong');
  document.getElementById('fbTitle').textContent = title;
  document.getElementById('fbSub').textContent   = sub;
  toast.classList.add('show');
  clearTimeout(fbTimeout);
  fbTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ─── TIMER ───────────────────────────────────────────────────
function tick() { timeLeft--; updateTimer(); if (timeLeft <= 0) endGame(); }
function updateTimer() {
  const m  = Math.floor(timeLeft / 60);
  const s  = timeLeft % 60;
  const el = document.getElementById('timerDisplay');
  el.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  el.classList.toggle('urgent', timeLeft <= 15);
}

// ─── UPDATES ─────────────────────────────────────────────────
function updateScore() { document.getElementById('scoreDisplay').textContent = score; }
function updateProgress() {
  const cfg = LEVELS[currentLevel];
  document.getElementById('sortedCount').textContent = sorted;
  document.getElementById('progressFill').style.width = (sorted / cfg.total * 100) + '%';
}
function updateBinCounts() {
  ['wet', 'dry', 'hazardous', 'recyclable'].forEach(b => {
    document.getElementById(b + '-count').textContent = binCounts[b] + ' sorted';
  });
}
function updateStreak() {
  const pill = document.getElementById('streakPill');
  document.getElementById('streakCount').textContent = streak;
  pill.classList.toggle('active', streak >= 2);
}

// ─── END GAME ────────────────────────────────────────────────
function endGame() {
  clearInterval(timerInterval);
  gameActive = false;
  const total    = sorted + wrong;
  const accuracy = total > 0 ? Math.round((sorted / total) * 100) : 0;
  const trophy   = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🥈' : '🥉';
  const messages = ["Keep practicing! You'll improve! 💪", 'Good effort! Try again for a higher score!', 'Great job! You\'re getting good at this! 🌿', 'Amazing! You\'re an EcoWarrior! 🌍'];
  const msgIdx   = Math.min(3, Math.floor(accuracy / 30));

  document.getElementById('trophyEmoji').textContent    = trophy;
  document.getElementById('finalScore').textContent     = score;
  document.getElementById('detailSorted').textContent   = sorted;
  document.getElementById('detailAccuracy').textContent = accuracy + '%';
  document.getElementById('detailBestStreak').textContent = bestStreak;
  document.getElementById('resultMessage').textContent  = messages[msgIdx];
  document.getElementById('gameOverModal').classList.add('show');

  createConfetti();
  saveScore();
}

function saveScore() {
  const username = localStorage.getItem('username');
  const token    = localStorage.getItem('token');
  if (!username) return;
  fetch(`${window.API_URL}/api/game/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ username, score, level: currentLevel, itemsSorted: sorted, time: LEVELS[currentLevel].time - timeLeft })
  }).then(r => r.json()).then(d => console.log('Score saved:', d)).catch(e => console.warn('Score save failed:', e));
}

// ─── CONFETTI ────────────────────────────────────────────────
function createConfetti() {
  const colors = ['#22c55e', '#fbbf24', '#38bdf8', '#f87171', '#a855f7', '#fb923c'];
  const div = document.createElement('div');
  Object.assign(div.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '1000', overflow: 'hidden' });
  document.body.appendChild(div);
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    const size = 8 + Math.random() * 8;
    Object.assign(c.style, {
      position: 'absolute', width: size + 'px', height: size + 'px',
      background: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100 + 'vw', top: '-20px',
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      transform: `rotate(${Math.random() * 360}deg)`,
      opacity: '0', transition: `top ${2 + Math.random() * 2}s linear, opacity 0.3s`
    });
    div.appendChild(c);
    setTimeout(() => { c.style.top = '105vh'; c.style.opacity = '1'; }, i * 30);
    setTimeout(() => c.remove(), 5000);
  }
  setTimeout(() => div.remove(), 6000);
}

// ─── UTILS ───────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ─── MODAL BUTTONS ───────────────────────────────────────────
document.getElementById('playAgainBtn').addEventListener('click',    () => startGame());
document.getElementById('leaderboardBtn').addEventListener('click',  () => window.location.href = 'leaderboard.html');

init();
