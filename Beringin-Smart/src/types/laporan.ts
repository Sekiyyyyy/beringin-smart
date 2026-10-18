export interface Laporan {
  id: string | number;
  user_id?: string | number | null;
  nama: string;
  nama_pelapor?: string;
  lokasi: string;
  kategori: string;
  deskripsi: string;
  tanggal?: string;
  created_at?: string;
  updated_at?: string;
  status: 'Menunggu' | 'Sedang Diproses' | 'Selesai';
}