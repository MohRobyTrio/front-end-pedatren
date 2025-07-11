import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
// import { Outlet } from "react-router-dom";
import 'flowbite';
import { subPesertaDidik } from '../data/menuData';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { KeepAlive, useKeepAliveRef } from 'keepalive-for-react';
import { useLocation, useOutlet } from 'react-router-dom';

const MainPage = () => {
    const [dropdownDataPokok, setDropdownDataPokok] = useState(() => sessionStorage.getItem("dropdownDataPokok") === "true");
    const [submenuPesertaDidik, setSubmenuPesertaDidik] = useState(() => sessionStorage.getItem("submenuPesertaDidik") === "true");
    const [dropdownDataKewaliasuhan, setDropdownKewaliasuhan] = useState(() => sessionStorage.getItem("dropdownDataKewaliasuhan") === "true");
    const [dropdownDataKepesantrenan, setDropdownKepesantrenan] = useState(() => sessionStorage.getItem("dropdownDataKepesantrenan") === "true");
    const [dropdownDataKepegawaian, setDropdownKepegawaian] = useState(() => sessionStorage.getItem("dropdownDataKepegawaian") === "true");
    const [dropdownDataMahrom, setDropdownMahrom] = useState(() => sessionStorage.getItem("dropdownDataMahrom") === "true");
    const [dropdownDataKelembagaan, setDropdownDataKelembagaan] = useState(() => sessionStorage.getItem("dropdownDataKelembagaan") === "true");
    const [dropdownDataAkademik, setDropdownDataAkademik] = useState(() => sessionStorage.getItem("dropdownDataAkademik") === "true");
    const [dropdownDataKewilayahan, setDropdownDataKewilayahan] = useState(() => sessionStorage.getItem("dropdownDataKewilayahan") === "true");
    // const [dropdownDataRWS, setDropdownRWS] = useState(() => sessionStorage.getItem("dropdownDataRWS") === "true");

    useEffect(() => {
        sessionStorage.setItem("dropdownDataPokok", dropdownDataPokok);
        sessionStorage.setItem("submenuPesertaDidik", submenuPesertaDidik);
        sessionStorage.setItem("dropdownDataKewaliasuhan", dropdownDataKewaliasuhan);
        sessionStorage.setItem("dropdownDataKepesantrenan", dropdownDataKepesantrenan);
        sessionStorage.setItem("dropdownDataKepegawaian", dropdownDataKepegawaian);
        sessionStorage.setItem("dropdownDataMahrom", dropdownDataMahrom);
        sessionStorage.setItem("dropdownDataKelembagaan", dropdownDataKelembagaan);
        sessionStorage.setItem("dropdownDataAkademik", dropdownDataAkademik);
        sessionStorage.setItem("dropdownDataKewilayahan", dropdownDataKewilayahan);
        // sessionStorage.setItem("dropdownDataRWS", dropdownDataRWS);
    }, [dropdownDataPokok, submenuPesertaDidik, dropdownDataKewaliasuhan, dropdownDataKepesantrenan, dropdownDataKepegawaian, dropdownDataMahrom, dropdownDataKelembagaan, dropdownDataAkademik, dropdownDataKewilayahan]);

    const toggleDropdown = (setter) => setter((prev) => !prev);

    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarRef = useRef(null);
    const profilRef = useRef(null);
    const toggleButtonRef = useRef(null);

    const toggleDropdownProfil = () => setIsOpen(prev => !prev);
    const toggleSidebar = () => {
        console.log("klik");
        console.log(isSidebarOpen);
        
        setIsSidebarOpen(prev => !prev)
        console.log(isSidebarOpen);
    };

    // Tutup jika klik di luar sidebar atau dropdown profil
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
            if (profilRef.current && !profilRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const outlet = useOutlet();
    const location = useLocation();
    const aliveRef = useKeepAliveRef();

    const currentCacheKey = useMemo(() => location.pathname, [location.pathname]);

    // console.log(location.pathname)

    return (
        <>
            <div className="flex h-screen overflow-hidden">

                <Navbar
                    toggleDropdownProfil={toggleDropdownProfil}
                    toggleSidebar={toggleSidebar}
                    isOpen={isOpen}
                    profilRef={profilRef} // Tambahkan ref ke Navbar
                    toggleButtonRef={toggleButtonRef}
                />
                <div ref={sidebarRef}>
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
                        // dropdownDataRWS={dropdownDataRWS}
                        // setDropdownRWS={setDropdownRWS}
                        dropdownDataKelembagaan={dropdownDataKelembagaan}
                        setDropdownDataKelembagaan={setDropdownDataKelembagaan}
                        dropdownDataAkademik={dropdownDataAkademik}
                        setDropdownDataAkademik={setDropdownDataAkademik}
                        dropdownDataKewilayahan={dropdownDataKewilayahan}
                        setDropdownDataKewilayahan={setDropdownDataKewilayahan}
                        isSidebarOpen={isSidebarOpen}
                        toggleDropdown={toggleDropdown}
                    />
                </div>

                <div className="pr-6 sm:ml-56 overflow-y-auto overflow-x-hidden w-full max-w-full">
                    <div className="pt-8 mt-8">
                        {/* <Outlet /> */}
                        <KeepAlive
                            transition
                            aliveRef={aliveRef}
                            activeCacheKey={currentCacheKey}
                            max={20} // Simpan hingga 20 halaman
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                {outlet}
                            </Suspense>
                        </KeepAlive>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainPage;
