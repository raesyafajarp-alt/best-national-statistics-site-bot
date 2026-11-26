// NusaData — grafik SVG murni, digambar dari data.js tanpa pustaka apa pun.
// Setiap grafik memakai <title> supaya nilainya terbaca saat kursor di atasnya,
// dan label angka di samping titik/batang supaya terbaca di tangkapan layar.

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function niceTicks(min, max, count = 4) {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const step = (max - min) / count;
  const ticks = [];
  for (let i = 0; i <= count; i++) ticks.push(min + step * i);
  return ticks;
}

function fmt(v) {
  const abs = Math.abs(v);
  if (abs >= 1000) return v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  if (abs >= 100) return v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  return v.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

// Grafik garis dengan sumbu, garis grid, dan label nilai di tiap titik.
export function lineChart({ labels, series, height = 260, ymin, ymax, unit = '' }) {
  const w = 760;
  const h = height;
  const padL = 64;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const all = series.flatMap((s) => s.values);
  const lo = ymin ?? Math.min(0, ...all);
  const hi = ymax ?? Math.max(...all);
  const y = (v) => padT + ih - ((v - lo) / (hi - lo)) * ih;
  const x = (i) => padL + (i / (labels.length - 1)) * iw;
  const ticks = niceTicks(lo, hi);
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik garis" class="chart">`;
  for (const t of ticks) {
    svg += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" class="grid"/>`;
    svg += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" class="axis">${fmt(t)}</text>`;
  }
  for (let i = 0; i < labels.length; i++) {
    svg += `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" class="axis">${esc(labels[i])}</text>`;
  }
  for (const [si, s] of series.entries()) {
    const pts = s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    svg += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    s.values.forEach((v, i) => {
      svg += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="${s.color}"><title>${esc(s.name)} ${labels[i]}: ${fmt(v)} ${esc(unit)}</title></circle>`;
      // Seri pertama labelnya di atas titik, seri berikutnya di bawah titik,
      // supaya label dua seri yang berdekatan tidak bertabrakan. Dekat tepi,
      // sisi label dibalik supaya tidak menabrak label sumbu.
      let ly;
      if (si === 0) ly = y(v) < padT + 24 ? y(v) + 18 : y(v) - 10;
      else ly = y(v) > h - padB - 24 ? y(v) - 10 : y(v) + 18;
      svg += `<text x="${x(i)}" y="${ly}" text-anchor="middle" class="val">${fmt(v)}</text>`;
    });
  }
  svg += '</svg>';
  const legend = series
    .map((s) => `<span class="legend-item"><i style="background:${s.color}"></i>${esc(s.name)}</span>`)
    .join('');
  return `<div class="chart-wrap">${svg}<div class="legend">${legend}</div></div>`;
}

// Grafik batang tegak dengan label nilai di atas tiap batang.
export function barChart({ labels, values, color = '#0e7c6b', height = 260, unit = '' }) {
  const w = 760;
  const h = height;
  const padL = 64;
  const padR = 16;
  const padT = 26;
  const padB = 34;
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values);
  const y = (v) => padT + ih - ((v - lo) / (hi - lo)) * ih;
  const slot = iw / values.length;
  const bw = Math.min(56, slot * 0.62);
  const ticks = niceTicks(lo, hi);
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik batang" class="chart">`;
  for (const t of ticks) {
    svg += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" class="grid"/>`;
    svg += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" class="axis">${fmt(t)}</text>`;
  }
  svg += `<line x1="${padL}" y1="${y(0)}" x2="${w - padR}" y2="${y(0)}" class="zero"/>`;
  values.forEach((v, i) => {
    const bx = padL + slot * i + (slot - bw) / 2;
    const by = y(Math.max(0, v));
    const bh = Math.abs(y(v) - y(0));
    svg += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, bh).toFixed(1)}" fill="${color}" rx="3"><title>${esc(labels[i])}: ${fmt(v)} ${esc(unit)}</title></rect>`;
    svg += `<text x="${(bx + bw / 2).toFixed(1)}" y="${(by - 6).toFixed(1)}" text-anchor="middle" class="val">${fmt(v)}</text>`;
    svg += `<text x="${(padL + slot * i + slot / 2).toFixed(1)}" y="${h - 10}" text-anchor="middle" class="axis">${esc(labels[i])}</text>`;
  });
  svg += '</svg>';
  return `<div class="chart-wrap">${svg}</div>`;
}

// Donat pangsa dengan legenda bernilai.
export function donutChart({ parts, colors }) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 105;
  const inner = 62;
  const total = parts.reduce((a, p) => a + p.share, 0);
  let a0 = -Math.PI / 2;
  let paths = '';
  parts.forEach((p, i) => {
    const a1 = a0 + (p.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}"><title>${esc(p.name)}: ${fmt(p.share)}%</title></path>`;
    a0 = a1;
  });
  const legend = parts
    .map(
      (p, i) =>
        `<li><i style="background:${colors[i % colors.length]}"></i><span>${esc(p.name)}</span><b>${fmt(p.share)}%</b></li>`,
    )
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Diagram donat" class="donut">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-big">100%</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-small">PDB 2024</text></svg><ul class="donut-legend">${legend}</ul></div>`;
}

// Piramida penduduk: batang ke kiri dan ke kanan dari sumbu tengah.
// Karena data BPS tidak membedakan jenis kelamin di ringkasan ini, kedua sisi
// menampilkan pangsa yang sama dan diberi label "penduduk" — bentuk piramida
// tetap terbaca sebagai struktur umur.
export function pyramidChart({ groups, unit = '%' }) {
  const rowH = 22;
  const h = groups.length * rowH + 46;
  const w = 760;
  const mid = w / 2;
  const maxShare = Math.max(...groups.map((g) => g.share));
  const scale = (mid - 70) / maxShare;
  let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Piramida penduduk" class="chart">`;
  svg += `<text x="${mid}" y="18" text-anchor="middle" class="axis">Kelompok umur — pangsa penduduk 2024 (${esc(unit)})</text>`;
  groups.forEach((g, i) => {
    const y = 30 + i * rowH;
    const bw = g.share * scale;
    svg += `<rect x="${(mid - bw).toFixed(1)}" y="${y}" width="${bw.toFixed(1)}" height="16" fill="#0e7c6b"><title>Umur ${esc(g.group)}: ${fmt(g.share)}${esc(unit)}</title></rect>`;
    svg += `<rect x="${mid}" y="${y}" width="${bw.toFixed(1)}" height="16" fill="#3aa08f"><title>Umur ${esc(g.group)}: ${fmt(g.share)}${esc(unit)}</title></rect>`;
    svg += `<text x="${mid - bw - 6}" y="${y + 12}" text-anchor="end" class="val">${fmt(g.share)}</text>`;
    svg += `<text x="${mid + bw + 6}" y="${y + 12}" class="val">${fmt(g.share)}</text>`;
    svg += `<text x="${mid}" y="${y + 12}" text-anchor="middle" class="pyr-label">${esc(g.group)}</text>`;
  });
  svg += '</svg>';
  return `<div class="chart-wrap">${svg}<p class="chart-note">Batang kiri dan kanan sama besar: keduanya menunjukkan pangsa kelompok umur yang sama, supaya bentuk piramida terbaca.</p></div>`;
}
