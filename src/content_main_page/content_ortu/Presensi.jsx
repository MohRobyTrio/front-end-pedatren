"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Filter, Users, BookMarked, Badge } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchPresensiOrtu from "../../hooks/hooks_ortu/Presensi"
import { data } from "react-router-dom"
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa"

export default function PresensiPage() {
    // const [presensiData, setPresensiData] = useState(null)
    // const [presensiToday, setPresensiToday] = useState(null)
    const [activeTab, setActiveTab] = useState("today")
    const { activeChild } = useActiveChild()

    const { data: presensiData, dataToday: presensiToday, error, loading, fetchData, totalData } = useFetchPresensiOrtu()

    const Card = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
    )

    const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

    // Mock API calls based on the provided endpoints
    // const fetchPresensiData = async () => {
    //     try {
    //         setLoading(true)

    //         // Simulate API call to /presensi
    //         const presensiResponse = {
    //             success: true,
    //             filter: {
    //                 santri_id: activeChild?.id?.toString() || "67",
    //                 tanggal: null,
    //                 sholat_id: null,
    //                 jadwal_id: null,
    //                 metode: null,
    //                 status: "all",
    //                 jenis_kelamin: null,
    //                 all: false,
    //             },
    //             totals: {
    //                 total_hadir: 25,
    //                 total_tidak_hadir: 3,
    //                 total_presensi_tercatat: 28,
    //                 total_santri: 1,
    //             },
    //             data: [
    //                 {
    //                     id: 1,
    //                     tanggal: "2025-01-15",
    //                     sholat: "Subuh",
    //                     status: "hadir",
    //                     waktu_presensi: "05:30:00",
    //                     metode: "manual",
    //                 },
    //                 {
    //                     id: 2,
    //                     tanggal: "2025-01-15",
    //                     sholat: "Dzuhur",
    //                     status: "tidak_hadir",
    //                     waktu_presensi: null,
    //                     metode: null,
    //                 },
    //                 {
    //                     id: 3,
    //                     tanggal: "2025-01-14",
    //                     sholat: "Subuh",
    //                     status: "hadir",
    //                     waktu_presensi: "05:25:00",
    //                     metode: "rfid",
    //                 },
    //             ],
    //         }

    //         // Simulate API call to /presensi-today
    //         const presensiTodayResponse = {
    //             success: true,
    //             filter: {
    //                 santri_id: activeChild?.id?.toString() || "67",
    //                 tanggal: "2025-01-15",
    //                 sholat_id: null,
    //             },
    //             data: [
    //                 {
    //                     id: 1,
    //                     sholat: "Subuh",
    //                     status: "hadir",
    //                     waktu_presensi: "05:30:00",
    //                     jadwal_waktu: "05:00:00",
    //                     metode: "manual",
    //                 },
    //                 {
    //                     id: 2,
    //                     sholat: "Dzuhur",
    //                     status: "tidak_hadir",
    //                     waktu_presensi: null,
    //                     jadwal_waktu: "12:00:00",
    //                     metode: null,
    //                 },
    //                 {
    //                     id: 3,
    //                     sholat: "Ashar",
    //                     status: "belum_dimulai",
    //                     waktu_presensi: null,
    //                     jadwal_waktu: "15:30:00",
    //                     metode: null,
    //                 },
    //             ],
    //         }

    //         // Simulate network delay
    //         await new Promise((resolve) => setTimeout(resolve, 1000))

    //         setPresensiData(presensiResponse)
    //         setPresensiToday(presensiTodayResponse)
    //     } catch (error) {
    //         console.error("Error fetching presensi data:", error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     fetchPresensiData()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [activeChild])

    useEffect(() => {
        console.log("Presensi Today Data:", presensiToday);
    }, [presensiToday])

    const getStatusColor = (status) => {
        switch (status) {
            case "Hadir":
                return "text-green-600 bg-green-100"
            case "tidak hadir":
                return "text-red-600 bg-red-100"
            case "sedang waktu presensi":
                return "text-gray-600 bg-gray-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Hadir":
                return <CheckCircle className="h-4 w-4" />
            case "tidak hadir":
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

    const DataTable = ({ data, columns }) => {
        const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
        const [currentPage, setCurrentPage] = useState(1)
        const pageSize = 10

        const sortedData = [...data].sort((a, b) => {
            if (!sortConfig.key) return 0

            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })

        const paginatedData = sortedData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        )

        const totalPages = Math.ceil(sortedData.length / pageSize)

        const handleSort = (key) => {
            setSortConfig({
                key,
                direction:
                    sortConfig.key === key && sortConfig.direction === "asc"
                        ? "desc"
                        : "asc",
            })
        }

        const getSortIcon = (columnKey) => {
            if (sortConfig.key !== columnKey) {
                return <FaSort className="inline ml-1 text-gray-400" />
            }
            return sortConfig.direction === "asc" ? (
                <FaSortUp className="inline ml-1 text-gray-600" />
            ) : (
                <FaSortDown className="inline ml-1 text-gray-600" />
            )
        }

        return (
            <div className="space-y-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            {column.label}
                                            {column.sortable && getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * pageSize + 1} sampai{" "}
                            {Math.min(currentPage * pageSize, sortedData.length)} dari{" "}
                            {sortedData.length} data
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const formatTanggal = (tanggal) => {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const presensiColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => (
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {formatTanggal(value)}
                </div>
            ),
        },
        {
            key: "nama_sholat",
            label: "Sholat",
            sortable: true,
            render: (value) => (
                <div className="flex items-center">
                    <BookMarked className="h-4 w-4 text-emerald-500 mr-2" />
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            ),
        },
        {
            key: "waktu_presensi",
            label: "Waktu Presensi",
            sortable: false,
            render: (value) => <span className="text-sm text-gray-600">{value || "-"}</span>,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(value)}`}>{value}</span>
            ),
        },
        {
            key: "metode",
            label: "Metode",
            sortable: true,
            render: (value) => <span className="text-sm text-gray-600 capitalize">{value || "-"}</span>,
        },
    ]

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
                                        <p className="text-2xl font-bold text-green-700">{presensiData?.totals?.total_hadir}</p>
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
                                        <p className="text-2xl font-bold text-red-700">{presensiData?.totals?.total_tidak_hadir}</p>
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
                                        <p className="text-2xl font-bold text-blue-700">{presensiData?.totals?.total_presensi_tercatat}</p>
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
                                            {presensiData?.totals?.total_presensi_tercatat > 0
                                                ? Math.round(
                                                    (presensiData?.totals?.total_hadir / presensiData?.totals?.total_presensi_tercatat) * 100
                                                )
                                                : 0}
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
                                    {presensiToday?.data?.length > 0 ? (
                                        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                            {presensiToday.data.map((item) => (
                                                <div
                                                    key={`${item.sholat_id}-${item.tanggal}`}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                                                            {getStatusIcon(item.status)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.nama_sholat}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {item.waktu_presensi ? `Presensi: ${item.waktu_presensi}` : "Belum presensi"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-3 py-1 capitalize rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                            {/* {item.status == "Hadir"
                                                                ? "HADIR"
                                                                : item.status == "tidak hadir"
                                                                    ? "TIDAK HADIR"
                                                                    : "Sedang Waktu Presensi"} */}
                                                            {item.status}
                                                        </span>
                                                        {item.metode && <p className="text-xs text-gray-500 mt-1">{item.metode}</p>}
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
                                            <DataTable
                                                data={presensiData.data}
                                                columns={presensiColumns}
                                                searchPlaceholder={`Cari ${activeTab === "tahfidz" ? "surat, jenis setoran" : "kitab, bait"}, atau catatan...`}
                                                pageSize={10}
                                            />
                                            {/* {presensiData.data.map((item) => (
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
                                            ))} */}
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
