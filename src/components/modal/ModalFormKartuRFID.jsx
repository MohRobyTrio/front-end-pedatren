"use client"

import { Dialog, Transition } from "@headlessui/react"
import { SantriInfoCard } from "../CardInfo"
import { ModalSelectSantri } from "../ModalSelectSantri"
import { Fragment, useEffect, useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FiCreditCard, FiHardDrive, FiWifi, FiCheck, FiX } from "react-icons/fi"
import Swal from "sweetalert2"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { useNavigate } from "react-router-dom"
import useLogout from "../../hooks/Logout"
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri"
import { OrbitProgress } from "react-loading-indicators"
// import { NDEFReader } from "@react-nfc/ndef-reader"

export const ModalAddKartuRFID = ({ isOpen, onClose, data, refetchData, feature }) => {
    console.log("ModalAddKartuRFID isOpen:", isOpen)
    console.log("ModalAddKartuRFID feature:", feature)
    console.log("ModalAddKartuRFID data:", data)

    const { menuSantri } = useDropdownSantri()
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const [santri, setSantri] = useState("")

    const [currentStep, setCurrentStep] = useState(1) // 1: form input, 2: RFID tapping
    const [inputMode, setInputMode] = useState("nfc") // nfc, reader
    const [isScanning, setIsScanning] = useState(false)
    const [nfcSupported, setNfcSupported] = useState(false)
    const [idCard, setIdCard] = useState("")
    const [isChangingRfid, setIsChangingRfid] = useState(false)
    const inputRef = useRef(null)

    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [santriSelectionCancelled, setSantriSelectionCancelled] = useState(false)

    const [formData, setFormData] = useState({
        santri_id: "",
        uid_kartu: "",
        pin: "",
        aktif: "",
        // tanggal_terbit: "",
        // tanggal_expired: "",
    })

    useEffect(() => {
        if ("NDEFReader" in window) {
            setNfcSupported(true)
        }
    }, [])

    useEffect(() => {
        if (isOpen && feature == 1) {
            console.log("[v0] Resetting santri state for add mode")
            setSantri(null)
            setSantriSelectionCancelled(false)
            setShowSelectSantri(false)
            setCurrentStep(1) // Reset to form step
            setIdCard("")
            setFormData({
                santri_id: "",
                uid_kartu: "",
                pin: "",
                aktif: "",
                // tanggal_terbit: "",
                // tanggal_expired: "",
            })
        }
    }, [isOpen, feature])

    useEffect(() => {
        if (isOpen && feature == 2 && data.santri_id && menuSantri.length > 0) {
            console.log("[v0] Setting santri for edit mode")
            const s = menuSantri.find((s) => s.id == data.santri_id)
            if (s) {
                setSantri(s)
            } else {
                setSantri(null)
            }
            setCurrentStep(1)
            setFormData({
                santri_id: data.santri_id,
                uid_kartu: data.uid_kartu || "",
                pin: data.pin || "",
                aktif: data.aktif ?? "",
                // tanggal_terbit: data.tanggal_terbit || "",
                // tanggal_expired: data.tanggal_expired || "",
            })
            if (data.uid_kartu) {
                setIdCard(data.uid_kartu)
            }
        }
    }, [isOpen, feature, data, menuSantri])

    useEffect(() => {
        if (!isOpen) {
            console.log("[v0] Modal closed, resetting all states")
            setSantri(null)
            setSantriSelectionCancelled(false)
            setShowSelectSantri(false)
            setCurrentStep(1)
            setIdCard("")
            setIsScanning(false)
            setIsChangingRfid(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (feature !== 1) return
        if (isOpen && (santri === null || santri === "")) {
            setShowSelectSantri(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, feature])

    useEffect(() => {
        if (feature !== 1) return
        // Only close modal if santri selection was explicitly cancelled and modal is not showing santri selector
        if (!showSelectSantri && (santri === null || santri === "") && santriSelectionCancelled) {
            onClose?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSelectSantri, santri, feature, santriSelectionCancelled])

    const toggleInputMode = (mode) => {
        setInputMode(mode)
        setIsScanning(false)
        if (mode === "nfc" && nfcSupported) {
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

        setIsScanning(true)
        try {
            const ndef = new window.NDEFReader()
            await ndef.scan()

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
                    setIdCard(uidDecimal)
                    // setIsScanning(false)
                    setFormData((prev) => ({ ...prev, uid_kartu: uidDecimal }))
                } catch (e) {
                    playNotificationSound(false)
                    console.error("Gagal konversi UID ke desimal:", e)
                    uidDecimal = serialNumber // fallback
                }

                setIsScanning(false)
                // searchStudent(uidDecimal)
            })

            ndef.addEventListener("readingerror", () => {
                // setError("Error membaca NFC tag")
                // setIsScanning(false)
            })

            // ndef.addEventListener("reading", ({ serialNumber }) => {
            //     setIdCard(serialNumber)
            //     setIsScanning(false)
            //     setFormData((prev) => ({ ...prev, uid_kartu: serialNumber }))
            // })
        } catch (error) {
            console.error("NFC Error:", error)
            // setIsScanning(false)
        } finally {
            setIsScanning(false)
        }
    }

    const handleFormSave = async (e) => {
        e.preventDefault()

        if (feature == 1 || formData.pin.length > 1) {
            // Validasi PIN
            if (!formData.pin) {
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "PIN harus diisi.",
                })
                return
            }
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin menyimpan perubahan?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Batal",
        })

        if (!confirmResult.isConfirmed) return

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

            if (feature == 2 && formData.pin == "") {
                delete formData.pin; // hapus pin dari payload
            }

            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2))
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}kartu/${data.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            Swal.close()
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            const result = await response.json()

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                })
                return
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Data berhasil disimpan.`,
            })

            refetchData?.(true)
            onClose?.()
        } catch (error) {
            console.error("Terjadi kesalahan:", error)
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat menyimpan data. ${error}`,
            })
        }
    }

    const handleChangeRfid = () => {
        setIsChangingRfid(true)
        setCurrentStep(2)
        setIdCard("") // Clear current RFID
        if (inputMode === "nfc" && nfcSupported) {
            startNFCScanning()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (
            (feature === 1) || // feature 1 wajib
            (feature === 2 && formData.pin?.length > 0) // feature 2 hanya jika pin diisi
        ) {
            if (!formData.pin) {
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "PIN harus diisi.",
                });
                return;
            }
            if (formData.pin.length < 4) {
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: "PIN minimal 4 karakter.",
                });
                return;
            }
        }

        if (feature === 2 && currentStep === 1 && !isChangingRfid) {
            return handleFormSave(e)
        }

        if (currentStep === 1) {
            setCurrentStep(2)
            setFormData((prev) => ({ ...prev, santri_id: santri?.id || data.santri_id }))

            if (inputMode === "nfc" && nfcSupported) {
                startNFCScanning()
            }
            return
        }

        const isTambah = feature == 1
        const metod = isTambah ? "POST" : "PUT"
        const idSend = isTambah ? "" : `/${data.id}` // kosong kalau POST, isi kalau PUT

        const endpoint = `${API_BASE_URL}kartu${idSend}`

        const confirmResult = await Swal.fire({
            title: isChangingRfid ? "Yakin ingin mengganti kartu RFID?" : "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Batal",
        })

        if (!confirmResult.isConfirmed) return

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

            const finalFormData = {
                ...formData,
                uid_kartu: idCard || formData.uid_kartu,
            }

            if (feature == 2 && finalFormData.pin == "") {
                delete finalFormData.pin; // hapus pin dari payload
            }

            console.log("Payload yang dikirim ke API:", JSON.stringify(finalFormData, null, 2))
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(endpoint, {
                method: metod,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(finalFormData),
            })

            Swal.close()
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }

            const result = await response.json()

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                })
                return
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: isChangingRfid ? "Kartu RFID berhasil diganti." : "Data berhasil dikirim.",
            })

            refetchData?.(true)
            onClose?.()
        } catch (error) {
            console.error("Terjadi kesalahan:", error)
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error}`,
            })
        }
    }

    const handleBackToForm = () => {
        setCurrentStep(1)
        setIdCard(feature == 2 ? formData.uid_kartu : "")
        setIsScanning(false)
        setIsChangingRfid(false)
    }

    // useEffect(() => {
    //     if (currentStep !== 2) return;

    //     const handleKeyPress = (e) => {
    //         if (e.key === "Enter") {
    //             e.preventDefault();
    //             // submitForm(idCard) jika mau submit saat Enter
    //         } else if (/^[0-9]$/.test(e.key)) {
    //             setIdCard((prev) => {
    //                 let newId = prev + e.key;

    //                 // Jika sudah 10 digit, reset dan masukkan digit baru sebagai awal
    //                 if (newId.length > 10) {
    //                     newId = e.key; // reset dan mulai dari digit ini
    //                 }

    //                 return newId;
    //             });
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyPress);
    //     return () => window.removeEventListener("keydown", handleKeyPress);
    // }, [currentStep]);

    useEffect(() => {
        // hanya jalan jika step = 2 dan path sesuai
        if (currentStep !== 2 || location.pathname !== "/karturfid") return;

        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                // submitForm(idCard) jika mau submit saat Enter
                // submitForm(idCard);
            } else if (/^[0-9]$/.test(e.key)) {
                setIdCard((prev) => {
                    let newId = prev + e.key;

                    // reset jika lebih dari 10 digit
                    if (newId.length > 10) {
                        newId = e.key;
                    }

                    return newId;
                });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, location.pathname]); // tambahkan location.pathname ke dependency

    useEffect(() => {
        setFormData({
            ...formData,
            santri_id: santri?.id || "",
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [santri])

    useEffect(() => {
        if (currentStep == 2 && inputMode == "scnfcan") {
            setIsScanning(true);
            startNFCScanning();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, inputMode]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative max-h-[75vh] sm:max-h-[90vh] flex flex-col">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mt-6">
                                {feature === 2
                                    ? currentStep === 1
                                        ? "Edit Data"
                                        : isChangingRfid
                                            ? "Ganti Kartu RFID"
                                            : "Tapping Kartu RFID"
                                    : currentStep === 1
                                        ? santri
                                            ? "Tambah Data Baru"
                                            : null
                                        : "Tapping Kartu RFID"}
                            </Dialog.Title>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[55vh] sm:max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            {currentStep === 1 && (
                                                <>
                                                    {feature == 1 && !santri && (
                                                        <div className="mb-4 flex justify-center">
                                                            <div className="w-full max-w-2xl text-center">
                                                                <h2 className="text-lg font-semibold mb-4">Pilih Data Santri Terlebih Dahulu</h2>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowSelectSantri(true)}
                                                                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                >
                                                                    Pilih Santri
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {santri && (
                                                        <SantriInfoCard santri={santri} setShowSelectSantri={() => setShowSelectSantri(true)} />
                                                    )}

                                                    {(santri || feature === 2) && (
                                                        <div className="space-y-4">
                                                            {feature === 2 && formData.uid_kartu && (
                                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                                    <h4 className="font-medium text-blue-800 mb-2">Kartu RFID Saat Ini</h4>
                                                                    <p className="text-blue-600 font-mono">{formData.uid_kartu}</p>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <label htmlFor="pin" className="block text-gray-700">
                                                                    PIN {feature == 1 ? "*" : ""}
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="pin"
                                                                    name="pin"
                                                                    value={formData.pin}
                                                                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="Masukkan PIN"
                                                                    maxLength={6}
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-gray-700">Status Aktif *</label>
                                                                <div className="flex space-x-4 mt-1">
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="aktif"
                                                                            value="YA"
                                                                            checked={formData.aktif === true}
                                                                            onChange={() => setFormData({ ...formData, aktif: true })}
                                                                            className="form-radio text-blue-500 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        <span className="ml-2 text-gray-700">Ya</span>
                                                                    </label>
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name="aktif"
                                                                            value="TIDAK"
                                                                            checked={formData.aktif === false}
                                                                            onChange={() => setFormData({ ...formData, aktif: false })}
                                                                            className="form-radio text-blue-500 focus:ring-blue-500"
                                                                            required
                                                                        />
                                                                        <span className="ml-2 text-gray-700">Tidak</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {/* <div>
                                                                <label htmlFor="tanggal_terbit" className="block text-gray-700">
                                                                    Tanggal Terbit *
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="tanggal_terbit"
                                                                    name="tanggal_terbit"
                                                                    value={formData.tanggal_terbit}
                                                                    onChange={(e) => setFormData({ ...formData, tanggal_terbit: e.target.value })}
                                                                    required
                                                                    placeholder="Pilih tanggal terbit"
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="tanggal_expired" className="block text-gray-700">
                                                                    Tanggal Kadaluarsa *
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="tanggal_expired"
                                                                    name="tanggal_expired"
                                                                    value={formData.tanggal_expired}
                                                                    onChange={(e) => setFormData({ ...formData, tanggal_expired: e.target.value })}
                                                                    required
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                                />
                                                            </div> */}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {currentStep === 2 && (
                                                <div className="space-y-6 sm:max-w-md mx-auto">
                                                    <div className="flex bg-white rounded-xl p-1 shadow-lg mb-4 sm:mb-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => inputMode !== "nfc" && toggleInputMode("nfc")}
                                                            className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "nfc"
                                                                ? "bg-blue-500 text-white shadow-md"
                                                                : "text-gray-600 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <FiCreditCard className="mr-2" />
                                                            NFC
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => inputMode !== "reader" && toggleInputMode("reader")}
                                                            className={`flex-1 flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-all ${inputMode === "reader"
                                                                ? "bg-blue-500 text-white shadow-md"
                                                                : "text-gray-600 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <FiHardDrive className="mr-2" />
                                                            Reader
                                                        </button>
                                                    </div>

                                                    <div className="py-6">
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
                                                                ) : idCard ? (
                                                                    <div className="text-green-500">
                                                                        <FiCheck className="text-3xl sm:text-4xl mx-auto mb-2" />
                                                                        <p className="text-sm sm:text-base font-medium">Kartu Terdeteksi!</p>
                                                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">UID: {idCard}</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-gray-500">
                                                                        <FiWifi className="text-3xl sm:text-4xl mx-auto mb-2" />
                                                                        <p className="text-sm sm:text-base">Scanner siap</p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={startNFCScanning}
                                                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                                        >
                                                                            Mulai Scan
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <div className="relative mb-6">
                                                                    <div className="mx-auto w-32 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg relative overflow-hidden">
                                                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
                                                                        <div
                                                                            className={`absolute top-4 right-3 w-2 h-2 rounded-full ${idCard ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                                                                        ></div>
                                                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
                                                                            READER
                                                                        </div>
                                                                        {idCard && (
                                                                            <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>
                                                                        )}
                                                                    </div>

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

                                                                <div className="mb-4">
                                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                                        {idCard ? "Kartu Terdeteksi!" : "Siap Membaca Kartu"}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        {idCard ? "Data kartu berhasil dibaca" : "Letakkan kartu pada card reader"}
                                                                    </p>
                                                                    {idCard && (
                                                                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                                                            <p className="text-sm font-medium text-green-800">ID Kartu:</p>
                                                                            <p className="text-lg font-mono text-green-900">{idCard}</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="bg-gray-50 rounded-lg p-4 mb-4 hidden">
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">UID Kartu</label>
                                                                    <input
                                                                        ref={inputRef}
                                                                        type="text"
                                                                        value={idCard}
                                                                        onChange={(e) => setIdCard(e.target.value)}
                                                                        placeholder="Masukkan UID kartu atau gunakan card reader..."
                                                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-center text-lg font-mono tracking-wider focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                                    {currentStep === 1 && feature === 2 && (
                                        <>
                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleChangeRfid}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer mt-3 sm:mt-0"
                                            >
                                                Ganti Kartu
                                            </button>
                                        </>
                                    )}

                                    {currentStep === 1 && feature === 1 && santri && (
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                        >
                                            Lanjut ke Tapping RFID
                                        </button>
                                    )}

                                    {currentStep === 2 && (
                                        <>
                                            <button
                                                type="submit"
                                                disabled={!idCard}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {isChangingRfid ? "Simpan Kartu Baru" : "Simpan Data"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleBackToForm}
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                Kembali
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>

            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => {
                    setShowSelectSantri(false)
                    if (!santri) {
                        setSantriSelectionCancelled(true)
                    }
                }}
                onSantriSelected={(santri) => setSantri(santri)}
            />
        </Transition>
    )
}

export const ModalDetailTransaksiSantri = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}riwayatkartu/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data")
                    return res.json()
                })
                .then((json) => setData(json))
                .catch((err) => {
                    console.error(err)
                    setError(err.message)
                    setData(null)
                })
                .finally(() => setLoading(false))
        }
    }, [isOpen, id])

    const formatRupiah = (number) => {
        if (number === null || number === undefined) return number || "-"
        const parsedNumber = parseFloat(number)
        if (isNaN(parsedNumber)) return "-"
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(parsedNumber)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-full relative max-h-[90vh] flex flex-col">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <div className="pt-6 px-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Transaksi Santri</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-40 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                    </div>
                                ) : error ? (
                                    <p className="text-center text-red-500">{error}</p>
                                ) : data?.data?.length > 0 ? (
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                            <tr>
                                                <th className="px-3 py-2 border-b">#</th>
                                                <th className="px-3 py-2 border-b">Outlet & Kategori</th>
                                                <th className="px-3 py-2 border-b">Tipe</th>
                                                <th className="text-right px-3 py-2 border-b">Jumlah</th>
                                                <th className="px-3 py-2 border-b">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-800">
                                            {data?.data?.map((trx, i) => (
                                                <tr key={trx.id} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                                    <td className="px-3 py-2 border-b align-middle">{i + 1}</td>
                                                    <td className="p-3 align-middle border-b">
                                                        <div className="font-semibold text-gray-800">{trx.nama_outlet}</div>
                                                        <div className="text-xs text-gray-500">{trx.nama_kategori}</div>
                                                    </td>
                                                    <td className="p-3 align-middle border-b">
                                                        <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${trx.tipe === 'debit' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {trx.tipe}
                                                        </span>
                                                    </td>
                                                    <td className={`p-3 border-b text-right font-mono font-semibold align-middle ${trx.tipe === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                                                        {trx.tipe === 'debit' ? '-' : '+'}
                                                        {formatRupiah(trx.jumlah)}
                                                    </td>
                                                    <td className="p-3 align-middle border-b">
                                                        {trx.keterangan || "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="h-40 grid place-items-center text-gray-500">Tidak ada riwayat transaksi.</p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 text-right space-x-2 bg-gray-100 px-6 py-3 rounded-b-lg border-t border-gray-300">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}