// import "tailgrids/assets/css/tailwind.css";
// import './assets/scss/astro-ecommerce.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PrivateRoute from './middlewares/PrivateRoute'
import { routes } from './routes/index'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={(
                <PrivateRoute routeType={route.routeType}>
                  <route.Layout>
                    <ToastContainer />
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
