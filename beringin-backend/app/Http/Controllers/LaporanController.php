<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * Ambil semua data laporan (Publik / Siswa / Petugas)
     */
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

    /**
     * Buat Tiket Laporan Baru (Siswa / Pelapor)
     */
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
