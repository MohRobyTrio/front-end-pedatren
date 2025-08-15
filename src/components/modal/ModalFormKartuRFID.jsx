import { Dialog, Transition } from "@headlessui/react";
import { SantriInfoCard } from "../CardInfo";
import { ModalSelectSantri } from "../ModalSelectSantri";
import { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../../hooks/config";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";

export const ModalAddKartuRFID = ({ isOpen, onClose, refetchData, feature, id, nama }) => {
    const { menuSantri } = useDropdownSantri();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [santri, setSantri] = useState("");

    // const [santri, setSantri] = useState(null);
    const [showSelectSantri, setShowSelectSantri] = useState(false);

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
        if (isOpen && feature === 1) {
            setSantri(null);
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
                status: "sedang proses izin",
                keterangan: "",
            });
        }
        if (isOpen && feature === 2 && nama && menuSantri.length > 0) {
            const s = menuSantri.find((s) => s.label === nama);
            if (s) setSantri(s);
        }
    }, [isOpen, feature, nama, menuSantri]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token") || getCookie("token");
                const response = await fetch(`${API_BASE_URL}crud/${id}/perizinan/show`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
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

                if (!response.ok) throw new Error("Gagal mengambil data");

                const result = await response.json();

                if (result.data) {
                    setFormData({
                        pengasuh_id: result.data.pengasuh_id ?? "",
                        biktren_id: result.data.biktren_id ?? "",
                        kamtib_id: result.data.kamtib_id ?? "",
                        pengantar_id: result.data.pengantar_id ?? "",
                        alasan_izin: result.data.alasan_izin ?? "",
                        alamat_tujuan: result.data.alamat_tujuan ?? "",
                        tanggal_mulai: result.data.tanggal_mulai ?? "",
                        tanggal_akhir: result.data.tanggal_akhir ?? "",
                        tanggal_kembali: result.data.tanggal_kembali ?? "",
                        jenis_izin: result.data.jenis_izin ?? "",
                        status: result.data.status ?? "",
                        keterangan: result.data.keterangan ?? "",
                    });
                }
            } catch (error) {
                console.error("Gagal mengambil data perizinan:", error);
                Swal.fire("Error", "Gagal mengambil data perizinan", "error");
            }
        };

        if (isOpen && feature === 2) {
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
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feature, id, isOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const isTambah = feature == 1;
        const metod = isTambah ? "POST" : "PUT";
        const idSend = isTambah ? santri.bio_id : id;

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
            console.log(santri.bio_id);

            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/${idSend}/perizinan`, {
                method: metod,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            console.log("Response dari API:", response);

            // console.log(`Mengirim ke: ${API_BASE_URL}crud/${santri}/perizinan`);

            Swal.close();
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
            if (!response) throw new Error("Tidak ada response dari server.");

            const result = await response.json();

            // if (!response.ok) {
            //     throw new Error(result.message || "Terjadi kesalahan pada server.");
            // }

            // if ("status" in result && !result.status) {
            console.log(result);
            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }


            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Data berhasil dikirim.`,
            });

            refetchData?.(true);
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
                        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
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
                                {feature === 2
                                    ? "Edit Data"
                                    : santri && feature === 1
                                        ? "Tambah Data Baru"
                                        : null}
                            </Dialog.Title>
                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            {/* Pilih Santri Button */}
                                            {(feature == 1 && !santri) && (
                                                <div className="mb-4 flex justify-center">
                                                    <div className="w-full max-w-2xl text-center">

                                                        <h2 className="text-lg font-semibold mb-4">
                                                            Pilih Data Santri Terlebih Dahulu
                                                        </h2>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectSantri(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Santri
                                                        </button>
                                                    </div>
                                                </div>

                                            )}
                                            {/* Kartu Info Santri */}
                                            {santri && <SantriInfoCard santri={santri} setShowSelectSantri={() => setShowSelectSantri(true)} />}

                                            {/* FORM ISI */}
                                            {(santri || feature === 2) && (
                                                <div className="space-y-4">
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
                                                            type="datetime-local"
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
                                                            type="datetime-local"
                                                            id="tanggal_akhir"
                                                            name="tanggal_akhir"
                                                            value={formData.tanggal_akhir}
                                                            onChange={(e) => setFormData({ ...formData, tanggal_akhir: e.target.value })}
                                                            required
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    {feature == 2 && (
                                                        <div>
                                                            <label htmlFor="tanggal_kembali" className="block text-gray-700">Tanggal Kembali *</label>
                                                            <input
                                                                type="datetime-local"
                                                                id="tanggal_kembali"
                                                                name="tanggal_kembali"
                                                                value={formData.tanggal_kembali}
                                                                onChange={(e) => setFormData({ ...formData, tanggal_kembali: e.target.value })}                                                                
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    )}

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

                                                    {feature == 2 && (
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
                                                                {/* <option value="telat(sudah kembali)">Telat(sudah kembali)</option> */}
                                                                {/* <option value="telat(belum kembali)">Telat(belum kembali)</option> */}
                                                                <option value="telat">Telat</option>
                                                                <option value="kembali tepat waktu">Kembali tepat waktu</option>
                                                            </select>
                                                        </div>
                                                    )}

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
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                                    {(santri || feature == 2) && (
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                        >
                                            Simpan
                                        </button>
                                    )}
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
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => setShowSelectSantri(false)}
                onSantriSelected={(santri) => setSantri(santri)}
            />
        </Transition>
    );
};