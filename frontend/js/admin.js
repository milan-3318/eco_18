// EcoWarriors — Admin Dashboard JS

let allUsers = [];

async function initAdmin() {
  const token = localStorage.getItem('token');
  // Check locally first, then verify with server
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${window.API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (!data.success || data.user.role !== 'admin') {
      alert('Access denied. Admins only!');
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('nav-username').textContent = data.user.username;
    
    loadStats();
    loadUsers();
    loadFeedback();
  } catch (err) {
    console.error('Admin init error:', err);
    window.location.href = 'index.html';
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${window.API_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('statUsers').textContent = data.stats.users;
      document.getElementById('statScores').textContent = data.stats.scores;
      document.getElementById('statFeedback').textContent = data.stats.feedback;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

async function loadUsers() {
  try {
    const res = await fetch(`${window.API_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (data.success) {
      allUsers = data.users;
      renderUsers(allUsers);
    }
  } catch (err) {
    console.error('Users error:', err);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <span>${user.avatar}</span>
          <span style="font-weight:700">${user.username}</span>
          ${user.role === 'admin' ? '<span class="fb-cat" style="background:#dcfce7;color:#166534">Admin</span>' : ''}
        </div>
      </td>
      <td>${user.email}</td>
      <td>${user.school}</td>
      <td style="font-weight:700;color:var(--green)">${user.bestScore}</td>
      <td>${user.totalGames}</td>
      <td style="font-size:0.8rem;color:var(--gray)">${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        ${user.role !== 'admin' ? `<button class="btn-del" onclick="deleteUser('${user.id}', '${user.username}')">Delete</button>` : '—'}
      </td>
    </tr>
  `).join('');
}

async function deleteUser(id, name) {
  if (!confirm(`Are you sure you want to delete user "${name}" and all their scores? This cannot be undone.`)) return;

  try {
    const res = await fetch(`${window.API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (data.success) {
      showToast(`User ${name} deleted.`);
      loadUsers();
      loadStats();
    } else {
      showToast(data.message, 'err');
    }
  } catch (err) {
    showToast('Error deleting user', 'err');
  }
}

async function loadFeedback() {
  const grid = document.getElementById('feedbackGrid');
  try {
    const res = await fetch(`${window.API_URL}/api/admin/feedback`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    if (data.success) {
      if (data.feedback.length === 0) {
        grid.innerHTML = '<p class="loading">No feedback yet.</p>';
        return;
      }
      grid.innerHTML = data.feedback.map(fb => `
        <div class="fb-card">
          <div class="fb-card-header">
            <span class="fb-user">${fb.name}</span>
            <span class="fb-cat">${fb.category}</span>
          </div>
          <div style="margin-bottom:8px">${'★'.repeat(fb.rating)}${'☆'.repeat(5-fb.rating)}</div>
          <p class="fb-msg">"${fb.message}"</p>
          <div style="font-size:0.75rem;color:var(--gray);margin-top:10px">${new Date(fb.createdAt).toLocaleString()}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    grid.innerHTML = '<p class="loading">Error loading feedback.</p>';
  }
}

function filterUsers() {
  const query = document.getElementById('userSearch').value.toLowerCase();
  const filtered = allUsers.filter(u => 
    u.username.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query) ||
    u.school.toLowerCase().includes(query)
  );
  renderUsers(filtered);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tab + 'Section').classList.add('active');
}

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + (type === 'ok' ? 'toast-ok' : 'toast-err');
  setTimeout(() => t.classList.remove('show'), 3500);
}

initAdmin();
