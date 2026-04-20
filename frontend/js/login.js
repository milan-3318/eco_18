// EcoWarriors — Login Page JS

// Floating background emojis
const emojis = ['🍌','♻️','📦','🔋','🥫','💧','⚠️','🌿','🌍','🍎'];
const bg = document.getElementById('pageBg');
emojis.forEach((e, i) => {
  const el = document.createElement('div');
  el.className = 'fb-item';
  el.textContent = e;
  el.style.cssText = `left:${i * 11}%;top:${10 + Math.random() * 70}%;animation-delay:${i * 0.7}s;animation-duration:${8 + i % 3}s`;
  bg.appendChild(el);
});

function switchTab(t) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(t + 'Tab').classList.add('active');
  document.getElementById(t + 'Panel').classList.add('active');
}

function selectAv(el) {
  document.querySelectorAll('.av-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function clearE(inp) { inp.classList.remove('error'); }

function showErr(id, msg) {
  const err = document.getElementById(id);
  const inp = err.closest('.input-group').querySelector('input');
  if (inp) inp.classList.add('error');
  err.textContent = msg;
  err.classList.add('show');
  return false;
}

function checkStrength(v) {
  const fill = document.getElementById('pwFill');
  fill.className = 'pw-fill';
  if (!v) return;
  const s = [v.length >= 8, /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
  fill.classList.add(s <= 1 ? 'pw-weak' : s <= 3 ? 'pw-med' : 'pw-strong');
}

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type === 'ok' ? 'toast-ok' : 'toast-err');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function setLoad(id, on) {
  const b = document.getElementById(id);
  b.disabled = on;
  b.classList.toggle('loading', on);
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw = document.getElementById('loginPw').value.trim();
  let ok = true;
  if (!email) ok = showErr('eLoginEmail', 'Please enter your email or username');
  if (!pw)    ok = showErr('eLoginPw', 'Please enter your password');
  if (!ok) return;
  setLoad('loginBtn', true);
  try {
    const res = await fetch(`${window.API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username || email.split('@')[0]);
      localStorage.setItem('role', data.role || 'user');
      showToast('🎉 Welcome back! Loading game...');
      setTimeout(() => window.location.href = 'game.html', 1200);
    } else {
      showToast(data.message || 'Login failed. Check your credentials.', 'err');
    }
  } catch {
    showToast('⚠️ Cannot reach server. Make sure backend runs on port 5000.', 'err');
  } finally {
    setLoad('loginBtn', false);
  }
}

async function handleRegister() {
  const user  = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw    = document.getElementById('regPw').value.trim();
  const conf  = document.getElementById('regConfirm').value.trim();
  const terms = document.getElementById('terms').checked;
  const av    = document.querySelector('.av-opt.selected')?.dataset.av || '🌿';
  const aCode = document.getElementById('adminCode').value.trim();
  let ok = true;
  if (!user)                  ok = showErr('eRegUser', 'Username is required');
  if (!email || !email.includes('@')) ok = showErr('eRegEmail', 'Please enter a valid email');
  if (!pw || pw.length < 6)   ok = showErr('eRegPw', 'Password must be at least 6 characters');
  if (pw !== conf)            ok = showErr('eRegConfirm', 'Passwords do not match');
  if (!terms) { showToast('Please agree to the Terms of Service', 'err'); ok = false; }
  if (!ok) return;
  setLoad('registerBtn', true);
  try {
    const res = await fetch(`${window.API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: user, email, password: pw, avatar: av, adminCode: aCode })
    });
    const data = await res.json();
    if (data.success || data.token) {
      localStorage.setItem('username', user);
      if (data.token) localStorage.setItem('token', data.token);
      if (data.role) localStorage.setItem('role', data.role);
      showToast('🌱 Account created! Welcome, ' + user + '!');
      setTimeout(() => window.location.href = 'game.html', 1400);
    } else {
      showToast(data.message || 'Registration failed. Try again.', 'err');
    }
  } catch {
    showToast('⚠️ Cannot reach server. Make sure backend runs on port 5000.', 'err');
  } finally {
    setLoad('registerBtn', false);
  }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('loginPanel').classList.contains('active')) handleLogin();
  else handleRegister();
});

// Auto-switch to register tab if ?tab=register is in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('tab') === 'register') {
  switchTab('register');
}
