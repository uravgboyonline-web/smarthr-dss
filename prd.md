# PRD — SmartHR DSS
## Smart Human Resource Decision Support System
### DSS Penilaian Kinerja Karyawan Berbasis Perilaku

## 1. Overview

### 1.1 Nama Produk
**SmartHR DSS**  
**Smart Human Resource Decision Support System**

### 1.2 Deskripsi Singkat
SmartHR DSS adalah sistem pendukung keputusan untuk penilaian kinerja karyawan yang menggabungkan **data kinerja** dan **data perilaku** agar hasil evaluasi lebih objektif, transparan, dan konsisten.

Sistem ini dirancang sebagai model aplikasi DSS berbasis perilaku manajerial, sesuai dengan tugas yang menuntut pengembangan model aplikasi sistem informasi dengan pendekatan konseptual dan Design Science Research. :contentReference[oaicite:0]{index=0}

### 1.3 Latar Belakang Masalah
Penilaian kinerja karyawan di banyak organisasi masih dilakukan secara manual atau semi-manual dan sering bergantung pada subjektivitas penilai. Dalam praktik manajerial, keputusan tidak hanya dipengaruhi oleh angka, tetapi juga oleh faktor perilaku seperti disiplin, tanggung jawab, kerja sama, komunikasi, emosi, pengalaman, dan bias kognitif.

Berdasarkan ruang lingkup tugas, sistem yang dikembangkan harus mampu mengintegrasikan aspek perilaku manajerial ke dalam desain aplikasi DSS, bukan sekadar menghitung nilai numerik. Sistem juga diarahkan untuk menghasilkan model konseptual, desain arsitektur, dan rekomendasi keputusan. :contentReference[oaicite:1]{index=1}

### 1.4 Tujuan Produk
- Membantu penilaian kinerja karyawan secara lebih terstruktur.
- Mengurangi subjektivitas dalam proses evaluasi.
- Mengintegrasikan data kinerja dan data perilaku.
- Menghasilkan rekomendasi keputusan seperti promosi, reward, pelatihan, atau evaluasi ulang.
- Menyediakan dasar pengembangan aplikasi sistem informasi yang dapat dikembangkan lebih lanjut.

### 1.5 Sasaran Pengguna
- **Admin Sistem**: mengelola data master.
- **HRD / Personalia**: melakukan penilaian dan melihat laporan.
- **Manajer / Supervisor**: memberi evaluasi dan mengambil keputusan.
- **Pimpinan**: melihat ringkasan hasil evaluasi.
- **Karyawan**: melihat hasil penilaian dirinya sendiri jika diberi akses.

### 1.6 Ruang Lingkup
#### Termasuk
- Manajemen data karyawan
- Manajemen indikator penilaian
- Input penilaian kinerja dan perilaku
- Perhitungan skor akhir otomatis
- Rekomendasi keputusan
- Dashboard hasil evaluasi
- Laporan per periode, divisi, dan karyawan

#### Tidak Termasuk
- Payroll
- Absensi hardware
- Rekrutmen
- Penilaian psikotes penuh
- Implementasi AI kompleks
- Integrasi ERP skala besar

### 1.7 Nilai Manfaat
- Menjadikan penilaian lebih objektif dan transparan.
- Membantu manajer mengambil keputusan dengan dasar yang jelas.
- Memberikan gambaran perilaku kerja karyawan secara lebih sistematis.
- Menjadi model aplikasi DSS yang selaras dengan aspek perilaku manajerial. :contentReference[oaicite:2]{index=2}

---

## 2. Requirements

### 2.1 Functional Requirements

#### FR-01 — Autentikasi Pengguna
Sistem harus menyediakan login untuk pengguna yang memiliki role berbeda.

#### FR-02 — Manajemen Role
Sistem harus membedakan hak akses untuk:
- Admin
- HRD
- Manajer
- Pimpinan
- Karyawan

#### FR-03 — Manajemen Data Karyawan
Sistem harus dapat menambah, mengubah, melihat, dan menghapus data karyawan.

#### FR-04 — Manajemen Indikator Penilaian
Sistem harus dapat mengelola indikator penilaian yang terdiri dari:
- indikator kinerja
- indikator perilaku

#### FR-05 — Pengaturan Bobot
Sistem harus dapat menyimpan bobot untuk masing-masing indikator maupun kelompok indikator.

#### FR-06 — Input Penilaian
Sistem harus memungkinkan penilai mengisi skor kinerja dan skor perilaku per karyawan pada periode tertentu.

#### FR-07 — Perhitungan Skor Otomatis
Sistem harus menghitung skor akhir berdasarkan bobot yang ditentukan.

#### FR-08 — Rekomendasi Keputusan
Sistem harus menghasilkan rekomendasi, misalnya:
- Promosi
- Reward
- Pelatihan
- Evaluasi ulang
- Pertahankan

#### FR-09 — Dashboard
Sistem harus menampilkan ringkasan hasil penilaian dalam bentuk:
- tabel
- kartu ringkasan
- grafik tren
- ranking karyawan

#### FR-10 — Laporan
Sistem harus dapat menampilkan dan mengekspor laporan penilaian dalam format PDF dan/atau Excel.

#### FR-11 — Riwayat Penilaian
Sistem harus menyimpan histori penilaian per karyawan per periode.

#### FR-12 — Audit Aktivitas
Sistem harus menyimpan aktivitas penting seperti login, input penilaian, perubahan bobot, dan penghapusan data.

### 2.2 Non-Functional Requirements

#### NFR-01 — Kemudahan Penggunaan
Antarmuka harus sederhana, modern, dan mudah dipahami pengguna non-teknis.

#### NFR-02 — Responsif
Sistem harus bisa diakses dengan baik melalui desktop, laptop, dan tablet.

#### NFR-03 — Keamanan
Sistem harus memiliki otorisasi berbasis role dan penyimpanan password yang aman.

#### NFR-04 — Kinerja
Sistem harus mampu memproses data penilaian dengan cepat untuk skala organisasi kecil sampai menengah.

#### NFR-05 — Reliabilitas
Data yang sudah disimpan tidak boleh mudah hilang atau rusak.

#### NFR-06 — Skalabilitas
Struktur sistem harus memungkinkan penambahan indikator, divisi, atau modul baru di masa depan.

#### NFR-07 — Maintainability
Kode dan struktur database harus mudah dirawat dan dikembangkan.

### 2.3 Business Rules
- Setiap penilaian harus terkait dengan satu karyawan dan satu periode.
- Setiap karyawan dapat memiliki lebih dari satu penilaian dalam periode yang berbeda.
- Bobot penilaian total harus berjumlah 100%.
- Hanya user dengan role tertentu yang dapat mengubah bobot atau indikator.
- Rekomendasi keputusan ditentukan berdasarkan kategori skor akhir.

### 2.4 Contoh Kategori Nilai
- **85–100** = Sangat Baik
- **70–84** = Baik
- **55–69** = Cukup
- **<55** = Perlu Perbaikan

---

## 3. Core Features

### 3.1 Employee Management
Fitur untuk mengelola data karyawan.

**Fungsi:**
- tambah karyawan
- edit data karyawan
- hapus data karyawan
- lihat daftar karyawan
- filter berdasarkan divisi, jabatan, dan status

### 3.2 Performance Indicator Management
Fitur untuk mengatur indikator penilaian.

**Contoh indikator kinerja:**
- pencapaian target
- produktivitas
- ketepatan waktu
- kualitas kerja

**Contoh indikator perilaku:**
- disiplin
- tanggung jawab
- komunikasi
- kerja sama
- inisiatif
- stabilitas emosi

### 3.3 Evaluation Input
Fitur input skor evaluasi untuk tiap karyawan.

**Komponen input:**
- periode penilaian
- evaluator
- skor per indikator
- catatan penilai

### 3.4 DSS Scoring Engine
Mesin perhitungan untuk menghasilkan skor akhir.

**Contoh logika:**
- skor kinerja dikalikan bobot kinerja
- skor perilaku dikalikan bobot perilaku
- total skor menjadi dasar rekomendasi

### 3.5 Recommendation Engine
Fitur yang memberi hasil akhir keputusan berdasarkan skor.

**Output rekomendasi:**
- Promosi
- Reward
- Pelatihan
- Evaluasi ulang
- Tetap dipertahankan

### 3.6 Dashboard Analytics
Fitur visualisasi hasil evaluasi.

**Isi dashboard:**
- jumlah karyawan dinilai
- rata-rata skor
- ranking karyawan
- distribusi kategori nilai
- tren hasil dari periode ke periode

### 3.7 Reporting
Fitur laporan untuk kebutuhan dokumentasi dan presentasi.

**Jenis laporan:**
- laporan individu
- laporan per divisi
- laporan per periode
- laporan per penilai

### 3.8 Export & Print
- Export PDF
- Export Excel
- Print view

### 3.9 Audit Log
Mencatat aktivitas pengguna penting untuk keperluan kontrol dan pelacakan.

---

## 4. User Flow

### 4.1 Alur Umum
1. User membuka sistem.
2. User login sesuai role.
3. Sistem menampilkan dashboard sesuai hak akses.
4. Admin mengelola data master.
5. HRD/Manajer memilih periode penilaian.
6. Penilai memilih karyawan yang akan dinilai.
7. Penilai mengisi skor kinerja dan perilaku.
8. Sistem menghitung skor akhir otomatis.
9. Sistem memberi rekomendasi keputusan.
10. User melihat hasil pada dashboard.
11. User mengekspor laporan bila diperlukan.

### 4.2 Flow Admin
1. Login
2. Kelola data user
3. Kelola data karyawan
4. Kelola indikator
5. Atur bobot penilaian
6. Melihat audit log

### 4.3 Flow HRD / Manajer
1. Login
2. Pilih periode penilaian
3. Pilih karyawan
4. Isi penilaian
5. Simpan hasil
6. Lihat rekomendasi
7. Unduh laporan

### 4.4 Flow Pimpinan
1. Login
2. Lihat dashboard ringkasan
3. Lihat ranking karyawan
4. Lihat laporan per divisi/periode
5. Ambil keputusan

### 4.5 Flow Karyawan
1. Login
2. Lihat hasil penilaian pribadi
3. Lihat status atau rekomendasi
4. Lihat riwayat penilaian bila diizinkan

---

## 5. Architecture

### 5.1 Arsitektur Umum
SmartHR DSS menggunakan arsitektur tiga lapis:

#### A. Presentation Layer
Bagian tampilan yang berinteraksi langsung dengan pengguna.
- Dashboard
- Form login
- Form penilaian
- Halaman laporan
- Halaman manajemen data

#### B. Application / Processing Layer
Bagian inti yang mengolah logika bisnis.
- validasi data
- autentikasi
- perhitungan skor
- penentuan rekomendasi
- pengelolaan role
- pengolahan laporan

#### C. Data Layer
Bagian penyimpanan data.
- database user
- database karyawan
- database indikator
- database penilaian
- database audit log

### 5.2 Komponen Sistem
- **Authentication Module**
- **Employee Module**
- **Indicator Module**
- **Evaluation Module**
- **Scoring Module**
- **Recommendation Module**
- **Reporting Module**
- **Dashboard Module**
- **Audit Log Module**

### 5.3 Alur Data
1. User menginput data melalui UI.
2. Data dikirim ke processing layer.
3. Sistem memvalidasi dan menyimpan ke database.
4. Mesin DSS menghitung skor.
5. Sistem mengirim hasil ke dashboard dan laporan.

### 5.4 Prinsip Desain
- modular
- mudah dikembangkan
- role-based access
- reusable component
- data-driven decision support

---

## 6. Database Schema

### 6.1 Tabel `users`
Menyimpan data akun pengguna.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| name | varchar | Nama user |
| email | varchar | Email login |
| password | varchar | Password terenkripsi |
| role | enum | admin, hr, manager, leader, employee |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.2 Tabel `employees`
Menyimpan data karyawan.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| employee_code | varchar | Kode karyawan |
| name | varchar | Nama karyawan |
| position | varchar | Jabatan |
| department | varchar | Divisi |
| join_date | date | Tanggal masuk |
| status | varchar | Aktif / nonaktif |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.3 Tabel `indicators`
Menyimpan indikator penilaian.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| name | varchar | Nama indikator |
| type | enum | kinerja / perilaku |
| weight | decimal | Bobot indikator |
| description | text | Penjelasan indikator |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.4 Tabel `evaluation_periods`
Menyimpan periode penilaian.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| period_name | varchar | Nama periode, mis. Q1 2026 |
| start_date | date | Awal periode |
| end_date | date | Akhir periode |
| status | varchar | aktif / closed |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.5 Tabel `evaluations`
Menyimpan hasil penilaian utama.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| employee_id | FK | Relasi ke employees |
| evaluator_id | FK | Relasi ke users |
| period_id | FK | Relasi ke evaluation_periods |
| total_score | decimal | Nilai akhir |
| recommendation | varchar | Hasil rekomendasi |
| notes | text | Catatan evaluator |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.6 Tabel `evaluation_details`
Menyimpan nilai detail tiap indikator.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| evaluation_id | FK | Relasi ke evaluations |
| indicator_id | FK | Relasi ke indicators |
| score | decimal | Skor indikator |
| weighted_score | decimal | Skor setelah bobot |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diubah |

### 6.7 Tabel `audit_logs`
Menyimpan jejak aktivitas.

| Field | Type | Keterangan |
|------|------|------------|
| id | bigint / uuid | Primary key |
| user_id | FK | User yang melakukan aksi |
| action | varchar | Jenis aksi |
| entity | varchar | Objek yang diubah |
| entity_id | varchar | ID objek |
| description | text | Detail aktivitas |
| created_at | timestamp | Waktu aktivitas |

### 6.8 Relasi Antar Tabel
- `users` memiliki banyak `evaluations`
- `employees` memiliki banyak `evaluations`
- `evaluation_periods` memiliki banyak `evaluations`
- `evaluations` memiliki banyak `evaluation_details`
- `indicators` memiliki banyak `evaluation_details`
- `users` memiliki banyak `audit_logs`

---

## 7. Tech Stack

### 7.1 Frontend
- **Next.js**
- React
- App Router
- Tailwind CSS
- ShadCN UI

### 7.2 Backend
- Next.js Server Actions
- Next.js API Routes
- REST API bila diperlukan

### 7.3 Database
- PostgreSQL

### 7.4 ORM
- Prisma

### 7.5 Authentication
- Auth.js / NextAuth.js
- Role-based access control

### 7.6 Data Visualization
- Recharts

### 7.7 Export & Reporting
- PDF export library
- Excel export library

### 7.8 Deployment
- Vercel

### 7.9 Development Tools
- Figma
- Draw.io / Lucidchart
- GitHub
- VS Code

### 7.10 Alasan Pemilihan Next.js
- fullstack dalam satu framework
- cocok untuk dashboard sistem informasi
- mendukung SSR dan SSG
- mudah dikembangkan
- cocok untuk desain modern dan minimalis

---

## 8. Development Plan

### Phase 1 — Problem Identification
- Mengidentifikasi masalah penilaian kinerja yang subjektif
- Menentukan kebutuhan sistem DSS berbasis perilaku
- Menetapkan ruang lingkup sistem

### Phase 2 — Literature Study
- Studi tentang DSS
- Studi perilaku manajerial
- Studi penilaian kinerja karyawan
- Studi pendekatan Design Science Research

### Phase 3 — Conceptual Design
- Menyusun model konseptual sistem
- Menentukan variabel kinerja dan perilaku
- Menyusun aturan perhitungan dan rekomendasi
- Menentukan arsitektur sistem

### Phase 4 — UI/UX Design
- Mendesain wireframe
- Mendesain dashboard
- Mendesain form input penilaian
- Mendesain halaman laporan

### Phase 5 — Prototype Development
- Membangun prototype menggunakan Next.js
- Membuat autentikasi
- Membuat CRUD karyawan
- Membuat manajemen indikator
- Membuat modul penilaian
- Membuat dashboard hasil

### Phase 6 — Validation
- Menguji alur sistem
- Menguji logika perhitungan skor
- Menguji kesesuaian rekomendasi
- Validasi konseptual dengan kebutuhan penelitian

### Phase 7 — Documentation
- Menyusun laporan proposal
- Menyusun deskripsi model DSS
- Menyusun hasil analisis
- Menyusun kesimpulan dan saran

---

## Conclusion
SmartHR DSS adalah model aplikasi Decision Support System untuk penilaian kinerja karyawan berbasis perilaku yang dirancang untuk mendukung keputusan manajerial secara lebih objektif, transparan, dan sistematis. Konsep ini sesuai dengan tugas pengembangan model aplikasi DSS berbasis perilaku manajerial menggunakan pendekatan Design Science Research. :contentReference[oaicite:3]{index=3}