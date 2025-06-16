import Swal from "sweetalert2";
import useLogout from "../../../hooks/Logout";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ModalAddOrEditWilayah = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    // const id = data.id;
    const [formData, setFormData] = useState({
        nama_wilayah: "",
        kategori: "",
        status: ""
    });

    useEffect(() => {
        if (isOpen) {
            if (data) {
                setFormData({
                    nama_wilayah: data.nama_wilayah || "",
                    kategori: data.kategori || "",
                    status: data.status === 1 || data.status === true ? true : false,
                });
            } else {
                // Reset saat tambah (feature === 1)
                setFormData({
                    nama_wilayah: "",
                    kategori: "",
                    status: "",
                });
            }
        }
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
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const token = sessionStorage.getItem("token") || getCookie("token");

            // Tentukan URL dan method berdasarkan ada/tidaknya data (data !== null berarti edit)
            const isEdit = !!data;
            const url = isEdit
                ? `${API_BASE_URL}crud/wilayah/${data.id}`
                : `${API_BASE_URL}crud/wilayah`;

            const method = isEdit ? "PUT" : "POST";

            // Buat payload sesuai kondisi
            const payload = isEdit
                ? {
                    nama_wilayah: formData.nama_wilayah,
                    kategori: formData.kategori,
                    status: !!formData.status, // pastikan boolean
                }
                : {
                    nama_wilayah: formData.nama_wilayah,
                    kategori: formData.kategori,
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
            console.log(result);


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

            if (!response.ok) {
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
                                                {feature == 1 ? "Tambah Data Baru" : "Edit Data"}
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="nama_wilayah" className="block text-gray-700">Nama Wilayah *</label>
                                                    <input
                                                        type="text"
                                                        id="nama_wilayah"
                                                        name="nama_wilayah"
                                                        value={formData.nama_wilayah}
                                                        onChange={(e) => setFormData({ ...formData, nama_wilayah: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Nama Wilayah"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="kategori" className="block text-gray-700">Kategori *</label>
                                                    <div className="flex space-x-4 mt-1">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="kategori"
                                                                value="putra"
                                                                checked={formData.kategori == "putra"}
                                                                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                                                className="form-radio text-blue-500 focus:ring-blue-500"
                                                                required
                                                            />
                                                            <span className="ml-2 text-gray-700">Putra</span>
                                                        </label>
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="kategori"
                                                                value="putri"
                                                                checked={formData.kategori == "putri"}
                                                                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                                                className="form-radio text-blue-500 focus:ring-blue-500"
                                                                required
                                                            />
                                                            <span className="ml-2 text-gray-700">Putri</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {data != null && (
                                                    <div>
                                                        <label className="block text-gray-700">Status Aktif *</label>
                                                        <div className="flex space-x-4 mt-1">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="YA"
                                                                    checked={formData.status === true}
                                                                    onChange={() => setFormData({ ...formData, status: true })}
                                                                    className="form-radio text-blue-500 focus:ring-blue-500"
                                                                    required
                                                                />
                                                                <span className="ml-2 text-gray-700">Ya</span>
                                                            </label>
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="TIDAK"
                                                                    checked={formData.status === false}
                                                                    onChange={() => setFormData({ ...formData, status: false })}
                                                                    className="form-radio text-blue-500 focus:ring-blue-500"
                                                                    required
                                                                />
                                                                <span className="ml-2 text-gray-700">Tidak</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
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

export default ModalAddOrEditWilayah;