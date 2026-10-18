# LKPU PRAKTIK PEMBELAJARAN (BAGIAN PELENGKAP & LANJUTAN)
## PENGEMBANGAN APLIKASI WEB & MOBILE (STACK LARAGON + IONIC REACT)
**SMK NEGERI 1 BERINGIN — KONSENTRASI KEAHLIAN PPLG**  
*Berdasarkan SKKNI Pemrograman No. 282 Tahun 2016*

---

## 📌 Ringkasan Masalah & Bagian yang Dilengkapi
Berdasarkan analisis dokumen LKPU sebelumnya (Halaman 1–18), terdapat beberapa komponen penting yang terlewat, belum lengkap, atau berhenti mendadak sebelum proses integrasi selesai. Dokumen ini melengkapi:
1. **Backend Laravel**:
   - Kode lengkap `AuthController.php` (login, logout, token generation Sanctum).
   - Pengaturan Model `User.php` dan `Laporan.php` (Mass Assignment `$fillable` & relasi).
   - Penegakan Keamanan Hak Akses (Role Check `petugas` & return `403 Forbidden`) di `LaporanController.php`.
   - Perlindungan route di `routes/api.php` dengan middleware `auth:sanctum`.
   - Konfigurasi CORS agar Ionic dapat terhubung tanpa blokir browser.
   - Database Seeder (`DatabaseSeeder.php`) untuk akun uji coba (Siswa & Petugas).
2. **Frontend Ionic React**:
   - Instalasi dependency `axios`.
   - Sinkronisasi tipe data `src/types/laporan.ts`.
   - Pendaftaran Route `/login` dan proteksi autentikasi di `src/App.tsx`.
   - Penambahan identitas user & tombol Logout di `src/pages/Home.tsx`.
3. **Pengujian & Evaluasi (SKKNI J.620100.025.02)**:
   - Skenario pengujian fungsional & keamanan (403 Forbidden).
   - Panduan debugging error umum (CORS, Connection Refused, Sanctum 401).
   - Lembar Unjuk Kerja Siswa.

---

## BAGIAN A: KELENGKAPAN BACKEND LARAVEL (LARAGON)

### 1. Model `User.php` & `Laporan.php` (Pencegahan MassAssignmentException)

#### a. Perbarui Model `app/Models/User.php`:
Pastikan trait `HasApiTokens` aktif dan kolom `role` dimasukkan ke dalam `$fillable`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // 'siswa' atau 'petugas'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function laporans()
    {
        return $this->hasMany(Laporan::class);
    }
}
```

#### b. Perbarui Model `app/Models/Laporan.php`:
Tambahkan `$fillable` agar metode `Laporan::create(...)` tidak gagal:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    protected $table = 'laporans';

    protected $fillable = [
        'user_id',
        'nama',
        'lokasi',
        'kategori',
        'deskripsi',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

### 2. Implementasi `AuthController.php` (Autentikasi & Token Sanctum)
Buka file `app/Http/Controllers/AuthController.php` dan isi dengan kode berikut:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login User & Return Sanctum Token beserta Role
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password yang Anda masukkan salah.'
            ], 401);
        }

        // Hapus token lama jika ingin membatasi 1 session aktif
        $user->tokens()->delete();

        // Buat token baru via Laravel Sanctum
        $token = $user->createToken('beringin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ]
        ], 200);
    }

    /**
     * Logout User (Revoke Token)
     */
    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan untuk request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Cek data user yang sedang login
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

---

### 3. Penegakan Keamanan Hak Akses (Role Check) di `LaporanController.php`
Pada halaman 3 dan 18 ditekankan bahwa perubahan status laporan **hanya boleh dilakukan oleh petugas**, dan jika dilanggar backend **harus merespon dengan 403 Forbidden**.

Buka `app/Http/Controllers/LaporanController.php` dan perbaiki fungsi `updateStatus`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index()
    {
        $laporan = Laporan::orderBy('created_at', 'desc')->get();
        return response()->json([
            'message' => 'Berhasil mengambil data laporan',
            'data'    => $laporan
        ], 200);
    }

    /**
     * Khusus Petugas Sarpras: Mengubah status laporan
     * Dilindungi Authorization Check: 403 Forbidden jika bukan petugas!
     */
    public function updateStatus(Request $request, $id)
    {
        // 1. Verifikasi Role Pengguna
        $user = $request->user();
        if (!$user || $user->role !== 'petugas') {
            return response()->json([
                'message' => 'Akses ditolak (403 Forbidden): Hanya petugas sarpras yang diizinkan mengubah status laporan!'
            ], 403);
        }

        // 2. Validasi Input Status
        $request->validate([
            'status' => 'required|in:Menunggu,Sedang Diproses,Selesai'
        ]);

        // 3. Cari Data Laporan
        $laporan = Laporan::find($id);
        if (!$laporan) {
            return response()->json([
                'message' => 'Data laporan tidak ditemukan'
            ], 404);
        }

        // 4. Update Status
        $laporan->status = $request->input('status');
        $laporan->save();

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui',
            'data'    => $laporan
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelapor' => 'nullable|string',
            'nama'         => 'nullable|string',
            'lokasi'       => 'required|string',
            'kategori'     => 'required|string',
            'deskripsi'    => 'required|string',
        ]);

        $namaPelapor = $request->input('nama_pelapor') 
                    ?? $request->input('nama') 
                    ?? ($request->user() ? $request->user()->name : 'Anonim');

        $laporan = Laporan::create([
            'user_id'   => $request->user() ? $request->user()->id : null,
            'nama'      => $namaPelapor,
            'lokasi'    => $validated['lokasi'],
            'kategori'  => $validated['kategori'],
            'deskripsi' => $validated['deskripsi'],
            'status'    => 'Menunggu',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dibuat',
            'data'    => $laporan
        ], 201);
    }
}
```

---

### 4. Perbaikan `routes/api.php` dengan Middleware Sanctum
Buka `routes/api.php` dan pisahkan endpoint public dengan endpoint terlindungi:

```php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

// --- ENDPOINT PUBLIK ---
Route::post('/login', [AuthController::class, 'login']);
Route::get('/laporan', [LaporanController::class, 'index']); // Publik agar siswa & tamu bisa memantau
Route::post('/laporan', [LaporanController::class, 'store']); // Bisa dibuat dengan atau tanpa token

// --- ENDPOINT TERPROTEKSI (HARUS MEMBAWA TOKEN SANCTUM) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Endpoint ubah status wajib memiliki token petugas
    Route::patch('/laporan/{id}/status', [LaporanController::class, 'updateStatus']);
});
```

---

### 5. Konfigurasi Database Seeder (Membuat Akun Uji Siswa & Petugas)
Agar siswa dapat langsung menguji aplikasi tanpa registrasi manual, buat akun default di `database/seeders/DatabaseSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Petugas Sarpras
        User::updateOrCreate(
            ['email' => 'petugas@beringin.sch.id'],
            [
                'name'     => 'Pak Budi (Petugas Sarpras)',
                'password' => Hash::make('password123'),
                'role'     => 'petugas',
            ]
        );

        // 2. Akun Siswa
        User::updateOrCreate(
            ['email' => 'siswa@beringin.sch.id'],
            [
                'name'     => 'Ahmad Rizky (Siswa XI PPLG)',
                'password' => Hash::make('password123'),
                'role'     => 'siswa',
            ]
        );
    }
}
```

Jalankan perintah ini di Terminal Laragon:
```bash
php artisan db:seed
```

---

### 6. Konfigurasi CORS (Cross-Origin Resource Sharing)
Agar browser tidak memblokir komunikasi antara Ionic (`http://localhost:8100` / `http://localhost:5173`) dan Laravel (`http://127.0.0.1:8000`), pastikan pengaturan CORS di Laravel aktif.
Jika Laravel 11, cek file `config/cors.php` (atau buat melalui `php artisan config:publish cors` jika belum ada):
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## BAGIAN B: KELENGKAPAN FRONTEND IONIC REACT

### 7. Instalasi Dependency Axios
Di terminal folder proyek Ionic (`Beringin-Smart`), jalankan:
```bash
npm install axios
```

---

### 8. Perbarui Tipe Data `src/types/laporan.ts`
Sesuaikan dengan field dari API Laravel:
```typescript
export interface Laporan {
    id: string | number;
    user_id?: string | number | null;
    nama: string;
    nama_pelapor?: string;
    lokasi: string;
    kategori: string;
    deskripsi: string;
    status: 'Menunggu' | 'Sedang Diproses' | 'Selesai';
    created_at?: string;
    updated_at?: string;
    tanggal?: string;
}
```

---

### 9. Pendaftaran Route Login & Proteksi Navigasi di `src/App.tsx`
Buka `src/App.tsx` dan tambahkan route `/login` serta pengecekan session:

```tsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import { LaporanProvider } from './context/LaporanContext';

/* Core CSS & styles */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <IonApp>
      <LaporanProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/home" 
              element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/detail/:id" 
              element={isLoggedIn ? <Detail /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} 
            />
          </IonRouterOutlet>
        </IonReactRouter>
      </LaporanProvider>
    </IonApp>
  );
};

export default App;
```

---

### 10. Tambahkan Info User & Tombol Logout di `src/pages/Home.tsx`
Agar pengguna tahu akun yang sedang aktif dan dapat berganti role saat pengujian, tambahkan tombol Logout di Toolbar `Home.tsx`:

```tsx
// Tambahkan di dalam handler Home.tsx:
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const userString = localStorage.getItem('user');
const currentUser = userString ? JSON.parse(userString) : null;
const userRole = localStorage.getItem('role') || 'siswa';
```

Dan pasang di bagian `<IonToolbar>`:
```tsx
<IonToolbar color="dark">
  <IonTitle style={{ fontWeight: 700, letterSpacing: '0.5px' }}>
    BERINGIN SMART <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>| {userRole.toUpperCase()}</span>
  </IonTitle>
  <IonButtons slot="end">
    <IonButton color="light" fill="clear" onClick={handleLogout}>
      Logout
    </IonButton>
  </IonButtons>
</IonToolbar>
```

---

## BAGIAN C: PENGUJIAN DAN DEBUGGING (SKKNI J.620100.025.02)

### 11. Skenario Uji Coba Terpadu

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
|:---|:---|:---|:---|:---:|
| 1 | **Login Siswa** | Masukkan `siswa@beringin.sch.id` / `password123` | Berhasil login, dialihkan ke `/home`, role terbaca `'siswa'` | [ ] |
| 2 | **Input Pengaduan Baru** | Siswa mengisi formulir komplain fasilitas | Data tersimpan di database MySQL Laragon dengan status `'Menunggu'` | [ ] |
| 3 | **Cek Hak Akses Siswa** | Siswa klik salah satu tiket laporan di halaman Home | Halaman Detail terbuka, banner kuning *"Laporan sedang ditangani"* muncul, **tombol selesai TIDAK ADA** | [ ] |
| 4 | **Logout & Login Petugas** | Klik Logout, lalu login dengan `petugas@beringin.sch.id` / `password123` | Masuk ke dashboard dengan status role `'petugas'` | [ ] |
| 5 | **Petugas Menangani Laporan** | Petugas membuka tiket laporan yang sama | Tombol hijau **"TANDAI LAPORAN SELESAI"** muncul | [ ] |
| 6 | **Eksekusi Selesai** | Klik tombol hijau | Status laporan berubah menjadi `'Selesai'`, badge hijau muncul di UI & database terupdate | [ ] |
| 7 | **Uji Penetrasi Keamanan (403 Test)** | Siswa / Tamu mencoba menembak API via Postman: `PATCH http://127.0.0.1:8000/api/laporan/1/status` tanpa token petugas | Server Laravel mengembalikan status HTTP **403 Forbidden** | [ ] |

---

### 12. Troubleshooting & FAQ Debugging Siswa

1. **Error: `AxiosError: Network Error`**
   - **Penyebab**: Server Laravel di Laragon belum berjalan, atau URL `baseURL` salah.
   - **Solusi**: Pastikan perintah `php artisan serve` aktif di terminal Laragon pada port 8000 (`http://localhost:8000/api` atau `http://127.0.0.1:8000/api`).

2. **Error: `CORS policy: No 'Access-Control-Allow-Origin' header`**
   - **Penyebab**: Laravel memblokir origin dari Ionic.
   - **Solusi**: Pastikan `allowed_origins` diatur `['*']` pada `config/cors.php`.

3. **Error: `SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'`**
   - **Penyebab**: Konfigurasi `.env` pada Laravel tidak cocok dengan password MySQL Laragon.
   - **Solusi**: Buka `.env`, pastikan `DB_PASSWORD=` kosong (default Laragon tidak menggunakan password root).

4. **Tombol "Tandai Selesai" Tidak Muncul padahal Akun Petugas**
   - **Penyebab**: Cache `localStorage` masih menyimpan role siswa.
   - **Solusi**: Lakukan Logout terlebih dahulu atau bersihkan Application Storage di DevTools (F12 -> Application -> Clear Storage), kemudian login ulang sebagai petugas.
