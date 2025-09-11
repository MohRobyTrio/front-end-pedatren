"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchPerizinanOrtu from "../../hooks/hooks_ortu/Perizinan"
import { FaCalendarAlt, FaCheckCircle, FaChevronDown, FaChevronUp, FaClipboardList, FaClock, FaCommentDots, FaEdit, FaExclamationTriangle, FaHome, FaMapMarkerAlt, FaSignOutAlt, FaUsers } from "react-icons/fa"

export default function PerizinanPage() {
    const { activeChild: selectedChild } = useActiveChild()

    const { data, error, fetchData, loading } = useFetchPerizinanOrtu({});

    if (loading) {
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
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        Perizinan
                    </h1>
                    <p className="text-gray-600 mt-1">Riwayat perizinan {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Stats Cards */}
                {/* <div className="grid gap-4 md:grid-cols-4">
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
                </div> */}

                {/* Table */}
                {/* <div className="bg-white rounded-lg shadow-sm">
                    <div className="pl-6 pr-6 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900">Riwayat Perizinan</h3>
                    </div> */}

                {/* <div className="p-6"> */}
                {error ? (
                    // Error State
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Terjadi Kesalahan
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {error || "Gagal mengambil data perizinan"}
                        </p>
                        <button
                            onClick={() => fetchData(true)}
                            className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : data.length > 0 ? (
                    <div className="">
                        {data.map((perizinan) => (
                            <PerizinanCard
                                key={perizinan.id}
                                data={perizinan}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaClipboardList className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Tidak Ada Data
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Belum ada data perizinan
                        </p>
                    </div>
                )}
                {/* </div> */}
                {/* </div> */}

                {/* Modal */}
                {/* {isModalOpen && selectedDetail && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                )} */}
            </div>
        </div>
    )
}

const PerizinanCard = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const getStatusConfig = (status) => {
        switch (status) {
            case "sedang proses izin":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-800",
                    border: "border-amber-200",
                    icon: FaClock,
                    iconColor: "text-amber-600",
                }
            case "perizinan diterima":
                return {
                    bg: "bg-emerald-50",
                    text: "text-emerald-800",
                    border: "border-emerald-200",
                    icon: FaCheckCircle,
                    iconColor: "text-emerald-600",
                }
            case "sudah berada diluar pondok":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-800",
                    border: "border-blue-200",
                    icon: FaSignOutAlt,
                    iconColor: "text-blue-600",
                }
            case "kembali tepat waktu":
                return {
                    bg: "bg-green-50",
                    text: "text-green-800",
                    border: "border-green-200",
                    icon: FaHome,
                    iconColor: "text-green-600",
                }
            case "perizinan ditolak":
            case "dibatalkan":
                return {
                    bg: "bg-red-50",
                    text: "text-red-800",
                    border: "border-red-200",
                    icon: FaExclamationTriangle,
                    iconColor: "text-red-600",
                }
            case "telat(sudah kembali)":
            case "telat(belum kembali)":
                return {
                    bg: "bg-orange-50",
                    text: "text-orange-800",
                    border: "border-orange-200",
                    icon: FaExclamationTriangle,
                    iconColor: "text-orange-600",
                }
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-800",
                    border: "border-gray-200",
                    icon: FaClipboardList,
                    iconColor: "text-gray-600",
                }
        }
    }

    const statusConfig = getStatusConfig(data.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md transition-all duration-300">
            {/* Compact Header */}
            <div
                className={`${statusConfig.bg} px-3 sm:px-4 py-2 sm:py-3 border-b ${statusConfig.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2`}
            >
                <div
                    className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} shadow-sm text-xs sm:text-sm`}
                >
                    <StatusIcon className={`${statusConfig.iconColor} text-xs`} />
                    <span className="capitalize font-semibold">{data.status}</span>
                </div>
            </div>

            {/* Compact Main Content */}
            <div className="p-3 sm:p-4 cursor-pointer">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Compact Photo Section */}
                    {/* <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <div className="relative">
                            <img
                                alt={data.nama_santri || "-"}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border-2 border-white"
                                src={data.foto_profil || blankProfile}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = blankProfile
                                }}
                            />
                            <div className="absolute -top-0 -right-1 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold shadow-sm border border-white">
                                {data.jenis_kelamin == "p" ? "♀" : "♂"}
                            </div>
                        </div>
                    </div> */}

                    {/* Compact Information Section */}
                    <div className="flex-1 min-w-0">
                        {/* Name and Basic Info */}
                        <div className="mb-3">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{data.nama_santri}</h3>
                            {/* <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                                    <FaSchool className="text-blue-600 text-xs" />
                                    <span className="font-medium truncate max-w-20 sm:max-w-none">{data.lembaga}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                                    <FaMapMarkerAlt className="text-green-600 text-xs" />
                                    <span className="truncate">
                                        {data.kamar} - {data.blok}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                                    <FaCalendarAlt className="text-purple-600 text-xs" />
                                    <span className="truncate">{data.lama_izin}</span>
                                </div>
                            </div> */}
                        </div>

                        {/* Compact Permission Details */}
                        <div className="grid grid-cols-1 gap-2 mb-3">
                            {/* Reason */}
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-2">
                                    <FaClipboardList className="text-blue-600 text-sm mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">Alasan</h4>
                                        <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{data.alasan_izin}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">Tujuan</h4>
                                        <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{data.alamat_tujuan}</p>
                                        {/* <p className="text-xs text-gray-500 mt-1 truncate">
                                            {data.kecamatan}, {data.kabupaten}
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                                <div className="flex items-start gap-2">
                                    <FaCommentDots className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">Keterangan</h4>
                                        <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{data.keterangan}</p>
                                        {/* <p className="text-xs text-gray-500 mt-1 truncate">
                                            {data.kecamatan}, {data.kabupaten}
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return Date for completed permissions */}
                        {(data.status == "kembali tepat waktu" ||
                            data.status == "telat(sudah kembali)" ||
                            data.status == "telat(belum kembali)") && (
                                <div className="mb-3">
                                    <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg inline-flex items-center gap-2">
                                        <FaHome className="text-green-600 text-sm" />
                                        <div>
                                            <span className="font-semibold text-gray-900 text-xs">Kembali: </span>
                                            <span className="text-gray-700 text-xs">{data.tanggal_kembali}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Compact Progress Timeline */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">

                        {/* Step 1 - Ajuan */}
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-sm text-xs">
                                ✓
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">Ajuan</span>
                        </div>

                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>

                        {/* Step 2 - Setuju/Tolak/Batal */}
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${(data.status == "perizinan ditolak" || data.status == "dibatalkan")
                                ? "bg-red-500 text-white"
                                : (data.status !== "sedang proses izin")
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300 text-gray-600"
                                }`}>
                                {(data.status == "perizinan ditolak" || data.status == "dibatalkan")
                                    ? "✗"
                                    : (data.status !== "sedang proses izin")
                                        ? "✓"
                                        : "2"}
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">
                                {data.status == "dibatalkan" ? "Batal" :
                                    data.status == "perizinan ditolak" ? "Tolak" : "Setuju"}
                            </span>
                        </div>

                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>

                        {/* Step 3 - Keluar */}
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${(data.status == "sudah berada diluar pondok" || data.status == "kembali tepat waktu" ||
                                data.status == "telat(sudah kembali)" || data.status == "telat(belum kembali)")
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600"
                                }`}>
                                {(data.status == "sudah berada diluar pondok" || data.status == "kembali tepat waktu" ||
                                    data.status == "telat(sudah kembali)" || data.status == "telat(belum kembali)")
                                    ? "✓" : "3"}
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">Keluar</span>
                        </div>

                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>

                        {/* Step 4 - Kembali */}
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status == "kembali tepat waktu"
                                ? "bg-green-500 text-white"
                                : (data.status == "telat(belum kembali)" || data.status == "telat(sudah kembali)")
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-300 text-gray-600"
                                }`}>
                                {data.status == "kembali tepat waktu" ? '✓' :
                                    (data.status == "telat(belum kembali)" || data.status == "telat(sudah kembali)") ? '!' : '4'}
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">Kembali</span>
                        </div>
                    </div>
                </div>

                {/* Compact Toggle Button */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsExpanded(!isExpanded)
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                    >
                        {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                        <span>{isExpanded ? "Sembunyikan" : "Detail Lengkap"}</span>
                    </button>
                </div>

                {/* Compact Extended Information */}
                {isExpanded && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="grid grid-cols-1 gap-3">
                            {/* Duration Info */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm">
                                    <FaClock className="text-blue-600" />
                                    Informasi Waktu
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Mulai:</span>
                                        <span className="font-semibold text-gray-900 text-xs">{data.tanggal_mulai}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Akhir:</span>
                                        <span className="font-semibold text-gray-900 text-xs">{data.tanggal_akhir}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Durasi:</span>
                                        <span className="font-semibold text-purple-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                            {data.lama_izin}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Bermalam:</span>
                                        <span className="font-semibold text-indigo-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                            {data.bermalam}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-600 font-medium text-xs">Jenis:</span>
                                        <span className="font-semibold text-orange-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                            {data.jenis_izin}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Approval Team */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm">
                                    <FaUsers className="text-emerald-600" />
                                    Tim Persetujuan
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Pembuat:</span>
                                        <span className="font-semibold text-gray-900 text-xs truncate max-w-32">{data.pembuat}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Biktren:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-gray-900 text-xs truncate max-w-20">
                                                {data.nama_biktren || "-"}
                                            </span>
                                            {data.approved_by_biktren == 1 && (
                                                <div className="bg-green-100 p-0.5 rounded-full">
                                                    <FaCheckCircle className="text-green-600 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                        <span className="text-gray-600 font-medium text-xs">Pengasuh:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-gray-900 text-xs truncate max-w-20">
                                                {data.nama_pengasuh || "-"}
                                            </span>
                                            {data.approved_by_pengasuh == 1 && (
                                                <div className="bg-green-100 p-0.5 rounded-full">
                                                    <FaCheckCircle className="text-green-600 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-600 font-medium text-xs">Kamtib:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-gray-900 text-xs truncate max-w-20">
                                                {data.nama_kamtib || "-"}
                                            </span>
                                            {data.approved_by_kamtib == 1 && (
                                                <div className="bg-green-100 p-0.5 rounded-full">
                                                    <FaCheckCircle className="text-green-600 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="mt-3 pt-2 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <FaCalendarAlt className="text-gray-400 text-xs" />
                                <span>Dibuat: {data.created_at}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaEdit className="text-gray-400 text-xs" />
                                <span>Diubah: {data.updated_at}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}