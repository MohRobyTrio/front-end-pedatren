"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useRef, useState } from "react"
import {
    FaShoppingCart,
    FaCheckCircle,
    FaUsers,
    FaCalendar,
    FaTimesCircle,
    FaArrowRight,
    FaExchangeAlt,
    FaSync,
    FaStore,
    FaSearch,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate, useLocation } from "react-router-dom"
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
} from "react-icons/fi"
import useFetchTransaksi from "../../hooks/hook_menu_kepesantrenan/belanja/Transaksi"
import Pagination from "../../components/Pagination"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import useDropdownKategori from "../../hooks/hook_dropdown/DropdownKategori"
import Swal from "sweetalert2"
import useFetchDataOutlet from "../../hooks/hook_menu_kepesantrenan/belanja/hookOutlet"

const Transaksi = () => {
    // const [activeTab, setActiveTab] = useState("daftar")
    const [filters, setFilters] = useState({
        outlet_id: "",
        date_from: "",
        date_to: "",
        kategori_id: "",
        q: "",
    })

    const { dataTransaksi, loadingTransaksi, totalData, fetchData, totalPembayaran, currentPage, setCurrentPage, totalPages, searchTerm, setSearchTerm } = useFetchTransaksi(filters)

    // Main states - Auto-start in scan mode
    const [currentView, setCurrentView] = useState("scan")
    // const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const savedView = sessionStorage.getItem("currentViewTransaksi")
        if (savedView) {
            setCurrentView(savedView)
        }
    }, [])

    // Simpan state ke sessionStorage setiap kali currentView berubah
    const handleSetView = (view) => {
        setCurrentView(view)
        sessionStorage.setItem("currentViewTransaksi", view)
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const totals = {
        total_data: totalData,
        total_pembayaran: totalPembayaran,
    }

    useEffect(() => {
        console.log("filters", filters)
    }, [filters])

    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing Prayer Attendance App...")
            detectBrowserInfo()
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

    const outletSession = sessionStorage.getItem("outlet");
    const outletLocal = localStorage.getItem("outlet");

    // Fungsi bantu untuk cek validitas
    const isValidOutlet = (value) =>
        value && value !== "null" && value !== "undefined";

    if (!hasAccess("transaksi") || (!isValidOutlet(outletSession) && !isValidOutlet(outletLocal))) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="min-h-screen pl-6 pt-6">
            {/* Header Section */}
            <div className="bg-white shadow-sm rounded-lg">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0">
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
                        <div className="flex space-x-2 items-center justify-center">
                            <button
                                onClick={() => handleSetView("scan")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <FiCreditCard className="inline mr-2" />
                                Scan Pembayaran
                            </button>
                            <button
                                onClick={() => handleSetView("list")}
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
                        searchTerm={searchTerm}
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

const TransactionList = ({ searchTerm, setSearchTerm, filters, setFilters, loadingTransaksi, dataTransaksi = [], totals, fetchData, currentPage, totalPages, handlePageChange }) => {
    console.log("totals", totals)
    const { dataOutlet } = useFetchDataOutlet();
    const { menuKategori } = useDropdownKategori();

    // Mock data for categories - replace with actual API calls
    // const kategoriOptions = [
    //     { value: "1", label: "Makanan & Minuman" },
    //     { value: "2", label: "Alat Tulis" },
    //     { value: "3", label: "Pakaian" },
    //     { value: "4", label: "Lainnya" },
    // ]

    const handleAdvancedFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleAdvancedSearchChange = (key, value) => {
        setSearchTerm(value)
    }

    // const resetFilters = () => {
    //     setFilters({
    //         tanggal: "",
    //         kategori_id: "",
    //         metode: "",
    //         status: "all",
    //         showAll: false,
    //     })
    //     setSearchTerm("")
    // }

    const handleRefresh = () => {
        fetchData(true)
    }

    const isFilterValid = filters?.outlet_id && filters?.date_from && filters?.date_to

    // if (!isFilterValid) {
    //     return (
    //         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    //             <p className="text-yellow-700 font-medium">
    //                 Silakan pilih <b>Outlet</b>, <b>Tanggal Dari</b>, dan <b>Tanggal Sampai</b> terlebih dahulu.
    //             </p>
    //         </div>
    //     )
    // }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Outlet Filter */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FaStore className="w-4 h-4 mr-2 text-purple-500" />
                            Outlet
                        </label>
                        <select
                            value={filters.outlet_id}
                            onChange={(e) => handleAdvancedFilterChange("outlet_id", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Semua Outlet</option>
                            {dataOutlet
                                ?.filter((option) => option.status == 1)
                                .map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nama_outlet}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FaCalendar className="w-4 h-4 mr-2 text-blue-500" />
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleAdvancedFilterChange("date_from", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <FaCalendar className="w-4 h-4 mr-2 text-blue-500" />
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleAdvancedFilterChange("date_to", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() =>
                            setFilters({
                                outlet_id: "",
                                date_from: "",
                                date_to: "",
                            })
                        }
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                    >
                        <FaTimesCircle className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {isFilterValid ? (
                <>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama santri atau NIS..."
                                        value={searchTerm}
                                        onChange={(e) => handleAdvancedSearchChange("q", e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Filter + Refresh Button */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {/* Select (2/3 di md ke atas) */}
                                    <div className="md:col-span-2">
                                        <select
                                            value={filters.kategori_id}
                                            onChange={(e) =>
                                                handleAdvancedFilterChange("kategori_id", e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                        >
                                            <option value="">Semua Kategori</option>
                                            {menuKategori.map((option) => (
                                                <option key={option.kategori_id} value={option.kategori_id}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Button (1/3 di md ke atas) */}
                                    <div className="md:col-span-1">
                                        <button
                                            onClick={handleRefresh}
                                            disabled={loadingTransaksi}
                                            className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 bg-green-600 text-white transition-all ${loadingTransaksi
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-green-700"
                                                }`}
                                        >
                                            <FaSync
                                                className={`w-4 h-4 ${loadingTransaksi ? "animate-spin" : ""}`}
                                            />
                                            <span>{loadingTransaksi ? "Merefresh..." : "Refresh"}</span>
                                        </button>
                                    </div>
                                </div>

                            </div>


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
                                        <p className="text-2xl font-bold text-gray-900">{(totals?.total_data ?? 0) || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <FaUsers className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Pembayaran</p>
                                        <p className="text-2xl font-bold text-gray-900">Rp {(totals?.total_pembayaran ?? 0).toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transaction Table */}
                    <div className="bg-white rounded-xl shadow-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
                        </div>

                        {loadingTransaksi ? (
                            <div className="flex justify-center items-center py-12">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : (
                            <>
                                <DoubleScrollbarTable>
                                    {/* <div className="overflow-x-auto"> */}
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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dataTransaksi.length > 0 ? (
                                                dataTransaksi.map((item, i) => (
                                                    <tr key={item?.id || i} className="hover:bg-gray-50">
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{(currentPage - 1) * 25 + i + 1 || "-"}</div>
                                                        </td>
                                                        <td className="pr-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{item?.santri?.biodata?.nama || "-"}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        NIS: {item?.santri?.nis || "-"} | UID: {item?.santri?.kartu?.uid_kartu || "-"}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{item?.outlet?.nama_outlet || "-"}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{item?.kategori?.nama_kategori || "-"}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-green-600">
                                                                Rp {item?.total_bayar?.toLocaleString() || "-"}
                                                            </div>
                                                        </td>

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
                                    {/* </div> */}
                                </DoubleScrollbarTable>
                                {totalPages > 1 && (
                                    <div className="pb-6 pr-6">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700 font-medium">
                        Silakan pilih <b>Outlet</b>, <b>Tanggal Dari</b>, dan <b>Tanggal Sampai</b> terlebih dahulu.
                    </p>
                </div>
            )}
        </div>
    )
}

const Scan = ({ refetch }) => {
    const [isScanning, setIsScanning] = useState(false)
    const [customerData, setCustomerData] = useState(null)
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [success, setSuccess] = useState("")
    const [nfcSupported, setNfcSupported] = useState(false)
    const [inputMode, setInputMode] = useState("reader")
    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [idCard, setIdCard] = useState("") // For NFC/Reader ID card

    const [hargaSatuan, setHargaSatuan] = useState("")
    const [jumlah, setJumlah] = useState("1")
    const [kategori, setKategori] = useState("")
    const [totalHarga, setTotalHarga] = useState(0)

    const [currentStep, setCurrentStep] = useState(1) // 1: Input data, 2: Scan, 3: PIN, 4: Complete
    const [pin, setPin] = useState("")

    const location = useLocation()

    const { menuKategori } = useDropdownKategori()

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
            const response = await fetch(`${API_BASE_URL}presensi/cari-santri`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uid_kartu: uid_kartu,
                }),
            })

            console.log("URL ", `${API_BASE_URL}transaksi/cari-santri`)

            const data = await response.json()

            if (!response.ok || data.success == false || data.data.status == false) {
                throw new Error(data.message || "Pembeli tidak ditemukan")
            }

            setCustomerData(data.data)
            console.log(data)

        } catch (error) {
            setError("Error: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const _recordTransaction = async () => {
        if (!customerData || !hargaSatuan || !jumlah || !kategori) {
            setError("Mohon lengkapi semua data transaksi")
            return
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Batal",
        })

        if (!confirmResult.isConfirmed) return

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            Swal.fire({
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
                customClass: {
                    popup: "p-0 shadow-none border-0 bg-transparent",
                },
            })
            const token = sessionStorage.getItem("token") || getCookie("token")
            const endpoint = `${API_BASE_URL}transaksi`

            const body = {
                kategori_id: kategori,
                total_bayar: totalHarga,
                pin: pin,
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

            Swal.close()

            const data = await response.json()

            if (!response.ok || !data.success) {
                if (data.error) {
                    const fieldMap = {
                        kategori_id: "Kategori",
                        total_bayar: "Total Bayar",
                        nama: "Nama",
                        email: "Email",
                        // tambahin sesuai field di form
                    };

                    const ruleMap = {
                        required: (field) => `${field} wajib diisi.`,
                        unique: (field) => `${field} sudah digunakan.`,
                        min: (field) => `${field} terlalu kecil.`,
                        max: (field) => `${field} terlalu besar.`,
                        exists: (field) => `${field} tidak ditemukan.`,
                        numeric: (field) => `${field} harus berupa angka.`,
                        string: (field) => `${field} harus berupa teks.`,
                        email: (field) => `${field} harus berupa email valid.`,
                    };

                    const errorMessages = Object.entries(data.error)
                        .map(([field, messages]) => {
                            const label = fieldMap[field] || field; // fallback kalau belum di-map
                            return messages
                                .map(msg => {
                                    // coba cari rule yg cocok dari pesan asli Laravel
                                    for (const rule in ruleMap) {
                                        if (msg.toLowerCase().includes(rule)) {
                                            return ruleMap[rule](label);
                                        }
                                    }
                                    return `${label}: ${msg}`; // fallback
                                })
                                .join(", ");
                        })
                        .join("\n");

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    });

                    return;
                }

                throw new Error(data.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: data.message,
            });
            setIdCard("")
            setSuccess("Transaksi berhasil disimpan!")
            resetScan()
            refetch(true)

            // Reset form after successful transaction
            // setTimeout(() => {
            //     if (refetch) refetch()
            // }, 2000)
        } catch (error) {
            setError("Error: " + error.message)
            await Swal.fire({
                icon: "error",
                title: "Transaksi Gagal",
                text: error.message,
            });
        } finally {
            setLoading(false)
        }
    }

    const resetScan = () => {
        setCustomerData(null)
        setHargaSatuan("")
        setJumlah("1")
        setKategori("")
        setTotalHarga(0)
        setError("")
        setSuccess("")
        setCurrentStep(1)
        setPin("")
    }

    useEffect(() => {
        resetScan()
    }, [inputMode])

    const handleKembali = () => {
        switch (inputMode) {
            case "manual":
                setCurrentStep(1)
                break
            case "nfc":
                setCurrentStep(2)
                startNFCScanning()
                break
            case "reader":
                setIdCard("")
                setCurrentStep(1)
                break
            default:
                setCurrentStep(1)
        }
    }

    const handleNextStep = () => {
        // console.log(idCard);
        setIdCard("")
        switch (inputMode) {
            case "manual":
                setCurrentStep(2)
                break
            case "nfc":
                setCurrentStep(2)
                startNFCScanning()
                break
            case "reader":
                setCurrentStep(2)
                break
            default:
                setCurrentStep(2)
        }
    }
    const handleChangeData = () => {
        console.log(idCard);

        switch (inputMode) {
            case "manual":
                setShowSelectSantri(true)
                break
            case "nfc":
                setCustomerData("")
                startNFCScanning()
                break
            case "reader":
                setCustomerData("")
                setIdCard("")
                break
            default:
                setCustomerData("")
                setIdCard("")
        }
    }

    const inputRef = useRef(null)

    useEffect(() => {
        // jalankan hanya di halaman /transaksi/belanja
        if (location.pathname !== "/transaksi/belanja") return;

        // kalau bukan step 2, juga berhenti
        if (currentStep !== 2) return;

        const handleKeyPress = (e) => {
            if (currentStep !== 2 || location.pathname !== "/transaksi/belanja") return;

            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Pathname Transaksi:", location.pathname);
                console.log("Submit ID Card:", idCard);

                searchCustomer(idCard);
            } else if (/^[0-9]$/.test(e.key)) {
                setIdCard((prev) => {
                    let newId = prev + e.key;

                    // reset kalau lebih dari 10 digit
                    if (newId.length > 10) {
                        newId = e.key;
                    }

                    return newId;
                });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentStep, idCard, location.pathname]);


    const handlePinSubmit = () => {
        if (!pin || pin.length < 4) {
            setError("PIN harus minimal 4 digit")
            return
        }

        // Proceed with transaction
        _recordTransaction()
    }

    useEffect(() => {
        console.log(customerData);

    }, [customerData])

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
                <div className="flex bg-white rounded-xl p-1 shadow-lg mb-4 sm:mb-6">
                    <button
                        onClick={() => toggleInputMode("nfc")}
                        disabled={!nfcSupported}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "nfc"
                            ? "bg-blue-600 text-white"
                            : nfcSupported
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiWifi className="mr-2" />
                        NFC
                        {/* {!nfcSupported && "(No Support)"} */}
                    </button>
                    <button
                        onClick={() => toggleInputMode("reader")}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "reader" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiHardDrive className="mr-2" />
                        Reader
                    </button>
                    <button
                        onClick={() => toggleInputMode("manual")}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <FiEdit3 className="mr-2" />
                        Manual
                    </button>
                </div>
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
                                            value={hargaSatuan === "" ? "" : hargaSatuan}
                                            onChange={(e) => {
                                                const val = e.target.value;

                                                if (val === "") {
                                                    setHargaSatuan("");
                                                    return;
                                                }

                                                let num = Number(val);

                                                // minimal 1
                                                if (isNaN(num) || num < 1) {
                                                    num = 1;
                                                }

                                                // hapus leading zero (kecuali angka 0)
                                                setHargaSatuan(num);
                                            }}
                                            placeholder="0"
                                            min="0"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />


                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlah === "" ? "" : jumlah}
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            // Boleh kosong
                                            if (val === "") {
                                                setJumlah("");
                                                return;
                                            }

                                            // Convert ke number
                                            let num = Number(val);

                                            // Jika kurang dari 1 (minus atau 0), set jadi 1
                                            if (isNaN(num) || num < 1) {
                                                num = 1;
                                            }

                                            setJumlah(num);
                                        }}
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
                                    {menuKategori.map((option) => (
                                        <option key={option.kategori_id} value={option.kategori_id}>
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
                                                value={customerData.nama_pembeli || customerData.nama_santri || customerData.label || ""}
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

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">PIN</label>
                                            <input
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                placeholder="Masukkan PIN"
                                                maxLength="6"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                                            />
                                        </div>
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
                                onClick={() => handleKembali()}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handlePinSubmit}
                                disabled={!customerData || !pin || pin.length < 4}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50"
                            >
                                Konfirmasi
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
                            placeholder="Masukkan PIN"
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
