import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
// import { Navigate, Outlet } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'flowbite';
// import Formulir from '../content_main_page/Formulir';
// import NotFound from './NotFound';
import { subPesertaDidik } from '../data/menuData';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


const MainPage = () => {
    const [dropdownDataPokok, setDropdownDataPokok] = useState(() => sessionStorage.getItem("dropdownDataPokok") === "true");
    const [submenuPesertaDidik, setSubmenuPesertaDidik] = useState(() => sessionStorage.getItem("submenuPesertaDidik") === "true");
    const [dropdownDataKewaliasuhan, setDropdownKewaliasuhan] = useState(() => sessionStorage.getItem("dropdownDataKewaliasuhan") === "true");
    const [dropdownDataKepesantrenan, setDropdownKepesantrenan] = useState(() => sessionStorage.getItem("dropdownDataKepesantrenan") === "true");
    const [dropdownDataKepegawaian, setDropdownKepegawaian] = useState(() => sessionStorage.getItem("dropdownDataKepegawaian") === "true");
    const [dropdownDataMahrom, setDropdownMahrom] = useState(() => sessionStorage.getItem("dropdownDataMahrom") === "true");
    const [dropdownDataRWS, setDropdownRWS] = useState(() => sessionStorage.getItem("dropdownDataRWS") === "true");

    useEffect(() => {
        sessionStorage.setItem("dropdownDataPokok", dropdownDataPokok);
        sessionStorage.setItem("submenuPesertaDidik", submenuPesertaDidik);
        sessionStorage.setItem("dropdownDataKewaliasuhan", dropdownDataKewaliasuhan);
        sessionStorage.setItem("dropdownDataKepesantrenan", dropdownDataKepesantrenan);
        sessionStorage.setItem("dropdownDataKepegawaian", dropdownDataKepegawaian);
        sessionStorage.setItem("dropdownDataMahrom", dropdownDataMahrom);
        sessionStorage.setItem("dropdownDataRWS", dropdownDataRWS);
    }, [dropdownDataPokok, submenuPesertaDidik, dropdownDataKewaliasuhan, dropdownDataKepesantrenan, dropdownDataKepegawaian, dropdownDataMahrom, dropdownDataRWS]);

    const toggleDropdown = (setter) => setter((prev) => !prev);

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdownProfil = () => setIsOpen(prev => !prev);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


    return (
        <>
            {/* <Router> */}
            <div className="flex h-screen overflow-hidden">

                <Navbar
                    toggleDropdownProfil={toggleDropdownProfil}
                    toggleSidebar={toggleSidebar}
                    isOpen={isOpen}
                />
                <Sidebar
                    submenuPesertaDidik={subPesertaDidik}
                    setSubmenuPesertaDidik={setSubmenuPesertaDidik}
                    dropdownDataPokok={dropdownDataPokok}
                    setDropdownDataPokok={setDropdownDataPokok}
                    dropdownDataKewaliasuhan={dropdownDataKewaliasuhan}
                    setDropdownKewaliasuhan={setDropdownKewaliasuhan}
                    dropdownDataKepegawaian={dropdownDataKepegawaian}
                    setDropdownKepegawaian={setDropdownKepegawaian}
                    dropdownDataKepesantrenan={dropdownDataKepesantrenan}
                    setDropdownKepesantrenan={setDropdownKepesantrenan}
                    dropdownDataMahrom={dropdownDataMahrom}
                    setDropdownMahrom={setDropdownMahrom}
                    dropdownDataRWS={dropdownDataRWS}
                    setDropdownRWS={setDropdownRWS}
                    isSidebarOpen={isSidebarOpen}
                    toggleDropdown={toggleDropdown}
                />

                <div className="pr-6 sm:ml-64 overflow-y-auto w-full">
                    <div className="pt-8 mt-8">
                        <Outlet />
                        {/* <Routes>
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

                            <Route path="*" element={<NotFound />} />
                        </Routes> */}
                    </div>
                </div>
            {/* </Router> */}
            </div>
        </>
    );
};

export default MainPage;