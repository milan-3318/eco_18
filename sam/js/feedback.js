// EcoWarriors — Feedback Page JS

const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const username = localStorage.getItem('username');

// Pre-fill name if logged in
if (username) {
  document.getElementById('fbName').value = username;
  document.getElementById('nav-username').textContent = username;
  document.getElementById('nav-user-display').style.display = 'inline';
  document.getElementById('nav-login-btn').style.display = 'none';
  document.getElementById('nav-logout-btn').style.display = 'inline';
}

// Load recent feedback
async function loadFeedback() {
  try {
    const res = await fetch('/api/feedback');
    const data = await res.json();
    
    if (data.success && data.feedback.length > 0) {
      feedbackList.innerHTML = data.feedback.map(item => `
        <div class="feedback-item">
          <div class="fb-meta">
            <div>
              <span class="fb-author">${item.name}</span>
              <span class="fb-category">${item.category}</span>
            </div>
            <span class="fb-rating">${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}</span>
          </div>
          <p class="fb-msg">${item.message}</p>
        </div>
      `).join('');
    } else {
      feedbackList.innerHTML = '<p class="empty">No feedback yet. Be the first!</p>';
    }
  } catch (err) {
    feedbackList.innerHTML = '<p class="error">Failed to load feedback list.</p>';
  }
}

// Submit feedback
feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  
  if (!rating) {
    showToast('Please select a star rating!', 'err');
    return;
  }

  const payload = {
    name: document.getElementById('fbName').value,
    email: document.getElementById('fbEmail').value,
    category: document.getElementById('fbCategory').value,
    rating: parseInt(rating),
    message: document.getElementById('fbMessage').value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (data.success) {
      showToast('Thank you for your feedback! 🌍');
      feedbackForm.reset();
      loadFeedback(); // Refresh list
    } else {
      showToast(data.message || 'Failed to send feedback', 'err');
    }
  } catch (err) {
    showToast('Server error. Please try again later.', 'err');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback 🌿';
  }
});

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type === 'ok' ? 'toast-ok' : 'toast-err');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.reload();
}

// Initial load
loadFeedback();
