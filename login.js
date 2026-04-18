function showToast(message, type = "ok") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show " + (type === "ok" ? "toast-ok" : "toast-err");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function clearE(input) {
  input.classList.remove("error");
}

function handleLogin() {
  const email = document.getElementById("loginEmail");
  const pw = document.getElementById("loginPw");

  let valid = true;

  if (!email.value.trim()) {
    email.classList.add("error");
    valid = false;
  }

  if (!pw.value.trim()) {
    pw.classList.add("error");
    valid = false;
  }

  if (!valid) {
    showToast("Please fill all fields", "err");
    return;
  }

  localStorage.setItem("username", email.value.trim());
  showToast("Login successful! Redirecting...");

  setTimeout(() => {
    window.location.href = "game.html";
  }, 1500);
}