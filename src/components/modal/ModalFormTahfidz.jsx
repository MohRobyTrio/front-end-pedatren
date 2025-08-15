"use client"
import { FaTimes, FaUser, FaQuran, FaBook, FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa"
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
import { ModalSelectSantri } from "../ModalSelectSantri";
import blankProfile from "../../assets/blank_profile.png";
import useFetchTahunAjaran from "../../hooks/hooks_menu_akademik/TahunAjaran";
import DropdownSurah from "../../hooks/hook_dropdown/DropdownSurah";
import useSurahDetail from "../../hooks/hook_dropdown/useSurahDetail";

export const MultiStepModal = ({ isOpen, onClose, formState }) => {
    const {
        currentStep,
        totalSteps,
        formData,
        errors,
        isSubmitting,
        updateFormData,
        nextStep,
        prevStep,
        handleSubmit,
        resetForm,
    } = formState

    if (!isOpen) return null

    const getStepIcon = (step) => {
        switch (step) {
            case 1:
                return <FaUser />
            case 2:
                return <FaQuran />
            case 3:
                return <FaBook />
            default:
                return <FaUser />
        }
    }

    const getStepTitle = (step) => {
        switch (step) {
            case 1:
                return "Informasi Siswa"
            case 2:
                return "Data Hafalan"
            case 3:
                return "Murojaah & Catatan"
            default:
                return "Step"
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    NIS <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nis}
                                    onChange={(e) => updateFormData("nis", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.nis ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan NIS siswa"
                                />
                                {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Siswa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nama_siswa}
                                    onChange={(e) => updateFormData("nama_siswa", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.nama_siswa ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan nama siswa"
                                />
                                {errors.nama_siswa && <p className="text-red-500 text-xs mt-1">{errors.nama_siswa}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.kelas}
                                    onChange={(e) => updateFormData("kelas", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.kelas ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Masukkan kelas siswa"
                                />
                                {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit Sekolah <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => updateFormData("unit", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.unit ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Pilih Unit Sekolah</option>
                                    <option value="PONDOKPA">PONDOKPA</option>
                                    <option value="YAYASAN">YAYASAN</option>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                                {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.tanggal}
                                    onChange={(e) => updateFormData("tanggal", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.tanggal ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah Hafalan Baru <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.hafalan_baru}
                                    onChange={(e) => updateFormData("hafalan_baru", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.hafalan_baru ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Jumlah ayat/surat"
                                    min="0"
                                />
                                {errors.hafalan_baru && <p className="text-red-500 text-xs mt-1">{errors.hafalan_baru}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keterangan Hafalan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.keterangan_hafalan}
                                    onChange={(e) => updateFormData("keterangan_hafalan", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.keterangan_hafalan ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Contoh: Al-Fatihah ayat 1-7"
                                />
                                {errors.keterangan_hafalan && <p className="text-red-500 text-xs mt-1">{errors.keterangan_hafalan}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Hafalan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.target_hafalan}
                                    onChange={(e) => updateFormData("target_hafalan", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.target_hafalan ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Pilih Target</option>
                                    <option value="1">1 Juz</option>
                                    <option value="5">5 Juz</option>
                                    <option value="10">10 Juz</option>
                                    <option value="15">15 Juz</option>
                                    <option value="20">20 Juz</option>
                                    <option value="30">30 Juz</option>
                                </select>
                                {errors.target_hafalan && <p className="text-red-500 text-xs mt-1">{errors.target_hafalan}</p>}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Murojaah <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.murojaah}
                                onChange={(e) => updateFormData("murojaah", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.murojaah ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Murojaah hafalan yang sudah dihafal siswa"
                                rows="3"
                            />
                            {errors.murojaah && <p className="text-red-500 text-xs mt-1">{errors.murojaah}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Murojaah Hafalan Baru <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.murojaah_hafalan_baru}
                                onChange={(e) => updateFormData("murojaah_hafalan_baru", e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.murojaah_hafalan_baru ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Murojaah hafalan baru (sebelum hafalan hari ini)"
                                rows="3"
                            />
                            {errors.murojaah_hafalan_baru && (
                                <p className="text-red-500 text-xs mt-1">{errors.murojaah_hafalan_baru}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Ustadz</label>
                                <textarea
                                    value={formData.catatan_ustadz}
                                    onChange={(e) => updateFormData("catatan_ustadz", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Catatan tambahan dari ustadz"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Bacaan</label>
                                <select
                                    value={formData.nilai_bacaan}
                                    onChange={(e) => updateFormData("nilai_bacaan", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Pilih Nilai</option>
                                    <option value="A">A - Sangat Baik</option>
                                    <option value="B">B - Baik</option>
                                    <option value="C">C - Cukup</option>
                                    <option value="D">D - Kurang</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="text-green-600 text-xl">{getStepIcon(currentStep)}</div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Tambah Data Tahfidz</h2>
                            <p className="text-sm text-gray-600">{getStepTitle(currentStep)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
                        <FaTimes />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">{renderStepContent()}</div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <button onClick={resetForm} className="text-gray-600 hover:text-gray-800 text-sm">
                        Reset Form
                    </button>

                    <div className="flex items-center gap-3">
                        {currentStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <FaChevronLeft />
                                Sebelumnya
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Selanjutnya
                                <FaChevronRight />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                <FaSave />
                                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ModalAddTahfidz = ({ isOpen, onClose, refetchData, feature, id }) => {
    const { menuSantri } = useDropdownSantri();
    const { allTahunAjaran } = useFetchTahunAjaran();
    const { menuSurah } = DropdownSurah();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [showSelectSantri, setShowSelectSantri] = useState(false);
    const [santri, setSantri] = useState("");

    const [formData, setFormData] = useState({
        tahun_ajaran_id: "",
        santri_id: "",
        tanggal: "",
        jenis_setoran: "",
        surat: "",
        ayat_mulai: "",
        ayat_selesai: "",
        nilai: "",
        catatan: "",
        status: "",
    });

    const getNomorSuratByNama = (namaSurat) => {
        console.log("Mencari nomor surah untuk:", namaSurat);
        const found = menuSurah.find((item) => item.nama == namaSurat);
        console.log(found);
        return found ? found.no : null;
    };

    // Ambil nomor surah dari nama yang dipilih
    const nomorSurat = getNomorSuratByNama(formData.surat);

    useEffect(() => {
        console.log(nomorSurat);

    }, [formData.surat, nomorSurat]);
    // Panggil hook pakai nomor
    const { surahDetail } = useSurahDetail(nomorSurat);

    const menuAyat =
        surahDetail?.jumlah_ayat
            ? Array.from({ length: surahDetail.jumlah_ayat }, (_, i) => ({
                value: i + 1,
                label: `Ayat ${i + 1}`,
            }))
            : [];

    useEffect(() => {
        setSantri("");
        if (isOpen && feature == 1) {
            setFormData({
                tahun_ajaran_id: "",
                santri_id: "",
                tanggal: "",
                jenis_setoran: "",
                surat: "",
                ayat_mulai: "",
                ayat_selesai: "",
                nilai: "",
                catatan: "",
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
                console.log("pengunujung show :", result);


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feature, id, isOpen]);

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
            console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}tahfidz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            // console.log({ id, endpoint, metod, formData });

            console.log(`Mengirim ke: ${API_BASE_URL}tahfidz`);


            const result = await response.json();
            console.log(result);

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

    console.log(feature == 2 || santri);
    console.log(feature);



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
                                            <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} feature={feature} />
                                            {/* FORM ISI */}
                                            {(santri || feature === 2) && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="tahun_ajaran_id" className="block text-gray-700">Tahun Ajaran *</label>
                                                        <select
                                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                            onChange={(e) => setFormData({ ...formData, tahun_ajaran_id: e.target.value })}
                                                            value={formData.tahun_ajaran_id}
                                                            required
                                                        >
                                                            <option value="">Pilih Tahun Ajaran</option>
                                                            {allTahunAjaran.map((item, idx) => (
                                                                <option key={idx} value={item.id}>
                                                                    {item.tahun_ajaran}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="tanggal" className="block text-gray-700">Tanggal *</label>
                                                        <input
                                                            type="date"
                                                            name="tanggal"
                                                            value={formData.tanggal}
                                                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="jenis_setoran" className="block text-gray-700">Jenis Setoran *</label>
                                                        <select
                                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                            onChange={(e) => setFormData({ ...formData, jenis_setoran: e.target.value })}
                                                            value={formData.jenis_setoran}
                                                            required
                                                        >
                                                            <option value="">Pilih Jenis Setoran</option>
                                                            <option value="baru">Baru</option>
                                                            <option value="murojaah">Murojaah</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="surat" className="block text-gray-700">Surat *</label>
                                                        <select
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) => {
                                                                const suratBaru = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    surat: suratBaru,
                                                                    ayat_mulai: suratBaru === "" ? "" : prev.ayat_mulai,
                                                                    ayat_selesai: suratBaru === "" ? "" : prev.ayat_selesai,
                                                                }));
                                                            }}
                                                            value={formData.surat}
                                                            required
                                                        >
                                                            <option value="">Pilih Surat</option>
                                                            {menuSurah.map((item, idx) => (
                                                                <option key={idx} value={item.nama}>
                                                                    {item.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 mb-1">Ayat *</label>
                                                        <div className="flex gap-3">
                                                            <select
                                                                name="ayat_mulai"
                                                                value={formData.ayat_mulai}
                                                                onChange={(e) => setFormData({ ...formData, ayat_mulai: e.target.value })}
                                                                required
                                                                disabled={!formData.surat || menuAyat.length < 1}
                                                                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!formData.surat || menuAyat.length < 1)
                                                                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                                                    : "border-gray-300"
                                                                    }`}
                                                            >
                                                                <option value="">Pilih ayat mulai</option>
                                                                {menuAyat.map((item) => (
                                                                    <option key={item.value} value={item.value}>
                                                                        {item.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <span className="self-center text-gray-500">s.d.</span>

                                                            <select
                                                                name="ayat_selesai"
                                                                value={formData.ayat_selesai}
                                                                onChange={(e) => setFormData({ ...formData, ayat_selesai: e.target.value })}
                                                                required
                                                                disabled={!formData.surat || menuAyat.length < 1}
                                                                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!formData.surat || menuAyat.length < 1)
                                                                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                                                    : "border-gray-300"
                                                                    }`}
                                                            >
                                                                <option value="">Pilih ayat selesai</option>
                                                                {menuAyat.map((item) => (
                                                                    <option key={item.value} value={item.value}>
                                                                        {item.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="nilai" className="block text-gray-700">Nilai *</label>
                                                        <select
                                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                            onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                                                            value={formData.nilai}
                                                            required
                                                        >
                                                            <option value="">Pilih Nilai</option>
                                                            <option value="lancar">Lancar</option>
                                                            <option value="cukup">Cukup</option>
                                                            <option value="kurang">Kurang</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 mb-1">Status *</label>
                                                        <div className="flex items-center gap-4">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="proses"
                                                                    checked={formData.status === "proses"}
                                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                                    className="form-radio text-indigo-600"
                                                                />
                                                                <span className="ml-2">Proses</span>
                                                            </label>

                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="tuntas"
                                                                    checked={formData.status === "tuntas"}
                                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                                    className="form-radio text-indigo-600"
                                                                />
                                                                <span className="ml-2">Tuntas</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="catatan" className="block text-gray-700">Catatan</label>
                                                        <textarea
                                                            id="catatan"
                                                            name="catatan"
                                                            value={formData.catatan}
                                                            onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm resize-y"
                                                            placeholder="Masukkan catatan"
                                                            rows={4}  // kamu bisa atur tinggi textarea sesuai kebutuhan
                                                            maxLength={1000}
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

const SantriInfoCard = ({ santri, setShowSelectSantri, feature }) => {
    if (!santri && feature !== 2) return null;

    return (
        <div className="relative p-4 pr-12 rounded-md bg-gray-50 shadow-sm mb-6 border border-blue-200">
            {/* Keterangan */}
            <div className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                Data Santri yang Dikunjungi
            </div>

            <button
                type="button"
                onClick={() => setShowSelectSantri(true)}
                className="absolute top-3 right-3 px-2 py-1 rounded hover:bg-blue-700 text-gray-700 bg-blue-500 text-white"
                aria-label="Ganti Santri"
            >
                <i className="fas fa-exchange-alt"></i>
            </button>

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