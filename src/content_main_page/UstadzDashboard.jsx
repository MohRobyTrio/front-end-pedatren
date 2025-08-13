"use client"

import { useState, useEffect } from "react"
import { FiWifi, FiUser, FiCheck, FiX, FiRefreshCw, FiEdit3, FiCreditCard } from "react-icons/fi"
import { API_BASE_URL } from "../hooks/config"
import { getCookie } from "../utils/cookieUtils"
// import { NDEFReader } from "@react-native-nfc-reader/react-native-nfc-reader"

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [nfcSupported, setNfcSupported] = useState(false)
  const [status, setStatus] = useState("Tempelkan kartu NFC...")
  const [inputMode, setInputMode] = useState("nfc") // "nfc" or "manual"
  const [manualNIS, setManualNIS] = useState("")

  useEffect(() => {
    checkNFCSupport()
  }, [])

  useEffect(() => {
    if (nfcSupported && inputMode === "nfc") {
      startNFCScanning()
    }
  }, [nfcSupported, inputMode])

  const checkNFCSupport = () => {
    if ("NDEFReader" in window) {
      setNfcSupported(true)
    } else {
      setError("Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+")
      setNfcSupported(false)
    }
  }

  const startNFCScanning = async () => {
    if (!nfcSupported) return

    try {
      const ndef = new NDEFReader()
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
          console.log("UID Kartu (Decimal):", uidDecimal)
        } catch (e) {
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

      if (!response.ok) {
        throw new Error("Santri tidak ditemukan")
      }

      const data = await response.json()
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

  const searchStudentByNIS = async () => {
    if (!manualNIS.trim()) {
      setError("Masukkan NIS terlebih dahulu")
      return
    }

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
          nis: manualNIS.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Santri tidak ditemukan")
      }

      const data = await response.json()
      setStudentData(data.data)
      setStatus(`Data santri ditemukan: ${data.data.nama_santri}`)
    } catch (error) {
      setError("Santri dengan NIS tersebut tidak ditemukan")
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
      const response = await fetch(`${API_BASE_URL}presensi/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid_kartu: studentData.uid_kartu, // Using uid_kartu as uid_santri based on response
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan presensi")
      }

      const result = await response.json()
      setSuccess(`Presensi sukses: ${result.message || "Berhasil"}`)
      setStatus("Presensi berhasil disimpan!")

      // Reset after 3 seconds
      setTimeout(() => {
        setStudentData(null)
        setSuccess("")
        setManualNIS("")
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

  const resetScan = () => {
    setStudentData(null)
    setError("")
    setSuccess("")
    setManualNIS("")
    setStatus(inputMode === "nfc" ? "Tempelkan kartu NFC..." : "Masukkan NIS santri...")
    if (inputMode === "nfc") {
      startNFCScanning()
    }
  }

  const toggleInputMode = () => {
    const newMode = inputMode === "nfc" ? "manual" : "nfc"
    setInputMode(newMode)
    setStudentData(null)
    setError("")
    setSuccess("")
    setManualNIS("")
    setIsScanning(false)
    setStatus(newMode === "nfc" ? "Tempelkan kartu NFC..." : "Masukkan NIS santri...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="max-w-sm mx-auto sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg">
            {inputMode === "nfc" ? (
              <FiWifi className="text-2xl sm:text-3xl text-blue-600" />
            ) : (
              <FiEdit3 className="text-2xl sm:text-3xl text-blue-600" />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {inputMode === "nfc" ? "Scan Kartu NFC" : "Input Manual"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{status}</p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-lg mb-4 sm:mb-6">
          <button
            onClick={() => inputMode !== "nfc" && toggleInputMode()}
            className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${
              inputMode === "nfc" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiCreditCard className="mr-2" />
            Kartu NFC
          </button>
          <button
            onClick={() => inputMode !== "manual" && toggleInputMode()}
            className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${
              inputMode === "manual" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiEdit3 className="mr-2" />
            Input NIS
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
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Masukkan NIS Santri</label>
                <input
                  type="text"
                  value={manualNIS}
                  onChange={(e) => setManualNIS(e.target.value)}
                  placeholder="Contoh: 12345678"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && searchStudentByNIS()}
                />
              </div>
              <button
                onClick={searchStudentByNIS}
                disabled={loading || !manualNIS.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 px-4 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <FiUser className="mr-2" />
                    Cari Santri
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiX className="text-red-400 text-lg sm:text-xl mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Data Tidak Ditemukan</h3>
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
                  value={studentData.nama_santri || ""}
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

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">UID Kartu</label>
                <input
                  type="text"
                  value={studentData.uid_kartu || ""}
                  readOnly
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                />
              </div>
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
      </div>
    </div>
  )
}

export default Scan
