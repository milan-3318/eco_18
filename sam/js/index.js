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

function updateNav() {
  const u = localStorage.getItem('username');
  if (u) {
    document.getElementById('nav-user-display').style.display = 'flex';
    document.getElementById('nav-username').textContent = u;
    document.getElementById('nav-login-btn').style.display = 'none';
    document.getElementById('nav-logout-btn').style.display = 'inline-block';
  }
}

function logout() {
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  document.getElementById('nav-user-display').style.display = 'none';
  document.getElementById('nav-login-btn').style.display = 'inline-block';
  document.getElementById('nav-logout-btn').style.display = 'none';
  showToast('Logged out. See you next time! 👋');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

updateNav();
