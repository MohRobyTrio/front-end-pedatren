import { Fragment, useEffect, useState } from "react";
import useDropdownWaliAsuh from "../../hooks/hook_dropdown/DropdownWaliAsuh";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import { SantriInfoCard, WaliAsuhInfoCard } from "../CardInfo";
import { ModalSelectWaliAsuh } from "../ModalSelectWaliAsuh";
import { ModalSelectSantri } from "../ModalSelectSantri";

export const ModalAddProgressAfektif = ({ isOpen, onClose, refetchData }) => {
    const { menuWaliAsuh } = useDropdownWaliAsuh();
    // const { menuSantri } = useDropdownSantri();
    const [showSelectWaliAsuh, setShowSelectWaliAsuh] = useState(false);
    const [waliAsuh, setWaliAsuh] = useState("");
    const [showSelectSantri, setShowSelectSantri] = useState(false);
    const [santri, setSantri] = useState("");
    const optionsNilai = ['A', 'B', 'C', 'D', 'E'];
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id_santri: "",
        id_wali_asuh: "",
        kepedulian_nilai: "",
        kepedulian_tindak_lanjut: "",
        kebersihan_nilai: "",
        kebersihan_tindak_lanjut: "",
        akhlak_nilai: "",
        akhlak_tindak_lanjut: "",
        tanggal_buat: "",
    });

    useEffect(() => {
        setWaliAsuh("");
        setSantri("");
        if (isOpen) {
            setFormData({
                id_santri: "",
                id_wali_asuh: "",
                kepedulian_nilai: "",
                kepedulian_tindak_lanjut: "",
                kebersihan_nilai: "",
                kebersihan_tindak_lanjut: "",
                akhlak_nilai: "",
                akhlak_tindak_lanjut: "",
                tanggal_buat: "",
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && waliAsuh?.id && formData.id_wali_asuh !== waliAsuh.id) {
            // console.log("data wali Asuh berubah");
            setFormData((prev) => ({ ...prev, id_wali_asuh: waliAsuh.id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waliAsuh, isOpen]);

    useEffect(() => {
        if (isOpen && santri?.id && formData.id_santri !== santri.id) {
            // console.log("data santri berubah");
            setFormData((prev) => ({ ...prev, id_santri: santri.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [santri, isOpen]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_santri) {
            await Swal.fire({
                icon: "warning",
                title: "Santri belum dipilih",
                text: "Harap pilih Santri terlebih dahulu.",
            });
            return;
        }

        if (!formData.id_wali_asuh) {
            await Swal.fire({
                icon: "warning",
                title: "Wali Asuh belum dipilih",
                text: "Harap pilih Wali Asuh terlebih dahulu.",
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
            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/catatan-afektif`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            // console.log({ id, endpoint, metod, formData });

            console.log(`Mengirim ke: ${API_BASE_URL}crud/catatan-afektif`);

            
            const result = await response.json();
            
            Swal.close();
            // if (!response) throw new Error("Tidak ada response dari server.");
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
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            // if ("status" in result && !result.status) {
            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            // console.log(result);

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
                        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
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
                                                 {/* --- Kartu Wali Asuh --- */}
                                                {waliAsuh ? (
                                                    <WaliAsuhInfoCard waliAsuh={waliAsuh} setShowSelectWaliAsuh={setShowSelectWaliAsuh} />
                                                ) : (
                                                    <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                        <p className="text-gray-600 mb-3">Belum ada data Wali Asuh/Pencatat dipilih</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectWaliAsuh(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Wali Asuh
                                                        </button>
                                                    </div>
                                                )}
                                                {santri ? (
                                                    <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} />
                                                ) : (
                                                    <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                        <p className="text-gray-600 mb-3">Belum ada data Santri dipilih</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectSantri(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Santri
                                                        </button>
                                                    </div>
                                                )}

 

                                                {/* <div>
                                                    <label htmlFor="id_wali_asuh" className="block text-gray-700">Nama Pencatat *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, id_wali_asuh: e.target.value })}
                                                        value={formData.id_wali_asuh}
                                                        disabled={menuWaliAsuh.length <= 1}
                                                        required
                                                    >
                                                        {menuWaliAsuh.map((waliAsuh, idx) => (
                                                            <option key={idx} value={waliAsuh.id}>
                                                                {waliAsuh.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="text-sm text-red-600 mb-1 italic">
                                                        * Harap lebih teliti memilih wali asuh karena data ini tidak bisa diedit.
                                                    </p>
                                                </div>

                                                <div>
                                                    <label htmlFor="id_santri" className="block text-gray-700">Nama Santri *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuSantri.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, id_santri: e.target.value })}
                                                        value={formData.id_santri}
                                                        disabled={menuSantri.length <= 1}
                                                        required
                                                    >
                                                        {menuSantri.map((santri, idx) => (
                                                            <option key={idx} value={santri.id}>
                                                                {santri.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div> */}


                                                {/* Kepedulian */}
                                                <div>
                                                    <label htmlFor="kepedulian_nilai" className="block text-gray-700">Nilai Kepedulian *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, kepedulian_nilai: e.target.value })}
                                                        value={formData.kepedulian_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="kepedulian_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Kepedulian *</label>
                                                    <textarea
                                                        name="kepedulian_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, kepedulian_tindak_lanjut: e.target.value })}
                                                        value={formData.kepedulian_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="kebersihan_nilai" className="block text-gray-700">Nilai Kebersihan *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, kebersihan_nilai: e.target.value })}
                                                        value={formData.kebersihan_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="kebersihan_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Kebersihan *</label>
                                                    <textarea
                                                        name="kebersihan_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, kebersihan_tindak_lanjut: e.target.value })}
                                                        value={formData.kebersihan_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="akhlak_nilai" className="block text-gray-700">Nilai Akhlak *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, akhlak_nilai: e.target.value })}
                                                        value={formData.akhlak_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="akhlak_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Akhlak *</label>
                                                    <textarea
                                                        name="akhlak_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, akhlak_tindak_lanjut: e.target.value })}
                                                        value={formData.akhlak_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="tanggal_buat" className="block text-gray-700">Tanggal Buat *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_buat"
                                                        name="tanggal_buat"
                                                        value={formData.tanggal_buat}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_buat: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            <ModalSelectWaliAsuh
                isOpen={showSelectWaliAsuh}
                onClose={() => setShowSelectWaliAsuh(false)}
                onWaliAsuhSelected={(waliAsuh) => setWaliAsuh(waliAsuh)}
            />
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => setShowSelectSantri(false)}
                onSantriSelected={(santri) => setSantri(santri)}
            />
        </Transition>
    );
};

export const ModalAddProgressKognitif = ({ isOpen, onClose, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { menuWaliAsuh } = useDropdownWaliAsuh();
    // const { menuSantri } = useDropdownSantri();
    const [showSelectWaliAsuh, setShowSelectWaliAsuh] = useState(false);
    const [waliAsuh, setWaliAsuh] = useState("");
    const [showSelectSantri, setShowSelectSantri] = useState(false);
    const [santri, setSantri] = useState("");
    const optionsNilai = ['A', 'B', 'C', 'D', 'E'];
    // const [querySantri, setQuerySantri] = useState('');

    // const filteredSantri =
    //     querySantri === ''
    //         ? menuSantri
    //         : menuSantri.filter((santri) =>
    //             santri.label.toLowerCase().includes(querySantri.toLowerCase())
    //         );


    const [formData, setFormData] = useState({
        id_santri: "",
        id_wali_asuh: "",
        kebahasaan_nilai: "",
        kebahasaan_tindak_lanjut: "",
        baca_kitab_kuning_nilai: "",
        baca_kitab_kuning_tindak_lanjut: "",
        hafalan_tahfidz_nilai: "",
        hafalan_tahfidz_tindak_lanjut: "",
        furudul_ainiyah_nilai: "",
        furudul_ainiyah_tindak_lanjut: "",
        tulis_alquran_nilai: "",
        tulis_alquran_tindak_lanjut: "",
        baca_alquran_nilai: "",
        baca_alquran_tindak_lanjut: "",
        tanggal_buat: "",
    });

    useEffect(() => {
        setWaliAsuh("");
        setSantri("");
        if (isOpen) {
            setFormData({
                id_santri: "",
                id_wali_asuh: "",
                kebahasaan_nilai: "",
                kebahasaan_tindak_lanjut: "",
                baca_kitab_kuning_nilai: "",
                baca_kitab_kuning_tindak_lanjut: "",
                hafalan_tahfidz_nilai: "",
                hafalan_tahfidz_tindak_lanjut: "",
                furudul_ainiyah_nilai: "",
                furudul_ainiyah_tindak_lanjut: "",
                tulis_alquran_nilai: "",
                tulis_alquran_tindak_lanjut: "",
                baca_alquran_nilai: "",
                baca_alquran_tindak_lanjut: "",
                tanggal_buat: "",
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && waliAsuh?.id && formData.id_wali_asuh !== waliAsuh.id) {
            // console.log("data wali Asuh berubah");
            setFormData((prev) => ({ ...prev, id_wali_asuh: waliAsuh.id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waliAsuh, isOpen]);

    useEffect(() => {
        if (isOpen && santri?.id && formData.id_santri !== santri.id) {
            // console.log("data santri berubah");
            setFormData((prev) => ({ ...prev, id_santri: santri.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [santri, isOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_santri) {
            await Swal.fire({
                icon: "warning",
                title: "Santri belum dipilih",
                text: "Harap pilih Santri terlebih dahulu.",
            });
            return;
        }

        if (!formData.id_wali_asuh) {
            await Swal.fire({
                icon: "warning",
                title: "Wali Asuh belum dipilih",
                text: "Harap pilih Wali Asuh terlebih dahulu.",
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
            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/catatan-kognitif`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            // console.log({ id, endpoint, metod, formData });

            console.log(`Mengirim ke: ${API_BASE_URL}crud/catatan-kognitif`);

            // if (!response) throw new Error("Tidak ada response dari server.");

            
            const result = await response.json();
            
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
            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            // if ("status" in result && !result.status) {
            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            // console.log(result);

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
                        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
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
                                                {waliAsuh ? (
                                                    <WaliAsuhInfoCard waliAsuh={waliAsuh} setShowSelectWaliAsuh={setShowSelectWaliAsuh} />
                                                ) : (
                                                    <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                        <p className="text-gray-600 mb-3">Belum ada data Wali Asuh/Pencatat dipilih</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectWaliAsuh(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Wali Asuh
                                                        </button>
                                                    </div>
                                                )}
                                                {santri ? (
                                                    <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} />
                                                ) : (
                                                    <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                        <p className="text-gray-600 mb-3">Belum ada data Santri dipilih</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectSantri(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Santri
                                                        </button>
                                                    </div>
                                                )}

                                                {/* <div>
                                                    <label htmlFor="id_wali_asuh" className="block text-gray-700">Nama Pencatat *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, id_wali_asuh: e.target.value })}
                                                        value={formData.id_wali_asuh}
                                                        disabled={menuWaliAsuh.length <= 1}
                                                        required
                                                    >
                                                        {menuWaliAsuh.map((waliAsuh, idx) => (
                                                            <option key={idx} value={waliAsuh.id}>
                                                                {waliAsuh.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="text-sm text-red-600 mb-1 italic">
                                                        * Harap lebih teliti memilih wali asuh karena data ini tidak bisa diedit.
                                                    </p>
                                                </div>

                                                <div>
                                                    <label htmlFor="id_santri" className="block text-gray-700">Nama Santri *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuSantri.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, id_santri: e.target.value })}
                                                        value={formData.id_santri}
                                                        disabled={menuSantri.length <= 1}
                                                        required
                                                    >
                                                        {menuSantri.map((santri, idx) => (
                                                            <option key={idx} value={santri.id}>
                                                                {santri.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div> */}

                                                {/* <div>
                                                    <label htmlFor="id_santri" className="block text-gray-700 mb-1">
                                                        Nama Santri *
                                                    </label>
                                                    <Combobox
                                                        value={menuSantri.find(s => s.id === formData.id_santri) || null}
                                                        onChange={(value) => setFormData({ ...formData, id_santri: value.id })}
                                                        disabled={menuSantri.length <= 1}
                                                    >
                                                        <div className="relative">
                                                            <Combobox.Input
                                                                className={`w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuSantri.length <= 1 ? 'bg-gray-200 text-gray-500' : 'border-gray-300'
                                                                    }`}
                                                                displayValue={(santri) => santri?.label || ''}
                                                                onChange={(event) => setQuerySantri(event.target.value)}
                                                                placeholder="Pilih santri..."
                                                                required
                                                            />
                                                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {filteredSantri.length === 0 && (
                                                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                                                                        Tidak ditemukan
                                                                    </div>
                                                                )}
                                                                {filteredSantri.map((santri, idx) => (
                                                                    <Combobox.Option
                                                                        key={idx}
                                                                        value={santri}
                                                                        className={({ active }) =>
                                                                            `cursor-pointer select-none relative py-2 px-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                    >
                                                                        {santri.label}
                                                                    </Combobox.Option>
                                                                ))}
                                                            </Combobox.Options>
                                                        </div>
                                                    </Combobox>
                                                </div> */}


                                                {/* Kepedulian */}
                                                <div>
                                                    <label htmlFor="kebahasaan_nilai" className="block text-gray-700">Nilai Kebahasaan *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, kebahasaan_nilai: e.target.value })}
                                                        value={formData.kebahasaan_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="kebahasaan_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Kebahasaan *</label>
                                                    <textarea
                                                        name="kebahasaan_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, kebahasaan_tindak_lanjut: e.target.value })}
                                                        value={formData.kebahasaan_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="baca_kitab_kuning_nilai" className="block text-gray-700">Nilai Baca Kitab Kuning *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, baca_kitab_kuning_nilai: e.target.value })}
                                                        value={formData.baca_kitab_kuning_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="baca_kitab_kuning_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Baca Kitab Kuning *</label>
                                                    <textarea
                                                        name="baca_kitab_kuning_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, baca_kitab_kuning_tindak_lanjut: e.target.value })}
                                                        value={formData.baca_kitab_kuning_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="hafalan_tahfidz_nilai" className="block text-gray-700">Nilai Hafalan Tahfidz *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, hafalan_tahfidz_nilai: e.target.value })}
                                                        value={formData.hafalan_tahfidz_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="hafalan_tahfidz_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Hafalan Tahfidz *</label>
                                                    <textarea
                                                        name="hafalan_tahfidz_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, hafalan_tahfidz_tindak_lanjut: e.target.value })}
                                                        value={formData.hafalan_tahfidz_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="furudul_ainiyah_nilai" className="block text-gray-700">Nilai Furudul Ainiyah *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, furudul_ainiyah_nilai: e.target.value })}
                                                        value={formData.furudul_ainiyah_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="furudul_ainiyah_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Furudul Ainiyah *</label>
                                                    <textarea
                                                        name="furudul_ainiyah_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, furudul_ainiyah_tindak_lanjut: e.target.value })}
                                                        value={formData.furudul_ainiyah_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="tulis_alquran_nilai" className="block text-gray-700">Nilai Tulis Al-Quran *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, tulis_alquran_nilai: e.target.value })}
                                                        value={formData.tulis_alquran_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="tulis_alquran_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Tulis Al-Quran *</label>
                                                    <textarea
                                                        name="tulis_alquran_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, tulis_alquran_tindak_lanjut: e.target.value })}
                                                        value={formData.tulis_alquran_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                {/* Kebersihan */}
                                                <div>
                                                    <label htmlFor="baca_alquran_nilai" className="block text-gray-700">Nilai Baca Al-Quran *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, baca_alquran_nilai: e.target.value })}
                                                        value={formData.baca_alquran_nilai}
                                                        required
                                                    >
                                                        <option value=""> Pilih Nilai</option>
                                                        {optionsNilai.map(n => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="baca_alquran_tindak_lanjut" className="block text-gray-700">Tindak Lanjut Baca Al-Quran *</label>
                                                    <textarea
                                                        name="baca_alquran_tindak_lanjut"
                                                        onChange={(e) => setFormData({ ...formData, baca_alquran_tindak_lanjut: e.target.value })}
                                                        value={formData.baca_alquran_tindak_lanjut}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Masukkan catatan atau tindak lanjut"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="tanggal_buat" className="block text-gray-700">Tanggal Buat *</label>
                                                    <input
                                                        type="date"
                                                        id="tanggal_buat"
                                                        name="tanggal_buat"
                                                        value={formData.tanggal_buat}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_buat: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            <ModalSelectWaliAsuh
                isOpen={showSelectWaliAsuh}
                onClose={() => setShowSelectWaliAsuh(false)}
                onWaliAsuhSelected={(waliAsuh) => setWaliAsuh(waliAsuh)}
            />
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => setShowSelectSantri(false)}
                onSantriSelected={(santri) => setSantri(santri)}
            />
        </Transition>
    );
};