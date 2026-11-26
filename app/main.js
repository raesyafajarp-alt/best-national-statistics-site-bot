// NusaData — perute dan pengendali situs.
//
//   #/            beranda
//   #/populasi    penduduk dan provinsi
//   #/ekonomi     PDB, sektor, perdagangan
//   #/kerja       angkatan kerja dan pengangguran
//   #/harga       inflasi
//   #/sosial      kemiskinan dan pembangunan manusia
//   #/data        semua indikator + unduh CSV
//   #/tentang     sumber dan cara membaca
//
// window.__shotReady bernilai false selama halaman dirender dan true begitu
// halaman tampil, supaya skrip tangkapan layar tahu kapan memotret.

import { INDICATORS, SERIES, YEARS } from './data.js';
import {
  dataPage,
  ekonomi,
  harga,
  home,
  kerja,
  missing,
  populasi,
  sosial,
  tentang,
} from './views.js';

const app = document.getElementById('app');

// Keadaan kontrol, dipertahankan selama pengunjung berpindah halaman.
const state = {
  range: 'all',
  chartType: 'line',
  gdpUnit: 'adhb',
  pyramidUnit: 'pct',
  sortKey: 'pop',
  sortDir: 'desc',
  query: '',
  compareA: 'Jawa Barat',
  compareB: 'DKI Jakarta',
};

const ROUTES = {
  '/': home,
  '/populasi': populasi,
  '/ekonomi': ekonomi,
  '/kerja': kerja,
  '/harga': harga,
  '/sosial': sosial,
  '/data': dataPage,
  '/tentang': tentang,
};

const TITLES = {
  '/': 'NusaData — Portal Statistik Nasional Indonesia',
  '/populasi': 'Penduduk | NusaData',
  '/ekonomi': 'Ekonomi | NusaData',
  '/kerja': 'Ketenagakerjaan | NusaData',
  '/harga': 'Harga dan Inflasi | NusaData',
  '/sosial': 'Kesejahteraan Sosial | NusaData',
  '/data': 'Semua Indikator | NusaData',
  '/tentang': 'Tentang | NusaData',
};

function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  return ROUTES[path] ? path : null;
}

function render() {
  window.__shotReady = false;
  const path = route();
  const view = path ? ROUTES[path] : missing;
  document.title = TITLES[path] || 'Tidak ditemukan | NusaData';
  app.innerHTML = view(state);
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('current', a.getAttribute('href') === `#${path || '/'}`);
  });
  wireCompareSelects();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireCompareSelects() {
  const a = document.getElementById('cmp-a');
  const b = document.getElementById('cmp-b');
  if (a) {
    a.value = state.compareA;
    b.value = state.compareB;
  }
}

// Semua kontrol halaman ditangani lewat satu pendengar di #app, jadi tombol
// yang dirender ulang tetap berfungsi.
app.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;
  if (btn.dataset.yearRange) {
    state.range = btn.dataset.yearRange;
    render();
  } else if (btn.dataset.chartType) {
    state.chartType = btn.dataset.chartType;
    render();
  } else if (btn.dataset.gdpUnit) {
    state.gdpUnit = btn.dataset.gdpUnit;
    render();
  } else if (btn.dataset.pyramidUnit) {
    state.pyramidUnit = btn.dataset.pyramidUnit;
    render();
  } else if (btn.dataset.sort) {
    const key = btn.dataset.sort;
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = key;
      state.sortDir = key === 'name' ? 'asc' : 'desc';
    }
    render();
  } else if (btn.id === 'download-csv') {
    downloadCsv();
  }
});

// Pencarian provinsi: saring tabel sambil mengetik, tanpa memuat ulang.
app.addEventListener('input', (event) => {
  if (event.target.id === 'prov-search') {
    state.query = event.target.value;
    const pos = event.target.selectionStart;
    render();
    const again = document.getElementById('prov-search');
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  }
});

// Perbandingan provinsi: pilihan baru langsung merender ulang perbandingan.
app.addEventListener('change', (event) => {
  if (event.target.id === 'cmp-a') {
    state.compareA = event.target.value;
    render();
  } else if (event.target.id === 'cmp-b') {
    state.compareB = event.target.value;
    render();
  }
});

function downloadCsv() {
  const lines = ['indikator,nilai,satuan,tahun'];
  for (const i of INDICATORS) {
    lines.push(`"${i.label}",${String(i.value).replace('.', ',')},"${i.unit}",${i.year}`);
  }
  lines.push('');
  lines.push('deret,' + YEARS.join(','));
  for (const s of Object.values(SERIES)) {
    lines.push(`"${s.label}",${s.values.map((v) => String(v).replace('.', ',')).join(',')}`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nusadata-indikator.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  const status = document.getElementById('csv-status');
  if (status) status.textContent = 'CSV diunduh: nusadata-indikator.csv';
}

window.addEventListener('hashchange', render);
render();
