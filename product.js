/* ────────────────────────────────────────────────
   Dashboard – interactivity + demo data
   Save as: product.js
   Requires: product.css, Chart.js v4 (via CDN in HTML)
────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initDashboard);

function initDashboard() {
  renderTotalFunding();
  renderCountryContribution();
  renderAssetTypeBreakdown();
  renderFinancialChart();
  renderTopContributors();
  renderProjectKPIs();
  renderEvidenceDocs();
  renderProjectList();
}

/* ── 1. TOTAL FUNDING ─────────────────────────── */
function renderTotalFunding() {
  const sheetURL = 'https://opensheet.elk.sh/2PACX-1vQEgjrqgRyjEakYi9IbAjv_RKdjkknaBmaacjgAuhONftAM740yJptl1_JLbJd8zxk_x6vy-18CP0IT
/Sheet1';
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      const fundingEntry = data.find(row => row.metric === "total_funding");
      const funding = parseFloat(fundingEntry?.value || 0);
      document.getElementById('total-amount').textContent =
        `$${numberWithCommas(funding.toFixed(2))}`;
    });
}


/* ── 2. COUNTRY CONTRIBUTION (DONUT) ─────────── */
function renderCountryContribution() {
  const ctx = document.getElementById('country-chart').getContext('2d');
  const data = {
    labels: ['🇺🇸 USA', '🇰🇷 Korea', '🇬🇧 UK', '🇩🇪 Germany', '🌍 Others'],
    datasets: [{
      data: [38, 24, 16, 12, 10],
      backgroundColor: ['#6366f1', '#60a5fa', '#34d399', '#fbbf24', '#d1d5db'],
      borderWidth: 0,
    }]
  };
  new Chart(ctx, {
    type: 'doughnut',
    data,
    options: {
      plugins: { legend: { position: 'bottom' } },
      cutout: '65%',
    }
  });
}

/* ── 3. ASSET-TYPE BREAKDOWN (STACK) ─────────── */
function renderAssetTypeBreakdown() {
  const types = [
    { label: 'Equity',   share: 42 },
    { label: 'Debt',     share: 25 },
    { label: 'Grants',   share: 18 },
    { label: 'Crypto',   share: 10 },
    { label: 'Others',    share: 5 },
  ];

  const container = document.getElementById('asset-types');
  types.forEach(t => {
    const row = document.createElement('div');
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:.875rem;">
        <span>${t.label}</span>
        <span>${t.share}%</span>
      </div>
      <div class="progress-bar"><span style="width:${t.share}%"></span></div>
    `;
    container.appendChild(row);
  });
}

/* ── 4. FINANCIAL VISUALIZATION (LINE) ────────── */
function renderFinancialChart() {
  const ctx = document.getElementById('finance-chart').getContext('2d');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const balance = months.map(() => getRandomInt(20, 60));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'M-o-M Funding ($M)',
        data: balance,
        fill: false,
        borderColor: '#6366f1',
        tension: .35,
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
      responsive: true,
      maintainAspectRatio: false,
    }
  });
}

/* ── 5. TOP CONTRIBUTORS (TABLE) ─────────────── */
function renderTopContributors() {
  const contributors = [
    { name: 'Jane Doe',     total: 125000 },
    { name: 'Harry Doe',    total:  87500 },
    { name: 'John Smith',   total:  64320 },
  ];

  const tbody = document.querySelector('#contributors tbody');
  contributors.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>$${numberWithCommas(c.total.toFixed(2))}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── 6. PROJECT FUNDING KPIs ──────────────────── */
function renderProjectKPIs() {
  const kpis = [
    { label: 'Avg. Funding / Project', value: '$43,210' },
    { label: 'Active Projects',        value: '12'      },
    { label: 'Avg. ROI',               value: '8.5%'   },
  ];

  const container = document.getElementById('kpi-metrics');
  kpis.forEach(k => {
    const div = document.createElement('div');
    div.style.marginBottom = '.75rem';
    div.innerHTML = `
      <strong style="display:block;font-size:1rem;">${k.value}</strong>
      <span style="font-size:.875rem;color:var(--subtext);">${k.label}</span>
    `;
    container.appendChild(div);
  });
}

/* ── 7. EVIDENCE DOCUMENTS ───────────────────── */
function renderEvidenceDocs() {
  const docs = ['Impact-Report-Q1.pdf', 'External-Audit.xlsx', 'Photo-Proof.zip'];
  const ul = document.getElementById('doc-list');
  docs.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    li.addEventListener('click', () => alert(`Pretend download: ${d}`));
    ul.appendChild(li);
  });
}

/* ── 8. PROJECT LIST ─────────────────────────── */
function renderProjectList() {
  const projects = [
    { name: 'Clean Water Initiative', status: 'active'   },
    { name: 'Solar Roofs Africa',     status: 'pending'  },
    { name: 'Literacy Program',       status: 'complete' },
  ];

  const container = document.getElementById('project-list');
  projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'project';
    div.innerHTML = `
      <span>${p.name}</span>
      <span class="status-pill status-${p.status}">${p.status}</span>
    `;
    container.appendChild(div);
  });
}

/* ── UTILITIES ────────────────────────────────── */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
