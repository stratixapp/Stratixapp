// Auth guard
if (!sessionStorage.getItem('stratix_admin')) {
  window.location.href = 'login.html';
}

// Live clock
function updateClock() {
  const el = document.getElementById('liveClock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// Panel switching
const panelTitles = {
  dashboard: ['Dashboard', 'Live overview of the Stratix ecosystem'],
  analytics: ['Analytics Center', 'Visitor traffic, sources, and behavior'],
  revenue: ['Revenue Center', 'Financial metrics and transaction history'],
  apps: ['All Apps Status', 'Real-time status of all 12 ecosystem apps'],
  downloads: ['Download Tracking', 'Play Store, web, and conversion funnel'],
  products: ['Product Manager', 'Add, edit, and manage ecosystem apps'],
  leads: ['Lead Inbox', 'Contact form messages and business inquiries'],
  alerts: ['Alerts & Notifications', 'System events and real-time notifications'],
};

function showPanel(id, linkEl) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  const [title, sub] = panelTitles[id] || ['Dashboard', ''];
  document.getElementById('panelTitle').textContent = title;
  document.getElementById('panelSub').textContent = sub;
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  // Init charts lazily
  setTimeout(() => initCharts(id), 50);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
  sessionStorage.removeItem('stratix_admin');
  window.location.href = 'login.html';
}

// App search
function filterApps() {
  const q = document.getElementById('appSearch').value.toLowerCase();
  document.querySelectorAll('#appsTable tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// Product manager
function loadAppEdit(val) {
  const ef = document.getElementById('editForm');
  ef.style.display = val ? 'block' : 'none';
  if (val) {
    document.getElementById('editPrice').value = '299';
    document.getElementById('editDesc').value = `${val} — edit description here.`;
    document.getElementById('editPlay').value = '';
    document.getElementById('editWeb').value = '';
  }
}
function saveEdit() {
  alert('Changes saved! (Connect Firebase to persist)');
}
function addApp(e) {
  e.preventDefault();
  document.getElementById('appAddSuccess').style.display = 'block';
  e.target.reset();
  setTimeout(() => document.getElementById('appAddSuccess').style.display = 'none', 3000);
}

// Lead actions
function replyLead(btn, email) {
  window.location.href = `mailto:${email}?subject=Re: Stratix Inquiry&body=Hi,%0A%0AThank you for reaching out to Stratix!%0A%0ABest regards,%0AAnanthu Shaji%0AFounder, Stratix | Lyceum Corporation%0AWhatsApp: +91 9400802285`;
}
function markDone(btn) {
  btn.closest('.lead-item').style.opacity = '0.4';
}

// ===== CHARTS =====
const chartInstances = {};

function initCharts(panel) {
  const commonConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8a9ab5', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8a9ab5', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#8a9ab5', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    }
  };

  if (panel === 'dashboard') {
    if (!chartInstances.weekly) {
      chartInstances.weekly = new Chart(document.getElementById('weeklyChart'), {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Downloads',
            data: [180, 220, 195, 310, 280, 247, 190],
            backgroundColor: 'rgba(10,132,255,0.6)',
            borderColor: '#0a84ff',
            borderWidth: 1,
            borderRadius: 6,
          }]
        },
        options: { ...commonConfig }
      });
    }
    if (!chartInstances.revenue) {
      chartInstances.revenue = new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: Array.from({ length: 15 }, (_, i) => `Jun ${i + 1}`),
          datasets: [{
            label: 'Revenue (₹)',
            data: [12000, 18000, 14000, 22000, 28000, 19000, 31000, 24000, 38000, 29000, 42000, 35000, 48000, 38400, 41000],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52,199,89,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#34c759',
          }]
        },
        options: { ...commonConfig }
      });
    }
  }

  if (panel === 'analytics') {
    if (!chartInstances.visitors) {
      const labels = Array.from({ length: 30 }, (_, i) => `May ${i + 17 > 31 ? i - 14 : i + 17}`);
      chartInstances.visitors = new Chart(document.getElementById('visitorsChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Daily Visitors',
            data: [220, 180, 310, 280, 420, 380, 450, 390, 480, 520, 490, 560, 610, 580, 640, 700, 660, 720, 780, 740, 800, 760, 840, 820, 880, 860, 920, 900, 960, 980],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.06)',
            fill: true,
            tension: 0.4,
          }]
        },
        options: { ...commonConfig }
      });
    }
    if (!chartInstances.traffic) {
      chartInstances.traffic = new Chart(document.getElementById('trafficChart'), {
        type: 'doughnut',
        data: {
          labels: ['Google Search', 'Direct', 'Social Media', 'Referral'],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ['#0a84ff', '#34c759', '#bf5af2', '#ff9f0a'],
            borderWidth: 0,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8a9ab5', font: { size: 11 } }, position: 'right' } } }
      });
    }
    if (!chartInstances.device) {
      chartInstances.device = new Chart(document.getElementById('deviceChart'), {
        type: 'doughnut',
        data: {
          labels: ['Mobile', 'Desktop', 'Tablet'],
          datasets: [{
            data: [68, 24, 8],
            backgroundColor: ['#0a84ff', '#00d4ff', '#bf5af2'],
            borderWidth: 0,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8a9ab5', font: { size: 11 } }, position: 'right' } } }
      });
    }
  }

  if (panel === 'revenue') {
    if (!chartInstances.monthlyRev) {
      chartInstances.monthlyRev = new Chart(document.getElementById('monthlyRevChart'), {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue (₹)',
            data: [84000, 98000, 112000, 148000, 184000, 240800],
            backgroundColor: 'rgba(52,199,89,0.5)',
            borderColor: '#34c759',
            borderWidth: 1,
            borderRadius: 8,
          }]
        },
        options: { ...commonConfig }
      });
    }
    if (!chartInstances.productRev) {
      chartInstances.productRev = new Chart(document.getElementById('productRevChart'), {
        type: 'bar',
        data: {
          labels: ['Grimoire', 'GSTLens', 'MyRight', 'Stratix Pro', 'Connect', 'Others'],
          datasets: [{
            label: 'Monthly Revenue (₹)',
            data: [72400, 56800, 44100, 41200, 14700, 11600],
            backgroundColor: ['#bf5af2', '#34c759', '#ff453a', '#0a84ff', '#00d4ff', '#ff9f0a'],
            borderRadius: 6,
            borderWidth: 0,
          }]
        },
        options: {
          ...commonConfig,
          plugins: { legend: { display: false } },
          indexAxis: 'y',
        }
      });
    }
  }

  if (panel === 'downloads') {
    if (!chartInstances.dlSource) {
      chartInstances.dlSource = new Chart(document.getElementById('dlSourceChart'), {
        type: 'pie',
        data: {
          labels: ['Play Store', 'Website', 'Demo Opens', 'Windows', 'Direct Link'],
          datasets: [{
            data: [54, 22, 12, 8, 4],
            backgroundColor: ['#34c759', '#0a84ff', '#ff9f0a', '#bf5af2', '#00d4ff'],
            borderWidth: 0,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8a9ab5', font: { size: 11 } }, position: 'right' } } }
      });
    }
    if (!chartInstances.dlTrend) {
      chartInstances.dlTrend = new Chart(document.getElementById('dlTrendChart'), {
        type: 'line',
        data: {
          labels: Array.from({ length: 14 }, (_, i) => `Jun ${i + 1}`),
          datasets: [{
            label: 'Downloads',
            data: [180, 210, 240, 195, 270, 300, 280, 320, 290, 350, 310, 380, 360, 420],
            borderColor: '#0a84ff',
            backgroundColor: 'rgba(10,132,255,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#0a84ff',
          }]
        },
        options: { ...commonConfig }
      });
    }
  }
}

// Init dashboard charts on load
setTimeout(() => initCharts('dashboard'), 100);
