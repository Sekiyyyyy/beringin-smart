import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonToast,
  IonSpinner,
  IonIcon,
  IonChip,
} from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  schoolOutline,
  arrowForwardOutline,
  personOutline,
  buildOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await API.post('/login', { email, password });

      // Simpan token, role, dan data user ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Pindah ke Halaman Home
      navigate('/home');
      window.location.reload(); // Refresh halaman agar token terbaca Context
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Gagal terhubung ke server Laravel! Pastikan php artisan serve aktif.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Shortcut login cepat untuk mempermudah demonstrasi / pengujian guru & siswa
  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <IonPage>
      <IonContent
        className="ion-padding"
        style={{
          '--background': 'linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1e3a8a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } as React.CSSProperties}
      >
        <div style={{ maxWidth: '440px', margin: '40px auto 20px auto' }}>
          {/* Logo & Hero Branding */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                margin: '0 auto 16px auto',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <IonIcon icon={schoolOutline} style={{ fontSize: '2.4rem', color: '#ffffff' }} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(147, 197, 253, 0.25)',
                borderRadius: '30px',
                color: '#93c5fd',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              <IonIcon icon={shieldCheckmarkOutline} /> SMKN 1 BERINGIN • PPLG
            </div>

            <h1 style={{ margin: '0 0 6px 0', fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              Beringin Smart
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
              Portal Layanan Pengaduan Sarana & Prasarana
            </p>
          </div>

          {/* Login Card */}
          <IonCard
            style={{
              margin: 0,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              overflow: 'hidden',
            }}
          >
            <IonCardContent style={{ padding: '28px 24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>
                  Selamat Datang
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Silakan masuk menggunakan akun terdaftar Anda
                </p>
              </div>

              <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    Alamat Email
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0 12px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <IonIcon icon={mailOutline} style={{ fontSize: '1.2rem', color: '#64748b', marginRight: '8px' }} />
                    <IonInput
                      type="email"
                      value={email}
                      onIonInput={(e) => setEmail(e.detail.value!)}
                      placeholder="nama@beringin.sch.id"
                      required
                      style={{ fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: '22px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    Kata Sandi
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0 12px',
                    }}
                  >
                    <IonIcon icon={lockClosedOutline} style={{ fontSize: '1.2rem', color: '#64748b', marginRight: '8px' }} />
                    <IonInput
                      type="password"
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      placeholder="••••••••"
                      required
                      style={{ fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <IonButton
                  expand="block"
                  type="submit"
                  disabled={loading}
                  style={{
                    height: '48px',
                    margin: 0,
                    '--background': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    '--border-radius': '12px',
                    '--box-shadow': '0 8px 18px rgba(37, 99, 235, 0.35)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  {loading ? (
                    <IonSpinner name="crescent" color="light" />
                  ) : (
                    <>
                      Masuk ke Sistem <IonIcon slot="end" icon={arrowForwardOutline} />
                    </>
                  )}
                </IonButton>
              </form>

              {/* Quick Login Chips for Demo / Testing */}
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textAlign: 'center' }}>
                  AKSES CEPAT UJI COBA (SKKNI SEEDER):
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <IonChip
                    outline
                    color="primary"
                    onClick={() => fillCredentials('siswa@beringin.sch.id')}
                    style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
                  >
                    <IonIcon icon={personOutline} />
                    Login Siswa
                  </IonChip>
                  <IonChip
                    outline
                    color="success"
                    onClick={() => fillCredentials('petugas@beringin.sch.id')}
                    style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
                  >
                    <IonIcon icon={buildOutline} />
                    Login Petugas
                  </IonChip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              © 2026-2027 SMK Negeri 1 Beringin • Berdasarkan SKKNI No. 282/2016
            </span>
          </div>
        </div>

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
