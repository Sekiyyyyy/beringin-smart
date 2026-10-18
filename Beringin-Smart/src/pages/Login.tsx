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
  eyeOutline,
  eyeOffOutline,
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
        {/* Ambient Liquid Refraction Mesh in Background */}
        <div className="login-bg-refraction">
          <div className="login-liquid-orb-1" />
          <div className="login-liquid-orb-2" />
          <div className="login-liquid-orb-3" />
        </div>

        <div className="login-card-container">
          {/* Semua elemen berada di dalam satu kartu Liquid Glass */}
          <div className="login-card">
            {/* Header / Branding dengan Logo Resmi SMKN 1 Beringin */}
            <div className="login-header">
              <div className="login-school-logo-frame">
                <img
                  src="/logo-smkn1beringin.png"
                  alt="SMK Negeri 1 Beringin"
                  className="login-school-logo-img"
                />
              </div>
              <h1 className="login-title">Beringin Smart</h1>
              <p className="login-subtitle">Masuk ke akun Anda</p>
            </div>

            {/* Form Login */}
            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-field-label">Email</label>
                <div className="login-field-input">
                  <IonIcon icon={mailOutline} />
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    placeholder="nama@beringin.sch.id"
                    required
                  />
                </div>
              </div>

              <div className="login-field" style={{ marginBottom: '22px' }}>
                <label className="login-field-label">Kata Sandi</label>
                <div className="login-field-input">
                  <IonIcon icon={lockClosedOutline} />
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-toggle-eye"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? <IonSpinner name="crescent" color="light" /> : 'Masuk'}
              </button>
            </form>

            {/* Footer di dalam card */}
            <div className="login-card-footer">
              SMKN 1 Beringin • Rizky Alfianno
            </div>
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
