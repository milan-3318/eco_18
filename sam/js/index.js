// EcoWarriors — Index Page JS

const emojis = ['🍌','♻️','📦','🔋','🗞️','🥫','💊','🫙','🍎','🧴'];
const fc = document.getElementById('floatingEmojis');
emojis.forEach((e, i) => {
  const el = document.createElement('div');
  el.className = 'float-item';
  el.textContent = e;
  el.style.left = (8 + i * 9) + '%';
  el.style.animationDelay = (i * 0.8) + 's';
  el.style.animationDuration = (7 + i % 3) + 's';
  fc.appendChild(el);
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
