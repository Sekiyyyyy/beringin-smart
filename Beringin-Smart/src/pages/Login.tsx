import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonToast,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  sparklesOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline,
  eyeOutline,
  eyeOffOutline,
  lockOpenOutline,
} from 'ionicons/icons';
import API from '../services/api';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Jika sudah memiliki sesi login aktif, langsung arahkan ke Home
  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/home';
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await API.post('/login', { email, password });

      // Simpan kredensial token dan user ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Pindah ke Halaman Home secara bersih dan stabil
      window.location.href = '/home';
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Gagal terhubung ke server Laravel! Pastikan server aktif.');
      }
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-page-content ion-padding">
        {/* Ambient Liquid Canvas Background (21st.dev style) */}
        <div className="login-ambient-mesh">
          <div className="login-blob-1" />
          <div className="login-blob-2" />
          <div className="login-blob-3" />
        </div>

        {/* Central Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '430px',
            margin: '40px auto 30px auto',
          }}
        >
          {/* Logo & Hero Branding */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            {/* Holographic 3D Glass Hero Badge */}
            <div className="login-hero-logo">
              <IonIcon icon={sparklesOutline} style={{ fontSize: '2.5rem', color: '#ffffff' }} />
            </div>

            {/* Live School Status Tag */}
            <div className="login-school-tag">
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  display: 'inline-block',
                }}
              />
              <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '0.85rem' }} />
              SMKN 1 BERINGIN • PPLG PORTAL
            </div>

            {/* Glowing Gradient Title */}
            <h1 className="login-gradient-title">
              Beringin <span className="login-gradient-accent">Smart</span>
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
              Portal Layanan Pengaduan Sarana & Prasarana
            </p>
          </div>

          {/* 21st.dev Border-Beam Glassmorphism Card Wrapper */}
          <div className="login-beam-card-wrapper">
            <div className="login-frosted-card">
              <div style={{ marginBottom: '22px' }}>
                <h2
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-0.3px',
                  }}
                >
                  Masuk ke Portal
                </h2>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
                  Gunakan email dan kata sandi akun sekolah Anda
                </p>
              </div>

              <form onSubmit={handleLogin}>
                {/* Input Email */}
                <div className="login-input-group">
                  <div className="login-input-label">
                    <span>Alamat Email</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Wajib</span>
                  </div>
                  <div className="login-input-field-wrapper">
                    <IonIcon icon={mailOutline} className="login-input-icon" />
                    <IonInput
                      type="email"
                      value={email}
                      onIonInput={(e) => setEmail(e.detail.value!)}
                      placeholder="nama@beringin.sch.id"
                      required
                      style={{ fontSize: '0.92rem', color: '#ffffff' }}
                    />
                  </div>
                </div>

                {/* Input Kata Sandi dengan Tombol Eye Toggle */}
                <div className="login-input-group" style={{ marginBottom: '24px' }}>
                  <div className="login-input-label">
                    <span>Kata Sandi</span>
                    <span style={{ fontSize: '0.74rem', color: '#a855f7' }}>Terenkripsi</span>
                  </div>
                  <div className="login-input-field-wrapper">
                    <IonIcon icon={lockClosedOutline} className="login-input-icon" />
                    <IonInput
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      placeholder="••••••••"
                      required
                      style={{ fontSize: '0.92rem', color: '#ffffff' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-password-toggle-btn"
                      title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                    >
                      <IonIcon
                        icon={showPassword ? eyeOffOutline : eyeOutline}
                        style={{ fontSize: '1.2rem' }}
                      />
                    </button>
                  </div>
                </div>

                {/* 21st.dev Liquid Shimmer Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-shimmer-submit-btn"
                >
                  {loading ? (
                    <IonSpinner name="crescent" color="light" />
                  ) : (
                    <>
                      <span>Masuk ke Sistem</span>
                      <IonIcon icon={arrowForwardOutline} style={{ fontSize: '1.15rem' }} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Security & Standard SKKNI Trust Badge */}
          <div className="login-trust-badge">
            <IonIcon icon={lockOpenOutline} style={{ color: '#10b981', fontSize: '0.9rem' }} />
            <span>Terintegrasi Laravel Sanctum • SKKNI No. 282 Tahun 2016</span>
          </div>

          {/* Copyright Note */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              © 2026-2027 SMK Negeri 1 Beringin • Pengembang: Rizky Alfianno
            </span>
          </div>
        </div>

        {/* Notifikasi Toast Error */}
        <IonToast
          isOpen={!!errorMessage}
          onDidDismiss={() => setErrorMessage('')}
          message={errorMessage}
          duration={3500}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
