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
          <IonToolbar style={{ '--background': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', '--color': '#ffffff' } as React.CSSProperties}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="Kembali" color="light" />
            </IonButtons>
            <IonTitle style={{ fontWeight: 700 }}>Rincian Tiket Laporan</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center" style={{ '--background': '#f8fafc' } as React.CSSProperties}>
          <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 6px 0', fontWeight: 800, color: '#0f172a' }}>Data Tidak Ditemukan</h3>
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
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)', '--color': '#ffffff' } as React.CSSProperties}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="KEMBALI" color="light" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 800, letterSpacing: '-0.3px', fontSize: '1.05rem' }}>
            Rincian Tiket #{laporan.id}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' } as React.CSSProperties}>
        <div style={{ maxWidth: '640px', margin: '24px auto' }}>
          {/* Main Detail Card */}
          <IonCard
            style={{
              margin: 0,
              borderRadius: '20px',
              boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              background: '#ffffff',
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
                    color: '#2563eb',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <IonIcon icon={businessOutline} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {laporan.kategori}
                </span>
              </div>

              {isCompleted ? (
                <div
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  <IonIcon icon={checkmarkCircleOutline} />
                  Selesai
                </div>
              ) : (
                <div
                  style={{
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)',
                  }}
                >
                  <span className="bs-pulse-dot" style={{ backgroundColor: '#ffffff' }} />
                  {laporan.status || 'Dalam Proses'}
                </div>
              )}
            </div>

            <IonCardContent style={{ padding: '24px' }}>
              {/* Location Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IonIcon icon={locationOutline} style={{ color: '#3b82f6', fontSize: '1.4rem' }} />
                <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', letterSpacing: '-0.3px' }}>
                  {laporan.lokasi}
                </h1>
              </div>

              {/* Meta Chips */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  margin: '18px 0 22px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IonIcon icon={personOutline} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PELAPOR</span>
                    <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>
                      {laporan.nama_pelapor || laporan.nama || 'Anonim'}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IonIcon icon={calendarOutline} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>TANGGAL MASUK</span>
                    <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>
                      {laporan.created_at
                        ? new Date(laporan.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : laporan.tanggal || '-'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  Rincian Kerusakan Fasilitas
                </span>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    color: '#334155',
                    fontSize: '0.94rem',
                    lineHeight: '1.6',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  }}
                >
                  {laporan.deskripsi}
                </div>
              </div>

              {/* Action Area based on Role */}
              {isCompleted ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    color: '#166534',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '1.4rem' }} />
                  Laporan Ini Telah Ditangani & Dinyatakan Selesai
                </div>
              ) : role === 'petugas' ? (
                <div>
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={handleSelesai}
                    disabled={loading}
                    style={{
                      height: '50px',
                      margin: 0,
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      letterSpacing: '0.5px',
                      '--border-radius': '12px',
                      '--box-shadow': '0 8px 20px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    {loading ? (
                      <IonSpinner name="crescent" color="light" />
                    ) : (
                      <>
                        <IonIcon slot="start" icon={checkmarkCircleOutline} style={{ fontSize: '1.3rem' }} />
                        TANDAI LAPORAN SELESAI
                      </>
                    )}
                  </IonButton>
                  <span style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                    *Aksi ini akan memperbarui status di database server dan memberitahu pelapor.
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '14px 18px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <IonIcon icon={informationCircleOutline} style={{ fontSize: '1.2rem' }} />
                  Laporan sedang dalam antrean penanganan oleh Tim Sarpras SMKN 1 Beringin.
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