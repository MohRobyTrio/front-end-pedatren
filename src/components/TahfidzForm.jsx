"use client"

import { useState } from "react"
import { FaCalendarAlt, FaQuran, FaBook, FaSave, FaUndo } from "react-icons/fa"

const TahfidzForm = ({ student, onSuccess }) => {
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split("T")[0],
        hafalanBaru: "",
        keteranganHafalanBaru: "",
        murojaah: "",
        murojaahHafalanBaru: "",
    })

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
                        <FaCalendarAlt className="inline mr-2 text-green-600" />
                        Tanggal
                    </label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Jumlah Hafalan Baru */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaQuran className="inline mr-2 text-green-600" />
                        Jumlah Hafalan Baru
                    </label>
                    <input
                        type="number"
                        name="hafalanBaru"
                        value={formData.hafalanBaru}
                        onChange={handleInputChange}
                        placeholder="Jumlah Ayat/Surat"
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Keterangan Hafalan Baru */}
                <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBook className="inline mr-2 text-green-600" />
                        Keterangan Hafalan Baru
                    </label>
                    <input
                        type="text"
                        name="keteranganHafalanBaru"
                        value={formData.keteranganHafalanBaru}
                        onChange={handleInputChange}
                        placeholder="Contoh: Al-Fatihah ayat 1-7"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Murojaah */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBook className="inline mr-2 text-blue-600" />
                        Murojaah
                    </label>
                    <textarea
                        name="murojaah"
                        value={formData.murojaah}
                        onChange={handleInputChange}
                        placeholder="Murojaah hafalan yang sudah dihafal siswa"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Murojaah Hafalan Baru */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBook className="inline mr-2 text-purple-600" />
                        Murojaah Hafalan Baru
                    </label>
                    <textarea
                        name="murojaahHafalanBaru"
                        value={formData.murojaahHafalanBaru}
                        onChange={handleInputChange}
                        placeholder="Murojaah hafalan baru (sebelum hafalan hari ini)"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium ${isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        }`}
                >
                    <FaSave />
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <FaUndo />
                    Kosongkan
                </button>
            </div>
        </form>
    )
}

export default TahfidzForm
