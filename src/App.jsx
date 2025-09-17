import './App.css'
import {
    BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate,
    // useLocation, 
    useParams,
} from 'react-router-dom';
import MainPage from './page/MainPage';
// import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import NotFound from './content_main_page/NotFound';
import Formulir from './content_main_page/Formulir';
import {
    menuAkademikItems,
    menuAlumni,
    menuBelanja,
    menuDataPokokItems, menuHafalan, menuItems, menuKepegawaianItems, menuKepesantrenanItems,
    menuKewaliasuhanItems, menuKewilayahanItems, menuMahromItems,
    menuManageItems,
    menuOrangTua,
    menuPembayaranItems,
    menuSaldo,
    menuSholat,
    menuTransaksiItems,
    subKelembagaanItems,
    subMenuPegawai,
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
// import UstadzDashboard from './content_main_page/UstadzDashboard';
import { getRolesString } from './utils/getRolesString';
import ContainerPesertaDidik from './content_main_page/content_menu_data_pokok/ContainerPesertaDidik';
import ContainerPegawai from './content_main_page/content_menu_kepegawaian/ContainerPegawai';
import Transaksi from './content_main_page/content_menu_kepesantrenan/Transaksi';
import ContainerOrangTua from './content_main_page/content_menu_data_pokok/ContainerOrangTua';
import RouteTracker from './components/RouteTracker';
import Forbidden from './content_main_page/Forbidden';
import ContainerSaldo from './content_main_page/content_menu_kepesantrenan/ContainerSaldo';
import { Toaster } from 'sonner';
import DashboardOrtu from './content_main_page/content_ortu/Dashboard';
import ExportPage from './content_main_page/Tes';
import LoginOrtuPage from './content_main_page/content_ortu/Login';
import RegisterOrtuPage from './content_main_page/content_ortu/Register';
import { AppLayout } from './content_main_page/content_ortu/AppLayout';
import { DashboardPage } from './content_main_page/content_ortu/Home';
import { AkademikPage } from './content_main_page/content_ortu/Akademik';
import { KeuanganPage } from './content_main_page/content_ortu/Keuangan';
import { ProfilPage } from './content_main_page/content_ortu/Profil';
import PerizinanPage from './content_main_page/content_ortu/Perizinan';
import PelanggaranPage from './content_main_page/content_ortu/Pelanggaran';
import { HafalanPage } from './content_main_page/content_ortu/Hafalan';
import PresensiPage from './content_main_page/content_ortu/Presensi';
import FeatureUnavailable from './content_main_page/FeatureUnavailable';
import { TagihanPage } from './content_main_page/content_ortu/Tagihan';
import { PesanPage } from './content_main_page/content_ortu/Pesan';
// import RFIDScanner from './content_main_page/UstadzDashboard';

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

    const roles = getRolesString();
    console.log(roles);


    // return true
    const token = getCookie("token");
    const expiredAt = getCookie("expiredAt");
    const sessionToken = sessionStorage.getItem("token");
    const isSessionActive = sessionStorage.getItem("activeSession") === "true";

    // Kalau tidak ada token sama sekali → tidak login
    if (!token && !sessionToken) return false;

    if (isSessionActive) { console.log("masih aktif") };


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
    console.log("PublicRoute");

    if (!isLoggedIn()) {
        return <Outlet />;
    } else {
        // const rolesString = localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]";
        const roles = getRolesString();

        if (roles.includes("Ustadz")) {
            return <Navigate to="/tahfidz" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }
};


const RedirectToDashboard = () => {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!hasRedirected.current) {
            // Ambil roles dari localStorage atau sessionStorage
            const rolesString = localStorage.getItem("roles") || sessionStorage.getItem("roles") || "[]";
            const roles = JSON.parse(rolesString);

            // Kalau ada role ustadz → direct ke /tahfidz
            if (roles.includes("ustadz")) {
                navigate('/tahfidz', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }

            hasRedirected.current = true;
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

// Helper untuk cek login ortu/wali
const isOrtuLoggedIn = () => {
    const token = getCookie("auth_token_ortu"); // token khusus ortu
    const expiredAt = getCookie("expiredAt_ortu");
    const sessionToken = sessionStorage.getItem("auth_token_ortu");
    const isSessionActive = sessionStorage.getItem("activeSessionOrtu") === "true";

    console.log("cek ortu login", { token, expiredAt, sessionToken, isSessionActive });

    if (!token && !sessionToken) return false;

    if (expiredAt && Date.now() > parseInt(expiredAt, 10) && !isSessionActive) {
        removeTokenCookie("token_ortu");
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

// Private route khusus ortu/wali
const PrivateRouteOrtu = () => {
    return isOrtuLoggedIn() ? <Outlet /> : <Navigate to="/ortu" replace />;
};

// Public route khusus ortu/wali
const PublicRouteOrtu = () => {
    return !isOrtuLoggedIn() ? <Outlet /> : <Navigate to="/wali/home" replace />;
};

const RedirectToRegisterOrtu = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const firstVisitRaw = localStorage.getItem("ortu_first_visit");
        const firstVisit = firstVisitRaw == "false";
        console.log("data local", firstVisit);

        if (!firstVisit) {
            console.log("Pertama kali → ke register ortu");
            // localStorage.setItem("ortu_first_visit", "visited");
            navigate("/register-ortu", { replace: true });
        } else {
            console.log("Sudah pernah → ke login ortu");
            navigate("/login-ortu", { replace: true });
        }
    }, [navigate]);

    return null;
};


function App() {
    return (
        <Router>
            <RouteTracker>
                <Routes>
                    {/* Public Route: Login hanya bisa diakses saat belum login */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        {/* <Route path="/register" element={<RegisterPage />} /> */}
                        <Route path="/forgot" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        {/* <Route path="/login-ortu" element={<LoginOrtuPage />} />
                        <Route path="/register-ortu" element={<RegisterOrtuPage />} />
                        <Route path="/wali" element={<AppLayout />}>
                            <Route index element={<Navigate to="/wali/home" replace />} />
                            <Route path="/wali/home" element={<DashboardPage />} />
                            <Route path="/wali/hafalan" element={<HafalanPage />} />
                            <Route path="/wali/akademik" element={<AkademikPage />} />
                            <Route path="/wali/keuangan" element={<KeuanganPage />} />
                            <Route path="/wali/profil" element={<ProfilPage />} />
                        </Route> */}



                    </Route>

                    <Route element={<PublicRouteOrtu />}>
                        <Route path="/ortu" element={<RedirectToRegisterOrtu />} />
                        <Route path="/login-ortu" element={<LoginOrtuPage />} />
                        <Route path="/register-ortu" element={<RegisterOrtuPage />} />
                    </Route>

                    <Route element={<PrivateRouteOrtu />}>
                        <Route path="/wali" element={<AppLayout />}>
                            <Route index element={<Navigate to="/wali/home" replace />} />
                            <Route path="/wali/home" element={<DashboardPage />} />
                            <Route path="/wali/hafalan" element={<HafalanPage />} />
                            <Route path="/wali/akademik" element={<AkademikPage />} />
                            <Route path="/wali/transaksi" element={<KeuanganPage />} />
                            <Route path="/wali/batas-pengeluaran" element={<FeatureUnavailable />} />
                            <Route path="/wali/perizinan" element={<PerizinanPage />} />
                            <Route path="/wali/pelanggaran" element={<PelanggaranPage />} />
                            <Route path="/wali/presensi" element={<PresensiPage />} />
                            <Route path="/wali/tagihan" element={<TagihanPage />} />
                            <Route path="/wali/tagihan" element={<FeatureUnavailable />} />
                            <Route path="/wali/pesan" element={<PesanPage />} />
                            <Route path="/wali/profil" element={<ProfilPage />} />
                        </Route>
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

                            <Route path="peserta-didik" element={<ContainerPesertaDidik />}>
                                {/* <Route index element={<RedirectToBiodata />} /> */}
                                {subPesertaDidik.map((tab) => (
                                    <Route key={tab.id} path={tab.link} element={tab.content} />
                                ))}
                            </Route>

                            <Route path="pegawai" element={<ContainerPegawai />}>
                                {/* <Route index element={<RedirectToBiodata />} /> */}
                                {subMenuPegawai.map((tab) => (
                                    <Route key={tab.id} path={tab.link} element={tab.content} />
                                ))}
                            </Route>

                            <Route path="orang-tua" element={<ContainerOrangTua />}>
                                {/* <Route index element={<RedirectToBiodata />} /> */}
                                {menuOrangTua.map((tab) => (
                                    <Route key={tab.id} path={tab.link} element={tab.content} />
                                ))}
                            </Route>
                            <Route path="transaksi/saldo" element={<ContainerSaldo />}>
                                {/* <Route index element={<RedirectToBiodata />} /> */}
                                {menuSaldo.map((tab) => (
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
                                // ...subPesertaDidik,
                                // ...menuKelembagaanItems,
                                ...menuAkademikItems,
                                ...menuKewilayahanItems,
                                ...subKelembagaanItems,
                                ...subPelajaranItems,
                                ...menuManageItems,
                                ...menuAlumni,
                                ...menuSholat,
                                ...menuHafalan,
                                ...menuBelanja,
                                ...menuOrangTua,
                                ...menuTransaksiItems,
                                ...menuPembayaranItems
                            ].map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/transaksi" element={<Transaksi />} />
                            <Route path="/ortu" element={<DashboardOrtu />} />
                            <Route path="/login-ortu" element={<LoginOrtuPage />} />
                            <Route path="/register-ortu" element={<RegisterOrtuPage />} />
                            <Route path="/export-img" element={<ExportPage />} />
                            {/* <Route path="/presensi-kartu" element={<RFIDScanner />} /> */}
                        </Route>
                    </Route>

                    {/* Catch-all: Not Found */}
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </RouteTracker>
            <Toaster position="top-right" richColors />
        </Router>
    );
}

export default App;
