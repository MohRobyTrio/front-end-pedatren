import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDropdownGolonganJabatan from "../../../hooks/hook_dropdown/DropdownGolonganJabatan";
import useDropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembagaDoang";

export const ModalAddKaryawanFormulir = ({ isOpen, onClose, biodataId, cardId, refetchData, feature }) => {
    const { menuGolonganJabatan } = useDropdownGolonganJabatan();
    const { menuLembaga: lembagaOptions } = useDropdownLembaga();

    const isTambah = feature === 1;
    const endpoint = isTambah ? "karyawan" : "karyawan/pindah";
    const method = isTambah ? "POST" : "PUT";
    const id = isTambah ? biodataId : cardId;

    const [formData, setFormData] = useState({
        lembaga_id: "",
        golongan_jabatan_id: "",
        keterangan_jabatan: "",
        jabatan: "",
        tanggal_mulai: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi field wajib
        if (!formData.lembaga_id || !formData.golongan_jabatan_id || !formData.keterangan_jabatan || !formData.tanggal_mulai) {
            await Swal.fire({
                icon: "error",
                title: "Data tidak lengkap",
                text: "Semua field bertanda * wajib diisi",
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
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok || !result.data) throw new Error(result.message || "Terjadi kesalahan pada server.");

            await Swal.fire({ icon: "success", title: "Berhasil!", text: "Data karyawan berhasil disimpan." });
            refetchData?.();
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({ icon: "error", title: "Oops!", text: "Terjadi kesalahan saat mengirim data." });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="transition-transform duration-200 ease-in" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                        {isTambah ? "Tambah Data Karyawan" : "Pindah Lembaga Karyawan"}
                                    </Dialog.Title>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700">Lembaga *</label>
                                            <select
                                                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                                value={formData.lembaga_id}
                                                onChange={(e) => setFormData({ ...formData, lembaga_id: e.target.value })}
                                                required
                                            >
                                                {/* <option value="">Pilih Lembaga</option> */}
                                                {lembagaOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700">Keterangan Jabatan *</label>
                                            <input
                                                type="text"
                                                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                                value={formData.keterangan_jabatan}
                                                onChange={(e) => setFormData({ ...formData, keterangan_jabatan: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700">Golongan Jabatan *</label>
                                            <select
                                                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                                value={formData.golongan_jabatan_id}
                                                onChange={(e) => setFormData({ ...formData, golongan_jabatan_id: e.target.value })}
                                                required
                                            >
                                                {/* <option value="">Pilih Golongan Jabatan</option> */}
                                                {menuGolonganJabatan.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700">Jenis Kontrak</label>
                                            <select
                                                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                                value={formData.jabatan}
                                                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                            >
                                                <option value="">Pilih Jenis Kontrak</option>
                                                <option value="kultural">kultural</option>
                                                <option value="tetap">Tetap</option>
                                                <option value="kontrak">Kontrak</option>
                                                <option value="pengkaderan">Pengkaderan</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700">Tanggal Mulai *</label>
                                            <input
                                                type="date"
                                                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                                value={formData.tanggal_mulai}
                                                onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                        Simpan
                                    </button>
                                    <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
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

export const ModalKeluarKaryawanFormulir = ({ isOpen, onClose, id, refetchData }) => {
    const [formData, setFormData] = useState({
        tanggal_selesai: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.tanggal_selesai) {
            await Swal.fire({
                icon: "error",
                title: "Data tidak lengkap",
                text: "Tanggal keluar wajib diisi.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan data tanggal keluar sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/karyawan/keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok || !result.data) throw new Error(result.message || "Terjadi kesalahan pada server.");

            await Swal.fire({ icon: "success", title: "Berhasil!", text: "Data karyawan berhasil diperbarui dengan tanggal keluar." });
            refetchData?.();
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({ icon: "error", title: "Oops!", text: error.message || "Terjadi kesalahan saat mengirim data." });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="transition-transform duration-200 ease-in" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                        Masukkan Tanggal Keluar Karyawan
                                    </Dialog.Title>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="tanggal_selesai" className="block text-gray-700">Tanggal Keluar *</label>
                                            <input
                                                type="date"
                                                id="tanggal_selesai"
                                                name="tanggal_selesai"
                                                value={formData.tanggal_selesai}
                                                onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 sm:ml-3 sm:w-auto sm:text-sm">
                                        Simpan
                                    </button>
                                    <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
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