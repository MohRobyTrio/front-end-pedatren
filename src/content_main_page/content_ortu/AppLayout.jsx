import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
    Home,
    BookOpen,
    FileText,
    AlertTriangle,
    GraduationCap,
    Wallet,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Calendar,
    ChevronLeft,
    ReceiptText,
    MessageCircle
} from "lucide-react";
import logoUser from "../../assets/user_no_bg.png"
import { useActiveChild } from "../../components/ortu/useActiveChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";

const navigation = [
    { name: "Dashboard", href: "/wali/home", icon: Home },
    { name: "Hafalan", href: "/wali/hafalan", icon: BookOpen },
    { name: "Presensi", href: "/wali/presensi", icon: Calendar },
    { name: "Perizinan", href: "/wali/perizinan", icon: FileText },
    { name: "Pelanggaran", href: "/wali/pelanggaran", icon: AlertTriangle },
    { name: "Akademik", href: "/wali/akademik", icon: GraduationCap },
    { name: "Transaksi", href: "/wali/transaksi", icon: Wallet },
    { name: "Tagihan", href: "/wali/tagihan", icon: ReceiptText },
    { name: "Pesan", href: "/wali/pesan", icon: MessageCircle },
    { name: "Batas Pengeluaran", href: "/wali/batas-pengeluaran", icon: Settings },
    { name: "Profil Santri", href: "/wali/profil", icon: User },
]

// eslint-disable-next-line no-unused-vars
const mobileNavigation = [
    { name: "Home", href: "/wali/home", icon: Home },
    { name: "Hafalan", href: "/wali/hafalan", icon: BookOpen },
    { name: "Akademik", href: "/wali/akademik", icon: GraduationCap },
    { name: "Keuangan", href: "/wali/keuangan", icon: Wallet },
    { name: "Profil", href: "/wali/profil", icon: User },
]

export const AppLayout = () => {
    const [user, setUser] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [showChildSelector, setShowChildSelector] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [billingData, setBillingData] = useState({})
    // const [billingData, setBillingData] = useState({ count: 3, total: 2500000 })


    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const sidebarRef = useRef(null)
    const dropdownRef = useRef(null);
    const dropdownProfileRef = useRef(null);
    const contentRef = useRef(null);

    const { activeChild: selectedChild, updateActiveChild } = useActiveChild()

    const isHome = location.pathname === "/wali/home";

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    // Ambil judul halaman dinamis dari path
    const getTitle = () => {
        switch (location.pathname) {
            case "/wali/hafalan":
                return "Hafalan";
            case "/wali/keuangan":
                return "Keuangan";
            case "/wali/akademik":
                return "Akademik";
            case "/wali/perizinan":
                return "Perizinan";
            case "/wali/pelanggaran":
                return "Pelanggaran";
            case "/wali/batas-pengeluaran":
                return "Batas Pelanggaran";
            case "/wali/presensi":
                return "Presensi";
            case "/wali/profil":
                return "Profil Santri";
            default:
                return "Portal Wali";
        }
    };

    // ... existing useEffect for mobile detection ...
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const userData = sessionStorage.getItem("user_data")
        if (userData) {
            const parsedUser = JSON.parse(userData)
            const stored = sessionStorage.getItem("active_child");
            setUser(parsedUser)

            if (!stored && !selectedChild && parsedUser.children && parsedUser.children.length > 0) {
                updateActiveChild(parsedUser.children[0])
            }
        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChild])

    const handleLogout = () => {
        sessionStorage.removeItem("auth_token_ortu")
        sessionStorage.removeItem("user_data")
        sessionStorage.removeItem("active_child")
        navigate("/ortu")
    }

    const handleChildSelect = (child) => {
        updateActiveChild(child)
        setMobileMenuOpen(false)
        setShowChildSelector(false)
    }

    useEffect(() => {
        if (selectedChild) {
            console.log("[AppLayout] Active child updated:", selectedChild)
        }
    }, [selectedChild])

    // ... existing useEffect for sidebar touch handling ...
    useEffect(() => {
        const sidebar = sidebarRef.current
        if (!sidebar) return

        const handleTouchMove = (e) => {
            e.stopPropagation()
        }

        sidebar.addEventListener("touchmove", handleTouchMove, { passive: false })
        return () => sidebar.removeEventListener("touchmove", handleTouchMove)
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowChildSelector(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownProfileRef.current && !dropdownProfileRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Memuat aplikasi...</div>
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Memuat data pengguna...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {billingData && Object.keys(billingData).length > 0 && (
                <div className="sticky top-0 z-50 w-full bg-red-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between mx-auto">
                        <div className="flex items-center space-x-3">
                            <Wallet className="h-5 w-5" />

                            <span className="font-medium">
                                {/* Anda memiliki {billingData?.count} tagihan aktif senilai Rp {billingData?.total.toLocaleString("id-ID")} */}
                                Anda memiliki {billingData?.count} tagihan aktif
                            </span>
                        </div>
                        <button
                            onClick={() => navigate("/wali/tagihan")}
                            className="bg-white text-red-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>
            )}
            {/* ... existing mobile menu overlay ... */}
            {mobileMenuOpen && isMobile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            )}

            {!isMobile && (
                <>
                    {/* Sidebar */}
                    <div
                        ref={sidebarRef}
                        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain ${isMobile ? (mobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
                            }`}
                        style={{
                            WebkitOverflowScrolling: "touch",
                            top: billingData && Object.keys(billingData).length > 0 ? "3rem" : "0rem", // kalau ada notif → geser 3rem
                            height: billingData && Object.keys(billingData).length > 0 ? "calc(100vh - 3rem)" : "100vh", // kalau ada notif → kurangi tinggi
                        }}

                    >
                        <div className="flex flex-col h-full">
                            {/* ... existing header ... */}
                            <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    P
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-emerald-800">Portal Wali</h1>
                                    <p className="text-sm text-emerald-600">Santri</p>
                                </div>
                            </div>

                            {/* Child selector */}
                            {user.children && user.children.length > 1 && selectedChild && (
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Pilih Santri:</p>
                                    <select
                                        className="w-full border border-gray-300 rounded px-2 py-1"
                                        value={selectedChild.id}
                                        onChange={(e) =>
                                            handleChildSelect(user.children.find((c) => c.id == Number.parseInt(e.target.value)))
                                        }
                                    >
                                        {user.children.map((child) => (
                                            <option key={child.id} value={child.id}>
                                                {child.nama} - {child.nis}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ... existing navigation and user menu ... */}
                            <nav className="flex-1 p-4 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={item.name}
                                            className={`w-full text-left px-3 py-2 rounded flex items-center ${isActive
                                                ? "bg-emerald-600 text-white"
                                                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                }`}
                                            onClick={() => {
                                                navigate(item.href)
                                                setMobileMenuOpen(false)
                                            }}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.name}
                                        </button>
                                    )
                                })}
                            </nav>

                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium">
                                        {user.email.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.nama}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button className="ml-auto text-red-600 text-sm" onClick={handleLogout}>
                                        Keluar <LogOut className="inline-block h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isMobile && (
                isHome ? (
                    <>
                        {/* ... existing mobile AppBar and bottom navigation ... */}
                        <div className={`fixed ${billingData && Object.keys(billingData).length > 0 ? "top-12" : "top-0"}  left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm`}>
                            <h1 className="text-base font-semibold text-emerald-700 whitespace-nowrap flex-shrink-0 mr-2">Portal Wali</h1>
                            <div className="flex items-center space-x-3 relative min-w-0">
                                {user?.children && user.children.length > 1 && (
                                    <div className="relative min-w-0" ref={dropdownRef}>
                                        <button
                                            onClick={() => setShowChildSelector(!showChildSelector)}
                                            className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors w-full max-w-[250px]"
                                        >
                                            <User className="h-4 w-4 flex-shrink-0" />
                                            <span className="font-medium text-sm truncate flex-1 min-w-0">
                                                {selectedChild?.nama || "Pilih Santri"}
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 flex-shrink-0 transition-transform ${showChildSelector ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        <div>

                                            {showChildSelector && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <div className="py-2">
                                                        {user.children.map((child) => (
                                                            <button
                                                                key={child.id}
                                                                onClick={() => handleChildSelect(child)}
                                                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedChild?.id == child.id ? "bg-emerald-50 text-emerald-700" : "text-gray-700"}`}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <span className="text-xs font-semibold text-emerald-700">{child.nama.charAt(0)}</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm">{child.nama}</p>
                                                                        <p className="text-xs text-gray-500">NIS: {child.nis}</p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="relative flex-shrink-0" ref={dropdownProfileRef}>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 hover:scale-105 active:scale-95 transition-all duration-200 p-1"
                                        aria-label="Open user menu"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <img
                                            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                                            src={logoUser || "/placeholder.svg"}
                                            alt="user"
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
                                                <p className="text-sm font-bold text-gray-800">{user.nama}</p>
                                                <p className="text-xs text-emerald-600">{user.email}</p>
                                            </div>
                                            <ul className="py-2">
                                                <li>
                                                    <button
                                                        onClick={() => navigate("/wali/profil")}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium rounded-lg mx-2 transition-all duration-200 text-sm"
                                                    >
                                                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                                        Profile
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-lg mx-2 transition-all duration-200 text-sm"
                                                    >
                                                        <FontAwesomeIcon icon={faRightFromBracket} className="text-red-400" />
                                                        Keluar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={`fixed ${billingData && Object.keys(billingData).length > 0 ? "top-12" : "top-0"} left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm`}
                        >
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate("/wali/home")}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-200 shadow-sm group"
                                >
                                    <ChevronLeft className="h-4 w-4 group-hover:text-emerald-600 transition-colors" />
                                    <Home className="h-4 w-4 group-hover:text-emerald-600 transition-colors" />
                                    <span className="font-medium text-sm">Home</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <h1 className="text-lg font-bold text-gray-800">{getTitle()}</h1>
                                    <p className="text-xs text-emerald-600 font-medium">Portal Wali Santri</p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-white font-bold text-xs">P</span>
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}

            {/* {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-2 py-1">
                    <div className="flex justify-around items-center">
                        {mobileNavigation.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.name}
                                    className={`flex flex-col items-center justify-center h-14 w-14 p-1 ${isActive
                                        ? "text-emerald-600 bg-emerald-50 rounded-xl"
                                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                                        }`}
                                    onClick={() => navigate(item.href)}
                                >
                                    <Icon className="h-5 w-5 mb-1" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )} */}

            <div className={`${isMobile ? "pt-14" : "sm:pl-64"}`}>
                {/* <main className={`flex-1 overflow-auto p-1 lg:p-8 ${isMobile ? "pb-20" : ""}`}> */}
                <main ref={contentRef} className={`flex-1 overflow-auto p-1 lg:p-8`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
