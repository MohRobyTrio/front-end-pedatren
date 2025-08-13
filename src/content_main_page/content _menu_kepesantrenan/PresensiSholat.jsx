"use client"

import { FaArrowLeft, FaEdit, FaFileExport, FaFileImport, FaPlus, FaTrash } from "react-icons/fa"
import Pagination from "../../components/Pagination"
import { OrbitProgress } from "react-loading-indicators"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import StatistikChart from "../../components/StatistikChart"
import Access from "../../components/Access"
import { generateDropdownTahun } from "../../utils/generateDropdownTahun"
import { useEffect, useMemo, useState } from "react"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import useFetchPresensi from "../../hooks/hooks_menu_data_pokok/Presensi"
import {
    FaQrcode,
    FaUserCheck,
    FaCalendarAlt,
    FaSearch,
    FaDownload,
    FaIdCard,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"

const PresensiSholat = () => {
    // const [openModalExport, setOpenModalExport] = useState(false)
    // const [openModalImport, setOpenModalImport] = useState(false)
    // const [selectedItem, setSelectedItem] = useState(null)
    // const [isModalOpen, setIsModalOpen] = useState(false)
    // const [showStatistik, setShowStatistik] = useState(false)
    // const [showFormModal, setShowFormModal] = useState(false) // Declare setShowFormModal

    // const openModal = (item) => {
    //     setSelectedItem(item)
    //     setIsModalOpen(true)
    // }

    // const closeModal = () => {
    //     setSelectedItem(null)
    //     setIsModalOpen(false)
    // }

    const [filters, setFilters] = useState({
        tahunAjaran: "",
        status: "",
        jenisKelamin: "",
        tingkatHafalan: "",
        targetHafalan: "",
        jenisSetoran: "",
        nilai: "",
        ustadz: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
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

    // // Gabungkan filter tambahan sebelum dipakai
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
            blokTerpilih,
            filters,
            jurusanTerpilih,
            kabupatenTerpilih,
            kamarTerpilih,
            kecamatanTerpilih,
            kelasTerpilih,
            lembagaTerpilih,
            negaraTerpilih,
            provinsiTerpilih,
            rombelTerpilih,
            wilayahTerpilih,
        ],
    )

    const {
        dataPresensi,
        loadingPresensi,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
    } = useFetchPresensi(updatedFilters)

    // const [showFilters, setShowFilters] = useState(false)
    // const [viewMode, setViewMode] = useState("table")

    // useEffect(() => {
    //     const savedViewMode = sessionStorage.getItem("viewMode")
    //     if (savedViewMode) {
    //         setViewMode(savedViewMode)
    //     }
    // }, [])

    // const handlePageChange = (page) => {
    //     if (page >= 1 && page <= totalPages) {
    //         setCurrentPage(page)
    //     }
    // }

    // const filter4 = {
    //     jenisKelamin: [
    //         { label: "Pilih Jenis Kelamin", value: "" },
    //         { label: "Laki-laki", value: "laki-laki" },
    //         { label: "Perempuan", value: "perempuan" },
    //     ],
    //     status: [
    //         { label: "Semua Status", value: "" },
    //         { label: "Hadir", value: "Hadir" },
    //         { label: "Izin", value: "Izin" },
    //         { label: "Sakit", value: "Sakit" },
    //         { label: "Alfa", value: "Alfa" },
    //     ],
    //     tahunAjaran: generateDropdownTahun({
    //         placeholder: "Semua Tahun Ajaran",
    //         labelTemplate: "Tahun {year}/{nextYear}",
    //     }),
    // }

    // const filter5 = {
    //     metode: [
    //         { label: "Semua Metode", value: "" },
    //         { label: "Manual", value: "Manual" },
    //         { label: "Kartu", value: "Kartu" },
    //     ],
    //     urutBerdasarkan: [
    //         { label: "Urut Berdasarkan", value: "" },
    //         { label: "Tanggal", value: "tanggal" },
    //         { label: "Waktu Presensi", value: "waktu_presensi" },
    //         { label: "Status", value: "status" },
    //         { label: "Metode", value: "metode" },
    //     ],
    //     urutSecara: [
    //         { label: "Urut Secara", value: "" },
    //         { label: "A-Z / 0-9 (Ascending)", value: "asc" },
    //         { label: "Z-A / 9-0 (Descending)", value: "desc" },
    //     ],
    // }

    // const filter6 = {}

    // const fieldsExports = [
    //     { label: "Tanggal", value: "tanggal" },
    //     { label: "Waktu Presensi", value: "waktu_presensi" },
    //     { label: "Status", value: "status" },
    //     { label: "Metode", value: "metode" },
    // ]

    // const getStatusBadge = (status) => {
    //     const statusStyles = {
    //         Hadir: "bg-green-100 text-green-800",
    //         Izin: "bg-yellow-100 text-yellow-800",
    //         Sakit: "bg-blue-100 text-blue-800",
    //         Alfa: "bg-red-100 text-red-800",
    //     }
    //     return statusStyles[status] || "bg-gray-100 text-gray-800"
    // }

    // const getMethodBadge = (metode) => {
    //     const methodStyles = {
    //         Manual: "bg-purple-100 text-purple-800",
    //         Kartu: "bg-indigo-100 text-indigo-800",
    //     }
    //     return methodStyles[metode] || "bg-gray-100 text-gray-800"
    // }

    // return (
    //     <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
    //         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
    //             <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
    //                 {showStatistik ? "Statistik Presensi Sholat" : "Data Presensi Sholat"}
    //             </h1>

    //             <div className="flex flex-wrap items-center gap-2">
    //                 {showStatistik ? (
    //                     <button
    //                         onClick={() => setShowStatistik(false)}
    //                         className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
    //                     >
    //                         <FaArrowLeft /> Kembali ke Data
    //                     </button>
    //                 ) : (
    //                     <>
    //                         {/* <Access action="tambah">
    //                             <button
    //                                 onClick={() => setShowFormModal(true)}
    //                                 className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
    //                             >
    //                                 <FaPlus /> Tambah
    //                             </button>
    //                         </Access> */}

    //                         {/* <button
    //                             onClick={() => setOpenModalImport(true)}
    //                             className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
    //                         >
    //                             <FaFileImport /> Import
    //                         </button>

    //                         <button
    //                             onClick={() => setOpenModalExport(true)}
    //                             className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
    //                         >
    //                             <FaFileExport /> Export
    //                         </button> */}
    //                     </>
    //                 )}
    //             </div>
    //         </div>

    //         <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
    //             {/* {showStatistik ? (
    //                 <StatistikChart
    //                     data={presensiSholatData}
    //                     loading={loadingPresensiSholat}
    //                     totalData={totalDataPresensiSholat}
    //                 />
    //             ) : (
    //                 <> */}
    //                     <div
    //                         className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}
    //                     >
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filterNegara}
    //                             onChange={handleFilterChangeNegara}
    //                             selectedFilters={selectedNegara}
    //                         />
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filterWilayah}
    //                             onChange={handleFilterChangeWilayah}
    //                             selectedFilters={selectedWilayah}
    //                         />
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filterLembaga}
    //                             onChange={handleFilterChangeLembaga}
    //                             selectedFilters={selectedLembaga}
    //                         />
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filter4}
    //                             onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
    //                             selectedFilters={filters}
    //                         />
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filter5}
    //                             onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
    //                             selectedFilters={filters}
    //                         />
    //                         <Filters
    //                             showFilters={showFilters}
    //                             filterOptions={filter6}
    //                             onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
    //                             selectedFilters={filters}
    //                         />
    //                     </div>

    //                     <SearchBar
    //                         // searchTerm={searchTerm}
    //                         // setSearchTerm={setSearchTerm}
    //                         totalData={totalData}
    //                         limit={limit}
    //                         toggleLimit={(e) => setLimit(Number(e.target.value))}
    //                         toggleFilters={() => setShowFilters(!showFilters)}
    //                         toggleView={setViewMode}
    //                     />

    //                     {error ? (
    //                         <div
    //                             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    //                             role="alert"
    //                         >
    //                             <strong className="font-bold">Error!</strong>
    //                             <span className="block sm:inline"> {error}</span>
    //                         </div>
    //                     ) : viewMode === "list" ? (
    //                         <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
    //                             {loadingPresensi ? (
    //                                 <div className="col-span-3 flex justify-center items-center">
    //                                     <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
    //                                 </div>
    //                             ) : dataPresensi.length === 0 ? (
    //                                 <p className="text-center col-span-3">Tidak ada data</p>
    //                             ) : (
    //                                 dataPresensi.map((item, index) => (
    //                                     <div
    //                                         key={index}
    //                                         className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    //                                     >
    //                                         <div className="space-y-2">
    //                                             <div className="flex justify-between items-start">
    //                                                 <span className="text-sm font-medium text-gray-600">Tanggal:</span>
    //                                                 <span className="text-sm text-gray-900">{item.tanggal}</span>
    //                                             </div>
    //                                             <div className="flex justify-between items-start">
    //                                                 <span className="text-sm font-medium text-gray-600">Waktu:</span>
    //                                                 <span className="text-sm text-gray-900">{item.waktu_presensi}</span>
    //                                             </div>
    //                                             <div className="flex justify-between items-start">
    //                                                 <span className="text-sm font-medium text-gray-600">Status:</span>
    //                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
    //                                                     {item.status}
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between items-start">
    //                                                 <span className="text-sm font-medium text-gray-600">Metode:</span>
    //                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodBadge(item.metode)}`}>
    //                                                     {item.metode}
    //                                                 </span>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 ))
    //                             )}
    //                         </div>
    //                     ) : (
    //                         <DoubleScrollbarTable>
    //                             <table className="min-w-full text-sm text-left">
    //                                 <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
    //                                     <tr>
    //                                         <th className="px-3 py-2 border-b w-16">#</th>
    //                                         <th className="px-3 py-2 border-b">Nama Santri</th>
    //                                         <th className="px-3 py-2 border-b">NIS</th>
    //                                         <th className="px-3 py-2 border-b">Nama Sholat</th>
    //                                         <th className="px-3 py-2 border-b">Tanggal</th>
    //                                         <th className="px-3 py-2 border-b">Waktu Presensi</th>
    //                                         <th className="px-3 py-2 border-b">Status</th>
    //                                         <th className="px-3 py-2 border-b">Metode</th>
    //                                         {/* <th className="px-3 py-2 border-b">Aksi</th> */}
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody className="text-gray-800">
    //                                     {loadingPresensi ? (
    //                                         <tr>
    //                                             <td colSpan="8" className="text-center py-6">
    //                                                 <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
    //                                             </td>
    //                                         </tr>
    //                                     ) : dataPresensi.length === 0 ? (
    //                                         <tr>
    //                                             <td colSpan="8" className="text-center py-6">
    //                                                 Tidak ada data
    //                                             </td>
    //                                         </tr>
    //                                     ) : (
    //                                         dataPresensi.map(
    //                                             (item, index) => (
    //                                                 <tr
    //                                                     key={item.id || index}
    //                                                     className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
    //                                                     onClick={() => openModal(item)}
    //                                                 >
    //                                                     <td className="px-3 py-2 border-b text-center">{index + 1}</td>
    //                                                     <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
    //                                                     <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
    //                                                     <td className="px-3 py-2 border-b">{item.nama_sholat || "-"}</td>
    //                                                     <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
    //                                                     <td className="px-3 py-2 border-b">{item.waktu_presensi || "-"}</td>
    //                                                     <td className="px-3 py-2 border-b">
    //                                                         {item.status || "-"}
    //                                                     </td>
    //                                                     <td className="px-3 py-2 border-b">
    //                                                         {item.metode || "-"}
    //                                                     </td>
    //                                                     {/* <td className="px-3 py-2 border-b text-center space-x-2">
    //                                                         <button
    //                                                             onClick={(e) => {
    //                                                                 e.stopPropagation()
    //                                                                 // Handle edit action
    //                                                             }}
    //                                                             className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
    //                                                         >
    //                                                             <FaEdit />
    //                                                         </button>
    //                                                         <button
    //                                                             onClick={(e) => {
    //                                                                 e.stopPropagation()
    //                                                                 // Handle delete action
    //                                                             }}
    //                                                             className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
    //                                                         >
    //                                                             <FaTrash />
    //                                                         </button>
    //                                                     </td> */}
    //                                                 </tr>
    //                                             ),
    //                                         )
    //                                     )}
    //                                 </tbody>
    //                             </table>
    //                         </DoubleScrollbarTable>
    //                     )}

    //                     {totalPages > 1 && (
    //                         <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
    //                     )}
    //                 {/* </>
    //             )} */}
    //         </div>
    //     </div>
    // )


    const [currentView, setCurrentView] = useState("list") // scan, list, report
    const [scanMode, setScanMode] = useState("card") // card, qr, manual
    const [attendanceData, setAttendanceData] = useState([])
    const [todayAttendance, setTodayAttendance] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Mock data untuk demo
    const mockStudents = [
        {
            id: "001",
            name: "Ahmad Fauzi",
            class: "7A",
            cardId: "CARD001",
            status: "hadir",
            time: "07:15",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "002",
            name: "Siti Aminah",
            class: "7A",
            cardId: "CARD002",
            status: "hadir",
            time: "07:20",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "003",
            name: "Muhammad Rizki",
            class: "7B",
            cardId: "CARD003",
            status: "terlambat",
            time: "07:45",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "004",
            name: "Fatimah Zahra",
            class: "7B",
            cardId: "CARD004",
            status: "alpha",
            time: "-",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "005",
            name: "Ali Hassan",
            class: "8A",
            cardId: "CARD005",
            status: "hadir",
            time: "07:10",
            photo: "/placeholder.svg?height=40&width=40",
        },
    ]

    useEffect(() => {
        setTodayAttendance(mockStudents)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleCardScan = (cardId) => {
        setIsScanning(true)
        // Simulasi scanning
        setTimeout(() => {
            const student = mockStudents.find((s) => s.cardId === cardId)
            if (student) {
                setScanResult({
                    success: true,
                    student: student,
                    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                })
                // Update attendance
                setTodayAttendance((prev) =>
                    prev.map((s) =>
                        s.id === student.id
                            ? {
                                ...s,
                                status: "hadir",
                                time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                            }
                            : s,
                    ),
                )
            } else {
                setScanResult({
                    success: false,
                    message: "Kartu tidak terdaftar",
                })
            }
            setIsScanning(false)
        }, 2000)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "hadir":
                return "text-green-600 bg-green-100"
            case "terlambat":
                return "text-yellow-600 bg-yellow-100"
            case "alpha":
                return "text-red-600 bg-red-100"
            case "izin":
                return "text-blue-600 bg-blue-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "hadir":
                return <FaCheckCircle className="w-4 h-4" />
            case "terlambat":
                return <FaExclamationTriangle className="w-4 h-4" />
            case "alpha":
                return <FaTimesCircle className="w-4 h-4" />
            case "izin":
                return <FaCheckCircle className="w-4 h-4" />
            default:
                return <FaTimesCircle className="w-4 h-4" />
        }
    }

    const filteredAttendance = todayAttendance.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === "all" || student.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const attendanceStats = {
        total: todayAttendance.length,
        hadir: todayAttendance.filter((s) => s.status === "hadir").length,
        terlambat: todayAttendance.filter((s) => s.status === "terlambat").length,
        alpha: todayAttendance.filter((s) => s.status === "alpha").length,
        izin: todayAttendance.filter((s) => s.status === "izin").length,
    }

    const ScanInterface = () => (
        <div className="space-y-6">
            {/* Scan Mode Selector */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setScanMode("card")}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${scanMode === "card"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    <FaIdCard className="w-5 h-5" />
                    <span>Scan Kartu</span>
                </button>
                {/* <button
              onClick={() => setScanMode("qr")}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${
                scanMode === "qr"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaQrcode className="w-5 h-5" />
              <span>Scan QR</span>
            </button> */}
                <button
                    onClick={() => setScanMode("manual")}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${scanMode === "manual"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    <FaUserCheck className="w-5 h-5" />
                    <span>Manual</span>
                </button>
            </div>

            {/* Scan Area */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <div className="mx-auto w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                        {isScanning ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                                <p className="text-blue-600 font-medium">Memproses...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                {scanMode === "card" && <FaIdCard className="w-20 h-20 text-blue-400" />}
                                {scanMode === "qr" && <FaQrcode className="w-20 h-20 text-blue-400" />}
                                {scanMode === "manual" && <FaUserCheck className="w-20 h-20 text-blue-400" />}
                                <p className="text-gray-600 font-medium">
                                    {scanMode === "card" && "Tempelkan kartu pada reader"}
                                    {scanMode === "qr" && "Arahkan QR code ke kamera"}
                                    {scanMode === "manual" && "Pilih santri secara manual"}
                                </p>
                            </div>
                        )}

                        {/* Scanning Animation */}
                        {isScanning && <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>}
                    </div>

                    {/* Demo Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => handleCardScan("CARD001")}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            disabled={isScanning}
                        >
                            Demo Scan Berhasil
                        </button>
                        <button
                            onClick={() => handleCardScan("INVALID")}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            disabled={isScanning}
                        >
                            Demo Scan Gagal
                        </button>
                    </div>
                </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
                <div
                    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${scanResult.success ? "border-green-500" : "border-red-500"
                        }`}
                >
                    {scanResult.success ? (
                        <div className="flex items-center space-x-4">
                            <img
                                src={scanResult.student.photo || "/placeholder.svg"}
                                alt={scanResult.student.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{scanResult.student.name}</h3>
                                <p className="text-gray-600">Kelas: {scanResult.student.class}</p>
                                <p className="text-green-600 font-medium">✓ Presensi berhasil - {scanResult.time}</p>
                            </div>
                            <FaCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <FaTimesCircle className="w-8 h-8 text-red-500" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-600">Scan Gagal</h3>
                                <p className="text-gray-600">{scanResult.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )

    const AttendanceList = () => (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama atau kelas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="terlambat">Terlambat</option>
                            <option value="alpha">Alpha</option>
                            <option value="izin">Izin</option>
                        </select>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                            <FaDownload className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-gray-900">{attendanceStats.total}</div>
                    <div className="text-gray-600">Total</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{attendanceStats.hadir}</div>
                    <div className="text-gray-600">Hadir</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{attendanceStats.terlambat}</div>
                    <div className="text-gray-600">Terlambat</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-red-600">{attendanceStats.alpha}</div>
                    <div className="text-gray-600">Alpha</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendanceStats.izin}</div>
                    <div className="text-gray-600">Izin</div>
                </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Santri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIS
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Sholat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu Presensi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metode
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataPresensi.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.nama_santri}</div>
                                        {/* <div className="flex items-center">
                                            <img
                                                src={student.photo || "/placeholder.svg"}
                                                alt={student.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm text-gray-500">ID: {student.id}</div>
                                            </div>
                                        </div> */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nama_sholat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.tanggal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.waktu_presensi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.metode}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}
                                        >
                                            {getStatusIcon(student.status)}
                                            <span className="capitalize">{student.status}</span>
                                        </span>
                                    </td> */}
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.time}</td> */}
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    if (!hasAccess("presensi_sholat")) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Presensi Santri</h1>
                            <p className="text-gray-600 mt-1">
                                {currentTime.toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                - {currentTime.toLocaleTimeString("id-ID")}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <button
                                onClick={() => setCurrentView("list")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaUserCheck className="w-4 h-4" />
                                <span>Daftar</span>
                            </button>
                            <button
                                onClick={() => setCurrentView("scan")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaQrcode className="w-4 h-4" />
                                <span>Scan</span>
                            </button>
                            <button
                                onClick={() => setCurrentView("report")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "report" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>Laporan</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {currentView === "scan" && <ScanInterface />}
                {currentView === "list" && <AttendanceList />}
                {currentView === "report" && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Laporan Presensi</h3>
                        <p className="text-gray-600">Fitur laporan akan segera hadir</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PresensiSholat
