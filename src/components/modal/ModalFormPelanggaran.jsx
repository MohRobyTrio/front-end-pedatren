import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";
import { useNavigate } from "react-router-dom";
import { ModalSelectSantri } from "../ModalSelectSantri";

export const ModalAddPelanggaran = ({ isOpen, onClose, refetchData, feature, id, nama }) => {
    const { menuSantri } = useDropdownSantri();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [santriId, setSantriId] = useState(null);
    const [showSelectSantri, setShowSelectSantri] = useState(false);

    const [formData, setFormData] = useState({
        status_pelanggaran: "",
        jenis_putusan: "",
        jenis_pelanggaran: "",
        diproses_mahkamah: null,
        keterangan: "",
    });    

    useEffect(() => {
        if (isOpen && feature == 1) {
            setSantriId(null);
            setFormData({
                status_pelanggaran: "",
                jenis_putusan: "",
                jenis_pelanggaran: "",
                diproses_mahkamah: null,
                keterangan: "",
            });
        }
    }, [feature, isOpen]);

    useEffect(() => {      
        if (feature === 2 && nama && menuSantri.length > 0) {
            const matchedSantri = menuSantri.find((s) => s.label === nama);            
            if (matchedSantri) {
                setSantriId(matchedSantri);
            }
        }
    }, [feature, nama, menuSantri]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token") || getCookie("token");
                const response = await fetch(`${API_BASE_URL}crud/${id}/pelanggaran/show`, {
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
                        status_pelanggaran: result.data.status_pelanggaran ?? "",
                        jenis_putusan: result.data.jenis_putusan ?? "",
                        jenis_pelanggaran: result.data.jenis_pelanggaran ?? "",
                        diproses_mahkamah: result.data.diproses_mahkamah ?? "",
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
                status_pelanggaran: "",
                jenis_putusan: "",
                jenis_pelanggaran: "",
                diproses_mahkamah: null,
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
        const idSend = isTambah ? santriId.bio_id : id;

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
            console.log(santriId);
            
            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/${idSend}/pelanggaran`, {
                method: metod,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            console.log(`Mengirim ke: ${API_BASE_URL}crud/${santriId}/pelanggaran`);

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

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return;
            }

            console.log(result);

            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Data berhasil dikirim.`,
            });

            refetchData?.(true);
            onClose?.();
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
                                {feature == 1 ? "Tambah Data Baru" : "Edit Data"}
                            </Dialog.Title>
                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            {/* Pilih Santri Button */}
                                            {feature === 1 && (
                                                <div className={`mb-4 flex ${santriId ? 'justify-end' : 'justify-center'}`}>
                                                    <div className="flex-1 flex justify-between items-center max-w-2xl mx-auto">
                                                        {!santriId && (
                                                            <h2 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
                                                                Pilih Data Santri Terlebih Dahulu
                                                            </h2>
                                                        )}
                                                        <div className={`ml-auto ${!santriId ? 'relative' : ''}`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowSelectSantri(true)}
                                                                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >
                                                                {santriId ? "Ganti Santri" : "Pilih Santri"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Kartu Info Santri */}
                                            {santriId && <SantriInfoCard santri={santriId} />}

                                            {/* FORM ISI */}
                                            {(santriId || feature === 2) && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="status_pelanggaran" className="block text-gray-700">Status Pelanggaran *</label>
                                                        <select
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) => setFormData({ ...formData, status_pelanggaran: e.target.value })}
                                                            value={formData.status_pelanggaran}
                                                            required
                                                        >
                                                            <option value="">Pilih Status</option>
                                                            <option value="Belum diproses">Belum Diproses</option>
                                                            <option value="Sedang diproses">Sedang Diproses</option>
                                                            <option value="Rombongan">Sudah Diproses</option>
                                                        </select>
                                                    </div>        

                                                    <div>
                                                        <label htmlFor="jenis_putusan" className="block text-gray-700">Jenis Putusan *</label>
                                                        <select
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) => setFormData({ ...formData, jenis_putusan: e.target.value })}
                                                            value={formData.jenis_putusan}
                                                            required
                                                        >
                                                            <option value="">Pilih Jenis Putusan</option>
                                                            <option value="Belum ada putusan">Belum ada putusan</option>
                                                            <option value="Disanksi">Disanksi</option>
                                                            <option value="Dibebaskan">Dibebaskan</option>
                                                        </select>
                                                    </div>    

                                                    <div>
                                                        <label htmlFor="jenis_pelanggaran" className="block text-gray-700">Jenis Pelanggaran *</label>
                                                        <select
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) => setFormData({ ...formData, jenis_pelanggaran: e.target.value })}
                                                            value={formData.jenis_pelanggaran}
                                                            required
                                                        >
                                                            <option value="">Pilih Jenis Pelanggaran</option>
                                                            <option value="Ringan">Ringan</option>
                                                            <option value="Sedang">Sedang</option>
                                                            <option value="Berat">Berat</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-gray-700 mb-1">Diproses Mahkamah *</label>
                                                        <div className="flex items-center space-x-4">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="diproses_mahkamah"
                                                                    value="true"
                                                                    checked={formData.diproses_mahkamah === true || formData.diproses_mahkamah == 1}
                                                                    onChange={() => setFormData({ ...formData, diproses_mahkamah: true })}
                                                                    required
                                                                    className="form-radio text-blue-500"
                                                                />
                                                                <span className="ml-2">Ya</span>
                                                            </label>
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="diproses_mahkamah"
                                                                    value="false"
                                                                    checked={formData.diproses_mahkamah === false || formData.diproses_mahkamah == 0}
                                                                    onChange={() => setFormData({ ...formData, diproses_mahkamah: false })}
                                                                    required
                                                                    className="form-radio text-blue-500"
                                                                />
                                                                <span className="ml-2">Tidak</span>
                                                            </label>
                                                        </div>
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
                                            )}
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
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => setShowSelectSantri(false)}
                onSantriSelected={(santri) => setSantriId(santri)}
            />
        </Transition>
    );
};

const SantriInfoCard = ({ santri }) => {
    if (!santri) return null;

    return (
        <div className=" p-4 rounded-md bg-gray-50 shadow-sm mb-6">
            <div className="flex items-start space-x-12">
                {santri.foto_profil ? (
                    <img src={santri.foto_profil}
                        alt={santri.value}
                        className="w-24 h-24 rounded object-cover" />
                ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        <i className="fas fa-user text-gray-400 text-4xl"></i>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                    {/* Kolom Pertama */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Nama</span> <span>: {santri.value}</span>
                        <span className="font-semibold">NIS</span> <span>: {santri.nis}</span>
                        <span className="font-semibold">NIUP</span> <span>: {santri.niup}</span>
                        <span className="font-semibold">Angkatan</span> <span>: {santri.angkatan}</span>
                        <span className="font-semibold">Kota Asal</span> <span>: {santri.kota_asal}</span>
                    </div>

                    {/* Kolom Kedua */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Lembaga</span> <span>: {santri.lembaga}</span>
                        <span className="font-semibold">Wilayah</span> <span>: {santri.wilayah}</span>
                        <span className="font-semibold">Blok</span> <span>: {santri.blok}</span>
                        <span className="font-semibold">Kamar</span> <span>: {santri.kamar}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ModalAddBerkasPelanggaran = ({ isOpen, onClose, id, close }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert("Format file harus PDF, JPG, JPEG, atau PNG");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file maksimal 2MB");
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("File wajib diunggah");
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

            const formDataToSend = new FormData();

            // Tambahkan file
            formDataToSend.append("file_path", selectedFile);

            const response = await fetch(`${API_BASE_URL}crud/${id}/berkas-pelanggaran`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend,
            });

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

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return;
            }

            console.log(result);

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Data berhasil dikirim.`,
            });

            onClose?.(); // tutup modal jika ada
            close?.(); // tutup modal jika ada
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error.message}`,
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
                                Tambah Berkas Pelanggaran
                            </Dialog.Title>
                            <form className="w-full"
                                onSubmit={handleSubmit}
                            >
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">

                                            {/* FORM ISI */}
                                            {/* <label className="block text-gray-700 mb-2">File *</label> */}
                                            <div className="p-2 rounded-xl border border-gray-300 bg-white">
                                                <label
                                                    htmlFor="file_path"
                                                    className={`relative flex flex-col items-center justify-center w-full aspect-[4/3] min-h-[150px] cursor-pointer ${selectedFile ? '' : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg'}`}
                                                >
                                                    {selectedFile ? (
                                                        typeof selectedFile === 'object' && selectedFile.type?.startsWith("image") ? (
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    src={URL.createObjectURL(selectedFile)}
                                                                    alt="preview"
                                                                    className="h-full object-contain w-full"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedFile(null)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ) : typeof selectedFile === 'string' ? (
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    src={selectedFile}
                                                                    alt="preview"
                                                                    className="h-full object-contain w-full"
                                                                    onError={() => setSelectedFile(null)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedFile(null)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center p-4">
                                                                <p className="text-sm font-semibold">File {selectedFile.name} telah diunggah</p>
                                                                <p className="text-blue-600 underline">Klik untuk ganti</p>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500">
                                                                <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                                            </p>
                                                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 2MB)</p>
                                                        </div>
                                                    )}

                                                    <input
                                                        type="file"
                                                        id="file_path"
                                                        accept=".pdf,image/jpeg,image/jpg,image/png"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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