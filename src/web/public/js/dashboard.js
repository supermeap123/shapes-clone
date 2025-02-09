// Dashboard state
let currentSettings = {};
let commandList = [];
let serverInfo = {};

// DOM Elements
const elements = {
  serverName: document.getElementById('serverName'),
  saveBtn: document.getElementById('saveBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  commandList: document.getElementById('commandList'),
  logContent: document.getElementById('logContent')
};

// Initialize dashboard
async function initDashboard() {
  try {
    // Get guild ID from URL
    const guildId = window.location.pathname.split('/').pop();
    
    // Fetch server settings
    const settings = await fetchSettings(guildId);
    currentSettings = settings;
    
    // Fetch server info
    serverInfo = await fetchServerInfo(guildId);
    elements.serverName.textContent = serverInfo.name;
    
    // Fetch command list
    commandList = await fetchCommands(guildId);
    
    // Populate form fields
    populateFields(settings);
    
    // Setup command toggles
    setupCommandToggles(commandList);
    
    // Setup event listeners
    setupEventListeners();
    
    // Start log streaming
    startLogStream(guildId);
    
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    showError('Failed to load dashboard. Please try again.');
  }
}

// API Calls
async function fetchSettings(guildId) {
  const response = await fetch(`/api/settings/${guildId}`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
}

async function fetchServerInfo(guildId) {
  const response = await fetch(`/api/servers/${guildId}`);
  if (!response.ok) throw new Error('Failed to fetch server info');
  return response.json();
}

async function fetchCommands(guildId) {
  const response = await fetch(`/api/commands/${guildId}`);
  if (!response.ok) throw new Error('Failed to fetch commands');
  return response.json();
}

async function saveSettings(settings) {
  const response = await fetch(`/api/settings/${currentSettings.guildId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  
  if (!response.ok) throw new Error('Failed to save settings');
  return response.json();
}

// UI Functions
function setupEventListeners() {
  // Tab switching
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Save button
  elements.saveBtn.addEventListener('click', handleSave);
  
  // Logout button
  elements.logoutBtn.addEventListener('click', handleLogout);
  
  // Form field changes
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('change', () => {
      elements.saveBtn.classList.add('bg-indigo-500');
      elements.saveBtn.textContent = 'Save Changes*';
    });
  });
}

function switchTab(tabId) {
  // Update button states
  elements.tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  // Update content visibility
  elements.tabContents.forEach(content => {
    content.classList.toggle('hidden', content.id !== tabId);
  });
}

function setupCommandToggles(commands) {
  elements.commandList.innerHTML = commands.map(cmd => `
    <div class="flex items-center justify-between py-2">
      <div>
        <h3 class="font-medium">${cmd.name}</h3>
        <p class="text-sm text-gray-500">${cmd.description}</p>
      </div>
      <label class="switch">
        <input type="checkbox" ${cmd.enabled ? 'checked' : ''} data-command="${cmd.name}">
        <span class="slider round"></span>
      </label>
    </div>
  `).join('');
}

function populateFields(settings) {
  // General settings
  document.getElementById('botToken').value = settings.botToken || '';
  document.getElementById('openrouterKey').value = settings.openrouterKey || '';
  document.getElementById('enableDMs').checked = settings.enableDMs || false;
  
  // Personality settings
  document.getElementById('backstory').value = settings.personality?.backstory || '';
  document.getElementById('traits').value = settings.personality?.traits.join(', ') || '';
  document.getElementById('style').value = settings.personality?.conversationStyle || 'casual';
  
  // Memory settings
  document.getElementById('memoryRetention').value = settings.memory?.retention || 100;
  document.getElementById('revivalThreshold').value = settings.memory?.revivalThreshold || 30;
  document.getElementById('timeAware').checked = settings.memory?.timeAware || false;
}

async function handleSave() {
  try {
    elements.saveBtn.disabled = true;
    elements.saveBtn.textContent = 'Saving...';
    
    const settings = {
      guildId: currentSettings.guildId,
      botToken: document.getElementById('botToken').value,
      openrouterKey: document.getElementById('openrouterKey').value,
      enableDMs: document.getElementById('enableDMs').checked,
      personality: {
        backstory: document.getElementById('backstory').value,
        traits: document.getElementById('traits').value.split(',').map(t => t.trim()),
        conversationStyle: document.getElementById('style').value
      },
      memory: {
        retention: parseInt(document.getElementById('memoryRetention').value),
        revivalThreshold: parseInt(document.getElementById('revivalThreshold').value),
        timeAware: document.getElementById('timeAware').checked
      },
      commands: Array.from(document.querySelectorAll('#commandList input[type="checkbox"]'))
        .map(cb => ({
          name: cb.dataset.command,
          enabled: cb.checked
        }))
    };
    
    await saveSettings(settings);
    
    elements.saveBtn.textContent = 'Saved!';
    elements.saveBtn.classList.remove('bg-indigo-500');
    
    setTimeout(() => {
      elements.saveBtn.disabled = false;
      elements.saveBtn.textContent = 'Save Changes';
    }, 2000);
    
  } catch (error) {
    console.error('Failed to save settings:', error);
    showError('Failed to save settings. Please try again.');
    elements.saveBtn.disabled = false;
    elements.saveBtn.textContent = 'Save Changes';
  }
}

function handleLogout() {
  // Clear token and redirect to login
  localStorage.removeItem('dashboardToken');
  window.location.href = '/login';
}

// Log streaming
function startLogStream(guildId) {
  const ws = new WebSocket(`${window.location.origin.replace('http', 'ws')}/api/logs/${guildId}`);
  
  ws.onmessage = (event) => {
    const log = JSON.parse(event.data);
    appendLog(log);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    setTimeout(() => startLogStream(guildId), 5000);
  };
}

function appendLog(log) {
  const logEntry = `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.level}: ${log.message}\n`;
  elements.logContent.textContent += logEntry;
  elements.logContent.scrollTop = elements.logContent.scrollHeight;
}

function showError(message) {
  // TODO: Implement error toast/notification
  alert(message);
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
