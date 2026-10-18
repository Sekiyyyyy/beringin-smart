import React, { useState, useContext, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
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
  sparklesOutline,
  addCircleOutline,
  handRightOutline,
  funnelOutline,
  layersOutline,
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

  // Mobile View Switcher (Daftar Laporan vs Buat Laporan)
  const [activeTab, setActiveTab] = useState<'daftar' | 'buat'>('daftar');

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

  // Auth Guard: Arahkan ke /login jika belum ada token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  // Statistik Laporan dengan proteksi array
  const list = Array.isArray(laporanList) ? laporanList : [];
  const totalLaporan = list.length;
  const laporanSelesai = list.filter((item) => item && item.status === 'Selesai').length;
  const laporanPending = totalLaporan - laporanSelesai;

  // Filter List Data berdasarkan Search & Kategori secara aman
  const filteredList = list.filter((item) => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const query = (searchQuery || '').toLowerCase();
    const lokasiStr = (item.lokasi || '').toLowerCase();
    const namaPelaporStr = (item.nama_pelapor || item.nama || '').toLowerCase();
    const deskripsiStr = (item.deskripsi || '').toLowerCase();
    const matchesSearch = lokasiStr.includes(query) || namaPelaporStr.includes(query) || deskripsiStr.includes(query);
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
      setActiveTab('daftar'); // Alihkan ke tab daftar agar user langsung melihat tiket barunya
    } else {
      setToastMessage('Gagal mengirim laporan! Periksa koneksi backend.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const categories = ['Semua', 'Fasilitas Kelas', 'Laboratorium', 'Lingkungan/Taman'];

  return (
    <IonPage>
      {/* 21st.dev Translucent Liquid Glass Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-header-toolbar">
          {/* Brand & App Info */}
          <div slot="start" className="mobile-header-brand">
            <div className="mobile-logo-box" style={{ padding: '4px', background: 'rgba(255, 255, 255, 0.08)' }}>
              <img src="/logo-smkn1beringin.png" alt="SMKN 1 Beringin" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div className="mobile-brand-text">
              <h1 className="mobile-brand-title">Beringin Smart</h1>
              <div className="mobile-brand-subtitle">
                <span>SMKN 1</span>
                <span>•</span>
                <span
                  style={{
                    color: userRole === 'petugas' ? '#34d399' : '#c4b5fd',
                    fontWeight: 700,
                  }}
                >
                  {userRole === 'petugas' ? 'Petugas Sarpras' : 'Siswa'}
                </span>
              </div>
            </div>
          </div>

          {/* User Avatar & Logout Button */}
          <IonButtons slot="end" className="mobile-header-end">
            <div className="mobile-avatar-pill">
              <div className="mobile-avatar-circle">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <span className="mobile-user-name">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
              </span>
            </div>

            <IonButton
              color="light"
              fill="clear"
              size="small"
              onClick={handleLogout}
              className="mobile-logout-btn"
              title="Keluar / Logout"
            >
              <IonIcon slot="icon-only" icon={logOutOutline} style={{ fontSize: '1.25rem' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{
          '--background': `
            radial-gradient(circle at 12% 18%, rgba(99, 102, 241, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 88% 15%, rgba(236, 72, 153, 0.18) 0%, transparent 40%),
            radial-gradient(circle at 50% 85%, rgba(6, 182, 212, 0.16) 0%, transparent 50%),
            #080c14
          `,
        } as React.CSSProperties}
      >
        <IonGrid fixed style={{ maxWidth: '1200px', padding: 0 }}>
          {/* Liquid Glass Hero Greeting Banner */}
          <div className="home-hero-greeting">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Halo, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Rizky'}
                  <IonIcon icon={handRightOutline} style={{ color: '#fbbf24', fontSize: '1.2rem', marginLeft: '8px' }} />
                </h2>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  {userRole === 'petugas' ? 'Pantau & tindak lanjuti laporan sarpras sekolah.' : 'Laporkan kendala fasilitas sekolah untuk tindak lanjut cepat.'}
                </p>
              </div>

              <IonButton
                size="small"
                fill="outline"
                color="secondary"
                onClick={() => refreshLaporan()}
                style={{
                  height: '32px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  '--border-radius': '9999px',
                  '--border-color': 'rgba(168, 85, 247, 0.5)',
                  '--color': '#c4b5fd',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <IonIcon slot="icon-only" icon={sparklesOutline} />
              </IonButton>
            </div>
          </div>

          {/* 3-Column 21st.dev Liquid Stat Grid */}
          <IonRow className="mobile-stats-row" style={{ marginBottom: '14px' }}>
            {/* Total Laporan */}
            <IonCol size="4">
              <div
                className="liquid-stat-card"
                style={{
                  background: 'var(--liquid-gradient-card-cyan)',
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', color: '#38bdf8' }}>
                  <IonIcon icon={layersOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#f0f9ff',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                    textShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                  }}
                >
                  {totalLaporan}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Total
                </div>
              </div>
            </IonCol>

            {/* Menunggu / Proses */}
            <IonCol size="4">
              <div
                className="liquid-stat-card"
                style={{
                  background: 'var(--liquid-gradient-card-amber)',
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', color: '#fbbf24' }}>
                  <IonIcon icon={timeOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#fffbeb',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                    textShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
                  }}
                >
                  {laporanPending}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Proses
                </div>
              </div>
            </IonCol>

            {/* Selesai */}
            <IonCol size="4">
              <div
                className="liquid-stat-card"
                style={{
                  background: 'var(--liquid-gradient-card-emerald)',
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', color: '#34d399' }}>
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#ecfdf5',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                    textShadow: '0 0 15px rgba(52, 211, 153, 0.4)',
                  }}
                >
                  {laporanSelesai}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Selesai
                </div>
              </div>
            </IonCol>
          </IonRow>

          {/* Mobile Segment Switcher (Hanya tampil di layar kecil < 992px) */}
          <div className="ion-hide-lg-up">
            <IonSegment
              value={activeTab}
              onIonChange={(e) => setActiveTab(e.detail.value as 'daftar' | 'buat')}
              className="mobile-view-segment"
            >
              <IonSegmentButton value="daftar">
                <IonLabel>
                  <IonIcon icon={listOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Daftar Laporan ({filteredList.length})
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="buat">
                <IonLabel>
                  <IonIcon icon={addCircleOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Buat Laporan
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Main Layout: Responsive Grid */}
          <IonRow>
            {/* Form Buat Laporan (Desktop: Selalu Tampil; Mobile: Tampil jika activeTab === 'buat') */}
            <IonCol
              size="12"
              sizeLg="5"
              className={activeTab !== 'buat' ? 'ion-hide-lg-down' : ''}
              style={{ marginBottom: '16px' }}
            >
              <IonCard className="liquid-glass-card" style={{ margin: 0 }}>
                <IonCardHeader style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
                        color: '#c4b5fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      <IonIcon icon={documentTextOutline} />
                    </div>
                    <div>
                      <IonCardSubtitle style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        LAYANAN SARPRAS
                      </IonCardSubtitle>
                      <IonCardTitle
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        Buat Tiket Pengaduan
                      </IonCardTitle>
                    </div>
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '18px' }}>
                  <form onSubmit={handleSubmit}>
                    {/* Nama Pelapor */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Nama Pelapor
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '0 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <IonIcon icon={personOutline} style={{ color: '#a855f7', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Masukkan nama lengkap Anda"
                          value={nama}
                          onIonInput={(e) => setNama(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#ffffff' }}
                        />
                      </div>
                    </div>

                    {/* Lokasi / Ruangan */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Lokasi / Ruangan
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '0 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <IonIcon icon={locationOutline} style={{ color: '#a855f7', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Contoh: Lab Komputer 2"
                          value={lokasi}
                          onIonInput={(e) => setLokasi(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#ffffff' }}
                        />
                      </div>
                    </div>

                    {/* Kategori Fasilitas */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Kategori Fasilitas
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '0 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <IonIcon icon={listOutline} style={{ color: '#a855f7', marginRight: '8px' }} />
                        <IonSelect
                          value={kategori}
                          placeholder="Pilih kategori fasilitas"
                          onIonChange={(e) => setKategori(e.detail.value)}
                          style={{ width: '100%', fontSize: '0.88rem', color: '#ffffff' }}
                        >
                          <IonSelectOption value="Fasilitas Kelas">Fasilitas Kelas</IonSelectOption>
                          <IonSelectOption value="Laboratorium">Laboratorium</IonSelectOption>
                          <IonSelectOption value="Lingkungan/Taman">Lingkungan/Taman</IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>

                    {/* Deskripsi Masalah */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Detail Kerusakan
                      </label>
                      <div
                        style={{
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '4px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <IonTextarea
                          rows={3}
                          placeholder="Jelaskan secara jelas kendala fasilitas yang ditemukan..."
                          value={deskripsi}
                          onIonInput={(e) => setDeskripsi(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#ffffff' }}
                        />
                      </div>
                    </div>

                    {/* Tombol Kirim */}
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={submitting}
                      className="liquid-btn-primary"
                      style={{
                        height: '46px',
                        margin: 0,
                        fontSize: '0.92rem',
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

            {/* List Tiket Laporan (Desktop: Selalu Tampil; Mobile: Tampil jika activeTab === 'daftar') */}
            <IonCol
              size="12"
              sizeLg="7"
              className={activeTab !== 'daftar' ? 'ion-hide-lg-down' : ''}
            >
              {/* Header Feed + Searchbar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Daftar Tiket Pengaduan
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Menampilkan {filteredList.length} dari {totalLaporan} laporan
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#34d399',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="liquid-pulse-dot" style={{ backgroundColor: '#10b981' }} />
                    Live Sync
                  </div>
                </div>

                {/* Glass Search Bar */}
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Cari lokasi, kendala, atau nama..."
                  style={{
                    padding: 0,
                    '--background': 'rgba(255, 255, 255, 0.05)',
                    '--color': '#ffffff',
                    '--placeholder-color': '#94a3b8',
                    '--icon-color': '#a855f7',
                    '--border-radius': '14px',
                    '--box-shadow': 'none',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(12px)',
                  } as React.CSSProperties}
                />

                {/* Filter Kategori Scrollable */}
                <div className="category-filter-scroll">
                  {categories.map((cat) => (
                    <IonChip
                      key={cat}
                      className={selectedCategory === cat ? 'filter-chip-active' : 'filter-chip-inactive'}
                      onClick={() => setSelectedCategory(cat)}
                      style={{ cursor: 'pointer', fontSize: '0.76rem', height: '30px' }}
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
                  <IonIcon icon={businessOutline} style={{ fontSize: '2.8rem', color: '#a855f7', opacity: 0.5, marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc' }}>Tidak ada tiket pengaduan</p>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    Coba ubah kata kunci pencarian atau kategori
                  </span>
                </div>
              ) : (
                <IonList style={{ background: 'transparent', padding: 0 }}>
                  {filteredList.map((item) => (
                    <div
                      key={item.id}
                      className={`liquid-ticket-item ${item.status === 'Selesai' ? 'completed' : 'pending'}`}
                      onClick={() => router.push(`/detail/${item.id}`)}
                      style={{ padding: '16px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span
                              style={{
                                background: 'rgba(99, 102, 241, 0.18)',
                                color: '#a5b4fc',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(165, 180, 252, 0.3)',
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              {item.kategori}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              #{item.id}
                            </span>
                          </div>

                          <h4
                            style={{
                              margin: '0 0 4px 0',
                              fontSize: '1.02rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontFamily: "'Outfit', sans-serif",
                            }}
                          >
                            {item.lokasi}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        {item.status === 'Selesai' ? (
                          <div className="liquid-badge-completed">
                            <IonIcon icon={checkmarkCircleOutline} /> Selesai
                          </div>
                        ) : (
                          <div className="liquid-badge-pending">
                            <span className="liquid-pulse-dot" /> {item.status || 'Menunggu'}
                          </div>
                        )}
                      </div>

                      <p style={{ margin: '4px 0 12px 0', fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.45' }}>
                        {item.deskripsi.length > 80 ? `${item.deskripsi.substring(0, 80)}...` : item.deskripsi}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingTop: '10px',
                          fontSize: '0.76rem',
                          color: '#94a3b8',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                          <IonIcon icon={personOutline} style={{ color: '#a855f7', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Pelapor: <strong style={{ color: '#e2e8f0' }}>{item.nama_pelapor || item.nama}</strong>
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <span>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                              : item.tanggal || '-'}
                          </span>
                          <IonIcon icon={chevronForwardOutline} style={{ color: '#a855f7' }} />
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