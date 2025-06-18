import useLogout from "../hooks/Logout";
import logo from "../assets/logoku.png";
import logoUser from "../assets/user.png";

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
    <nav
      className="
        fixed top-0 z-50 w-full
        bg-white/70 backdrop-blur-lg
        shadow-lg border-b border-gray-200
      "
    >
      <div className="px-3 py-1.5 md:px-8 flex items-center justify-between h-[56px]">
        {/* Sidebar toggle dan logo + nama */}
        <div className="flex items-center gap-2">
          <button
            ref={toggleButtonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            }}
            className="
              sm:hidden text-gray-600 hover:bg-gray-100 p-2
              rounded-lg transition
            "
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <a href="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Sipatren Logo"
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg border border-gray-100 group-hover:scale-105 transition"
              style={{ minWidth: 36, minHeight: 36 }}
            />
            <span className="text-neutral-900 text-lg md:text-xl font-bold tracking-tight">
              SIPATREN
            </span>
          </a>
        </div>

        {/* Avatar & Dropdown */}
        <div ref={profilRef} className="relative">
          <button
            type="button"
            className="
              flex items-center bg-white/80 border border-gray-200
              rounded-full shadow focus:ring-2 focus:ring-blue-100
              hover:scale-105 active:scale-95 transition
            "
            onClick={toggleDropdownProfil}
            style={{ padding: 2 }}
            aria-label="Open user menu"
          >
            <img
              height="32"
              width="32"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
              src={logoUser}
              alt="user"
            />
          </button>
          <ModalUpdateProfil isOpen={openModalUpdateNameEmail} onClose={() => setOpenModalUpdateNameEmail(false)} />
          <ModalUpdatePassword isOpen={openModalUpdatePass} onClose={() => setOpenModalUpdatePass(false)} />
          <Access action="tambahakun">
            <ModalAddUser isOpen={openModalAddUser} onClose={() => setOpenModalAddUser(false)} />
          </Access>
          {/* Dropdown */}
          {isOpen && (
            <div className="
              absolute right-0 mt-2 w-56
              bg-white/95 backdrop-blur-lg
              rounded-xl shadow-2xl border border-gray-100
              z-50 overflow-hidden
            ">
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-white">
                <p className="text-sm font-bold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-400">({getRolesString()})</p>
              </div>
              <ul className="py-1 px-1">
                <li>
                  <button
                    onClick={() => setOpenModalUpdateNameEmail(true)}
                    className="
                      flex items-center gap-3 w-full px-4 py-2
                      text-gray-600 hover:bg-blue-50 hover:text-blue-700
                      font-medium rounded-lg transition text-sm
                    "
                  >
                    <FontAwesomeIcon icon={faUser} />
                    Edit Nama & Email
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModalUpdatePass(true)}
                    className="
                      flex items-center gap-3 w-full px-4 py-2
                      text-gray-600 hover:bg-blue-50 hover:text-blue-700
                      font-medium rounded-lg transition text-sm
                    "
                  >
                    <FontAwesomeIcon icon={faLock} />
                    Edit Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModalAddUser(true)}
                    className="
                      flex items-center gap-3 w-full px-4 py-2
                      text-gray-600 hover:bg-blue-50 hover:text-blue-700
                      font-medium rounded-lg transition text-sm
                    "
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    Tambah Akun
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="
                      flex items-center gap-3 w-full px-4 py-2
                      text-red-500 hover:bg-red-50 hover:text-red-700
                      font-medium rounded-lg transition text-sm
                      disabled:opacity-60
                    "
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
    </nav>
  );
};

export default Navbar;
