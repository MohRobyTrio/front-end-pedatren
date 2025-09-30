"use client"

import Swal from "sweetalert2"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Listbox, Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import useLogout from "../../hooks/Logout"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { OrbitProgress } from "react-loading-indicators"
import { ChevronsUpDown } from "lucide-react"

export const ModalAddOrEditPotongan = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState(""); // hanya untuk handle dropdown
    const id = data?.id
    const [formData, setFormData] = useState({
        nama: "",
        jenis: 'persentase',
        nilai: "",
        status: true,
        keterangan: "",
        tagihan_ids: [],
    })
    const [tagihan, setTagihan] = useState([])
    const [loadingTagihan, setLoadingTagihan] = useState(false)
    const JENIS_OPTIONS = [
        { value: 'persentase', label: 'Persentase (%)' },
        { value: 'nominal', label: 'Nominal (Rp)' }
    ];
    const selectedJenis = JENIS_OPTIONS.find(option => option.value == formData.jenis);

    const fetchTagihan = async () => {
        setLoadingTagihan(true)
        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}tagihan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const result = await response.json()
                setTagihan(result.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching tagihan:", error)
        } finally {
            setLoadingTagihan(false)
        }
    }

    // useEffect(() => {
    //     console.log(data.kategori);
    // }, [data])

    useEffect(() => {
        if (isOpen) {
            fetchTagihan()

            if (feature == 2 && data) {
                setFormData({
                    nama: data.nama || "",
                    jenis: data.jenis || "",
                    nilai: data.nilai || "",
                    keterangan: data.keterangan || "",
                    status: data.status == 1 ? true : false,
                    tagihan_ids: data.tagihans ? data.tagihans.map(item => item.id) : [],
                })
            } else {
                setFormData({
                    nama: "",
                    jenis: 'persentase',
                    nilai: "",
                    status: true,
                    keterangan: "",
                    tagihan_ids: [],

                })
                setSelectedOption("")
            }
        }
    }, [isOpen, feature, data])

    const handleCategoryChange = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            tagihan_ids: prev.tagihan_ids.includes(categoryId)
                ? prev.tagihan_ids.filter((id) => id !== categoryId)
                : [...prev.tagihan_ids, categoryId],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.tagihan_ids.length === 0) {
            await Swal.fire({
                icon: "error",
                title: "Validasi Gagal",
                text: "Minimal pilih satu kategori.",
            })
            return
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
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

            const token = sessionStorage.getItem("token") || getCookie("token")

            const isEdit = feature === 2
            const url = isEdit ? `${API_BASE_URL}potongan/${id}` : `${API_BASE_URL}potongan`

            const method = isEdit ? "PUT" : "POST"

            const payload = {
                nama: formData.nama,
                status: formData.status,
                tagihan_ids: formData.tagihan_ids,
            }
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2))

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()
            Swal.close()
            console.log(result)

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

            if (!response.ok) {
                if (result.error) {
                    const errorMap = {
                        "validation.unique": "Nama potongan sudah digunakan.",
                        "validation.required": "Field ini wajib diisi.",
                        "validation.array": "Kategori harus berupa array.",
                        "validation.min": "Minimal pilih satu kategori.",
                        "validation.exists": "Kategori yang dipilih tidak valid.",
                    }

                    const errorMessages = Object.entries(result.error)
                        // eslint-disable-next-line no-unused-vars
                        .map(([key, messages]) =>
                            Array.isArray(messages)
                                ? messages.map((m) => errorMap[m] || m).join(", ")
                                : errorMap[messages] || messages,
                        )
                        .join("\n")

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    })

                    return
                }

                throw new Error(result.message || "Terjadi kesalahan pada server.")
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            })

            sessionStorage.removeItem("potonganData")
            refetchData?.()
            onClose?.()
        } catch (error) {
            console.error("Terjadi kesalahan:", error)
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message || "Terjadi kesalahan saat mengirim data.",
            })
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
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-md sm:max-w-2xl sm:align-middle">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                                {feature == 1 ? "Tambah Data Baru" : "Edit"}
                                            </Dialog.Title>

                                            <div className="space-y-4">
                                                {/* <div>
                                                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nama Potongan <span className="text-error-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama"
                                                        value={formData.nama}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                                        placeholder="Masukkan nama potongan"
                                                        maxLength={100}
                                                    />
                                                </div> */}
                                                {/* Dropdown */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nama Potongan <span className="text-error-500">*</span>
                                                    </label>
                                                    <select
                                                        value={selectedOption}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setSelectedOption(val);
                                                            if (val !== "lainnya") {
                                                                // kalau bukan lainnya, langsung set ke formData.nama
                                                                setFormData((prev) => ({ ...prev, nama: val }));
                                                            } else {
                                                                // kalau lainnya, kosongkan dulu biar input di bawah yang isi
                                                                setFormData((prev) => ({ ...prev, nama: "" }));
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                                    >
                                                        <option value="">-- Pilih Nama Potongan --</option>
                                                        <option value="anak pegawai">Anak Pegawai</option>
                                                        <option value="khadam">Khadam</option>
                                                        <option value="bersaudara">Bersaudara</option>
                                                        <option value="lainnya">Lainnya...</option>
                                                    </select>

                                                    {/* Input tambahan hanya muncul kalau pilih lainnya */}
                                                    {selectedOption === "lainnya" && (
                                                        <input
                                                            type="text"
                                                            value={formData.nama}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({ ...prev, nama: e.target.value }))
                                                            }
                                                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                                            placeholder="Masukkan nama potongan lainnya"
                                                            maxLength={100}
                                                        />
                                                    )}
                                                </div>

                                                {/* Jenis Field */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Jenis Potongan <span className="text-error-500">*</span>
                                                    </label>
                                                    <Listbox value={formData.jenis} onChange={(value) => setFormData(prev => ({ ...prev, jenis: value }))}>
                                                        <div className="relative">
                                                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                                <span className="block truncate">{selectedJenis?.label}</span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />

                                                                </span>
                                                            </Listbox.Button>
                                                            <Transition
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                                    {JENIS_OPTIONS.map((option) => (
                                                                        <Listbox.Option
                                                                            key={option.value}
                                                                            className={({ active }) =>
                                                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                                                                                }`
                                                                            }
                                                                            value={option.value}
                                                                        >
                                                                            {({ selected }) => (
                                                                                <>
                                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                        {option.label}
                                                                                    </span>
                                                                                    {selected && (
                                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                                                                            <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </Listbox>
                                                </div>

                                                {/* Nilai Field */}
                                                <div>
                                                    <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nilai {formData.jenis === 'persentase' ? 'Persentase' : 'Nominal'} <span className="text-error-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            id="nilai"
                                                            type="text"
                                                            inputMode="numeric"
                                                            onInput={(e) => {
                                                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                            }}
                                                            value={
                                                                formData.jenis === "nominal"
                                                                    ? formData.nilai
                                                                        ? new Intl.NumberFormat("id-ID").format(formData.nilai)
                                                                        : ""
                                                                    : formData.nilai
                                                            }
                                                            onChange={(e) => {
                                                                const rawValue = e.target.value.replace(/\./g, ""); // hapus titik pemisah ribuan
                                                                const val = rawValue === "" ? "" : parseInt(rawValue, 10);

                                                                if (formData.jenis === "persentase") {
                                                                    // batasi max 100
                                                                    if (val === "" || val <= 100) {
                                                                        setFormData((prev) => ({ ...prev, nilai: val.toString() }));
                                                                    }
                                                                } else {
                                                                    // simpan nilai mentah (angka tanpa format)
                                                                    setFormData((prev) => ({ ...prev, nilai: val || "" }));
                                                                }
                                                            }}
                                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none
        ${formData.jenis === "nominal" ? "pl-12" : "pr-8"}`}
                                                            placeholder={formData.jenis === "persentase" ? "0-100" : "0"}
                                                            min="0"
                                                        />
                                                        {formData.jenis === 'nominal' && (
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <span className="text-gray-500 text-sm">Rp</span>
                                                            </div>
                                                        )}
                                                        {formData.jenis === 'persentase' && (
                                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                                <span className="text-gray-500 text-sm">%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Keterangan Field */}
                                                <div>
                                                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Keterangan
                                                    </label>
                                                    <textarea
                                                        id="keterangan"
                                                        value={formData.keterangan}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                                                        placeholder="Masukkan keterangan diskon (opsional)"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Berlaku Untuk Tagihan
                                                    </label>
                                                    {loadingTagihan ? (
                                                        <div className="flex justify-center py-4">
                                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                        </div>
                                                    ) : (
                                                        <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                                                            {tagihan.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {tagihan.map((item) => (
                                                                        <label key={item.id} className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={formData.tagihan_ids.includes(item.id)}
                                                                                onChange={() => handleCategoryChange(item.id)}
                                                                                className="form-checkbox text-blue-600 rounded"
                                                                            />
                                                                            <span className="ml-2 text-sm text-gray-700">{item.nama_tagihan}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-sm">Tidak ada jenis tagihan tersedia</p>
                                                            )}
                                                        </div>
                                                    )}
                                                    {formData.tagihan_ids.length === 0 && (
                                                        <p className="text-red-500 text-xs mt-1">Minimal pilih satu</p>
                                                    )}
                                                </div>

                                                {/* Status Field */}
                                                <div>
                                                    <label className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.status}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Aktifkan Potongan</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export const ModalDetailPotongan = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}potongan/${id}`, {
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
                    setData(null)
                })
                .finally(() => setLoading(false))
        }
    }, [isOpen, id])

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        })
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Potongan</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Informasi Potongan</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {[
                                                    ["Nama Potongan", data.data.nama],
                                                    ["Status", data.data.status == 1 ? "Aktif" : "Nonaktif"],
                                                    ["Nilai", data.data.nilai],
                                                    ["Keterangan", data.data.keterangan],
                                                    ["Tanggal Dibuat", formatDate(data.data.created_at)],
                                                    ["Tanggal Diperbarui", formatDate(data.data.updated_at)],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-600">{label}</span>
                                                        <span className="text-sm text-gray-900 mt-1 break-words whitespace-pre-line">
                                                            {value || "-"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Tagihan Terkait</h3>
                                            {data.data.tagihans && data.data.tagihans.length > 0 ? (
                                                <div className="space-y-3">
                                                    {data.data.tagihans.map((tagihan) => (
                                                        <div key={tagihan.id} className="bg-white p-3 rounded border border-blue-200">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-medium text-gray-800">{tagihan.nama_tagihan}</h4>
                                                                <span
                                                                    className={`px-2 py-1 text-xs rounded-full ${tagihan.status == 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                        }`}
                                                                >
                                                                    {tagihan.status == 1 ? "Aktif" : "Nonaktif"}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                                                <div className="capitalize">
                                                                    <span className="font-medium">Tipe:</span> {tagihan.tipe}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Nominal:</span> {formatCurrency(tagihan.nominal)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Jatuh Tempo:</span>{" "}
                                                                    {/* {formatDate(tagihan.jatuh_tempo)} */}
                                                                    {new Date(tagihan.jatuh_tempo).toLocaleString("id-ID", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    })}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Dibuat:</span> {formatDate(tagihan.created_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Tidak ada kategori terkait</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data potongan.</p>
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