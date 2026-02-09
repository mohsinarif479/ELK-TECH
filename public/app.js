const authState = document.getElementById('authState');
const authId = document.getElementById('authId');
const authEmail = document.getElementById('authEmail');
const log = document.getElementById('log');
const usersList = document.getElementById('usersList');
const usersCount = document.getElementById('usersCount');

let token = localStorage.getItem('jwtToken') || '';
let currentUserId = localStorage.getItem('userId') || '';
let currentEmail = localStorage.getItem('userEmail') || '';

function setAuthState(signedIn, user = {}) {
  authState.textContent = signedIn ? 'Signed in' : 'Signed out';
  authId.textContent = user.id || '-';
  authEmail.textContent = user.email || '-';
}

function persistAuth(user, newToken) {
  token = newToken || '';
  currentUserId = user?.id || '';
  currentEmail = user?.email || '';
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('userId', currentUserId);
  localStorage.setItem('userEmail', currentEmail);
  setAuthState(Boolean(token), { id: currentUserId, email: currentEmail });
}

function clearAuth() {
  token = '';
  currentUserId = '';
  currentEmail = '';
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  setAuthState(false);
}

function logResponse(title, payload) {
  const time = new Date().toLocaleTimeString();
  log.textContent = `[${time}] ${title}\n${JSON.stringify(payload, null, 2)}\n\n${log.textContent}`;
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'include'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.error || 'Request failed'), { data, status: res.status });
  }
  return data;
}

document.getElementById('signupForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    email: form.email.value,
    password: form.password.value
  };
  try {
    const data = await api('/signup', { method: 'POST', body: JSON.stringify(payload) });
    persistAuth({ id: data.id, email: data.email }, data.token);
    logResponse('Signup success', data);
    form.reset();
  } catch (err) {
    logResponse('Signup error', err.data || { error: err.message });
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    email: form.email.value,
    password: form.password.value
  };
  try {
    const data = await api('/login', { method: 'POST', body: JSON.stringify(payload) });
    persistAuth({ id: data.id, email: data.email }, data.token);
    logResponse('Login success', data);
    form.reset();
  } catch (err) {
    logResponse('Login error', err.data || { error: err.message });
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    const data = await api('/logout', { method: 'POST' });
    clearAuth();
    logResponse('Logout success', data);
  } catch (err) {
    logResponse('Logout error', err.data || { error: err.message });
  }
});

document.getElementById('updateForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUserId) {
    logResponse('Update blocked', { error: 'Login first' });
    return;
  }
  const form = event.currentTarget;
  const payload = {};
  if (form.email.value) payload.email = form.email.value;
  if (form.password.value) payload.password = form.password.value;

  try {
    const data = await api(`/users/${currentUserId}`, { method: 'PUT', body: JSON.stringify(payload) });
    persistAuth({ id: data.id, email: data.email }, data.token);
    logResponse('Update success', data);
    form.reset();
  } catch (err) {
    logResponse('Update error', err.data || { error: err.message });
  }
});

document.getElementById('loadUsersBtn').addEventListener('click', async () => {
  try {
    const data = await api('/users');
    usersList.innerHTML = '';
    data.users.forEach((user) => {
      const li = document.createElement('li');
      li.textContent = `${user.email} (${user._id || user.id || ''})`;
      if (currentUserId && (user._id === currentUserId || user.id === currentUserId)) {
        const btn = document.createElement('button');
        btn.textContent = 'Delete me';
        btn.className = 'ghost';
        btn.addEventListener('click', async () => {
          try {
            const res = await api(`/users/${currentUserId}`, { method: 'DELETE' });
            clearAuth();
            logResponse('Delete success', res);
          } catch (err) {
            logResponse('Delete error', err.data || { error: err.message });
          }
        });
        li.appendChild(btn);
      }
      usersList.appendChild(li);
    });
    logResponse('Users loaded', data);
  } catch (err) {
    logResponse('Users error', err.data || { error: err.message });
  }
});

document.getElementById('countUsersBtn').addEventListener('click', async () => {
  try {
    const data = await api('/users/count');
    usersCount.textContent = `Total: ${data.total}`;
    logResponse('User count', data);
  } catch (err) {
    logResponse('Count error', err.data || { error: err.message });
  }
});

setAuthState(Boolean(token), { id: currentUserId, email: currentEmail });
