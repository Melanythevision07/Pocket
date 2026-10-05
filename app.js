let usersDict = {};
let currentUsername = null;
let currentFilter = 'todos';

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const nameGroup = document.getElementById('name-group');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggleBtn = document.getElementById('auth-toggle-btn');
const authToggleText = document.getElementById('auth-toggle-text');
const authError = document.getElementById('auth-error');

const userDisplayName = document.getElementById('user-display-name');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

const movementForm = document.getElementById('movement-form');
const movementsList = document.getElementById('movements-list');
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const filterBtns = document.querySelectorAll('.filter-btn');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const bwToggleBtn = document.getElementById('bw-toggle-btn');

const statsCount = document.getElementById('stats-count');
const ratioText = document.getElementById('ratio-text');
const incomeBar = document.getElementById('income-bar');
const expenseBar = document.getElementById('expense-bar');
const avgAmount = document.getElementById('avg-amount');
const maxExpense = document.getElementById('max-expense');
const maxIncome = document.getElementById('max-income');
const savingsRate = document.getElementById('savings-rate');

let isRegisterMode = false;

document.addEventListener('DOMContentLoaded', () => {
  loadThemePreference();
  loadBWPreference();
  loadUsersFromStorage();
  checkActiveSession();
  setupEventListeners();
});

function loadThemePreference() {
  const savedTheme = localStorage.getItem('pocket_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('pocket_theme', newTheme);
  themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
}

function loadBWPreference() {
  const isBW = localStorage.getItem('pocket_bw') === 'true';
  if (isBW) {
    document.documentElement.classList.add('bw-mode');
  }
}

function toggleBWMode() {
  const isBW = document.documentElement.classList.toggle('bw-mode');
  localStorage.setItem('pocket_bw', isBW);
}

function loadUsersFromStorage() {
  const stored = localStorage.getItem('gestor_gastos_usuarios');
  if (stored) {
    try { usersDict = JSON.parse(stored); } catch (e) { usersDict = {}; }
  }
}

function saveUsersToStorage() {
  localStorage.setItem('gestor_gastos_usuarios', JSON.stringify(usersDict));
}

function checkActiveSession() {
  const activeUser = localStorage.getItem('gestor_gastos_active_user');
  if (activeUser && usersDict[activeUser]) {
    currentUsername = activeUser;
    showAppView();
  } else {
    showAuthView();
  }
}

function setupEventListeners() {
  themeToggleBtn.addEventListener('click', toggleTheme);
  bwToggleBtn.addEventListener('click', toggleBWMode);

  authToggleBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    authError.style.display = 'none';

    if (isRegisterMode) {
      authTitle.textContent = 'Create EasyPay Account';
      authSubtitle.textContent = 'Regístrate para guardar tu diccionario de gastos';
      nameGroup.style.display = 'flex';
      authSubmitBtn.textContent = 'Sign Up';
      authToggleText.textContent = '¿Ya tienes cuenta?';
      authToggleBtn.textContent = 'Login';
    } else {
      authTitle.textContent = 'Easy Online Payment';
      authSubtitle.textContent = 'Gestiona tus finanzas personales de forma rápida y sencilla';
      nameGroup.style.display = 'none';
      authSubmitBtn.textContent = 'Login';
      authToggleText.textContent = '¿No tienes cuenta?';
      authToggleBtn.textContent = 'Sign Up';
    }
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();

    authError.style.display = 'none';

    if (isRegisterMode) {
      if (usersDict[username]) {
        showError('El usuario ya existe en el registro.');
        return;
      }
      if (!name) {
        showError('Por favor ingresa tu nombre completo.');
        return;
      }

      usersDict[username] = { name, password, movements: [] };
      saveUsersToStorage();
      currentUsername = username;
      localStorage.setItem('gestor_gastos_active_user', username);
      showAppView();
    } else {
      if (!usersDict[username] || usersDict[username].password !== password) {
        showError('Usuario o contraseña incorrectos.');
        return;
      }

      currentUsername = username;
      localStorage.setItem('gestor_gastos_active_user', username);
      showAppView();
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('gestor_gastos_active_user');
    currentUsername = null;
    showAuthView();
  });

  movementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('mov-description').value.trim();
    const amount = parseFloat(document.getElementById('mov-amount').value);
    const type = document.getElementById('mov-type').value;

    if (!description || isNaN(amount) || amount <= 0) return;

    const newMovement = {
      id: Date.now(),
      description,
      amount,
      type,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    usersDict[currentUsername].movements.unshift(newMovement);
    saveUsersToStorage();

    movementForm.reset();
    renderDashboard();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderMovements();
    });
  });
}

function showError(msg) {
  authError.textContent = msg;
  authError.style.display = 'block';
}

function showAuthView() {
  authContainer.style.display = 'flex';
  appContainer.style.display = 'none';
  authForm.reset();
}

function showAppView() {
  authContainer.style.display = 'none';
  appContainer.style.display = 'flex';

  const user = usersDict[currentUsername];
  userDisplayName.textContent = user.name;
  userAvatar.textContent = user.name.charAt(0).toUpperCase();

  renderDashboard();
}

function renderDashboard() {
  renderMovements();
  updateCalculations();
}

function updateCalculations() {
  const movements = usersDict[currentUsername].movements || [];

  const incomeList = movements.filter(m => m.type === 'ingreso');
  const expenseList = movements.filter(m => m.type === 'gasto');

  const income = incomeList.reduce((acc, m) => acc + m.amount, 0);
  const expenses = expenseList.reduce((acc, m) => acc + m.amount, 0);
  const balance = income - expenses;

  totalBalance.textContent = `$${balance.toLocaleString('es-CO')}`;
  totalIncome.textContent = `$${income.toLocaleString('es-CO')}`;
  totalExpenses.textContent = `$${expenses.toLocaleString('es-CO')}`;

  statsCount.textContent = `${movements.length} ${movements.length === 1 ? 'movimiento' : 'movimientos'} registrados`;

  const totalFlow = income + expenses;
  let incomePct = 0;
  let expensePct = 0;

  if (totalFlow > 0) {
    incomePct = Math.round((income / totalFlow) * 100);
    expensePct = 100 - incomePct;
  }

  incomeBar.style.width = `${incomePct}%`;
  expenseBar.style.width = `${expensePct}%`;
  ratioText.textContent = `${incomePct}% Ingresos / ${expensePct}% Gastos`;

  const totalAmount = movements.reduce((acc, m) => acc + m.amount, 0);
  const avg = movements.length > 0 ? totalAmount / movements.length : 0;
  avgAmount.textContent = `$${Math.round(avg).toLocaleString('es-CO')}`;

  const maxExp = expenseList.length > 0 ? Math.max(...expenseList.map(m => m.amount)) : 0;
  const maxInc = incomeList.length > 0 ? Math.max(...incomeList.map(m => m.amount)) : 0;

  maxExpense.textContent = `$${maxExp.toLocaleString('es-CO')}`;
  maxIncome.textContent = `$${maxInc.toLocaleString('es-CO')}`;

  let rate = 0;
  if (income > 0) {
    rate = Math.max(0, Math.round((balance / income) * 100));
  }
  savingsRate.textContent = `${rate}%`;
}

function renderMovements() {
  const movements = usersDict[currentUsername].movements || [];
  movementsList.innerHTML = '';

  const filteredMovements = movements.filter(m => {
    if (currentFilter === 'todos') return true;
    return m.type === currentFilter;
  });

  if (filteredMovements.length === 0) {
    movementsList.innerHTML = '<div class="empty-state">No hay movimientos registrados.</div>';
    return;
  }

  filteredMovements.forEach(m => {
    const item = document.createElement('div');
    item.className = 'movement-item';

    const isIncome = m.type === 'ingreso';
    const sign = isIncome ? '+' : '-';

    item.innerHTML = `
      <div class="movement-info">
        <span class="movement-desc">${escapeHtml(m.description)}</span>
        <span class="movement-date">${m.date}</span>
      </div>
      <div class="movement-actions">
        <span class="movement-amount ${m.type}">${sign}$${m.amount.toLocaleString('es-CO')}</span>
        <button class="btn-delete" onclick="deleteMovement(${m.id})" title="Eliminar">🗑️</button>
      </div>
    `;

    movementsList.appendChild(item);
  });
}

function deleteMovement(id) {
  usersDict[currentUsername].movements = usersDict[currentUsername].movements.filter(m => m.id !== id);
  saveUsersToStorage();
  renderDashboard();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}