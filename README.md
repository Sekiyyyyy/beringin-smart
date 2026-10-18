# 🔮 Beringin Smart — Liquid Glass Edition

> **Sistem Informasi & Portal Pengaduan Sarana Prasarana Sekolah**  
> *SMK Negeri 1 Beringin • Kompetensi Keahlian Pengembangan Perangkat Lunak dan Gim (PPLG)*  
> Pengembang: **Rizky Alfianno** (XI PPLG)

[![Ionic React](https://img.shields.io/badge/Frontend-Ionic%20React%20%2B%20Vite-6366f1?style=for-the-badge&logo=ionic)](https://ionicframework.com/)
[![Laravel Sanctum](https://img.shields.io/badge/Backend-Laravel%2012%20REST%20API-8b5cf6?style=for-the-badge&logo=laravel)](https://laravel.com/)
[![Theme](https://img.shields.io/badge/Theme-21st.dev%20Liquid%20Glass-ec4899?style=for-the-badge)](https://21st.dev/)
[![SKKNI 282/2016](https://img.shields.io/badge/Standard-SKKNI%20No.%20282%2F2016-06b6d4?style=for-the-badge)](https://kemnaker.go.id/)

---

## 💎 Konsep Desain: 21st.dev Liquid Glass

Proyek ini mengadopsi estetika antarmuka modern terdepan yang terinspirasi dari standar desain **21st.dev**:
- **Frosted Glass Panels:** Panel kartu semi-transparan dengan *backdrop-filter blur (20px)* dan saturasi warna tinggi.
- **Ambient Liquid Mesh Aura:** Latar belakang *deep obsidian* dengan pencahayaan dinamis gradien violet, cyan, dan magenta.
- **Specular Highlights & Iridescent Borders:** Refleksi cahaya di tepi atas kartu dan efek cahaya lembut saat interaksi hover.
- **Liquid Pill Components:** Tombol aksi, segment tab, dan indikator status berwujud kapsul cair bercahaya.
- **Struktur Asli Terjaga 100%:** Tetap mematuhi seluruh modul LKPU & SKKNI 282/2016 (Navigasi toolbar, 3 ringkasan statistik, 2-kolom desktop / segment tab mobile, formulir pengaduan, daftar feed dengan live filter, serta halaman rincian tiket).

---

## 📁 Struktur Monorepo Proyek

```
Beringin-Smart/
├── Beringin-Smart/                     # Frontend Web / Mobile (Ionic 8 + React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/                      # Login.tsx, Home.tsx, Detail.tsx (Liquid Glass Theme)
│   │   ├── context/                    # LaporanContext.tsx (API State Management)
│   │   ├── services/                   # api.ts (Axios + Sanctum Bearer Token Interceptor)
│   │   ├── theme/                      # variables.css (21st.dev Liquid Glass Design Tokens)
│   │   └── types/                      # laporan.ts
│   └── package.json
│
├── beringin-backend/                   # Backend API (Laravel 12 + Laravel Sanctum)
│   ├── app/
│   │   ├── Http/Controllers/           # AuthController.php, LaporanController.php
│   │   └── Models/                     # User.php, Laporan.php
│   ├── database/
│   │   ├── migrations/                 # Migrasi database skema pelaporan & token
│   │   └── seeders/DatabaseSeeder.php  # Seeder: Rizky Alfianno (Siswa) & Pak Budi (Petugas)
│   ├── routes/api.php                  # API Routes & Sanctum Middleware
│   └── config/cors.php                 # Konfigurasi Cross-Origin Resource Sharing
└── README.md
```

---

## 🚀 Panduan Menjalankan Sistem

### 1. Server API Backend (`beringin-backend`)
1. Masuk ke direktori backend:
   ```bash
   cd beringin-backend
   ```
2. Jalankan migrasi dan seeder database awal:
   ```bash
   php artisan migrate:fresh --seed
   ```
3. Nyalakan server backend:
   ```bash
   php artisan serve
   ```
   *API Endpoint berjalan di:* `http://localhost:8000/api`

---

### 2. Aplikasi Frontend Ionic (`Beringin-Smart`)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd Beringin-Smart
   ```
2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   *Aplikasi dapat diakses melalui browser pada:* `http://localhost:5173` atau `http://localhost:8100`

---

## 🔑 Kredensial Akun Bawaan (Seeder)

| Peran (Role) | Email | Password | Wewenang & Hak Akses |
| :--- | :--- | :--- | :--- |
| **Petugas Sarpras** | `petugas@beringin.sch.id` | `password123` | Memantau seluruh tiket, melakukan verifikasi dan penutupan laporan (*Tandai Selesai*). |
| **Siswa (Rizky Alfianno)** | `siswa@beringin.sch.id` | `password123` | Mengajukan tiket pengaduan baru, memantau riwayat pengaduan mandiri & status terkini. |

---

## 🛡️ Keamanan & Integrasi SKKNI No. 282/2016

1. **Token Bearer Sanctum:** Seluruh komunikasi request data ke API Laravel diinjeksi dengan header `Authorization: Bearer <token>` melalui interceptor Axios.
2. **Client-Side Auth Guard:** Proteksi halaman `Home` dan `Detail` mencegah akses tanpa autentikasi dan langsung mengarahkan user ke halaman `Login`.
3. **Server-Side Authorization (HTTP 403):** Endpoint pembaruan status `PATCH /api/laporan/{id}/status` divalidasi ketat di tingkat controller Laravel. Permintaan dari role selain `petugas` ditolak dengan kode `403 Forbidden`.

---
*© 2026-2027 SMK Negeri 1 Beringin • Modul LKPU Uji Kompetensi Keahlian PPLG.*