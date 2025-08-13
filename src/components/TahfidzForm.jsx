"use client"

import { useState } from "react"
import { FaCalendarAlt, FaQuran, FaBook, FaSave, FaUndo, FaTasks, FaListOl, FaStar, FaFlag, FaStickyNote } from "react-icons/fa"
import DropdownSurah from "../hooks/hook_dropdown/DropdownSurah";
import useSurahDetail from "../hooks/hook_dropdown/useSurahDetail";

const TahfidzForm = ({ student, onSuccess }) => {
    const { menuSurah } = DropdownSurah();
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split("T")[0],
        hafalanBaru: "",
        keteranganHafalanBaru: "",
        murojaah: "",
        murojaahHafalanBaru: "",
        surat: "",
        ayat_mulai: "",
        ayat_selesai: "",
    })

    const { surahDetail, loading } = useSurahDetail(formData.surat);

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
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Reset form
            setFormData({
                tanggal: new Date().toISOString().split("T")[0],
                hafalanBaru: "",
                keteranganHafalanBaru: "",
                murojaah: "",
                murojaahHafalanBaru: "",
            })

            // Call success callback
            if (onSuccess) {
                onSuccess()
            }

            // Show success message (you can replace with toast notification)
            alert("Data tahfidz berhasil disimpan!")
        } catch (error) {
            alert("Terjadi kesalahan saat menyimpan data")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReset = () => {
        setFormData({
            tanggal: new Date().toISOString().split("T")[0],
            hafalanBaru: "",
            keteranganHafalanBaru: "",
            murojaah: "",
            murojaahHafalanBaru: "",
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                        {menuSurah.map((item) => (
                            <option key={item.value} value={item.value}>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
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
                        <option value="Baik">Lancar</option>
                        <option value="Cukup">Cukup</option>
                        <option value="Kurang">Kurang</option>
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
                        <option value="">Pilih status</option>
                        <option value="on_progress">On Progress</option>
                        <option value="tuntas">Tuntas</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaStickyNote className="inline mr-2 text-gray-600" />
                        Catatan
                    </label>
                    <textarea
                        name="murojaahHafalanBaru"
                        value={formData.murojaahHafalanBaru}
                        onChange={handleInputChange}
                        placeholder="Masukkan Catatan"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-8 pt-6 border-t border-gray-200">
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
