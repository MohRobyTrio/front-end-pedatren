import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'flowbite';
import Formulir from '../content_main_page/Formulir';
import PesertaDidik from '../content_main_page/content_menu_data_pokok/PesertaDidik';
import Dashboard from '../content_main_page/Dashboard';
import ScanQRCode from '../content_main_page/ScanQRCode';
import OrangTua from '../content_main_page/content_menu_data_pokok/OrangTua';
import Wali from '../content_main_page/content_menu_data_pokok/Wali';
import Pengajar from '../content_main_page/content_menu_data_pokok/Pengajar';
import Pengurus from '../content_main_page/content_menu_data_pokok/Pengurus';
import Karyawan from '../content_main_page/content_menu_data_pokok/Karyawan';
import WaliKelas from '../content_main_page/content_menu_data_pokok/WaliKelas';
import Khadam from '../content_main_page/content_menu_data_pokok/Khadam';
import Alumni from '../content_main_page/content_menu_data_pokok/Alumni';
import WaliAsuh from '../content_main_page/content_menu_kewaliasuhan/WaliAsuh';
import GroupKewaliasuhan from '../content_main_page/content_menu_kewaliasuhan/GroupKewaliasuhan';
import AnakAsuh from '../content_main_page/content_menu_kewaliasuhan/AnakAsuh';
import Perizinan from '../content_main_page/content _menu_kepesantrenan/Perizinan';
import Pelanggaran from '../content_main_page/content _menu_kepesantrenan/Pelanggaran';
import PresensiPesantren from '../content_main_page/content _menu_kepesantrenan/PresensiPesantren';
import CatatanAfektif from '../content_main_page/content _menu_kepesantrenan/CatatanAfektif';
import Pegawai from '../content_main_page/content_menu_kepegawaian/Pegawai';
import AnakPegawai from '../content_main_page/content_menu_kepegawaian/AnakPegawai';
import PresensiPegawai from '../content_main_page/content_menu_kepegawaian/PresensiPegawai';
import Pengunjung from '../content_main_page/content_menu_mahrom/Pengunjung';
import KehadiranRWS from '../content_main_page/content_menu_rws/KehadiranRWS';
import CatatanKognitif from '../content_main_page/content _menu_kepesantrenan/CatatanKognitif';
import ReservasiMakan from '../content_main_page/content _menu_kepesantrenan/ReservasiMakan';
import TabBiodata from '../content_main_page/content_tab_formulir/TabBiodata';
import TabKeluarga from '../content_main_page/content_tab_formulir/TabKeluarga';
import TabSantri from '../content_main_page/content_tab_formulir/TabSantri';
import TabDomisiliSantri from '../content_main_page/content_tab_formulir/TabDomisiliSantri';
import TabWaliAsuh from '../content_main_page/content_tab_formulir/TabWaliAsuh';
import TabPendidikan from '../content_main_page/content_tab_formulir/TabPendidikan';
import TabPengajar from '../content_main_page/content_tab_formulir/TabPengajar';
import TabKaryawan from '../content_main_page/content_tab_formulir/TabKaryawan';
import TabPengurus from '../content_main_page/content_tab_formulir/TabPengurus';
import TabKhadam from '../content_main_page/content_tab_formulir/TabKhadam';
import TabBerkas from '../content_main_page/content_tab_formulir/TabBerkas';
import TabWarPes from '../content_main_page/content_tab_formulir/TabWarPres';
import TabProgress from '../content_main_page/content_tab_formulir/TabProgress';


const MainPage = () => {
    const [dropdownDataPokok, setDropdownDataPokok] = useState(() => {
        return sessionStorage.getItem("dropdownDataPokok") === "true";
    });
    
    const [submenuPesertaDidik, setSubmenuPesertaDidik] = useState(() => {
        return sessionStorage.getItem("submenuPesertaDidik") === "true";
    });
    
    const [dropdownDataKewaliasuhan, setDropdownKewaliasuhan] = useState(() => {
        return sessionStorage.getItem("dropdownDataKewaliasuhan") === "true";
    });
    
    const [dropdownDataKepesantrenan, setDropdownKepesantrenan] = useState(() => {
        return sessionStorage.getItem("dropdownDataKepesantrenan") === "true";
    });
    
    const [dropdownDataKepegawaian, setDropdownKepegawaian] = useState(() => {
        return sessionStorage.getItem("dropdownDataKepegawaian") === "true";
    });
    
    const [dropdownDataMahrom, setDropdownMahrom] = useState(() => {
        return sessionStorage.getItem("dropdownDataMahrom") === "true";
    });
    
    const [dropdownDataRWS, setDropdownRWS] = useState(() => {
        return sessionStorage.getItem("dropdownDataRWS") === "true";
    });    

    const menuItems = [
        { id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard", link: "/dashboard", content: <Dashboard /> },
        { id: "scanqrcode", icon: "fas fa-qrcode", text: "Scan QRCode", link: "/scanqrcode", content: <ScanQRCode /> },
        { id: "formulir", icon: "fas fa-file-alt", text: "Formulir", link: "/formulir", content: <Formulir /> },
    ];

    const menuDataPokokItems = [
        { id: "pesertadidik", icon: "fa-users", text: "Peserta Didik", link: "/peserta-didik", content: <PesertaDidik /> },
        { id: "orangtua", icon: "fa-user", text: "Orang Tua", link: "/orang-tua", content: <OrangTua /> },
        { id: "wali", icon: "fa-user-tie", text: "Wali", link: "/wali", content: <Wali /> },
        { id: "pengajar", icon: "fa-chalkboard-teacher", text: "Pengajar", link: "/pengajar", content: <Pengajar /> },
        { id: "pengurus", icon: "fa-user-cog", text: "Pengurus", link: "/pengurus", content: <Pengurus /> },
        { id: "karyawan", icon: "fa-briefcase", text: "Karyawan", link: "/karyawan", content: <Karyawan /> },
        { id: "walikelas", icon: "fa-chalkboard", text: "Wali Kelas", link: "/wali-kelas", content: <WaliKelas /> },
        { id: "khadam", icon: "fa-hands-helping", text: "Khadam", link: "/khadam", content: <Khadam /> },
        { id: "alumni", icon: "fa-user-graduate", text: "Alumni", link: "/alumni", content: <Alumni /> },
    ];

    const menuKewaliasuhanItems = [
        { id: "waliasuh", icon: "fa-user-shield", text: "Wali Asuh", link: "/wali-asuh", content: <WaliAsuh /> },
        { id: "groupkewaliasuhan", icon: "fa-book-open", text: "Group Kewaliasuhan", link: "/group-kewaliasuhan", content: <GroupKewaliasuhan /> },
        { id: "anakasuh", icon: "fa-users", text: "Anak Asuh", link: "/anak-asuh", content: <AnakAsuh /> },
    ];

    const menuKepesantrenanItems = [
        { id: "perizinan", icon: "fa-id-card", text: "Perizinan", link: "/perizinan", content: <Perizinan /> },
        { id: "pelanggaran", icon: "fa-exclamation-triangle", text: "Pelanggaran", link: "/pelanggaran", content: <Pelanggaran /> },
        { id: "presensipesantren", icon: "fa-calendar-check", text: "Presensi", link: "/presensi-pesantren", content: <PresensiPesantren /> },
        { id: "catatanafektif", icon: "fa-hand-holding-heart", text: "Catatan Afektif", link: "/catatan-afektif", content: <CatatanAfektif /> },
        { id: "catatankognitif", icon: "fa-brain", text: "Catatan Kognitif", link: "/catatan-kognitif", content: <CatatanKognitif /> },
        { id: "reservasimakan", icon: "fa-cutlery", text: "Reservasi Makan", link: "/reservasi-makan", content: <ReservasiMakan /> },
    ];

    const menuKepegawaianItems = [
        { id: "pegawai", icon: "fa-briefcase", text: "Pegawai", link: "/pegawai", content: <Pegawai /> },
        { id: "anakpegawai", icon: "fa-book", text: "Anak Pegawai", link: "/anak-pegawai", content: <AnakPegawai /> },
        { id: "presensipegawai", icon: "fa-calendar-check", text: "Presensi", link: "/presensi-pegawai", content: <PresensiPegawai /> },
    ];

    const menuMahromItems = [
        { id: "pengunjung", icon: "fa-hands-helping", text: "Pengunjung", link: "/pengunjung", content: <Pengunjung /> },
    ];

    const menuRWSItems = [
        { id: "kehadiranRWS", icon: "fa-list", text: "Kehadiran RWS", link: "/kehadiran-rws", content: <KehadiranRWS /> },
    ];

    const tabsFormulir = [
        { id: "biodata", label: "Biodata", link: "/formulir/biodata", content: <TabBiodata /> },
        { id: "keluarga", label: "Keluarga", link: "/formulir/keluarga", content: <TabKeluarga /> },
        { id: "santri", label: "Santri", link: "/formulir/santri", content: <TabSantri /> },
        { id: "domisili", label: "Domisili Santri", link: "/formulir/domisili-santri", content: <TabDomisiliSantri /> },
        { id: "waliasuh", label: "Wali Asuh", link: "/formulir/wali-asuh", content: <TabWaliAsuh /> },
        { id: "pendidikan", label: "Pendidikan", link: "/formulir/pendidikan", content: <TabPendidikan /> },
        { id: "pengajar", label: "Pengajar", link: "/formulir/pengajar", content: <TabPengajar /> },
        { id: "karyawan", label: "Karyawan", link: "/formulir/karyawan", content: <TabKaryawan /> },
        { id: "pengurus", label: "Pengurus", link: "/formulir/pengurus", content: <TabPengurus /> },
        { id: "khadam", label: "Khadam", link: "/formulir/khadam", content: <TabKhadam /> },
        { id: "berkas", label: "Berkas", link: "/formulir/berkas", content: <TabBerkas /> },
        { id: "warpes", label: "Warga Pesantren", link: "/formulir/warga-pesantren", content: <TabWarPes /> },
        { id: "progress", label: "Progress Report", link: "/formulir/progress-report", content: <TabProgress /> },
    ];

    const subPesertaDidik = [
        { id: "santri", text: "Santri", link: "/peserta-didik/santri", content: <PesertaDidik /> },
        { id: "santri-non-domisili", text: "Santri-Non-Domisili", link: "/peserta-didik/santri-non-domisili", content: <PesertaDidik /> },
        { id: "pelajar", text: "Pelajar", link: "/peserta-didik/pelajar", content: <PesertaDidik /> },
        { id: "bersaudara-kandung", text: "Bersaudara Kandung", link: "/peserta-didik/bersaudara-kandung", content: <PesertaDidik /> }
    ];

    const NavigationMenu = () => {
        const location = useLocation();
    
        return (
            <nav className="mt-4 px-4">
                <ul>
                    {menuItems.map((item) => {
                        // const isActive = location.pathname.startsWith(item.link);
                        const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");
    
                        return (
                            <li key={item.id} className="mb-2">
                                <Link
                                    to={item.link}
                                    className={`flex items-center cursor-pointer ${
                                        isActive ? "text-blue-500 font-bold" : "text-gray-700"
                                    }`}
                                >
                                    <i className={`${item.icon} mr-2`}></i>
                                    {item.text}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    };

    const MenuItem = ({ icon, text, link, onClick }) => {
        const location = useLocation();
        // const isActive = location.pathname.startsWith(link);
        const isActive = location.pathname === link || location.pathname.startsWith(link + "/");

    
        return (
            <li className="mb-2">
                <Link
                    to={link}
                    className={`flex items-center cursor-pointer ${
                        isActive ? "text-blue-500 font-bold" : "text-gray-700"
                    }`}
                    onClick={onClick}
                >
                    <i className={`fas ${icon} mr-4`}></i>
                    {text}
                </Link>
            </li>
        );
    };

    const DropdownMenu = ({ items }) => {
        const location = useLocation();
    
        return (
            <ul className="mt-2">
                {items.map((item) => {
                    // const isActive = location.pathname.startsWith(item.link);
                    const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");
    
                    return (
                        <div key={item.id}>
                            <MenuItem
                                icon={item.icon}
                                text={item.text}
                                link={item.link || `/${item.id}`}
                                isActive={isActive}
                                onClick={() => {
                                    if (item.id === "pesertadidik") {
                                        setSubmenuPesertaDidik(!submenuPesertaDidik);
                                    }
                                }}
                            />
    
                            {item.id === "pesertadidik" && submenuPesertaDidik && <SubMenuDropdownPesertaDidik />}
                        </div>
                    );
                })}
            </ul>
        );
    };

    const SubMenuDropdownPesertaDidik = () => {
        const location = useLocation();
    
        return (
            <ul className="ml-4 mt-2">
                {subPesertaDidik.map((subItem) => {
                    const isActive = location.pathname === subItem.link;
                    
                    return (
                        <li key={subItem.id} className="mb-2">
                            <Link 
                                to={subItem.link} 
                                className={`flex items-center cursor-pointer ${
                                    isActive ? "text-cyan-500 font-bold" : "text-gray-700"
                                }`}
                            >
                                <i className="fas fa-chevron-right mr-2"></i>
                                {subItem.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        );
    };
    
    
    const MenuHeader = ({ name, isOpen, onClick }) => (
        <h2
            className="text-gray-600 text-sm flex items-center justify-between cursor-pointer"
            onClick={onClick}
        >
            {name}
            <i className={`fas fa-chevron-${isOpen ? "up" : "down"} ml-2`}></i>
        </h2>
    );

    useEffect(() => {
        sessionStorage.setItem("dropdownDataPokok", dropdownDataPokok);
    }, [dropdownDataPokok]);
    
    useEffect(() => {
        sessionStorage.setItem("submenuPesertaDidik", submenuPesertaDidik);
    }, [submenuPesertaDidik]);
    
    useEffect(() => {
        sessionStorage.setItem("dropdownDataKewaliasuhan", dropdownDataKewaliasuhan);
    }, [dropdownDataKewaliasuhan]);
    
    useEffect(() => {
        sessionStorage.setItem("dropdownDataKepesantrenan", dropdownDataKepesantrenan);
    }, [dropdownDataKepesantrenan]);
    
    useEffect(() => {
        sessionStorage.setItem("dropdownDataKepegawaian", dropdownDataKepegawaian);
    }, [dropdownDataKepegawaian]);
    
    useEffect(() => {
        sessionStorage.setItem("dropdownDataMahrom", dropdownDataMahrom);
    }, [dropdownDataMahrom]);
    
    useEffect(() => {
        sessionStorage.setItem("dropdownDataRWS", dropdownDataRWS);
    }, [dropdownDataRWS]);
    
    // useEffect(() => {
    //     const handleUnload = (event) => {
    //         if (event.type === "unload") {
    //             sessionStorage.removeItem("dropdownDataPokok");
    //             sessionStorage.removeItem("submenuPesertaDidik");
    //             sessionStorage.removeItem("dropdownDataKewaliasuhan");
    //             sessionStorage.removeItem("dropdownDataKepesantrenan");
    //             sessionStorage.removeItem("dropdownDataKepegawaian");
    //             sessionStorage.removeItem("dropdownDataMahrom");
    //             sessionStorage.removeItem("dropdownDataRWS");
    //         }
    //     };
    
    //     window.addEventListener("unload", handleUnload);
    //     return () => window.removeEventListener("unload", handleUnload);
    // }, []);    
    
    const toggleDropdown = (setter) => {
        setter(prev => !prev);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdownProfil = () => {
        setIsOpen(prev => !prev);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };


    return (
        <>
            <Router>
                <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start rtl:justify-end">
                                <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                                    aria-controls="logo-sidebar" type="button" onClick={toggleSidebar}
                                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                    <span className="sr-only">Open sidebar</span>
                                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" fillRule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                        </path>
                                    </svg>
                                </button>
                                <a href="/" className="flex ms-2 md:me-24">
                                    <img src="https://storage.googleapis.com/a1aa/image/1dsIGwi4uJ6QEe_oGx13MQ1TbFWwv1BJ682AG_-wBxw.jpg" className="h-8 me-3" alt="Pedatren Logo" />
                                    <span
                                        className="self-center text-white text-xl font-semibold sm:text-2xl whitespace-nowrap ">PEDATREN</span>
                                </a>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center ms-3 relative">
                                    <div className='flex flex-row-reverse'>
                                        <button
                                            type="button"
                                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600 cursor-pointer"
                                            aria-expanded={isOpen}
                                            onClick={toggleDropdownProfil}
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <img className="w-10 h-10 rounded-full"
                                                src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                                alt="user photo" />
                                        </button>
                                    </div>

                                    {isOpen && (
                                        <div
                                            className="absolute right-[-12px] mt-43 z-50 w-48 text-base list-none bg-gray-700 divide-y divide-gray-600 rounded-sm shadow-md"
                                        >
                                            <div className="px-4 py-3" role="none">
                                                <p className="text-sm text-white" role="none">Nahrawi</p>
                                                <p className="text-sm font-medium text-gray-300 truncate" role="none">
                                                    ( Supervisor )
                                                </p>
                                            </div>
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white" role="menuitem">
                                                        Sign out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </nav>
                <aside id="logo-sidebar"
                    className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                    aria-label="Sidebar">
                    <div className="w-64 bg-white h-full shadow-md flex flex-col">
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                            <NavigationMenu />
                            <div className="mt-6 px-4">
                                <MenuHeader
                                    name="DATA POKOK"
                                    isOpen={dropdownDataPokok}
                                    onClick={() => toggleDropdown(setDropdownDataPokok)}
                                />
                                {dropdownDataPokok && (
                                    <DropdownMenu items={menuDataPokokItems} />
                                )}
                            </div>
                            <div className="mt-6 px-4">
                                <MenuHeader name="KEWALIASUHAN" isOpen={dropdownDataKewaliasuhan} onClick={() => toggleDropdown(setDropdownKewaliasuhan)} />
                                {dropdownDataKewaliasuhan && (
                                    <DropdownMenu items={menuKewaliasuhanItems} />
                                )}
                            </div>
                            <div className="mt-6 px-4">
                                <MenuHeader name="KEPESANTRENAN" isOpen={dropdownDataKepesantrenan} onClick={() => toggleDropdown(setDropdownKepesantrenan)} />
                                {dropdownDataKepesantrenan && (
                                    <ul className="mt-2">
                                        <DropdownMenu items={menuKepesantrenanItems} />
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 px-4">
                                <MenuHeader name="KEPEGAWAIAN" isOpen={dropdownDataKepegawaian} onClick={() => toggleDropdown(setDropdownKepegawaian)} />
                                {dropdownDataKepegawaian && (
                                    <ul className="mt-2">
                                        <DropdownMenu items={menuKepegawaianItems} />
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 px-4">
                                <MenuHeader name="MAHROM" isOpen={dropdownDataMahrom} onClick={() => toggleDropdown(setDropdownMahrom)} />
                                {dropdownDataMahrom && (
                                    <ul className="mt-2">
                                        <DropdownMenu items={menuMahromItems} />
                                    </ul>
                                )}
                            </div>
                            <div className="mt-6 px-4">
                                <MenuHeader name="RAPAT WALI SANTRI" isOpen={dropdownDataRWS} onClick={() => toggleDropdown(setDropdownRWS)} />
                                {dropdownDataRWS && (
                                    <ul className="mt-2">
                                        <DropdownMenu items={menuRWSItems} />
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="pr-6 sm:ml-64 overflow-y-auto w-full">
                    <div className="pt-8 mt-8">
                        <Routes>
                            <Route path="/formulir" element={<Formulir />}>
                                <Route path="/formulir" element={<Navigate to="/formulir/biodata" replace />} />
                                {tabsFormulir.map((tab) => (
                                    <Route key={tab.id} path={tab.link} element={tab.content} />
                                ))}
                            </Route>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            {menuItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuDataPokokItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuKewaliasuhanItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuKepesantrenanItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuKepegawaianItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuMahromItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {menuRWSItems.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                            {subPesertaDidik.map((tab) => (
                                <Route key={tab.id} path={tab.link} element={tab.content} />
                            ))}
                        </Routes>
                    </div>
                </div>
            </Router>
        </>
    );
};

export default MainPage;