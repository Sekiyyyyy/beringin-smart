import React, { useContext, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import { checkmarkCircleOutline, timeOutline, personOutline, calendarOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { LaporanContext } from '../context/LaporanContext';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const idLaporan = id || ''; // Solusi agar TypeScript tidak mengeluhkan type 'undefined'
  const { getLaporanById, ubahStatusLaporan } = useContext(LaporanContext);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const laporan = getLaporanById(idLaporan);
  const role = localStorage.getItem('role');

  const handleSelesai = async () => {
    if (!idLaporan) return;
    setLoading(true);
    const success = await ubahStatusLaporan(idLaporan, 'Selesai');
    setLoading(false);

    if (success) {
      setToastMsg('Status laporan berhasil diubah menjadi Selesai!');
      setShowToast(true);
    } else {
      setToastMsg('Gagal memperbarui status. Periksa koneksi backend!');
      setShowToast(true);
    }
  };

  if (!laporan) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="dark">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="KEMBALI" />
            </IonButtons>
            <IonTitle>Rincian Tiket Laporan</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <p>Laporan tidak ditemukan.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="KEMBALI" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 700 }}>Rincian Tiket Laporan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' } as React.CSSProperties}>
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <IonCardContent className="ion-padding">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#3880ff', fontWeight: 700, fontSize: '0.95rem' }}>{laporan.kategori}</span>
                <IonBadge
                  color={laporan.status === 'Selesai' ? 'success' : 'warning'}
                  style={{ padding: '6px 12px', borderRadius: '6px' }}
                >
                  {laporan.status}
                </IonBadge>
              </div>

              <h1 style={{ margin: '0 0 16px 0', fontWeight: 800, fontSize: '1.8rem', color: '#0f172a' }}>
                {laporan.lokasi}
              </h1>

              <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={personOutline} />
                  <span>Pelapor: <strong>{laporan.nama_pelapor || laporan.nama}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={calendarOutline} />
                  <span>Tanggal Masuk: {laporan.created_at || laporan.tanggal || '-'}</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

              <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Deskripsi Masalah:</h4>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', marginBottom: '24px' }}>
                {laporan.deskripsi}
              </div>

              {laporan.status === 'Selesai' ? (
                <div style={{ textAlign: 'center', padding: '12px', background: '#d1e7dd', color: '#0f5132', borderRadius: '8px', fontWeight: 600 }}>
                  <IonIcon icon={checkmarkCircleOutline} style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem' }} />
                  Laporan Ini Sudah Ditangani
                </div>
              ) : role === 'petugas' ? (
                <IonButton
                  expand="block"
                  color="success"
                  onClick={handleSelesai}
                  disabled={loading}
                  style={{ height: '48px', fontWeight: 700, '--border-radius': '8px' }}
                >
                  {loading ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon slot="start" icon={checkmarkCircleOutline} />
                      TANDAI LAPORAN SELESAI
                    </>
                  )}
                </IonButton>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', background: '#fff3cd', color: '#664d03', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <IonIcon icon={timeOutline} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  *Laporan sedang ditangani oleh Petugas Sarpras.
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2500}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

export default Detail;