"use client"
import { FaTimes, FaUser, FaQuran, FaBook, FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa"

const MultiStepModal = ({ isOpen, onClose, formState }) => {
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nis ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nama_siswa ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.kelas ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.unit ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.tanggal ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.hafalan_baru ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.keterangan_hafalan ? "border-red-500" : "border-gray-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.target_hafalan ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.murojaah ? "border-red-500" : "border-gray-300"
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.murojaah_hafalan_baru ? "border-red-500" : "border-gray-300"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
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

export default MultiStepModal
