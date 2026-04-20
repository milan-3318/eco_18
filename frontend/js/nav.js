// EcoWarriors — Shared Navigation JS
window.API_URL = 'https://ecowarrior-18.onrender.com';

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

    // Show Admin Link if role is admin
    const role = localStorage.getItem('role');
    if (role === 'admin' && navLinks) {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = '👑 Admin';
      adminLink.style.color = '#4f46e5';
      adminLink.style.fontWeight = '800';
      navLinks.appendChild(adminLink);
    }
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  window.location.href = 'index.html';
}
