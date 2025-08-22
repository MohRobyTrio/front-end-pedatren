"use client"

import { useEffect, useState } from "react"
import { FaCalendarAlt, FaBook, FaSave, FaUndo, FaTasks, FaListOl, FaStickyNote, FaFlag, FaStar } from "react-icons/fa"
import useFetchTahunAjaran from "../hooks/hooks_menu_akademik/TahunAjaran";
import useFetchKitab from "../hooks/hooks_menu_data_pokok/Kitab";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useLogout from "../hooks/Logout";
import { API_BASE_URL } from "../hooks/config";
import { getCookie } from "../utils/cookieUtils";

const NadhomanForm = ({ student, onSuccess, refetchDetail }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { allTahunAjaran } = useFetchTahunAjaran();
    const { kitab, fetchKitab } = useFetchKitab();

    const kitabAktif = kitab?.filter(k => k.status == 1) || [];

    const location = useLocation();

    useEffect(() => {
        fetchKitab();
    }, [location.pathname, fetchKitab]);

    const tahunAjaranAktif = allTahunAjaran?.find(k => k.status == true) || null;

    const [formData, setFormData] = useState({
        santri_id: student.santri_id || "",
        kitab_id: "",
        tahun_ajaran_id: tahunAjaranAktif ? tahunAjaranAktif.id : "",
        tanggal: new Date().toISOString().split("T")[0],
        jenis_setoran: "",
        bait_mulai: "",
        bait_selesai: "",
        nilai: "",
        catatan: "",
        status: "",
    })

    useEffect(() => {
        if (tahunAjaranAktif) {
            setFormData(prev => ({
                ...prev,
                tahun_ajaran_id: tahunAjaranAktif.id
            }));
        }
    }, [tahunAjaranAktif]);

    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         tahun_ajaran_id: matchedTahunAjaran ? matchedTahunAjaran.id : "",
    //     }));
    // }, [matchedTahunAjaran]);

    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedKitab = kitabAktif.find(k => k.id == Number(formData.kitab_id));
    const totalBait = selectedKitab?.total_bait || 0;

    const baitOptions = Array.from({ length: totalBait }, (_, i) => i + 1);

    const baitSelesaiOptions = baitOptions.filter(num =>
        !formData.bait_mulai || num >= Number(formData.bait_mulai)
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Jika ganti kitab, reset bait
        if (name === "kitab_id") {
            setFormData(prev => ({
                ...prev,
                kitab_id: value,
                bait_mulai: "",
                bait_selesai: ""
            }));
            return;
        }

        // Validasi bait_selesai agar >= bait_mulai
        if (name === "bait_mulai") {
            if (formData.bait_selesai && Number(formData.bait_selesai) < Number(value)) {
                setFormData(prev => ({
                    ...prev,
                    bait_mulai: value,
                    bait_selesai: ""
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
            const response = await fetch(`${API_BASE_URL}nadhoman`, {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        console.log("Form data changed:", formData)
    }, [formData])

    const handleReset = () => {
        setFormData({
            santri_id: "",
            kitab_id: "",
            tahun_ajaran_id: "",
            tanggal: new Date().toISOString().split("T")[0],
            jenis_setoran: "",
            bait_mulai: "",
            bait_selesai: "",
            nilai: "",
            catatan: "",
            status: "",
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tanggal */}
                <div>
                    <label htmlFor="tahun_ajaran_id" className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBook className="inline mr-2 text-gray-400" />
                        Tahun Ajaran
                    </label>
                    <select
                        id="tahun_ajaran_id"
                        name="tahun_ajaran_id"
                        value={formData.tahun_ajaran_id || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="">Pilih Tahun Ajaran</option>
                        {allTahunAjaran.map((tahun) => (
                            <option key={tahun.id} value={tahun.id}>
                                {tahun.tahun_ajaran}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendarAlt className="inline mr-2 text-gray-400" />
                        Tanggal
                    </label>
                    <input
                        type="date"
                        id="tanggal"
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

                {/* Kitab */}
                <div>
                    <label htmlFor="kitab_id" className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBook className="inline mr-2 text-gray-400" />
                        Kitab
                    </label>
                    <select
                        id="kitab_id"
                        name="kitab_id"
                        value={formData.kitab_id || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        <option value="">Pilih Kitab</option>
                        {kitabAktif.map((kitab) => (
                            <option key={kitab.id} value={kitab.id}>
                                {kitab.nama_kitab}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Jumlah Hafalan Baru */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaListOl className="inline mr-2 text-gray-600" />
                        Ayat
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            name="bait_mulai"
                            value={formData.bait_mulai}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.kitab_id || baitOptions < 1}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${(!formData.kitab_id || baitOptions < 1) ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "border-gray-300"}`}
                        >
                            <option value="">Pilih bait mulai</option>
                            {baitOptions.map(num => (
                                <option key={num} value={num}>
                                    Bait {num}
                                </option>
                            ))}
                        </select>

                        <span className="text-gray-500">s.d.</span>

                        <select
                            name="bait_selesai"
                            value={formData.bait_selesai}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.kitab_id || baitSelesaiOptions < 1}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${(!formData.kitab_id || baitSelesaiOptions < 1) ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "border-gray-300"}`}
                        >
                            <option value="">Pilih bait selesai</option>
                            {baitSelesaiOptions.map(num => (
                                <option key={num} value={num}>
                                    Bait {num}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Keterangan */}
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

                <div className="col-span-full">
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
                        <option value="proses">On Progress</option>
                        <option value="tuntas">Tuntas</option>
                    </select>
                    {formData.status == "tuntas" && (
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
                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <FaUndo />
                    Reset
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <FaSave />
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
            </div>

        </form >
    )
}

export default NadhomanForm
