// NusaData — angka-angka situs ini.
//
// Semua angka berasal dari publikasi Badan Pusat Statistik (BPS) Indonesia
// dan dipakai apa adanya, dengan tahun dan satuan yang sama di setiap halaman
// dan grafik. Angka yang merupakan proyeksi ditandai sebagai proyeksi.
// Satuan: penduduk dalam juta jiwa, PDB dalam Rp triliun (ADHB), uang dalam
// rupiah, perdagangan dalam US$ miliar, lainnya dalam persen bila disebut.

export const META = {
  country: 'Indonesia',
  source: 'Badan Pusat Statistik (BPS)',
  sourceNote:
    'Angka di situs ini dikutip dari publikasi BPS: Berita Resmi Statistik, Statistik Indonesia, dan proyeksi penduduk.',
  updated: 'November 2026',
  latestYear: 2024,
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Indikator utama di beranda — semuanya tahun terbaru yang tersedia (2024).
export const INDICATORS = [
  {
    id: 'populasi',
    label: 'Penduduk',
    value: 281.6,
    unit: 'juta jiwa',
    year: 2024,
    change: '+1,05%',
    changeNote: 'dari 278,69 juta pada 2023',
    note: 'Proyeksi pertengahan tahun',
    route: '#/populasi',
  },
  {
    id: 'pdb',
    label: 'PDB harga berlaku',
    value: 22138.9,
    unit: 'Rp triliun',
    year: 2024,
    change: '+5,03%',
    changeNote: 'pertumbuhan ekonomi 2024 (y-on-y)',
    note: 'Atas dasar harga berlaku',
    route: '#/ekonomi',
  },
  {
    id: 'tumbuh',
    label: 'Pertumbuhan ekonomi',
    value: 5.03,
    unit: '% per tahun',
    year: 2024,
    change: '-0,02 poin',
    changeNote: 'dari 5,05% pada 2023',
    note: 'PDB harga konstan 2010',
    route: '#/ekonomi',
  },
  {
    id: 'inflasi',
    label: 'Inflasi',
    value: 1.57,
    unit: '% (y-on-y)',
    year: 2024,
    change: '-1,04 poin',
    changeNote: 'dari 2,61% pada Desember 2023',
    note: 'Desember 2024, year-on-year',
    route: '#/harga',
  },
  {
    id: 'tpt',
    label: 'Pengangguran terbuka',
    value: 4.91,
    unit: '%',
    year: 2024,
    change: '-0,41 poin',
    changeNote: 'dari 5,32% pada Agustus 2023',
    note: 'Agustus 2024',
    route: '#/kerja',
  },
  {
    id: 'miskin',
    label: 'Penduduk miskin',
    value: 9.03,
    unit: '%',
    year: 2024,
    change: '-0,33 poin',
    changeNote: 'dari 9,36% pada Maret 2023',
    note: 'Maret 2024',
    route: '#/sosial',
  },
];

// Deret tahunan 2019–2024. Setiap deret memakai tahun yang sama.
export const SERIES = {
  penduduk: {
    label: 'Jumlah penduduk',
    unit: 'juta jiwa',
    values: [266.91, 270.2, 272.25, 275.77, 278.69, 281.6],
    note: '2020 hasil Sensus Penduduk; tahun lain proyeksi pertengahan tahun.',
  },
  pdbAdhb: {
    label: 'PDB atas dasar harga berlaku',
    unit: 'Rp triliun',
    values: [15833.9, 15434.2, 16970.8, 19588.4, 20892.4, 22138.9],
    note: 'Nilai seluruh barang dan jasa yang dihasilkan dalam setahun.',
  },
  pdbPerKapita: {
    label: 'PDB per kapita',
    unit: 'Rp juta',
    values: [59.3, 56.9, 62.2, 71.0, 75.0, 78.6],
    note: 'PDB atas dasar harga berlaku dibagi jumlah penduduk.',
  },
  tumbuh: {
    label: 'Pertumbuhan ekonomi',
    unit: '%',
    values: [5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
    note: 'Pertumbuhan PDB harga konstan 2010 terhadap tahun sebelumnya.',
  },
  inflasi: {
    label: 'Inflasi Desember (y-on-y)',
    unit: '%',
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    note: 'Perubahan IHK Desember terhadap Desember tahun sebelumnya.',
  },
  kemiskinanMar: {
    label: 'Penduduk miskin, Maret',
    unit: '%',
    values: [9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
    note: 'Persentase penduduk dengan pengeluaran di bawah garis kemiskinan.',
  },
  kemiskinanSep: {
    label: 'Penduduk miskin, September',
    unit: '%',
    values: [9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
    note: 'Pengukuran September setiap tahun.',
  },
  tptFeb: {
    label: 'Pengangguran terbuka, Februari',
    unit: '%',
    values: [5.01, 4.94, 6.26, 5.83, 5.45, 4.82],
    note: 'Survei Angkatan Kerja Nasional (Sakernas) Februari.',
  },
  tptAgu: {
    label: 'Pengangguran terbuka, Agustus',
    unit: '%',
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    note: 'Survei Angkatan Kerja Nasional (Sakernas) Agustus.',
  },
  ekspor: {
    label: 'Nilai ekspor',
    unit: 'US$ miliar',
    values: [167.68, 163.19, 231.61, 291.9, 258.82, 264.7],
    note: 'Ekspor barang (migas dan nonmigas).',
  },
  impor: {
    label: 'Nilai impor',
    unit: 'US$ miliar',
    values: [171.28, 141.57, 196.19, 237.52, 221.89, 233.66],
    note: 'Impor barang (migas dan nonmigas).',
  },
  ipm: {
    label: 'Indeks Pembangunan Manusia',
    unit: 'poin',
    values: [71.92, 71.94, 72.29, 73.37, 74.39, 75.02],
    note: 'Skala 0–100; 2024 berstatus tinggi.',
  },
};

// Struktur ekonomi: pangsa PDB menurut lapangan usaha, 2024 (%).
export const SECTORS = [
  { name: 'Industri pengolahan', share: 18.67 },
  { name: 'Perdagangan besar dan eceran', share: 13.01 },
  { name: 'Pertanian, kehutanan, dan perikanan', share: 12.53 },
  { name: 'Konstruksi', share: 9.97 },
  { name: 'Pertambangan dan penggalian', share: 8.47 },
  { name: 'Transportasi dan pergudangan', share: 4.36 },
  { name: 'Informasi dan komunikasi', share: 4.08 },
  { name: 'Jasa keuangan dan asuransi', share: 4.06 },
  { name: 'Penyediaan akomodasi dan makan minum', share: 2.58 },
  { name: 'Lapangan usaha lainnya', share: 22.27 },
];

// Inflasi bulanan 2024 (y-on-y, %).
export const INFLATION_MONTHLY_2024 = [
  { month: 'Jan', value: 2.57 },
  { month: 'Feb', value: 2.75 },
  { month: 'Mar', value: 3.05 },
  { month: 'Apr', value: 3.0 },
  { month: 'Mei', value: 2.84 },
  { month: 'Jun', value: 2.51 },
  { month: 'Jul', value: 2.13 },
  { month: 'Agu', value: 2.12 },
  { month: 'Sep', value: 1.84 },
  { month: 'Okt', value: 1.71 },
  { month: 'Nov', value: 1.55 },
  { month: 'Des', value: 1.57 },
];

// Komponen inflasi, Desember 2024 (y-on-y, %).
export const INFLATION_PARTS = [
  { name: 'Inflasi inti', value: 2.26, note: 'Harga di luar yang diatur pemerintah dan yang bergejolak.' },
  { name: 'Harga diatur pemerintah', value: 0.54, note: 'Tarif dan harga yang ditetapkan pemerintah.' },
  { name: 'Harga bergejolak', value: 0.12, note: 'Bahan pangan yang harganya mudah berubah.' },
];

// Piramida penduduk 2024: pangsa tiap kelompok umur (% dari penduduk).
// Jumlahnya 100,0%.
export const AGE_GROUPS = [
  { group: '0–4', share: 8.2 },
  { group: '5–9', share: 8.6 },
  { group: '10–14', share: 8.7 },
  { group: '15–19', share: 8.5 },
  { group: '20–24', share: 8.4 },
  { group: '25–29', share: 8.2 },
  { group: '30–34', share: 7.8 },
  { group: '35–39', share: 7.5 },
  { group: '40–44', share: 7.0 },
  { group: '45–49', share: 6.4 },
  { group: '50–54', share: 5.6 },
  { group: '55–59', share: 4.8 },
  { group: '60–64', share: 3.9 },
  { group: '65–69', share: 2.8 },
  { group: '70–74', share: 1.8 },
  { group: '75+', share: 1.8 },
];

// 15 provinsi terpadat, proyeksi pertengahan 2024 (juta jiwa) dan luas (km²).
export const PROVINCES = [
  { name: 'Jawa Barat', pop: 49.94, area: 35378 },
  { name: 'Jawa Timur', pop: 41.81, area: 47803 },
  { name: 'Jawa Tengah', pop: 37.89, area: 32801 },
  { name: 'Sumatera Utara', pop: 15.59, area: 72981 },
  { name: 'Banten', pop: 12.43, area: 9663 },
  { name: 'DKI Jakarta', pop: 10.56, area: 664 },
  { name: 'Sulawesi Selatan', pop: 9.46, area: 46717 },
  { name: 'Lampung', pop: 9.22, area: 34624 },
  { name: 'Sumatera Selatan', pop: 9.05, area: 91592 },
  { name: 'Riau', pop: 6.64, area: 87024 },
  { name: 'Sumatera Barat', pop: 5.86, area: 42013 },
  { name: 'Kalimantan Barat', pop: 5.8, area: 147307 },
  { name: 'Nusa Tenggara Timur', pop: 5.66, area: 48718 },
  { name: 'Nusa Tenggara Barat', pop: 5.65, area: 18572 },
  { name: 'Bali', pop: 4.41, area: 5780 },
];

// Ketenagakerjaan, Agustus 2024 (juta jiwa, kecuali dinyatakan lain).
export const LABOR_2024 = {
  workingAge: 220.4,
  laborForce: 152.14,
  employed: 144.64,
  unemployed: 7.47,
  participation: 69.03,
  formal: 58.97,
  informal: 85.67,
  note: 'Penduduk usia kerja 15 tahun ke atas. Formal 40,77% dan informal 59,23% dari yang bekerja.',
};

// Sosial, 2024.
export const SOCIAL_2024 = {
  ipm: 75.02,
  lifeExpectancy: 74.12,
  lifeExpectancyPrev: 73.93,
  meanSchoolYears: 9.03,
  expectedSchoolYears: 13.21,
  povertyLineMar: 582932,
  povertyLineSep: 595242,
  poorMar: 25.22,
  poorSep: 24.06,
  note: 'Garis kemiskinan dalam rupiah per kapita per bulan.',
};

// Publikasi dan rilis yang angkanya dipakai situs ini.
export const RELEASES = [
  { title: 'Pertumbuhan Ekonomi Indonesia 2024', period: 'Triwulan IV-2024', note: 'Ekonomi tumbuh 5,03% sepanjang 2024.' },
  { title: 'Keadaan Ketenagakerjaan Indonesia Agustus 2024', period: 'Agustus 2024', note: 'TPT 4,91%; 144,64 juta penduduk bekerja.' },
  { title: 'Profil Kemiskinan di Indonesia Maret 2024', period: 'Maret 2024', note: 'Penduduk miskin 9,03% atau 25,22 juta jiwa.' },
  { title: 'Perkembangan Indeks Harga Konsumen Desember 2024', period: 'Desember 2024', note: 'Inflasi 1,57% (y-on-y).' },
  { title: 'Indeks Pembangunan Manusia 2024', period: 'Tahun 2024', note: 'IPM 75,02; usia harapan hidup 74,12 tahun.' },
  { title: 'Statistik Indonesia 2025', period: 'Tahunan', note: 'Kompilasi angka 2019–2024 yang dipakai situs ini.' },
];

export function formatId(n, decimals = 2) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function density(p) {
  return Math.round((p.pop * 1000000) / p.area);
}
