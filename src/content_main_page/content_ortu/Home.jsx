"use client"

import { useState, useEffect } from "react"
import { BookOpen, FileText, AlertTriangle, GraduationCap, Wallet, Settings, Bell, ChevronRight, Calendar } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useActiveChild } from "../../components/ortu/useActiveChild"

// ... existing StatCard and ChildCard components ...
function StatCard({ title, value, subtitle, icon: Icon, color = "emerald", href }) {
    return (
        <Link to={href}>
            <div className={`p-4 bg-white rounded-lg border border-${color}-100 shadow-sm`}>
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
            title: "Hafalan",
            subtitle: `${mockChildSummary.hafalan.current}/${mockChildSummary.hafalan.total} surah`,
            icon: BookOpen,
            color: "emerald",
            value: `${mockChildSummary.hafalan.percentage}%`,
            href: "/wali/hafalan",
        },
        {
            title: "Keuangan",
            subtitle: "Saldo dompet",
            icon: Wallet,
            color: "purple",
            value: `Rp ${mockChildSummary.saldo.toLocaleString()}`,
            href: "/wali/keuangan",
        },
        {
            title: "Akademik",
            subtitle: "Nilai rata-rata",
            icon: GraduationCap,
            color: "blue",
            value: `${Math.round((mockChildSummary.afektif.rata + mockChildSummary.kognitif.rata) / 2)}`,
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
            title: "Presensi",
            subtitle: "Kehadiran",
            icon: Calendar,
            color: "blue",
            value: "20%",
            href: "/wali/presensi",
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
        const stored = sessionStorage.getItem("active_child");
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
                        {/* {selectedChild && (
                            <p className="text-sm text-gray-600 mt-1">
                                Santri {selectedChild.nama} (NIS: {selectedChild.nis})
                            </p>
                        )} */}
                    </div>
                </div>

                {/* Quick Access Grid */}
                <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                    {quickAccessItems.map((item, index) => (
                        <StatCard key={index} {...item} />
                    ))}
                </div>

                {/* Notifications */}
                {mockNotifications.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Bell className="mr-2 h-5 w-5 text-emerald-600" /> Notifikasi Terbaru
                            </h2>
                            <button
                                onClick={() => navigate("/notifikasi")}
                                className="text-sm text-emerald-600 hover:text-emerald-700"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="space-y-3">
                            {mockNotifications.slice(0, isMobile ? 2 : 3).map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${notification.priority === "high" ? "bg-red-500" : notification.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                                        <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                                        <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SimpleLayout>
    )
}
