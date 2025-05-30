import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";

export const ModalAddPerizinan = ({ isOpen, onClose, refetchData }) => {
    const { menuSantri } = useDropdownSantri();
    const { clearAuthData } = useLogout();
    const [santriId, setSantriId] = useState("");

    const [formData, setFormData] = useState({
        pengasuh_id: "",
        biktren_id: "",
        kamtib_id: "",
        pengantar_id: "",
        alasan_izin: "",
        alamat_tujuan: "",
        tanggal_mulai: "",
        tanggal_akhir: "",
        tanggal_kembali: "",
        jenis_izin: "",
        status: "",
        keterangan: "",
    });    

    useEffect(() => {
            if (isOpen) {
                setSantriId("");
                setFormData({
                    pengasuh_id: "",
                    biktren_id: "",
                    kamtib_id: "",
                    pengantar_id: "",
                    alasan_izin: "",
                    alamat_tujuan: "",
                    tanggal_mulai: "",
                    tanggal_akhir: "",
                    tanggal_kembali: "",
                    jenis_izin: "",
                    status: "",
                    keterangan: "",
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
            console.log(santriId);
            
            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/${santriId}/perizinan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            console.log(`Mengirim ke: ${API_BASE_URL}crud/${santriId}/perizinan`);

            Swal.close();
            if (!response) throw new Error("Tidak ada response dari server.");
            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                return;
            }

            const result = await response.json();

            // if (!response.ok) {
            //     throw new Error(result.message || "Terjadi kesalahan pada server.");
            // }

            // if ("status" in result && !result.status) {
           if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            console.log(result);

            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Data berhasil dikirim.`,
            });

            refetchData?.();
            onClose?.(); // tutup modal jika ada
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error}`,
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
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
                        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <Dialog.Title
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900 text-center mt-6"
                            >
                                Tambah Data Baru
                            </Dialog.Title>
                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">

                                            {/* FORM ISI */}
                                            <div className="space-y-4">                                                                                                
                                                <div>
                                                    <label htmlFor="id_santri" className="block text-gray-700">Nama Santri *</label>
                                                    <select
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        onChange={(e) => setSantriId(e.target.value)}
                                                        value={santriId}
                                                        disabled={menuSantri.length <= 1}
                                                        required
                                                    >
                                                        {menuSantri.map((santri, idx) => (
                                                            <option key={idx} value={santri.bio_id}>
                                                                {santri.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="alasan_izin" className="block text-gray-700">Alasan Izin *</label>
                                                    <textarea
                                                        name="alasan_izin"
                                                        onChange={(e) => setFormData({ ...formData, alasan_izin: e.target.value })}
                                                        value={formData.alasan_izin}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="alamat_tujuan" className="block text-gray-700">Alamat Tujuan *</label>
                                                    <textarea
                                                        name="alamat_tujuan"
                                                        onChange={(e) => setFormData({ ...formData, alamat_tujuan: e.target.value })}
                                                        value={formData.alamat_tujuan}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
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

                                                <div>
                                                    <label htmlFor="tanggal_akhir" className="block text-gray-700">Tanggal Akhir *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_akhir"
                                                        name="tanggal_akhir"
                                                        value={formData.tanggal_akhir}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_akhir: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                                                            
                                                <div>
                                                    <label htmlFor="tanggal_kembali" className="block text-gray-700">Tanggal Kembali *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_kembali"
                                                        name="tanggal_kembali"
                                                        value={formData.tanggal_kembali}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_kembali: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>   

                                                <div>
                                                    <label htmlFor="jenis_izin" className="block text-gray-700">Jenis Izin *</label>
                                                    <select
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        onChange={(e) => setFormData({ ...formData, jenis_izin: e.target.value })}
                                                        value={formData.jenis_izin}
                                                        required
                                                    >
                                                        <option value="">Pilih Jenis Izin</option>
                                                        <option value="Personal">Personal</option>
                                                        <option value="Rombongan">Rombongan</option>
                                                    </select>
                                                </div>        

                                                <div>
                                                    <label htmlFor="status" className="block text-gray-700">Status *</label>
                                                    <select
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        value={formData.status}
                                                        required
                                                    >
                                                        <option value="">Pilih Status</option>
                                                        <option value="sedang proses izin">Sedang proses izin</option>
                                                        <option value="perizinan diterima">Perizinan diterima</option>
                                                        <option value="sudah berada diluar pondok">Sudah berada diluar pondok</option>
                                                        <option value="perizinan ditolak">Perizinan ditolak</option>
                                                        <option value="dibatalkan">Dibatalkan</option>
                                                        <option value="telat(sudah kembali)">Telat(sudah kembali)</option>
                                                        <option value="telat(belum kembali)">Telat(belum kembali)</option>
                                                        <option value="kembali tepat waktu">Kembali tepat waktu</option>
                                                    </select>
                                                </div>    

                                                <div>
                                                    <label htmlFor="keterangan" className="block text-gray-700">Keterangan *</label>
                                                    <textarea
                                                        name="keterangan"
                                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                                        value={formData.keterangan}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>                                     
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
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