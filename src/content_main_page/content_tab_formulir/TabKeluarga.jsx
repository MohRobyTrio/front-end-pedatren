"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { OrbitProgress } from "react-loading-indicators"
import { useTabKeluarga } from "../../hooks/hooks_formulir/tabKeluarga"
import { hasAccess } from "../../utils/hasAccess"
import { Link } from "react-router-dom"
import {
  ModalAddOrangtuaFormulir,
  ModalFormPindahKeluarga,
} from "../../components/modal/modal_formulir/ModalAddOrangtua"
import Access from "../../components/Access"

const TabKeluarga = () => {
  const { biodata_id } = useParams()
  const canEdit = hasAccess("edit")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPindahModal, setShowPindahModal] = useState(false)

  const {
    error,
    nokk,
    keluargaList,
    id1,
    loadingKeluarga,
    selectedKeluargaId,
    setSelectedKeluargaId,
    selectedKeluargaDetail,
    setSelectedKeluargaDetail,
    loadingDetailKeluargaId,
    nomorkk,
    hubungan,
    setNomorkk,
    setHubungan,
    fetchKeluargaList,
    handleCardClick,
    handleUpdate,
    setShowAddModal: setShowAddModalHook,
    setFeature,
  } = useTabKeluarga({ biodata_id })

  const openAddModal = () => {
    setShowAddModal(true)
  }

  const openPindahModal = (id) => {
    setSelectedKeluargaId(id)
    setShowPindahModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Relasi Keluarga</h1>
        <Access action={"tambah"}>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Anggota
          </button>
        </Access>
      </div>

      {/* Modals */}
      <ModalAddOrangtuaFormulir
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refetchData={fetchKeluargaList}
        nokk={nokk}
      />
      <ModalFormPindahKeluarga
        isOpen={showPindahModal}
        onClose={() => setShowPindahModal(false)}
        id={id1}
        refetchData={fetchKeluargaList}
      />

      {/* Content Section */}
      {loadingKeluarga ? (
        <div className="flex justify-center items-center py-12">
          <OrbitProgress variant="disc" color="#2563eb" size="medium" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-600 mb-4">Gagal mengambil data keluarga</p>
            <button
              onClick={fetchKeluargaList}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : keluargaList.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Data Keluarga</h3>
            <p className="text-gray-600">Tambahkan anggota keluarga untuk memulai</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Family Card Number */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m4-2v2"
                />
              </svg>
              <span className="text-sm font-medium text-blue-800">Nomor Kartu Keluarga</span>
            </div>
            <p className="text-lg font-bold text-blue-900 mt-1">{nokk || "Belum tersedia"}</p>
          </div>

          {/* Family Members List */}
          <div className="space-y-3">
            {keluargaList
              .filter((keluarga) => !keluarga.is_selected)
              .map((keluarga) => (
                <div key={keluarga.id_keluarga} className="space-y-3">
                  {/* Family Member Card */}
                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => handleCardClick(keluarga.id_keluarga)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {keluarga.nama}
                            </h3>
                            <p className="text-sm text-gray-600">
                              NIK: {keluarga.nik} • {keluarga.status_keluarga}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {keluarga.sebagai_wali == 1 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Wali
                          </span>
                        )}
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Detail Form */}
                  {loadingDetailKeluargaId === keluarga.id_keluarga ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-center items-center py-4">
                        <OrbitProgress variant="disc" color="#2563eb" size="small" />
                      </div>
                    </div>
                  ) : (
                    selectedKeluargaId === keluarga.id_keluarga &&
                    selectedKeluargaDetail && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 ml-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                                value={selectedKeluargaDetail.nama}
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan Keluarga</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
                                value={hubungan ?? "Saudara"}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <Link to={`/formulir/${selectedKeluargaDetail.biodata_id}/biodata`}>
                              <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                Buka Formulir
                              </button>
                            </Link>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                              onClick={() => {
                                setSelectedKeluargaId(null)
                                setSelectedKeluargaDetail(null)
                              }}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Tutup
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TabKeluarga
