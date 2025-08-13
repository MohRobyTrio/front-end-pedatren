"use client"

import { useEffect, useState, useMemo } from "react"
import useFetchPerizinan from "../../hooks/hook_menu_kepesantrenan/Perizinan"
import useApprovePerizinan from "../../hooks/hook_menu_kepesantrenan/approvePerizinan"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import { OrbitProgress } from "react-loading-indicators"
import blankProfile from "../../assets/blank_profile.png"
import Pagination from "../../components/Pagination"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import ModalDetail from "../../components/modal/ModalDetail"
import {
    FaFileExport,
    FaPlus,
    FaChevronDown,
    FaChevronUp,
    FaMapMarkerAlt,
    FaSchool,
    FaClipboardList,
    FaClock,
    FaUsers,
    FaCheckCircle,
    FaHome,
    FaEdit,
    FaSignOutAlt,
    FaSignInAlt,
    FaCalendarAlt,
    FaUserCheck,
    FaExclamationTriangle,
} from "react-icons/fa"
import { ModalAddPerizinan, ModalApprove } from "../../components/modal/ModalFormPerizinan"
import Access from "../../components/Access"
import { getRolesString } from "../../utils/getRolesString"
import { ModalExport } from "../../components/modal/ModalExport"
import { API_BASE_URL } from "../../hooks/config"
import Swal from "sweetalert2"
import { getCookie } from "../../utils/cookieUtils"
import useLogout from "../../hooks/Logout"
import { Navigate, useNavigate } from "react-router-dom"
import { hasAccess } from "../../utils/hasAccess"

const DataPerizinan = () => {
    const [selectedItem, setSelectedItem] = useState(null)
    const [openModalExport, setOpenModalExport] = useState(false)
    const [selectedName, setSelectedName] = useState("")
    const [selectedId, setSelectedId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [feature, setFeature] = useState("")
    const capitalizeFirstLetter = getRolesString()

    const openModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedItem(null)
        setIsModalOpen(false)
    }

    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenisKelamin: "",
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara()
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah()
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga()

    const negaraTerpilih = filterNegara.negara.find((n) => n.value == selectedNegara.negara)?.label || ""
    const provinsiTerpilih = filterNegara.provinsi.find((p) => p.value == selectedNegara.provinsi)?.label || ""
    const kabupatenTerpilih = filterNegara.kabupaten.find((k) => k.value == selectedNegara.kabupaten)?.label || ""
    const kecamatanTerpilih = filterNegara.kecamatan.find((kec) => kec.value == selectedNegara.kecamatan)?.label || ""
    const wilayahTerpilih = filterWilayah.wilayah.find((n) => n.value == selectedWilayah.wilayah)?.nama || ""
    const blokTerpilih = filterWilayah.blok.find((p) => p.value == selectedWilayah.blok)?.label || ""
    const kamarTerpilih = filterWilayah.kamar.find((k) => k.value == selectedWilayah.kamar)?.label || ""
    const lembagaTerpilih = filterLembaga.lembaga.find((n) => n.value == selectedLembaga.lembaga)?.label || ""
    const jurusanTerpilih = filterLembaga.jurusan.find((n) => n.value == selectedLembaga.jurusan)?.label || ""
    const kelasTerpilih = filterLembaga.kelas.find((n) => n.value == selectedLembaga.kelas)?.label || ""
    const rombelTerpilih = filterLembaga.rombel.find((n) => n.value == selectedLembaga.rombel)?.label || ""

    const updatedFilters = useMemo(
        () => ({
            ...filters,
            negara: negaraTerpilih,
            provinsi: provinsiTerpilih,
            kabupaten: kabupatenTerpilih,
            kecamatan: kecamatanTerpilih,
            wilayah: wilayahTerpilih,
            blok: blokTerpilih,
            kamar: kamarTerpilih,
            lembaga: lembagaTerpilih,
            jurusan: jurusanTerpilih,
            kelas: kelasTerpilih,
            rombel: rombelTerpilih,
        }),
        [
            filters,
            negaraTerpilih,
            provinsiTerpilih,
            kabupatenTerpilih,
            kecamatanTerpilih,
            wilayahTerpilih,
            blokTerpilih,
            kamarTerpilih,
            lembagaTerpilih,
            jurusanTerpilih,
            kelasTerpilih,
            rombelTerpilih,
        ],
    )

    const {
        data,
        loading,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData,
    } = useFetchPerizinan(updatedFilters)

    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchData(updatedFilters, filters)
    }, [updatedFilters, filters, fetchData])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" },
        ],
        bermalam: [
            { label: "Bermalam / Tidak Bermalam", value: "" },
            { label: "Bermalam", value: "bermalam" },
            { label: "Tidak Bermalam", value: "tidak bermalam" },
        ],
        jenis_izin: [
            { label: "Rombongan / Personal", value: "" },
            { label: "Rombongan", value: "rombongan" },
            { label: "Personal", value: "personal" },
        ],
        status: [
            { label: "Semua Status Izin", value: "" },
            { label: "Sedang Proses Izin", value: "sedang proses izin" },
            { label: "Perizinan Diterima", value: "perizinan diterima" },
            { label: "Sudah Berada Di Luar Pondok", value: "sudah berada diluar pondok" },
            { label: "Perizinan Ditolak", value: "perizinan ditolak" },
            { label: "Perizinan Dibatalkan", value: "dibatalkan" },
            { label: "Telat (sudah kembali)", value: "telat(sudah kembali)" },
            { label: "Telat (belum kembali)", value: "telat(belum kembali)" },
            { label: "Kembali Tepat Waktu", value: "kembali tepat waktu" },
        ],
    }

    const filter4 = {
        masa_telat: [
            { label: "Semua Masa Telat", value: "" },
            { label: "Lebih Dari 1 Minggu", value: "lebih dari seminggu" },
            { label: "Lebih Dari 2 Minggu", value: "lebih dari 2 minggu" },
            { label: "Lebih Dari 1 Bulan", value: "lebih dari satu bulan" },
        ],
    }

    const fieldsExports = []
    const [showFormModal, setShowFormModal] = useState(false)

    if (!hasAccess("perizinan")) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <div className="flex-1 pl-3 sm:pl-6 pt-4 sm:pt-6 pb-4 sm:pb-6 overflow-y-auto bg-gray-50">
            {/* Compact Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Data Perizinan</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">Kelola dan pantau perizinan santri</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Access action="tambah">
                        <button
                            onClick={() => {
                                setFeature(1)
                                setShowFormModal(true)
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                        >
                            <FaPlus className="text-xs" />
                            <span className="hidden sm:inline">Tambah Perizinan</span>
                            <span className="sm:hidden">Tambah</span>
                        </button>
                    </Access>
                    <button
                        onClick={() => setOpenModalExport(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                    >
                        <FaFileExport className="text-xs" />
                        <span className="hidden sm:inline">Export</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
            </div>

            <ModalAddPerizinan
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                refetchData={fetchData}
                feature={feature}
                id={selectedId}
                nama={selectedName}
            />

            {/* Compact Filter & Search Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
                <div className="p-3 sm:p-4">
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full ${showFilters ? "mb-4" : ""}`}
                    >
                        <Filters
                            showFilters={showFilters}
                            filterOptions={filterNegara}
                            onChange={handleFilterChangeNegara}
                            selectedFilters={selectedNegara}
                        />
                        <Filters
                            showFilters={showFilters}
                            filterOptions={filterWilayah}
                            onChange={handleFilterChangeWilayah}
                            selectedFilters={selectedWilayah}
                        />
                        <Filters
                            showFilters={showFilters}
                            filterOptions={filterLembaga}
                            onChange={handleFilterChangeLembaga}
                            selectedFilters={selectedLembaga}
                        />
                        <Filters
                            showFilters={showFilters}
                            filterOptions={filter3}
                            onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                            selectedFilters={filters}
                        />
                        <Filters
                            showFilters={showFilters}
                            filterOptions={filter4}
                            onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                            selectedFilters={filters}
                        />
                    </div>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        totalData={totalData}
                        limit={limit}
                        toggleLimit={(e) => setLimit(Number(e.target.value))}
                        toggleFilters={() => setShowFilters(!showFilters)}
                        showViewButtons={false}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-3">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500 flex-shrink-0 text-sm" />
                        <div>
                            <p className="font-medium text-sm">Terjadi Kesalahan</p>
                            <p className="text-xs">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <OrbitProgress variant="disc" color="#059669" size="small" text="" textColor="" />
                            <p className="text-gray-600 mt-3 text-sm">Memuat data...</p>
                        </div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="space-y-3">
                        {data.map((perizinan) => (
                            <PerizinanCard
                                key={perizinan.id}
                                data={perizinan}
                                openModal={openModal}
                                setShowFormModal={setShowFormModal}
                                setFeature={setFeature}
                                setSelectedId={setSelectedId}
                                setSelectedName={setSelectedName}
                                refetchData={fetchData}
                                userRole={capitalizeFirstLetter}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaClipboardList className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
                        <p className="text-gray-600 mb-4 text-sm">Belum ada data perizinan yang sesuai dengan filter</p>
                        <Access action="tambah">
                            <button
                                onClick={() => {
                                    setFeature(1)
                                    setShowFormModal(true)
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 mx-auto text-sm"
                            >
                                <FaPlus className="text-xs" />
                                <span>Tambah Perizinan</span>
                            </button>
                        </Access>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                    </div>
                )}
            </div>

            <ModalExport
                isOpen={openModalExport}
                onClose={() => setOpenModalExport(false)}
                filters={updatedFilters}
                searchTerm={searchTerm}
                limit={limit}
                currentPage={currentPage}
                fields={fieldsExports}
                endpoint="export/perizinan"
            />

            {isModalOpen && <ModalDetail title="Detail Perizinan" menu={17} item={selectedItem} onClose={closeModal} />}
        </div>
    )
}

// Compact Perizinan Card Component
const PerizinanCard = ({
    data,
    openModal,
    setShowFormModal,
    setFeature,
    setSelectedId,
    setSelectedName,
    refetchData,
}) => {
    const userRole = getRolesString().toLowerCase()
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const { approvePerizinan, isApproving, error } = useApprovePerizinan()
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showKeluarModal, setShowKeluarModal] = useState(false)
    const [showKembaliModal, setShowKembaliModal] = useState(false)
    const [showLoadingKeluarModal, setShowLoadingKeluarModal] = useState(false)
    const [showLoadingKembaliModal, setShowLoadingKembaliModal] = useState(false)
    const [approveError, setApproveError] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)

    const canApprove = useMemo(() => {
        if (!userRole) return false
        const approvalStatus = {
            biktren: !data.approved_by_biktren,
            kamtib: !data.approved_by_kamtib,
            pengasuh: !data.approved_by_pengasuh,
        }
        return approvalStatus[userRole]
    }, [userRole, data])

    const handleApprove = async () => {
        setApproveError(null)
        const success = await approvePerizinan(data.id, userRole)
        if (success) {
            setShowApproveModal(false)
            try {
                await refetchData(true)
            } catch (err) {
                console.error("Gagal refetch:", err)
            }
        } else {
            setApproveError(error)
        }
    }

    const token = sessionStorage.getItem("token") || getCookie("token")

    const handleSetKeluar = async () => {
        try {
            setShowLoadingKeluarModal(true)
            const response = await fetch(`${API_BASE_URL}crud/${data.id}/perizinan/set-keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            const result = await response.json()
            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                return
            }
            if (!response.ok) throw new Error(`Gagal set keluar (${response.status})`)

            Swal.fire("Berhasil!", "success")
            setShowKeluarModal(false)
            refetchData(true)
        } catch (err) {
            console.error(err)
            Swal.fire("Gagal", err.message, "error")
        } finally {
            setShowLoadingKeluarModal(false)
        }
    }

    const handleSetKembali = async () => {
        try {
            setShowLoadingKembaliModal(true)
            const response = await fetch(`${API_BASE_URL}crud/${data.id}/perizinan/set-kembali`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            const result = await response.json()
            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                return
            }
            if (!response.ok) throw new Error(`Gagal set kembali (${response.status})`)

            Swal.fire("Berhasil!", "success")
            setShowKembaliModal(false)
            refetchData(true)
        } catch (err) {
            console.error(err)
            Swal.fire("Gagal", err.message, "error")
        } finally {
            setShowLoadingKembaliModal(false)
        }
    }

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
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

                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    {canApprove && (
                        <Access action="approve">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowApproveModal(true)
                                }}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaUserCheck className="text-xs" />
                                <span className="hidden sm:inline">Approve</span>
                                <span className="sm:hidden">OK</span>
                            </button>
                        </Access>
                    )}

                    <Access action="edit">
                        {data.status == "perizinan diterima" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowKeluarModal(true)
                                }}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaSignOutAlt className="text-xs" />
                                <span className="hidden sm:inline">Keluar</span>
                                <span className="sm:hidden">Out</span>
                            </button>
                        )}
                        {data.status == "sudah berada diluar pondok" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowKembaliModal(true)
                                }}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex-1 sm:flex-none justify-center"
                            >
                                <FaSignInAlt className="text-xs" />
                                <span className="hidden sm:inline">Kembali</span>
                                <span className="sm:hidden">In</span>
                            </button>
                        )}
                    </Access>

                    <Access action="edit">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setFeature(2)
                                setSelectedId(data.id)
                                setSelectedName(data.nama_santri)
                                setShowFormModal(true)
                            }}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex-1 sm:flex-none justify-center"
                        >
                            <FaEdit className="text-xs" />
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">Edit</span>
                        </button>
                    </Access>
                </div>
            </div>

            {/* Compact Main Content */}
            <div className="p-3 sm:p-4 cursor-pointer" onClick={() => openModal(data)}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Compact Photo Section */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <div className="relative">
                            <img
                                alt={data.nama_santri || "-"}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border-2 border-white"
                                src={data.foto_profil || "/placeholder.svg"}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = blankProfile
                                }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold shadow-sm border border-white">
                                {data.jenis_kelamin === "p" ? "♀" : "♂"}
                            </div>
                        </div>
                    </div>

                    {/* Compact Information Section */}
                    <div className="flex-1 min-w-0">
                        {/* Name and Basic Info */}
                        <div className="mb-3">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{data.nama_santri}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
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
                            </div>
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
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {data.kecamatan}, {data.kabupaten}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return Date for completed permissions */}
                        {(data.status === "kembali tepat waktu" ||
                            data.status === "telat(sudah kembali)" ||
                            data.status === "telat(belum kembali)") && (
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
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold shadow-sm text-xs">
                                ✓
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">Ajuan</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status === "perizinan ditolak" || data.status === "dibatalkan"
                                        ? "bg-red-500 text-white"
                                        : (data.status !== "sedang proses izin")
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {data.status === "perizinan ditolak" || data.status === "dibatalkan"
                                    ? "✗"
                                    : data.status !== "sedang proses izin"
                                        ? "✓"
                                        : "2"}
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">
                                {data.status === "dibatalkan" ? "Batal" : data.status === "perizinan ditolak" ? "Tolak" : "Setuju"}
                            </span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status === "sudah berada diluar pondok" ||
                                        data.status === "kembali tepat waktu" ||
                                        data.status === "telat(sudah kembali)" ||
                                        data.status === "telat(belum kembali)"
                                        ? "bg-gray-300 text-white"
                                        : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {data.status === "sudah berada diluar pondok" ||
                                    data.status === "kembali tepat waktu" ||
                                    data.status === "telat(sudah kembali)" ||
                                    data.status === "telat(belum kembali)"
                                    ? "✓"
                                    : "3"}
                            </div>
                            <span className="text-xs text-gray-600 mt-1 font-medium">Keluar</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status === "kembali tepat waktu"
                                        ? "bg-green-500 text-white"
                                        : (data.status === "telat(belum kembali)" || data.status === "telat(sudah kembali)")
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {data.status === "kembali tepat waktu"
                                    ? "✓"
                                    : data.status === "telat(belum kembali)" || data.status === "telat(sudah kembali)"
                                        ? "!"
                                        : "4"}
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
                                            {data.approved_by_biktren && (
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
                                            {data.approved_by_pengasuh && (
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
                                            {data.approved_by_kamtib && (
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
                                <span>Dibuat: {data.tgl_input}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaEdit className="text-gray-400 text-xs" />
                                <span>Diubah: {data.tgl_update}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ModalApprove
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                isLoading={isApproving}
                roleName={userRole}
            />
            <ModalApprove
                isOpen={showKeluarModal}
                onClose={() => setShowKeluarModal(false)}
                onConfirm={handleSetKeluar}
                isLoading={showLoadingKeluarModal}
                mode="keluar"
            />
            <ModalApprove
                isOpen={showKembaliModal}
                onClose={() => setShowKembaliModal(false)}
                onConfirm={handleSetKembali}
                isLoading={showLoadingKembaliModal}
                mode="kembali"
            />

            {approveError && (
                <div className="mx-3 mb-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500 flex-shrink-0 text-sm" />
                    <div>
                        <p className="font-medium text-sm">Terjadi Kesalahan</p>
                        <p className="text-xs">{approveError}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataPerizinan
