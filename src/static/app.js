    // Mock Data
    const NAV_ITEMS = [
      { id: 'dashboard', label: 'Dashboard', icon: '◈' },
      { id: 'analytics', label: 'Analytics', icon: '◉' },
      { id: 'system', label: 'System Core', icon: '⚙️' },
      { id: 'security', label: 'Security', icon: '🛡️' },
      { id: 'logs', label: 'System Logs', icon: '📄' },
    ];

    let currentTab = 'dashboard';

    // Sample content for other tabs
    const TAB_CONTENT = {
      analytics: `
        <h2 style="margin-bottom: 20px;

">Analytics Overview</h2>
        <div class="card" style="height: 400px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; color:#666;">
          📊 Advanced Charts & Metrics Coming Soon...
        </div>
      `,
      system: `
        <h2 style="margin-bottom: 20px;">System Core</h2>
        <div class="card">
          <h3>Node Status</h3>
          <p style="color:var(--accent-green); margin:15px 0;">● All 12 nodes operational</p>
          <button onclick="simulateReboot()" style="padding:10px 20px; background:#222; border:none; color:white; border-radius:6px; cursor:pointer;">
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
      `
    };

    const app = document.getElementById('app');

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
      app.appendChild(sidebar);
    }

    function renderHeader() {
      const header = document.createElement('header');
      header.className = 'header';

      header.innerHTML = `
        <div class="header-title" id="page-title">System Overview</div>
        <div class="header-status">
          <div class="status-dot"></div>
          ONLINE
        </div>
      `;
      app.appendChild(header);
    }

    function renderContent() {
      // Remove old content if exists
      const oldContent = document.querySelector('.main-content');
      if (oldContent) oldContent.remove();

      const main = document.createElement('div');
      main.className = 'main-content';

      if (currentTab === 'dashboard') {
        main.innerHTML = `
          <div class="dashboard-grid">
            <!-- Summary Cards -->
            <div class="card summary-card">
              <div class="card-header"><span>CPU Load</span><span>●</span></div>
              <div class="card-value" id="cpu-value">42%</div>
              <div class="card-subtext">Stable</div>
            </div>
            <div class="card summary-card">
              <div class="card-header"><span>Memory</span><span>▲</span></div>
              <div class="card-value" id="ram-value">12.4 GB</div>
              <div class="card-subtext">62% Used</div>
            </div>
            <div class="card summary-card">
              <div class="card-header"><span>Network I/O</span><span>▲</span></div>
              <div class="card-value">1.2 Gbps</div>
              <div class="card-subtext">Peak: 1.5 Gbps</div>
            </div>
            <div class="card summary-card">
              <div class="card-header"><span>Errors (24h)</span><span>●</span></div>
              <div class="card-value">0</div>
              <div class="card-subtext">No issues</div>
            </div>

<!-- System Health -->
            <div class="card">
              <div class="card-header"><span>System Health</span><span style="color:var(--accent-green)">OPTIMAL</span></div>
              <div style="display:flex; gap:30px; margin-top:15px;">
                <div><div style="color:var(--text-secondary)">Uptime</div><div style="font-size:1.4rem">99.99%</div></div>
                <div><div style="color:var(--text-secondary)">Latency</div><div style="font-size:1.4rem">12ms</div></div>
                <div><div style="color:var(--text-secondary)">Load</div><div style="font-size:1.4rem">Low</div></div>
              </div>
            </div>

            <!-- Activity -->
            <div class="card" style="grid-column: span 2;">
              <div class="card-header"><span>Recent Activity</span></div>
              <ul class="activity-list" id="activity-list"></ul>
            </div>

            <!-- Chart -->
            <div class="card" style="grid-column: span 2;">
              <div class="card-header"><span>Network Traffic (24h)</span><span>Gbps</span></div>
              <div class="chart-container" id="chart-container"></div>
            </div>
          </div>
        `;
        app.appendChild(main);
        renderDashboardExtras();
      } else {
        main.innerHTML = TAB_CONTENT[currentTab] || `<h2>${currentTab.toUpperCase()}</h2><p>Content not implemented yet.</p>`;
        app.appendChild(main);
      }
    }

    function renderDashboardExtras() {
      // Live CPU updater
      let cpu = 42;
      setInterval(() => {
        cpu = Math.max(30, Math.min(68, cpu + (Math.random() * 6 - 3)));
        const cpuEl = document.getElementById('cpu-value');
        if (cpuEl) cpuEl.textContent = Math.round(cpu) + '%';
      }, 2500);

      // Render Activity
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

      // Render Chart
      const chartContainer = document.getElementById('chart-container');
      if (chartContainer) {
        chartContainer.innerHTML = CHART_DATA.map(d => `
          <div class="bar" style="height: ${d.value}%">
            <span class="bar-label">${d.label}</span>
          </div>
        `).join('');
      }
    }

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

    function switchTab(tabId) {
      currentTab = tabId;
      document.getElementById('page-title').textContent = 
        NAV_ITEMS.find(i => i.id === tabId).label;

      // Re-render everything
      renderContent();

      // Update active nav
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.textContent.includes(NAV_ITEMS.find(i => i.id === tabId).label));
      });
    }

    function simulateReboot() {
      alert("🔄 Node cluster reboot initiated... (Demo)");
    }

    // Initialize
    function init() {
      renderSidebar();
      renderHeader();
      renderContent();
    }

    window.onload = init;