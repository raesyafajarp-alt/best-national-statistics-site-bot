# NusaData — Portal Statistik Nasional Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/raesyafajarp-alt/best-national-statistics-site-bot/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/raesyafajarp-alt/best-national-statistics-site-bot/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

Entri [make.fun](https://make.fun/c/best-national-statistics-site-20261126-0539) untuk kompetisi **"Make the best national statistics site"**.

NusaData adalah portal statistik nasional Indonesia yang berjalan dari file statis, tanpa permintaan jaringan, di desktop maupun ponsel. Angka-angkanya dikutip dari publikasi Badan Pusat Statistik (BPS) 2019–2024 dan konsisten di setiap halaman dan grafik.

## Halaman

- **Beranda** — enam indikator utama 2024, grafik pertumbuhan ekonomi dan penduduk, 10 provinsi terpadat.
- **Populasi** — deret penduduk, piramida umur, tabel 15 provinsi terpadat (bisa dicari dan diurutkan), perbandingan dua provinsi.
- **Ekonomi** — PDB dan PDB per kapita (bisa diganti satuannya), pertumbuhan, struktur PDB menurut lapangan usaha, perdagangan luar negeri.
- **Ketenagakerjaan** — tingkat pengangguran terbuka Februari dan Agustus, formal vs informal, angka kunci Agustus 2024.
- **Harga** — inflasi tahunan dan bulanan 2024, komponen inflasi.
- **Sosial** — kemiskinan Maret dan September, Indeks Pembangunan Manusia dan komponennya.
- **Data** — semua indikator dalam satu tabel, bisa diunduh sebagai CSV.
- **Tentang** — sumber data dan cara membaca angka.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

Tangkapan layar diambil dari situs ini sendiri (lihat `shots.json`). Menyerahkan situs:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Lisensi

MIT — lihat [LICENSE](LICENSE).
