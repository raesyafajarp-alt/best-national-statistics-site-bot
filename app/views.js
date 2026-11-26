// NusaData — halaman-halaman situs, dibangun dari data.js.
// Setiap halaman bisa dicapai lewat tautan di navigasi. Setiap kontrol di
// halaman melakukan apa yang tertulis: filter tahun, jenis grafik, pengurutan
// tabel, pencarian, perbandingan provinsi, dan unduh CSV.

import {
  AGE_GROUPS,
  INDICATORS,
  INFLATION_MONTHLY_2024,
  INFLATION_PARTS,
  LABOR_2024,
  META,
  PROVINCES,
  RELEASES,
  SECTORS,
  SERIES,
  SOCIAL_2024,
  YEARS,
  density,
  formatId,
} from './data.js';
import { barChart, donutChart, lineChart, pyramidChart } from './charts.js';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const TEAL = '#0e7c6b';
const SAND = '#c98a2e';
const RUST = '#b3402a';
const SLATE = '#3d6b7a';
const PALETTE = ['#0e7c6b', '#c98a2e', '#3d6b7a', '#b3402a', '#7a5ea8', '#5b8c3e', '#a8623a', '#4a7fb5', '#8a6d3b', '#6b7c8a'];

function sliceYears(values, range) {
  if (range === 'recent') return { labels: YEARS.slice(2), values: values.slice(2) };
  return { labels: YEARS, values };
}

function yearRangeButtons(range) {
  return `<div class="controls" role="group" aria-label="Rentang tahun">
    <span class="controls-label">Tahun:</span>
    <button type="button" data-year-range="all" class="${range === 'all' ? 'active' : ''}">2019–2024</button>
    <button type="button" data-year-range="recent" class="${range === 'recent' ? 'active' : ''}">2021–2024</button>
  </div>`;
}

function kpiCard(ind) {
  return `<a class="kpi" href="${ind.route}">
    <span class="kpi-label">${esc(ind.label)}</span>
    <span class="kpi-value">${formatId(ind.value)} <small>${esc(ind.unit)}</small></span>
    <span class="kpi-change">${esc(ind.change)} ${esc(ind.changeNote)}</span>
    <span class="kpi-note">${esc(ind.note)} · ${ind.year}</span>
  </a>`;
}

function sourceNote(text) {
  return `<p class="source">Sumber: ${esc(META.source)}. ${esc(text)}</p>`;
}

function sectionHead(title, intro) {
  return `<h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p>`;
}

export function home(state) {
  const gdp = sliceYears(SERIES.tumbuh.values, state.range);
  const pop = sliceYears(SERIES.penduduk.values, state.range);
  const gdpChart =
    state.chartType === 'bar'
      ? barChart({ labels: gdp.labels, values: gdp.values, color: TEAL, unit: '%' })
      : lineChart({
          labels: gdp.labels,
          series: [{ name: 'Pertumbuhan ekonomi', values: gdp.values, color: TEAL }],
          unit: '%',
        });
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const rows = top
    .map(
      (p, i) =>
        `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td class="num">${formatId(p.pop)}</td><td class="num">${density(p).toLocaleString('id-ID')}</td></tr>`,
    )
    .join('');
  return `
  <section class="hero">
    <p class="eyebrow">Portal Statistik Nasional · Indonesia</p>
    <h1>Angka Indonesia, dalam satu tempat.</h1>
    <p class="lede">Penduduk, ekonomi, pekerjaan, harga, dan kesejahteraan — dikutip dari publikasi ${esc(META.source)}, diperbarui ${esc(META.updated)}.</p>
    <p class="hero-links"><a class="btn" href="#/populasi">Lihat penduduk</a> <a class="btn ghost" href="#/data">Semua indikator</a></p>
  </section>
  <section>
    <h2>Indikator utama ${META.latestYear}</h2>
    <div class="kpi-grid">${INDICATORS.map(kpiCard).join('')}</div>
  </section>
  <section>
    <div class="section-head"><h2>Pertumbuhan ekonomi, ${gdp.labels[0]}–${gdp.labels[gdp.labels.length - 1]}</h2>
    <div class="controls" role="group" aria-label="Jenis grafik">
      <button type="button" data-chart-type="line" class="${state.chartType === 'line' ? 'active' : ''}">Garis</button>
      <button type="button" data-chart-type="bar" class="${state.chartType === 'bar' ? 'active' : ''}">Batang</button>
    </div></div>
    ${yearRangeButtons(state.range)}
    ${gdpChart}
    <p class="chart-note">${esc(SERIES.tumbuh.note)} Ekonomi sempat minus 2,07% pada 2020, lalu pulih di atas 5% sejak 2022.</p>
  </section>
  <section>
    <h2>Penduduk ${pop.labels[0]}–${pop.labels[pop.labels.length - 1]}</h2>
    ${barChart({ labels: pop.labels, values: pop.values, color: SLATE, unit: 'juta jiwa' })}
    <p class="chart-note">${esc(SERIES.penduduk.note)}</p>
  </section>
  <section>
    <h2>Provinsi terpadat, 2024</h2>
    <table class="table"><thead><tr><th>#</th><th>Provinsi</th><th class="num">Penduduk (juta)</th><th class="num">Kepadatan (jiwa/km²)</th></tr></thead><tbody>${rows}</tbody></table>
    <p><a href="#/populasi">Lihat semua provinsi &rarr;</a></p>
  </section>
  <section>
    <h2>Rilis yang dipakai</h2>
    <ul class="releases">${RELEASES.slice(0, 4).map((r) => `<li><b>${esc(r.title)}</b><span>${esc(r.period)} — ${esc(r.note)}</span></li>`).join('')}</ul>
    <p><a href="#/tentang">Tentang sumber data &rarr;</a></p>
  </section>`;
}

export function populasi(state) {
  const pop = sliceYears(SERIES.penduduk.values, state.range);
  const sorted = [...PROVINCES].sort((a, b) => {
    const k = state.sortKey;
    const dir = state.sortDir === 'asc' ? 1 : -1;
    if (k === 'name') return a.name.localeCompare(b.name, 'id') * dir;
    if (k === 'area') return (a.area - b.area) * dir;
    if (k === 'density') return (density(a) - density(b)) * dir;
    return (a.pop - b.pop) * dir;
  });
  const q = state.query.trim().toLowerCase();
  const filtered = q ? sorted.filter((p) => p.name.toLowerCase().includes(q)) : sorted;
  const arrow = (k) => (state.sortKey === k ? (state.sortDir === 'asc' ? ' ▲' : ' ▼') : '');
  const rows = filtered
    .map(
      (p) =>
        `<tr><td>${esc(p.name)}</td><td class="num">${formatId(p.pop)}</td><td class="num">${p.area.toLocaleString('id-ID')}</td><td class="num">${density(p).toLocaleString('id-ID')}</td></tr>`,
    )
    .join('');
  const a = PROVINCES.find((p) => p.name === state.compareA);
  const b = PROVINCES.find((p) => p.name === state.compareB);
  const opts = PROVINCES.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('');
  const cmp = (p, other) =>
    p
      ? `<div class="compare-card"><h3>${esc(p.name)}</h3><p><b>${formatId(p.pop)} juta</b> penduduk</p><p><b>${density(p).toLocaleString('id-ID')}</b> jiwa/km²</p><p>${p.pop > other.pop ? 'Lebih padat penduduk' : 'Lebih sedikit penduduk'} daripada ${esc(other.name)}</p></div>`
      : '';
  return `
  ${sectionHead('Penduduk Indonesia', 'Sebanyak 281,6 juta jiwa pada pertengahan 2024. Lebih dari separuh tinggal di Pulau Jawa, dan DKI Jakarta adalah provinsi terpadat.')}
  ${yearRangeButtons(state.range)}
  ${lineChart({ labels: pop.labels, series: [{ name: 'Jumlah penduduk', values: pop.values, color: TEAL }], unit: 'juta jiwa' })}
  <p class="chart-note">${esc(SERIES.penduduk.note)}</p>
  <section>
    <h2>Struktur umur, 2024</h2>
    <div class="controls" role="group" aria-label="Satuan piramida">
      <button type="button" data-pyramid-unit="pct" class="${state.pyramidUnit === 'pct' ? 'active' : ''}">Persen (%)</button>
      <button type="button" data-pyramid-unit="jt" class="${state.pyramidUnit === 'jt' ? 'active' : ''}">Juta jiwa</button>
    </div>
    ${pyramidChart({
      groups:
        state.pyramidUnit === 'jt'
          ? AGE_GROUPS.map((g) => ({ ...g, share: Math.round(g.share * 2.816 * 10) / 10 }))
          : AGE_GROUPS,
      unit: state.pyramidUnit === 'jt' ? 'juta jiwa' : '%',
    })}
    <p class="chart-note">Penduduk usia produktif (15–64 tahun) sekitar 69% dari total. Kelompok 10–14 tahun adalah yang terbesar, 8,7%.</p>
  </section>
  <section>
    <h2>Provinsi, 2024</h2>
    <div class="controls">
      <label class="search">Cari provinsi: <input type="search" id="prov-search" value="${esc(state.query)}" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>
    </div>
    <div class="table-scroll"><table class="table">
      <thead><tr>
        <th><button type="button" data-sort="name">Provinsi${arrow('name')}</button></th>
        <th class="num"><button type="button" data-sort="pop">Penduduk (juta)${arrow('pop')}</button></th>
        <th class="num"><button type="button" data-sort="area">Luas (km²)${arrow('area')}</button></th>
        <th class="num"><button type="button" data-sort="density">Kepadatan (jiwa/km²)${arrow('density')}</button></th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="4">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>'}</tbody>
    </table></div>
    <p class="chart-note">Klik judul kolom untuk mengurutkan. Kepadatan dihitung dari penduduk dibagi luas wilayah.</p>
    ${sourceNote('Proyeksi penduduk pertengahan 2024; luas wilayah menurut publikasi BPS.')}
  </section>
  <section>
    <h2>Bandingkan dua provinsi</h2>
    <div class="controls">
      <label>Provinsi pertama: <select id="cmp-a">${opts}</select></label>
      <label>Provinsi kedua: <select id="cmp-b">${opts}</select></label>
    </div>
    <div class="compare-grid">${cmp(a, b)}${cmp(b, a)}</div>
  </section>`;
}

export function ekonomi(state) {
  const gdp = sliceYears(SERIES.pdbAdhb.values, state.range);
  const perKapita = sliceYears(SERIES.pdbPerKapita.values, state.range);
  const usePerKapita = state.gdpUnit === 'perkapita';
  const shown = usePerKapita ? perKapita : gdp;
  const series = usePerKapita ? SERIES.pdbPerKapita : SERIES.pdbAdhb;
  const tumbuh = sliceYears(SERIES.tumbuh.values, state.range);
  const trade = sliceYears(SERIES.ekspor.values, state.range);
  const tradeImp = sliceYears(SERIES.impor.values, state.range);
  const surplus = trade.values.map((v, i) => Math.round((v - tradeImp.values[i]) * 100) / 100);
  return `
  ${sectionHead('Ekonomi Indonesia', 'PDB 2024 mencapai Rp22.138,9 triliun dan tumbuh 5,03%. Industri pengolahan adalah lapangan usaha terbesar, diikuti perdagangan dan pertanian.')}
  <div class="kpi-grid">
    <div class="kpi static"><span class="kpi-label">PDB 2024 (ADHB)</span><span class="kpi-value">Rp22.138,9 <small>triliun</small></span><span class="kpi-note">Tumbuh 5,03% (y-on-y)</span></div>
    <div class="kpi static"><span class="kpi-label">PDB per kapita 2024</span><span class="kpi-value">Rp78,6 <small>juta</small></span><span class="kpi-note">Dari Rp75,0 juta pada 2023</span></div>
    <div class="kpi static"><span class="kpi-label">Surplus perdagangan 2024</span><span class="kpi-value">US$31,04 <small>miliar</small></span><span class="kpi-note">Ekspor US$264,70 M; impor US$233,66 M</span></div>
  </div>
  <section>
    <div class="section-head"><h2>${esc(series.label)}, ${shown.labels[0]}–${shown.labels[shown.labels.length - 1]}</h2>
    <div class="controls" role="group" aria-label="Satuan PDB">
      <button type="button" data-gdp-unit="adhb" class="${!usePerKapita ? 'active' : ''}">Rp triliun</button>
      <button type="button" data-gdp-unit="perkapita" class="${usePerKapita ? 'active' : ''}">Per kapita</button>
    </div></div>
    ${yearRangeButtons(state.range)}
    ${barChart({ labels: shown.labels, values: shown.values, color: TEAL, unit: series.unit })}
    <p class="chart-note">${esc(series.note)}</p>
  </section>
  <section>
    <h2>Pertumbuhan ekonomi, ${tumbuh.labels[0]}–${tumbuh.labels[tumbuh.labels.length - 1]} (%)</h2>
    ${lineChart({ labels: tumbuh.labels, series: [{ name: 'Pertumbuhan', values: tumbuh.values, color: RUST }], unit: '%' })}
    <p class="chart-note">${esc(SERIES.tumbuh.note)}</p>
  </section>
  <section>
    <h2>Struktur PDB menurut lapangan usaha, 2024</h2>
    ${donutChart({ parts: SECTORS, colors: PALETTE })}
    <p class="chart-note">Pangsa dalam persen terhadap PDB harga berlaku. Tiga lapangan usaha terbesar — industri, perdagangan, pertanian — mencakup 44,21% PDB.</p>
  </section>
  <section>
    <h2>Perdagangan luar negeri, ${trade.labels[0]}–${trade.labels[trade.labels.length - 1]} (US$ miliar)</h2>
    ${lineChart({
      labels: trade.labels,
      series: [
        { name: 'Ekspor', values: trade.values, color: TEAL },
        { name: 'Impor', values: tradeImp.values, color: SAND },
      ],
      unit: 'US$ M',
    })}
    <table class="table"><thead><tr><th>Tahun</th><th class="num">Ekspor</th><th class="num">Impor</th><th class="num">Surplus</th></tr></thead><tbody>
    ${trade.labels.map((y, i) => `<tr><td>${y}</td><td class="num">${formatId(trade.values[i])}</td><td class="num">${formatId(tradeImp.values[i])}</td><td class="num">${formatId(surplus[i])}</td></tr>`).join('')}
    </tbody></table>
    ${sourceNote('Nilai ekspor dan impor barang menurut publikasi BPS.')}
  </section>`;
}

export function kerja(state) {
  const feb = sliceYears(SERIES.tptFeb.values, state.range);
  const agu = sliceYears(SERIES.tptAgu.values, state.range);
  return `
  ${sectionHead('Ketenagakerjaan', 'Pada Agustus 2024 ada 152,14 juta penduduk dalam angkatan kerja; 144,64 juta bekerja dan 7,47 juta menganggur. Tingkat pengangguran terbuka 4,91%.')}
  <div class="kpi-grid">
    <div class="kpi static"><span class="kpi-label">Angkatan kerja</span><span class="kpi-value">152,14 <small>juta</small></span><span class="kpi-note">TPAK 69,03% · Agustus 2024</span></div>
    <div class="kpi static"><span class="kpi-label">Penduduk bekerja</span><span class="kpi-value">144,64 <small>juta</small></span><span class="kpi-note">Dari 220,40 juta penduduk usia kerja</span></div>
    <div class="kpi static"><span class="kpi-label">Penganggur</span><span class="kpi-value">7,47 <small>juta</small></span><span class="kpi-note">TPT 4,91% · Agustus 2024</span></div>
    <div class="kpi static"><span class="kpi-label">Pekerja informal</span><span class="kpi-value">59,23 <small>%</small></span><span class="kpi-note">85,67 juta dari yang bekerja</span></div>
  </div>
  <section>
    <h2>Tingkat pengangguran terbuka, ${feb.labels[0]}–${feb.labels[feb.labels.length - 1]} (%)</h2>
    ${yearRangeButtons(state.range)}
    ${lineChart({
      labels: feb.labels,
      series: [
        { name: 'Februari', values: feb.values, color: TEAL },
        { name: 'Agustus', values: agu.values, color: RUST },
      ],
      unit: '%',
    })}
    <p class="chart-note">Dua pengukuran setiap tahun (Sakernas). Pengangguran melonjak pada 2020–2021, lalu turun tiap tahun hingga 4,82% (Februari 2024) dan 4,91% (Agustus 2024).</p>
  </section>
  <section>
    <h2>Formal dan informal, Agustus 2024</h2>
    ${donutChart({
      parts: [
        { name: 'Pekerja informal', share: 59.23 },
        { name: 'Pekerja formal', share: 40.77 },
      ],
      colors: [SAND, TEAL],
    })}
    <p class="chart-note">${esc(LABOR_2024.note)}</p>
  </section>
  <section>
    <h2>Angka kunci Agustus 2024</h2>
    <table class="table"><thead><tr><th>Ukuran</th><th class="num">Nilai</th><th>Satuan</th></tr></thead><tbody>
      <tr><td>Penduduk usia kerja (15 tahun ke atas)</td><td class="num">220,40</td><td class="num">juta jiwa</td></tr>
      <tr><td>Angkatan kerja</td><td class="num">152,14</td><td class="num">juta jiwa</td></tr>
      <tr><td>Tingkat partisipasi angkatan kerja</td><td class="num">69,03</td><td class="num">%</td></tr>
      <tr><td>Penduduk bekerja</td><td class="num">144,64</td><td class="num">juta jiwa</td></tr>
      <tr><td>Pekerja formal</td><td class="num">58,97</td><td class="num">juta jiwa</td></tr>
      <tr><td>Pekerja informal</td><td class="num">85,67</td><td class="num">juta jiwa</td></tr>
      <tr><td>Penganggur</td><td class="num">7,47</td><td class="num">juta jiwa</td></tr>
    </tbody></table>
    ${sourceNote('Survei Angkatan Kerja Nasional (Sakernas) Agustus 2024.')}
  </section>`;
}

export function harga(state) {
  const tahunan = sliceYears(SERIES.inflasi.values, state.range);
  const months = INFLATION_MONTHLY_2024.map((m) => m.month);
  const mvals = INFLATION_MONTHLY_2024.map((m) => m.value);
  return `
  ${sectionHead('Harga dan inflasi', 'Inflasi Desember 2024 sebesar 1,57% (y-on-y), turun dari 2,61% setahun sebelumnya. Inflasi sempat 5,51% pada 2022, lalu melandai.')}
  <div class="kpi-grid">
    <div class="kpi static"><span class="kpi-label">Inflasi Desember 2024</span><span class="kpi-value">1,57 <small>% (y-on-y)</small></span><span class="kpi-note">Dari 2,61% pada Desember 2023</span></div>
    <div class="kpi static"><span class="kpi-label">Inflasi inti</span><span class="kpi-value">2,26 <small>%</small></span><span class="kpi-note">Desember 2024 (y-on-y)</span></div>
    <div class="kpi static"><span class="kpi-label">Inflasi tertinggi 2024</span><span class="kpi-value">3,05 <small>%</small></span><span class="kpi-note">Maret 2024 (y-on-y)</span></div>
  </div>
  <section>
    <h2>Inflasi tahunan, ${tahunan.labels[0]}–${tahunan.labels[tahunan.labels.length - 1]} (%)</h2>
    ${yearRangeButtons(state.range)}
    ${barChart({ labels: tahunan.labels, values: tahunan.values, color: RUST, unit: '%' })}
    <p class="chart-note">${esc(SERIES.inflasi.note)}</p>
  </section>
  <section>
    <h2>Inflasi bulanan 2024 (y-on-y, %)</h2>
    ${lineChart({ labels: months, series: [{ name: 'Inflasi bulanan', values: mvals, color: TEAL }], unit: '%' })}
    <p class="chart-note">Inflasi memuncak pada Maret (3,05%), lalu turun perlahan sampai 1,55% pada November dan 1,57% pada Desember.</p>
  </section>
  <section>
    <h2>Komponen inflasi, Desember 2024</h2>
    <table class="table"><thead><tr><th>Komponen</th><th class="num">Inflasi (y-on-y, %)</th><th>Arti</th></tr></thead><tbody>
    ${INFLATION_PARTS.map((p) => `<tr><td>${esc(p.name)}</td><td class="num">${formatId(p.value)}</td><td>${esc(p.note)}</td></tr>`).join('')}
    </tbody></table>
    ${sourceNote('Indeks Harga Konsumen, Berita Resmi Statistik BPS.')}
  </section>`;
}

export function sosial(state) {
  const mar = sliceYears(SERIES.kemiskinanMar.values, state.range);
  const sep = sliceYears(SERIES.kemiskinanSep.values, state.range);
  const ipm = sliceYears(SERIES.ipm.values, state.range);
  return `
  ${sectionHead('Kesejahteraan sosial', 'Penduduk miskin 9,03% pada Maret 2024 (25,22 juta jiwa). Indeks Pembangunan Manusia 75,02 — berstatus tinggi — dengan usia harapan hidup 74,12 tahun.')}
  <div class="kpi-grid">
    <div class="kpi static"><span class="kpi-label">Indeks Pembangunan Manusia</span><span class="kpi-value">75,02 <small>poin</small></span><span class="kpi-note">Status tinggi · 2024</span></div>
    <div class="kpi static"><span class="kpi-label">Usia harapan hidup</span><span class="kpi-value">74,12 <small>tahun</small></span><span class="kpi-note">Dari 73,93 tahun pada 2023</span></div>
    <div class="kpi static"><span class="kpi-label">Rata-rata lama sekolah</span><span class="kpi-value">9,03 <small>tahun</small></span><span class="kpi-note">Harapan lama sekolah 13,21 tahun</span></div>
    <div class="kpi static"><span class="kpi-label">Garis kemiskinan</span><span class="kpi-value">Rp582.932 <small>/kapita/bulan</small></span><span class="kpi-note">Maret 2024</span></div>
  </div>
  <section>
    <h2>Penduduk miskin, ${mar.labels[0]}–${mar.labels[mar.labels.length - 1]} (%)</h2>
    ${yearRangeButtons(state.range)}
    ${lineChart({
      labels: mar.labels,
      series: [
        { name: 'Maret', values: mar.values, color: RUST },
        { name: 'September', values: sep.values, color: SAND },
      ],
      unit: '%',
    })}
    <p class="chart-note">Kemiskinan naik pada 2020–2021, lalu turun tiap tahun. September 2024: 8,57% atau 24,06 juta jiwa; garis kemiskinan Rp595.242 per kapita per bulan.</p>
  </section>
  <section>
    <h2>Indeks Pembangunan Manusia, ${ipm.labels[0]}–${ipm.labels[ipm.labels.length - 1]}</h2>
    ${barChart({ labels: ipm.labels, values: ipm.values, color: TEAL, unit: 'poin' })}
    <p class="chart-note">${esc(SERIES.ipm.note)} IPM menggabungkan kesehatan, pendidikan, dan standar hidup layak.</p>
  </section>
  <section>
    <h2>Komponen IPM 2024</h2>
    <table class="table"><thead><tr><th>Komponen</th><th class="num">Nilai</th><th>Satuan</th></tr></thead><tbody>
      <tr><td>Usia harapan hidup saat lahir</td><td class="num">74,12</td><td class="num">tahun</td></tr>
      <tr><td>Harapan lama sekolah</td><td class="num">13,21</td><td class="num">tahun</td></tr>
      <tr><td>Rata-rata lama sekolah</td><td class="num">9,03</td><td class="num">tahun</td></tr>
      <tr><td>Pengeluaran per kapita disesuaikan</td><td class="num">12.341</td><td class="num">ribu rupiah/tahun</td></tr>
    </tbody></table>
    <p class="chart-note">Pengeluaran per kapita disesuaikan 2024: Rp12.341 ribu per tahun (angka BPS).</p>
    ${sourceNote('Indeks Pembangunan Manusia 2024, BPS.')}
  </section>`;
}

export function dataPage() {
  const rows = INDICATORS.map(
    (i) =>
      `<tr><td>${esc(i.label)}</td><td class="num">${formatId(i.value)}</td><td>${esc(i.unit)}</td><td class="num">${i.year}</td></tr>`,
  ).join('');
  const seriesRows = Object.entries(SERIES)
    .map(
      ([key, s]) =>
        `<tr><td>${esc(s.label)}</td><td class="num">${s.values.map((v) => formatId(v)).join(' · ')}</td><td>${esc(s.unit)}</td></tr>`,
    )
    .join('');
  return `
  ${sectionHead('Semua indikator', 'Seluruh angka yang dipakai situs ini, dalam satu tabel. Unduh sebagai CSV untuk dipakai sendiri.')}
  <p><button type="button" class="btn" id="download-csv">Unduh CSV</button> <span id="csv-status" role="status"></span></p>
  <section>
    <h2>Indikator utama, 2024</h2>
    <div class="table-scroll"><table class="table"><thead><tr><th>Indikator</th><th class="num">Nilai</th><th>Satuan</th><th class="num">Tahun</th></tr></thead><tbody>${rows}</tbody></table></div>
  </section>
  <section>
    <h2>Deret tahunan, 2019–2024</h2>
    <div class="table-scroll"><table class="table"><thead><tr><th>Deret</th><th class="num">2019 · 2020 · 2021 · 2022 · 2023 · 2024</th><th>Satuan</th></tr></thead><tbody>${seriesRows}</tbody></table></div>
    ${sourceNote(META.sourceNote)}
  </section>`;
}

export function tentang() {
  return `
  ${sectionHead('Tentang NusaData', 'NusaData adalah portal statistik nasional Indonesia yang dibuat untuk kompetisi make.fun. Situs ini berjalan dari file statis, tanpa permintaan jaringan, dan bisa dibuka di desktop maupun ponsel.')}
  <section>
    <h2>Sumber data</h2>
    <p>Seluruh angka dikutip dari publikasi ${esc(META.source)}: Berita Resmi Statistik, Statistik Indonesia, Sakernas, dan proyeksi penduduk. Setiap halaman menuliskan sumbernya; halaman <a href="#/data">Semua indikator</a> mengumpulkan semuanya.</p>
    <h2>Cara membaca angka</h2>
    <ul>
      <li><b>y-on-y</b> berarti dibandingkan dengan periode yang sama tahun sebelumnya.</li>
      <li><b>PDB harga berlaku (ADHB)</b> memakai harga tahun berjalan; <b>pertumbuhan ekonomi</b> memakai harga konstan 2010.</li>
      <li><b>TPT</b> adalah tingkat pengangguran terbuka: penganggur dibagi angkatan kerja.</li>
      <li><b>Garis kemiskinan</b> adalah batas pengeluaran per kapita per bulan; di bawahnya, seseorang tergolong miskin.</li>
    </ul>
    <h2>Publikasi yang dipakai</h2>
    <ul class="releases">${RELEASES.map((r) => `<li><b>${esc(r.title)}</b><span>${esc(r.period)} — ${esc(r.note)}</span></li>`).join('')}</ul>
    <h2>Catatan</h2>
    <p>NusaData bukan situs resmi BPS dan tidak berafiliasi dengan BPS. Angka disajikan untuk keperluan informasi; rujukan resminya tetap publikasi BPS. Nama, desain, dan teks situs ini asli.</p>
  </section>`;
}

export function missing() {
  return `
  <h1>Halaman tidak ditemukan</h1>
  <p>Tidak ada halaman di alamat ini. <a href="#/">Kembali ke beranda</a>.</p>`;
}
