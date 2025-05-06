// import "tailgrids/assets/css/tailwind.css";
// import './assets/scss/astro-ecommerce.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './middlewares/PrivateRoute'
import { routes } from './routes'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner.tsx";
import { AppNotificationListener } from "./components/partitials/Notification/AppNotificationListener.tsx";

function App() {

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
