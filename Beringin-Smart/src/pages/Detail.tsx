import React, { useContext, useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonToast,
  IonSpinner,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  timeOutline,
  personOutline,
  calendarOutline,
  locationOutline,
  businessOutline,
  alertCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { LaporanContext } from '../context/LaporanContext';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const idLaporan = id || '';
  const { getLaporanById, ubahStatusLaporan } = useContext(LaporanContext);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastColor, setToastColor] = useState('dark');

  const laporan = getLaporanById(idLaporan);
  const role = localStorage.getItem('role') || 'siswa';

  // Auth Guard: Arahkan ke /login jika belum ada token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  const handleSelesai = async () => {
    if (!idLaporan) return;
    setLoading(true);
    const success = await ubahStatusLaporan(idLaporan, 'Selesai');
    setLoading(false);

    if (success) {
      setToastMsg('Status laporan berhasil diperbarui menjadi Selesai!');
      setToastColor('success');
      setShowToast(true);
    } else {
      setToastMsg('Gagal memperbarui status. Periksa hak akses atau koneksi backend!');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  if (!laporan) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--color': '#0f172a', borderBottom: '1px solid #e2e8f0' } as React.CSSProperties}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="Kembali" color="dark" />
            </IonButtons>
            <IonTitle style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Rincian Tiket Laporan</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          className="ion-padding ion-text-center"
          style={{ '--background': '#f8fafc' } as React.CSSProperties}
        >
          <div
            style={{
              maxWidth: '400px',
              margin: '60px auto',
              padding: '32px',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
            }}
          >
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '3.2rem', color: '#f59e0b', marginBottom: '14px' }} />
            <h3 style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              Data Tidak Ditemukan
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Tiket pengaduan yang Anda cari tidak tersedia atau telah dihapus.
            </p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const isCompleted = laporan.status === 'Selesai';

  return (
    <IonPage>
      {/* Light Mode Liquid Glass Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar
          style={{
            '--background': 'rgba(255, 255, 255, 0.9)',
            '--color': '#0f172a',
            borderBottom: '1px solid #e2e8f0',
            backdropFilter: 'blur(20px)',
          } as React.CSSProperties}
        >
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="KEMBALI" color="dark" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 800, letterSpacing: '-0.3px', fontSize: '1.05rem', fontFamily: "'Outfit', sans-serif" }}>
            Rincian Tiket #{laporan.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{ '--background': '#f8fafc', position: 'relative' } as React.CSSProperties}
      >
        {/* Ambient Floating Liquid Mesh Canvas */}
        <div className="home-liquid-canvas">
          <div className="liquid-blob blob-1" />
          <div className="liquid-blob blob-2" />
          <div className="liquid-blob blob-3" />
        </div>

        <div style={{ maxWidth: '640px', margin: '24px auto', position: 'relative', zIndex: 1 }}>
          {/* Light Mode Liquid Glass Main Card */}
          <IonCard
            style={{
              margin: 0,
              borderRadius: '24px',
              boxShadow: '0 20px 45px -12px rgba(99, 102, 241, 0.12), inset 0 1.5px 1px #ffffff',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderTop: '1.5px solid #ffffff',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.68)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            }}
          >
            {/* Top Status Banner */}
            <div
              style={{
                background: isCompleted
                  ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                  : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                padding: '16px 22px',
                borderBottom: `1px solid ${isCompleted ? '#a7f3d0' : '#fde68a'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#ffffff',
                    color: '#4f46e5',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #c7d2fe',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <IonIcon icon={businessOutline} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  {laporan.kategori}
                </span>
              </div>

              {isCompleted ? (
                <div className="liquid-badge-completed">
                  <IonIcon icon={checkmarkCircleOutline} /> Selesai Ditangani
                </div>
              ) : (
                <div className="liquid-badge-pending">
                  <span className="liquid-pulse-dot" /> Sedang Diproses
                </div>
              )}
            </div>

            <IonCardContent style={{ padding: '24px' }}>
              {/* Lokasi Ruangan */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', marginBottom: '6px' }}>
                  <IonIcon icon={locationOutline} style={{ fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Lokasi / Ruangan
                  </span>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.3px',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {laporan.lokasi}
                </h2>
              </div>

              {/* Rincian Masalah */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
                  Deskripsi Kerusakan
                </label>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '0.94rem',
                    lineHeight: '1.6',
                  }}
                >
                  {laporan.deskripsi}
                </div>
              </div>

              {/* Info Pelapor & Waktu */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  background: '#f1f5f9',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <IonIcon icon={personOutline} /> Pelapor
                  </div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem', marginTop: '3px' }}>
                    {laporan.nama_pelapor || laporan.nama || 'Anonim'}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <IonIcon icon={calendarOutline} /> Tanggal Masuk
                  </div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem', marginTop: '3px' }}>
                    {laporan.created_at
                      ? new Date(laporan.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : laporan.tanggal || '-'}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Sarpras / Petugas */}
              {role === 'petugas' ? (
                <div>
                  {!isCompleted ? (
                    <IonButton
                      expand="block"
                      onClick={handleSelesai}
                      disabled={loading}
                      className="liquid-btn-primary"
                      style={{
                        height: '48px',
                        fontSize: '0.94rem',
                      }}
                    >
                      {loading ? (
                        <IonSpinner name="crescent" color="light" />
                      ) : (
                        <>
                          <IonIcon slot="start" icon={checkmarkCircleOutline} />
                          Tandai Penanganan Selesai
                        </>
                      )}
                    </IonButton>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '12px',
                        background: '#ecfdf5',
                        borderRadius: '9999px',
                        color: '#047857',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      <IonIcon icon={informationCircleOutline} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      Laporan ini telah selesai diverifikasi oleh Petugas Sarpras
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '9999px',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  Status penanganan dipantau secara langsung oleh Petugas Sarpras
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={3000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Detail;