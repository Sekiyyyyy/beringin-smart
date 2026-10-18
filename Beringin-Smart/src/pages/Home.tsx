import React, { useState, useContext } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToast,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonChip,
  IonButtons,
} from '@ionic/react';
import {
  documentTextOutline,
  sendOutline,
  businessOutline,
  personOutline,
  locationOutline,
  listOutline,
  statsChartOutline,
  checkmarkCircleOutline,
  timeOutline,
  chevronForwardOutline,
  logOutOutline,
} from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { LaporanContext } from '../context/LaporanContext';

const Home: React.FC = () => {
  const router = useIonRouter();
  const { laporanList, tambahLaporan } = useContext(LaporanContext);

  // Local State Form
  const [nama, setNama] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Laporan berhasil dikirim ke tim Sarpras!');

  // User Info & Role dari LocalStorage
  const userRole = localStorage.getItem('role') || 'siswa';
  const userJson = localStorage.getItem('user');
  const currentUser = userJson ? JSON.parse(userJson) : null;

  // Handler Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Statistik Laporan
  const totalLaporan = laporanList.length;
  const laporanSelesai = laporanList.filter((item) => item.status === 'Selesai').length;
  const laporanPending = totalLaporan - laporanSelesai;

  // Handler Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !lokasi || !kategori || !deskripsi) {
      alert('Mohon isi seluruh form pengaduan!');
      return;
    }

    const success = await tambahLaporan({ nama, lokasi, kategori, deskripsi });

    if (success) {
      setNama('');
      setLokasi('');
      setKategori('');
      setDeskripsi('');
      setToastMessage('Laporan berhasil dikirim ke tim Sarpras!');
      setShowToast(true);
    } else {
      setToastMessage('Gagal mengirim laporan! Periksa koneksi backend.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      {/* Header Enterprise Modern */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="dark">
          <IonTitle style={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            BERINGIN SMART{' '}
            <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 400 }}>
              | {userRole === 'petugas' ? 'Petugas Sarpras' : 'Siswa'} ({currentUser?.name || 'User'})
            </span>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton color="light" fill="clear" onClick={handleLogout} title="Keluar / Logout">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' } as React.CSSProperties}>
        <IonGrid fixed>
          {/* Ringkasan Dashboard / Metrics Cards */}
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard style={{ margin: 0, borderRadius: '12px', borderLeft: '4px solid #3880ff' }}>
                <IonCardContent className="ion-flex ion-align-items-center">
                  <IonIcon icon={statsChartOutline} style={{ fontSize: '2rem', color: '#3880ff', marginRight: '12px' }} />
                  <div>
                    <IonCardSubtitle style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>Total Pengaduan</IonCardSubtitle>
                    <IonCardTitle style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalLaporan}</IonCardTitle>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard style={{ margin: 0, borderRadius: '12px', borderLeft: '4px solid #ffc409' }}>
                <IonCardContent className="ion-flex ion-align-items-center">
                  <IonIcon icon={timeOutline} style={{ fontSize: '2rem', color: '#ffc409', marginRight: '12px' }} />
                  <div>
                    <IonCardSubtitle style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>Dalam Proses / Menunggu</IonCardSubtitle>
                    <IonCardTitle style={{ fontSize: '1.5rem', fontWeight: 700 }}>{laporanPending}</IonCardTitle>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard style={{ margin: 0, borderRadius: '12px', borderLeft: '4px solid #2dd36f' }}>
                <IonCardContent className="ion-flex ion-align-items-center">
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '2rem', color: '#2dd36f', marginRight: '12px' }} />
                  <div>
                    <IonCardSubtitle style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>Selesai Ditangani</IonCardSubtitle>
                    <IonCardTitle style={{ fontSize: '1.5rem', fontWeight: 700 }}>{laporanSelesai}</IonCardTitle>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Main Layout: Form & List Data */}
          <IonRow className="ion-margin-top">
            {/* Form Input Laporan */}
            <IonCol size="12" sizeLg="5">
              <IonCard style={{ margin: 0, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <IonCardHeader>
                  <IonCardSubtitle style={{ color: '#3880ff', fontWeight: 600 }}>FORM PENGADUAN SARPRAS</IonCardSubtitle>
                  <IonCardTitle style={{ fontWeight: 700 }}>Buat Tiket Laporan</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <form onSubmit={handleSubmit}>
                    <IonInput
                      fill="outline"
                      label="Nama Pelapor"
                      labelPlacement="floating"
                      placeholder="Masukkan nama lengkap"
                      value={nama}
                      onIonInput={(e) => setNama(e.detail.value!)}
                      className="ion-margin-bottom"
                    >
                      <IonIcon slot="start" icon={personOutline} aria-hidden="true" />
                    </IonInput>

                    <IonInput
                      fill="outline"
                      label="Lokasi / Ruangan"
                      labelPlacement="floating"
                      placeholder="Contoh: Lab PPLG 1"
                      value={lokasi}
                      onIonInput={(e) => setLokasi(e.detail.value!)}
                      className="ion-margin-bottom"
                    >
                      <IonIcon slot="start" icon={locationOutline} aria-hidden="true" />
                    </IonInput>

                    <IonSelect
                      fill="outline"
                      label="Kategori Laporan"
                      labelPlacement="floating"
                      value={kategori}
                      placeholder="Pilih Kategori"
                      onIonChange={(e) => setKategori(e.detail.value)}
                      className="ion-margin-bottom"
                    >
                      <IonIcon slot="start" icon={listOutline} aria-hidden="true" />
                      <IonSelectOption value="Fasilitas Kelas">Fasilitas Kelas</IonSelectOption>
                      <IonSelectOption value="Laboratorium">Laboratorium</IonSelectOption>
                      <IonSelectOption value="Lingkungan/Taman">Lingkungan/Taman</IonSelectOption>
                    </IonSelect>

                    <IonTextarea
                      fill="outline"
                      label="Deskripsi Masalah"
                      labelPlacement="floating"
                      rows={3}
                      placeholder="Jelaskan kendala secara rinci..."
                      value={deskripsi}
                      onIonInput={(e) => setDeskripsi(e.detail.value!)}
                      className="ion-margin-bottom"
                    >
                      <IonIcon slot="start" icon={documentTextOutline} aria-hidden="true" />
                    </IonTextarea>

                    <IonButton
                      expand="block"
                      type="submit"
                      color="primary"
                      style={{ height: '48px', fontWeight: 600, '--border-radius': '8px' }}
                    >
                      <IonIcon slot="start" icon={sendOutline} />
                      Kirim Laporan
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* List Data Laporan */}
            <IonCol size="12" sizeLg="7">
              <div className="ion-flex ion-justify-content-between ion-align-items-center ion-padding-horizontal ion-margin-bottom">
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Daftar Laporan Terkini</h3>
                <IonChip color="primary" style={{ fontWeight: 600 }}>Realtime Sync</IonChip>
              </div>

              <IonList style={{ background: 'transparent' }}>
                {laporanList.map((item) => (
                  <IonCard
                    key={item.id}
                    button
                    onClick={() => router.push(`/detail/${item.id}`)}
                    style={{
                      margin: '0 0 12px 0',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <IonCardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <IonBadge color="light" style={{ color: '#475569', marginBottom: '6px', fontWeight: 500 }}>
                            <IonIcon icon={businessOutline} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {item.kategori}
                          </IonBadge>
                          <h2 style={{ margin: '4px 0', fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                            {item.lokasi}
                          </h2>
                        </div>
                        <IonBadge color={item.status === 'Selesai' ? 'success' : 'warning'} style={{ padding: '6px 10px', borderRadius: '6px' }}>
                          {item.status}
                        </IonBadge>
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                        <span>Pelapor: <strong>{item.nama_pelapor || item.nama}</strong></span>
                        <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : item.tanggal || '-'}</span>
                        <IonIcon icon={chevronForwardOutline} style={{ fontSize: '1rem', color: '#94a3b8' }} />
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Notifikasi Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          color="dark"
          icon={checkmarkCircleOutline}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;