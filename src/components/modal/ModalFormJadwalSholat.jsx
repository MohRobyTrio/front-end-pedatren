import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useFetchSholat from "../../hooks/hook_menu_kepesantrenan/Sholat";

export const ModalAddOrEditJadwalSholat = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { sholat, fetchSholat } = useFetchSholat();
    const id = data?.id;
    const [formData, setFormData] = useState({
        sholat_id: "",
        jam_mulai: "",
        jam_selesai: "",
        berlaku_mulai: "",
        berlaku_sampai: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchSholat();
            if (feature == 2 && data) {
                setFormData({
                    sholat_id: data.sholat_id || "",
                    jam_mulai: data.jam_mulai || "",
                    jam_selesai: data.jam_selesai || "",
                    berlaku_mulai: data.berlaku_mulai || "",
                    berlaku_sampai: data.berlaku_sampai || "",
                });
            } else {
                // Reset saat tambah (feature === 1)
                setFormData({
                    sholat_id: "",
                    jam_mulai: "",
                    jam_selesai: "",
                    berlaku_mulai: "",
                    berlaku_sampai: "",
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, feature, data]);


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

            // Tentukan URL dan method berdasarkan feature
            const isEdit = feature === 2;
            const url = isEdit
                ? `${API_BASE_URL}jadwal-sholat/${id}`
                : `${API_BASE_URL}jadwal-sholat`;

            const method = isEdit ? "PUT" : "POST";

            // Tentukan data yang dikirim
            const payload = {
                sholat_id: formData.sholat_id,
                jam_mulai: formData.jam_mulai,
                jam_selesai: formData.jam_selesai,
                berlaku_mulai: formData.berlaku_mulai,
                berlaku_sampai: formData.berlaku_sampai,
            };
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            Swal.close();
            console.log(result);


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

            if (!response.ok) {
                if (result.error) {
                    const errorMessages = Object.values(result.error).flat().join("\n");

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    });

                    return;
                }

                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message || "Terjadi kesalahan saat mengirim data.",
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
                                                {feature == 1 ? "Tambah Data Baru" : "Edit"}
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="sholat_id" className="block text-gray-700">Sholat *</label>
                                                    <select
                                                        name="sholat_id"
                                                        value={formData.sholat_id}
                                                        onChange={(e) => setFormData({ ...formData, sholat_id: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        <option value="">Pilih Sholat</option>
                                                        {sholat.map(num => (
                                                            <option key={num.id} value={num.id}>
                                                                {num.nama_sholat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">
                                                        Jam *
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="time"
                                                            id="jam_mulai"
                                                            name="jam_mulai"
                                                            value={formData.jam_mulai}
                                                            onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                                                            step="1"
                                                            required
                                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="HH:mm:ss"
                                                        />

                                                        <span className="text-gray-500">s.d.</span>

                                                        <input
                                                            type="time"
                                                            id="jam_selesai"
                                                            name="jam_selesai"
                                                            value={formData.jam_selesai}
                                                            onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                                                            step="1"
                                                            required
                                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="HH:mm:ss"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">
                                                        Berlaku *
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="date"
                                                            id="berlaku_mulai"
                                                            name="berlaku_mulai"
                                                            value={formData.berlaku_mulai}
                                                            onChange={(e) => setFormData({ ...formData, berlaku_mulai: e.target.value })}
                                                            required
                                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="HH:mm:ss"
                                                        />

                                                        <span className="text-gray-500">s.d.</span>

                                                        <input
                                                            type="date"
                                                            id="berlaku_sampai"
                                                            name="berlaku_sampai"
                                                            value={formData.berlaku_sampai}
                                                            onChange={(e) => setFormData({ ...formData, berlaku_sampai: e.target.value })}
                                                            required
                                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="HH:mm:ss"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
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
    );
};