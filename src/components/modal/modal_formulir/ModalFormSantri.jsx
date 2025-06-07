import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import useLogout from "../../../hooks/Logout";
import DropdownAngkatan from "../../../hooks/hook_dropdown/DropdownAngkatan";
import { useNavigate } from "react-router-dom";

const ModalAddSantriFormulir = ({ isOpen, onClose, biodataId, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { menuAngkatanSantri } = DropdownAngkatan();
    const [formData, setFormData] = useState({
        nis: "",
        angkatan_id: "",
        tanggal_masuk: ""
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                nis: "",
                angkatan_id: "",
                tanggal_masuk: ""
            });
        }
    }, [isOpen]);

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
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${biodataId}/santri`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            
            const result = await response.json();
            console.log(result);
            
            Swal.close();
            if (response.status === 401) {
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
            // ✅ Kalau HTTP 500 atau fetch gagal, ini akan dilempar ke catch
            if (!response.ok) {
                if (result.errors && result.errors.nis) {
                    await Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        html: `<div style="text-align: center;">NIS sudah digunakan. Silakan masukkan NIS yang berbeda.</div>`,
                    });
                    return;
                }
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            // ✅ Jika status dari backend false meskipun HTTP 200
            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: center;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
            onClose?.(); // tutup modal jika ada
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
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
                        leave="transition-transform duration-200 ease-in"
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
                                                Tambah Data Baru
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">  
                                                <div>
                                                    <label htmlFor="nis" className="block text-gray-700">NIS *</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        id="nis"
                                                        name="nis"
                                                        value={formData.nis}
                                                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                                        maxLength={50}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan NIS"
                                                    />
                                                </div>  
                                                <div>
                                                    <label htmlFor="angkatan_id" className="block text-gray-700">Angkatan *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                        onChange={(e) => setFormData({ ...formData, angkatan_id: e.target.value })}
                                                        value={formData.angkatan_id}
                                                        required
                                                    >
                                                        {menuAngkatanSantri.map((santri, idx) => (
                                                            <option key={idx} value={santri.value}>
                                                                {santri.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>                                             
                                                <div>
                                                    <label htmlFor="tanggal_masuk" className="block text-gray-700">Tanggal Masuk *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_masuk"
                                                        name="tanggal_masuk"
                                                        value={formData.tanggal_masuk}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
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
                                        Cancel
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

export default ModalAddSantriFormulir;
