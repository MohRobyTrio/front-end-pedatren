"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useRef, useState } from "react"
import {
    FaShoppingCart,
    FaCheckCircle,
    FaUsers,
    FaCalendar,
    FaFilter,
    FaTimesCircle,
    FaMoneyBillWave,
    FaArrowRight,
    FaExchangeAlt,
    FaSync,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import blankProfile from "../../assets/blank_profile.png"
import { ModalSelectSantri } from "../../components/ModalSelectSantri"
import {
    FiCheck,
    FiCreditCard,
    FiEdit3,
    FiHardDrive,
    FiUser,
    FiWifi,
    FiX,
    FiRefreshCw,
    FiShoppingBag,
    FiArrowRight,
} from "react-icons/fi"
import useFetchTransaksi from "../../hooks/hook_menu_kepesantrenan/belanja/Transaksi"
import Pagination from "../../components/Pagination"

const Transaksi = () => {
    // const [activeTab, setActiveTab] = useState("daftar")
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        tanggal: "",
        kategori: "",
        metode: "",
        status: "",
    })

    const { dataTransaksi, loadingTransaksi, totalData, fetchData, totalPembayaran, currentPage, setCurrentPage, totalPages } = useFetchTransaksi(filters)

    // const dummyTransaksi = [
    //     {
    //         transaksi_id: 1,
    //         nama_pembeli: "Ahmad Rizki",
    //         nis: "2024001",
    //         id_pembeli: "PB001",
    //         foto_profil: null,
    //         nama_item: "Nasi Gudeg",
    //         kategori: "Makanan",
    //         jumlah: 2,
    //         harga_satuan: 15000,
    //         total_harga: 30000,
    //         metode: "nfc",
    //         status: "berhasil",
    //         created_at: "2024-01-15T10:30:00Z",
    //     },
    //     {
    //         transaksi_id: 2,
    //         nama_pembeli: "Siti Nurhaliza",
    //         nis: "2024002",
    //         id_pembeli: "PB002",
    //         foto_profil: null,
    //         nama_item: "Es Teh Manis",
    //         kategori: "Minuman",
    //         jumlah: 1,
    //         harga_satuan: 5000,
    //         total_harga: 5000,
    //         metode: "reader",
    //         status: "berhasil",
    //         created_at: "2024-01-15T11:15:00Z",
    //     },
    //     {
    //         transaksi_id: 3,
    //         nama_pembeli: "Budi Santoso",
    //         nis: "2024003",
    //         id_pembeli: "PB003",
    //         foto_profil: null,
    //         nama_item: "Buku Tulis",
    //         kategori: "Alat Tulis",
    //         jumlah: 3,
    //         harga_satuan: 8000,
    //         total_harga: 24000,
    //         metode: "manual",
    //         status: "pending",
    //         created_at: "2024-01-15T12:00:00Z",
    //     },
    // ]

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const totals = {
        total_data: totalData,
        total_pembayaran: totalPembayaran,
    }

    // const dataTransaksi = dummyTransaksi
    // const loadingTransaksi = false
    // const totalData = dummyTotals
    // const fetchData = () => console.log("Fetching dummy data...")

    useEffect(() => {
        console.log("filters", filters)
    }, [filters])

    // Main states - Auto-start in scan mode
    const [currentView, setCurrentView] = useState("scan")
    // const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const savedView = sessionStorage.getItem("currentView")
        if (savedView) {
            setCurrentView(savedView)
        }
    }, [])

    // Simpan state ke sessionStorage setiap kali currentView berubah
    // const handleSetView = (view) => {
    //     setCurrentView(view)
    //     sessionStorage.setItem("currentView", view)
    // }

    // Auto-initialize when component mounts
    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing Prayer Attendance App...")

            // Detect browser info
            detectBrowserInfo()

            // Start time updates
            // const timer = setInterval(() => setCurrentTime(new Date()), 1000)

            // return () => {
            //     clearInterval(timer)
            // }
        }

        initializeApp()
    }, [])

    const detectBrowserInfo = () => {
        const userAgent = navigator.userAgent
        const isChrome = /Chrome/.test(userAgent)
        const isAndroid = /Android/.test(userAgent)
        const isHttps = window.location.protocol === "https:"

        const info = `Browser: ${isChrome ? "Chrome" : "Other"}, Platform: ${isAndroid ? "Android" : "Other"}, HTTPS: ${isHttps ? "Yes" : "No"}`
        console.log("🔍 Browser Info:", info)
    }

    if (!hasAccess("presensi_sholat")) {
        return <Navigate to="/not-found" replace />
    }

    return (
        <div className="min-h-screen pl-6 pt-6">
            {/* Header Section */}
            <div className="bg-white shadow-sm rounded-lg">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-4 sm:space-y-0">
                        {/* Transaction Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Sistem Aktif</p>
                                    <p className="text-sm font-medium text-gray-900">Transaksi Pembayaran</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className="text-sm font-medium text-green-700">Siap Menerima Pembayaran</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentView("scan")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <FiCreditCard className="inline mr-2" />
                                Scan Pembayaran
                            </button>
                            <button
                                onClick={() => setCurrentView("list")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <FaShoppingCart className="inline mr-2" />
                                Riwayat Transaksi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto py-6">
                {currentView === "scan" ? (
                    <Scan refetch={fetchData} />
                ) : (
                    <TransactionList
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                        loadingTransaksi={loadingTransaksi}
                        dataTransaksi={dataTransaksi}
                        totals={totals}
                        fetchData={fetchData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    )
}

const TransactionList = ({ setSearchTerm, filters, setFilters, loadingTransaksi, dataTransaksi = [], totals, fetchData, currentPage, totalPages, handlePageChange }) => {
    console.log("transactions", dataTransaksi)
    const [showFilters, setShowFilters] = useState(false)

    // Mock data for categories - replace with actual API calls
    const kategoriOptions = [
        { value: "1", label: "Makanan & Minuman" },
        { value: "2", label: "Alat Tulis" },
        { value: "3", label: "Pakaian" },
        { value: "4", label: "Lainnya" },
    ]

    const handleAdvancedFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const resetFilters = () => {
        setFilters({
            tanggal: "",
            kategori_id: "",
            metode: "",
            status: "all",
            showAll: false,
        })
        setSearchTerm("")
    }

    const handleRefresh = () => {
        fetchData(true)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col space-y-4">
                    {/* Filter Toggle Button */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Filter Data Transaksi</h3>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${showFilters ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaFilter className="w-4 h-4" />
                                <span>{showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}</span>
                            </button>
                            <button
                                onClick={handleRefresh}
                                disabled={loadingTransaksi}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 bg-green-600 text-white transition-all ${loadingTransaksi
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-700"
                                    }`}
                            >
                                <FaSync className={`w-4 h-4 ${loadingTransaksi ? "animate-spin" : ""}`} />
                                <span>{loadingTransaksi ? "Merefresh..." : "Refresh"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="border-t pt-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Date Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaCalendar className="w-4 h-4 mr-2 text-blue-500" />
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.tanggal}
                                        onChange={(e) => handleAdvancedFilterChange("tanggal", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaShoppingCart className="w-4 h-4 mr-2 text-green-500" />
                                        Kategori
                                    </label>
                                    <select
                                        value={filters.kategori_id}
                                        onChange={(e) => handleAdvancedFilterChange("kategori_id", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {kategoriOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Method Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FiCreditCard className="w-4 h-4 mr-2 text-purple-500" />
                                        Metode Pembayaran
                                    </label>
                                    <select
                                        value={filters.metode}
                                        onChange={(e) => handleAdvancedFilterChange("metode", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Semua Metode</option>
                                        <option value="nfc">NFC Card</option>
                                        <option value="reader">Card Reader</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaCheckCircle className="w-4 h-4 mr-2 text-orange-500" />
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleAdvancedFilterChange("status", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="berhasil">Berhasil</option>
                                        <option value="gagal">Gagal</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                                >
                                    <FaTimesCircle className="w-4 h-4" />
                                    <span>Reset Filter</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Statistics */}
            {totals && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FaCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Data</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.total_data || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100">
                                <FaTimesCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.total_pending || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FaMoneyBillWave className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.total_transaksi || 0}</p>
                            </div>
                        </div>
                    </div> */}

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FaUsers className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Pembayaran</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {totals.total_pembayaran?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
                </div>

                {loadingTransaksi ? (
                    <div className="flex justify-center items-center py-12">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                            No
                                        </th>
                                        <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pembeli
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Outlet
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Bayar
                                        </th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dataTransaksi.length > 0 ? (
                                        dataTransaksi.map((item, i) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{(currentPage - 1) * 25 + i + 1 || "-"}</div>
                                                </td>
                                                <td className="pr-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {/* <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={item.foto_profil || blankProfile}
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = blankProfile
                                                            }}
                                                        />
                                                    </div> */}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{item?.santri?.biodata.nama || "-"}</div>
                                                            <div className="text-sm text-gray-500">
                                                                NIS: {item?.santri?.nis || "-"} | UID: {item?.santri.kartu?.uid_kartu || "-"}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.outlet.nama_outlet}</div>
                                                <div className="text-sm text-gray-500">{item.kategori.nama_kategori}</div>
                                            </td> */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item?.outlet?.nama_outlet || "-"}</div>
                                                    {/* <div className="text-sm text-gray-500">{item.kategori.nama_kategori}</div> */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* <div className="text-sm text-gray-900">{item.outlet.nama_outlet}</div> */}
                                                    <div className="text-sm text-gray-500">{item?.kategori?.nama_kategori || "-"}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-green-600">
                                                        Rp {item?.total_bayar?.toLocaleString() || "-"}
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.metode === "nfc"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : item.metode === "reader"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {item.metode === "nfc" ? "NFC" : item.metode === "reader" ? "Reader" : "Manual"}
                                                </span>
                                            </td> */}
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "berhasil"
                                                        ? "bg-green-100 text-green-800"
                                                        : item.status === "gagal"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {item.status === "berhasil"
                                                        ? "Berhasil"
                                                        : item.status === "gagal"
                                                            ? "Gagal"
                                                            : "Pending"}
                                                </span>
                                            </td> */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(item?.tanggal).toLocaleString("id-ID") || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                Tidak ada data transaksi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="pb-6 pr-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                handlePageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const Scan = ({ refetch }) => {
    const [isScanning, setIsScanning] = useState(false)
    const [customerData, setCustomerData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [nfcSupported, setNfcSupported] = useState(false)
    const [status, setStatus] = useState("Tempelkan kartu pembayaran...")
    const [statusResponse, setStatusResponse] = useState("")
    const [inputMode, setInputMode] = useState("reader")
    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [idCard, setIdCard] = useState("") // For NFC/Reader ID card

    const [hargaSatuan, setHargaSatuan] = useState("")
    const [jumlah, setJumlah] = useState("1")
    const [kategori, setKategori] = useState("")
    const [totalHarga, setTotalHarga] = useState(0)

    const [currentStep, setCurrentStep] = useState(1) // 1: Input data, 2: Scan, 3: PIN, 4: Complete
    const [pin, setPin] = useState("")
    const [showPinInput, setShowPinInput] = useState(false)

    // Calculate total when price or quantity changes
    useEffect(() => {
        const harga = Number.parseFloat(hargaSatuan) || 0
        const qty = Number.parseInt(jumlah) || 0
        setTotalHarga(harga * qty)
    }, [hargaSatuan, jumlah])

    useEffect(() => {
        checkNFCSupport()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (inputMode === "nfc") {
            if (!nfcSupported) {
                setStatusResponse("Error")
                setError("Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+")
            } else {
                startNFCScanning()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nfcSupported, inputMode])

    const checkNFCSupport = () => {
        if ("NDEFReader" in window) {
            handleSetView("nfc")
            setNfcSupported(true)
        } else {
            handleSetView("reader")
            setNfcSupported(false)
        }
    }

    useEffect(() => {
        const savedView = sessionStorage.getItem("inputMode")
        if (savedView) {
            setInputMode(savedView)
        }
    }, [])

    const handleSetView = (view) => {
        setInputMode(view)
        sessionStorage.setItem("inputMode", view)
    }

    const toggleInputMode = (mode) => {
        handleSetView(mode)
        setCurrentStep(1)
        setCustomerData(null)
        setError("")
        setSuccess("")
        setIdCard("")
        setIsScanning(false)

        switch (mode) {
            case "manual":
                setStatus("Pilih santri...")
                break
            case "nfc":
                setStatus("Tempelkan kartu NFC...")
                break
            case "reader":
                setStatus("Letakkan kartu pada reader...")
                break
        }
    }

    const playNotificationSound = (success) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(success ? 800 : 400, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        } catch (error) {
            console.log("Audio not supported", error)
        }
    }

    const startNFCScanning = async () => {
        if (!nfcSupported) return

        try {
            setIsScanning(true)
            setError("")
            setStatus("Tempelkan kartu pembayaran...")

            const ndef = new window.NDEFReader()
            await ndef.scan()

            ndef.addEventListener("reading", ({ message, serialNumber }) => {
                console.log(`Serial Number: ${serialNumber}`)
                console.log(`Records: ${message.records.length}`)

                let uidDecimal = null
                try {
                    // Remove all ':' characters
                    const bytes = serialNumber.split(":") // ["2F","8B","29","2B"]
                    const reversed = bytes.reverse().join("") // "2B298B2F"
                    uidDecimal = BigInt("0x" + reversed).toString(10)

                    // Pad leading zero to make it 10 digits
                    uidDecimal = uidDecimal.padStart(10, "0")
                    playNotificationSound(true)
                    console.log("UID Kartu (Decimal):", uidDecimal)
                } catch (e) {
                    playNotificationSound(false)
                    console.error("Gagal konversi UID ke desimal:", e)
                    uidDecimal = serialNumber // fallback
                }
                setStatus(`Kartu terdeteksi: ${uidDecimal}`)
                setIsScanning(false)
                searchCustomer(uidDecimal)
                playNotificationSound(true)
            })

            ndef.addEventListener("readingerror", () => {
                setError("Error membaca kartu NFC")
                setIsScanning(false)
                playNotificationSound(false)
            })
        } catch (error) {
            setError("Error: " + error.message)
            setIsScanning(false)
            playNotificationSound(false)
        }
    }

    const searchCustomer = async (uid_kartu) => {
        setLoading(true)
        setError("")
        setCustomerData(null)

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}transaksi/cari-pembeli`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uid_kartu: uid_kartu,
                }),
            })

            console.log("URL ", `${API_BASE_URL}transaksi/cari-pembeli`)

            const data = await response.json()

            if (!response.ok || data.success == false || data.data.status == false) {
                setStatusResponse(data.status || "")
                throw new Error(data.message || "Pembeli tidak ditemukan")
            }

            setCustomerData(data.data)
            console.log(data)

            setStatus(`Data pembeli ditemukan: ${data.data.nama_pembeli}`)
        } catch (error) {
            setError("Error: " + error.message)
            setStatus("Gagal mencari data pembeli")
        } finally {
            setLoading(false)
        }
    }

    const _recordTransaction = async () => {
        if (!customerData || !hargaSatuan || !jumlah || !kategori) {
            setError("Mohon lengkapi semua data transaksi")
            return
        }

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const endpoint = inputMode === "manual" ? `${API_BASE_URL}transaksi` : `${API_BASE_URL}transaksi/scan`

            const body = {
                pembeli_id: customerData.id,
                harga_satuan: Number.parseFloat(hargaSatuan),
                jumlah: Number.parseInt(jumlah),
                kategori: kategori,
                total_harga: totalHarga,
                metode: inputMode,
                ...(inputMode !== "manual" && { uid_kartu: customerData.uid_kartu }),
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Gagal menyimpan transaksi")
            }

            setSuccess("Transaksi berhasil disimpan!")
            playNotificationSound(true)

            // Reset form after successful transaction
            setTimeout(() => {
                resetScan()
                if (refetch) refetch()
            }, 2000)
        } catch (error) {
            setError("Error: " + error.message)
            playNotificationSound(false)
        } finally {
            setLoading(false)
        }
    }

    const kategoriOptions = [
        { value: "makanan_minuman", label: "Makanan & Minuman" },
        { value: "alat_tulis", label: "Alat Tulis" },
        { value: "pakaian", label: "Pakaian" },
        { value: "lainnya", label: "Lainnya" },
    ]

    const resetScan = () => {
        setCustomerData(null)
        setHargaSatuan("")
        setJumlah("1")
        setKategori("")
        setTotalHarga(0)
        setError("")
        setSuccess("")
        setStatus("Tempelkan kartu pembayaran...")
        setCurrentStep(1)
        setShowPinInput(false)
        setPin("")
    }

    const handleNextStep = () => {
        // console.log(idCard);

        switch (inputMode) {
            case "manual":
                setStatus("Pilih santri...")
                setCurrentStep(2)
                break
            case "nfc":
                setCurrentStep(2)
                setStatus("Tempelkan kartu NFC...")
                startNFCScanning()
                break
            case "reader":
                setStatus("Letakkan kartu pada reader...")
                setCurrentStep(2)
                break
            default:
                setStatus("Pilih mode input...")
        }
        // setCustomerData("")
        // if (currentStep === 1) {
        //     // Validate transaction data
        //     if (!hargaSatuan || !jumlah || !kategori) {
        //         setError("Mohon lengkapi semua data transaksi")
        //         return
        //     }

        //     if (inputMode === "manual") {
        //         // For manual mode, go directly to PIN step
        //         setCurrentStep(3)
        //         setShowPinInput(true)
        //     } else {
        //         // For NFC/reader mode, go to scan step
        //         setCurrentStep(2)
        //     }
        // } else if (currentStep === 2 && customerData) {
        //     // After successful scan, go to PIN step
        //     setCurrentStep(3)
        //     setShowPinInput(true)
        // }
    }
    const handleChangeData = () => {
        console.log(idCard);

        switch (inputMode) {
            case "manual":
                setShowSelectSantri(true)
                break
            case "nfc":
                setCustomerData("")
                setStatus("Tempelkan kartu NFC...")
                startNFCScanning()
                break
            case "reader":
                setCustomerData("")
                break
            default:
                setStatus("Pilih mode input...")
        }
    }

    const inputRef = useRef(null)

    useEffect(() => {
        if (currentStep !== 2) return;
        // Tangkap semua input dari reader
        const handleKeyPress = (e) => {
            // Biasanya reader mengirim angka + Enter
            if (e.key === "Enter") {
                e.preventDefault()
                // submitForm(nis)
            } else if (/^[0-9]$/.test(e.key)) {
                // Tambahkan angka ke state
                setIdCard((prev) => prev + e.key)
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idCard])

    const handlePinSubmit = () => {
        if (!pin || pin.length < 4) {
            setError("PIN harus minimal 4 digit")
            return
        }

        // Proceed with transaction
        _recordTransaction()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <FiCreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sistem Pembayaran</h2>
                    <p className="text-gray-600">Scan kartu pembeli untuk memproses transaksi</p>
                </div>

                {/* Input Mode Selection */}
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <button
                        onClick={() => toggleInputMode("nfc")}
                        disabled={!nfcSupported}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${inputMode === "nfc"
                            ? "bg-blue-600 text-white"
                            : nfcSupported
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiWifi className="mr-2" />
                        NFC {!nfcSupported && "(Tidak Didukung)"}
                    </button>
                    <button
                        onClick={() => toggleInputMode("reader")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${inputMode === "reader" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiHardDrive className="mr-2" />
                        Reader
                    </button>
                    <button
                        onClick={() => toggleInputMode("manual")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${inputMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiEdit3 className="mr-2" />
                        Manual
                    </button>
                </div>

                {/* Stepper Indicator */}
                {/* <div className="flex items-center justify-between mb-8">
                    {["Detail", "Pembeli", "PIN"].map((label, index) => {
                        const stepNumber = index + 1
                        const isActive = currentStep === stepNumber
                        const isCompleted = currentStep > stepNumber

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold mb-2
            ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
            ${isActive ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-400"}
          `}
                                >
                                    {isCompleted ? "✓" : stepNumber}
                                </div>
                                <span
                                    className={`text-sm font-medium ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                        )
                    })}
                </div> */}


                {/* Payment Form */}
                {/* Step 1: Input harga, jumlah, kategori */}
                {currentStep === 1 && (
                    <>
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Transaksi</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga Satuan</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                                        <input
                                            type="number"
                                            value={hargaSatuan}
                                            onChange={(e) => setHargaSatuan(e.target.value)}
                                            placeholder="0"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlah}
                                        onChange={(e) => setJumlah(Number(e.target.value) || 1)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <select
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {kategoriOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-2 border-green-200 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-gray-700">Total Pembayaran:</span>
                                    <span className="text-2xl font-bold text-green-600">Rp {totalHarga.toLocaleString("id-ID")}</span>
                                </div>
                            </div>



                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => handleNextStep(2)}
                                disabled={!hargaSatuan || !jumlah || !kategori}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50"
                            >
                                Lanjut
                                <FaArrowRight />
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Data Pembeli */}
                {currentStep === 2 && (
                    <div>
                        {/* tombol pilih/scan pembeli (punya kamu tadi) */}
                        {!customerData && inputMode === "manual" && (
                            <button
                                onClick={() => setShowSelectSantri(true)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium cursor-pointer"
                            >
                                Pilih Pembeli
                            </button>
                        )}

                        {!customerData && inputMode === "nfc" && (
                            <div className="text-center py-3">
                                {!nfcSupported ? (
                                    <div className="text-red-500">
                                        <FiX className="text-3xl sm:text-4xl mx-auto mb-2" />
                                        <p className="text-sm sm:text-base">NFC tidak didukung</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gunakan Chrome Android 89+</p>
                                    </div>
                                ) : isScanning ? (
                                    <div className="text-blue-500">
                                        <div className="animate-pulse">
                                            <FiWifi className="text-3xl sm:text-4xl mx-auto mb-2" />
                                        </div>
                                        <p className="text-sm sm:text-base font-medium">Scanning...</p>
                                        <div className="mt-3 sm:mt-4">
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <FiWifi className="text-3xl sm:text-4xl mx-auto mb-2" />
                                        <p className="text-sm sm:text-base">Scanner siap</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!customerData && inputMode === "reader" && (
                            <div className="text-center py-3">
                                <div className="relative mb-6">
                                    {/* Card Reader Visual */}
                                    <div className="mx-auto w-32 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg relative overflow-hidden">
                                        {/* Card Slot */}
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
                                        {/* LED Indicator */}
                                        <div
                                            className={`absolute top-4 right-3 w-2 h-2 rounded-full ${idCard ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                                        ></div>
                                        {/* Reader Brand */}
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                                            READER
                                        </div>
                                        {/* Scanning Animation */}
                                        {idCard && <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>}
                                    </div>

                                    {/* Status Icon */}
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                        {idCard ? (
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <FiCheck className="text-green-600 text-lg" />
                                            </div>
                                        ) : (
                                            <div className="bg-blue-100 p-2 rounded-full animate-bounce">
                                                <FiCreditCard className="text-blue-600 text-lg" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {idCard ? "Kartu Terdeteksi!" : "Siap Membaca Kartu"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {idCard ? "Data kartu berhasil dibaca" : "Letakkan kartu pada card reader"}
                                    </p>
                                </div>

                                {/* NIS Display */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 hidden">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Induk Santri (NIS)</label>
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={idCard}
                                            placeholder="Menunggu input dari card reader..."
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-center text-lg font-mono tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            readOnly
                                        />
                                        {idCard && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <FiCheck className="text-green-500 text-xl" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}



                        {customerData && (
                            <div className="p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="relative">
                                    {/* Tombol reset di pojok kanan atas */}
                                    <button
                                        onClick={() => {
                                            handleChangeData()
                                        }}
                                        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-blue-500 cursor-pointer"
                                    >
                                        <FaExchangeAlt size={20} />
                                    </button>

                                    <div className="text-center mb-4 sm:mb-6">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-gray-200 ring-4 ring-green-100">
                                            {customerData.foto_profil ? (
                                                <img
                                                    src={customerData.foto_profil || "/placeholder.svg"}
                                                    alt="Foto Profil"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.src = blankProfile
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiUser className="text-xl sm:text-2xl text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <FiCheck className="mr-1" />
                                            Data Pembeli Ditemukan
                                        </div>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Pembeli</label>
                                            <input
                                                type="text"
                                                value={customerData.nama_pembeli || customerData.label || ""}
                                                readOnly
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NIS/ID</label>
                                            <input
                                                type="text"
                                                value={customerData.nis || customerData.id || ""}
                                                readOnly
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                            />
                                        </div>

                                        {inputMode !== "manual" && (
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">UID Kartu</label>
                                                <input
                                                    type="text"
                                                    value={customerData.uid_kartu || ""}
                                                    readOnly
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>


                                {/* <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleNextStep}
                                        disabled={loading || !hargaSatuan || !jumlah || !kategori || (currentStep === 2 && !customerData)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 px-4 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                    >
                                        Ganti
                                        {loading ? (
                                            <>
                                                <FiRefreshCw className="animate-spin mr-2" />
                                                Memproses...
                                            </>
                                        ) : currentStep === 1 ? (
                                            <>
                                                <FiArrowRight className="mr-2" />
                                                {inputMode === "manual" ? "Lanjut ke PIN" : "Lanjut ke Scan"}
                                            </>
                                        ) : currentStep === 2 ? (
                                            <>
                                                <FiArrowRight className="mr-2" />
                                                Lanjut ke PIN
                                            </>
                                        ) : (
                                            <>
                                                <FiShoppingBag className="mr-2" />
                                                Proses Pembayaran (Rp {totalHarga.toLocaleString("id-ID")})
                                            </>
                                        )}
                                    </button> */}

                                {/* <button
                                        onClick={resetScan}
                                        className="px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <FiX className="text-lg" />
                                </div>
                                    </button> */}
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={!customerData}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50"
                            >
                                Lanjut ke PIN
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: PIN Input */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Masukkan PIN</h3>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
                            placeholder="••••"
                            maxLength="6"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handlePinSubmit}
                                disabled={!pin || pin.length < 4}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                )}


                <ModalSelectSantri
                    isOpen={showSelectSantri}
                    onClose={() => setShowSelectSantri(false)}
                    onSantriSelected={(santri) => {
                        setCustomerData(santri)
                        setShowSelectSantri(false)
                    }}
                />
            </div>
        </div>
    )
}

export default Transaksi
