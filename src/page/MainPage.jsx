import { useState } from 'react';
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
import WaliAsuh from '../content_main_page/content_kewaliasuhan/WaliAsuh';
import GroupKewaliasuhan from '../content_main_page/content_kewaliasuhan/GroupKewaliasuhan';
import AnakAsuh from '../content_main_page/content_kewaliasuhan/AnakAsuh';
import Perizinan from '../content_main_page/content _kepesantrenan/Perizinan';
import Pelanggaran from '../content_main_page/content _kepesantrenan/Pelanggaran';
import Presensi from '../content_main_page/content _kepesantrenan/Presensi';
import CatatanAfektif from '../content_main_page/content _kepesantrenan/CatatanAfektif';

const MainPage = () => {
    const [dropdownDataPokok, setDropdownDataPokok] = useState(false);
    const [submenuPesertaDidik, setSubmenuPesertaDidik] = useState(false);
    const [dropdownDataKewaliasuhan, setDropdownKewaliasuhan] = useState(false);
    const [dropdownDataKepesantrenan, setDropdownKepesantrenan] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const menuDataPokokItems = [
        { id: "orangtua", icon: "fa-user", text: "Orang Tua", content: <OrangTua /> },
        { id: "wali", icon: "fa-user-tie", text: "Wali", content: <Wali /> },
        { id: "pengajar", icon: "fa-chalkboard-teacher", text: "Pengajar", content: <Pengajar /> },
        { id: "pengurus", icon: "fa-user-cog", text: "Pengurus", content: <Pengurus /> },
        { id: "karyawan", icon: "fa-briefcase", text: "Karyawan", content: <Karyawan /> },
        { id: "walikelas", icon: "fa-chalkboard", text: "Wali Kelas", content: <WaliKelas /> },
        { id: "khadam", icon: "fa-hands-helping", text: "Khadam", content: <Khadam /> },
        { id: "alumni", icon: "fa-user-graduate", text: "Alumni", content: <Alumni /> },
    ];

    const menuKewaliasuhanItems = [
        { id: "waliasuh", icon: "fa-user-shield", text: "Wali Asuh", content: <WaliAsuh /> },
        { id: "groupkewaliasuhan", icon: "fa-book-open", text: "Group Kewaliasuhan", content: <GroupKewaliasuhan /> },
        { id: "anakasuh", icon: "fa-users", text: "Anak Asuh", link: "/anak-asuh", content: <AnakAsuh /> },
    ];

    const menuKepesantrenanItems = [
        { id: "perizinan", icon: "fa-id-card", text: "Perizinan", content: <Perizinan /> },
        { id: "pelanggaran", icon: "fa-exclamation-triangle", text: "Pelanggaran", content: <Pelanggaran /> },
        { id: "presensi", icon: "fa-calendar-check", text: "Presensi", content: <Presensi /> },
        { id: "catatanafektif", icon: "fa-hand-holding-heart", text: "Catatan Afektif", content: <CatatanAfektif /> },
    ];

    const MenuItem = ({ id, icon, text }) => {
        return (
            <li className="mb-2">
                <a className={`flex items-center cursor-pointer ${activeTab === id ? "text-blue-500 font-bold" : "text-gray-700"}`} onClick={() => setActiveTab(id)}>
                    <i className={`fas ${icon} mr-2`}></i>
                    {text}
                </a>
            </li>
        );
    };

    const DropdownMenu = ({ items }) => {
        return (
            <ul className="mt-2">
                {items.map((item, index) => (
                    <MenuItem key={index} icon={item.icon} text={item.text} id={item.id} />
                ))}
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
        // setIsSidebarOpen(prev => {
        //     console.log(prev ? "tertutup" : "terbuka");
        //     return !prev;
        // });
    };


    return (
        <>
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
                            {/* <div className="flex items-center ms-3">
                                <div className='flex flex-row-reverse'>
                                    <button type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
                                        aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-10 h-10 rounded-full"
                                            src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                            alt="user photo"></img>
                                    </button>
                                    <div className="px-4 text-center" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            Nahrawi
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            ( Supervisor )
                                        </p>
                                    </div>
                                </div>
                                <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                                    id="dropdown-user">
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            Nahrawi
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            ( Supervisor )
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <a href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                role="menuitem">Sign out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}

                            <div className="flex items-center ms-3 relative">
                                <div className='flex flex-row-reverse'>
                                    <button
                                        type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600 cursor-pointer"
                                        aria-expanded={isOpen}
                                        onClick={toggleDropdownProfil} // Toggle saat diklik
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-10 h-10 rounded-full"
                                            src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                            alt="user photo" />
                                    </button>
                                </div>

                                {/* Dropdown User */}
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
                        <nav className="mt-4 px-4">
                            <ul>
                                <li className="mb-2">
                                    <a className={`flex items-center cursor-pointer ${activeTab === 'dashboard' ? "text-blue-500 font-bold" : "text-gray-700"}`} onClick={() => setActiveTab('dashboard')}>
                                        <i className="fas fa-tachometer-alt mr-2"></i>
                                        Dashboard
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a className={`flex items-center cursor-pointer ${activeTab === 'scanqrcode' ? "text-blue-500 font-bold" : "text-gray-700"}`} onClick={() => setActiveTab('scanqrcode')}>
                                        <i className="fas fa-qrcode mr-2"></i>
                                        Scan QRCode
                                    </a>
                                </li>
                                <li className="mb-2">
                                    {/* <a className="flex items-center active text-gray-700" href="#" to="/formulir"> */}
                                    <a className={`flex items-center cursor-pointer ${activeTab === 'formulir' ? "text-blue-500 font-bold" : "text-gray-700"}`} onClick={() => setActiveTab('formulir')}>
                                        <i className="fas fa-file-alt mr-2"></i>
                                        Formulir
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className="mt-6 px-4">
                            <MenuHeader
                                name="DATA POKOK"
                                isOpen={dropdownDataPokok}
                                onClick={() => toggleDropdown(setDropdownDataPokok)}
                            />
                            {dropdownDataPokok && (
                                <ul className="mt-2">
                                    <li className="mb-2">
                                        <a className={`flex items-center cursor-pointer ${activeTab === 'listPesertaDidik' ? "text-blue-500 font-bold" : "text-gray-700"}`} onClick={() => {
                                            toggleDropdown(setSubmenuPesertaDidik);
                                            setActiveTab('listPesertaDidik');
                                        }} >
                                            <i className="fas fa-users mr-2"></i>Peserta Didik
                                        </a>
                                        {submenuPesertaDidik && (
                                            <ul className="ml-4 mt-2">
                                                <li className="mb-2">
                                                    <a className="text-gray-700 flex items-center" href="#">
                                                        <i className="fas fa-chevron-right mr-2"></i>
                                                        Santri
                                                    </a>
                                                </li>
                                                <li className="mb-2">
                                                    <a className="text-gray-700 flex items-center" href="#">
                                                        <i className="fas fa-chevron-right mr-2"></i>
                                                        Santri-Non-Domisili
                                                    </a>
                                                </li>
                                                <li className="mb-2">
                                                    <a className="text-gray-700 flex items-center" href="#">
                                                        <i className="fas fa-chevron-right mr-2"></i>
                                                        Pelajar
                                                    </a>
                                                </li>
                                                <li className="mb-2">
                                                    <a className="text-gray-700 flex items-center" href="#">
                                                        <i className="fas fa-chevron-right mr-2"></i>
                                                        Bersaudara Kandung
                                                    </a>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                    <DropdownMenu items={menuDataPokokItems} />
                                </ul>
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
                    </div>
                </div>
            </aside>

            <div className="pr-6 sm:ml-64 overflow-y-auto no-scrollbar w-full">
                <div className="pt-8 mt-8">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'scanqrcode' && <ScanQRCode />}
                    {activeTab === 'formulir' && <Formulir />}
                    {activeTab === 'listPesertaDidik' && <PesertaDidik />}
                    {menuDataPokokItems.map((tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>)}
                    {menuKepesantrenanItems.map((tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>)}
                    {menuKewaliasuhanItems.map((tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>)}
                </div>
            </div>
        </>
    );
};

export default MainPage;