// import "tailgrids/assets/css/tailwind.css";
// import './assets/scss/astro-ecommerce.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './middlewares/PrivateRoute'
import { routes } from './routes'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useEffect, useState } from 'react'
import { requestPermissionAndGetToken } from './assets/js/firebase-messaging'
import AuthUtil from './utils/authUtil'
import {Toaster} from "./components/ui/sonner.tsx";
import {AppNotificationListener} from "./components/partitials/Notification/AppNotificationListener.tsx";

function App() {

  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          setSwRegistration(registration);

          const fcmToken = localStorage.getItem("fcmToken");
          if (!fcmToken && AuthUtil.isLogged()) {
            await requestPermissionAndGetToken(registration);
          }
        } catch (err) {
          console.error("SW registration error:", err);
        }
      }
    };

    registerServiceWorker();
  }, []);
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppNotificationListener />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={(
                <PrivateRoute routeType={route.routeType} path={route.path}>
                  <route.Layout>
                    <Toaster richColors={true} />
                    <route.Component />
                  </route.Layout>
                </PrivateRoute>
              )
              }
            />
          ))}
        </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
