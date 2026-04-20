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
    if (role === 'admin') {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = '👑 Admin';
      adminLink.className = 'btn btn-outline'; // Use button style for visibility
      adminLink.style.borderColor = '#4f46e5';
      adminLink.style.color = '#4f46e5';
      adminLink.style.marginLeft = '10px';

      // Try to find the best place to put it
      const target = document.querySelector('.nav-links') || document.querySelector('.nav-right') || document.querySelector('nav');
      if (target) target.appendChild(adminLink);
    }
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  window.location.href = 'index.html';
}
