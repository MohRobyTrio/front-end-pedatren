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
    LogOut
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/wali/home", icon: Home },
    { name: "Hafalan", href: "/wali/hafalan", icon: BookOpen },
    { name: "Perizinan", href: "/wali/perizinan", icon: FileText },
    { name: "Pelanggaran", href: "/wali/pelanggaran", icon: AlertTriangle },
    { name: "Akademik", href: "/wali/akademik", icon: GraduationCap },
    { name: "Keuangan", href: "/wali/keuangan", icon: Wallet },
    { name: "Batas Pengeluaran", href: "/wali/batas-pengeluaran", icon: Settings },
];

const mobileNavigation = [
    { name: "Home", href: "/wali/home", icon: Home },
    { name: "Hafalan", href: "/wali/hafalan", icon: BookOpen },
    { name: "Akademik", href: "/wali/akademik", icon: GraduationCap },
    { name: "Keuangan", href: "/wali/keuangan", icon: Wallet },
    { name: "Profil", href: "/wali/profil", icon: User },
];

export const AppLayout = () => {
    const [user, setUser] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const sidebarRef = useRef(null);

    // Detect mobile screen
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const userData = sessionStorage.getItem("user_data");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.children && parsedUser.children.length > 0) {
                const activeChild = sessionStorage.getItem("active_child");
                if (activeChild) {
                    setSelectedChild(JSON.parse(activeChild));
                } else {
                    setSelectedChild(parsedUser.children[0]);
                    sessionStorage.setItem(
                        "active_child",
                        JSON.stringify(parsedUser.children[0])
                    );
                }
            }
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("user_data");
        sessionStorage.removeItem("active_child");
        navigate("/login");
    };

    const handleChildSelect = (child) => {
        setSelectedChild(child);
        sessionStorage.setItem("active_child", JSON.stringify(child));
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const handleTouchMove = (e) => {
            e.stopPropagation();
        };

        sidebar.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => sidebar.removeEventListener("touchmove", handleTouchMove);
    }, []);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Memuat aplikasi...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Memuat data pengguna...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            {/* {isMobile && (
                <button
                    className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow-md"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            )} */}

            {/* Mobile overlay */}
            {mobileMenuOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {!isMobile && (
                <>
                    {/* Sidebar */}
                    < div
                        ref={sidebarRef}
                        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain ${isMobile
                            ? mobileMenuOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                            : "translate-x-0"
                            }`}
                        style={{ WebkitOverflowScrolling: 'touch', height: '100vh' }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
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
                                            handleChildSelect(
                                                user.children.find((c) => c.id === parseInt(e.target.value))
                                            )
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

                            {/* Navigation */}
                            <nav className="flex-1 p-4 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            className={`w-full text-left px-3 py-2 rounded flex items-center ${isActive
                                                ? "bg-emerald-600 text-white"
                                                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                }`}
                                            onClick={() => {
                                                navigate(item.href);
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.name}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* User menu */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium">
                                        {user.email.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{user.nama}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        className="ml-auto text-red-600 text-sm"
                                        onClick={handleLogout}
                                    >
                                        Keluar <LogOut className="inline-block h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
            }

            {/* Mobile bottom navigation */}
            {
                isMobile && (
                    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-2 py-1">
                        <div className="flex justify-around items-center">
                            {mobileNavigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
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
                                );
                            })}
                        </div>
                    </div>
                )
            }

            <div className={`${isMobile ? "" : "sm:pl-64"}`}>
                <main className={`flex-1 overflow-auto p-1 lg:p-8 ${isMobile ? "pb-20" : ""}`}><Outlet /></main>
            </div>

            {/* <main className="flex-1 overflow-auto p-1 lg:p-8">
                <Outlet />
            </main> */}
        </div >
    );
}
