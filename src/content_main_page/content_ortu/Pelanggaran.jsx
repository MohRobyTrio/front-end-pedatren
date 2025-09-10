"use client"

import { AlertTriangle } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchPelanggaranOrtu from "../../hooks/hooks_ortu/Pelanggaran"
import { FaCalendarAlt, FaClipboardList, FaGavel, FaSchool, FaUsers } from "react-icons/fa"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons"

export default function PelanggaranPage() {
    const { activeChild: selectedChild } = useActiveChild()
    // const [searchTerm, setSearchTerm] = useState("")
    // const [currentPage, setCurrentPage] = useState(1)
    // const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
    // const pageSize = 10

    const { data, error, fetchData, loading, totalData } = useFetchPelanggaranOrtu({});

    // useEffect(() => {
    //     setLoading(true)
    //     // const activeChild = sessionStorage.getItem("active_child")
    //     // if (activeChild) {
    //     //     setSelectedChild(JSON.parse(activeChild))
    //     // }

    //     // Simulate API call - replace with actual API
    //     setTimeout(() => {
    //         // Mock empty response
    //         // eslint-disable-next-line no-unused-vars
    //         const emptyResponse = {
    //             success: true,
    //             message: "Santri belum memiliki data pelanggaran.",
    //             data: [],
    //             status: 200,
    //         }

    //         // Mock populated response
    //         const populatedResponse = {
    //             success: true,
    //             message: "Data pelanggaran berhasil diambil.",
    //             status: 200,
    //             meta: {
    //                 current_page: 1,
    //                 per_page: 25,
    //                 total: 4,
    //                 last_page: 1,
    //             },
    //             data: [
    //                 {
    //                     status_pelanggaran: "Selesai",
    //                     jenis_pelanggaran: "Ringan",
    //                     jenis_putusan: "Teguran lisan",
    //                     diproses_mahkamah: 0,
    //                     keterangan: "Terlambat sholat subuh 10 menit",
    //                     created_at: "2025-01-15 06:30:00",
    //                     pencatat: "Ustadz Ahmad",
    //                 },
    //                 {
    //                     status_pelanggaran: "Sedang diproses",
    //                     jenis_pelanggaran: "Sedang",
    //                     jenis_putusan: "Pembinaan khusus",
    //                     diproses_mahkamah: 1,
    //                     keterangan: "Keluar kamar tanpa izin setelah jam 22:00",
    //                     created_at: "2025-01-10 22:15:00",
    //                     pencatat: "Ustadz Budi",
    //                 },
    //                 {
    //                     status_pelanggaran: "Selesai",
    //                     jenis_pelanggaran: "Ringan",
    //                     jenis_putusan: "Peringatan tertulis",
    //                     diproses_mahkamah: 0,
    //                     keterangan: "Tidak rapi berpakaian",
    //                     created_at: "2025-01-08 07:00:00",
    //                     pencatat: "Ustadz Candra",
    //                 },
    //                 {
    //                     status_pelanggaran: "Sedang diproses",
    //                     jenis_pelanggaran: "Ringan",
    //                     jenis_putusan: "Dibebaskan",
    //                     diproses_mahkamah: 1,
    //                     keterangan: "Sip",
    //                     created_at: "2025-09-04 13:51:26",
    //                     pencatat: "Super Admin",
    //                 },
    //             ],
    //         }

    //         // Use populated response for demo
    //         setData(populatedResponse.data)
    //         setLoading(false)
    //     }, 1000)
    // }, [selectedChild])

    // const formatTanggal = (dateString) => {
    //     const date = new Date(dateString)
    //     return date.toLocaleDateString("id-ID", {
    //         day: "2-digit",
    //         month: "short",
    //         year: "numeric",
    //     })
    // }

    // const getKategoriColor = (kategori) => {
    //     switch (kategori?.toLowerCase()) {
    //         case "ringan":
    //             return "bg-yellow-100 text-yellow-800 border-yellow-200"
    //         case "sedang":
    //             return "bg-orange-100 text-orange-800 border-orange-200"
    //         case "berat":
    //             return "bg-red-100 text-red-800 border-red-200"
    //         default:
    //             return "bg-gray-100 text-gray-800 border-gray-200"
    //     }
    // }

    // const getStatusColor = (status) => {
    //     switch (status?.toLowerCase()) {
    //         case "selesai":
    //             return "bg-green-100 text-green-800 border-green-200"
    //         case "sedang diproses":
    //             return "bg-blue-100 text-blue-800 border-blue-200"
    //         default:
    //             return "bg-gray-100 text-gray-800 border-gray-200"
    //     }
    // }

    // const filteredData = data.filter(
    //     (item) =>
    //         item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item.jenis_pelanggaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item.jenis_putusan?.toLowerCase().includes(searchTerm.toLowerCase()),
    // )

    // const sortedData = [...filteredData].sort((a, b) => {
    //     if (!sortConfig.key) return 0

    //     const aValue = a[sortConfig.key]
    //     const bValue = b[sortConfig.key]

    //     if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    //     if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    //     return 0
    // })

    // const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    // const totalPages = Math.ceil(sortedData.length / pageSize)

    // const handleSort = (key) => {
    //     setSortConfig((prev) => ({
    //         key,
    //         direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    //     }))
    // }

    // const stats = {
    //     total: data.length,
    //     bulanIni: data.filter((item) => {
    //         const itemDate = new Date(item.created_at)
    //         const now = new Date()
    //         return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
    //     }).length,
    //     diproses: data.filter((item) => item.diproses_mahkamah === 1).length,
    //     ringan: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "ringan").length,
    //     sedang: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "sedang").length,
    //     berat: data.filter((item) => item.jenis_pelanggaran?.toLowerCase() === "berat").length,
    // }

    // // eslint-disable-next-line no-unused-vars
    // const mockChartData = [
    //     { label: "Okt", value: 2 },
    //     { label: "Nov", value: 4 },
    //     { label: "Des", value: 1 },
    //     { label: "Jan", value: 3 },
    // ]

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

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">

                        {data.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Data Pelanggaran</h3>
                                <p className="text-gray-500">Santri belum memiliki data pelanggaran.</p>
                            </div>
                        ) : (
                            <>
                                {data.map((item, index) => (
                                    <PelanggaranCard key={index} data={item} />
                                ))}

                                {/* {totalPages > 1 && (
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
                                )} */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const PelanggaranCard = ({ data }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Sudah diproses':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-300'
                };
            case 'Sedang diproses':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-800',
                    border: 'border-blue-300'
                };
            case 'Belum diproses':
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300'
                };
        }
    };

    const getSeverityColor = (jenis) => {
        switch (jenis) {
            case 'Berat': return 'text-red-600 bg-red-50 border-red-200';
            case 'Sedang': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Ringan': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const statusConfig = getStatusConfig(data.status_pelanggaran);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Simple Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    {data.status_pelanggaran}
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(data.jenis_pelanggaran)}`}>
                        {data.jenis_pelanggaran}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">

                    {/* Information Section */}
                    <div className="flex-1 min-w-0">

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Left Column */}
                            <div className="space-y-2 text-sm">
                                {/* Jenis Putusan */}
                                <div className="flex items-center gap-2">
                                    <FaGavel className="text-blue-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Putusan</span>
                                    <span className="font-medium text-gray-800">: {data.jenis_putusan}</span>
                                </div>

                                {/* Mahkamah */}
                                <div className="flex items-center gap-2">
                                    <FaSchool className="text-indigo-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Mahkamah</span>
                                    {data.diproses_mahkamah == 1 ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            : Ya <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xs" />
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium flex items-center gap-1">
                                            : Tidak <FontAwesomeIcon icon={faX} className="text-red-600 text-xs" />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2 text-sm">
                                {/* Tanggal */}
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Tanggal</span>
                                    <span className="font-medium text-gray-800">: {data.created_at}</span>
                                </div>

                                {/* Pencatat */}
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-purple-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Pencatat</span>
                                    <span className="font-medium text-gray-800">: {data.pencatat}</span>
                                </div>
                            </div>
                        </div>

                        {/* Keterangan Section */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2">
                                <FaClipboardList className="text-gray-600 text-sm mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <span className="text-gray-600 text-sm font-medium block mb-1">Keterangan Pelanggaran:</span>
                                    <p className="text-gray-800 text-sm leading-relaxed">{data.keterangan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};