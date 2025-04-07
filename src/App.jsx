// import './App.css'
// // import Sidebar from './components/Sidebar';
// import MainPage from './page/MainPage';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems, menuKewaliasuhanItems, menuMahromItems, menuRWSItems, subPesertaDidik, tabsFormulir } from './data/menuData';
// import NotFound from './content_main_page/NotFound';
// import Formulir from './content_main_page/Formulir';
// import LoginPage from './page/LoginPage';


// function App() {
//   return (
//     <Router>
//         <Routes>
//           <Route path='/login' element={<LoginPage />} />
//           <Route path="/" element={<MainPage />} >
//             <Route path="/formulir" element={<Formulir />}>
//               <Route path="/formulir" element={<Navigate to="/formulir/biodata" replace />} />
//               {tabsFormulir.map((tab) => (
//                 <Route key={tab.id} path={tab.link} element={tab.content} />
//               ))}
//             </Route>
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />

//             {[
//               ...menuItems,
//               ...menuDataPokokItems,
//               ...menuKewaliasuhanItems,
//               ...menuKepesantrenanItems,
//               ...menuKepegawaianItems,
//               ...menuMahromItems,
//               ...menuRWSItems,
//               ...subPesertaDidik,
//             ].map((tab) => (
//               <Route key={tab.id} path={tab.link} element={tab.content} />
//             ))}
//           </Route>
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//         {/* <MainPage /> */}
//         {/* <Formulir /> */}
//     </Router>
//   )
// }

// export default App

import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainPage from './page/MainPage';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import NotFound from './content_main_page/NotFound';
import Formulir from './content_main_page/Formulir';
import {
  menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems,
  menuKewaliasuhanItems, menuMahromItems, menuRWSItems, subPesertaDidik, tabsFormulir
} from './data/menuData';

// Helper untuk cek apakah user login
const isLoggedIn = () => {
  return (
    !!localStorage.getItem("token") ||
    !!sessionStorage.getItem("token")
  );
};


// Private route hanya untuk user yang sudah login
const PrivateRoute = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public route hanya untuk user yang belum login
const PublicRoute = () => {
  return !isLoggedIn() ? <Outlet /> : <Navigate to="/dashboard" replace />;
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
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Formulir & children */}
            <Route path="formulir" element={<Formulir />}>
              <Route index element={<Navigate to="biodata" replace />} />
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
              ...menuRWSItems,
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
