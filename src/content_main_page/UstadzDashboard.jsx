"use client"

import { useState, useEffect } from "react"
import { FiWifi, FiUser, FiCheck, FiX, FiRefreshCw, FiAlertCircle, FiCheckCircle } from "react-icons/fi"
import { API_BASE_URL } from "../hooks/config"
import { getCookie } from "../utils/cookieUtils"
import { NDEFReader } from "@react-native-nfc-reader/react-native-nfc-reader"

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [nfcSupported, setNfcSupported] = useState(false)
  const [status, setStatus] = useState("Siap untuk scan")

  useEffect(() => {
    checkNFCSupport()
  }, [])

  useEffect(() => {
    if (nfcSupported) {
      startNFCScanning()
    }
  }, [nfcSupported])

  const checkNFCSupport = () => {
    if ("NDEFReader" in window) {
      setNfcSupported(true)
    } else {
      setError("Browser tidak mendukung Web NFC. Gunakan Chrome Android 89+")
      setNfcSupported(false)
    }
  }

  const startNFCScanning = async () => {
    if (!nfcSupported) return

    try {
      const ndef = new NDEFReader()
      await ndef.scan()
      setIsScanning(true)
      setStatus("Tempelkan kartu NFC pada perangkat")
      setError("")
      setSuccess("")

      ndef.addEventListener("reading", async ({ serialNumber }) => {
        console.log("UID Kartu (Hex):", serialNumber)

        let uidDecimal = null
        try {
          const bytes = serialNumber.split(":")
          const reversed = bytes.reverse().join("")
          uidDecimal = BigInt("0x" + reversed).toString(10)
          uidDecimal = uidDecimal.padStart(10, "0")
          console.log("UID Kartu (Decimal):", uidDecimal)
        } catch (e) {
          console.error("Gagal konversi UID ke desimal:", e)
          uidDecimal = serialNumber
        }

        setIsScanning(false)
        searchStudent(uidDecimal)
      })

      ndef.addEventListener("readingerror", () => {
        setError("Gagal membaca kartu NFC")
        setIsScanning(false)
      })
    } catch (error) {
      console.error("Gagal memulai NFC:", error)
      setError("Tidak dapat memulai scanner NFC")
      setIsScanning(false)
    }
  }

  const searchStudent = async (uid_kartu) => {
    setLoading(true)
    setError("")
    setStudentData(null)
    setStatus("Mencari data santri...")

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

      if (!response.ok) {
        throw new Error("Data santri tidak ditemukan")
      }

      const data = await response.json()
      setStudentData(data.data)
      setStatus("Data santri berhasil ditemukan")
    } catch (error) {
      setError("Data santri tidak ditemukan dalam sistem")
      setStatus("Siap untuk scan")
      setTimeout(() => {
        setError("")
        startNFCScanning()
      }, 3000)
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
          uid_kartu: studentData.uid_kartu,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan presensi")
      }

      const result = await response.json()
      setSuccess("Presensi berhasil disimpan")
      setStatus("Presensi tersimpan")

      setTimeout(() => {
        setStudentData(null)
        setSuccess("")
        setStatus("Siap untuk scan")
        startNFCScanning()
      }, 2500)
    } catch (error) {
      setError("Gagal menyimpan data presensi")
    } finally {
      setLoading(false)
    }
  }

  const resetScan = () => {
    setStudentData(null)
    setError("")
    setSuccess("")
    setStatus("Siap untuk scan")
    startNFCScanning()
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-white rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm border">
            <FiWifi className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Presensi NFC</h1>
          <p className="text-sm text-gray-600">{status}</p>
        </div>

        {/* Scanner Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          {!nfcSupported ? (
            <div className="text-center text-red-600">
              <FiX className="text-3xl mx-auto mb-3" />
              <p className="font-medium">NFC Tidak Tersedia</p>
              <p className="text-xs text-gray-500 mt-1">Gunakan Chrome Android</p>
            </div>
          ) : isScanning ? (
            <div className="text-center text-blue-600">
              <div className="relative">
                <FiWifi className="text-3xl mx-auto mb-3 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
              </div>
              <p className="font-medium">Menunggu Kartu</p>
              <div className="mt-3 w-full bg-blue-50 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center text-orange-600">
              <FiRefreshCw className="text-3xl mx-auto mb-3 animate-spin" />
              <p className="font-medium">Memproses...</p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <FiWifi className="text-3xl mx-auto mb-3" />
              <p className="font-medium">Scanner Siap</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-900 text-sm">Gagal</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900 text-sm">Berhasil</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Student Data Form - Only show when data is found */}
        {studentData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            {/* Student Photo */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {studentData.foto_profil ? (
                  <img
                    src={studentData.foto_profil || "/placeholder.svg"}
                    alt="Foto Santri"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser className="text-2xl text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Nama Santri
                </label>
                <div className="bg-gray-50 rounded-xl px-4 py-3 border">
                  <p className="font-medium text-gray-900">{studentData.nama_santri}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">NIS</label>
                  <div className="bg-gray-50 rounded-xl px-3 py-3 border">
                    <p className="text-sm font-medium text-gray-900">{studentData.nis}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    UID Kartu
                  </label>
                  <div className="bg-gray-50 rounded-xl px-3 py-3 border">
                    <p className="text-sm font-mono text-gray-900">{studentData.uid_kartu}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={recordAttendance}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-4 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Konfirmasi Presensi
                  </>
                )}
              </button>

              <button
                onClick={resetScan}
                disabled={loading}
                className="px-4 py-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>
        )}

        {/* Manual Restart - Only show when not scanning and no student data */}
        {!isScanning && nfcSupported && !studentData && !loading && (
          <div className="text-center">
            <button
              onClick={startNFCScanning}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 px-8 rounded-xl font-medium transition-colors"
            >
              Mulai Scan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Scan
