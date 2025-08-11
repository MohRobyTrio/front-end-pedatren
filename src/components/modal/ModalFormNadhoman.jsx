"use client"
import { FaTimes, FaBook, FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa"

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
    submitForm,
    resetForm,
  } = formState

  if (!isOpen) return null

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

  const stepTitles = ["Data Siswa", "Data Nadhoman", "Konfirmasi"]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => updateFormData("nis", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.nis ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan NIS siswa"
              />
              {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Siswa</label>
              <input
                type="text"
                value={formData.nama_siswa}
                onChange={(e) => updateFormData("nama_siswa", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.nama_siswa ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan nama siswa"
              />
              {errors.nama_siswa && <p className="text-red-500 text-xs mt-1">{errors.nama_siswa}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
              <input
                type="text"
                value={formData.kelas}
                onChange={(e) => updateFormData("kelas", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.kelas ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan kelas siswa"
              />
              {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => updateFormData("unit", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.unit ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan unit sekolah"
              />
              {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => updateFormData("tanggal", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.tanggal ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kitab</label>
              <select
                value={formData.kitab_id}
                onChange={(e) => updateFormData("kitab_id", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.kitab_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Pilih Kitab --</option>
                {kitabNadhomanList.map((kitab) => (
                  <option key={kitab.id} value={kitab.id}>
                    {kitab.nama}
                  </option>
                ))}
              </select>
              {errors.kitab_id && <p className="text-red-500 text-xs mt-1">{errors.kitab_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Hafalan Baru</label>
              <input
                type="number"
                value={formData.hafalan_baru}
                onChange={(e) => updateFormData("hafalan_baru", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.hafalan_baru ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan jumlah bait"
                min="1"
              />
              {errors.hafalan_baru && <p className="text-red-500 text-xs mt-1">{errors.hafalan_baru}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan Hafalan</label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={(e) => updateFormData("keterangan", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.keterangan ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan keterangan bait"
              />
              {errors.keterangan && <p className="text-red-500 text-xs mt-1">{errors.keterangan}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Ringkasan Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">NIS:</span>
                  <span className="font-medium">{formData.nis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama Siswa:</span>
                  <span className="font-medium">{formData.nama_siswa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kelas:</span>
                  <span className="font-medium">{formData.kelas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit:</span>
                  <span className="font-medium">{formData.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium">{formData.tanggal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kitab:</span>
                  <span className="font-medium">
                    {kitabNadhomanList.find((k) => k.id == formData.kitab_id)?.nama || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hafalan Baru:</span>
                  <span className="font-medium">{formData.hafalan_baru} Bait</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Keterangan:</span>
                  <span className="font-medium">{formData.keterangan}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan (Opsional)</label>
              <textarea
                value={formData.catatan_tambahan}
                onChange={(e) => updateFormData("catatan_tambahan", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="3"
                placeholder="Masukkan catatan tambahan jika ada"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FaBook className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tambah Data Nadhoman</h2>
              <p className="text-sm text-gray-600">
                Step {currentStep} dari {totalSteps}: {stepTitles[currentStep - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 < currentStep
                      ? "bg-amber-600 text-white"
                      : index + 1 === currentStep
                        ? "bg-amber-100 text-amber-600 border-2 border-amber-600"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1 < currentStep ? <FaCheck /> : index + 1}
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${index + 1 < currentStep ? "bg-amber-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            {stepTitles.map((title, index) => (
              <span key={index} className={index + 1 === currentStep ? "font-medium text-amber-600" : ""}>
                {title}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">{renderStepContent()}</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors"
                disabled={isSubmitting}
              >
                <FaArrowLeft className="text-sm" />
                Sebelumnya
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2 transition-colors"
                disabled={isSubmitting}
              >
                Selanjutnya
                <FaArrowRight className="text-sm" />
              </button>
            ) : (
              <button
                onClick={submitForm}
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2 transition-colors disabled:bg-amber-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Simpan Data
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiStepModal
