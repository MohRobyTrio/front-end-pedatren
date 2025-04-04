import './App.css'
// import Sidebar from './components/Sidebar';
import MainPage from './page/MainPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems, menuKewaliasuhanItems, menuMahromItems, menuRWSItems, subPesertaDidik, tabsFormulir } from './data/menuData';
import NotFound from './content_main_page/NotFound';
import Formulir from './content_main_page/Formulir';
import LoginPage from './page/LoginPage';


function App() {
  return (
    <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/" element={<MainPage />} >
            <Route path="/formulir" element={<Formulir />}>
              <Route path="/formulir" element={<Navigate to="/formulir/biodata" replace />} />
              {tabsFormulir.map((tab) => (
                <Route key={tab.id} path={tab.link} element={tab.content} />
              ))}
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <MainPage /> */}
        {/* <Formulir /> */}
    </Router>
  )
}

export default App
