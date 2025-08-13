"use client"

import { useEffect, useState } from "react"
import { FaCalendarAlt, FaBook, FaFileAlt, FaSave, FaUndo, FaTasks, FaListOl, FaStickyNote, FaFlag, FaStar } from "react-icons/fa"

const NadhomanForm = ({ student, onSuccess }) => {
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split("T")[0],
        kitab_id: "",
        hafalan_baru: "",
        keterangan: "",
    })

    const kitabNadhomanList = [
        { id: 26, nama: "Bahasa Arab" },
        { id: 29, nama: "Amsilati" },
        { id: 30, nama: "Awamil" },
        { id: 31, nama: "Amsilati Tasrifiyah" },
        { id: 32, nama: "Jurumiyah Jawan" },
        { id: 33, nama: "Imrithi" },
        { id: 40, nama: "Alfiyah Ibnu Malik Awwal" },
        { id: 41, nama: "Alfiyah Ibnu Malik Tsani" },
    ]

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        console.log(e);
        
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
                kitab_id: "",
                hafalan_baru: "",
                keterangan: "",
            })

            // Call success callback
            if (onSuccess) {
                onSuccess()
            }

            // Show success message (you can replace with toast notification)
            alert("Data nadhoman berhasil disimpan!")
        } catch (error) {
            console.error("Error saving nadhoman data:", error)
            alert("Gagal menyimpan data nadhoman!")
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        console.log("Form data changed:", formData)
    }, [formData])

    const handleReset = () => {
        setFormData({
            tanggal: new Date().toISOString().split("T")[0],
            kitab_id: "",
            hafalan_baru: "",
            keterangan: "",
        })
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {/* <FaBook className="text-amber-600" /> */}
                    Form Tambah Hafalan Nadhoman
                </h3>
                <p className="text-sm text-gray-600 mt-1">Masukkan data hafalan nadhoman untuk siswa terpilih</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tanggal */}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                            value={formData.kitab_id}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="">-- Pilih Kitab --</option>
                            {kitabNadhomanList.map((kitab) => (
                                <option key={kitab.id} value={kitab.id}>
                                    {kitab.nama}
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
                                name="ayat_mulai"
                                value={formData.ayat_mulai}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                            >
                                <option value="">Pilih bait mulai</option>

                            </select>

                            <span className="text-gray-500">s.d.</span>

                            <select
                                name="ayat_selesai"
                                value={formData.ayat_selesai}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                            >
                                <option value="">Pilih bait selesai</option>

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
                            <option value="on_progress">On Progress</option>
                            <option value="tuntas">Tuntas</option>
                        </select>
                            {formData.status == "tuntas" && (
                                <p className="mt-2 text-sm text-red-600 italic">
                                    * Mohon pastikan hafalan surat ini telah benar-benar lengkap sesuai target hafalan.
                                </p>
                            )}
                    </div>

                </div>
                <div className="grid grid-cols-1 gap-6 mt-4">
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
        </div >
    )
}

export default NadhomanForm
