"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import StatCard from "../../components/ortu/StatCard"
import ChildSelector from "../../components/ortu/ChildSelector"
import MobileNav from "../../components/ortu/MobileNav"

const DashboardOrtu = () => {
    // const { student } = useAuth()

    const student = [
        {
            id: 1,
            name: "Muhammad Faiz Ahmad",
            nis: "2024001",
            class: "X IPA 1",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Mondok",
        },
        {
            id: 2,
            name: "Siti Aisyah Ahmad",
            nis: "2024002",
            class: "VIII A",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Pulang",
        },
        {
            id: 3,
            name: "Abdullah Ahmad",
            nis: "2024003",
            class: "XII IPS 2",
            photoUrl: "/placeholder.svg?height=100&width=100",
            dormStatus: "Mondok",
        },
    ]

    // Mock data - replace with actual API calls
    const metrics = {
        hafalan: { progressPct: 75, target: "Juz 15", lastUpdate: "2025-01-20" },
        izin: { bulanIni: 2, aktif: 0 },
        pelanggaran: { bulanIni: 1, poin: 5 },
        sholat: { kehadiranPct: 95 },
        afektif: { skor: 85 },
        kognitif: { rataRata: 88 },
        saldo: { amount: 150000 },
        tagihan: { aktif: 2, totalTunggakan: 500000 },
    }

    const timelineData = [
        { date: "2025-01-15", type: "hafalan", title: "Setoran Juz 14 Ayat 1-10", desc: "Nilai: A" },
        { date: "2025-01-18", type: "izin", title: "Izin Pulang", desc: "Disetujui" },
        { date: "2025-01-20", type: "kognitif", title: "Ujian Matematika", desc: "Nilai: 90" },
    ]

    const progressData = [
        { week: "Minggu 1", hafalan: 65, afektif: 80, kognitif: 85 },
        { week: "Minggu 2", hafalan: 70, afektif: 82, kognitif: 87 },
        { week: "Minggu 3", hafalan: 75, afektif: 85, kognitif: 88 },
        { week: "Minggu 4", hafalan: 75, afektif: 85, kognitif: 88 },
    ]

    // const formatCurrency = (amount) => {
    //     return new Intl.NumberFormat("id-ID", {
    //         style: "currency",
    //         currency: "IDR",
    //         minimumFractionDigits: 0,
    //     }).format(amount)
    // }

    return (
        <>
            <div className="lg:hidden">
                <ChildSelector />
            </div>
            <div className="space-y-6 p-6 mb-16 lg:mb-0">
                {/* Student Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-12 lg:mt-0">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                            alt={student?.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-primary-200"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{student?.name}</h1>
                            <div className="flex flex-col sm:flex-row items-left sm:items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                <span>
                                    <i className="fas fa-id-card mr-1"></i>NIS: {student?.nis}
                                </span>
                                <span>
                                    <i className="fas fa-graduation-cap mr-1"></i> {student?.class}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    <i className="fas fa-home mr-1"></i> {student?.dormStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Progress Hafalan"
                        value={`${metrics.hafalan.progressPct}%`}
                        icon="fa-book-quran"
                        color="green"
                        trend="up"
                        trendValue="5% dari bulan lalu"
                    />
                    <StatCard title="Izin Bulan Ini" value={metrics.izin.bulanIni} icon="fa-file-alt" color="blue" />
                    <StatCard title="Pelanggaran" value={metrics.pelanggaran.bulanIni} icon="fa-exclamation-triangle" color="red" />
                    <StatCard
                        title="Kehadiran Sholat"
                        value={`${metrics.sholat.kehadiranPct}%`}
                        icon="fa-pray"
                        color="purple"
                        trend="up"
                        trendValue="2% dari minggu lalu"
                    />
                    <StatCard title="Skor Afektif" value={metrics.afektif.skor} icon="fa-heart" color="yellow" />
                    <StatCard
                        title="Rata-rata Kognitif"
                        value={metrics.kognitif.rataRata}
                        icon="fa-brain"
                        color="blue"
                        trend="up"
                        trendValue="3 poin dari bulan lalu"
                    />
                    {/* <SantriAfektifCard title="Saldo Dompet" value={formatCurrency(metrics.saldo.amount)} icon="fa-wallet" color="green" /> */}
                    <StatCard title="Tagihan Aktif" value={metrics.tagihan.aktif} icon="fa-file-invoice" color="red" />
                </div>

                {/* Progress Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        <i className="fas fa-chart-line mr-2 text-primary-600"></i> Progress Bulanan
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="week" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgb(31 41 55)",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "white",
                                    }}
                                />
                                <Line type="monotone" dataKey="hafalan" stroke="#22c55e" strokeWidth={2} name="Hafalan" />
                                <Line type="monotone" dataKey="afektif" stroke="#3b82f6" strokeWidth={2} name="Afektif" />
                                <Line type="monotone" dataKey="kognitif" stroke="#f59e0b" strokeWidth={2} name="Kognitif" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Timeline & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            <i className="fas fa-clock mr-2 text-primary-600"></i> Timeline Terbaru
                        </h2>
                        <div className="space-y-4">
                            {timelineData.map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                        <i
                                            className={`fas ${item.type === "hafalan"
                                                ? "fa-book-quran"
                                                : item.type === "izin"
                                                    ? "fa-file-alt"
                                                    : "fa-graduation-cap"
                                                } text-xs text-primary-600`}
                                        ></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString("id-ID")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            <i className="fas fa-bell mr-2 text-primary-600"></i> Notifikasi
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-medium text-green-800">Izin Disetujui</p>
                                <p className="text-xs text-green-600">Izin pulang tanggal 18 Januari telah disetujui</p>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800">Tagihan Jatuh Tempo</p>
                                <p className="text-xs text-yellow-600">SPP bulan Februari jatuh tempo 3 hari lagi</p>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-800">Limit Pengeluaran</p>
                                <p className="text-xs text-blue-600">Pengeluaran minggu ini sudah mencapai 80%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:hidden">
                <MobileNav />
            </div>
        </>
    )
}

export default DashboardOrtu
