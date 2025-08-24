"use client"
import { useEffect, useRef, useState } from "react"
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
    FiRefreshCw,
    FiUser,
    FiWifi,
    FiX,
} from "react-icons/fi"
import Swal from "sweetalert2"

const Topup = () => {
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

    if (!hasAccess("topup")) {
        return <Navigate to="/forbidden" replace />
    }

    return (
        <div className="">
            <div className="mx-auto">
                <Scan />
            </div>
        </div>
    )
}

const Scan = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [customerData, setCustomerData] = useState(null)
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [success, setSuccess] = useState("")
    const [nfcSupported, setNfcSupported] = useState(false)
    const [inputMode, setInputMode] = useState("reader")
    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [idCard, setIdCard] = useState("")

    const [currentStep, setCurrentStep] = useState(1) // 1: Input data, 2: Scan, 3: PIN, 4: Complete
    const [pin, setPin] = useState("")
    const [nominal, setNominal] = useState("")

    const location = useLocation()

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
                throw new Error(data.data.message || " tidak ditemukan")
            }

            setCustomerData(data.data)
            console.log(data)

        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message,
            });
            setIdCard("")
            setError("Error: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const _recordTransaction = async () => {
        if (!customerData || !pin || !nominal) {
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
            const endpoint = `${API_BASE_URL}saldo/topup`

            const body = {
                jumlah: nominal,
                pin: pin,
                santri_id: customerData.santri_id || customerData.id,
                metode: inputMode === "manual" ? "manual" : "scan",
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

            if (!response.ok || !data.status || data?.data?.status == false) {
                console.log("Error response:", data);

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

                throw new Error(data.message || data.data.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: data.message,
            });
            setIdCard("")
            setSuccess("Topup berhasil disimpan!")
            resetScan()
        } catch (error) {
            setError("Error: " + error.message)
            await Swal.fire({
                icon: "error",
                title: "Topup Gagal",
                text: error.message,
            });
        } finally {
            setLoading(false)
        }
    }

    const resetScan = () => {
        setCustomerData(null)
        setError("")
        setSuccess("")
        setCurrentStep(1)
        setPin("")
        setIdCard("")
        setNominal("")
    }

    const inputRef = useRef(null)

    useEffect(() => {
        // jalankan hanya di halaman /transaksi/saldo
        if (location.pathname !== "/transaksi/saldo/topup") return;

        const handleKeyPress = (e) => {
            if (location.pathname !== "/transaksi/saldo/topup") return;

            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Pathname Topup:", location.pathname);
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
    }, [idCard, location.pathname]);


    const handleSubmit = () => {
        if (!pin || pin.length < 4) {
            setError("PIN harus minimal 4 digit")
            return
        }



        // Proceed with transaction
        _recordTransaction()
    }

    const pinRef = useRef(null);

    useEffect(() => {
        console.log("PIN Ref:", pinRef.current);
        console.log("Customer Data:", customerData);

        // Fokus ke input PIN kalau customerData ada
        if (customerData && pinRef.current) {
            console.log("Fokus ke input PIN");
            setTimeout(() => {
                pinRef.current.focus();
                pinRef.current.select(); // optional, langsung select text
            }, 300);
        }
    }, [customerData]);

    useEffect(() => {
        console.log(customerData);

    }, [customerData])

    useEffect(() => {
        resetScan()
    }, [inputMode])

    return (
        <div className="max-w-2xl mx-auto">
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <FiCreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Topup Saldo</h2>
                    <p className="text-gray-600">Scan kartu untuk memproses transaksi</p>
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
                    <div>
                        {/* tombol pilih/scan  (punya kamu tadi) */}
                        {!customerData && inputMode === "manual" && (
                            <button
                                onClick={() => setShowSelectSantri(true)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium cursor-pointer"
                            >
                                Pilih
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
                                            Data Ditemukan
                                        </div>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama</label>
                                            <input
                                                type="text"
                                                value={customerData.nama_ || customerData.nama_santri || customerData.label || ""}
                                                readOnly
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NIS</label>
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
                                                ref={pinRef}
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                placeholder="Masukkan PIN"
                                                maxLength="6"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nominal</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 sm:top-3">Rp</span>
                                                <input
                                                    type="text"
                                                    value={nominal === "" ? "" : Number(nominal).toLocaleString("id-ID")}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, ""); // hapus semua selain digit

                                                        if (val === "") {
                                                            setNominal("");
                                                            return;
                                                        }

                                                        let num = Number(val);

                                                        // minimal 1
                                                        if (isNaN(num) || num < 1) {
                                                            num = 1;
                                                        }

                                                        setNominal(num);
                                                    }}
                                                    placeholder="0"
                                                    className="w-full pl-9 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !pin || pin.length < 4 || !nominal || !customerData}
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
                                                OK - Simpan
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

export default Topup
