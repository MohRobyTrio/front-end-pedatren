"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import useFetchPresensi from "../../hooks/hooks_menu_data_pokok/Presensi"
import { FaQrcode, FaUserCheck, FaCalendarAlt, FaSearch, FaDownload } from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"
import { getCookie } from "../../utils/cookieUtils"
import { FiCheck, FiCreditCard, FiEdit3, FiHardDrive, FiRefreshCw, FiUser, FiWifi, FiX } from "react-icons/fi"
import { API_BASE_URL } from "../../hooks/config"
import blankProfile from "../../assets/blank_profile.png"
import { ModalSelectSantri } from "../../components/ModalSelectSantri"

const PresensiSholat = () => {
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
        dataPresensi,
        loadingPresensi,
        errorPresensi,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
        jadwalSholat,
        totals,
        responseFilter,
    } = useFetchPresensi(updatedFilters)

    // useEffect(() => {
    //     console.log(dataPresensi);
    // }, [dataPresensi])

    // Main states - Auto-start in scan mode
    const [currentView, setCurrentView] = useState("scan")
    const [scanMode, setScanMode] = useState("nfc")
    const [attendanceData, setAttendanceData] = useState([])
    const [todayAttendance, setTodayAttendance] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isProcessing, setIsProcessing] = useState(false)

    // NFC states - Enhanced detection
    const [nfcSupported, setNfcSupported] = useState(false)
    const [nfcReaderActive, setNfcReaderActive] = useState(false)
    const [nfcStatus, setNfcStatus] = useState("initializing")
    const [nfcPermission, setNfcPermission] = useState("unknown")
    const [browserInfo, setBrowserInfo] = useState("")

    // Student data states
    const [studentData, setStudentData] = useState(null)
    const [showStudentForm, setShowStudentForm] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Manual input states
    const [showManualInput, setShowManualInput] = useState(false)
    const [manualUID, setManualUID] = useState("")

    // Refs
    const abortControllerRef = useRef(null)
    const nfcReaderRef = useRef(null)
    const manualInputRef = useRef(null)

    useEffect(() => {
        const savedView = sessionStorage.getItem("currentView");
        if (savedView) {
            setCurrentView(savedView);
        }
    }, []);

    // Simpan state ke sessionStorage setiap kali currentView berubah
    const handleSetView = (view) => {
        setCurrentView(view);
        sessionStorage.setItem("currentView", view);
    };

    // Auto-initialize when component mounts
    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing Prayer Attendance App...")

            // Detect browser info
            detectBrowserInfo()

            // Start time updates
            const timer = setInterval(() => setCurrentTime(new Date()), 1000)

            // Auto-initialize NFC scanning with delay to ensure proper mounting
            setTimeout(async () => {
                await initializeNFC()
            }, 500)

            return () => {
                clearInterval(timer)
                cleanupNFC()
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
        setBrowserInfo(info)
        console.log("🔍 Browser Info:", info)
    }

    const initializeNFC = async () => {
        console.log("🔧 Initializing NFC...")
        setNfcStatus("checking")

        try {
            // Enhanced NFC support detection
            const hasNDEFReader = "NDEFReader" in window
            const hasNavigator = "navigator" in window
            const isSecureContext = window.isSecureContext
            const isHttps = window.location.protocol === "https:"

            console.log("📋 NFC Support Check:", {
                hasNDEFReader,
                hasNavigator,
                isSecureContext,
                isHttps,
                userAgent: navigator.userAgent,
            })

            if (!isHttps) {
                setNfcStatus("not_secure")
                setScanResult({
                    success: false,
                    message: "NFC memerlukan HTTPS. Pastikan menggunakan koneksi aman.",
                })
                return
            }

            if (!hasNDEFReader) {
                console.log("❌ NDEFReader not available")
                setNfcSupported(false)
                setNfcStatus("not_supported")
                setScanResult({
                    success: false,
                    message: "Browser tidak mendukung Web NFC API. Gunakan Chrome di Android.",
                })
                return
            }

            console.log("✅ Web NFC API detected")
            setNfcSupported(true)
            setNfcStatus("supported")

            // Check permissions
            await checkNFCPermissions()

            // Auto-start NFC scanning
            // await startNFCScanning()
        } catch (error) {
            console.error("❌ NFC initialization error:", error)
            setNfcStatus("error")
            setScanResult({
                success: false,
                message: "Gagal menginisialisasi NFC: " + error.message,
            })
        }
    }

    const checkNFCPermissions = async () => {
        try {
            if ("permissions" in navigator) {
                const permission = await navigator.permissions.query({ name: "nfc" })
                setNfcPermission(permission.state)
                console.log("🔐 NFC Permission:", permission.state)

                permission.addEventListener("change", () => {
                    setNfcPermission(permission.state)
                    console.log("🔄 NFC Permission changed:", permission.state)
                })
            }
        } catch (error) {
            console.log("⚠️ Cannot check NFC permissions:", error)
            setNfcPermission("unknown")
        }
    }

    const cleanupNFC = () => {
        console.log("🧹 Cleaning up NFC...")
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        setNfcReaderActive(false)
        setIsScanning(false)
    }

    if (!hasAccess("presensi_sholat")) {
        return <Navigate to="/not-found" replace />
    }

    return (
        <div className="pl-6 pt-6 mb-8 pb-6">
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Presensi Sholat</h1>
                            <p className="text-gray-600 mt-1">
                                {currentTime.toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                - {currentTime.toLocaleTimeString("id-ID")}
                            </p>
                            {jadwalSholat && (
                                <p className="text-sm text-blue-600 mt-1">
                                    {jadwalSholat.nama_sholat} - {jadwalSholat.jam_mulai} s/d {jadwalSholat.jam_selesai}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <button
                                onClick={() => handleSetView("scan")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaQrcode className="w-4 h-4" />
                                <span>Scan</span>
                            </button>
                            <button
                                onClick={() => handleSetView("list")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaUserCheck className="w-4 h-4" />
                                <span>Daftar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {totals && currentView === "list" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-green-600">{totals.total_hadir}</div>
                            <div className="text-sm text-gray-600">Hadir</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-red-600">{totals.total_tidak_hadir}</div>
                            <div className="text-sm text-gray-600">Tidak Hadir</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-blue-600">{totals.total_presensi_tercatat}</div>
                            <div className="text-sm text-gray-600">Tercatat</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-gray-600">{totals.total_santri}</div>
                            <div className="text-sm text-gray-600">Total Santri</div>
                        </div>
                    </div>
                )}

                {currentView === "scan" && <Scan />}
                {/* {currentView === "list" && dataPresensi && dataPresensi.length > 0 && ( */}
                {currentView === "list" && (
                    <AttendanceList
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        loadingPresensi={loadingPresensi}
                        dataPresensi={dataPresensi}
                        totals={totalData}
                        jadwalSholat={jadwalSholat}
                    />
                )}
                {/* {currentView === "list" && (!dataPresensi || dataPresensi.length === 0) && !loadingPresensi && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaUserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Data Presensi</h3>
                        <p className="text-gray-600">Belum ada data presensi untuk filter yang dipilih</p>
                    </div>
                )} */}
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

const AttendanceList = memo(
    ({
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        loadingPresensi,
        dataPresensi = [],
        totals,
    }) => {
        console.log("attendance", dataPresensi)

        const handleSearchChange = useCallback(
            (e) => {
                setSearchTerm(e.target.value)
            },
            [setSearchTerm],
        )

        const handleFilterChange = useCallback(
            (e) => {
                setFilterStatus(e.target.value)
            },
            [setFilterStatus],
        )

        return (
            <div className="space-y-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama atau kelas..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={filterStatus}
                                onChange={handleFilterChange}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Semua Status</option>
                                <option value="Hadir">Hadir</option>
                                <option value="Terlambat">Terlambat</option>
                                <option value="Alpha">Alpha</option>
                                <option value="Izin">Izin</option>
                            </select>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <FaDownload className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-2xl font-bold text-green-600">{totals.total_hadir}</div>
                        <div className="text-gray-600">Hadir</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{totals.total_tidak_hadir}</div>
                        <div className="text-gray-600">Tidak Hadir</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-2xl font-bold text-red-600">{totals.total_presensi_tercatat}</div>
                        <div className="text-gray-600">Presensi</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">{totals.total_santri}</div>
                        <div className="text-gray-600">Santri</div>
                    </div>
                </div>

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
                                        Jenis Kelamin
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loadingPresensi ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : !dataPresensi || dataPresensi.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    dataPresensi.map((student, index) => (
                                        <tr key={student.presensi_id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{student.nama_santri}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${student.jenis_kelamin === "l" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                                                        }`}
                                                >
                                                    {student.jenis_kelamin === "l" ? "Laki-laki" : "Perempuan"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nama_sholat}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.tanggal}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.waktu_presensi}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${student.status === "Hadir"
                                                        ? "bg-green-100 text-green-800"
                                                        : student.status === "Terlambat"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${student.metode === "Kartu" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {student.metode}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    },
)

AttendanceList.displayName = "AttendanceList"

const Scan = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [studentData, setStudentData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [nfcSupported, setNfcSupported] = useState(false)
    const [status, setStatus] = useState("Tempelkan kartu NFC...")
    const [statusResponse, setStatusResponse] = useState("")
    const [inputMode, setInputMode] = useState("reader")
    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [santriData, setSantriData] = useState("")

    useEffect(() => {
        checkNFCSupport()
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
        const savedView = sessionStorage.getItem("inputMode");
        if (savedView) {
            setInputMode(savedView);
        }
    }, []);

    // Simpan state ke sessionStorage setiap kali inputMode berubah
    const handleSetView = (view) => {
        setInputMode(view);
        sessionStorage.setItem("inputMode", view);
    };

    const playNotificationSound = (success) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            if (success) {
                // Success sound: two ascending tones
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.15)
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
                oscillator.start(audioContext.currentTime)
                oscillator.stop(audioContext.currentTime + 0.3)
            } else {
                // Error sound: two descending tones
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.3)
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
                oscillator.start(audioContext.currentTime)
                oscillator.stop(audioContext.currentTime + 0.5)
            }
        } catch (error) {
            console.log("🔊 Audio notification error:", error)
        }
    }

    const startNFCScanning = async () => {
        if (!nfcSupported) return

        try {
            const ndef = new window.NDEFReader()
            await ndef.scan()
            setIsScanning(true)
            setStatus("Silakan tempelkan kartu NFC...")
            setError("")

            ndef.addEventListener("reading", async ({ serialNumber }) => {
                console.log("UID Kartu (Hex):", serialNumber)

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
                searchStudent(uidDecimal)
            })

            ndef.addEventListener("readingerror", () => {
                setError("Error membaca NFC tag")
                setIsScanning(false)
            })
        } catch (error) {
            console.error("Gagal memulai NFC:", error)
            setError("Gagal memulai NFC: " + error.message)
            setIsScanning(false)
        }
    }

    const searchStudent = async (uid_kartu) => {
        setLoading(true)
        setError("")
        setStudentData(null)

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}presensi/cari-santri`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uid_kartu: uid_kartu, // Use decimal UID
                }),
            })

            console.log("URL ", `${API_BASE_URL}presensi/cari-santri`)

            const data = await response.json()

            if (!response.ok || data.success == false || data.data.status == false) {
                setStatusResponse(data.status || "")
                throw new Error(data.message || "Santri tidak ditemukan")
            }

            setStudentData(data.data)
            console.log(data)

            setStatus(`Data santri ditemukan: ${data.data.nama_santri}`)
        } catch (error) {
            setError("Error: " + error.message)
            setStatus("Gagal mencari data santri")
        } finally {
            setLoading(false)
        }
    }

    const recordAttendance = async () => {
        if (!studentData) return

        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const endpoint = inputMode === "manual" ? `${API_BASE_URL}presensi/manual` : `${API_BASE_URL}presensi/scan`

            const body =
                inputMode === "manual"
                    ? { santri_id: studentData.id } // gunakan santri_id untuk manual
                    : { uid_kartu: studentData.uid_kartu }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })
            const result = await response.json()

            if (!response.ok || result.success === false) {
                setStatusResponse(result.status || "")
                throw new Error(result.message || "Gagal menyimpan presensi")
            }

            setSuccess(`Presensi sukses: ${result.message || "Berhasil"}`)
            setStatus("Presensi berhasil disimpan!")

            // Reset after 3 seconds
            setTimeout(() => {
                setStudentData(null)
                setSuccess("")
                setStatus(inputMode === "nfc" ? "Tempelkan kartu NFC..." : "Masukkan NIS santri...")
                if (inputMode === "nfc") {
                    startNFCScanning() // Continue scanning
                }
            }, 3000)
        } catch (error) {
            setError("Error: " + error.message)
            setStatus("Gagal menyimpan presensi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Data Santri", santriData)
        setStudentData(santriData)
    }, [santriData])

    const resetScan = () => {
        setStudentData(null)
        setError("")
        setSuccess("")

        switch (inputMode) {
            case "manual":
                setStatus("Pilih santri...")
                break
            case "nfc":
                setStatus("Tempelkan kartu NFC...")
                startNFCScanning()
                break
            case "reader":
                setStatus("Letakkan kartu pada reader...")
                break
            default:
                setStatus("Pilih mode input...")
        }
    }

    const toggleInputMode = (mode) => {
        handleSetView(mode)
        setStudentData(null)
        setError("")
        setSuccess("")
        setIsScanning(false)

        switch (mode) {
            case "manual":
                setStatus("Masukkan NIS santri...")
                break
            case "nfc":
                setStatus("Tempelkan kartu NFC...")
                break
            case "reader":
                setStatus("Letakkan kartu pada reader...")
                break
        }
    }

    const inputRef = useRef(null)
    const [nis, setNis] = useState("")

    useEffect(() => {
        // Tangkap semua input dari reader
        const handleKeyPress = (e) => {
            // Biasanya reader mengirim angka + Enter
            if (e.key === "Enter") {
                e.preventDefault()
                submitForm(nis)
            } else if (/^[0-9]$/.test(e.key)) {
                // Tambahkan angka ke state
                setNis((prev) => prev + e.key)
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nis])

    const submitForm = (nisValue) => {
        console.log("Submit NIS:", nisValue)
        searchStudent(nisValue)
        setNis("") // reset
    }

    return (
        <div className="min-h-screen p-3 sm:p-4">
            <div className="max-w-sm mx-auto sm:max-w-md">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg">
                        {inputMode === "nfc" && <FiWifi className="text-2xl sm:text-3xl text-blue-600" />}
                        {inputMode === "reader" && <FiHardDrive className="text-2xl sm:text-3xl text-blue-600" />}
                        {inputMode === "manual" && <FiEdit3 className="text-2xl sm:text-3xl text-blue-600" />}
                    </div>

                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {inputMode === "nfc" && "Scan Kartu NFC"}
                        {inputMode === "reader" && "Gunakan Card Reader"}
                        {inputMode === "manual" && "Input Manual"}
                    </h1>

                    <p className="text-sm sm:text-base text-gray-600">{status}</p>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-lg mb-4 sm:mb-6">
                    <button
                        onClick={() => inputMode !== "nfc" && toggleInputMode("nfc")}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "nfc" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <FiCreditCard className="mr-2" />
                        NFC
                    </button>
                    <button
                        onClick={() => inputMode !== "reader" && toggleInputMode("reader")}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "reader" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <FiHardDrive className="mr-2" />
                        Reader
                    </button>
                    <button
                        onClick={() => inputMode !== "manual" && toggleInputMode("manual")}
                        className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "manual" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <FiEdit3 className="mr-2" />
                        Manual
                    </button>
                </div>

                {/* NFC Status or Manual Input */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
                    {inputMode === "nfc" ? (
                        <div className="text-center">
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
                    ) : inputMode === "manual" ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => setShowSelectSantri(true)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 px-4 rounded-lg font-medium text-base flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <FiRefreshCw className="animate-spin mr-2" />
                                        Memuat Santri...
                                    </>
                                ) : (
                                    <>
                                        <FiUser className="mr-2" />
                                        Pilih Santri
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="relative mb-6">
                                {/* Card Reader Visual */}
                                <div className="mx-auto w-32 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg relative overflow-hidden">
                                    {/* Card Slot */}
                                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
                                    {/* LED Indicator */}
                                    <div
                                        className={`absolute top-4 right-3 w-2 h-2 rounded-full ${nis ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                                    ></div>
                                    {/* Reader Brand */}
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                                        READER
                                    </div>
                                    {/* Scanning Animation */}
                                    {nis && <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>}
                                </div>

                                {/* Status Icon */}
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    {nis ? (
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
                                    {nis ? "Kartu Terdeteksi!" : "Siap Membaca Kartu"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {nis ? "Data kartu berhasil dibaca" : "Letakkan kartu pada card reader"}
                                </p>
                            </div>

                            {/* NIS Display */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 hidden">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Induk Santri (NIS)</label>
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={nis}
                                        placeholder="Menunggu input dari card reader..."
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-center text-lg font-mono tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        readOnly
                                    />
                                    {nis && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <FiCheck className="text-green-500 text-xl" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-4 sm:mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FiX onClick={() => setError("")} className="text-red-400 text-lg sm:text-xl mt-0.5" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{statusResponse || "Data Tidak Ditemukan"}</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 mb-4 sm:mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FiCheck className="text-green-400 text-lg sm:text-xl mt-0.5" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Presensi Berhasil</h3>
                                <p className="text-sm text-green-700 mt-1">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Data Form - Only shows when data is found */}
                {studentData && (
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
                        <div className="text-center mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-gray-200 ring-4 ring-green-100">
                                {studentData.foto_profil ? (
                                    <img
                                        src={studentData.foto_profil || "/placeholder.svg"}
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
                                Data Ditemukan
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Santri</label>
                                <input
                                    type="text"
                                    value={studentData.nama_santri || studentData.label || ""}
                                    readOnly
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NIS</label>
                                <input
                                    type="text"
                                    value={studentData.nis || ""}
                                    readOnly
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                />
                            </div>

                            {inputMode !== "manual" && (
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">UID Kartu</label>
                                    <input
                                        type="text"
                                        value={studentData.uid_kartu || ""}
                                        readOnly
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={recordAttendance}
                                disabled={loading}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 px-4 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <FiRefreshCw className="animate-spin mr-2" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="mr-2" />
                                        OK - Simpan Presensi
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
                {!isScanning && nfcSupported && !studentData && inputMode === "nfc" && (
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
                    onSantriSelected={(santri) => setSantriData(santri)}
                />
            </div>
        </div>
    )
}

export default PresensiSholat
