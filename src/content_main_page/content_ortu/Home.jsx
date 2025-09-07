"use client"

import { useState, useEffect } from "react"
import {
    BookOpen,
    FileText,
    AlertTriangle,
    GraduationCap,
    Wallet,
    Settings,
    ChevronRight,
    Calendar,
    Receipt,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useActiveChild } from "../../components/ortu/useActiveChild"

// ... existing StatCard and ChildCard components ...
function StatCard({ title, value, subtitle, icon: Icon, color = "emerald", href, isMobile }) {
    const isKeuangan = title === "Keuangan" && isMobile

    if (isKeuangan) {
        return (
            <Link to={href}>
                <div className="relative p-6 md:p-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 md:bg-white rounded-2xl md:rounded-xl border md:border-purple-100 shadow-lg hover:shadow-xl md:hover:shadow-md transition-all duration-300 md:duration-200 overflow-hidden group md:hover:border-purple-200">
                    {/* Background decoration - only on mobile */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 md:hidden"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 md:hidden"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4 md:mb-3">
                            <div className="p-3 md:p-2 rounded-xl md:rounded-lg bg-white/20 md:bg-purple-100 backdrop-blur-sm md:backdrop-blur-none">
                                <Icon className="h-6 w-6 md:h-5 md:w-5 text-white md:text-purple-600" />
                            </div>
                            <div className="flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors">
                                <span className="text-sm font-medium hidden md:inline">Lihat Detail</span>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="space-y-2 md:space-y-1">
                            <h3 className="text-white font-bold text-xl md:text-lg">{title}</h3>
                            <p className="text-white/80 text-sm md:text-xs">{subtitle}</p>
                            <div className="flex items-baseline space-x-2">
                                <p className="text-white font-bold text-2xl md:text-lg">{value}</p>
                                {/* <div className="flex items-center space-x-1 text-green-300">
                                    <div className="w-2 h-2 bg-green-300 md:bg-green-600 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium">Aktif</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link to={href}>
            <div
                className={`p-4 bg-white rounded-xl border border-${color}-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-${color}-200`}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                        <Icon className={`h-5 w-5 text-${color}-600`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-lg">{title}</p>
                    <p className="text-xs text-gray-600">{subtitle}</p>
                    <p className={`text-lg font-bold text-${color}-600`}>{value}</p>
                </div>
            </div>
        </Link>
    )
}

function ChildCard({ child, onClick }) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-emerald-50 transition-colors flex flex-col items-center"
        >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-emerald-700">{child.nama.charAt(0)}</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{child.nama}</p>
            <p className="text-xs text-gray-500">Kelas {child.class}</p>
        </button>
    )
}

function SimpleLayout({ children }) {
    return <div className="min-h-screen bg-gray-50 p-4">{children}</div>
}

export const DashboardPage = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // const [showChildSelector, setShowChildSelector] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const navigate = useNavigate()

    const { activeChild: selectedChild, updateActiveChild } = useActiveChild()

    const mockChildSummary = {
        hafalan: { current: 15, total: 30, percentage: 50 },
        izinAktif: 0,
        pelanggaranBulanIni: 2,
        afektif: { rata: 85, total: 100 },
        kognitif: { rata: 78, total: 100 },
        saldo: 250000,
        tagihanAktif: 1,
        totalTagihan: 500000,
    }

    // eslint-disable-next-line no-unused-vars
    const mockNotifications = [
        {
            id: 1,
            type: "tagihan",
            title: "Tagihan SPP",
            message: "Tagihan SPP bulan Januari akan jatuh tempo dalam 3 hari",
            time: "2 jam yang lalu",
            priority: "high",
        },
        {
            id: 2,
            type: "izin",
            title: "Izin Pulang",
            message: "Permohonan izin pulang telah disetujui",
            time: "5 jam yang lalu",
            priority: "medium",
        },
        {
            id: 3,
            type: "saldo",
            title: "Saldo Menipis",
            message: "Saldo dompet santri tersisa Rp 50.000",
            time: "1 hari yang lalu",
            priority: "medium",
        },
    ]

    const quickAccessItems = [
        {
            title: "Keuangan",
            subtitle: "Saldo dompet",
            icon: Wallet,
            color: "purple",
            value: `Rp ${mockChildSummary.saldo.toLocaleString()}`,
            href: "/wali/keuangan",
        },
        {
            title: "Hafalan",
            subtitle: `Tahfidz & Nadhoman`,
            icon: BookOpen,
            color: "emerald",
            value: `Tidak Ada`,
            href: "/wali/hafalan",
        },
        {
            title: "Presensi",
            subtitle: "Kehadiran",
            icon: Calendar,
            color: "blue",
            value: "Tidak Ada",
            href: "/wali/presensi",
        },
        {
            title: "Akademik",
            subtitle: "Nilai rata-rata",
            icon: GraduationCap,
            color: "blue",
            value: `Tidak Ada`,
            href: "/wali/akademik",
        },
        {
            title: "Perizinan",
            subtitle: "Status izin",
            icon: FileText,
            color: "green",
            value: mockChildSummary.izinAktif === 0 ? "Tidak ada" : `${mockChildSummary.izinAktif} aktif`,
            href: "/wali/perizinan",
        },
        {
            title: "Pelanggaran",
            subtitle: "Bulan ini",
            icon: AlertTriangle,
            color: "orange",
            value: `${mockChildSummary.pelanggaranBulanIni}`,
            href: "/wali/pelanggaran",
        },
        {
            title: "Batas Pengeluaran",
            subtitle: "Pengaturan",
            icon: Settings,
            color: "gray",
            value: "Atur",
            href: "/wali/batas-pengeluaran",
        },
        {
            title: "Tagihan",
            subtitle: "Pengaturan",
            icon: Receipt,
            color: "red",
            value: "3",
            href: "/wali/tagihan",
        },
    ]

    // Detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const userData = sessionStorage.getItem("user_data")

        if (!userData) {
            navigate("/login")
            return
        }

        const parsedUser = JSON.parse(userData)
        const stored = sessionStorage.getItem("active_child")
        setUser(parsedUser)

        if (!stored && !selectedChild && parsedUser.children && parsedUser.children.length > 0) {
            updateActiveChild(parsedUser.children[0])
        }

        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, selectedChild])

    const handleChildSelect = (child) => {
        updateActiveChild(child)
        // setShowChildSelector(false)
    }

    useEffect(() => {
        if (selectedChild) {
            console.log("[Dashboard] Active child updated:", selectedChild)
        }
    }, [selectedChild])

    if (loading) {
        return (
            <SimpleLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            </SimpleLayout>
        )
    }

    if (user?.children && user.children.length > 1 && !selectedChild) {
        return (
            <SimpleLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pilih Santri</h1>
                        <p className="text-gray-600 mt-1">Pilih santri untuk melihat informasi detail</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {user.children.map((child) => (
                            <ChildCard key={child.id} child={child} onClick={() => handleChildSelect(child)} />
                        ))}
                    </div>
                </div>
            </SimpleLayout>
        )
    }

    return (
        <SimpleLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className={`font-bold text-gray-900 ${isMobile ? "text-xl" : "text-2xl"}`}>
                            {isMobile ? "Quick Access" : `Dashboard ${selectedChild?.nama || "Santri"}`}
                        </h1>
                    </div>
                </div>

                {/* Quick Access Grid */}
                <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                    {quickAccessItems.map((item, index) => (
                        <div key={index} className={index === 0 && isMobile ? "col-span-full" : ""}>
                            <StatCard {...item} isMobile={isMobile} />
                        </div>
                    ))}
                </div>
            </div>
        </SimpleLayout>
    )
}
