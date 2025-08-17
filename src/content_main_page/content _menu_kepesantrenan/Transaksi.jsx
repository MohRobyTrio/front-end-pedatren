"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useState } from "react"
import {
    FaShoppingCart,
    FaCheckCircle,
    FaUsers,
    FaCalendar,
    FaFilter,
    FaTimesCircle,
    FaMoneyBillWave,
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
} from "react-icons/fi"

const Transaksi = () => {
    // const [activeTab, setActiveTab] = useState("daftar")
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        tanggal: new Date().toISOString().split("T")[0],
        kategori: "",
        metode: "",
        status: "",
    })

    const dummyTransaksi = [
        {
            transaksi_id: 1,
            nama_pembeli: "Ahmad Rizki",
            nis: "2024001",
            id_pembeli: "PB001",
            foto_profil: null,
            nama_item: "Nasi Gudeg",
            kategori: "Makanan",
            jumlah: 2,
            harga_satuan: 15000,
            total_harga: 30000,
            metode: "nfc",
            status: "berhasil",
            created_at: "2024-01-15T10:30:00Z",
        },
        {
            transaksi_id: 2,
            nama_pembeli: "Siti Nurhaliza",
            nis: "2024002",
            id_pembeli: "PB002",
            foto_profil: null,
            nama_item: "Es Teh Manis",
            kategori: "Minuman",
            jumlah: 1,
            harga_satuan: 5000,
            total_harga: 5000,
            metode: "reader",
            status: "berhasil",
            created_at: "2024-01-15T11:15:00Z",
        },
        {
            transaksi_id: 3,
            nama_pembeli: "Budi Santoso",
            nis: "2024003",
            id_pembeli: "PB003",
            foto_profil: null,
            nama_item: "Buku Tulis",
            kategori: "Alat Tulis",
            jumlah: 3,
            harga_satuan: 8000,
            total_harga: 24000,
            metode: "manual",
            status: "pending",
            created_at: "2024-01-15T12:00:00Z",
        },
    ]

    const dummyTotals = {
        total_transaksi: 3,
        total_berhasil: 2,
        total_pending: 1,
        total_gagal: 0,
        total_pendapatan: 59000,
    }

    const dataTransaksi = dummyTransaksi
    const loadingTransaksi = false
    const totalData = dummyTotals
    const fetchData = () => console.log("Fetching dummy data...")

    useEffect(() => {
        console.log("filters", filters)
    }, [filters])

    // Main states - Auto-start in scan mode
    const [currentView, setCurrentView] = useState("scan")
    const [currentTime, setCurrentTime] = useState(new Date())

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
            const timer = setInterval(() => setCurrentTime(new Date()), 1000)

            return () => {
                clearInterval(timer)
            }
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
        <div className="min-h-screen bg-gray-50 pl-4">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {currentView === "scan" ? (
                    <Scan refetch={fetchData} />
                ) : (
                    <TransactionList
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                        loadingTransaksi={loadingTransaksi}
                        dataTransaksi={dataTransaksi}
                        totals={totalData}
                    />
                )}
            </div>
        </div>
    )
}

const TransactionList = (({ setSearchTerm, filters, setFilters, loadingTransaksi, dataTransaksi = [], totals }) => {
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col space-y-4">
                    {/* Filter Toggle Button */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Filter Data Transaksi</h3>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${showFilters ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <FaFilter className="w-4 h-4" />
                            <span>{showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}</span>
                        </button>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FaCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Berhasil</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.total_berhasil || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
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
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FaUsers className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {totals.total_pendapatan?.toLocaleString()}</p>
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
                        <OrbitProgress variant="track-disc" dense color="#3B82F6" size="medium" text="" textColor="" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembeli
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item & Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah & Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataTransaksi.length > 0 ? (
                                    dataTransaksi.map((transaksi) => (
                                        <tr key={transaksi.transaksi_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={transaksi.foto_profil || blankProfile}
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = blankProfile
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{transaksi.nama_pembeli}</div>
                                                        <div className="text-sm text-gray-500">{transaksi.nis || transaksi.id_pembeli}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{transaksi.nama_item}</div>
                                                <div className="text-sm text-gray-500">{transaksi.kategori}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {transaksi.jumlah} x Rp {transaksi.harga_satuan?.toLocaleString()}
                                                </div>
                                                <div className="text-sm font-medium text-green-600">
                                                    Total: Rp {transaksi.total_harga?.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaksi.metode === "nfc"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : transaksi.metode === "reader"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {transaksi.metode === "nfc" ? "NFC" : transaksi.metode === "reader" ? "Reader" : "Manual"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaksi.status === "berhasil"
                                                        ? "bg-green-100 text-green-800"
                                                        : transaksi.status === "gagal"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {transaksi.status === "berhasil"
                                                        ? "Berhasil"
                                                        : transaksi.status === "gagal"
                                                            ? "Gagal"
                                                            : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaksi.created_at).toLocaleString("id-ID")}
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
                )}
            </div>
        </div>
    )
})

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
    // const [santriData, setSantriData] = useState("")

    const [namaItem, setNamaItem] = useState("")
    const [hargaSatuan, setHargaSatuan] = useState("")
    const [jumlah, setJumlah] = useState("1")
    const [kategori, setKategori] = useState("")
    const [totalHarga, setTotalHarga] = useState(0)

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

                const uid_kartu = serialNumber
                setStatus(`Kartu terdeteksi: ${uid_kartu}`)
                setIsScanning(false)
                searchCustomer(uid_kartu)
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

    const resetScan = () => {
        setCustomerData(null)
        setError("")
        setSuccess("")
        setStatus("Tempelkan kartu pembayaran...")
        setStatusResponse("")
        // Reset payment form
        setNamaItem("")
        setHargaSatuan("")
        setJumlah("1")
        setKategori("")
        setTotalHarga(0)

        if (inputMode === "nfc" && nfcSupported) {
            startNFCScanning()
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

    const recordTransaction = async () => {
        if (!customerData || !namaItem || !hargaSatuan || !jumlah || !kategori) {
            setError("Mohon lengkapi semua data transaksi")
            return
        }

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const endpoint = inputMode === "manual" ? `${API_BASE_URL}transaksi/manual` : `${API_BASE_URL}transaksi/scan`

            const body = {
                pembeli_id: customerData.id,
                nama_item: namaItem,
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
                        onClick={() => handleSetView("nfc")}
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
                        onClick={() => handleSetView("reader")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${inputMode === "reader" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiHardDrive className="mr-2" />
                        Card Reader
                    </button>
                    <button
                        onClick={() => handleSetView("manual")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${inputMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiEdit3 className="mr-2" />
                        Manual
                    </button>
                </div>

                {/* Payment Form */}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jumlah
                            </label>
                            <input
                                type="number"
                                value={jumlah}
                                onChange={(e) => {
                                    let val = e.target.value;

                                    // hapus leading zero
                                    val = val.replace(/^0+/, "");

                                    // kalau kosong setelah dihapus, default ke 1
                                    if (parseInt(val) < 1) {
                                        setJumlah(1);
                                    } else {
                                        setJumlah(parseInt(val));
                                    }
                                }}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Item</label>
                            <input
                                type="text"
                                value={namaItem}
                                onChange={(e) => setNamaItem(e.target.value)}
                                placeholder="Masukkan nama item"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div> */}

                        <div className="col-span-2">
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
                    </div>

                    

                    {/* Total Display */}
                    <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-700">Total Pembayaran:</span>
                            <span className="text-2xl font-bold text-green-600">Rp {totalHarga.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                {/* Status Display */}
                <div className="mb-6">
                    <div
                        className={`p-4 rounded-lg border-2 ${error
                            ? "border-red-200 bg-red-50"
                            : success
                                ? "border-green-200 bg-green-50"
                                : customerData
                                    ? "border-green-200 bg-green-50"
                                    : "border-blue-200 bg-blue-50"
                            }`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-3 h-3 rounded-full mr-3 ${error
                                    ? "bg-red-500"
                                    : success
                                        ? "bg-green-500"
                                        : customerData
                                            ? "bg-green-500"
                                            : isScanning
                                                ? "bg-blue-500 animate-pulse"
                                                : "bg-gray-400"
                                    }`}
                            ></div>
                            <span
                                className={`font-medium ${error
                                    ? "text-red-700"
                                    : success
                                        ? "text-green-700"
                                        : customerData
                                            ? "text-green-700"
                                            : "text-blue-700"
                                    }`}
                            >
                                {error || success || status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Manual Input for Customer Selection */}
                {inputMode === "manual" && !customerData && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowSelectSantri(true)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                            <FiUser className="inline mr-2" />
                            Pilih Pembeli Manual
                        </button>
                    </div>
                )}

                {/* Customer Data Display */}
                {customerData && (
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
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

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={recordTransaction}
                                disabled={loading || !namaItem || !hargaSatuan || !jumlah || !kategori}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 px-4 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <FiRefreshCw className="animate-spin mr-2" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <FiShoppingBag className="mr-2" />
                                        OK - Proses Pembayaran (Rp {totalHarga.toLocaleString("id-ID")})
                                    </>
                                )}
                            </button>

                            <button
                                onClick={resetScan}
                                className="px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Manual Restart Button */}
                {!isScanning && nfcSupported && !customerData && inputMode === "nfc" && (
                    <div className="text-center">
                        <button
                            onClick={startNFCScanning}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-medium text-sm sm:text-base transition-colors"
                        >
                            Mulai Scan Ulang
                        </button>
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
