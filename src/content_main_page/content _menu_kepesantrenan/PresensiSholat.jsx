"use client"
import { OrbitProgress } from "react-loading-indicators"
import { useEffect, useMemo, useRef, useState } from "react"
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
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCreditCard,
  FaStop,
  FaSync,
  FaUser,
  FaMobile,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"
import { getCookie } from "../../utils/cookieUtils"
// import { NDEFReader } from "ndef-reader"

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

  // Main states
  const [currentView, setCurrentView] = useState("scan") // Auto-start in scan mode
  const [scanMode, setScanMode] = useState("nfc")
  const [attendanceData, setAttendanceData] = useState([])
  const [todayAttendance, setTodayAttendance] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isScanning, setIsScanning] = useState(true) // Auto-start scanning
  const [scanResult, setScanResult] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isProcessing, setIsProcessing] = useState(false)

  // NFC states
  const [nfcSupported, setNfcSupported] = useState(false)
  const [nfcReaderActive, setNfcReaderActive] = useState(false)
  const [nfcStatus, setNfcStatus] = useState("checking")

  // Student data states
  const [studentData, setStudentData] = useState(null)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Refs
  const abortControllerRef = useRef(null)

  useEffect(() => {
    initializeNFC()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      clearInterval(timer)
      cleanupNFC()
    }
  }, [])

  const initializeNFC = async () => {
    if ("NDEFReader" in window) {
      setNfcSupported(true)
      setNfcStatus("supported")
      await startNFCScanning() // Auto-start NFC scanning
    } else {
      setNfcSupported(false)
      setNfcStatus("not_supported")
      console.log("Web NFC API not supported")
    }
  }

  const cleanupNFC = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const startNFCScanning = async () => {
    if (!nfcSupported) return

    try {
      setNfcStatus("starting")
      setIsScanning(true)

      // Create new abort controller
      abortControllerRef.current = new AbortController()

      const ndef = new NDEFReader()

      // Start scanning
      await ndef.scan({ signal: abortControllerRef.current.signal })

      setNfcReaderActive(true)
      setNfcStatus("scanning")

      // Listen for NFC tags
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log("NFC tag detected:", { message, serialNumber })
        handleNFCRead(serialNumber)
      })

      ndef.addEventListener("readingerror", (error) => {
        console.error("NFC reading error:", error)
        setNfcStatus("error")
        setScanResult({
          success: false,
          message: "Error membaca NFC tag: " + error.message,
        })
      })
    } catch (error) {
      console.error("Failed to start NFC scanning:", error)
      setNfcStatus("error")
      setIsScanning(false)
      setScanResult({
        success: false,
        message: "Gagal memulai NFC scanning: " + error.message,
      })
    }
  }

  const stopNFCScanning = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setNfcReaderActive(false)
    setIsScanning(false)
    setNfcStatus("stopped")
  }

  const handleNFCRead = async (serialNumber) => {
    if (isProcessing) return

    console.log("Processing NFC tag:", serialNumber)

    // Convert serial number to uid_kartu format
    const uid_kartu = serialNumber || ""

    await searchStudent(uid_kartu)
  }

  const searchStudent = async (uid_kartu) => {
    if (!uid_kartu.trim()) return

    setIsSearching(true)
    setIsProcessing(true)

    try {
      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch(
        `http://localhost:8000/api/presensi/cari-santri?uid_kartu=${encodeURIComponent(uid_kartu)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Student search result:", data)

      if (data && data.nama_santri) {
        setStudentData({
          nama_santri: data.nama_santri,
          nis: data.nis,
          uid_kartu: data.uid_kartu,
          foto_profil: data.foto_profil,
          uid_santri: data.uid_santri || data.id, // Assuming uid_santri might be in id field
        })
        setShowStudentForm(true)
        setScanResult({
          success: true,
          message: "Santri ditemukan!",
        })
        playNotificationSound(true)
      } else {
        setScanResult({
          success: false,
          message: `Santri tidak ditemukan dengan UID: ${uid_kartu}`,
        })
        playNotificationSound(false)
      }
    } catch (error) {
      console.error("Error searching student:", error)
      setScanResult({
        success: false,
        message: "Gagal mencari data santri: " + error.message,
      })
      playNotificationSound(false)
    } finally {
      setIsSearching(false)
      setIsProcessing(false)
    }
  }

  const handleConfirmAttendance = async () => {
    if (!studentData || !studentData.uid_santri) return

    setIsSaving(true)

    try {
      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch("http://localhost:8000/api/presensi/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          uid_santri: studentData.uid_santri,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Attendance save result:", result)

      // Show success message
      setScanResult({
        success: true,
        message: "Presensi berhasil disimpan!",
      })

      // Reset form
      setShowStudentForm(false)
      setStudentData(null)

      playNotificationSound(true)

      // Auto-restart scanning after 2 seconds
      setTimeout(() => {
        setScanResult(null)
        if (nfcSupported && !nfcReaderActive) {
          startNFCScanning()
        }
      }, 2000)
    } catch (error) {
      console.error("Error saving attendance:", error)
      setScanResult({
        success: false,
        message: "Gagal menyimpan presensi: " + error.message,
      })
      playNotificationSound(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelForm = () => {
    setShowStudentForm(false)
    setStudentData(null)
    setScanResult(null)

    // Restart scanning
    if (nfcSupported && !nfcReaderActive) {
      startNFCScanning()
    }
  }

  const playNotificationSound = (success) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (success) {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.15)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      }
    } catch (error) {
      console.log("Audio notification error:", error)
    }
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
      {/* NFC Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Status NFC Scanner</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {nfcSupported ? (
                <FaMobile className="w-4 h-4 text-green-500" />
              ) : (
                <FaMobile className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${nfcSupported ? "text-green-600" : "text-red-600"}`}>
                Web NFC {nfcSupported ? "Didukung" : "Tidak Didukung"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {nfcReaderActive ? (
                <FaCreditCard className="w-4 h-4 text-green-500" />
              ) : (
                <FaCreditCard className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${nfcReaderActive ? "text-green-600" : "text-red-600"}`}>
                NFC Scanner {nfcReaderActive ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>
        </div>

        {!nfcSupported && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                Browser tidak mendukung Web NFC API. Gunakan Chrome di Android atau browser yang mendukung NFC.
              </p>
            </div>
          </div>
        )}

        {nfcSupported && !nfcReaderActive && nfcStatus !== "scanning" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800">NFC Scanner tidak aktif</p>
              </div>
              <button
                onClick={startNFCScanning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isScanning}
              >
                {isScanning ? "Memulai..." : "Mulai Scan"}
              </button>
            </div>
          </div>
        )}

        {nfcStatus === "scanning" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse">
                  <FaSync className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-green-800">NFC Scanner aktif - siap membaca kartu</p>
              </div>
              <button
                onClick={stopNFCScanning}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaStop className="w-4 h-4 mr-2" />
                Stop
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scan Area */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
            {isSearching ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-600 font-medium">Mencari santri...</p>
              </div>
            ) : nfcReaderActive ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <FaMobile className="w-20 h-20 text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Tempelkan kartu NFC ke perangkat</p>
                <p className="text-sm text-gray-500">Scanner aktif dan siap membaca</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <FaMobile className="w-20 h-20 text-gray-400" />
                <p className="text-gray-600 font-medium">NFC Scanner tidak aktif</p>
                <p className="text-sm text-gray-500">Klik tombol untuk memulai scanning</p>
              </div>
            )}

            {isSearching && <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>}
          </div>
        </div>
      </div>

      {/* Student Form */}
      {showStudentForm && studentData && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Presensi</h3>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {studentData.foto_profil ? (
                <img
                  src={studentData.foto_profil || "/placeholder.svg"}
                  alt={studentData.nama_santri}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">{studentData.nama_santri}</h4>
              <p className="text-gray-600">NIS: {studentData.nis}</p>
              <p className="text-gray-600">UID Kartu: {studentData.uid_kartu}</p>
              <p className="text-sm text-gray-500">Waktu: {currentTime.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleConfirmAttendance}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-4 h-4" />
                  <span>OK - Konfirmasi</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancelForm}
              disabled={isSaving}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Scan Result */}
      {scanResult && !showStudentForm && (
        <div
          className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            scanResult.success ? "border-green-500" : "border-red-500"
          }`}
        >
          <div className="flex items-center space-x-4">
            {scanResult.success ? (
              <FaCheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <FaTimesCircle className="w-8 h-8 text-red-500" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${scanResult.success ? "text-green-600" : "text-red-600"}`}>
                {scanResult.success ? "Berhasil" : "Gagal"}
              </h3>
              <p className="text-gray-600">{scanResult.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const AttendanceList = () => (
    <div className="space-y-6">
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Santri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
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
                  <td colSpan="7" className="text-center py-6">
                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                  </td>
                </tr>
              ) : dataPresensi.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                dataPresensi.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.nama_santri}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nama_sholat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.waktu_presensi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.metode}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  if (!hasAccess("presensi_sholat")) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setCurrentView("list")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUserCheck className="w-4 h-4" />
                <span>Daftar</span>
              </button>
              <button
                onClick={() => setCurrentView("scan")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaQrcode className="w-4 h-4" />
                <span>Scan</span>
              </button>
              <button
                onClick={() => setCurrentView("report")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === "report" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaCalendarAlt className="w-4 h-4" />
                <span>Laporan</span>
              </button>
            </div>
          </div>
        </div>

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
