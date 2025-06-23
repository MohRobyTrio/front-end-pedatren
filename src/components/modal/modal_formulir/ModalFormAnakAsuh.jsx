import { faTimes, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import useLogout from "../../../hooks/Logout";
import { useNavigate } from "react-router-dom";

export const ModalFormAnakAsuh = ({
    isOpen,
    onClose,
    santriId,
    biodataId,
    refetchData,
    waliAsuhList,
    feature = 1, // 1 = Tambah, 2 = Pindah
    dataId 
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const isTambah = feature === 1;
    const endpoint = isTambah ? "anakasuh" : "anakasuh/pindah";
    const method = isTambah ? "POST" : "PUT";
    const id = isTambah ? biodataId : dataId;

    const [formData, setFormData] = useState({
        id_wali_asuh: "",
        tanggal_mulai: ""
    });

    // Dropdown search
    const [waliSearch, setWaliSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredWali, setFilteredWali] = useState([]);

    // Filter wali asuh berdasarkan input
    useEffect(() => {
        if (waliAsuhList) {
            setFilteredWali(
                waliAsuhList.filter(item =>
                    item.nama.toLowerCase().includes(waliSearch.toLowerCase())
                )
            );
        }
    }, [waliSearch, waliAsuhList]);

    const handleSelectWali = (item) => {
        setFormData({
            ...formData,
            id_wali_asuh: item.id
        });
        setWaliSearch(item.nama);
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmResult = await Swal.fire({
            title: isTambah
                ? "Yakin ingin mengirim data?"
                : "Yakin ingin memindahkan anak asuh?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isTambah ? "Ya, kirim" : "Ya, pindah",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'p-0 shadow-none border-0 bg-transparent'
                }
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const payload = isTambah
                ? { ...formData, id_santri: santriId || null }
                : formData;

            const response = await fetch(`${API_BASE_URL}formulir/${id}/${endpoint}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            const result = await response.json();
            Swal.close();

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: isTambah
                    ? "Data anak asuh berhasil ditambahkan."
                    : "Data pindah anak asuh berhasil disimpan.",
            });

            refetchData?.();
            onClose?.();
            // Reset form setelah submit
            setFormData({
                id_wali_asuh: "",
                tanggal_mulai: ""
            });
            setWaliSearch("");
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error.message}`,
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                {/* Background overlay */}
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

                {/* Modal content wrapper */}
                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                {isTambah ? "Tambah Anak Asuh" : "Pindah Anak Asuh"}
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <label htmlFor="waliAsuhId" className="block text-sm font-medium text-gray-700">
                                                        {isTambah ? "Wali Asuh *" : "Wali Asuh Baru *"}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Wali asuh"
                                                        value={waliSearch}
                                                        onChange={e => {
                                                            setWaliSearch(e.target.value);
                                                            setShowDropdown(true);
                                                        }}
                                                        onFocus={() => setShowDropdown(true)}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {showDropdown && waliSearch && filteredWali.length > 0 && (
                                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
                                                            {filteredWali.map(item => (
                                                                <li
                                                                    key={item.id}
                                                                    onClick={() => handleSelectWali(item)}
                                                                    className="p-2 cursor-pointer hover:bg-gray-50"
                                                                >
                                                                    {item.nama}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="tanggal_mulai" className="block text-gray-700">Tanggal Mulai *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_mulai"
                                                        name="tanggal_mulai"
                                                        value={formData.tanggal_mulai}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

// Modal keluar Anak Asuh
export const ModalFormKeluarAnakAsuh = ({
    isOpen,
    onClose,
    id,
    refetchData
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tanggal_berakhir: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

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

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/anakasuh/keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            console.log("formData:", formData);
            console.log("Response status:", response.status);


            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            const result = await response.json();
            Swal.close();

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data keluar anak asuh berhasil disimpan.",
            });

            refetchData?.();
            onClose?.();
            setFormData({ tanggal_berakhir: "" }); // Reset form
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error.message}`,
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                {/* Background overlay */}
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

                {/* Modal content wrapper */}
                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                Keluar Anak Asuh
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="tanggal_berakhir" className="block text-gray-700">
                                                        Tanggal Keluar *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_berakhir"
                                                        name="tanggal_berakhir"
                                                        value={formData.tanggal_berakhir}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_berakhir: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
