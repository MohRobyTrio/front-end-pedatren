import Swal from "sweetalert2"
import useLogout from "../../hooks/Logout"
import { Fragment, useEffect, useState } from "react"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { Dialog, Transition, Combobox } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { Check, ChevronsUpDown } from "lucide-react"
import { SantriInfoCard } from "../CardInfo"
import useDropdownGrupWaliAsuh from "../../hooks/hook_dropdown/DropdownGrupWaliAsuh"
import { ModalSelectSantri } from "../ModalSelectSantri" // Import ModalSelectSantri

export const ModalAddWaliAsuh = ({ isOpen, onClose, refetchData, santriTerpilih }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        id_santri: "",
        grup_wali_asuh_id: "",
    })
    const [grupQuery, setGrupQuery] = useState("")
    // const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { menuGrup } = useDropdownGrupWaliAsuh()

    // State untuk modal select santri
    const [showSelectSantri, setShowSelectSantri] = useState(false)
    const [santriSelectionCancelled, setSantriSelectionCancelled] = useState(false)
    const [santri, setSantri] = useState(santriTerpilih || null)

    console.log("menuGrup:", menuGrup)

    useEffect(() => {
        if (isOpen) {
            if (santriTerpilih) {
                setSantri(santriTerpilih)
                setFormData((prev) => ({
                    ...prev,
                    id_santri: santriTerpilih.id,
                }))
            } else {
                // Jika tidak ada santriTerpilih dari props, reset state
                setSantri(null)
                setFormData({
                    id_santri: "",
                    grup_wali_asuh_id: "",
                })
            }
        }
    }, [isOpen, santriTerpilih])

    useEffect(() => {
        if (isOpen && santri?.id && formData.id_santri !== santri.id) {
            setFormData((prev) => ({ ...prev, id_santri: santri.id }))
        }
    }, [santri, isOpen, formData.id_santri])

    useEffect(() => {
        if (!isOpen) {
            console.log("[v0] Modal closed, resetting all states")
            setSantri(null)
            setSantriSelectionCancelled(false)
            setShowSelectSantri(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && (santri === null || santri === "")) {
            setShowSelectSantri(true)
        }
    }, [isOpen, santri])

    useEffect(() => {
        // Only close modal if santri selection was explicitly cancelled and modal is not showing santri selector
        if (!showSelectSantri && (santri === null || santri === "") && santriSelectionCancelled) {
            onClose?.()
        }
    }, [showSelectSantri, santri, santriSelectionCancelled, onClose])

    const filteredGrup =
        grupQuery === ""
            ? menuGrup
            : menuGrup.filter((grup) =>
                (grup.label || "").toLowerCase().includes(grupQuery.toLowerCase())
            )

    const selectedGrup = menuGrup.find((g) => g.id === formData.grup_wali_asuh_id)

    const validateForm = () => {
        const newErrors = {}

        if (!formData.id_santri) {
            newErrors.id_santri = "Santri harus dipilih"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        })

        if (!confirmResult.isConfirmed) return

        // setLoading(true)
        try {
            Swal.fire({
                background: "transparent",    // tanpa bg putih box
                showConfirmButton: false,     // tanpa tombol
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
                }
            });
            const token = sessionStorage.getItem("token") || getCookie("token")

            const response = await fetch(`${API_BASE_URL}crud/waliasuh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            // --- handle sesi expired (401)
            if (response.status === 401 && !window.sessionExpiredShown) {
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

            // --- handle validasi gagal (422)
            if (response.status === 422) {
                const validationErrors = result.errors
                let formattedErrors = ""

                if (validationErrors && typeof validationErrors === "object") {
                    formattedErrors = Object.entries(validationErrors)
                        .map(([msgs]) =>
                            msgs.map((msg) => `<div style="text-align:left">- ${msg}</div>`).join("")
                        )
                        .join("")
                }

                await Swal.fire({
                    icon: "error",
                    title: "Validasi Gagal",
                    html: `
                    <div style="text-align:left">
                        ${result.message || "Validasi gagal. Mohon periksa kembali input Anda."}
                        <br /><br />
                        ${formattedErrors}
                    </div>
                `,
                })
                return
            }

            // --- handle sukses
            if (response.ok) {
                if (result.status === false) {
                    // gagal walaupun HTTP 200
                    await Swal.fire({
                        icon: "error",
                        title: "Gagal!",
                        text: result.message || "Terjadi kesalahan.",
                    })
                    return
                }

                // benar-benar sukses
                sessionStorage.removeItem("menuWaliAsuh4")
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message || "Data berhasil dikirim.",
                })
                refetchData?.(true)
                onClose?.()
                return
            }

            // --- handle error selain itu
            throw new Error(result.message || "Terjadi kesalahan pada server.")
        } catch (error) {
            console.error("Terjadi kesalahan:", error)
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message || "Terjadi kesalahan saat mengirim data.",
            })
        } finally {
            // setLoading(false)
        }
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
                        <Dialog.Panel className="inline-block w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl bg-white rounded-lg shadow-xl text-left transform transition-all overflow-hidden mx-4">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>

                            <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh] sm:max-h-[90vh]">
                                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 text-center">
                                        Tambah Wali Asuh
                                    </Dialog.Title>
                                </div>

                                <div className="px-4 sm:px-6 py-4 space-y-4 sm:space-y-6 flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
                                    {/* Santri Info Card */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Santri <span className="text-red-500">*</span>
                                        </label>
                                        {santri ? (
                                            <SantriInfoCard
                                                santri={santri}
                                                setShowSelectSantri={setShowSelectSantri}
                                            />
                                        ) : (
                                            <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                <p className="text-gray-600 mb-3">Belum ada data Santri dipilih</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSelectSantri(true)}
                                                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Pilih Santri
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grup Wali Asuh Combobox */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">Grup Wali Asuh</label>
                                        <Combobox
                                            value={formData.grup_wali_asuh_id}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, grup_wali_asuh_id: value }))}
                                        >
                                            <div className="relative">
                                                <Combobox.Input
                                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 focus:outline-none transition-all duration-200"
                                                    displayValue={() => (selectedGrup ? selectedGrup.label : "")}
                                                    onChange={(event) => setGrupQuery(event.target.value)}
                                                    placeholder="Pilih grup wali asuh..."
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                                </Combobox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Combobox.Options className="absolute z-50 mt-1 max-h-48 sm:max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-200">
                                                        {filteredGrup.length === 0 ? (
                                                            <div className="cursor-default select-none py-2 px-4 text-gray-500">
                                                                Tidak ditemukan
                                                            </div>
                                                        ) : (
                                                            filteredGrup.map((grup) => (
                                                                <Combobox.Option
                                                                    key={grup.id}
                                                                    className={({ active }) =>
                                                                        `relative cursor-pointer select-none py-2 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`
                                                                    }
                                                                    value={grup.id}
                                                                >
                                                                    {({ selected }) => (
                                                                        <>
                                                                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                                                {grup.label}
                                                                            </span>
                                                                            {selected && (
                                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                                    <Check className="h-5 w-5" />
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </Combobox.Option>
                                                            ))
                                                        )}
                                                    </Combobox.Options>
                                                </Transition>
                                            </div>
                                        </Combobox>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full sm:w-auto cursor-pointer inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        // disabled={loading}
                                        className="w-full sm:w-auto cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {/* {loading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            "Simpan"
                                        )} */}
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>

            {/* Modal Select Santri */}
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => {
                    setShowSelectSantri(false)
                    if (!santri) {
                        setSantriSelectionCancelled(true)
                    }
                }}
                onSantriSelected={(selectedSantri) => setSantri(selectedSantri)}
                list={true}
            />
        </Transition>
    )
}