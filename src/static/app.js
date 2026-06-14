// src/static/app.js

// --- CONFIG & STATE ---
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'processes', label: 'Processes', icon: '📋' },
  { id: 'terminal', label: 'Terminal', icon: '⌨️' },
  { id: 'analytics', label: 'Analytics', icon: '◉' },
  { id: 'system', label: 'System Core', icon: '⚙️' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'logs', label: 'System Logs', icon: '📄' },
];

let currentTab = 'dashboard';
let statsInterval = null;
const API_URL = 'http://127.0.0.1:8000/api/stats';

// --- MOCK DATA ---
const TAB_CONTENT = {
  analytics: `
    <h2 style="margin-bottom: 20px;">Analytics Overview</h2>
    <div class="card" style="height: 400px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; color:#666;">
      📊 Advanced Charts & Metrics Coming Soon...
    </div>
  `,
  system: `
    <h2 style="margin-bottom: 20px;">System Core</h2>
    <div class="card">
      <h3>Node Status</h3>
      <p style="color:var(--accent-green); margin:15px 0;">● All 12 nodes operational</p>
      <button id="reboot-btn" style="padding:10px 20px; background:#222; border:none; color:white; border-radius:6px; cursor:pointer;">
        Restart Node Cluster
      </button>
    </div>
  `,
  security: `
    <h2 style="margin-bottom: 20px;">Security Center</h2>
    <div class="card">
      <p><strong>Threat Level:</strong> <span style="color:var(--accent-green)">LOW</span></p>
      <p><strong>Last Scan:</strong> 3 minutes ago</p>
      <p><strong>Firewall:</strong> ENABLED</p>
    </div>
  `,
  logs: `
    <h2 style="margin-bottom: 20px;">System Logs</h2>
    <div class="card" style="font-family:monospace; font-size:0.9rem; max-height:600px; overflow:auto;">
      [2025-06-13 13:42:01] INFO: Connection established<br>
      [2025-06-13 13:41:55] WARN: High memory usage detected<br>
      [2025-06-13 13:40:12] ERROR: Failed to sync cache node 03<br>
    </div>
  `,
  processes: `
    <h2 style="margin-bottom: 20px;">Process Manager</h2>
    <div class="card">
      <table style="width:100%; text-align:left; font-family:var(--font-mono); font-size:0.85rem; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary);">
            <th style="padding:10px;">PID</th>
            <th>Name</th>
            <th>CPU %</th>
            <th>RAM (MB)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="process-list">
          <tr><td colspan="6" style="padding:20px; text-align:center;">Loading processes...</td></tr>
        </tbody>
      </table>
    </div>
  `,
  terminal: `
    <h2 style="margin-bottom: 20px;">Terminal</h2>
    <div class="card" style="height: 500px; display:flex; flex-direction:column;">
      <div id="terminal-output" style="flex:1; overflow-y:auto; font-family:var(--font-mono); font-size:0.9rem; padding:10px; background:#000; color:#0f0; border:1px solid var(--border-color); margin-bottom:10px;">
        <div>NEXUS Terminal v1.0</div>
        <div>Type 'help' for available commands.</div>
        <div>----------------------------------------</div>
      </div>
      <div style="display:flex; gap:10px;">
        <input type="text" id="terminal-input" placeholder="Enter command..." style="flex:1; padding:10px; background:#111; border:1px solid var(--border-color); color:white; font-family:var(--font-mono);">
        <button id="terminal-send" style="padding:10px 20px; background:var(--accent-green); color:black; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Send</button>
      </div>
    </div>
  `
};

const ACTIVITIES = [
  { time: '10:42', message: 'System boot sequence completed', status: 'success' },
  { time: '10:38', message: 'User auth token refreshed', status: 'success' },
  { time: '10:15', message: 'Connection timeout: DB Node 2', status: 'error' },
  { time: '09:00', message: 'Backup process initiated', status: 'success' },
];

const CHART_DATA = [
  { label: '00', value: 30 }, { label: '04', value: 45 },
  { label: '08', value: 60 }, { label: '12', value: 80 },
  { label: '16', value: 55 }, { label: '20', value: 40 },
  { label: '24', value: 35 }
];

// --- DOM ELEMENTS ---
const app = document.getElementById('app');

// --- RENDER FUNCTIONS ---

function renderSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.innerHTML = `<span>//</span> NEXUS`;
  sidebar.appendChild(logo);

  const nav = document.createElement('ul');
  nav.className = 'nav-menu';
  NAV_ITEMS.forEach(item => {
    const li = document.createElement('li');
    li.className = `nav-item ${item.id === currentTab ? 'active' : ''}`;
    li.innerHTML = `<span>${item.icon}</span> ${item.label}`;
    li.onclick = () => switchTab(item.id);
    nav.appendChild(li);
  });
  sidebar.appendChild(nav);

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = () => sidebar.classList.remove('open');
  sidebar.appendChild(overlay);

  app.appendChild(sidebar);
}

function renderHeader() {
  const header = document.createElement('header');
  header.className = 'header';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'menu-toggle';
  toggleBtn.innerHTML = '☰';
  toggleBtn.onclick = () => {
    document.querySelector('.sidebar').classList.toggle('open');
  };
  header.appendChild(toggleBtn);

  const title = document.createElement('div');
  title.className = 'header-title';
  title.id = 'page-title';
  title.textContent = NAV_ITEMS.find(i => i.id === currentTab).label;
  header.appendChild(title);

  const status = document.createElement('div');
  status.className = 'header-status';
  status.innerHTML = `
    <div class="status-dot" id="connection-dot"></div>
    <span id="connection-text">CONNECTING...</span>
  `;
  header.appendChild(status);

  app.appendChild(header);
}

function renderContent() {
  const oldContent = document.querySelector('.main-content');
  if (oldContent) oldContent.remove();

  const main = document.createElement('div');
  main.className = 'main-content';

  if (currentTab === 'dashboard') {
    main.innerHTML = `
      <div class="dashboard-grid">
        <div class="card summary-card">
          <div class="card-header"><span>CPU Load</span><span>●</span></div>
          <div class="card-value" id="cpu-value">--%</div>
          <div class="card-subtext" id="cpu-cores">-- Cores</div>
        </div>
        <div class="card summary-card">
          <div class="card-header"><span>RAM Usage</span><span>▲</span></div>
          <div class="card-value" id="ram-value">-- GB</div>
          <div class="card-subtext" id="ram-percent">--%</div>
        </div>
        <div class="card summary-card">
          <div class="card-header"><span>GPU Load</span><span>▲</span></div>
          <div class="card-value" id="gpu-value">-- GB</div>
          <div class="card-subtext" id="gpu-status">--</div>
        </div>
        <div class="card summary-card">
          <div class="card-header"><span>Network I/O</span><span>▲</span></div>
          <div class="card-value" id="net-value">-- MB</div>
          <div class="card-subtext" id="net-sub">Sent</div>
        </div>
        <div class="card">
          <div class="card-header"><span>System Health</span><span style="color:var(--accent-green)">OPTIMAL</span></div>
          <div style="display:flex; gap:30px; margin-top:15px;">
            <div><div style="color:var(--text-secondary)">Disk</div><div style="font-size:1.4rem" id="disk-value">--%</div></div>
            <div><div style="color:var(--text-secondary)">Latency</div><div style="font-size:1.4rem">12ms</div></div>
            <div><div style="color:var(--text-secondary)">Load</div><div style="font-size:1.4rem">Low</div></div>
          </div>
        </div>
        <div class="card" style="grid-column: span 2;">
          <div class="card-header"><span>Recent Activity</span></div>
          <ul class="activity-list" id="activity-list"></ul>
        </div>
        <div class="card" style="grid-column: span 2;">
          <div class="card-header"><span>Network Traffic (24h)</span><span>Gbps</span></div>
          <div class="chart-container" id="chart-container"></div>
        </div>
      </div>
    `;
    app.appendChild(main);
    renderDashboardExtras();
    startRealTimeMonitor();
  } else {
    main.innerHTML = TAB_CONTENT[currentTab] || `<h2>${currentTab.toUpperCase()}</h2><p>Content not implemented yet.</p>`;
    app.appendChild(main);
    
    if (currentTab === 'system') {
      document.getElementById('reboot-btn').onclick = simulateReboot;
    }
    
    if (currentTab === 'processes') {
      loadProcesses();
    }
    
    if (currentTab === 'terminal') {
      initTerminal();
    }
    
    if (statsInterval) {
      clearInterval(statsInterval);
      statsInterval = null;
    }
  }
}

// --- HELPER RENDERERS ---

function renderDashboardExtras() {
  const activityList = document.getElementById('activity-list');
  if (activityList) {
    activityList.innerHTML = ACTIVITIES.map(act => `
      <li class="activity-item">
        <span class="activity-time">${act.time}</span>
        <span>${act.message}</span>
        <span class="status-${act.status}">${act.status.toUpperCase()}</span>
      </li>
    `).join('');
  }
  
  const chartContainer = document.getElementById('chart-container');
  if (chartContainer) {
    chartContainer.innerHTML = CHART_DATA.map(d => `
      <div class="bar" style="height: ${d.value}%">
        <span class="bar-label">${d.label}</span>
      </div>
    `).join('');
  }
}

// --- REAL HARDWARE MONITORING ---

async function fetchStats() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Backend not running');
    
    const data = await response.json();
    
    document.getElementById('cpu-value').textContent = data.cpu.percent + '%';
    document.getElementById('cpu-cores').textContent = data.cpu.cores + ' Cores';
    
    document.getElementById('ram-value').textContent = data.ram.used_gb + ' GB';
    document.getElementById('ram-percent').textContent = data.ram.percent + '% Used';
    
    document.getElementById('gpu-value').textContent = data.gpu.used_gb + ' GB';
    document.getElementById('gpu-status').textContent = data.gpu.status;
    
    document.getElementById('net-value').textContent = data.network.recv_mb + ' MB';
    document.getElementById('net-sub').textContent = `Sent: ${data.network.sent_mb} MB`;

    document.getElementById('disk-value').textContent = data.disk.percent + '%';

    const dot = document.getElementById('connection-dot');
    const text = document.getElementById('connection-text');
    dot.style.backgroundColor = 'var(--accent-green)';
    dot.style.boxShadow = '0 0 8px var(--accent-green)';
    text.textContent = 'ONLINE';
    text.style.color = 'var(--accent-green)';

  } catch (error) {
    console.error('Fetch error:', error);
    const dot = document.getElementById('connection-dot');
    const text = document.getElementById('connection-text');
    dot.style.backgroundColor = 'var(--accent-red)';
    dot.style.boxShadow = '0 0 8px var(--accent-red)';
    text.textContent = 'OFFLINE';
    text.style.color = 'var(--accent-red)';
  }
}

function startRealTimeMonitor() {
  if (statsInterval) clearInterval(statsInterval);
  fetchStats();
  statsInterval = setInterval(fetchStats, 2000);
}

// --- PROCESS MANAGER LOGIC ---

async function loadProcesses() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/processes');
    const procs = await res.json();
    const tbody = document.getElementById('process-list');
    
    if (!tbody) return;
    
    tbody.innerHTML = procs.map(p => `
      <tr style="border-bottom:1px solid var(--border-color);">
        <td style="padding:10px;">${p.pid}</td>
        <td>${p.name}</td>
        <td style="color:${p.cpu > 50 ? 'var(--accent-red)' : 'var(--text-primary)'}">${p.cpu}%</td>
        <td>${p.ram_mb}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="killProc(${p.pid})" style="background:var(--accent-red); color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
            Kill
          </button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error(e);
    const tbody = document.getElementById('process-list');
    if(tbody) tbody.innerHTML = '<tr><td colspan="6" style="padding:20px; text-align:center; color:var(--accent-red);">Failed to load processes</td></tr>';
  }
}

window.killProc = async (pid) => {
  if(confirm('Are you sure you want to kill this process?')) {
    try {
      await fetch(`http://127.0.0.1:8000/api/process/kill?pid=${pid}`, { method: 'POST' });
      loadProcesses();
    } catch (e) {
      alert('Failed to kill process');
    }
  }
};

// --- TERMINAL LOGIC ---

function initTerminal() {
  const input = document.getElementById('terminal-input');
  const sendBtn = document.getElementById('terminal-send');
  const output = document.getElementById('terminal-output');

  function appendOutput(text, isError = false) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = isError ? 'var(--accent-red)' : '#0f0';
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  async function executeCommand(cmd) {
    if (!cmd.trim()) return;
    
    appendOutput(`> ${cmd}`);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      
      if (data.stdout) appendOutput(data.stdout);
      if (data.stderr) appendOutput(data.stderr, true);
      if (data.returncode !== 0 && !data.stderr) {
        appendOutput(`Exited with code ${data.returncode}`, true);
      }
    } catch (e) {
      appendOutput(`Error: ${e.message}`, true);
    }
  }

  if (sendBtn) {
    sendBtn.onclick = () => executeCommand(input.value);
  }
  if (input) {
    input.onkeypress = (e) => {
      if (e.key === 'Enter') executeCommand(input.value);
    };
  }
}

// --- NAVIGATION ---

function switchTab(tabId) {
  currentTab = tabId;
  
  const titleEl = document.getElementById('page-title');
  if(titleEl) titleEl.textContent = NAV_ITEMS.find(i => i.id === tabId).label;

  document.querySelectorAll('.nav-item').forEach(item => {
    const itemLabel = item.innerText;
    const navItem = NAV_ITEMS.find(i => i.label === itemLabel);
    if (navItem && navItem.id === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('open');

  renderContent();
}

function simulateReboot() {
  const btn = document.getElementById('reboot-btn');
  if(btn) {
    btn.textContent = "Rebooting...";
    btn.style.background = "var(--accent-green)";
    btn.style.color = "#000";
    setTimeout(() => {
      btn.textContent = "Restart Node Cluster";
      btn.style.background = "#222";
      btn.style.color = "white";
      alert("🔄 Node cluster reboot initiated... (Demo)");
    }, 1500);
  }
}

// --- INITIALIZATION ---

function init() {
  renderSidebar();
  renderHeader();
  renderContent();
}

window.onload = init;