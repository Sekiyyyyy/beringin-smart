import React, { useState, useEffect } from 'react';
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
} from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  sparklesOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import API from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Jika sudah memiliki sesi login, langsung arahkan ke Home
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
      <IonContent
        className="ion-padding"
        style={{
          '--background': `
            radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.28) 0%, transparent 45%),
            radial-gradient(circle at 85% 25%, rgba(236, 72, 153, 0.22) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
            #080c14
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } as React.CSSProperties}
      >
        <div style={{ maxWidth: '440px', margin: '40px auto 20px auto' }}>
          {/* Logo & Hero Branding */}
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                margin: '0 auto 16px auto',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <IonIcon icon={sparklesOutline} style={{ fontSize: '2.5rem', color: '#ffffff' }} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                color: '#c4b5fd',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              <IonIcon icon={shieldCheckmarkOutline} /> SMKN 1 BERINGIN • PPLG
            </div>

            <h1
              style={{
                margin: '0 0 6px 0',
                fontSize: '2.1rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                fontFamily: "'Outfit', sans-serif",
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              Beringin Smart
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem' }}>
              Portal Layanan Pengaduan Sarana & Prasarana
            </p>
          </div>

          {/* Liquid Glass Login Card */}
          <IonCard
            style={{
              margin: 0,
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              overflow: 'hidden',
            }}
          >
            <IonCardContent style={{ padding: '30px 24px' }}>
              <div style={{ marginBottom: '22px' }}>
                <h2
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Selamat Datang
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
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
                      color: '#cbd5e1',
                    }}
                  >
                    Alamat Email
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      padding: '0 12px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <IonIcon icon={mailOutline} style={{ fontSize: '1.2rem', color: '#a855f7', marginRight: '8px' }} />
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

                {/* Password Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#cbd5e1',
                    }}
                  >
                    Kata Sandi
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      padding: '0 12px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <IonIcon icon={lockClosedOutline} style={{ fontSize: '1.2rem', color: '#a855f7', marginRight: '8px' }} />
                    <IonInput
                      type="password"
                      value={password}
                      onIonInput={(e) => setPassword(e.detail.value!)}
                      placeholder="••••••••"
                      required
                      style={{ fontSize: '0.92rem', color: '#ffffff' }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <IonButton
                  expand="block"
                  type="submit"
                  disabled={loading}
                  className="liquid-btn-primary"
                  style={{
                    height: '50px',
                    margin: 0,
                    fontSize: '0.96rem',
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
            </IonCardContent>
          </IonCard>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
