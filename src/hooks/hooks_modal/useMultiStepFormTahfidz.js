"use client"

import { useState } from "react"

export const useMultiStepFormTahfidz = (onClose, onSuccess) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Informasi Siswa
    nis: "",
    nama_siswa: "",
    kelas: "",
    unit: "",

    // Step 2: Data Hafalan
    tanggal: new Date().toISOString().split("T")[0],
    hafalan_baru: "",
    keterangan_hafalan: "",
    target_hafalan: "",

    // Step 3: Murojaah & Catatan
    murojaah: "",
    murojaah_hafalan_baru: "",
    catatan_ustadz: "",
    nilai_bacaan: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 3

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.nis.trim()) newErrors.nis = "NIS harus diisi"
        if (!formData.nama_siswa.trim()) newErrors.nama_siswa = "Nama siswa harus diisi"
        if (!formData.kelas.trim()) newErrors.kelas = "Kelas harus diisi"
        if (!formData.unit.trim()) newErrors.unit = "Unit harus diisi"
        break

      case 2:
        if (!formData.tanggal) newErrors.tanggal = "Tanggal harus diisi"
        if (!formData.hafalan_baru.trim()) newErrors.hafalan_baru = "Jumlah hafalan baru harus diisi"
        if (!formData.keterangan_hafalan.trim()) newErrors.keterangan_hafalan = "Keterangan hafalan harus diisi"
        if (!formData.target_hafalan.trim()) newErrors.target_hafalan = "Target hafalan harus diisi"
        break

      case 3:
        if (!formData.murojaah.trim()) newErrors.murojaah = "Murojaah harus diisi"
        if (!formData.murojaah_hafalan_baru.trim())
          newErrors.murojaah_hafalan_baru = "Murojaah hafalan baru harus diisi"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form
      setFormData({
        nis: "",
        nama_siswa: "",
        kelas: "",
        unit: "",
        tanggal: new Date().toISOString().split("T")[0],
        hafalan_baru: "",
        keterangan_hafalan: "",
        target_hafalan: "",
        murojaah: "",
        murojaah_hafalan_baru: "",
        catatan_ustadz: "",
        nilai_bacaan: "",
      })

      setCurrentStep(1)
      setErrors({})

      if (onSuccess) onSuccess()
      if (onClose) onClose()

      // Show success message
      alert("Data tahfidz berhasil disimpan!")
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nis: "",
      nama_siswa: "",
      kelas: "",
      unit: "",
      tanggal: new Date().toISOString().split("T")[0],
      hafalan_baru: "",
      keterangan_hafalan: "",
      target_hafalan: "",
      murojaah: "",
      murojaah_hafalan_baru: "",
      catatan_ustadz: "",
      nilai_bacaan: "",
    })
    setCurrentStep(1)
    setErrors({})
  }

  return {
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
    validateStep,
  }
}
