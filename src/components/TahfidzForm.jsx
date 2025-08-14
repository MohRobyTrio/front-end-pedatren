"use client"

import { use, useEffect, useState } from "react"
import { FaCalendarAlt, FaQuran, FaSave, FaUndo, FaTasks, FaListOl, FaStar, FaFlag, FaStickyNote } from "react-icons/fa"
import DropdownSurah from "../hooks/hook_dropdown/DropdownSurah";
import useSurahDetail from "../hooks/hook_dropdown/useSurahDetail";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../hooks/config";
import { getCookie } from "../utils/cookieUtils";
import useLogout from "../hooks/Logout";
import { useNavigate } from "react-router-dom";
import useFetchTahunAjaran from "../hooks/hooks_menu_akademik/TahunAjaran";
import { set } from "react-hook-form";

const TahfidzForm = ({ student, onSuccess, refetchDetail }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate();
    const { menuSurah } = DropdownSurah();
    const { allTahunAjaran } = useFetchTahunAjaran();
    const matchedTahunAjaran = allTahunAjaran.find(
        (item) => item.tahun_ajaran === student.tahun_ajaran
    );
    const [formData, setFormData] = useState({
        tahun_ajaran_id: "",
        santri_id: student.santri_id || "",
        tanggal: new Date().toISOString().split("T")[0],
        jenis_setoran: "",
        surat: "",
        ayat_mulai: "",
        ayat_selesai: "",
        nilai: "",
        catatan: "",
        status: "",
    })

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            tahun_ajaran_id: matchedTahunAjaran ? matchedTahunAjaran.id : "",
        }));
    }, [matchedTahunAjaran]);

    const getNomorSuratByNama = (namaSurat) => {
        console.log("Mencari nomor surah untuk:", namaSurat);
        const found = menuSurah.find((item) => item.nama == namaSurat);
        console.log(found);
        return found ? found.no : null;
    };

    // Ambil nomor surah dari nama yang dipilih
    const nomorSurat = getNomorSuratByNama(formData.surat);

    const { surahDetail, loading } = useSurahDetail(nomorSurat);

    const handleInputChangeayat = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            let updated = { ...prev, [name]: value };

            // Validasi: ayat mulai tidak boleh > ayat selesai
            if (name === "ayat_mulai" && Number(value) > Number(prev.ayat_selesai)) {
                updated.ayat_selesai = value;
            }

            // Validasi: ayat selesai tidak boleh < ayat mulai
            if (name === "ayat_selesai" && Number(value) < Number(prev.ayat_mulai)) {
                updated.ayat_mulai = value;
            }

            return updated;
        });
    };

    // Generate daftar ayat sesuai jumlah ayat di surat yang dipilih
    const menuAyat =
        surahDetail?.jumlah_ayat
            ? Array.from({ length: surahDetail.jumlah_ayat }, (_, i) => ({
                value: i + 1,
                label: `Ayat ${i + 1}`,
            }))
            : [];

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

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
            setIsSubmitting(true);
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

            setIsSubmitting(false);
            
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
            onSuccess?.(true); // panggil callback onSuccess jika ada
            refetchDetail?.(student.santri_id);
            handleReset(); // reset form setelah sukses
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat mengirim data. ${error}`,
            });
        }
    };

    const handleReset = () => {
        setFormData({
            tanggal: new Date().toISOString().split("T")[0],
            tahun_ajaran_id: "",
            santri_id: "",
            jenis_setoran: "",
            surat: "",
            ayat_mulai: "",
            ayat_selesai: "",
            nilai: "",
            catatan: "",
            status: "",
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tanggal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendarAlt className="inline mr-2 text-gray-600" />
                        Tanggal
                    </label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaTasks className="inline mr-2 text-gray-600" />
                        Jenis Setoran
                    </label>
                    <select
                        name="jenis_setoran"
                        value={formData.jenis_setoran}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="">Pilih jenis setoran</option>
                        <option value="baru">Baru</option>
                        <option value="murojaah">Murojaah</option>
                    </select>
                </div>


                {/* Jumlah Hafalan Baru */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaQuran className="inline mr-2 text-gray-600" />
                        Surat
                    </label>
                    <select
                        name="surat"
                        value={formData.surat}
                        onChange={(e) => {
                            const suratBaru = e.target.value;
                            setFormData(prev => ({
                                ...prev,
                                surat: suratBaru,
                                ayat_mulai: suratBaru === "" ? "" : prev.ayat_mulai,
                                ayat_selesai: suratBaru === "" ? "" : prev.ayat_selesai,
                            }));
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="">Pilih Surat</option>
                        {menuSurah.map((item) => (
                            <option key={item.value} value={item.nama}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaListOl className="inline mr-2 text-gray-600" />
                        Ayat
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            name="ayat_mulai"
                            value={formData.ayat_mulai}
                            onChange={handleInputChangeayat}
                            required
                            disabled={!formData.surat || menuAyat.length < 1}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${(!formData.surat || menuAyat.length < 1) ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "border-gray-300"}`}
                        >
                            <option value="">Pilih ayat mulai</option>
                            {menuAyat.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <span className="text-gray-500">s.d.</span>

                        <select
                            name="ayat_selesai"
                            value={formData.ayat_selesai}
                            onChange={handleInputChangeayat}
                            required
                            disabled={!formData.surat || menuAyat.length < 1}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${(!formData.surat || menuAyat.length < 1) ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "border-gray-300"}`}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaStar className="inline mr-2 text-gray-600" />
                        Nilai
                    </label>
                    <select
                        name="nilai"
                        value={formData.nilai}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="">Pilih nilai</option>
                        <option value="lancar">Lancar</option>
                        <option value="cukup">Cukup</option>
                        <option value="kurang">Kurang</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaFlag className="inline mr-2 text-gray-600" />
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="on_progress">On Progress</option>
                        <option value="tuntas">Tuntas</option>
                    </select>
                    {formData.status === "tuntas" && (
                        <p className="mt-2 text-sm text-red-600 italic">
                            * Mohon pastikan hafalan surat ini telah benar-benar lengkap sesuai target hafalan.
                        </p>
                    )}

                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaStickyNote className="inline mr-2 text-gray-600" />
                        Catatan
                    </label>
                    <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleInputChange}
                        placeholder="Masukkan Catatan"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-8">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 justify-center"
                >
                    <FaUndo />
                    Reset
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium justify-center ${isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2"
                        }`}
                >
                    <FaSave />
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>


            </div>
        </form>
    )
}

export default TahfidzForm
