import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import { LaporanProvider } from './context/LaporanContext';

/* Core CSS & styles tetapkan sama */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <IonApp>
      <LaporanProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/detail/:id"
              element={isLoggedIn ? <Detail /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
            />
          </IonRouterOutlet>
        </IonReactRouter>
      </LaporanProvider>
    </IonApp>
  );
};

export default App;