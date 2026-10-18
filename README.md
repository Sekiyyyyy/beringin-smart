# Beringin Smart

> **Sistem Informasi & Portal Pengaduan Sarana Prasarana Sekolah**  
> *SMK Negeri 1 Beringin • Kompetensi Keahlian Pengembangan Perangkat Lunak dan Gim (PPLG)*  
> Pengembang: **Rizky Alfianno** (XI PPLG)

[![Ionic React](https://img.shields.io/badge/Frontend-Ionic%20React%20%2B%20Vite-3880ff?style=for-the-badge&logo=ionic)](https://ionicframework.com/)
[![Laravel Sanctum](https://img.shields.io/badge/Backend-Laravel%2012%20REST%20API-ff2d20?style=for-the-badge&logo=laravel)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![SKKNI 282/2016](https://img.shields.io/badge/Standard-SKKNI%20No.%20282%2F2016-0284c7?style=for-the-badge)](https://kemnaker.go.id/)

---

## 📌 Tentang Proyek

**Beringin Smart** adalah aplikasi web dan mobile responsif yang dirancang untuk memfasilitasi pelaporan dan penanganan kendala sarana prasarana di lingkungan sekolah. Sistem ini menghubungkan siswa sebagai pelapor dengan tim sarana prasarana sekolah agar setiap fasilitas yang rusak atau membutuhkan perbaikan dapat tercatat, dipantau, dan diselesaikan secara cepat dan transparan.

Proyek ini dikembangkan mengacu pada standar kompetensi keahlian **SKKNI No. 282 Tahun 2016** bidang pemrograman perangkat lunak.

---

## ⚡ Fitur Utama

- **Autentikasi & Otorisasi Pengguna:** Login aman berbasis token Bearer dengan Laravel Sanctum serta pembagian hak akses (*Role: Siswa & Petugas Sarpras*).
- **Dashboard Statistik:** Ringkasan jumlah tiket pengaduan secara real-time (Total Laporan, Menunggu, dan Selesai).
- **Formulir Pengaduan Sarpras:** Penginputan laporan kendala fasilitas lengkap dengan nama pelapor, lokasi/ruangan, kategori fasilitas, dan deskripsi masalah.
- **Daftar Tiket Real-Time:** Menampilkan feed pengaduan yang dilengkapi fitur pencarian cepat (*live search*) dan filter kategori (Fasilitas Kelas, Laboratorium, Lingkungan).
- **Halaman Rincian Tiket:** Informasi detail setiap laporan beserta status penanganan terkini.
- **Pembaruan Status (Khusus Petugas):** Otorisasi penutupan tiket (*Tandai Selesai*) dengan validasi ketat di tingkat server.
- **Tampilan Bersih & Responsif:** Desain modern, rapi, dan adaptif untuk perangkat mobile maupun layar desktop.

---

## 📁 Struktur Direktori

```
Beringin-Smart/
├── Beringin-Smart/                     # Frontend (Ionic 8 + React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/                      # Login.tsx, Home.tsx, Detail.tsx
│   │   ├── context/                    # LaporanContext.tsx (State Management)
│   │   ├── services/                   # api.ts (Axios + Sanctum Bearer Token)
│   │   ├── theme/                      # variables.css
│   │   └── types/                      # laporan.ts
│   └── package.json
│
├── beringin-backend/                   # Backend API (Laravel 12 + Laravel Sanctum)
│   ├── app/
│   │   ├── Http/Controllers/           # AuthController.php, LaporanController.php
│   │   └── Models/                     # User.php, Laporan.php
│   ├── database/
│   │   ├── migrations/                 # Migrasi skema database
│   │   └── seeders/DatabaseSeeder.php  # Seeder data pengguna awal
│   ├── routes/api.php                  # Endpoint API & Middleware Sanctum
│   └── config/cors.php                 # Konfigurasi CORS
└── README.md
```

---

## 🚀 Panduan Kloning & Menjalankan Aplikasi

### 1. Kloning Repository

Buka terminal dan jalankan perintah berikut:
```bash
git clone https://github.com/Sekiyyyyy/beringin-smart.git
cd beringin-smart
```

---

### 2. Setup Backend API (`beringin-backend`)

Buka terminal di root proyek, lalu ikuti langkah-langkah ini:
```bash
# 1. Masuk ke folder backend
cd beringin-backend

# 2. Pasang dependensi PHP / Laravel
composer install

# 3. Salin file environment
cp .env.example .env
# (Untuk pengguna Windows Command Prompt gunakan: copy .env.example .env)

# 4. Generate application key
php artisan key:generate

# 5. Jalankan migrasi dan isi database awal (Seeder)
php artisan migrate:fresh --seed

# 6. Jalankan server API backend
php artisan serve --port=8000
```
*Server API akan aktif di:* `http://localhost:8000/api`

---

### 3. Setup Frontend Web/Mobile (`Beringin-Smart`)

Buka terminal baru di root proyek:
```bash
# 1. Masuk ke folder frontend
cd Beringin-Smart

# 2. Pasang dependensi Node.js
npm install

# 3. Jalankan server pengembang frontend
npm run dev
```
*Aplikasi web dapat langsung diakses melalui browser di:* `http://localhost:8100` atau `http://localhost:5173`

---

## 🔑 Akun Uji Coba Bawaan (Default Seeder)

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Petugas Sarpras** | `petugas@beringin.sch.id` | `password` | Memantau seluruh laporan dan memperbarui status (*Tandai Selesai*). |
| **Siswa (Rizky Alfianno)** | `siswa@beringin.sch.id` | `password` | Mengajukan tiket pengaduan sarpras dan memantau progres penanganan. |

---

## 🛡️ Keamanan & Standar Teknis

1. **Bearer Token Sanctum:** Setiap komunikasi ke endpoint backend dilindungi token autentikasi yang disertakan via interceptor Axios.
2. **Client-Side Auth Guard:** Rute `/home` dan `/detail/:id` dilindungi sehingga pengguna yang belum login akan dialihkan otomatis ke `/login`.
3. **Role Validation (Server-Side):** Aksi perubahan status pengaduan divalidasi langsung di controller backend (`403 Forbidden` jika pengguna bukan petugas).
4. **CORS Handling:** Konfigurasi CORS diatur untuk mengizinkan request dari origin frontend secara aman.

---

*© SMK Negeri 1 Beringin • Modul UKK / LKPU PPLG.*