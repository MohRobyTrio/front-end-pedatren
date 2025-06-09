import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import DropdownHubungan from "../../hooks/hook_dropdown/DropdownHubungan";
import { ModalSelectSantri } from "../ModalSelectSantri";
import blankProfile from "../../assets/blank_profile.png";

export const ModalAddPengunjung = ({ isOpen, onClose, refetchData, feature, id }) => {
    const { menuSantri } = useDropdownSantri();
    const { menuHubungan } = DropdownHubungan();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [showSelectSantri, setShowSelectSantri] = useState(false);
    const [santri, setSantri] = useState("");

    const [formData, setFormData] = useState({
        nik: "",
        nama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        santri_id: "",
        hubungan_id: "",
        jumlah_rombongan: "",
        tanggal_kunjungan: "",
        status: "",
    });

    useEffect(() => {
        setSantri("");
        if (isOpen && feature == 1) {
            setFormData({
                nik: "",
                nama: "",
                tempat_lahir: "",
                tanggal_lahir: "",
                jenis_kelamin: "",
                santri_id: "",
                hubungan_id: "",
                jumlah_rombongan: "",
                tanggal_kunjungan: "",
                status: "",
            });
        }
    }, [feature, isOpen]);

    useEffect(() => {
        if (isOpen && feature === 2 && formData.santri_id && menuSantri.length > 0) {
            const s = menuSantri.find((s) => s.id == formData.santri_id);
            if (s) setSantri(s);
        }
    }, [isOpen, feature, formData.santri_id, menuSantri]);


    useEffect(() => {
            const fetchData = async () => {
                try {
                    const token = sessionStorage.getItem("token") || getCookie("token");
                    const response = await fetch(`${API_BASE_URL}crud/${id}/pengunjung/show`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
    
                    if (!response.ok) throw new Error("Gagal mengambil data");
    
                    const result = await response.json();
                    console.log("pengunujung show :",result);
                    
    
                    if (result.data) {
                        setFormData({
                            nik: result.data.nik ?? "",
                            nama: result.data.nama ?? "",
                            tempat_lahir: result.data.tempat_lahir ?? "",
                            tanggal_lahir: result.data.tanggal_lahir ?? "",
                            jenis_kelamin: result.data.jenis_kelamin ?? "",
                            santri_id: result.data.santri_id ?? "",
                            hubungan_id: result.data.hubungan_id ?? "",
                            jumlah_rombongan: result.data.jumlah_rombongan ?? "",
                            tanggal_kunjungan: result.data.tanggal_kunjungan ?? "",
                            status: result.data.status ?? "",
                        });
                    }
                } catch (error) {
                    console.error("Gagal mengambil data perizinan:", error);
                    Swal.fire("Error", "Gagal mengambil data pengunjung", "error");
                }
            };
    
            if (isOpen && feature === 2) {
                setSantri("");
                setFormData({
                    nik: "",
                    nama: "",
                    tempat_lahir: "",
                    tanggal_lahir: "",
                    jenis_kelamin: "",
                    santri_id: "",
                    hubungan_id: "",
                    jumlah_rombongan: "",
                    tanggal_kunjungan: "",
                    status: "",
                });
                fetchData();
            }
        }, [feature, id, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if(feature == 1) {
        //     console.log("hahah");
            
        //     setFormData({ ...formData, santri_id: santri.id })
        // }

        if (formData.nik.length < 16) {
            await Swal.fire({
                title: "Oops!",
                text: "NIK minimal 16 karakter",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        const isTambah = feature == 1;
        const metod = isTambah ? "POST" : "PUT";
        const endpoint = isTambah ? "pengunjung" : `pengunjung/${id}`;

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
            const response = await fetch(`${API_BASE_URL}crud/${endpoint}`, {
                method: metod,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            // console.log({ id, endpoint, metod, formData });

            console.log(`Mengirim ke: ${API_BASE_URL}crud/pengunjung`);


            const result = await response.json();
            console.log(result);

            Swal.close();
            // if (!response) throw new Error("Tidak ada response dari server.");
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

            // if ("status" in result && !result.status) {
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

            // setSantri("");
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

    // useEffect(() => {
    //     console.log("data berubah");
    //     // if (isOpen && feature == 1) {
    //     //     setFormData({ ...formData, santri_id: santri.id })
    //     // }
    //     console.log(feature);
        
    //     console.log(santri);
    //     console.log(formData.santri_id);
    //     console.log(formData);
    // }, [formData, santri]);

    useEffect(() => {
        if (isOpen && feature === 1 && santri?.id && formData.santri_id !== santri.id) {
            console.log("data santri berubah");
            setFormData((prev) => ({ ...prev, santri_id: santri.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [santri, isOpen, feature]);


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
                                {santri && (
                                    feature === 1
                                        ? "Tambah Data Baru"
                                        : feature === 2
                                            ? "Edit Data"
                                            : null
                                )}
                                </Dialog.Title>
                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">

                                            {(feature === 1 && !santri) && (
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
                                            {santri && <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} feature={feature} />}
                                            {/* FORM ISI */}
                                            {(santri || feature === 2) && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="nik" className="block text-gray-700">NIK *</label>
                                                    <input
                                                        type="number"
                                                        name="nik"
                                                        value={formData.nik}
                                                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        placeholder="Masukkan NIK"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="nama" className="block text-gray-700">Nama *</label>
                                                    <input
                                                        type="text"
                                                        name="nama"
                                                        value={formData.nama}
                                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        placeholder="Masukkan Nama"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="tempat_lahir" className="block text-gray-700">Tempat Lahir *</label>
                                                    <input
                                                        type="text"
                                                        name="tempat_lahir"
                                                        value={formData.tempat_lahir}
                                                        onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        placeholder="Masukkan tempat lahir"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="tanggal_lahir" className="block text-gray-700">Tanggal Lahir *</label>
                                                    <input
                                                        type="date"
                                                        name="tanggal_lahir"
                                                        value={formData.tanggal_lahir}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-1">Jenis Kelamin *</label>
                                                    <div className="flex items-center gap-4">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="jenis_kelamin"
                                                                value="l"
                                                                checked={formData.jenis_kelamin === "l"}
                                                                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                                                                className="form-radio text-indigo-600"
                                                            />
                                                            <span className="ml-2">Laki-laki</span>
                                                        </label>

                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="jenis_kelamin"
                                                                value="p"
                                                                checked={formData.jenis_kelamin === "p"}
                                                                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                                                                className="form-radio text-indigo-600"
                                                            />
                                                            <span className="ml-2">Perempuan</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* <div>
                                                    <label htmlFor="santri_id" className="block text-gray-700">Santri *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuSantri.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, santri_id: e.target.value })}
                                                        value={formData.santri_id}
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
                                                <div>
                                                    <label htmlFor="hubungan_id" className="block text-gray-700">Hubungan *</label>
                                                    <select
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 capitalize ${menuHubungan.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                        onChange={(e) => setFormData({ ...formData, hubungan_id: e.target.value })}
                                                        value={formData.hubungan_id}
                                                        disabled={menuHubungan.length <= 1}
                                                        required
                                                    >
                                                        {menuHubungan.map((hubungan, idx) => (
                                                            <option key={idx} value={hubungan.value} className="capitalize">
                                                                {hubungan.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="jumlah_rombongan" className="block text-gray-700">Jumlah Rombongan *</label>
                                                    <input
                                                        type="number"
                                                        name="jumlah_rombongan"
                                                        value={formData.jumlah_rombongan}
                                                        onChange={(e) => setFormData({ ...formData, jumlah_rombongan: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        placeholder="Masukkan Jumlah Rombongan"
                                                        required
                                                    />
                                                </div>


                                                <div>
                                                    <label htmlFor="tanggal_kunjungan" className="block text-gray-700">Tanggal Kunjungan *</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="tanggal_kunjungan"
                                                        value={formData.tanggal_kunjungan}
                                                        onChange={(e) => setFormData({ ...formData, tanggal_kunjungan: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="status" className="block text-gray-700">Status *</label>
                                                    <select
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                        required
                                                    >
                                                        <option value="">Pilih Status</option>
                                                        <option value="menunggu">Menunggu</option>
                                                        <option value="berlangsung">Berlangsung</option>
                                                        <option value="selesai">Selesai</option>
                                                        <option value="ditolak">Ditolak</option>
                                                    </select>
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

const SantriInfoCard = ({ santri, setShowSelectSantri, feature }) => {
    if (!santri) return null;

    return (
        <div className="relative p-4 pr-12 rounded-md bg-gray-50 shadow-sm mb-6">
            {feature == 1 && (
                <button
                    type="button"
                    onClick={() => setShowSelectSantri(true)}
                    className="absolute top-3 right-3 px-2 py-1 rounded hover:bg-blue-700 text-gray-700 bg-blue-500 text-white"
                    aria-label="Ganti Santri"
                >
                    <i className="fas fa-exchange-alt"></i>
                </button>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">

                {/* Foto */}
                <div className="flex justify-center sm:justify-start">
                    <img
                        src={santri.foto_profil}
                        alt={santri.value}
                        className="w-32 h-40 object-cover rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = blankProfile;
                        }}
                    />
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <span className="font-semibold">Nama</span> <span>: {santri.value}</span>
                        <span className="font-semibold">NIS</span> <span>: {santri.nis}</span>
                        <span className="font-semibold">NIUP</span> <span>: {santri.niup}</span>
                        <span className="font-semibold">Angkatan</span> <span>: {santri.angkatan}</span>
                        <span className="font-semibold">Kota Asal</span> <span>: {santri.kota_asal}</span>
                    </div>
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