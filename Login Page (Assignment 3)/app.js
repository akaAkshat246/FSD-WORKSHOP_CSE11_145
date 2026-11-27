const authPage = document.getElementById('authPage');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const message = document.getElementById('message');
const dashboardMessage = document.getElementById('dashboardMessage');
const userList = document.getElementById('userList');
let token = sessionStorage.getItem('token');

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
}

function showForm(form) {
  loginForm.hidden = form !== loginForm;
  signupForm.hidden = form !== signupForm;
  message.textContent = '';
}

document.getElementById('showLogin').addEventListener('click', () => showForm(loginForm));
document.getElementById('showSignup').addEventListener('click', () => showForm(signupForm));

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const result = await request('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    signupForm.reset();
    showForm(loginForm);
    document.getElementById('loginEmail').value = email;
    message.textContent = result.message;
  } catch (error) {
    message.textContent = error.message;
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    token = result.token;
    sessionStorage.setItem('token', token);
    authPage.hidden = true;
    dashboard.hidden = false;
    await loadUsers();
  } catch (error) {
    message.textContent = error.message;
  }
});

async function loadUsers() {
  dashboardMessage.textContent = 'Loading users...';

  try {
    const users = await request('/employee');
    userList.replaceChildren();

    users.forEach((user) => addUserRow(user));
    dashboardMessage.textContent = users.length ? '' : 'No signed-up users yet.';
  } catch (error) {
    if (error.message === 'Please log in first.') {
      sessionStorage.removeItem('token');
      token = null;
      dashboard.hidden = true;
      authPage.hidden = false;
      showForm(loginForm);
      message.textContent = 'Your session ended. Please log in again.';
      return;
    }

    dashboardMessage.textContent = error.message;
  }
}

function addUserRow(user) {
  const row = document.createElement('div');
  row.className = 'user-row';

  const nameInput = document.createElement('input');
  nameInput.value = user.name || '';
  nameInput.setAttribute('aria-label', 'Name');
  nameInput.required = true;

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.value = user.email || '';
  emailInput.setAttribute('aria-label', 'Email');
  emailInput.required = true;

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', async () => {
    if (!nameInput.reportValidity() || !emailInput.reportValidity()) return;

    try {
      await request(`/edit/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: nameInput.value.trim(), email: emailInput.value.trim() })
      });
      dashboardMessage.textContent = 'User updated.';
      await loadUsers();
    } catch (error) {
      dashboardMessage.textContent = error.message;
    }
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    if (!window.confirm(`Delete ${user.email}?`)) return;

    try {
      await request(`/delete/${user.id}`, { method: 'DELETE' });
      dashboardMessage.textContent = 'User deleted.';
      await loadUsers();
    } catch (error) {
      dashboardMessage.textContent = error.message;
    }
  });

  row.append(nameInput, emailInput, saveButton, deleteButton);
  userList.append(row);
}

document.getElementById('logout').addEventListener('click', async () => {
  try {
    await request('/logout', { method: 'POST' });
  } catch {
    // Clear the browser session even if the server is unavailable.
  }

  sessionStorage.removeItem('token');
  token = null;
  dashboard.hidden = true;
  authPage.hidden = false;
  loginForm.reset();
  showForm(loginForm);
});

if (token) {
  authPage.hidden = true;
  dashboard.hidden = false;
  loadUsers();
}