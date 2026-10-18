# Beringin Smart — Fullstack App (Ionic React + Laravel API)

Aplikasi Portal Pengaduan Sarana dan Prasarana (Sarpras) SMKN 1 Beringin berdasarkan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) Pemrograman No. 282 Tahun 2016.

---

## 📁 Struktur Monorepo

```
beringin-smart/
├── Beringin-Smart/                     # Frontend Mobile / Web (Ionic 8 + React + TypeScript + Vite)
│   ├── src/
│   │   ├── pages/                      # Login.tsx, Home.tsx, Detail.tsx
│   │   ├── context/                    # LaporanContext.tsx (API Consumer)
│   │   ├── services/                   # api.ts (Axios + Sanctum Bearer Token Interceptor)
│   │   └── types/                      # laporan.ts
│   └── package.json
│
├── beringin-backend/                   # Backend RESTful API (Laravel 12 + Laravel Sanctum)
│   ├── app/
│   │   ├── Http/Controllers/           # AuthController.php, LaporanController.php
│   │   └── Models/                     # User.php, Laporan.php
│   ├── database/
│   │   ├── migrations/                 # users, personal_access_tokens, laporans
│   │   └── seeders/DatabaseSeeder.php  # Akun Default Siswa & Petugas Sarpras
│   ├── routes/api.php                  # API Endpoints & Sanctum Middleware Protection
│   └── config/cors.php                 # CORS Configuration
└── README.md
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Backend Laravel (`beringin-backend`)

1. Buka folder backend di terminal:
   ```bash
   cd beringin-backend
   ```
2. Pastikan file `.env` sudah sesuai (default port 8000 dan MySQL Laragon / SQLite).
3. Jalankan migrasi dan seeder database untuk membuat akun uji coba:
   ```bash
   php artisan migrate:fresh --seed
   ```
4. Jalankan development server:
   ```bash
   php artisan serve
   ```
   *Backend API berjalan pada:* `http://localhost:8000/api`

---

### 2. Frontend Ionic React (`Beringin-Smart`)

1. Buka folder frontend di terminal terpisah:
   ```bash
   cd Beringin-Smart
   ```
2. Install dependensi (jika baru pertama kali klon):
   ```bash
   npm install
   ```
3. Jalankan development server frontend:
   ```bash
   npm run dev
   ```
   *Aplikasi Ionic dapat diakses pada browser di:* `http://localhost:5173` atau `http://localhost:8100`

---

## 🔑 Akun Uji Coba Default (Seeder)

| Peran (Role) | Email | Password | Hak Akses |
|:---|:---|:---|:---|
| **Petugas Sarpras** | `petugas@beringin.sch.id` | `password123` | Melihat semua laporan, menandai laporan selesai (Tombol Selesai aktif). |
| **Siswa** | `siswa@beringin.sch.id` | `password123` | Membuat tiket pengaduan baru, melihat status progres (Tidak bisa mengubah status). |

---

## 🛡️ Hak Akses & Keamanan Terintegrasi (SKKNI)
- **Token-Based Auth**: Menggunakan Laravel Sanctum dengan HTTP Bearer Token.
- **Client-Side Guard**: Halaman `Detail.tsx` menyembunyikan aksi "Tandai Selesai" bagi siswa.
- **Server-Side Guard**: Endpoint `PATCH /api/laporan/{id}/status` diproteksi middleware `auth:sanctum` dan menolak dengan kode HTTP **403 Forbidden** jika pemanggil bukan ber-role `petugas`.