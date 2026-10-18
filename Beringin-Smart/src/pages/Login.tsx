import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await API.post('/login', { email, password });

      // Simpan token, role, dan data user ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Pindah ke Halaman Home
      navigate('/home');
      window.location.reload(); // Refresh halaman agar token langsung terbaca oleh Context
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Gagal terhubung ke server Laravel!');
      }
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': '#f4f6f9' } as React.CSSProperties}>
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
          <IonCard style={{ borderRadius: '12px' }}>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">Login Beringin Smart</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem className="ion-margin-bottom">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value!)}
                    placeholder="Masukkan email"
                    required
                  />
                </IonItem>

                <IonItem className="ion-margin-bottom">
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                    placeholder="Masukkan password"
                    required
                  />
                </IonItem>

                <IonButton expand="block" type="submit" style={{ marginTop: '20px' }}>
                  Masuk
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={!!errorMessage}
          onDidDismiss={() => setErrorMessage('')}
          message={errorMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
