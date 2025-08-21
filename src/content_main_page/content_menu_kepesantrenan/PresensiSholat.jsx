"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useRef, useState, memo } from "react"
import useFetchPresensi from "../../hooks/hooks_menu_data_pokok/Presensi"
import {
    FaQrcode,
    FaUserCheck,
    FaCalendarAlt,
    FaTimes,
    FaEye,
    FaCheckCircle,
    FaUsers,
    FaClock,
    FaCalendar,
    FaFilter,
    FaTimesCircle,
    FaSync,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate, useLocation } from "react-router-dom"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import blankProfile from "../../assets/blank_profile.png"
import { ModalSelectSantri } from "../../components/ModalSelectSantri"
import useFetchSholat from "../../hooks/hook_menu_kepesantrenan/Sholat"
import useFetchJadwalSholat from "../../hooks/hook_menu_kepesantrenan/JadwalSholat"
import ToggleStatus from "../../components/ToggleStatus"
import { FiCheck, FiCreditCard, FiEdit3, FiHardDrive, FiUser, FiWifi, FiX, FiRefreshCw } from "react-icons/fi"
import { toast } from "sonner"

const PresensiSholat = () => {
    const [filters, setFilters] = useState({
        tanggal: "",
        sholat_id: "",
        jadwal_id: "",
        metode: "",
        status: "",
        jenis_kelamin: "",
        showAll: false,
    })

    useEffect(() => {
        console.log("filters", filters)
    }, [filters])

    const { dataPresensi, loadingPresensi, totalData, fetchData, jadwalSholat, jadwalMendatang, statusPresensi } = useFetchPresensi(filters)

    // Main states - Auto-start in scan mode
    const [currentView, setCurrentView] = useState("scan")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const savedView = sessionStorage.getItem("currentView")
        if (savedView) {
            setCurrentView(savedView)
        }
    }, [])

    // Simpan state ke sessionStorage setiap kali currentView berubah
    const handleSetView = (view) => {
        setCurrentView(view)
        sessionStorage.setItem("currentView", view)
    }

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
        <div className="pl-6 pt-6 mb-8 pb-6">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 mb-6">
                    <div className="space-y-4">
                        {/* Top Section - Title and Prayer Schedule with Status */}
                        <div className="flex flex-col gap-3">
                            {/* Title */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-base sm:text-lg font-semibold text-gray-900">Presensi Sholat</h1>
                                    <p className="text-xs text-gray-500">
                                        {currentTime.toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}{" "}
                                        •{" "}
                                        {currentTime.toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Prayer Schedule and Status Section */}
                            <div className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-lg">
                                {/* Prayer Schedule (Current and Next) */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                                    {/* Current Prayer */}
                                    {jadwalSholat && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{jadwalSholat.nama_sholat}</div>
                                                <div className="text-xs text-gray-500">
                                                    {jadwalSholat.jam_mulai} - {jadwalSholat.jam_selesai}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Next Prayer */}
                                    {jadwalMendatang && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-600">
                                                    Selanjutnya: {jadwalMendatang.nama_sholat}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {jadwalMendatang.jam_mulai} - {jadwalMendatang.jam_selesai}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Presensi */}
                                {statusPresensi && (
                                    <div
                                        className={`flex items-center gap-3 p-2 rounded-lg border-l-4 sm:border-l-0 sm:border-2 border-dashed
                    ${statusPresensi === "waktunya_presensi"
                                                ? "border-green-400 bg-green-50"
                                                : statusPresensi === "belum_waktunya"
                                                    ? "border-yellow-400 bg-yellow-50"
                                                    : "border-red-400 bg-red-50"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${statusPresensi === "waktunya_presensi"
                                                ? "bg-green-100 text-green-600"
                                                : statusPresensi === "belum_waktunya"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {statusPresensi === "waktunya_presensi" ? (
                                                <FaCheckCircle className="w-4 h-4" />
                                            ) : statusPresensi === "belum_waktunya" ? (
                                                <FaClock className="w-4 h-4" />
                                            ) : (
                                                <FaTimesCircle className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <div
                                                className={`text-sm font-semibold ${statusPresensi === "waktunya_presensi"
                                                    ? "text-green-700"
                                                    : statusPresensi === "belum_waktunya"
                                                        ? "text-yellow-700"
                                                        : "text-red-700"
                                                    }`}
                                            >
                                                {statusPresensi === "waktunya_presensi"
                                                    ? "Waktu Presensi"
                                                    : statusPresensi === "belum_waktunya"
                                                        ? "Belum Waktunya Presensi"
                                                        : "Sudah Lewat"}
                                            </div>
                                            <div className="text-xs text-gray-500">Status Presensi</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Section - Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSetView("scan")}
                                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all flex-1 ${currentView === "scan"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                                    }`}
                            >
                                <FaQrcode className="w-5 h-5" />
                                <span>Scan</span>
                            </button>
                            <button
                                onClick={() => handleSetView("list")}
                                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all flex-1 ${currentView === "list"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                                    }`}
                            >
                                <FaUserCheck className="w-5 h-5" />
                                <span>Lihat Daftar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* {totalData && currentView === "list" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-green-600">{totalData.total_hadir}</div>
                            <div className="text-sm text-gray-600">Hadir</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-red-600">{totalData.total_tidak_hadir}</div>
                            <div className="text-sm text-gray-600">Tidak Hadir</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-blue-600">{totalData.total_presensi_tercatat}</div>
                            <div className="text-sm text-gray-600">Tercatat</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-2xl font-bold text-gray-600">{totalData.total_santri}</div>
                            <div className="text-sm text-gray-600">Total Santri</div>
                        </div>
                    </div>
                )} */}

                {currentView === "scan" && <Scan refetch={fetchData} />}
                {currentView === "list" && (
                    <AttendanceList
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filters={filters}
                        setFilters={setFilters}
                        loadingPresensi={loadingPresensi}
                        dataPresensi={dataPresensi}
                        totals={totalData}
                        jadwalSholat={jadwalSholat}
                        fetchData={fetchData}
                    />
                )}
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

const AttendanceList = memo(({ setSearchTerm, filters, setFilters, loadingPresensi, dataPresensi = [], totals, fetchData }) => {
    console.log("attendance", dataPresensi)
    const [showFilters, setShowFilters] = useState(false)
    const { sholat } = useFetchSholat()
    const { jadwalSholat } = useFetchJadwalSholat()

    // Mock data for dropdowns - replace with actual API calls
    const sholatOptions = sholat.map((item) => ({
        value: item.id,
        label: item.nama_sholat,
    }))

    const jadwalOptions = jadwalSholat.map((item) => ({
        value: item.id,
        label: `${item.sholat.nama_sholat} (${item.jam_mulai} s.d. ${item.jam_selesai})`,
    }))

    const handleAdvancedFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const resetFilters = () => {
        setFilters({
            tanggal: "",
            sholat_id: "",
            jadwal_id: "",
            metode: "",
            status: "all",
            jenis_kelamin: "",
            showAll: false,
        })
        setSearchTerm("")
        // setFilterStatus("all")
    }

    const handleRefresh = () => {
        fetchData(true)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col space-y-4">
                    {/* Filter Toggle Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Filter Data Presensi
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {/* Button Refresh */}


                            {/* Button Filter */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${showFilters
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaFilter className="w-4 h-4" />
                                <span>{showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}</span>
                            </button>
                            <button
                                onClick={handleRefresh}
                                disabled={loadingPresensi}
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 bg-green-600 text-white transition-all ${loadingPresensi
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-700"
                                    }`}
                            >
                                <FaSync className={`w-4 h-4 ${loadingPresensi ? "animate-spin" : ""}`} />
                                <span>{loadingPresensi ? "Merefresh..." : "Refresh"}</span>
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Sholat Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaClock className="w-4 h-4 mr-2 text-green-500" />
                                        Jenis Sholat
                                    </label>
                                    <select
                                        value={filters.sholat_id}
                                        onChange={(e) => handleAdvancedFilterChange("sholat_id", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Semua Sholat</option>
                                        {sholatOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Jadwal Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaCalendarAlt className="w-4 h-4 mr-2 text-purple-500" />
                                        Jadwal
                                    </label>
                                    <select
                                        value={filters.jadwal_id}
                                        onChange={(e) => handleAdvancedFilterChange("jadwal_id", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Semua Jadwal</option>
                                        {jadwalOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Method Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FiCreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                                        Metode
                                    </label>
                                    <select
                                        value={filters.metode}
                                        onChange={(e) => handleAdvancedFilterChange("metode", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Semua Metode</option>
                                        <option value="kartu">Kartu</option>
                                        <option value="manual">Manual</option>
                                        {/* <option value="NFC">NFC</option> */}
                                    </select>
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaUsers className="w-4 h-4 mr-2 text-pink-500" />
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={filters.jenis_kelamin}
                                        onChange={(e) => handleAdvancedFilterChange("jenis_kelamin", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Semua</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>

                                {/* Status Filter (Advanced) */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaCheckCircle className="w-4 h-4 mr-2 text-orange-500" />
                                        Status Detail
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleAdvancedFilterChange("status", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="Hadir">Hadir</option>
                                        <option value="Terlambat">Terlambat</option>
                                        <option value="Alpha">Alpha</option>
                                        <option value="Izin">Izin</option>
                                        <option value="Sakit">Sakit</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FaEye className="w-4 h-4 mr-2 text-gray-500" />
                                        Tampilan
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <ToggleStatus
                                            active={filters.showAll}
                                            onClick={() => handleAdvancedFilterChange("showAll", !filters.showAll)}
                                        />
                                        <span className="text-sm text-gray-600">Tampilkan Semua</span>
                                    </div>
                                </div>

                                {/* Empty space for alignment */}
                                <div></div>
                            </div>

                            {/* Filter Actions */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                    Filter aktif: {Object.values(filters).filter((v) => v && v !== "all" && v !== false).length} dari{" "}
                                    {Object.keys(filters).length}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{totals.total_hadir}</div>
                    <div className="text-sm sm:text-base text-gray-600">Hadir</div>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{totals.total_tidak_hadir}</div>
                    <div className="text-sm sm:text-base text-gray-600">Tidak Hadir</div>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{totals.total_presensi_tercatat}</div>
                    <div className="text-sm sm:text-base text-gray-600">Presensi</div>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-600">{totals.total_santri}</div>
                    <div className="text-sm sm:text-base text-gray-600">Santri</div>
                </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Santri
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIS
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jenis Kelamin
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Sholat
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu Presensi
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
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
})

AttendanceList.displayName = "AttendanceList"

const Scan = ({ refetch }) => {
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

    const location = useLocation()

    useEffect(() => {
        checkNFCSupport()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (inputMode === "nfc") {
            if (!nfcSupported) {
                toast.error("Error", {
                    description: "Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+"
                })

                // setStatusResponse("Error")
                // setError("Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+")
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

    // Simpan state ke sessionStorage setiap kali inputMode berubah
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
        if (!nfcSupported && location.pathname !== "/belanja/transaksi") return

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
                    toast.success("Success", {
                        description: "Kartu berhasil discan"
                    })
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
                toast.error("Error", {
                    description: "Error membaca NFC tag"
                })
                // setError("Error membaca NFC tag")
                setIsScanning(false)
            })
        } catch (error) {
            console.error("Gagal memulai NFC:", error)
            toast.error("Error", {
                description: "Gagal memulai NFC: " + error.message
            })
            // setError("Gagal memulai NFC: " + error.message)
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
            toast.success("Success", {
                description: `Data santri ditemukan: ${data.data.nama_santri}`
            })
        } catch (error) {
            toast.error("Error", {
                description: "Gagal mencari data santri"
            })
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

            if (!response.ok || result.success === false || !("data" in result)) {
                setStatusResponse(result.status || "")
                throw new Error(result.message || "Gagal menyimpan presensi")
            }

            toast.success("Success", {
                description: `Presensi sukses: ${result.message || "Berhasil"}`
            })
            // setSuccess(`Presensi sukses: ${result.message || "Berhasil"}`)
            // setStatus("Presensi berhasil disimpan!")

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
            toast.error("Error", {
                description: "Gagal menyimpan presensi: " + error.message
            })
            // setError("Error: " + error.message)
            // setStatus("Gagal menyimpan presensi")
        } finally {
            refetch(true)
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Data Santri", santriData)
        setStudentData(santriData)
    }, [santriData])

    const resetScan = () => {
        setStudentData(null)
        setSantriData(null)
        setNis("")
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

    const inputRef = useRef(null)
    const [nis, setNis] = useState("")

    useEffect(() => {
        // hanya jalan di halaman presensi
        if (location.pathname !== "/sholat/presensi-sholat") return;

        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                toast.success("Success", {
                    description: "Kartu berhasil discan"
                })
                console.log("Pathname Presensi:", location.pathname);
                console.log("Submit NIS:", nis);

                submitForm(nis);
            } else if (/^[0-9]$/.test(e.key)) {
                setNis((prev) => prev + e.key);
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => window.removeEventListener("keydown", handleKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nis, location.pathname]); // tambahkan location.pathname supaya cleanup aman


    const submitForm = (nisValue) => {
        console.log("Submit NIS:", nisValue)
        searchStudent(nisValue)
        setNis("") // reset
    }

    useEffect(() => {
        resetScan()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMode])

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
