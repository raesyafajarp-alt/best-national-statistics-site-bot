// NusaData — program penyerahan entri (Node 22, pustaka standar saja).
//
// Situsnya ada di app/: file statis (index.html, CSS, modul ES) tanpa build
// step, tanpa permintaan jaringan. Program ini menyerahkan situs itu: menyalin
// app/ dan screenshots/ dari samping file ini ke /output, lalu menulis
// /output/dossier.json — ringkasan yang dibaca juri (tangkapan layar, berkas
// yang dimuat pertama kali beserta ukurannya, dan sumber situs) — dengan
// pustaka make.fun yang divendor di vendor/makefun-frontend.ts. Biarkan berkas
// vendor itu apa adanya: penilai mengharuskan dossier.json sama persis dengan
// yang ditulis salinannya sendiri.
//
// Di luar wadah penilai, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Jalankan dua kali: kedua keluaran harus identik byte demi byte.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas penilai (dari gate kit): hanya text_max_bytes yang membentuk byte
// dossier; sisanya menolak entri yang penilai akan tolak (lebih dari 4
// tangkapan layar atau satu di atas 256 KiB; lebih dari 993 berkas di app/
// atau 16 MiB berkas app seluruhnya).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
