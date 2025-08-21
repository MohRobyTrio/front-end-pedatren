import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
// import { Outlet } from "react-router-dom";
import 'flowbite';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { KeepAlive, useKeepAliveRef } from 'keepalive-for-react';
import { useLocation, useOutlet } from 'react-router-dom';
import { KeepAliveContext } from '../utils/KeepAliveContext';

const MainPage = () => {
    const [dropdowns, setDropdowns] = useState(() => ({
        dataPokok: sessionStorage.getItem("dataPokok") === "true",
        kewaliasuhan: sessionStorage.getItem("kewaliasuhan") === "true",
        kepesantrenan: sessionStorage.getItem("kepesantrenan") === "true",
        kepegawaian: sessionStorage.getItem("kepegawaian") === "true",
        mahrom: sessionStorage.getItem("mahrom") === "true",
        kewilayahan: sessionStorage.getItem("kewilayahan") === "true",
        akademik: sessionStorage.getItem("akademik") === "true",
        pesertadidik: sessionStorage.getItem("pesertadidik") === "true",
        manage: sessionStorage.getItem("manage") === "true",
        transaksi: sessionStorage.getItem("transaksi") === "true",
        pembayaran: sessionStorage.getItem("pembayaran") === "true",
    }));

    useEffect(() => {
        Object.entries(dropdowns).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
    }, [dropdowns]);

    const toggleDropdown = (key) => {
        setDropdowns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarRef = useRef(null);
    const profilRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const contentRef = useRef(null);

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
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);



    return (
        <>
            <KeepAliveContext.Provider value={aliveRef}>
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
                            dropdowns={dropdowns}
                            toggleDropdown={toggleDropdown}
                            isSidebarOpen={isSidebarOpen}
                        />

                    </div>

                    <div ref={contentRef} className="pr-6 sm:ml-56 overflow-x-hidden w-full max-w-full">
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
            </KeepAliveContext.Provider>
        </>
    );
};

export default MainPage;
