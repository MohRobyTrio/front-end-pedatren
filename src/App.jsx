import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import MainPage from './page/MainPage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import NotFound from './content_main_page/NotFound';
import Formulir from './content_main_page/Formulir';
import {
  menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems,
  menuKewaliasuhanItems, menuMahromItems, 
  // menuRWSItems, 
  subPesertaDidik, tabsFormulir
} from './data/menuData';
import { useEffect, useRef } from 'react';

// Helper untuk cek apakah user login
// const isLoggedIn = () => {
//   return (
//     !!localStorage.getItem("token") ||
//     !!sessionStorage.getItem("token")
//   );
// };

//Helper untuk matikan login
const isLoggedIn = () => {
  return true
};


// Private route hanya untuk user yang sudah login
const PrivateRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public route hanya untuk user yang belum login
const PublicRoute = () => {
  return !isLoggedIn() ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const RedirectToDashboard = () => {
  const navigate = useNavigate();
  const hasRedirectedtoDashboard = useRef(false); // <-- flag guard

  useEffect(() => {
    if (!hasRedirectedtoDashboard.current) {
      console.log("direct");
      navigate('/dashboard', { replace: true });
      hasRedirectedtoDashboard.current = true;
    }
  }, [navigate]);

  return null;
};

const RedirectToBiodata = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirected = sessionStorage.getItem('formulirRedirected');

    if (!redirected && location.pathname === '/formulir') {
      console.log("redirect to biodata");
      sessionStorage.setItem('formulirRedirected', 'true');
      navigate('biodata', { replace: true }); // relative path
    }
  }, [navigate, location]);

  useEffect(() => {
    return () => {
      // Hanya reset kalau benar-benar keluar dari formulir
      if (!location.pathname.startsWith('/formulir')) {
        sessionStorage.removeItem('formulirRedirected');
      }
    };
  }, [location]);

  return null;
};



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login hanya bisa diakses saat belum login */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private Route: Semua halaman ini butuh login */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainPage />}>
            {/* Default redirect ke dashboard */}
            <Route index element={<RedirectToDashboard />} />

            {/* Formulir & children */}
            {/* <Route path="formulir" element={<Formulir />}>
              <Route index element={<Navigate to="biodata" replace />} />
              {tabsFormulir.map((tab) => (
                <Route key={tab.id} path={tab.link} element={tab.content} />
              ))}
            </Route> */}

            {/* <Route path="/formulir" element={<Navigate to="biodata" replace />} />
<Route path="/formulir/*" element={<Formulir />} /> */}

            <Route path="formulir" element={<Formulir />}>
              <Route index element={<RedirectToBiodata />} />
              {tabsFormulir.map((tab) => (
                <Route key={tab.id} path={tab.link} element={tab.content} />
              ))}
            </Route>

            {/* Semua menu */}
            {[
              ...menuItems,
              ...menuDataPokokItems,
              ...menuKewaliasuhanItems,
              ...menuKepesantrenanItems,
              ...menuKepegawaianItems,
              ...menuMahromItems,
              // ...menuRWSItems,
              ...subPesertaDidik,
            ].map((tab) => (
              <Route key={tab.id} path={tab.link} element={tab.content} />
            ))}
          </Route>
        </Route>

        {/* Catch-all: Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
