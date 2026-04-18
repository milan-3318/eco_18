// EcoWarriors — Shared Navigation JS

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Update nav with user info
  const username = localStorage.getItem('username');
  const userDisplay = document.getElementById('nav-user-display');
  const navUsername = document.getElementById('nav-username');
  const loginBtn = document.getElementById('nav-login-btn') || document.getElementById('navLoginBtn');
  const logoutBtn = document.getElementById('nav-logout-btn');

  if (username && navUsername) {
    navUsername.textContent = username;
    if (userDisplay) userDisplay.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.reload();
}
