"use client"

import { useState } from "react"

export const useMultiStepFormNadhoman = (onClose, onSuccess) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Data Siswa
    nis: "",
    nama_siswa: "",
    kelas: "",
    unit: "",

    // Step 2: Data Nadhoman
    tanggal: new Date().toISOString().split("T")[0],
    kitab_id: "",
    hafalan_baru: "",
    keterangan: "",

    // Step 3: Konfirmasi
    catatan_tambahan: "",
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
        if (!formData.nis) newErrors.nis = "NIS harus diisi"
        if (!formData.nama_siswa) newErrors.nama_siswa = "Nama siswa harus diisi"
        if (!formData.kelas) newErrors.kelas = "Kelas harus diisi"
        if (!formData.unit) newErrors.unit = "Unit harus diisi"
        break

      case 2:
        if (!formData.tanggal) newErrors.tanggal = "Tanggal harus diisi"
        if (!formData.kitab_id) newErrors.kitab_id = "Kitab harus dipilih"
        if (!formData.hafalan_baru) newErrors.hafalan_baru = "Jumlah hafalan baru harus diisi"
        if (!formData.keterangan) newErrors.keterangan = "Keterangan harus diisi"
        break

      case 3:
        // Optional validation for final step
        break

      default:
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

  const goToStep = (step) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step)
    }
  }

  const submitForm = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setFormData({
        nis: "",
        nama_siswa: "",
        kelas: "",
        unit: "",
        tanggal: new Date().toISOString().split("T")[0],
        kitab_id: "",
        hafalan_baru: "",
        keterangan: "",
        catatan_tambahan: "",
      })
      setCurrentStep(1)
      setErrors({})

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      // Close modal
      if (onClose) {
        onClose()
      }

      // Show success message
      alert("Data nadhoman berhasil disimpan!")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Gagal menyimpan data nadhoman!")
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
      kitab_id: "",
      hafalan_baru: "",
      keterangan: "",
      catatan_tambahan: "",
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
    goToStep,
    submitForm,
    resetForm,
    validateStep,
  }
}
