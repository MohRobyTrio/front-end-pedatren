"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

export default function PelanggaranPage() {
    const { activeChild: selectedChild } = useActiveChild()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
    const pageSize = 10

    useEffect(() => {
        setLoading(true)
        // const activeChild = sessionStorage.getItem("active_child")
        // if (activeChild) {
        //     setSelectedChild(JSON.parse(activeChild))
        // }

        // Simulate API call - replace with actual API
        setTimeout(() => {
            // Mock empty response
            // eslint-disable-next-line no-unused-vars
            const emptyResponse = {
                success: true,
                message: "Santri belum memiliki data pelanggaran.",
                data: [],
                status: 200,
            }

            // Mock populated response
            const populatedResponse = {
                success: true,
                message: "Data pelanggaran berhasil diambil.",
                status: 200,
                meta: {
                    current_page: 1,
                    per_page: 25,
                    total: 4,
                    last_page: 1,
                },
                data: [
                    {
                        status_pelanggaran: "Selesai",
                        jenis_pelanggaran: "Ringan",
                        jenis_putusan: "Teguran lisan",
                        diproses_mahkamah: 0,
                        keterangan: "Terlambat sholat subuh 10 menit",
                        created_at: "2025-01-15 06:30:00",
                        pencatat: "Ustadz Ahmad",
                    },
                    {
                        status_pelanggaran: "Sedang diproses",
                        jenis_pelanggaran: "Sedang",
                        jenis_putusan: "Pembinaan khusus",
                        diproses_mahkamah: 1,
                        keterangan: "Keluar kamar tanpa izin setelah jam 22:00",
                        created_at: "2025-01-10 22:15:00",
                        pencatat: "Ustadz Budi",
                    },
                    {
                        status_pelanggaran: "Selesai",
                        jenis_pelanggaran: "Ringan",
                        jenis_putusan: "Peringatan tertulis",
                        diproses_mahkamah: 0,
                        keterangan: "Tidak rapi berpakaian",
                        created_at: "2025-01-08 07:00:00",
                        pencatat: "Ustadz Candra",
                    },
                    {
                        status_pelanggaran: "Sedang diproses",
                        jenis_pelanggaran: "Ringan",
                        jenis_putusan: "Dibebaskan",
                        diproses_mahkamah: 1,
                        keterangan: "Sip",
                        created_at: "2025-09-04 13:51:26",
                        pencatat: "Super Admin",
                    },
                ],
            }

            // Use populated response for demo
            setData(populatedResponse.data)
            setLoading(false)
        }, 1000)
    }, [selectedChild])

    const formatTanggal = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const getKategoriColor = (kategori) => {
        switch (kategori?.toLowerCase()) {
            case "ringan":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "sedang":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "berat":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "selesai":
                return "bg-green-100 text-green-800 border-green-200"
            case "sedang diproses":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const filteredData = data.filter(
        (item) =>
            item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jenis_pelanggaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jenis_putusan?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }))
    }

    const stats = {
        total: data.length,
        bulanIni: data.filter((item) => {
            const itemDate = new Date(item.created_at)
            const now = new Date()
            return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
        }).length,
        diproses: data.filter((item) => item.diproses_mahkamah === 1).length,
        ringan: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "ringan").length,
        sedang: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "sedang").length,
        berat: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "berat").length,
    }

    // eslint-disable-next-line no-unused-vars
    const mockChartData = [
        { label: "Okt", value: 2 },
        { label: "Nov", value: 4 },
        { label: "Des", value: 1 },
        { label: "Jan", value: 3 },
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                        <div className="h-64 bg-gray-200 rounded-lg"></div>
                        {/* <div className="h-96 bg-gray-200 rounded-lg"></div> */}
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
                        <AlertTriangle className="mr-3 h-6 w-6 text-orange-600" />
                        Pelanggaran
                    </h1>
                    <p className="text-gray-600 mt-1">Riwayat pelanggaran {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Total Pelanggaran</p>
                                <p className="text-2xl font-bold text-orange-700">{stats.total}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-red-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Bulan Ini</p>
                                <p className="text-2xl font-bold text-red-700">{stats.bulanIni}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-red-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Diproses Mahkamah</p>
                                <p className="text-2xl font-bold text-purple-700">{stats.diproses}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-sm">⚖</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">Kategori</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-yellow-600">Ringan</span>
                                    <span className="font-semibold">{stats.ringan}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-orange-600">Sedang</span>
                                    <span className="font-semibold">{stats.sedang}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-red-600">Berat</span>
                                    <span className="font-semibold">{stats.berat}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                {/* <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <TrendingDown className="mr-2 h-5 w-5 text-orange-600" />
                            Grafik Pelanggaran per Bulan
                        </h3>
                    </div>
                    <div className="h-64 flex items-end justify-center space-x-4">
                        {mockChartData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className="bg-orange-500 rounded-t w-12 transition-all duration-300 hover:bg-orange-600"
                                    style={{ height: `${(item.value / Math.max(...mockChartData.map((d) => d.value))) * 200}px` }}
                                ></div>
                                <div className="mt-2 text-sm text-gray-600">{item.label}</div>
                                <div className="text-xs text-gray-500">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="pl-6 pt-6 pr-6">
                        <h3 className="text-lg font-semibold text-gray-900">Riwayat Pelanggaran</h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Cari jenis pelanggaran atau keterangan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>

                        {data.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Data Pelanggaran</h3>
                                <p className="text-gray-500">Santri belum memiliki data pelanggaran.</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th
                                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                                    onClick={() => handleSort("created_at")}
                                                >
                                                    Tanggal
                                                </th>
                                                <th
                                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                                    onClick={() => handleSort("jenis_pelanggaran")}
                                                >
                                                    Jenis
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700">Putusan</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700">Mahkamah</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700">Keterangan</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700">Pencatat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-900">{formatTanggal(item.created_at)}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getKategoriColor(item.jenis_pelanggaran)}`}
                                                        >
                                                            {item.jenis_pelanggaran}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status_pelanggaran)}`}
                                                        >
                                                            {item.status_pelanggaran}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">{item.jenis_putusan}</td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {item.diproses_mahkamah ? (
                                                            <span className="text-blue-600 font-medium">Ya</span>
                                                        ) : (
                                                            <span className="text-gray-500">Tidak</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{item.keterangan}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{item.pencatat}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
                                            {Math.min(currentPage * pageSize, sortedData.length)} dari {sortedData.length} data
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === i + 1
                                                            ? "bg-orange-600 text-white"
                                                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
