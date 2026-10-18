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
  leafOutline,
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
        <div className="login-card-container">
          {/* Semua elemen berada di dalam satu card */}
          <div className="login-card">
            {/* Header / Branding */}
            <div className="login-header">
              <div className="login-logo">
                <IonIcon icon={leafOutline} />
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
                {loading ? <IonSpinner name="crescent" color="dark" /> : 'Masuk'}
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
