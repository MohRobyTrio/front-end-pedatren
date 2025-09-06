"use client"

import { useState, useEffect } from "react"
import { FileText, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

export default function PerizinanPage() {
    const { activeChild: selectedChild } = useActiveChild()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDetail, setSelectedDetail] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [perizinanData, setPerizinanData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        // const activeChild = sessionStorage.getItem("active_child")
        // if (activeChild) {
        //     setSelectedChild(JSON.parse(activeChild))
        // }

        // Simulate API call - replace with actual API
        setTimeout(() => {
            // Mock API response structure
            const apiResponse = {
                success: true,
                message: "Data perizinan berhasil diambil.",
                status: 200,
                data: [
                    {
                        id: 51,
                        nama_santri: "Jasmin Zelaya Fujiati S.H.",
                        jenis_kelamin: "p",
                        alasan_izin: "Sakit demam",
                        alamat_tujuan: "Rumah",
                        tanggal_mulai: "2025-01-16 08:00:00",
                        tanggal_akhir: "2025-01-18 17:00:00",
                        bermalam: "tidak bermalam",
                        lama_izin: "2 hari",
                        tanggal_kembali: "2025-01-18 17:00:00",
                        jenis_izin: "Kesehatan",
                        status: "sedang proses izin",
                        pembuat: "Super Admin",
                        nama_pengasuh: "Ustadz Ahmad",
                        keterangan: "Izin pulang untuk berobat ke dokter",
                        created_at: "2025-01-15 14:30:00",
                        updated_at: "2025-01-15 14:30:00",
                    },
                ],
            }

            setPerizinanData(apiResponse.data)
            setLoading(false)
        }, 1000)
    }, [selectedChild])

    const formatTanggal = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const formatTanggalWaktu = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "sedang proses izin":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "disetujui":
                return "bg-green-100 text-green-800 border-green-200"
            case "ditolak":
                return "bg-red-100 text-red-800 border-red-200"
            case "selesai":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case "sedang proses izin":
                return "Sedang Proses"
            case "disetujui":
                return "Disetujui"
            case "ditolak":
                return "Ditolak"
            case "selesai":
                return "Selesai"
            default:
                return status
        }
    }

    // Filter data based on search
    const filteredData = perizinanData.filter(
        (item) =>
            item.alasan_izin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jenis_izin?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Pagination
    const pageSize = 10
    const totalPages = Math.ceil(filteredData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

    const stats = {
        total: perizinanData.length,
        proses: perizinanData.filter((item) => item.status === "sedang proses izin").length,
        disetujui: perizinanData.filter((item) => item.status === "disetujui").length,
        ditolak: perizinanData.filter((item) => item.status === "ditolak").length,
    }

    const openModal = (item) => {
        setSelectedDetail(item)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedDetail(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid gap-4 md:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
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
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        Perizinan
                    </h1>
                    <p className="text-gray-600 mt-1">Riwayat perizinan {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-white rounded-lg border border-blue-100 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Perizinan</p>
                                    <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-yellow-100 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Sedang Proses</p>
                                    <p className="text-2xl font-bold text-yellow-700">{stats.proses}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-green-100 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Disetujui</p>
                                    <p className="text-2xl font-bold text-green-700">{stats.disetujui}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-bold">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-red-100 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Ditolak</p>
                                    <p className="text-2xl font-bold text-red-700">{stats.ditolak}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 font-bold">✕</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="pl-6 pr-6 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Riwayat Perizinan</h3>
                    </div>
                    <div className="p-6">
                        {/* Search */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Cari alasan atau keterangan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data perizinan</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {perizinanData.length === 0
                                        ? "Santri belum memiliki data perizinan."
                                        : "Tidak ada data yang sesuai dengan pencarian."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Pengajuan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Alasan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jenis Izin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Mulai
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Akhir
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginatedData.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatTanggal(item.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.alasan_izin}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenis_izin}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatTanggal(item.tanggal_mulai)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatTanggal(item.tanggal_akhir)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}
                                                        >
                                                            {getStatusLabel(item.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => openModal(item)}
                                                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan {startIndex + 1} - {Math.min(startIndex + pageSize, filteredData.length)} dari{" "}
                                            {filteredData.length} data
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

                {/* Modal */}
                {isModalOpen && selectedDetail && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Detail Perizinan</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nama Santri</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.nama_santri}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                                    <p className="text-sm text-gray-900">{formatTanggal(selectedDetail.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Jenis Izin</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.jenis_izin}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Alasan</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.alasan_izin}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Alamat Tujuan</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.alamat_tujuan}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Keterangan</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.keterangan}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                        <p className="text-sm text-gray-900">{formatTanggalWaktu(selectedDetail.tanggal_mulai)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Tanggal Akhir</label>
                                        <p className="text-sm text-gray-900">{formatTanggalWaktu(selectedDetail.tanggal_akhir)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Lama Izin</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.lama_izin}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Bermalam</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.bermalam}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedDetail.status)}`}
                                        >
                                            {getStatusLabel(selectedDetail.status)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Pengasuh</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.nama_pengasuh || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Dibuat Oleh</label>
                                    <p className="text-sm text-gray-900">{selectedDetail.pembuat}</p>
                                </div>
                            </div>
                            <div className="p-6 border-t">
                                <button
                                    onClick={closeModal}
                                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
