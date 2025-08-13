// import { useState } from "react";
// import { API_BASE_URL } from "../hooks/config";

// export default function NFCScanner() {
//     const [status, setStatus] = useState("Tempelkan kartu NFC...");
//     const [scanning, setScanning] = useState(false);

//     const startScan = async () => {
//         if (!("NDEFReader" in window)) {
//             alert("Web NFC tidak didukung di browser ini. Gunakan Chrome Android 89+");
//             return;
//         }

//         try {
//             const ndef = new NDEFReader();
//             await ndef.scan();
//             setScanning(true);
//             setStatus("Silakan tempelkan kartu NFC...");

//             ndef.addEventListener("reading", async ({ serialNumber }) => {
//                 console.log("UID Kartu (Hex):", serialNumber);

//                 // --- Konversi serialNumber Hex ke Decimal ---
//                 // serialNumber contoh: "2F:8B:29:2B"
//                 let uidDecimal = null;
//                 try {
//                     // Hapus semua tanda ':'
//                     const bytes = serialNumber.split(":");        // ["2F","8B","29","2B"]
//                     const reversed = bytes.reverse().join("");    // "2B298B2F"
//                     let uidDecimal = BigInt("0x" + reversed).toString(10);

//                     // pad leading zero supaya 10 digit
//                     uidDecimal = uidDecimal.padStart(10, "0"); // konversi ke desimal
//                     alert("UID Kartu (Decimal): " + uidDecimal);
//                 } catch (e) {
//                     alert("Gagal konversi UID ke desimal: " + e);
//                     uidDecimal = serialNumber; // fallback
//                 }

//                 setScanning(false);

//                 // Kirim ke API
//                 try {
//                     const res = await fetch(`${API_BASE_URL}presensi/cari-santri`, {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${localStorage.getItem("token")}`,
//                         },
//                         body: JSON.stringify({
//                             card_id: uidDecimal, // gunakan desimal
//                         }),
//                     });

//                     const data = await res.json();
//                     console.log("Presensi sukses:", data);
//                     setStatus(`Presensi sukses: ${data.message || "Berhasil"}`);
//                 } catch (err) {
//                     console.error("Gagal kirim ke API:", err);
//                     setStatus("Gagal mengirim data ke API");
//                 }
//             });


//         } catch (error) {
//             console.error("Gagal memulai NFC:", error);
//             setStatus("Gagal memulai NFC: " + error);
//         }
//     };

//     return (
//         <div className="p-4 text-center">
//             <h2 className="text-xl font-bold mb-4">Scan Kartu NFC</h2>
//             <p className="mb-4">{status}</p>
//             <button
//                 onClick={startScan}
//                 disabled={scanning}
//                 className={`px-4 py-2 rounded text-white ${scanning ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//                     }`}
//             >
//                 {scanning ? "Scanning..." : "Mulai Scan NFC"}
//             </button>
//         </div>
//     );
// }


"use client"

import { useState, useEffect } from "react"
import { FiWifi, FiUser, FiCheck, FiX, FiRefreshCw } from "react-icons/fi"
import { API_BASE_URL } from "../hooks/config"
import { getCookie } from "../utils/cookieUtils"

const Scan = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [studentData, setStudentData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [nfcSupported, setNfcSupported] = useState(false)
    const [status, setStatus] = useState("Tempelkan kartu NFC...")

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
            const token = sessionStorage.getItem("token") || getCookie("token");
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

            if (!response.ok) {
                throw new Error("Santri tidak ditemukan")
            }

            const data = await response.json()
            setStudentData(data)
            setStatus(`Data santri ditemukan: ${data.nama_santri}`)
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
            const response = await fetch(`${API_BASE_URL}presensi/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    uid_santri: studentData.uid_kartu, // Using uid_kartu as uid_santri based on response
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
                setStatus("Tempelkan kartu NFC...")
                startNFCScanning() // Continue scanning
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
        setStatus("Tempelkan kartu NFC...")
        startNFCScanning()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <FiWifi className="text-3xl text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Scan Kartu NFC</h1>
                    <p className="text-gray-600">{status}</p>
                </div>

                {/* NFC Status */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="text-center">
                        {!nfcSupported ? (
                            <div className="text-red-500">
                                <FiX className="text-4xl mx-auto mb-2" />
                                <p>NFC tidak didukung</p>
                            </div>
                        ) : isScanning ? (
                            <div className="text-blue-500">
                                <div className="animate-pulse">
                                    <FiWifi className="text-4xl mx-auto mb-2" />
                                </div>
                                <p>Scanning...</p>
                                <div className="mt-4">
                                    <div className="w-full bg-blue-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">
                                <FiWifi className="text-4xl mx-auto mb-2" />
                                <p>Scanner siap</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <FiX className="text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <FiCheck className="text-green-500 mr-2" />
                            <p className="text-green-700">{success}</p>
                        </div>
                    </div>
                )}

                {/* Student Data Form */}
                {studentData && (
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                                {studentData.foto_profil ? (
                                    <img
                                        src={studentData.foto_profil || "/placeholder.svg"}
                                        alt="Foto Profil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiUser className="text-2xl text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Santri</label>
                                <input
                                    type="text"
                                    value={studentData.nama_santri || ""}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                                <input
                                    type="text"
                                    value={studentData.nis || ""}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">UID Kartu</label>
                                <input
                                    type="text"
                                    value={studentData.uid_kartu || ""}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={recordAttendance}
                                disabled={loading}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <FiRefreshCw className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
                                {loading ? "Menyimpan..." : "OK - Simpan Presensi"}
                            </button>

                            <button
                                onClick={resetScan}
                                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>
                )}

                {/* Manual Restart Button */}
                {!isScanning && nfcSupported && !studentData && (
                    <div className="text-center">
                        <button
                            onClick={startNFCScanning}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium"
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
