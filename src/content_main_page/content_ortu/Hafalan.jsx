"use client"

import { useState } from "react"
import { BookOpen, Award, Calendar, BookMarked, CheckCircle, Clock } from "lucide-react"
import { FaChartLine, FaSort, FaSortDown, FaSortUp } from "react-icons/fa"
import useFetchTahfidzOrtu from "../../hooks/hooks_ortu/Tahfidz"
import useFetchNadhomanOrtu from "../../hooks/hooks_ortu/Nadhoman"
import { useActiveChild } from "../../components/ortu/useActiveChild"

// const mockNadhomanData = {
//     nadhoman: [
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Jazariyah",
//             tanggal: "2025-08-30",
//             jenis_setoran: "murojaah",
//             bait: "6-7",
//             nilai: "lancar",
//             catatan: null,
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Tuhfatul Athfal",
//             tanggal: "2025-08-18",
//             jenis_setoran: "murojaah",
//             bait: "5-7",
//             nilai: "lancar",
//             catatan: null,
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Tashrif",
//             tanggal: "2025-08-23",
//             jenis_setoran: "murojaah",
//             bait: "1-5",
//             nilai: "lancar",
//             catatan: "Setoran lancar",
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Bina",
//             tanggal: "2025-08-10",
//             jenis_setoran: "baru",
//             bait: "30-31",
//             nilai: "kurang",
//             catatan: "Setoran lancar",
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Alfiyah Ibnu Malik",
//             tanggal: "2025-09-04",
//             jenis_setoran: "murojaah",
//             bait: "294-298",
//             nilai: "cukup",
//             catatan: null,
//             status: "proses",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Imrithi",
//             tanggal: "2025-08-12",
//             jenis_setoran: "baru",
//             bait: "72-76",
//             nilai: "lancar",
//             catatan: "Setoran lancar",
//             status: "proses",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Aqidatul Awam",
//             tanggal: "2025-08-19",
//             jenis_setoran: "murojaah",
//             bait: "17-19",
//             nilai: "cukup",
//             catatan: "Setoran lancar",
//             status: "proses",
//             pencatat: "Super Admin",
//         },
//     ],
//     rekap_nadhoman: [
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Jazariyah",
//             total_bait: 7,
//             persentase_selesai: "6.42",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Tuhfatul Athfal",
//             total_bait: 7,
//             persentase_selesai: "11.48",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Tashrif",
//             total_bait: 5,
//             persentase_selesai: "8.33",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Bina",
//             total_bait: 31,
//             persentase_selesai: "62.00",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Alfiyah Ibnu Malik",
//             total_bait: 298,
//             persentase_selesai: "29.74",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Imrithi",
//             total_bait: 76,
//             persentase_selesai: "29.92",
//         },
//         {
//             nis: "84913716992",
//             santri_nama: "Martana Iswahyudi M.Ak",
//             nama_kitab: "Nadzom Aqidatul Awam",
//             total_bait: 19,
//             persentase_selesai: "33.33",
//         },
//     ],
// }

// const mockTahfidzData = {
//     tahfidz: [
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             tanggal: "2025-09-09",
//             jenis_setoran: "baru",
//             surat: "Al-Baqarah 1-286",
//             nilai: "lancar",
//             catatan: "Sip",
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//         {
//             santri_nama: "Martana Iswahyudi M.Ak",
//             tanggal: "2025-09-09",
//             jenis_setoran: "baru",
//             surat: "Al-Fatihah 1-7",
//             nilai: "lancar",
//             catatan: "Sip",
//             status: "tuntas",
//             pencatat: "Super Admin",
//         },
//     ],
//     rekap_tahfidz: {
//         nis: "84913716992",
//         santri_nama: "Martana Iswahyudi M.Ak",
//         total_surat: 2,
//         persentase_khatam: "1.75",
//         surat_tersisa: 112,
//         sisa_persentase: "98.25",
//         jumlah_setoran: 2,
//         rata_rata_nilai: "1.00",
//         tanggal_mulai: "2025-09-09",
//         tanggal_selesai: null,
//     },
// }

export const HafalanPage = () => {
    const { activeChild: selectedChild } = useActiveChild()
    const [activeTab, setActiveTab] = useState("tahfidz")
    const [statusFilter, setStatusFilter] = useState("semua")
    const [dateRange, setDateRange] = useState({ start: "", end: "" })

    const { data, loading, error, fetchData, totalData } = useFetchTahfidzOrtu({})
    const { data: dataNadhoman, loading: loadingNadhoman, error: errorNadhoman, fetchData: fetchDataNadhoman, totalData: totalDataNadhoman } = useFetchNadhomanOrtu({})


    const Badge = ({ children, variant = "default" }) => {
        const variants = {
            default: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            danger: "bg-red-100 text-red-800",
            info: "bg-blue-100 text-blue-800",
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
                {children}
            </span>
        )
    }

    const Card = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
    )

    const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>

    const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>

    const CardTitle = ({ children, className = "" }) => (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
    )

    const Select = ({ value, onValueChange, children, className = "" }) => {
        return (
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className}`}
            >
                {children}
            </select>
        )
    }

    function Button({ children, variant = "default", onClick, className = "" }) {
        const variants = {
            default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-200",
        }

        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        )
    }

    const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

    const DataTable = ({ data, columns, searchPlaceholder }) => {
        const [searchTerm, setSearchTerm] = useState("")
        const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
        const [currentPage, setCurrentPage] = useState(1)
        const pageSize = 10

        const filteredData = data.filter((item) =>
            Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
        )

        const sortedData = [...filteredData].sort((a, b) => {
            if (!sortConfig.key) return 0

            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })

        const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

        const totalPages = Math.ceil(sortedData.length / pageSize)

        const handleSort = (key) => {
            setSortConfig({
                key,
                direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
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
                {/* <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                /> */}

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
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * pageSize + 1} sampai{" "}
                            {Math.min(currentPage * pageSize, sortedData.length)} dari {sortedData.length} data
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
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

    const nadhomanColumns = [
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
            key: "nama_kitab",
            label: "Nama Kitab",
            sortable: true,
            render: (value) => (
                <div className="flex items-center">
                    <BookMarked className="h-4 w-4 text-emerald-500 mr-2" />
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            ),
        },
        {
            key: "bait",
            label: "Bait",
            sortable: false,
            render: (value) => <Badge variant="info">{value}</Badge>,
        },
        {
            key: "jenis_setoran",
            label: "Jenis Setoran",
            sortable: true,
            render: (value) => (
                <Badge variant={value === "baru" ? "success" : "default"}>{value === "baru" ? "Baru" : "Muraja'ah"}</Badge>
            ),
        },
        {
            key: "nilai",
            label: "Nilai",
            sortable: true,
            render: (value) => {
                const getValueColor = (val) => {
                    switch (val) {
                        case "lancar":
                            return "text-green-600 bg-green-50"
                        case "cukup":
                            return "text-yellow-600 bg-yellow-50"
                        case "kurang":
                            return "text-red-600 bg-red-50"
                        default:
                            return "text-gray-600 bg-gray-50"
                    }
                }
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getValueColor(value)}`}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                )
            },
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <div className="flex items-center">
                    {value === "tuntas" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                    )}
                    <Badge variant={value === "tuntas" ? "success" : "warning"}>{value === "tuntas" ? "Tuntas" : "Proses"}</Badge>
                </div>
            ),
        },
        {
            key: "catatan",
            label: "Catatan",
            sortable: false,
            render: (value) => <span className="text-sm text-gray-600 max-w-xs truncate block">{value || "-"}</span>,
        },
        {
            key: "pencatat",
            label: "Pencatat",
            sortable: true,
            render: (value) => <span className="text-sm text-gray-500">{value}</span>,
        },
    ]

    const tahfidzColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => formatTanggal(value),
        },
        {
            key: "surat",
            label: "Surat",
            sortable: true,
        },
        {
            key: "jenis_setoran",
            label: "Jenis Setoran",
            sortable: true,
            render: (value) => (
                <Badge variant={value === "baru" ? "success" : "default"}>{value === "baru" ? "Baru" : "Muraja'ah"}</Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <Badge variant={value === "tuntas" ? "success" : "warning"}>
                    {value === "tuntas" ? "Tuntas" : "Belum Tuntas"}
                </Badge>
            ),
        },
        {
            key: "nilai",
            label: "Nilai",
            sortable: true,
            render: (value) => (
                <span
                    className={`font-semibold ${value === "lancar" ? "text-emerald-600" : value === "kurang_lancar" ? "text-yellow-600" : "text-red-600"
                        }`}
                >
                    {value === "lancar" ? "Lancar" : value === "kurang_lancar" ? "Kurang Lancar" : "Tidak Lancar"}
                </span>
            ),
        },
        {
            key: "catatan",
            label: "Catatan",
            sortable: false,
            render: (value) => <span className="text-sm text-gray-600 max-w-xs truncate block">{value}</span>,
        },
        {
            key: "pencatat",
            label: "Pencatat",
            sortable: true,
            render: (value) => <span className="text-sm text-gray-500">{value}</span>,
        },
    ]

    const currentColumns = activeTab === "tahfidz" ? tahfidzColumns : nadhomanColumns
    const currentData = activeTab === "tahfidz" ? data?.tahfidz || [] : dataNadhoman?.nadhoman || []

    // Filter data based on status and date range
    const filteredData = currentData.filter((item) => {
        const statusMatch = statusFilter === "semua" || item.status === statusFilter
        const dateMatch =
            (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
        return statusMatch && dateMatch
    })

    const getNadhomanStats = () => {
        if (!dataNadhoman?.nadhoman || !dataNadhoman?.rekap_nadhoman) {
            return { totalKitab: 0, tuntas: 0, proses: 0, totalBait: 0, avgPersentase: 0 }
        }

        const nadhomanData = dataNadhoman.nadhoman
        const rekapData = dataNadhoman.rekap_nadhoman

        return {
            totalKitab: rekapData.length,
            tuntas: nadhomanData.filter((item) => item.status === "tuntas").length,
            proses: nadhomanData.filter((item) => item.status === "proses").length,
            totalBait: rekapData.reduce((sum, item) => sum + item.total_bait, 0),
            avgPersentase:
                rekapData.reduce((sum, item) => sum + Number.parseFloat(item.persentase_selesai), 0) / rekapData.length || 0,
        }
    }

    const nadhomanStats = getNadhomanStats()

    // Convert percentage to number for calculations
    const percentage =
        activeTab === "tahfidz" ? Number(data?.rekap_tahfidz?.persentase_khatam || 0) : nadhomanStats.avgPersentase

    // Determine progress color based on percentage
    const getProgressColor = (percent) => {
        if (percent >= 80) return "bg-green-500"
        if (percent >= 60) return "bg-blue-500"
        if (percent >= 40) return "bg-yellow-500"
        return "bg-red-500"
    }

    const getProgressTextColor = (percent) => {
        if (percent >= 80) return "text-green-600"
        if (percent >= 60) return "text-blue-600"
        if (percent >= 40) return "text-yellow-600"
        return "text-red-600"
    }

    if (loading || loadingNadhoman) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-96 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BookOpen className="mr-3 h-6 w-6 text-emerald-600" />
                        Hafalan Tahfidz & Nadhoman
                    </h1>
                    <p className="text-gray-600 mt-1">Progress hafalan tahfidz dan nadhoman {selectedChild?.nama || "santri"}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            <Button
                                variant={activeTab === "tahfidz" ? "default" : "ghost"}
                                onClick={() => setActiveTab("tahfidz")}
                                className="flex-1 rounded-md"
                            >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Tahfidz
                            </Button>
                            <Button
                                variant={activeTab === "nadhoman" ? "default" : "ghost"}
                                onClick={() => setActiveTab("nadhoman")}
                                className="flex-1 rounded-md"
                            >
                                <Award className="h-4 w-4 mr-2" />
                                Nadhoman
                            </Button>
                        </div>
                    </CardHeader>

                    <div className="p-6 space-y-6">
                        {activeTab === "tahfidz" && (
                            // <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <FaChartLine className="mr-2 text-green-600" />
                                    Progress Hafalan {activeTab === "tahfidz" ? "Tahfidz" : "Nadhoman"}
                                </h2>
                                <div className="space-y-6">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {activeTab === "tahfidz" ? "Persentase Khatam" : "Rata-rata Progress"}
                                            </span>
                                            <span className={`text-sm font-bold ${getProgressTextColor(percentage)}`}>
                                                {percentage.toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Statistics Grid */}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-green-600">{data?.rekap_tahfidz?.total_surat || 0}</div>
                                            <div className="text-sm text-gray-600">Total Surat</div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-blue-600">{data?.rekap_tahfidz?.jumlah_setoran || 0}</div>
                                            <div className="text-sm text-gray-600">Jumlah Setoran</div>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {data?.rekap_tahfidz?.surat_tersisa || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Surat Tersisa</div>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {data?.rekap_tahfidz?.sisa_persentase || 0}%
                                            </div>
                                            <div className="text-sm text-gray-600">Tersisa</div>
                                        </div>
                                    </div>
                                    {/* ) 
                                // : (
                                //     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                //         <div className="bg-emerald-50 p-4 rounded-lg text-center">
                                //             <div className="text-2xl font-bold text-emerald-600">{nadhomanStats.totalKitab}</div>
                                //             <div className="text-sm text-gray-600">Total Kitab</div>
                                //         </div>

                                //         <div className="bg-green-50 p-4 rounded-lg text-center">
                                //             <div className="text-2xl font-bold text-green-600">{nadhomanStats.tuntas}</div>
                                //             <div className="text-sm text-gray-600">Tuntas</div>
                                //         </div>

                                //         <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                //             <div className="text-2xl font-bold text-yellow-600">{nadhomanStats.proses}</div>
                                //             <div className="text-sm text-gray-600">Dalam Proses</div>
                                //         </div>

                                //         <div className="bg-blue-50 p-4 rounded-lg text-center">
                                //             <div className="text-2xl font-bold text-blue-600">{nadhomanStats.totalBait}</div>
                                //             <div className="text-sm text-gray-600">Total Bait</div>
                                //         </div>
                                //     </div>
                                // ) */}
                                </div>
                            </div>
                        )}

                        {activeTab === "nadhoman" && dataNadhoman?.rekap_nadhoman && (
                            <>
                                {/* <div className="bg-white rounded-xl shadow-lg p-6"> */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <BookMarked className="mr-2 text-emerald-600" />
                                    Progress Nadhoman per Kitab
                                </h3>
                                <div className="space-y-4">
                                    {dataNadhoman.rekap_nadhoman.map((kitab, index) => (
                                        <div key={index} className="border rounded-lg border-gray-300 p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium text-gray-900">{kitab.nama_kitab}</h4>
                                                <span className="text-sm font-semibold text-emerald-600">
                                                    {Number.parseFloat(kitab.persentase_selesai).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${kitab.persentase_selesai}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500">{kitab.total_bait} bait total</div>
                                        </div>
                                    ))}
                                </div>
                                {/* </div> */}
                            </>
                        )}

                        {/* Filters and Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail {activeTab === "tahfidz" ? "Tahfidz" : "Nadhoman"}</CardTitle>
                                {/* <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Tanggal mulai"
                                    />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Tanggal akhir"
                                    />
                                    <Select value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-48">
                                        <SelectItem value="semua">Semua Status</SelectItem>
                                        <SelectItem value="tuntas">Tuntas</SelectItem>
                                        <SelectItem value="proses">Proses</SelectItem>
                                    </Select>
                                </div> */}
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={filteredData}
                                    columns={currentColumns}
                                    searchPlaceholder={`Cari ${activeTab === "tahfidz" ? "surat, jenis setoran" : "kitab, bait"}, atau catatan...`}
                                    pageSize={10}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
