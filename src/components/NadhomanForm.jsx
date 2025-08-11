"use client"

import { useState } from "react"
import { FaCalendarAlt, FaBook, FaFileAlt, FaSave, FaUndo } from "react-icons/fa"

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
                    <FaBook className="text-amber-600" />
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
                        <label htmlFor="hafalan_baru" className="block text-sm font-medium text-gray-700 mb-2">
                            <FaFileAlt className="inline mr-2 text-gray-400" />
                            Jumlah Hafalan Baru
                        </label>
                        <input
                            type="number"
                            id="hafalan_baru"
                            name="hafalan_baru"
                            value={formData.hafalan_baru}
                            onChange={handleInputChange}
                            placeholder="Masukkan jumlah bait"
                            min="1"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Masukkan jumlah bait yang dihafal</p>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                            <FaFileAlt className="inline mr-2 text-gray-400" />
                            Keterangan Hafalan Baru
                        </label>
                        <input
                            type="text"
                            id="keterangan"
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleInputChange}
                            placeholder="Masukkan keterangan bait"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Contoh: Bab 1 halaman 10-15</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <FaSave />
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <FaUndo />
                        Kosongkan
                    </button>
                </div>

            </form>
        </div>
    )
}

export default NadhomanForm
