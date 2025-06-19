import Swal from "sweetalert2";
import useLogout from "../../../hooks/Logout";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";

export const ModalAddOrEditKamar = ({ isOpen, onClose, data, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah, forceFetchDropdownWilayah } = DropdownWilayah();
    // const id = data.id;
    const [formData, setFormData] = useState({
        blok_id: "",
        nama_kamar: "",
        kapasitas: "",
        status: ""
    });

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterWilayah = {
        wilayah: updateFirstOptionLabel(filterWilayah.wilayah, "Pilih Wilayah"),
        blok: updateFirstOptionLabel(filterWilayah.blok, "Pilih Blok"),
    };

    useEffect(() => {
        if (isOpen) {
            if (data) {
                setFormData({
                    nama_kamar: data.nama_kamar || "",
                    blok_id: data.blok.id || "",
                    kapasitas: data.kapasitas,
                    status: data.status == 1 || data.status == true ? true : false,
                });
            } else {
                // Reset saat tambah (feature === 1)
                handleFilterChangeWilayah({ wilayah: ""})
                setFormData({
                    nama_kamar: "",
                    blok_id: "",
                    kapasitas: "",
                    status: "",
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, data]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.kapasitas || Number(formData.kapasitas) < 1) {
            await Swal.fire({
                icon: "warning",
                title: "Kapasitas Tidak Valid",
                text: "Kapasitas harus lebih dari atau sama dengan 1.",
            });
            return;
        }

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
                ? `${API_BASE_URL}crud/kamar/${data.id}`
                : `${API_BASE_URL}crud/kamar`;

            const method = isEdit ? "PUT" : "POST";

            // Buat payload sesuai kondisi
            const payload = isEdit
                ? {
                    nama_kamar: formData.nama_kamar,
                    blok_id: formData.blok_id,
                    kapasitas: formData.kapasitas,
                    status: !!formData.status, // pastikan boolean
                }
                : {
                    nama_kamar: formData.nama_kamar,
                    blok_id: formData.blok_id,
                    kapasitas: formData.kapasitas,
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

            forceFetchDropdownWilayah();
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
                                                {!data ? "Tambah Data Baru" : "Edit Data"}
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                {!data && (
                                                    <>
                                                <div>
                                                    <label htmlFor="wilayah" className="block text-gray-700">Wilayah *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                        onChange={(e) => handleFilterChangeWilayah({ wilayah: e.target.value })}
                                                        value={selectedWilayah.wilayah}
                                                        required
                                                    >
                                                        {updatedFilterWilayah.wilayah.map((item, idx) => (
                                                            <option key={idx} value={item.value}>
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="blok_id" className="block text-gray-700">Blok *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${filterWilayah.blok.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            handleFilterChangeWilayah({ blok: value });
                                                            setFormData((prev) => ({ ...prev, blok_id: value }));
                                                        }}
                                                        value={selectedWilayah.blok}
                                                        disabled={filterWilayah.blok.length <= 1}
                                                        required
                                                    >
                                                        {updatedFilterWilayah.blok.map((item, idx) => (
                                                            <option key={idx} value={item.value}>
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                </>
                                                )}
                                                <div>
                                                    <label htmlFor="nama_kamar" className="block text-gray-700">Nama Kamar *</label>
                                                    <input
                                                        type="text"
                                                        id="nama_kamar"
                                                        name="nama_kamar"
                                                        value={formData.nama_kamar}
                                                        onChange={(e) => setFormData({ ...formData, nama_kamar: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Nama Kamar"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="kapasitas" className="block text-gray-700">Kapasitas *</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        id="kapasitas"
                                                        name="kapasitas"
                                                        value={formData.kapasitas}
                                                        onChange={(e) => setFormData({ ...formData, kapasitas: e.target.value })}
                                                        maxLength={50}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Kapasitas Kamar"
                                                    />
                                                </div>
                                                {/* {data != null && (
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
                                                )} */}
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

export const ModalDetailKamar = ({ isOpen, onClose, id }) => {
    console.log(id);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true);
            const token = sessionStorage.getItem("token") || getCookie("token");
            fetch(`${API_BASE_URL}crud/kamar/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data");
                    return res.json();
                })
                .then((json) => setData(json))
                .catch((err) => {
                    console.error(err);
                    setData(null);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, id]);

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
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full h-full relative max-h-[90vh] flex flex-col">
                            {/* Tombol Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="pt-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Kamar</Dialog.Title>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto pr-8 pl-8 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-2">
                                        {[
                                            ["Nama Kamar", data.nama_kamar],
                                            ["Nama Blok", data.blok?.nama_blok],
                                            ["Nama Wilayah", data.wilayah?.nama_wilayah],
                                            ["Kategori", data.wilayah?.kategori],
                                            ["Kapasitas", data.kapasitas],
                                            ["Slot Kosong", data.slot],
                                            ["Jumlah Penghuni", data.penghuni],
                                            ["Status", data.status == 1 ? "Aktif" : "Nonaktif"],
                                        ]
                                            .map(([label, value]) => (
                                                <div key={label} className="flex">
                                                    <div className="w-35 font-semibold text-gray-700">{label}</div>
                                                    <div className="flex-1 text-gray-900">: {value}</div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data kamar.</p>
                                )}
                            </div>

                            {/* Footer */}
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
    );
}