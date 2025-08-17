import { Fragment, useEffect, useState, useMemo } from "react"
import Swal from "sweetalert2"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { Dialog, Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import useLogout from "../../hooks/Logout"
import { useNavigate } from "react-router-dom"
import { SantriInfoCard } from "../CardInfo"
import { ModalSelectSantri } from "../ModalSelectSantri"

export const ModalAddProgressAfektif = ({ isOpen, onClose, refetchData }) => {
  const [showSelectSantri, setShowSelectSantri] = useState(false)
  const [santri, setSantri] = useState("")
  const optionsNilai = ["A", "B", "C", "D", "E"]
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    id_anak_asuh: "",
    kepedulian_nilai: "",
    kepedulian_tindak_lanjut: "",
    kebersihan_nilai: "",
    kebersihan_tindak_lanjut: "",
    akhlak_nilai: "",
    akhlak_tindak_lanjut: "",
  })

  useEffect(() => {
    setSantri("")
    if (isOpen) {
      setFormData({
        id_anak_asuh: "",
        kepedulian_nilai: "",
        kepedulian_tindak_lanjut: "",
        kebersihan_nilai: "",
        kebersihan_tindak_lanjut: "",
        akhlak_nilai: "",
        akhlak_tindak_lanjut: "",
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && santri?.id && formData.id_anak_asuh !== santri.id) {
      setFormData((prev) => ({ ...prev, id_anak_asuh: santri.id }))
    }
  }, [santri, isOpen, formData.id_anak_asuh])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.id_anak_asuh) {
      await Swal.fire({
        icon: "warning",
        title: "Santri belum dipilih",
        text: "Harap pilih Santri terlebih dahulu.",
      })
      return
    }

    const confirmResult = await Swal.fire({
      title: "Yakin ingin mengirim data?",
      text: "Pastikan semua data sudah benar!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, kirim",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) return

    try {
      Swal.fire({
        background: "transparent",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
        customClass: {
          popup: "p-0 shadow-none border-0 bg-transparent",
        },
      })

      console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2))
      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch(`${API_BASE_URL}crud/catatan-afektif`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      console.log(`Mengirim ke: ${API_BASE_URL}crud/catatan-afektif`)

      const result = await response.json()

      Swal.close()

      if (response.status === 401 && !window.sessionExpiredShown) {
        window.sessionExpiredShown = true
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Sesi anda telah berakhir, silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
        })
        clearAuthData()
        navigate("/login")
        return
      }

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.")
      }

      if (!("data" in result)) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${result.message}</div>`,
        })
        return
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dikirim.",
      })

      refetchData?.(true)
      onClose?.()
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Terjadi kesalahan saat mengirim data. ${error}`,
      })
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>

              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mt-6">
                Tambah Data Baru
              </Dialog.Title>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-2 sm:mt-0 text-left w-full">
                      <div className="space-y-4">
                        {santri ? (
                          <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} />
                        ) : (
                          <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                            <p className="text-gray-600 mb-3">Belum ada data Santri dipilih</p>
                            <button
                              type="button"
                              onClick={() => setShowSelectSantri(true)}
                              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Pilih Santri
                            </button>
                          </div>
                        )}

                        {/* Kepedulian */}
                        <div>
                          <label htmlFor="kepedulian_nilai" className="block text-gray-700">
                            Nilai Kepedulian *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, kepedulian_nilai: e.target.value })}
                            value={formData.kepedulian_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="kepedulian_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Kepedulian *
                          </label>
                          <textarea
                            name="kepedulian_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, kepedulian_tindak_lanjut: e.target.value })}
                            value={formData.kepedulian_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Kebersihan */}
                        <div>
                          <label htmlFor="kebersihan_nilai" className="block text-gray-700">
                            Nilai Kebersihan *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, kebersihan_nilai: e.target.value })}
                            value={formData.kebersihan_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="kebersihan_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Kebersihan *
                          </label>
                          <textarea
                            name="kebersihan_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, kebersihan_tindak_lanjut: e.target.value })}
                            value={formData.kebersihan_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Akhlak */}
                        <div>
                          <label htmlFor="akhlak_nilai" className="block text-gray-700">
                            Nilai Akhlak *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, akhlak_nilai: e.target.value })}
                            value={formData.akhlak_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="akhlak_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Akhlak *
                          </label>
                          <textarea
                            name="akhlak_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, akhlak_tindak_lanjut: e.target.value })}
                            value={formData.akhlak_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>

      <ModalSelectSantri
        isOpen={showSelectSantri}
        onClose={() => setShowSelectSantri(false)}
        onSantriSelected={(santri) => setSantri(santri)}
      />
    </Transition>
  )
}

export const ModalAddProgressKognitif = ({ isOpen, onClose, refetchData }) => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [showSelectSantri, setShowSelectSantri] = useState(false)
  const [santri, setSantri] = useState("")
  const optionsNilai = ["A", "B", "C", "D", "E"]

  const [formData, setFormData] = useState({
    id_anak_asuh: "",
    kebahasaan_nilai: "",
    kebahasaan_tindak_lanjut: "",
    baca_kitab_kuning_nilai: "",
    baca_kitab_kuning_tindak_lanjut: "",
    hafalan_tahfidz_nilai: "",
    hafalan_tahfidz_tindak_lanjut: "",
    furudul_ainiyah_nilai: "",
    furudul_ainiyah_tindak_lanjut: "",
    tulis_alquran_nilai: "",
    tulis_alquran_tindak_lanjut: "",
    baca_alquran_nilai: "",
    baca_alquran_tindak_lanjut: "",
  })

  useEffect(() => {
    setSantri("")
    if (isOpen) {
      setFormData({
        id_anak_asuh: "",
        kebahasaan_nilai: "",
        kebahasaan_tindak_lanjut: "",
        baca_kitab_kuning_nilai: "",
        baca_kitab_kuning_tindak_lanjut: "",
        hafalan_tahfidz_nilai: "",
        hafalan_tahfidz_tindak_lanjut: "",
        furudul_ainiyah_nilai: "",
        furudul_ainiyah_tindak_lanjut: "",
        tulis_alquran_nilai: "",
        tulis_alquran_tindak_lanjut: "",
        baca_alquran_nilai: "",
        baca_alquran_tindak_lanjut: "",
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && santri?.id && formData.id_anak_asuh !== santri.id) {
      setFormData((prev) => ({ ...prev, id_anak_asuh: santri.id }))
    }
  }, [santri, isOpen, formData.id_anak_asuh])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.id_anak_asuh) {
      await Swal.fire({
        icon: "warning",
        title: "Santri belum dipilih",
        text: "Harap pilih Santri terlebih dahulu.",
      })
      return
    }

    const confirmResult = await Swal.fire({
      title: "Yakin ingin mengirim data?",
      text: "Pastikan semua data sudah benar!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, kirim",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) return

    try {
      Swal.fire({
        background: "transparent",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
        customClass: {
          popup: "p-0 shadow-none border-0 bg-transparent",
        },
      })

      console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2))
      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch(`${API_BASE_URL}crud/catatan-kognitif`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      console.log(`Mengirim ke: ${API_BASE_URL}crud/catatan-kognitif`)

      const result = await response.json()

      Swal.close()

      if (response.status === 401 && !window.sessionExpiredShown) {
        window.sessionExpiredShown = true
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Sesi anda telah berakhir, silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
        })
        clearAuthData()
        navigate("/login")
        return
      }

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.")
      }

      if (!("data" in result)) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${result.message}</div>`,
        })
        return
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dikirim.",
      })

      refetchData?.(true)
      onClose?.()
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Terjadi kesalahan saat mengirim data. ${error}`,
      })
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>

              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mt-6">
                Tambah Data Baru
              </Dialog.Title>

              <form className="w-full" onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[70vh]">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-2 sm:mt-0 text-left w-full">
                      <div className="space-y-4">
                        {santri ? (
                          <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} />
                        ) : (
                          <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                            <p className="text-gray-600 mb-3">Belum ada data Santri dipilih</p>
                            <button
                              type="button"
                              onClick={() => setShowSelectSantri(true)}
                              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Pilih Santri
                            </button>
                          </div>
                        )}

                        {/* Kebahasaan */}
                        <div>
                          <label htmlFor="kebahasaan_nilai" className="block text-gray-700">
                            Nilai Kebahasaan *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, kebahasaan_nilai: e.target.value })}
                            value={formData.kebahasaan_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="kebahasaan_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Kebahasaan *
                          </label>
                          <textarea
                            name="kebahasaan_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, kebahasaan_tindak_lanjut: e.target.value })}
                            value={formData.kebahasaan_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Baca Kitab Kuning */}
                        <div>
                          <label htmlFor="baca_kitab_kuning_nilai" className="block text-gray-700">
                            Nilai Baca Kitab Kuning *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, baca_kitab_kuning_nilai: e.target.value })}
                            value={formData.baca_kitab_kuning_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="baca_kitab_kuning_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Baca Kitab Kuning *
                          </label>
                          <textarea
                            name="baca_kitab_kuning_tindak_lanjut"
                            onChange={(e) =>
                              setFormData({ ...formData, baca_kitab_kuning_tindak_lanjut: e.target.value })
                            }
                            value={formData.baca_kitab_kuning_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Hafalan Tahfidz */}
                        <div>
                          <label htmlFor="hafalan_tahfidz_nilai" className="block text-gray-700">
                            Nilai Hafalan Tahfidz *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, hafalan_tahfidz_nilai: e.target.value })}
                            value={formData.hafalan_tahfidz_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="hafalan_tahfidz_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Hafalan Tahfidz *
                          </label>
                          <textarea
                            name="hafalan_tahfidz_tindak_lanjut"
                            onChange={(e) =>
                              setFormData({ ...formData, hafalan_tahfidz_tindak_lanjut: e.target.value })
                            }
                            value={formData.hafalan_tahfidz_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Furudul Ainiyah */}
                        <div>
                          <label htmlFor="furudul_ainiyah_nilai" className="block text-gray-700">
                            Nilai Furudul Ainiyah *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, furudul_ainiyah_nilai: e.target.value })}
                            value={formData.furudul_ainiyah_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="furudul_ainiyah_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Furudul Ainiyah *
                          </label>
                          <textarea
                            name="furudul_ainiyah_tindak_lanjut"
                            onChange={(e) =>
                              setFormData({ ...formData, furudul_ainiyah_tindak_lanjut: e.target.value })
                            }
                            value={formData.furudul_ainiyah_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Tulis Al-Quran */}
                        <div>
                          <label htmlFor="tulis_alquran_nilai" className="block text-gray-700">
                            Nilai Tulis Al-Quran *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, tulis_alquran_nilai: e.target.value })}
                            value={formData.tulis_alquran_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="tulis_alquran_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Tulis Al-Quran *
                          </label>
                          <textarea
                            name="tulis_alquran_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, tulis_alquran_tindak_lanjut: e.target.value })}
                            value={formData.tulis_alquran_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>

                        {/* Baca Al-Quran */}
                        <div>
                          <label htmlFor="baca_alquran_nilai" className="block text-gray-700">
                            Nilai Baca Al-Quran *
                          </label>
                          <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setFormData({ ...formData, baca_alquran_nilai: e.target.value })}
                            value={formData.baca_alquran_nilai}
                            required
                          >
                            <option value="">Pilih Nilai</option>
                            {optionsNilai.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="baca_alquran_tindak_lanjut" className="block text-gray-700">
                            Tindak Lanjut Baca Al-Quran *
                          </label>
                          <textarea
                            name="baca_alquran_tindak_lanjut"
                            onChange={(e) => setFormData({ ...formData, baca_alquran_tindak_lanjut: e.target.value })}
                            value={formData.baca_alquran_tindak_lanjut}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan catatan atau tindak lanjut"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>

      <ModalSelectSantri
        isOpen={showSelectSantri}
        onClose={() => setShowSelectSantri(false)}
        onSantriSelected={(santri) => setSantri(santri)}
      />
    </Transition>
  )
}

export const ModalEditCatatan = ({ isOpen, onClose, id, endpoint, refetchData, initialData }) => {
  const kategoriOptionsKognitif = [
    { label: "kebahasaan", value: "kebahasaan" },
    { label: "baca kitab kuning", value: "baca_kitab_kuning" },
    { label: "hafalan tahfidz", value: "hafalan_tahfidz" },
    { label: "furudul ainiyah", value: "furudul_ainiyah" },
    { label: "tulis al-quran", value: "tulis_alquran" },
    { label: "baca al-quran", value: "baca_alquran" },
  ]

  const kategoriOptionsAfektif = [
    { label: "Akhlak", value: "akhlak" },
    { label: "Kepedulian", value: "kepedulian" },
    { label: "Kebersihan", value: "kebersihan" },
  ]

  const nilaiOptions = ["A", "B", "C", "D", "E"]

  const kategoriOptions = useMemo(() => {
    if (endpoint.includes("afektif")) return kategoriOptionsAfektif
    return kategoriOptionsKognitif
  }, [endpoint])

  const { clearAuthData } = useLogout()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    kategori: "",
    nilai: "",
    tindak_lanjut: "",
  })

  useEffect(() => {
    if (isOpen && initialData) {
      const selectedKategori = kategoriOptions.find(
        (opt) => opt.label.toLowerCase() === initialData.kategori.toLowerCase(),
      )
      setFormData({
        kategori: selectedKategori?.value || "",
        nilai: initialData.nilai || "",
        tindak_lanjut: initialData.tindak_lanjut || "",
      })
    }
  }, [isOpen, initialData, kategoriOptions])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirm = await Swal.fire({
      title: "Yakin ingin mengirim data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, kirim",
      cancelButtonText: "Batal",
    })

    if (!confirm.isConfirmed) return

    try {
      Swal.fire({
        background: "transparent",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: "p-0 shadow-none border-0 bg-transparent" },
      })

      const token = sessionStorage.getItem("token") || getCookie("token")
      const res = await fetch(`${API_BASE_URL}data-pokok/catatan-${endpoint}/${id}/kategori`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      Swal.close()

      if (res.status === 401 && !window.sessionExpiredShown) {
        window.sessionExpiredShown = true
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Silakan login kembali.",
          icon: "warning",
        })
        clearAuthData()
        navigate("/login")
        return
      }

      if (!res.ok || !result.data) {
        throw new Error(result.message || "Terjadi kesalahan")
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui.",
      })

      refetchData?.(endpoint)
      onClose?.()
    } catch (err) {
      console.error("ERROR", err)
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err.message || "Terjadi kesalahan saat mengirim data.",
      })
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-transform duration-300 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <Dialog.Title className="text-lg font-medium text-center mb-6">Edit Kategori Penilaian</Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                      <select
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nilai *</label>
                      <select
                        name="nilai"
                        value={formData.nilai}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Pilih Nilai</option>
                        {nilaiOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tindak Lanjut *</label>
                      <textarea
                        name="tindak_lanjut"
                        value={formData.tindak_lanjut}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
