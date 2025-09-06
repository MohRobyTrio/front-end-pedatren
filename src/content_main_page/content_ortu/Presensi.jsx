"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Filter, Users } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

export default function PresensiPage() {
    const [presensiData, setPresensiData] = useState(null)
    const [presensiToday, setPresensiToday] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("today")
    const { activeChild } = useActiveChild()

    const Card = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
    )

    const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

    // Mock API calls based on the provided endpoints
    const fetchPresensiData = async () => {
        try {
            setLoading(true)

            // Simulate API call to /presensi
            const presensiResponse = {
                success: true,
                filter: {
                    santri_id: activeChild?.id?.toString() || "67",
                    tanggal: null,
                    sholat_id: null,
                    jadwal_id: null,
                    metode: null,
                    status: "all",
                    jenis_kelamin: null,
                    all: false,
                },
                totals: {
                    total_hadir: 25,
                    total_tidak_hadir: 3,
                    total_presensi_tercatat: 28,
                    total_santri: 1,
                },
                data: [
                    {
                        id: 1,
                        tanggal: "2025-01-15",
                        sholat: "Subuh",
                        status: "hadir",
                        waktu_presensi: "05:30:00",
                        metode: "manual",
                    },
                    {
                        id: 2,
                        tanggal: "2025-01-15",
                        sholat: "Dzuhur",
                        status: "tidak_hadir",
                        waktu_presensi: null,
                        metode: null,
                    },
                    {
                        id: 3,
                        tanggal: "2025-01-14",
                        sholat: "Subuh",
                        status: "hadir",
                        waktu_presensi: "05:25:00",
                        metode: "rfid",
                    },
                ],
            }

            // Simulate API call to /presensi-today
            const presensiTodayResponse = {
                success: true,
                filter: {
                    santri_id: activeChild?.id?.toString() || "67",
                    tanggal: "2025-01-15",
                    sholat_id: null,
                },
                data: [
                    {
                        id: 1,
                        sholat: "Subuh",
                        status: "hadir",
                        waktu_presensi: "05:30:00",
                        jadwal_waktu: "05:00:00",
                        metode: "manual",
                    },
                    {
                        id: 2,
                        sholat: "Dzuhur",
                        status: "tidak_hadir",
                        waktu_presensi: null,
                        jadwal_waktu: "12:00:00",
                        metode: null,
                    },
                    {
                        id: 3,
                        sholat: "Ashar",
                        status: "belum_dimulai",
                        waktu_presensi: null,
                        jadwal_waktu: "15:30:00",
                        metode: null,
                    },
                ],
            }

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setPresensiData(presensiResponse)
            setPresensiToday(presensiTodayResponse)
        } catch (error) {
            console.error("Error fetching presensi data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPresensiData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChild])

    const getStatusColor = (status) => {
        switch (status) {
            case "hadir":
                return "text-green-600 bg-green-100"
            case "tidak_hadir":
                return "text-red-600 bg-red-100"
            case "belum_dimulai":
                return "text-gray-600 bg-gray-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "hadir":
                return <CheckCircle className="h-4 w-4" />
            case "tidak_hadir":
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const LoadingSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="px-6 py-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <LoadingSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Users className="mr-3 h-6 w-6 text-blue-600" />
                        Presensi
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola presensi {activeChild?.nama || "santri"}</p>
                </div>

                {presensiData && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-green-100">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Total Hadir</p>
                                        <p className="text-2xl font-bold text-green-700">{presensiData.totals.total_hadir}</p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-100">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">Tidak Hadir</p>
                                        <p className="text-2xl font-bold text-red-700">{presensiData.totals.total_tidak_hadir}</p>
                                    </div>
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-100">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Total Tercatat</p>
                                        <p className="text-2xl font-bold text-blue-700">{presensiData.totals.total_presensi_tercatat}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-100">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-600">Persentase</p>
                                        <p className="text-2xl font-bold text-emerald-700">
                                            {Math.round(
                                                (presensiData.totals.total_hadir / presensiData.totals.total_presensi_tercatat) * 100,
                                            )}
                                            %
                                        </p>
                                    </div>
                                    <Filter className="h-8 w-8 text-emerald-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                        {[
                            { id: "today", label: "Hari Ini", icon: Clock },
                            { id: "history", label: "Riwayat", icon: Calendar },
                        ].map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            {activeTab === "today" && presensiToday && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Presensi Hari Ini - {new Date().toLocaleDateString("id-ID")}
                                    </h3>
                                    {presensiToday.data.length > 0 ? (
                                        <div className="space-y-3">
                                            {presensiToday.data.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                                                            {getStatusIcon(item.status)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.sholat}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Jadwal: {item.jadwal_waktu}
                                                                {item.waktu_presensi && ` | Presensi: ${item.waktu_presensi}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                                                        >
                                                            {item.status.replace("_", " ").toUpperCase()}
                                                        </span>
                                                        {item.metode && <p className="text-xs text-gray-500 mt-1 capitalize">{item.metode}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">Belum ada data presensi hari ini</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "history" && presensiData && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Riwayat Presensi</h3>
                                    {presensiData.data.length > 0 ? (
                                        <div className="space-y-3">
                                            {presensiData.data.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                                                            {getStatusIcon(item.status)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.sholat}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(item.tanggal).toLocaleDateString("id-ID")}
                                                                {item.waktu_presensi && ` - ${item.waktu_presensi}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                                                        >
                                                            {item.status.replace("_", " ").toUpperCase()}
                                                        </span>
                                                        {item.metode && <p className="text-xs text-gray-500 mt-1 capitalize">{item.metode}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">Belum ada riwayat presensi</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
