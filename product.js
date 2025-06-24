/* ────────────────────────────────────────────────
   Dashboard – live Google-Sheet version
   Google-Sheet ID is hard-wired below
────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', init);

/* 🔗  Your published-sheet ID (from /d/e/…/pubhtml link) */
const SHEET = '2PACX-1vQEgjrqgRyjEakYi9IbAjv_RKdjkknaBmaacjgAuhONftAM740yJptl1_JLbJd8zxk_x6vy-18CP0IT';
const url   = tab => `https://opensheet.elk.sh/${SHEET}/${tab}`;

function init () {
  loadMetrics();        // Sheet1
  loadContributors();   // Contributors
  loadProjects();       // Projects
  loadCountry();        // Country chart
  loadAssets();         // Asset bars
  loadFinance();        // Line chart
  renderEvidenceDocs(); // static
}

/* ── 1. METRICS + KPIs ─────────────────────────── */
async function loadMetrics () {
  const rows = await fetch(url('Sheet1')).then(r => r.json());
  const get  = k => (rows.find(r => r.metric === k) || {}).value || 0;

  /* Total funding */
  document.getElementById('total-amount').textContent =
    `$${Number(get('total_funding')).toLocaleString('en')}.00`;

  /* KPI block */
  document.getElementById('kpi-metrics').innerHTML = `
    <div><strong>$${Number(get('avg_funding_per')).toLocaleString('en')}</strong><br><span>Avg. Funding / Project</span></div>
    <div><strong>${get('active_projects')}</strong><br><span>Active Projects</span></div>
    <div><strong>${get('avg_roi')}%</strong><br><span>Avg. ROI</span></div>
  `;
}

/* ── 2. CONTRIBUTORS TABLE ────────────────────── */
async function loadContributors () {
  const rows = await fetch(url('Contributors')).then(r => r.json());
  const body = document.querySelector('#contributors tbody');
  body.innerHTML = '';
  rows.forEach(r => body.insertAdjacentHTML(
    'beforeend',
    `<tr><td>${r.name}</td><td>$${Number(r.amount).toLocaleString('en')}</td></tr>`
  ));
}

/* ── 3. PROJECT LIST ──────────────────────────── */
async function loadProjects () {
  const rows = await fetch(url('Projects')).then(r => r.json());
  const box  = document.getElementById('project-list');
  box.innerHTML = '';
  rows.forEach(p => box.insertAdjacentHTML(
    'beforeend',
    `<div class="project">
       <span>${p.name}</span>
       <span class="status-pill status-${p.status}">${p.status}</span>
     </div>`
  ));
}

/* ── 4. COUNTRY DONUT CHART ───────────────────── */
async function loadCountry () {
  const rows = await fetch(url('Country')).then(r => r.json());
  new Chart(document.getElementById('country-chart'), {
    type: 'doughnut',
    data: {
      labels: rows.map(r => r.country),
      datasets: [{ data: rows.map(r => +r.value),
        backgroundColor: ['#6366f1','#4f46e5','#34d399','#fbbf24','#9ca3af',
                          '#60a5fa','#f472b6','#a78bfa'].slice(0, rows.length) }]
    },
    options: { plugins:{legend:{position:'bottom'}}, cutout:'65%' }
  });
}

/* ── 5. ASSET-TYPE BREAKDOWN ─────────────────── */
async function loadAssets () {
  const rows = await fetch(url('Assets')).then(r => r.json());
  const box  = document.getElementById('asset-types');
  box.innerHTML = '';
  rows.forEach(r => box.insertAdjacentHTML(
    'beforeend',
    `<div style="display:flex;justify-content:space-between;font-size:.875rem">
       <span>${r.label}</span><span>${r.share}%</span>
     </div>
     <div class="progress-bar"><span style="width:${r.share}%"></span></div>`
  ));
}

/* ── 6. FINANCIAL LINE CHART ──────────────────── */
async function loadFinance () {
  const rows = await fetch(url('Finance')).then(r => r.json());
  const ctx  = document.getElementById('finance-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels: rows.map(r => r.month),
            datasets:[{ data: rows.map(r => +r.value),
                        label:'Funding ($k)', tension:.35, fill:true,
                        borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,.15)'}] },
    options:{plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false}
  });
}

/* ── 7. STATIC EVIDENCE DOCUMENTS ─────────────── */
function renderEvidenceDocs () {
  const docs = ['Impact-Report-Q1.pdf','External-Audit.xlsx','Photo-Proof.zip'];
  const ul   = document.getElementById('doc-list');
  ul.innerHTML = docs.map(d => `<li>${d}</li>`).join('');
}
