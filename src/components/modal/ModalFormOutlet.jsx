"use client"

import Swal from "sweetalert2"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import useLogout from "../../hooks/Logout"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { OrbitProgress } from "react-loading-indicators"

export const ModalAddOrEditOutlet = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const id = data?.id
    const [formData, setFormData] = useState({
        nama_outlet: "",
        status: true,
        kategori_ids: [],
    })
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    const fetchCategories = async () => {
        setLoadingCategories(true)
        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}kategori`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const result = await response.json()
                setCategories(result.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoadingCategories(false)
        }
    }

    useEffect(() => {
        console.log(data.kategori);
    }, [data])

    useEffect(() => {
        if (isOpen) {
            fetchCategories()

            if (feature == 2 && data) {
                setFormData({
                    nama_outlet: data.nama_outlet || "",
                    status: data.status == 1 ? true : false,
                    kategori_ids: data.kategori ? data.kategori.map(item => item.id) : [],
                })
            } else {
                setFormData({
                    nama_outlet: "",
                    status: true,
                    kategori_ids: [],
                })
            }
        }
    }, [isOpen, feature, data])

    const handleCategoryChange = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            kategori_ids: prev.kategori_ids.includes(categoryId)
                ? prev.kategori_ids.filter((id) => id !== categoryId)
                : [...prev.kategori_ids, categoryId],
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.kategori_ids.length === 0) {
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
            const url = isEdit ? `${API_BASE_URL}outlet/${id}` : `${API_BASE_URL}outlet`

            const method = isEdit ? "PUT" : "POST"

            const payload = {
                nama_outlet: formData.nama_outlet,
                status: formData.status,
                kategori_ids: formData.kategori_ids,
            }
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2))

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
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
                        "validation.unique": "Nama outlet sudah digunakan.",
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

            sessionStorage.removeItem("outletData")
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
                                                <div>
                                                    <label htmlFor="nama_outlet" className="block text-gray-700">
                                                        Nama Outlet *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama_outlet"
                                                        name="nama_outlet"
                                                        value={formData.nama_outlet}
                                                        onChange={(e) => setFormData({ ...formData, nama_outlet: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Nama Outlet"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 mb-1">Status *</label>
                                                    <div className="flex items-center gap-4">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                value="true"
                                                                checked={formData.status === true}
                                                                onChange={() => setFormData({ ...formData, status: true })}
                                                                className="form-radio text-indigo-600"
                                                            />
                                                            <span className="ml-2">Aktif</span>
                                                        </label>

                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                value="false"
                                                                checked={formData.status === false}
                                                                onChange={() => setFormData({ ...formData, status: false })}
                                                                className="form-radio text-indigo-600"
                                                            />
                                                            <span className="ml-2">Nonaktif</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 mb-2">Kategori *</label>
                                                    {loadingCategories ? (
                                                        <div className="flex justify-center py-4">
                                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                        </div>
                                                    ) : (
                                                        <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                                                            {categories.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {categories.map((category) => (
                                                                        <label key={category.id} className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={formData.kategori_ids.includes(category.id)}
                                                                                onChange={() => handleCategoryChange(category.id)}
                                                                                className="form-checkbox text-blue-600 rounded"
                                                                            />
                                                                            <span className="ml-2 text-sm text-gray-700">{category.nama_kategori}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-sm">Tidak ada kategori tersedia</p>
                                                            )}
                                                        </div>
                                                    )}
                                                    {formData.kategori_ids.length === 0 && (
                                                        <p className="text-red-500 text-xs mt-1">Minimal pilih satu kategori</p>
                                                    )}
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

export const ModalDetailOutlet = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}outlet/${id}`, {
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
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full h-full relative max-h-[90vh] flex flex-col">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <div className="pt-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Outlet</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-8 pl-8 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-2">
                                        {[
                                            ["Nama Outlet", data.data.nama_outlet],
                                            ["Status", data.data.status == 1 ? "Aktif" : "Nonaktif"],
                                        ].map(([label, value]) => (
                                            <div key={label} className="flex">
                                                <div className="w-35 font-semibold text-gray-700">{label}</div>
                                                <div className="flex-1 text-gray-900">: {value}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data outlet.</p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 text-right space-x-2 bg-gray-100 px-4 py-3 rounded-b-lg border-t border-gray-300">
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
