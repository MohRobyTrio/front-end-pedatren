import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import useDropdownWaliAsuh from "../../hooks/hook_dropdown/DropdownWaliAsuh";
import { Check, ChevronsUpDown } from "lucide-react";
export const ModalFormGrupWaliAsuh = ({
    isOpen,
    onClose,
    mode,
    grupData,
    wilayahList,
    refetchData
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [waliSearch, setWaliSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [waliAsuhId, setWaliAsuhId] = useState("");
    const [formData, setFormData] = useState({
        id_wilayah: "",
        nama_grup: "",
        jenis_kelamin: "",
        wali_asuh_id: ""
    });

    const { menuWaliAsuh3 } = useDropdownWaliAsuh();

    // Isi form dengan data grup jika mode edit
    console.log("Grup Data for Modal:", grupData);

    // Lookup pilihan yang aktif berdasarkan formData.wali_asuh_id
    const selectedWali = useMemo(
        () => menuWaliAsuh3.find((w) => w.id === formData.wali_asuh_id) || null,
        [menuWaliAsuh3, formData.wali_asuh_id]
    );

    // Filter berdasarkan search
    const filteredWali = useMemo(() => {
        if (!waliSearch) return menuWaliAsuh3;
        return menuWaliAsuh3.filter((w) =>
            w.value.toLowerCase().includes(waliSearch.toLowerCase())
        );
    }, [waliSearch, menuWaliAsuh3]);

    useEffect(() => {
        if (mode === 'edit' && grupData) {
            setWaliAsuhId(grupData.wali_asuh || "");
            setWaliSearch(grupData.nama_wali_asuh || "");
            setFormData({
                id_wilayah: grupData.id_wilayah || "",
                nama_grup: grupData.nama_grup || "",
                jenis_kelamin: grupData.jenis_kelamin || "",
                wali_asuh_id: grupData.wali_asuh_id || ""
            });
        } else {
            // Reset form untuk mode tambah
            setWaliAsuhId("");
            setWaliSearch("");
            setFormData({
                id_wilayah: "",
                nama_grup: "",
                jenis_kelamin: "",
                wali_asuh_id: ""
            });
        }
    }, [mode, grupData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (menuWaliAsuh3.length > 0) {
            const waliTerpilih = menuWaliAsuh3.find(item => item.id == waliAsuhId);
            if (waliTerpilih) {
                setWaliSearch(waliTerpilih.nama);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuWaliAsuh3]);

    // const filteredWali = menuWaliAsuh3.filter(item =>
    //     (item.nama || "").toLowerCase().includes(waliSearch.toLowerCase())
    // );


    const handleSelectWali = (item) => {
        setWaliSearch(item.nama);
        setWaliAsuhId(item.id);
        setShowDropdown(false);
        setFormData(prev => ({
            ...prev,
            wali_asuh_id: item.id
        }));
    };

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
            let url, method;

            if (mode === 'tambah') {
                url = `${API_BASE_URL}crud/grupwaliasuh`;
                method = "POST";
            } else {
                url = `${API_BASE_URL}crud/grupwaliasuh/${grupData.id}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
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
                let errorHtml = "";

                if (result.errors) {
                    // Loop semua field error
                    for (const [field, messages] of Object.entries(result.errors)) {
                        errorHtml += `<strong>${field}</strong>: ${messages.join(", ")}<br>`;
                    }
                } else {
                    errorHtml = result.message || "Terjadi kesalahan pada server.";
                }

                await Swal.fire({
                    icon: "error",
                    title: "Validasi Gagal",
                    html: `<div style="text-align: left;">${errorHtml}</div>`,
                });

                return; // stop di sini, jangan lanjut
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
                text: `Data grup wali asuh berhasil ${mode === 'tambah' ? 'ditambahkan' : 'diperbarui'}.`,
            });

            refetchData?.(true);
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error.message}`,
            });

            console.log("Error details:", error);
            console.log("Form data:", formData);
            console.log("response:", error.response || "No response data");
            console.log("API URL:", mode === 'tambah' ? `${API_BASE_URL}crud/grupwaliasuh` : `${API_BASE_URL}crud/grupwaliasuh/${grupData.id}`);
            ///debug untuk activate
            // console.log("Activate action:", isActivateAction);
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
                                                {mode === 'tambah' ? 'Tambah' : 'Edit'} Grup Wali Asuh
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">


                                                <div>
                                                    <label htmlFor="nama_grup" className="block text-sm font-medium text-gray-700">
                                                        Nama Grup *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama_grup"
                                                        name="nama_grup"
                                                        value={formData.nama_grup}
                                                        onChange={handleChange}
                                                        placeholder="Nama grup wali asuh"
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700">
                                                        Jenis Kelamin *
                                                    </label>
                                                    <select
                                                        id="jenis_kelamin"
                                                        name="jenis_kelamin"
                                                        value={formData.jenis_kelamin}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Pilih Jenis Kelamin</option>
                                                        <option value="l">Laki-laki</option>
                                                        <option value="p">Perempuan</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="id_wilayah" className="block text-sm font-medium text-gray-700">
                                                        Wilayah *
                                                    </label>
                                                    <select
                                                        id="id_wilayah"
                                                        name="id_wilayah"
                                                        value={formData.id_wilayah}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Pilih Wilayah</option>
                                                        {wilayahList.slice(1).map(wilayah => (
                                                            <option key={wilayah.id} value={wilayah.id}>
                                                                {wilayah.nama_wilayah}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-800">
                                                        Wali Asuh
                                                    </label>

                                                    <Combobox
                                                        value={formData.wali_asuh_id}
                                                        onChange={(value) =>
                                                            setFormData((prev) => ({ ...prev, wali_asuh_id: value }))
                                                        }
                                                    >
                                                        <div className="relative">
                                                            {/* Input */}
                                                            <Combobox.Input
                                                                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-900 focus:outline-none transition-all duration-200"
                                                                displayValue={() => (selectedWali ? selectedWali.nama : "")}
                                                                onChange={(event) => setWaliSearch(event.target.value)}
                                                                placeholder="Pilih wali asuh..."
                                                            />

                                                            {/* Tombol dropdown */}
                                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                                            </Combobox.Button>

                                                            {/* Dropdown Options */}
                                                            <Transition
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Combobox.Options className="absolute z-50 mt-1 max-h-48 sm:max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-gray-200">
                                                                    {filteredWali.length === 0 ? (
                                                                        <div className="cursor-default select-none py-2 px-4 text-gray-500">
                                                                            Tidak ditemukan
                                                                        </div>
                                                                    ) : (
                                                                        filteredWali.map((wali) => (
                                                                            <Combobox.Option
                                                                                key={wali.id}
                                                                                value={wali.id}
                                                                                className={({ active }) =>
                                                                                    `relative cursor-pointer select-none py-2 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                                                    }`
                                                                                }
                                                                            >
                                                                                {({ selected }) => (
                                                                                    <>
                                                                                        <span
                                                                                            className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                                                                }`}
                                                                                        >
                                                                                            {wali.nama}
                                                                                        </span>
                                                                                        {selected && (
                                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                                                {/* <Check className="h-5 w-5" /> */}
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
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {mode === 'tambah' ? 'Tambah' : 'Perbarui'}
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

export const ModalConfirmationStatusGrup = ({
    isOpen,
    onClose,
    grupData,
    refetchData,
    isActivate
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const endpoint = isActivate
                ? `${API_BASE_URL}crud/grupwaliasuh/${grupData.id}/activate`
                : `${API_BASE_URL}crud/grupwaliasuh/${grupData.id}`;

            const method = isActivate ? "PUT" : "DELETE";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (response.status === 401 && !window.sessionExpiredShown) {
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

            let result;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error("Respon bukan JSON:\n" + text);
            }

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Grup ${grupData.nama_grup} berhasil ${isActivate ? 'diaktifkan' : 'dinonaktifkan'}.`,
            });

            refetchData?.(true);
            onClose?.();
        } catch (error) {
            console.error("Gagal mengubah status grup:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message,
            });
        } finally {
            setIsProcessing(false);
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
                        <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 text-left w-full">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900 text-center mb-4"
                                        >
                                            Konfirmasi
                                        </Dialog.Title>
                                        <p className="text-center mb-6">
                                            {isActivate
                                                ? `Apakah Anda yakin ingin mengaktifkan grup ${grupData?.nama_grup || ''}?`
                                                : `Apakah Anda yakin ingin menonaktifkan grup ${grupData?.nama_grup || ''}?`}
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirm}
                                                disabled={isProcessing}
                                                className={`px-4 py-2 text-white rounded ${isActivate
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'
                                                    } disabled:opacity-50`}
                                            >
                                                {isProcessing ? (
                                                    <span>Memproses...</span>
                                                ) : isActivate ? (
                                                    'Aktifkan'
                                                ) : (
                                                    'Non-Aktifkan'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export const ModalStatusAnakAsuh = ({
    isOpen,
    onClose,
    anakAsuhId,
    anakAsuhData,
    refetchData
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            // const endpoint = `${API_BASE_URL}crud/grup-wali-asuh/${waliAsuhId}/anak-asuh/${anakAsuhId}/nonaktif`;
            const endpoint = `${API_BASE_URL}crud/grup-wali-asuh/${anakAsuhId}/nonaktif`;

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (response.status === 401 && !window.sessionExpiredShown) {
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

            let result;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error("Respon bukan JSON:\n" + text);
            }

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Anak ${anakAsuhData?.nama_anak || ''} berhasil dinonaktifkan dari grup wali asuh.`,
            });

            refetchData?.(true);
            onClose?.();
        } catch (error) {
            console.error("Gagal menonaktifkan anak asuh:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message,
            });
        } finally {
            setIsProcessing(false);
        }
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
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 text-left w-full">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900 text-center mb-4"
                                        >
                                            Konfirmasi
                                        </Dialog.Title>
                                        <p className="text-center mb-6">
                                            Apakah Anda yakin ingin menonaktifkan {anakAsuhData?.nama || '-'} dari grup wali asuh?
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirm}
                                                disabled={isProcessing}
                                                className="px-4 py-2 text-white rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <span>Memproses...</span>
                                                ) : (
                                                    'Non-Aktifkan'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export const ModalStatusWaliAsuh = ({
    isOpen,
    onClose,
    waliAsuhId,
    waliAsuhData,
    refetchData
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            // const endpoint = `${API_BASE_URL}crud/grup-wali-asuh/${waliAsuhId}/anak-asuh/${anakAsuhId}/nonaktif`;
            const endpoint = `${API_BASE_URL}crud/grup-wali-asuh/${waliAsuhId}/nonaktif/waliasuh`;

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            if (response.status === 401 && !window.sessionExpiredShown) {
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

            let result;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error("Respon bukan JSON:\n" + text);
            }

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Anak ${waliAsuhData || ''} berhasil dinonaktifkan dari grup`,
            });

            refetchData?.(true);
            onClose?.();
        } catch (error) {
            console.error("Gagal menonaktifkan wali asuh:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message,
            });
        } finally {
            setIsProcessing(false);
        }
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
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 text-left w-full">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900 text-center mb-4"
                                        >
                                            Konfirmasi
                                        </Dialog.Title>
                                        <p className="text-center mb-6">
                                            Apakah Anda yakin ingin menonaktifkan {waliAsuhData || '-'} dari grup wali asuh?
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirm}
                                                disabled={isProcessing}
                                                className="px-4 py-2 text-white rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <span>Memproses...</span>
                                                ) : (
                                                    'Non-Aktifkan'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
