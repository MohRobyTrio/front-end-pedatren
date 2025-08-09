import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, 
  // useLocation, 
  useParams } from 'react-router-dom';
import MainPage from './page/MainPage';
// import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import NotFound from './content_main_page/NotFound';
import Formulir from './content_main_page/Formulir';
import {
  menuAkademikItems,
  menuAlumni,
  menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems,
  menuKewaliasuhanItems, menuKewilayahanItems, menuMahromItems, 
  menuManageItems, 
  subKelembagaanItems, 
  subPelajaranItems, 
  // menuRWSItems, 
  subPesertaDidik, tabsFormulir
} from './data/menuData';
import { useEffect, useRef } from 'react';
import { getCookie, removeTokenCookie } from './utils/cookieUtils';
import Swal from 'sweetalert2';
import ForgotPasswordPage from './page/ForgotPasswordPage';
import ResetPasswordPage from './page/ResetPasswordPage';
import Profile from './content_main_page/Profile';

window.sessionExpiredShown = false;

// const isTokenExpired = () => {
//   const expiresAt = localStorage.getItem("expiresAt");
//   if (!expiresAt) return false;

//   return Date.now() > parseInt(expiresAt, 10);
// };

// Helper untuk cek apakah user login
const isLoggedIn = () => {
  console.log(
    "isLoggedIn"
  );
  
  // return true
  const token = getCookie("token");
  const expiredAt = getCookie("expiredAt");
  const sessionToken = sessionStorage.getItem("token");
  const isSessionActive = sessionStorage.getItem("activeSession") === "true";

  // Kalau tidak ada token sama sekali → tidak login
  if (!token && !sessionToken) return false;

  if (isSessionActive) {console.log("masih aktif")};
  

  // Kalau token expired → remove token dan logout
  if (expiredAt && Date.now() > parseInt(expiredAt, 10) && !isSessionActive) {
    removeTokenCookie();
    Swal.fire({
      title: 'Sesi Berakhir',
      text: 'Sesi anda telah berakhir, silakan login kembali.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return false;
  }

  return true;
};

//Helper untuk matikan login
// const isLoggedIn = () => {
//   return true
// };

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
  const { biodata_id } = useParams();

  useEffect(() => {
    if (biodata_id) {
      navigate(`/formulir/${biodata_id}/biodata`, { replace: true });
    }
  }, [biodata_id, navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login hanya bisa diakses saat belum login */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

        </Route>

        {/* Private Route: Semua halaman ini butuh login */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainPage />}>
            {/* Default redirect ke dashboard */}
            <Route index element={<RedirectToDashboard />} />

            <Route path="formulir/:biodata_id" element={<Formulir />}>
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
              // ...menuKelembagaanItems,
              ...menuAkademikItems,
              ...menuKewilayahanItems,
              ...subKelembagaanItems,
              ...subPelajaranItems,
              ...menuManageItems,
              ...menuAlumni
            ].map((tab) => (
              <Route key={tab.id} path={tab.link} element={tab.content} />
            ))}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all: Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
