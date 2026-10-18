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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonChip,
  IonButtons,
  IonSearchbar,
  IonSpinner,
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
  schoolOutline,
  funnelOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { LaporanContext } from '../context/LaporanContext';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();
  const { laporanList, tambahLaporan, refreshLaporan } = useContext(LaporanContext);

  // Local State Form
  const [nama, setNama] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('dark');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // User Info & Role
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

  // Filter List Data berdasarkan Search & Kategori
  const filteredList = laporanList.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.lokasi.toLowerCase().includes(query) ||
      (item.nama && item.nama.toLowerCase().includes(query)) ||
      (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(query)) ||
      item.deskripsi.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Handler Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !lokasi || !kategori || !deskripsi) {
      setToastMessage('Mohon lengkapi seluruh formulir pengaduan!');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setSubmitting(true);
    const success = await tambahLaporan({ nama, lokasi, kategori, deskripsi });
    setSubmitting(false);

    if (success) {
      setNama('');
      setLokasi('');
      setKategori('');
      setDeskripsi('');
      setToastMessage('Tiket pengaduan berhasil dikirim ke tim Sarpras!');
      setToastColor('success');
      setShowToast(true);
    } else {
      setToastMessage('Gagal mengirim laporan! Periksa koneksi backend.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const categories = ['Semua', 'Fasilitas Kelas', 'Laboratorium', 'Lingkungan/Taman'];

  return (
    <IonPage>
      {/* Enterprise Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-header-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
              }}
            >
              <IonIcon icon={schoolOutline} style={{ color: '#ffffff', fontSize: '1.3rem' }} />
            </div>

            <div>
              <IonTitle style={{ padding: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.3px' }}>
                BERINGIN SMART
              </IonTitle>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>SMKN 1 Beringin</span>
                <span>•</span>
                <span
                  style={{
                    color: userRole === 'petugas' ? '#34d399' : '#60a5fa',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {userRole === 'petugas' ? 'Petugas Sarpras' : 'Siswa'}
                </span>
              </div>
            </div>
          </div>

          <IonButtons slot="end">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 12px 4px 6px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: userRole === 'petugas' ? '#10b981' : '#3b82f6',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
              </span>

              <IonButton
                color="light"
                fill="clear"
                size="small"
                onClick={handleLogout}
                title="Keluar / Logout"
                style={{ margin: 0, padding: 0 }}
              >
                <IonIcon slot="icon-only" icon={logOutOutline} style={{ fontSize: '1.2rem', color: '#f87171' }} />
              </IonButton>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' } as React.CSSProperties}>
        <IonGrid fixed style={{ maxWidth: '1200px' }}>
          {/* Greeting Banner */}
          <div className="home-hero-greeting">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                  Halo, {currentUser?.name || 'Pengguna'} 👋
                </h1>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                  {userRole === 'petugas'
                    ? 'Kelola dan tindak lanjuti laporan kerusakan sarpras sekolah secara realtime.'
                    : 'Laporkan kendala fasilitas kelas dan laboratorium untuk segera ditangani tim Sarpras.'}
                </p>
              </div>

              <IonButton
                size="small"
                fill="outline"
                color="primary"
                onClick={() => refreshLaporan()}
                style={{ fontWeight: 600, fontSize: '0.8rem', '--border-radius': '20px' }}
              >
                <IonIcon slot="start" icon={sparklesOutline} /> Segarkan Data
              </IonButton>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <IonRow>
            {/* Total Laporan */}
            <IonCol size="12" sizeMd="4">
              <div
                className="bs-metric-card"
                style={{ background: 'var(--bg-gradient-card-blue)', padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Pengaduan
                    </span>
                    <h2 style={{ margin: '4px 0 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a' }}>
                      {totalLaporan}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 500 }}>
                      Tiket masuk di sistem
                    </span>
                  </div>
                  <div className="bs-icon-bubble" style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <IonIcon icon={statsChartOutline} />
                  </div>
                </div>
              </div>
            </IonCol>

            {/* Dalam Proses */}
            <IonCol size="12" sizeMd="4">
              <div
                className="bs-metric-card"
                style={{ background: 'var(--bg-gradient-card-amber)', padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Menunggu / Proses
                    </span>
                    <h2 style={{ margin: '4px 0 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#92400e' }}>
                      {laporanPending}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 500 }}>
                      Memerlukan penanganan
                    </span>
                  </div>
                  <div className="bs-icon-bubble" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <IonIcon icon={timeOutline} />
                  </div>
                </div>
              </div>
            </IonCol>

            {/* Selesai */}
            <IonCol size="12" sizeMd="4">
              <div
                className="bs-metric-card"
                style={{ background: 'var(--bg-gradient-card-green)', padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Selesai Ditangani
                    </span>
                    <h2 style={{ margin: '4px 0 0 0', fontSize: '2.2rem', fontWeight: 800, color: '#065f46' }}>
                      {laporanSelesai}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
                      Telah diselesaikan petugas
                    </span>
                  </div>
                  <div className="bs-icon-bubble" style={{ background: '#d1fae5', color: '#059669' }}>
                    <IonIcon icon={checkmarkCircleOutline} />
                  </div>
                </div>
              </div>
            </IonCol>
          </IonRow>

          {/* Main Layout: Form (Left) & Feed (Right) */}
          <IonRow className="ion-margin-top">
            {/* Form Buat Laporan */}
            <IonCol size="12" sizeLg="5">
              <IonCard className="bs-form-card" style={{ margin: 0 }}>
                <IonCardHeader style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
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
                      <IonIcon icon={documentTextOutline} />
                    </div>
                    <div>
                      <IonCardSubtitle style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        LAYANAN SARPRAS
                      </IonCardSubtitle>
                      <IonCardTitle style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        Buat Tiket Pengaduan
                      </IonCardTitle>
                    </div>
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ paddingTop: '20px' }}>
                  <form onSubmit={handleSubmit}>
                    {/* Nama Pelapor */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Nama Pelapor
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                        <IonIcon icon={personOutline} style={{ color: '#64748b', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Masukkan nama lengkap Anda"
                          value={nama}
                          onIonInput={(e) => setNama(e.detail.value!)}
                          style={{ fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    {/* Lokasi / Ruangan */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Lokasi / Ruangan
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                        <IonIcon icon={locationOutline} style={{ color: '#64748b', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Contoh: Lab Komputer 2 / XI PPLG 1"
                          value={lokasi}
                          onIonInput={(e) => setLokasi(e.detail.value!)}
                          style={{ fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    {/* Kategori Fasilitas */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Kategori Fasilitas
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 12px', background: '#f8fafc' }}>
                        <IonIcon icon={listOutline} style={{ color: '#64748b', marginRight: '8px' }} />
                        <IonSelect
                          value={kategori}
                          placeholder="Pilih kategori kerusakan"
                          onIonChange={(e) => setKategori(e.detail.value)}
                          style={{ width: '100%', fontSize: '0.9rem' }}
                        >
                          <IonSelectOption value="Fasilitas Kelas">Fasilitas Kelas</IonSelectOption>
                          <IonSelectOption value="Laboratorium">Laboratorium</IonSelectOption>
                          <IonSelectOption value="Lingkungan/Taman">Lingkungan/Taman</IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>

                    {/* Deskripsi Masalah */}
                    <div style={{ marginBottom: '22px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Detail Kerusakan
                      </label>
                      <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '6px 12px', background: '#f8fafc' }}>
                        <IonTextarea
                          rows={3}
                          placeholder="Jelaskan secara jelas kendala fasilitas..."
                          value={deskripsi}
                          onIonInput={(e) => setDeskripsi(e.detail.value!)}
                          style={{ fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    {/* Tombol Kirim */}
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={submitting}
                      style={{
                        height: '46px',
                        margin: 0,
                        '--background': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        '--border-radius': '10px',
                        '--box-shadow': '0 6px 16px rgba(37, 99, 235, 0.3)',
                        fontWeight: 700,
                      }}
                    >
                      {submitting ? (
                        <IonSpinner name="crescent" color="light" />
                      ) : (
                        <>
                          <IonIcon slot="start" icon={sendOutline} /> Kirim Pengaduan
                        </>
                      )}
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* List Tiket Laporan Terkini */}
            <IonCol size="12" sizeLg="7">
              {/* Header Feed + Searchbar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      Daftar Tiket Pengaduan
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Menampilkan {filteredList.length} dari {totalLaporan} laporan
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#059669',
                    }}
                  >
                    <span className="bs-pulse-dot" style={{ backgroundColor: '#10b981' }} />
                    Live Sync
                  </div>
                </div>

                {/* Search Bar */}
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Cari lokasi, pelapor, atau kendala..."
                  style={{
                    padding: 0,
                    '--background': '#ffffff',
                    '--border-radius': '12px',
                    '--box-shadow': '0 2px 8px rgba(0,0,0,0.04)',
                  } as React.CSSProperties}
                />

                {/* Filter Kategori Chips */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 0', marginTop: '6px' }}>
                  {categories.map((cat) => (
                    <IonChip
                      key={cat}
                      className={selectedCategory === cat ? 'filter-chip-active' : 'filter-chip-inactive'}
                      onClick={() => setSelectedCategory(cat)}
                      style={{ cursor: 'pointer', fontSize: '0.8rem', margin: 0 }}
                    >
                      {cat === 'Semua' && <IonIcon icon={funnelOutline} style={{ marginRight: '4px' }} />}
                      {cat}
                    </IonChip>
                  ))}
                </div>
              </div>

              {/* Feed List Items */}
              {filteredList.length === 0 ? (
                <div className="empty-state-box">
                  <IonIcon icon={businessOutline} style={{ fontSize: '3rem', opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada tiket pengaduan yang cocok</p>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Coba ganti kata kunci pencarian atau kategori filter
                  </span>
                </div>
              ) : (
                <IonList style={{ background: 'transparent', padding: 0 }}>
                  {filteredList.map((item) => (
                    <div
                      key={item.id}
                      className="ticket-card-hover"
                      onClick={() => router.push(`/detail/${item.id}`)}
                      style={{
                        background: '#ffffff',
                        padding: '16px 18px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#2563eb',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: '1px solid #bfdbfe',
                              }}
                            >
                              {item.kategori}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              #{item.id}
                            </span>
                          </div>

                          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {item.lokasi}
                          </h3>
                        </div>

                        {/* Status Badge with custom indicator */}
                        {item.status === 'Selesai' ? (
                          <div className="bs-badge-completed">
                            <IonIcon icon={checkmarkCircleOutline} /> Selesai
                          </div>
                        ) : (
                          <div className="bs-badge-pending">
                            <span className="bs-pulse-dot" /> {item.status || 'Menunggu'}
                          </div>
                        )}
                      </div>

                      <p style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                        {item.deskripsi.length > 90 ? `${item.deskripsi.substring(0, 90)}...` : item.deskripsi}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '10px',
                          fontSize: '0.78rem',
                          color: '#64748b',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <IonIcon icon={personOutline} style={{ color: '#94a3b8' }} />
                          <span>Pelapor: <strong style={{ color: '#334155' }}>{item.nama_pelapor || item.nama}</strong></span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : item.tanggal || '-'}
                          </span>
                          <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </IonList>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Notifikasi Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;