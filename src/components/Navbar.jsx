"use client"

import React, { useState, useRef } from "react"
import useLogout from "../hooks/Logout"
import logo from "../assets/logoku.png"
import logoUser from "../assets/user.png"
import { getRolesString } from "../utils/getRolesString"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons"
import { ModalAddUser, ModalUpdatePassword, ModalUpdateProfil } from "./modal/ModalFormProfil"
import Access from "./Access"
import { useKeepAliveRef } from "keepalive-for-react"

// Custom hook untuk efek mengetik
function useTypingOnHover(text, speed = 110) {
    const [display, setDisplay] = useState(text)
    const [isTyping, setIsTyping] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
        setIsTyping(true)
        setDisplay("")
        let i = 0
        const type = () => {
            if (i < text.length) {
                setDisplay(text.slice(0, i + 1))
                i++
                timeoutRef.current = setTimeout(type, speed)
            } else {
                setIsTyping(false)
            }
        }
        type()
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setDisplay(text)
        setIsTyping(false)
    }

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return [display, isTyping, handleMouseEnter, handleMouseLeave]
}

const Navbar = ({ toggleSidebar, toggleDropdownProfil, isOpen, profilRef, toggleButtonRef }) => {
    const navigate = useNavigate()
    const { logout, isLoggingOut } = useLogout()
    const [openModalUpdateNameEmail, setOpenModalUpdateNameEmail] = useState(false)
    const [openModalUpdatePass, setOpenModalUpdatePass] = useState(false)
    const [openModalAddUser, setOpenModalAddUser] = useState(false)
    const userName = localStorage.getItem("name") || sessionStorage.getItem("name")
    const [typedPusdatren, isTyping, onPusdatrenHover, onPusdatrenOut] = useTypingOnHover("PUSDATREN", 110)
    const aliveRef = useKeepAliveRef()

    const handleLogout = async () => {
        try {
            await logout()
            aliveRef?.current?.clear();
            aliveRef.current?.refresh();
            aliveRef.current?.destroy();
            navigate("/login")
        } catch (error) {
            console.error("Logout gagal:", error.message)
        }
    }

    const handleProfileClick = () => {
        navigate("/profile")
    }

    return (
        <nav
            className="
      fixed top-0 z-50 w-full
      bg-gray-900/95 backdrop-blur-lg
      shadow-lg border-b border-gray-800
    "
        >
            <div className="px-3 py-1.5 md:px-8 flex items-center justify-between h-[56px]">
                {/* Sidebar toggle dan logo + nama */}
                <div className="flex items-center gap-2">
                    <button
                        ref={toggleButtonRef}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSidebar()
                        }}
                        className="sm:hidden text-gray-200 hover:bg-gray-800 p-2 rounded-lg transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-2 group"
                        onClick={(e) => {
                            e.preventDefault()
                            window.location.reload()
                        }}
                    >
                        <img
                            src={logo || "/placeholder.svg"}
                            alt="Pusdatren Logo"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-lg border border-gray-800 transition"
                            style={{ minWidth: 36, minHeight: 36 }}
                        />
                      <span
  className={`
    text-white text-lg md:text-xl font-bold font-sans
    select-none relative tracking-wide
  `}
  style={{
    minWidth: "8ch",
    display: "inline-block",
    whiteSpace: "nowrap",
    letterSpacing: "0.6px", // bisa 0.5px - 1px
  }}
  onMouseEnter={onPusdatrenHover}
  onMouseLeave={onPusdatrenOut}
>
  {typedPusdatren}
  {isTyping && (
    <span
      className="ml-1 align-middle text-gray-400 animate-blink-cursor"
      style={{
        fontWeight: "400",
        fontSize: "1em",
        transition: "opacity 0.2s",
      }}
    >
      |
    </span>
  )}
</span>

                    </a>
                </div>

                {/* Avatar & Dropdown */}
                <div ref={profilRef} className="relative">
                    <button
                        type="button"
                        className="flex items-center bg-gray-800/80 border border-gray-700
              rounded-full shadow focus:ring-2 focus:ring-blue-900
              hover:scale-105 active:scale-95 transition"
                        onClick={toggleDropdownProfil}
                        style={{ padding: 2 }}
                        aria-label="Open user menu"
                    >
                        <img
                            height="32"
                            width="32"
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                            src={logoUser || "/placeholder.svg"}
                            alt="user"
                        />
                    </button>
                    <ModalUpdateProfil isOpen={openModalUpdateNameEmail} onClose={() => setOpenModalUpdateNameEmail(false)} />
                    <ModalUpdatePassword isOpen={openModalUpdatePass} onClose={() => setOpenModalUpdatePass(false)} />
                    <Access action="tambahakun">
                        <ModalAddUser isOpen={openModalAddUser} onClose={() => setOpenModalAddUser(false)} />
                    </Access>
                    {isOpen && (
                        <div
                            className="
              absolute right-0 mt-2 w-56
              bg-gray-900/95 backdrop-blur-lg
              rounded-xl shadow-2xl border border-gray-800
              z-50 overflow-hidden
            "
                        >
                            <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900">
                                <p className="text-sm font-bold text-white">{userName}</p>
                                <p className="text-xs text-gray-400">({getRolesString()})</p>
                            </div>
                            <ul className="py-1 px-1">
                                <li>
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center gap-3 w-full px-4 py-2
                      text-gray-200 hover:bg-gray-800 hover:text-blue-400
                      font-medium rounded-lg transition text-sm"
                                    >
                                        <FontAwesomeIcon icon={faUser} />
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex items-center gap-3 w-full px-4 py-2
                      text-red-400 hover:bg-red-900 hover:text-white
                      font-medium rounded-lg transition text-sm
                      disabled:opacity-60"
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
    )
}

export default Navbar
