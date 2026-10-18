<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Laporan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Petugas Sarpras
        $petugas = User::updateOrCreate(
            ['email' => 'petugas@beringin.sch.id'],
            [
                'name'     => 'Pak Budi (Petugas Sarpras)',
                'password' => Hash::make('password123'),
                'role'     => 'petugas',
            ]
        );

        // 2. Akun Siswa (Rizky Alfianno)
        $siswa = User::updateOrCreate(
            ['email' => 'siswa@beringin.sch.id'],
            [
                'name'     => 'Rizky Alfianno (Siswa XI PPLG)',
                'password' => Hash::make('password123'),
                'role'     => 'siswa',
            ]
        );

        // 3. Data Awal Laporan Contoh
        Laporan::updateOrCreate(
            ['lokasi' => 'Lab Komputer 2'],
            [
                'user_id'   => $siswa->id,
                'nama'      => $siswa->name,
                'kategori'  => 'Laboratorium',
                'deskripsi' => 'AC ruangan tidak dingin dan komputer meja no. 5 mati total.',
                'status'    => 'Menunggu',
            ]
        );

        Laporan::updateOrCreate(
            ['lokasi' => 'Ruang Kelas XI PPLG 1'],
            [
                'user_id'   => $siswa->id,
                'nama'      => $siswa->name,
                'kategori'  => 'Fasilitas Kelas',
                'deskripsi' => 'Proyektor infocus mati saat digunakan presentasi pelajaran.',
                'status'    => 'Sedang Diproses',
            ]
        );
    }
}
