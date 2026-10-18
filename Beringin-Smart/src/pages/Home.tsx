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
  checkmarkCircleOutline,
  timeOutline,
  chevronForwardOutline,
  logOutOutline,
  syncOutline,
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
      {/* Light Mode Liquid Glass Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-header-toolbar">
          {/* Brand & App Info */}
          <div slot="start" className="mobile-header-brand">
            <div className="mobile-logo-box">
              <img
                src="/logo-smkn1beringin.png"
                alt="SMKN 1 Beringin"
              />
            </div>

            <div className="mobile-brand-text">
              <h1 className="mobile-brand-title">Beringin Smart</h1>
              <div className="mobile-brand-subtitle">
                <span>SMKN 1</span>
                <span>•</span>
                <span
                  style={{
                    color: userRole === 'petugas' ? '#059669' : '#4f46e5',
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
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Rizky'}
              </span>
            </div>

            <IonButton
              color="danger"
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
        style={{ '--background': '#f8fafc', position: 'relative' } as React.CSSProperties}
      >
        {/* Ambient Floating Liquid Mesh Canvas in Background */}
        <div className="home-liquid-canvas">
          <div className="liquid-blob blob-1" />
          <div className="liquid-blob blob-2" />
          <div className="liquid-blob blob-3" />
          <div className="liquid-blob blob-4" />
        </div>

        <IonGrid fixed style={{ maxWidth: '1200px', padding: 0, position: 'relative', zIndex: 1 }}>
          {/* Liquid Glass Hero Greeting Banner */}
          <div className="home-hero-greeting">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Halo, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Rizky'}
                  <IonIcon icon={handRightOutline} style={{ color: '#f59e0b', fontSize: '1.2rem', marginLeft: '8px' }} />
                </h2>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {userRole === 'petugas' ? 'Pantau & tindak lanjuti laporan sarpras sekolah.' : 'Laporkan kendala fasilitas sekolah untuk tindak lanjut cepat.'}
                </p>
              </div>

              {/* Sparkle Circle Button - Exactly 100% Round Circle */}
              <button
                type="button"
                onClick={() => refreshLaporan()}
                className="btn-sparkle-circle"
                title="Segarkan Data Laporan"
              >
                <IonIcon icon={sparklesOutline} />
              </button>
            </div>
          </div>

          {/* 3-Column Light Liquid Stat Grid */}
          <IonRow className="mobile-stats-row" style={{ marginBottom: '14px' }}>
            {/* Total Laporan */}
            <IonCol size="4">
              <div className="liquid-stat-card liquid-stat-total">
                <div style={{ fontSize: '1.35rem', color: '#0284c7' }}>
                  <IonIcon icon={layersOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#0369a1',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {totalLaporan}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Total
                </div>
              </div>
            </IonCol>

            {/* Menunggu / Proses */}
            <IonCol size="4">
              <div className="liquid-stat-card liquid-stat-pending">
                <div style={{ fontSize: '1.35rem', color: '#d97706' }}>
                  <IonIcon icon={timeOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#b45309',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {laporanPending}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Proses
                </div>
              </div>
            </IonCol>

            {/* Selesai */}
            <IonCol size="4">
              <div className="liquid-stat-card liquid-stat-completed">
                <div style={{ fontSize: '1.35rem', color: '#059669' }}>
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#047857',
                    lineHeight: 1.1,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {laporanSelesai}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
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
                <IonCardHeader style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.8)', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#eef2ff',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e0e7ff',
                      }}
                    >
                      <IonIcon icon={documentTextOutline} />
                    </div>
                    <div>
                      <IonCardSubtitle style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        LAYANAN SARPRAS
                      </IonCardSubtitle>
                      <IonCardTitle
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#0f172a',
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
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Nama Pelapor
                      </label>
                      <div className="liquid-glass-input">
                        <IonIcon icon={personOutline} style={{ color: '#6366f1', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Masukkan nama lengkap Anda"
                          value={nama}
                          onIonInput={(e) => setNama(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#0f172a' }}
                        />
                      </div>
                    </div>

                    {/* Lokasi / Ruangan */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Lokasi / Ruangan
                      </label>
                      <div className="liquid-glass-input">
                        <IonIcon icon={locationOutline} style={{ color: '#6366f1', marginRight: '8px' }} />
                        <IonInput
                          placeholder="Contoh: Lab Komputer 2"
                          value={lokasi}
                          onIonInput={(e) => setLokasi(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#0f172a' }}
                        />
                      </div>
                    </div>

                    {/* Kategori Fasilitas */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Kategori Fasilitas
                      </label>
                      <div className="liquid-glass-input">
                        <IonIcon icon={listOutline} style={{ color: '#6366f1', marginRight: '8px' }} />
                        <IonSelect
                          value={kategori}
                          placeholder="Pilih kategori fasilitas"
                          onIonChange={(e) => setKategori(e.detail.value)}
                          style={{ width: '100%', fontSize: '0.88rem', color: '#0f172a' }}
                        >
                          <IonSelectOption value="Fasilitas Kelas">Fasilitas Kelas</IonSelectOption>
                          <IonSelectOption value="Laboratorium">Laboratorium</IonSelectOption>
                          <IonSelectOption value="Lingkungan/Taman">Lingkungan/Taman</IonSelectOption>
                        </IonSelect>
                      </div>
                    </div>

                    {/* Deskripsi Masalah */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Detail Kerusakan
                      </label>
                      <div className="liquid-glass-input" style={{ padding: '6px 12px' }}>
                        <IonTextarea
                          rows={3}
                          placeholder="Jelaskan secara jelas kendala fasilitas yang ditemukan..."
                          value={deskripsi}
                          onIonInput={(e) => setDeskripsi(e.detail.value!)}
                          style={{ fontSize: '0.88rem', color: '#0f172a' }}
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
              {/* Header Feed + Searchbar (Liquid Glass Container) */}
              <div className="liquid-feed-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Daftar Tiket Pengaduan
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Menampilkan {filteredList.length} dari {totalLaporan} laporan
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(236, 253, 245, 0.85)',
                      border: '1px solid #a7f3d0',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#047857',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="liquid-pulse-dot" style={{ backgroundColor: '#10b981' }} />
                    Live Sync
                  </div>
                </div>

                {/* Liquid Search Bar (Smooth Rounded Pill Capsule) */}
                <IonSearchbar
                  mode="ios"
                  className="liquid-searchbar"
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Cari lokasi, kendala, atau nama..."
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
                  <IonIcon icon={businessOutline} style={{ fontSize: '2.8rem', color: '#6366f1', opacity: 0.5, marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Tidak ada tiket pengaduan</p>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
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
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span
                              style={{
                                background: '#eef2ff',
                                color: '#4f46e5',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                border: '1px solid #c7d2fe',
                              }}
                            >
                              {item.kategori}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              #{item.id}
                            </span>
                          </div>

                          <h4
                            style={{
                              margin: '0 0 4px 0',
                              fontSize: '1.02rem',
                              fontWeight: 800,
                              color: '#0f172a',
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

                      <p style={{ margin: '4px 0 12px 0', fontSize: '0.84rem', color: '#475569', lineHeight: '1.45' }}>
                        {item.deskripsi.length > 80 ? `${item.deskripsi.substring(0, 80)}...` : item.deskripsi}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '10px',
                          fontSize: '0.76rem',
                          color: '#64748b',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                          <IonIcon icon={personOutline} style={{ color: '#6366f1', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Pelapor: <strong style={{ color: '#0f172a' }}>{item.nama_pelapor || item.nama}</strong>
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
                          <IonIcon icon={chevronForwardOutline} style={{ color: '#6366f1' }} />
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