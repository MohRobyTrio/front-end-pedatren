// import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/Logout";
import logo from "../assets/logoku.png";
import { getRolesString } from "../utils/getRolesString";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faRightFromBracket, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ModalAddUser, ModalUpdatePassword, ModalUpdateProfil } from "./modal/ModalFormProfil";
import Access from "./Access";

const Navbar = ({ toggleSidebar, toggleDropdownProfil, isOpen, profilRef, toggleButtonRef }) => {
    const navigate = useNavigate();
    const { logout, isLoggingOut } = useLogout();
    const [openModalUpdateNameEmail, setOpenModalUpdateNameEmail] = useState(false);
    const [openModalUpdatePass, setOpenModalUpdatePass] = useState(false);
    const [openModalAddUser, setOpenModalAddUser] = useState(false);
    const userName = localStorage.getItem("name") || sessionStorage.getItem("name");

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout gagal:", error.message);
        }
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    {/* Sidebar toggle dan logo + nama */}
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            ref={toggleButtonRef}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSidebar();
                            }}
                            className="sm:hidden text-gray-400 hover:bg-gray-700 p-2 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path clipRule="evenodd" fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                </path>
                            </svg>
                        </button>
                        <a href="/" className="flex items-center ms-2 md:me-24 gap-3">
                            <img
                                src={logo}
                                alt="Sipatren Logo"
                                className="w-10 h-10 drop-shadow"
                                style={{ minWidth: 40, minHeight: 40 }} // menjaga proporsi di mobile
                            />
                           <span className="text-white text-2xl font-semibold leading-none">
                                SIPATREN
                            </span>
                        </a>
                    </div>

                    {/* Avatar dan Dropdown Profil */}
                    <div ref={profilRef} className="relative">
                        <button
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600 cursor-pointer"
                            onClick={toggleDropdownProfil}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                height="40"
                                width="40"
                                className="w-10 h-10 rounded-full"
                                src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                alt="user photo"
                            />
                        </button>

                        <ModalUpdateProfil isOpen={openModalUpdateNameEmail} onClose={() => setOpenModalUpdateNameEmail(false)} />
                        <ModalUpdatePassword isOpen={openModalUpdatePass} onClose={() => setOpenModalUpdatePass(false)} />
                        <Access action="tambahakun">
                            <ModalAddUser isOpen={openModalAddUser} onClose={() => setOpenModalAddUser(false)} />
                        </Access>
                        {isOpen && (
                            <div className="absolute right-0 z-50 mt-3 w-56 text-base list-none bg-gray-700 divide-y divide-gray-400 rounded-xl shadow-lg overflow-hidden">
                                <div className="px-4 py-3">
                                    <p className="text-sm font-semibold text-white">{userName}</p>
                                    <p className="text-sm text-gray-400 truncate">({getRolesString()})</p>
                                </div>
                                <ul className="p-1 space-y-1">
                                    <li>
                                        <button
                                            onClick={() => setOpenModalUpdateNameEmail(true)}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out rounded-md cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            Edit Nama & Email
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenModalUpdatePass(true)}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out rounded-md cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faLock} />
                                            Edit Password
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenModalAddUser(true)}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out rounded-md cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} />
                                            Tambah Akun
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white disabled:opacity-50 transition duration-200 ease-in-out rounded-md cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />
                                            {isLoggingOut ? "Logging out..." : "Log out"}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );

};


export default Navbar;