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

export const ModalAddOrEditUserOutltet = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const id = data?.id
    const [formData, setFormData] = useState({
        user_id: "",
        outlet_id: "",
        status: "",
    })
    const [users, setUsers] = useState([])
    const [outlets, setOutlets] = useState([])
    // const [loadingUsers, setLoadingUsers] = useState(false)

    const fetchUsers = async () => {
        // setLoadingUsers(true)
        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const result = await response.json()
                setUsers(result.data || [])
                console.log(result.data);

            }
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    const fetchOutlet = async () => {
        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}outlet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const result = await response.json()
                setOutlets(result.data.data || [])
                console.log(result.data.data);

            }
        } catch (error) {
            console.error("Error fetching outlets:", error)
        }
    }

    // useEffect(() => {
    //     console.log(data.kategori);
    // }, [data])

    useEffect(() => {
        async function fetchData() {
            if (isOpen) {
                await Promise.all([fetchOutlet(), fetchUsers()]);

                if (feature === 2 && data) {
                    setFormData({
                        user_id: data.user_id || "",
                        status: data.status === 1,
                        outlet_id: data.outlet_id || "",
                    });
                } else {
                    setFormData({
                        user_id: "",
                        status: true,
                        outlet_id: "",
                    });
                }
            }
        }

        fetchData();
    }, [isOpen, feature, data]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    // const handleCategoryChange = (categoryId) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         kategori_ids: prev.kategori_ids.includes(categoryId)
    //             ? prev.kategori_ids.filter((id) => id !== categoryId)
    //             : [...prev.kategori_ids, categoryId],
    //     }))
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // if (formData.kategori_ids.length === 0) {
        //     await Swal.fire({
        //         icon: "error",
        //         title: "Validasi Gagal",
        //         text: "Minimal pilih satu kategori.",
        //     })
        //     return
        // }

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
            const url = isEdit ? `${API_BASE_URL}detail-user-outlet/${id}` : `${API_BASE_URL}detail-user-outlet`

            const method = isEdit ? "PUT" : "POST"

            const payload = {
                user_id: formData.user_id,
                status: formData.status,
                outlet_id: formData.outlet_id,
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
                        "validation.unique": "Nama userOutltet sudah digunakan.",
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

            sessionStorage.removeItem("userOutltetData")
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
                                                    <label htmlFor="user_id" className="block text-gray-700">User *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                                        value={formData.user_id}
                                                        required
                                                    >
                                                        <option value="">Pilih User</option>
                                                        {users.map((item, idx) => (
                                                            <option key={idx} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="outlet_id" className="block text-gray-700">Outlet *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                        onChange={(e) => setFormData({ ...formData, outlet_id: e.target.value })}
                                                        value={formData.outlet_id}
                                                        required
                                                    >
                                                        <option value="">Pilih Outlet</option>
                                                        {outlets.map((item, idx) => (
                                                            <option key={idx} value={item.id}>
                                                                {item.nama_outlet}
                                                            </option>
                                                        ))}
                                                    </select>
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

                                                {/* <div>
                                                    <label className="block text-gray-700 mb-2">Kategori *</label>
                                                    {loadingUsers ? (
                                                        <div className="flex justify-center py-4">
                                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                        </div>
                                                    ) : (
                                                        <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                                                            {users.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {users.map((category) => (
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
                                                </div> */}
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

export const ModalDetailUserOutltet = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}detail-user-outlet/${id}`, {
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
        })
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
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail User Outltet</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Informasi User Outltet</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {[
                                                    //   ["ID", data.data.id],
                                                    ["Nama User Outltet", data.data.user.name || "-"],
                                                    ["Email", data.data.user.email || "-"],
                                                    ["Nama Outlet", data.data.outlet.nama_outlet || "-"],
                                                    ["Status", data.data.status == 1 ? "Aktif" : "Nonaktif"],
                                                    ["Tanggal Dibuat", formatDate(data.data.created_at)],
                                                    ["Tanggal Diperbarui", formatDate(data.data.updated_at)],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-600">{label}</span>
                                                        <span className="text-sm text-gray-900 mt-1">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Kategori Terkait</h3>
                                            {data.data.kategori && data.data.kategori.length > 0 ? (
                                                <div className="space-y-3">
                                                    {data.data.kategori.map((kategori) => (
                                                        <div key={kategori.id} className="bg-white p-3 rounded border border-blue-200">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-medium text-gray-800">{kategori.nama_kategori}</h4>
                                                                <span
                                                                    className={`px-2 py-1 text-xs rounded-full ${kategori.status == 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                        }`}
                                                                >
                                                                    {kategori.status == 1 ? "Aktif" : "Nonaktif"}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                                <div>
                                                                    <span className="font-medium">ID Kategori:</span> {kategori.id}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Dibuat:</span> {formatDate(kategori.created_at)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Status Pivot:</span>{" "}
                                                                    {kategori.pivot.status == 1 ? "Aktif" : "Nonaktif"}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Terhubung:</span>{" "}
                                                                    {formatDate(kategori.pivot.created_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Tidak ada kategori terkait</p>
                                            )}
                                        </div> */}
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data userOutltet.</p>
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