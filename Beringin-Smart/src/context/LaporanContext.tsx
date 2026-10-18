import React, { createContext, useState, useEffect } from 'react';
import { Laporan } from '../types/laporan';
import api from '../services/api';

interface LaporanContextType {
  laporanList: Laporan[];
  tambahLaporan: (data: Partial<Laporan>) => Promise<boolean>;
  getLaporanById: (id: string) => Laporan | undefined;
  ubahStatusLaporan: (id: string, status: string) => Promise<boolean>;
  refreshLaporan: () => void;
}

export const LaporanContext = createContext<LaporanContextType>({} as LaporanContextType);

export const LaporanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);

  const fetchLaporan = async () => {
    try {
      const response = await api.get('/laporan');
      if (response.data && response.data.data) {
        setLaporanList(response.data.data);
      } else if (Array.isArray(response.data)) {
        setLaporanList(response.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data laporan:', error);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const tambahLaporan = async (data: Partial<Laporan>) => {
    try {
      await api.post('/laporan', data);
      await fetchLaporan(); // Re-fetch data setelah berhasil tambah
      return true;
    } catch (error) {
      console.error('Gagal menambah laporan:', error);
      return false;
    }
  };

  const getLaporanById = (id: string) => {
    return laporanList.find((item) => String(item.id) === String(id));
  };

  const ubahStatusLaporan = async (id: string, status: string) => {
    try {
      await api.patch(`/laporan/${id}/status`, { status });
      await fetchLaporan(); // Re-fetch data setelah status diubah
      return true;
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      return false;
    }
  };

  return (
    <LaporanContext.Provider
      value={{
        laporanList,
        tambahLaporan,
        getLaporanById,
        ubahStatusLaporan,
        refreshLaporan: fetchLaporan,
      }}
    >
      {children}
    </LaporanContext.Provider>
  );
};