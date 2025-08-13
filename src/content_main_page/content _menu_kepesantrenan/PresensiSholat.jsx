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
    FaIdCard,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaCreditCard,
    FaUsb,
    FaStop,
    FaSync,
} from "react-icons/fa"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"
import { getCookie } from "../../utils/cookieUtils"

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

    const [currentView, setCurrentView] = useState("list")
    const [scanMode, setScanMode] = useState("card")
    const [attendanceData, setAttendanceData] = useState([])
    const [todayAttendance, setTodayAttendance] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [cardInput, setCardInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    // RFID Reader states
    const [rfidReaderConnected, setRfidReaderConnected] = useState(false)
    const [readerStatus, setReaderStatus] = useState("disconnected")
    const [serialSupported, setSerialSupported] = useState(false)
    const [readerPort, setReaderPort] = useState(null)
    const [readerInfo, setReaderInfo] = useState(null)
    const [lastCardRead, setLastCardRead] = useState(null)
    const [readingActive, setReadingActive] = useState(false)

    // Refs
    const inputRef = useRef(null)
    const readerPortRef = useRef(null)
    const readerRef = useRef(null)
    const readTimeoutRef = useRef(null)
    const processTimeoutRef = useRef(null)

    // Mock data untuk demo dengan RFID ID yang sebenarnya
    const mockStudents = [
        {
            id: "001",
            name: "Ahmad Fauzi",
            nis: "2024001",
            class: "7A",
            rfidId: "0722142575",
            cardId: "CARD001",
            status: "hadir",
            time: "07:15",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "002",
            name: "Siti Aminah",
            nis: "2024002",
            class: "7A",
            rfidId: "0004789012",
            cardId: "CARD002",
            status: "hadir",
            time: "07:20",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "003",
            name: "Muhammad Rizki",
            nis: "2024003",
            class: "7B",
            rfidId: "0004345678",
            cardId: "CARD003",
            status: "terlambat",
            time: "07:45",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "004",
            name: "Fatimah Zahra",
            nis: "2024004",
            class: "7B",
            rfidId: "0004901234",
            cardId: "CARD004",
            status: "alpha",
            time: "-",
            photo: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "005",
            name: "Ali Hassan",
            nis: "2024005",
            class: "8A",
            rfidId: "0004567890",
            cardId: "CARD005",
            status: "hadir",
            time: "07:10",
            photo: "/placeholder.svg?height=40&width=40",
        },
    ]

    useEffect(() => {
        initializeRFIDReader()
        setTodayAttendance(mockStudents)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)

        return () => {
            clearInterval(timer)
            cleanupRFIDReader()
        }
    }, [])

    useEffect(() => {
        // Auto focus input when scan mode is card and component mounts
        if (scanMode === "card" && inputRef.current) {
            const timer = setTimeout(() => {
                inputRef.current.focus()
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [scanMode, currentView])

    const initializeRFIDReader = async () => {
        if ("serial" in navigator) {
            setSerialSupported(true)
            try {
                const ports = await navigator.serial.getPorts()
                if (ports.length > 0) {
                    await connectRFIDReader(ports[0])
                }
            } catch (error) {
                console.log("Failed to get existing ports:", error)
            }
        } else {
            console.log("Web Serial API not supported")
        }
    }

    const cleanupRFIDReader = () => {
        if (readTimeoutRef.current) {
            clearTimeout(readTimeoutRef.current)
        }
        if (processTimeoutRef.current) {
            clearTimeout(processTimeoutRef.current)
        }
        if (readerPortRef.current) {
            try {
                readerPortRef.current.close()
            } catch (error) {
                console.log("Error closing RFID reader port:", error)
            }
        }
    }

    const connectRFIDReader = async (port = null) => {
        try {
            setReaderStatus("connecting")

            if (!port) {
                port = await navigator.serial.requestPort({
                    filters: [{ usbVendorId: 0x08ff }, { usbVendorId: 0x072f }, { usbVendorId: 0x0bda }, { usbVendorId: 0x1fc9 }],
                })
            }

            await port.open({
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: "none",
                flowControl: "none",
            })

            readerPortRef.current = port
            setReaderPort(port)
            setRfidReaderConnected(true)
            setReaderStatus("connected")

            const portInfo = port.getInfo()
            setReaderInfo({
                vendorId: portInfo.usbVendorId,
                productId: portInfo.usbProductId,
                name: getReaderName(portInfo.usbVendorId, portInfo.usbProductId),
            })

            startRFIDReading()
        } catch (error) {
            console.error("Failed to connect RFID reader:", error)
            setReaderStatus("error")
            setRfidReaderConnected(false)

            setScanResult({
                success: false,
                message: `Gagal menghubungkan RFID reader: ${error.message}`,
            })
        }
    }

    const getReaderName = (vendorId, productId) => {
        const readerNames = {
            2303: "AuthenTec RFID Reader",
            1839: "ACS RFID Reader",
            3034: "Realtek RFID Reader",
            8137: "NXP RFID Reader",
        }
        return readerNames[vendorId] || `RFID Reader (${vendorId}:${productId})`
    }

    const startRFIDReading = async () => {
        if (!readerPortRef.current || readingActive) return

        try {
            setReadingActive(true)
            setReaderStatus("reading")

            const reader = readerPortRef.current.readable.getReader()
            readerRef.current = reader

            while (readerPortRef.current.readable && readingActive) {
                try {
                    const { value, done } = await reader.read()
                    if (done) break

                    const data = new TextDecoder().decode(value)
                    await processRFIDData(data)
                } catch (readError) {
                    console.error("Error reading from RFID reader:", readError)
                    break
                }
            }

            reader.releaseLock()
        } catch (error) {
            console.error("Error starting RFID reading:", error)
            setReaderStatus("error")
        }
    }

    const processRFIDData = async (rawData) => {
        try {
            const cleanData = rawData.trim().replace(/[\r\n\x00-\x1F\x7F]/g, "")

            if (!cleanData || cleanData.length < 4) return

            let rfidId = cleanData

            if (cleanData.includes(":")) {
                rfidId = cleanData.split(":").pop()
            } else if (cleanData.length > 10) {
                rfidId = cleanData.slice(-10)
            }

            if (lastCardRead === rfidId) {
                return
            }

            setLastCardRead(rfidId)

            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current)
            }
            readTimeoutRef.current = setTimeout(() => {
                setLastCardRead(null)
            }, 2000)

            await handleCardScan(rfidId)
        } catch (error) {
            console.error("Error processing RFID data:", error)
        }
    }

    const disconnectRFIDReader = async () => {
        try {
            setReadingActive(false)
            setReaderStatus("disconnecting")

            if (readerRef.current) {
                await readerRef.current.cancel()
                readerRef.current.releaseLock()
            }

            if (readerPortRef.current) {
                await readerPortRef.current.close()
            }

            setRfidReaderConnected(false)
            setReaderStatus("disconnected")
            setReaderPort(null)
            setReaderInfo(null)
            readerPortRef.current = null
        } catch (error) {
            console.error("Error disconnecting RFID reader:", error)
            setReaderStatus("error")
        }
    }

    // const handleCardInputChange = (e) => {
    //     const value = e.target.value
    //     setCardInput(value)

    //     // Clear previous timeout
    //     if (processTimeoutRef.current) {
    //         clearTimeout(processTimeoutRef.current)
    //     }

    //     // Process input after user stops typing (debounce)
    //     if (value.length >= 4) {
    //         processTimeoutRef.current = setTimeout(() => {
    //             handleCardScan(value)
    //             setCardInput("") // Clear input after processing
    //         }, 500)
    //     }
    // }

    // const handleCardInputKeyPress = (e) => {
    //     if (e.key === "Enter" && cardInput.trim()) {
    //         if (processTimeoutRef.current) {
    //             clearTimeout(processTimeoutRef.current)
    //         }
    //         handleCardScan(cardInput.trim())
    //         setCardInput("")
    //     }
    // }

    const handleCardScan = async (cardId) => {
        if (isProcessing) return

        setIsProcessing(true)
        setIsScanning(true)

        try {
            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const student = mockStudents.find(
                (s) => s.rfidId === cardId || s.cardId === cardId || s.nis === cardId || s.id === cardId,
            )

            const currentTime = new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })

            if (student) {
                setScanResult({
                    success: true,
                    student: student,
                    time: currentTime,
                    method: rfidReaderConnected ? "RFID" : "Manual",
                    cardId: cardId,
                })

                setTodayAttendance((prev) =>
                    prev.map((s) => (s.id === student.id ? { ...s, status: "hadir", time: currentTime } : s)),
                )

                playNotificationSound(true)
            } else {
                setScanResult({
                    success: false,
                    message: `Kartu tidak terdaftar (ID: ${cardId})`,
                    cardId: cardId,
                    time: currentTime,
                })

                playNotificationSound(false)
            }
        } catch (error) {
            console.error("Error processing card scan:", error)
            setScanResult({
                success: false,
                message: "Terjadi kesalahan saat memproses kartu",
            })
        } finally {
            setIsScanning(false)
            setIsProcessing(false)

            // Refocus input after processing
            if (inputRef.current && scanMode === "card") {
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100)
            }
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

    const handleManualScan = (studentId) => {
        handleCardScan(studentId)
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

    const handleCardInputChange = async () => {
        const value = cardInput;
        // setCardInput(value);

        if (!value.trim()) return; // kalau kosong, skip

        setIsProcessing(true);

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const res = await fetch("http://localhost:8000/api/presensi/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // kalau butuh token
                },
                body: JSON.stringify({ uid_kartu: cardInput }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Presensi berhasil:", data);
            // lakukan aksi lain misalnya tampilkan notifikasi
        } catch (error) {
            console.error("Gagal presensi:", error);
        } finally {
            setIsProcessing(false);
            setCardInput(""); // reset input biar siap scan lagi
            inputRef.current?.focus(); // fokus lagi untuk scan berikutnya
        }
    };

    const ScanInterface = () => (
        <div className="space-y-6">
            {/* RFID Reader Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Status RFID Reader</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {serialSupported ? (
                                <FaUsb className="w-4 h-4 text-green-500" />
                            ) : (
                                <FaUsb className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm ${serialSupported ? "text-green-600" : "text-red-600"}`}>
                                Serial API {serialSupported ? "Didukung" : "Tidak Didukung"}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {rfidReaderConnected ? (
                                <FaCreditCard className="w-4 h-4 text-green-500" />
                            ) : (
                                <FaCreditCard className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm ${rfidReaderConnected ? "text-green-600" : "text-red-600"}`}>
                                RFID Reader {rfidReaderConnected ? "Terhubung" : "Terputus"}
                            </span>
                        </div>
                    </div>
                </div>

                {readerInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <FaCreditCard className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-blue-800 font-medium">{readerInfo.name}</p>
                                <p className="text-blue-600 text-sm">
                                    Vendor ID: {readerInfo.vendorId?.toString(16).toUpperCase()} | Product ID:{" "}
                                    {readerInfo.productId?.toString(16).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!serialSupported && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <FaExclamationTriangle className="w-5 h-5 text-red-600" />
                            <p className="text-red-800">
                                Browser tidak mendukung Web Serial API. Gunakan Chrome, Edge, atau Opera terbaru.
                            </p>
                        </div>
                    </div>
                )}

                {serialSupported && !rfidReaderConnected && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
                            <p className="text-yellow-800">
                                RFID Reader belum terhubung. Klik tombol "Hubungkan RFID Reader" untuk menghubungkan.
                            </p>
                        </div>
                    </div>
                )}

                {readerStatus === "reading" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <div className="animate-pulse">
                                <FaSync className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-green-800">RFID Reader aktif - siap membaca kartu</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Scan Mode Selector */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setScanMode("card")}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${scanMode === "card"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    <FaIdCard className="w-5 h-5" />
                    <span>Scan Kartu</span>
                </button>
                <button
                    onClick={() => setScanMode("manual")}
                    className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${scanMode === "manual"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    <FaUserCheck className="w-5 h-5" />
                    <span>Manual</span>
                </button>
            </div>

            {/* Scan Area */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <div className="mx-auto w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                        {isScanning ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                                <p className="text-blue-600 font-medium">Memproses kartu...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                {scanMode === "card" && <FaIdCard className="w-20 h-20 text-blue-400" />}
                                {scanMode === "manual" && <FaUserCheck className="w-20 h-20 text-blue-400" />}
                                <p className="text-gray-600 font-medium">
                                    {scanMode === "card" && "Tempelkan kartu atau ketik ID kartu"}
                                    {scanMode === "manual" && "Pilih santri secara manual"}
                                </p>
                            </div>
                        )}

                        {isScanning && <div className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"></div>}
                    </div>

                    {/* Input and Control Buttons */}
                    <div className="flex flex-col items-center space-y-4">
                        {scanMode === "card" && (
                            <div className="w-full max-w-md">
                                <form action={handleCardInputChange}>

                                   <input
                                    ref={inputRef}
                                    id="cardInput"
                                    type="text"
                                    value={cardInput}
                                    onChange={(e) => {
                                        setCardInput(e.target.value);
                                        // handleCardInputChange();
                                    }}
                                    // onKeyPress={handleCardInputKeyPress}
                                    placeholder="Tempelkan kartu atau ketik ID..."
                                    disabled={isProcessing}
                                    className="absolute left-[-9999px]"
                                    autoComplete="off"
                                    autoFocus
                                />
                                </form>
                            </div>
                        )}

                        {/* {scanMode === "card" && !rfidReaderConnected && serialSupported && (
                            <button
                                onClick={() => connectRFIDReader()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                disabled={readerStatus === "connecting"}
                            >
                                <FaUsb className="w-4 h-4" />
                                <span>{readerStatus === "connecting" ? "Menghubungkan..." : "Hubungkan RFID Reader"}</span>
                            </button>
                        )} */}

                        {scanMode === "card" && rfidReaderConnected && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={disconnectRFIDReader}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                >
                                    <FaStop className="w-4 h-4" />
                                    <span>Putuskan</span>
                                </button>
                                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Reader aktif</span>
                                </div>
                            </div>
                        )}

                        {scanMode === "manual" && (
                            <div className="grid grid-cols-2 gap-2 max-w-md">
                                {mockStudents.slice(0, 4).map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleManualScan(student.id)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                        disabled={isProcessing}
                                    >
                                        {student.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Demo Buttons */}
                        {/* <div className="flex space-x-2 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => handleCardScan("0722142575")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                disabled={isProcessing}
                            >
                                Demo: Ahmad Fauzi
                            </button>
                            <button
                                onClick={() => handleCardScan("INVALID")}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                disabled={isProcessing}
                            >
                                Demo: Kartu Invalid
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
                <div
                    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${scanResult.success ? "border-green-500" : "border-red-500"
                        }`}
                >
                    {scanResult.success ? (
                        <div className="flex items-center space-x-4">
                            <img
                                src={scanResult.student.photo || "/placeholder.svg"}
                                alt={scanResult.student.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{scanResult.student.name}</h3>
                                <p className="text-gray-600">NIS: {scanResult.student.nis}</p>
                                <p className="text-gray-600">Kelas: {scanResult.student.class}</p>
                                <p className="text-green-600 font-medium">
                                    ✓ Presensi berhasil - {scanResult.time} ({scanResult.method})
                                </p>
                                {scanResult.cardId && <p className="text-gray-500 text-sm">Card ID: {scanResult.cardId}</p>}
                            </div>
                            <FaCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <FaTimesCircle className="w-8 h-8 text-red-500" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-600">Scan Gagal</h3>
                                <p className="text-gray-600">{scanResult.message}</p>
                                {scanResult.cardId && <p className="text-gray-500 text-sm">Card ID: {scanResult.cardId}</p>}
                                {scanResult.time && <p className="text-gray-500 text-sm">Waktu: {scanResult.time}</p>}
                            </div>
                        </div>
                    )}
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
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaUserCheck className="w-4 h-4" />
                                <span>Daftar</span>
                            </button>
                            <button
                                onClick={() => setCurrentView("scan")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "scan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaQrcode className="w-4 h-4" />
                                <span>Scan</span>
                            </button>
                            <button
                                onClick={() => setCurrentView("report")}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${currentView === "report" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
