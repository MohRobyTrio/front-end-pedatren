import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const ModalAddOrEditTagihan = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const id = data?.id;
    const [formData, setFormData] = useState({
        kode_tagihan: "",
        nama_tagihan: "",
        tipe: "bulanan",
        nominal: "",
        jatuh_tempo: "",
        status: true,
    });

    useEffect(() => {
        if (isOpen) {
            if (feature == 2 && data) {
                setFormData({
                    kode_tagihan: data.kode_tagihan || "",
                    nama_tagihan: data.nama_tagihan || "",
                    tipe: data.tipe || "bulanan",
                    nominal: data.nominal || "",
                    jatuh_tempo: data.jatuh_tempo || "",
                    status: data.status ?? true,
                });
            } else {
                // Reset saat tambah (feature === 1)
                setFormData({
                    kode_tagihan: "",
                    nama_tagihan: "",
                    tipe: "bulanan",
                    nominal: "",
                    jatuh_tempo: "",
                    status: true,
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
                ? `${API_BASE_URL}tagihan/${id}`
                : `${API_BASE_URL}tagihan`;

            const method = isEdit ? "PUT" : "POST";

            // Tentukan data yang dikirim
            const payload = {
                kode_tagihan: formData.kode_tagihan,
                nama_tagihan: formData.nama_tagihan,
                tipe: formData.tipe,
                nominal: parseFloat(formData.nominal),
                jatuh_tempo: formData.jatuh_tempo || null,
                status: formData.status,
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
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join("\n");

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
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-md sm:max-w-lg md:max-w-2xl sm:align-middle">
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="kode_tagihan" className="block text-gray-700">Kode Tagihan *</label>
                                                    <input
                                                        type="text"
                                                        id="kode_tagihan"
                                                        name="kode_tagihan"
                                                        value={formData.kode_tagihan}
                                                        onChange={(e) => setFormData({ ...formData, kode_tagihan: e.target.value })}
                                                        maxLength={50}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Kode Tagihan"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="nama_tagihan" className="block text-gray-700">Nama Tagihan *</label>
                                                    <input
                                                        type="text"
                                                        id="nama_tagihan"
                                                        name="nama_tagihan"
                                                        value={formData.nama_tagihan}
                                                        onChange={(e) => setFormData({ ...formData, nama_tagihan: e.target.value })}
                                                        maxLength={150}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Nama Tagihan"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="tipe" className="block text-gray-700">Tipe *</label>
                                                    <select
                                                        id="tipe"
                                                        name="tipe"
                                                        value={formData.tipe}
                                                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        <option value="bulanan">Bulanan</option>
                                                        <option value="semester">Semester</option>
                                                        <option value="tahunan">Tahunan</option>
                                                        <option value="sekali_bayar">Sekali Bayar</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="nominal" className="block text-gray-700">
                                                        Nominal *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            id="nominal"
                                                            name="nominal"
                                                            value={
                                                                formData.nominal
                                                                    ? new Intl.NumberFormat("id-ID").format(formData.nominal)
                                                                    : ""
                                                            }
                                                            onChange={(e) => {
                                                                // hapus titik pemisah ribuan
                                                                const rawValue = e.target.value.replace(/\./g, "");
                                                                const val = rawValue === "" ? "" : parseInt(rawValue, 10);

                                                                setFormData({ ...formData, nominal: val || "" });
                                                            }}
                                                            min="0"
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="Masukkan Nominal"
                                                        />

                                                        {/* Prefix Rp */}
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <span className="text-gray-500 text-sm">Rp</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="jatuh_tempo" className="block text-gray-700">Jatuh Tempo *</label>
                                                    <input
                                                        type="date"
                                                        id="jatuh_tempo"
                                                        name="jatuh_tempo"
                                                        value={formData.jatuh_tempo}
                                                        onChange={(e) => setFormData({ ...formData, jatuh_tempo: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700">Status Aktif *</label>
                                                    <div className="flex space-x-4 mt-1">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                value="YA"
                                                                checked={formData.status == true}
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
                                                                checked={formData.status == false}
                                                                onChange={() => setFormData({ ...formData, status: false })}
                                                                className="form-radio text-blue-500 focus:ring-blue-500"
                                                                required
                                                            />
                                                            <span className="ml-2 text-gray-700">Tidak</span>
                                                        </label>
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