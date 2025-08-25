"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faUsers } from "@fortawesome/free-solid-svg-icons"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import useLogout from "../../hooks/Logout"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png"
import { ModalStatusAnakAsuh } from "./ModalFormGrupwaliasuh"; // sesuaikan path jika perlu
import { FaTrash } from "react-icons/fa"


export const ModalDetailGrupWaliAsuh = ({ isOpen, onClose, grupId }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedWaliAsuhId, setSelectedWaliAsuhId] = useState(null);
  const [selectedAnakAsuhId, setSelectedAnakAsuhId] = useState(null);
  const [selectedAnakAsuhData, setSelectedAnakAsuhData] = useState(null);

  const fetchDetailGrup = async () => {
    if (!grupId) return

    setLoading(true)
    try {
      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch(`${API_BASE_URL}data-pokok/kewaliasuhan/grup/${grupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

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

      const result = await response.json()

      if (result.status && result.data) {
        setData(result.data)
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal memuat detail grup wali asuh.",
        })
      }
    } catch (error) {
      console.error("Error fetching detail grup:", error)
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memuat data.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && grupId) {
      fetchDetailGrup()
    }
  }, [isOpen, grupId])

  useEffect(() => {
    if (!isOpen) {
      setData(null)
    }
  }, [isOpen])
  // console.log("data", data);
  const openStatusModal = (anak, waliId) => {
    setSelectedWaliAsuhId(waliId);
    setSelectedAnakAsuhId(anak.anak_asuh_id);
    setSelectedAnakAsuhData(anak);
    setIsStatusModalOpen(true);
  };


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
            <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg shadow-xl relative max-h-[75vh] sm:max-h-[90vh] flex flex-col">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>

              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mt-6">
                Detail Grup Wali Asuh
              </Dialog.Title>

              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto max-h-[55vh] sm:max-h-[70vh]">
                <div className="sm:flex sm:items-start">
                  <div className="mt-2 sm:mt-0 text-left w-full">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <OrbitProgress variant="disc" color="#2a6999" size="small" />
                          <p className="text-gray-600">Memuat data...</p>
                        </div>
                      </div>
                    ) : data ? (
                      <div className="space-y-6">
                        {/* Info Grup */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Foto Wali Asuh */}
                            <div className="flex justify-center sm:justify-start">
                              <img
                                src={data.group.foto || blankProfile}
                                alt={data.group.nama_wali_asuh}
                                className="w-24 h-32 object-cover rounded-lg shadow-sm"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = blankProfile
                                }}
                              />
                            </div>

                            {/* Info Detail */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-800">{data.group.nama_group}</h4>
                                {/* <p className="text-blue-600 font-medium">{data.total} Anak Asuh</p> */}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Wali Asuh:</span>
                                  <p className="text-gray-800">{data.group.nama_wali_asuh}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Wilayah:</span>
                                  <p className="text-gray-800">{data.group.wilayah || "Tidak ditentukan"}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tabel Anak Asuh */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h5 className="text-lg font-medium text-gray-800">Daftar Anak Asuh ({data.total})</h5>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                              <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                  <th className="px-3 py-2 border-b">#</th>
                                  <th className="px-3 py-2 border-b">No. Induk</th>
                                  <th className="px-3 py-2 border-b">Nama Anak Asuh</th>
                                  <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="text-gray-800">
                                {data.anak_asuh.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="text-center py-6">
                                      Tidak ada data anak asuh
                                    </td>
                                  </tr>
                                ) : (
                                  data.anak_asuh.map((anak, index) => (
                                    <tr key={index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                      <td className="px-3 py-2 border-b">{index + 1}</td>
                                      <td className="px-3 py-2 border-b font-mono text-xs">{anak.no_induk}</td>
                                      <td className="px-3 py-2 border-b font-medium">{anak.nama}</td>
                                      <td className="px-3 py-2 border-b text-center">
                                        {/* <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                          Aktif
                                        </span> */}
                                        <button
                                          type="button"
                                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium cursor-pointer"
                                          onClick={() => openStatusModal(anak, data.group.wali_asuh_id)}
                                        >
                                          {/* Nonaktifkan */}
                                          <FaTrash/>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="text-gray-400 mb-4">
                            <FontAwesomeIcon icon={faUsers} className="text-4xl" />
                          </div>
                          <p className="text-gray-600">Data tidak tersedia</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ModalStatusAnakAsuh
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                waliAsuhId={selectedWaliAsuhId}
                anakAsuhId={selectedAnakAsuhId}
                anakAsuhData={selectedAnakAsuhData}
                refetchData={() => fetchDetailGrup()}
              />

              {/* Footer */}
              <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
