"use client"

import { useMemo, useState } from "react"
import Filters from "../../components/Filters"
import SearchBar from "../../components/SearchBar"
import { OrbitProgress } from "react-loading-indicators"
import Pagination from "../../components/Pagination"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import useFetchPengunjung from "../../hooks/hooks_menu_mahrom/Pengunjung"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import ModalDetail from "../../components/modal/ModalDetail"
import Access from "../../components/Access"
import { FaFileExport, FaPlus, FaMapMarkerAlt, FaSchool, FaUsers, FaCalendarAlt, FaUser } from "react-icons/fa"
import { ModalAddPengunjung } from "../../components/modal/ModalFormPengunjung"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate } from "react-router-dom"

const DataPengunjung = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feature, setFeature] = useState(null)

  const openModal = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setIsModalOpen(false)
  }

  const [filters, setFilters] = useState({
    wilayah: "",
    jenisKelamin: "",
    jenisGroup: "",
  })

  const { filterWilayah } = DropdownWilayah()
  const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara()

  const negaraTerpilih = filterNegara.negara.find((n) => n.value == selectedNegara.negara)?.label || ""
  const provinsiTerpilih = filterNegara.provinsi.find((p) => p.value == selectedNegara.provinsi)?.label || ""
  const kabupatenTerpilih = filterNegara.kabupaten.find((k) => k.value == selectedNegara.kabupaten)?.label || ""
  const kecamatanTerpilih = filterNegara.kecamatan.find((kec) => kec.value == selectedNegara.kecamatan)?.label || ""

  const wilayahTerpilih = filterWilayah.wilayah.find((n) => n.value == filters.wilayah)?.nama || ""

  const updatedFilters = useMemo(
    () => ({
      ...filters,
      negara: negaraTerpilih,
      provinsi: provinsiTerpilih,
      kabupaten: kabupatenTerpilih,
      kecamatan: kecamatanTerpilih,
      wilayah: wilayahTerpilih,
    }),
    [filters, kabupatenTerpilih, kecamatanTerpilih, negaraTerpilih, provinsiTerpilih, wilayahTerpilih],
  )

  const {
    pengunjung,
    loading,
    searchTerm,
    setSearchTerm,
    error,
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
  } = useFetchPengunjung(updatedFilters)

  const [showFilters, setShowFilters] = useState(false)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const [showFormModal, setShowFormModal] = useState(false)

  if (!hasAccess("kunjungan")) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <div className="flex-1 pl-6 pt-6 pb-6 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Data Pengunjung</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Access action="tambah">
            <button
              onClick={() => {
                setFeature(1)
                setShowFormModal(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
            >
              <FaPlus /> Tambah
            </button>
          </Access>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
          >
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      <ModalAddPengunjung
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        refetchData={fetchData}
        feature={feature}
        id={selectedId}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}
        >
          <Filters
            showFilters={showFilters}
            filterOptions={filterNegara}
            onChange={handleFilterChangeNegara}
            selectedFilters={selectedNegara}
          />
          <Filters
            showFilters={showFilters}
            filterOptions={{ wilayah: filterWilayah.wilayah }}
            onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
            selectedFilters={filters}
          />
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalData={totalData}
          toggleFilters={() => setShowFilters(!showFilters)}
          limit={limit}
          toggleLimit={(e) => setLimit(Number(e.target.value))}
          showViewButtons={false}
        />

        <div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">Error: {error}</div>}

          <div className="space-y-3">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : pengunjung.length > 0 ? (
              <div className="">
                {pengunjung.map((item) => (
                  <PengunjungCard
                    key={item.id}
                    data={item}
                    openModal={openModal}
                    setShowFormModal={setShowFormModal}
                    setFeature={setFeature}
                    setSelectedId={setSelectedId}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Tidak ada data pengunjung</p>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          className="mt-6"
        />

        {isModalOpen && <ModalDetail title="Pengunjung" menu={23} item={selectedItem} onClose={closeModal} />}
      </div>
    </div>
  )
}

// Clean and Informative Pengunjung Card Component
const PengunjungCard = ({ data, openModal, setShowFormModal, setFeature, setSelectedId }) => {
  // const getStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case "keluarga":
  //       return "text-blue-600 bg-blue-50 border-blue-200"
  //     case "teman":
  //       return "text-green-600 bg-green-50 border-green-200"
  //     case "saudara":
  //       return "text-purple-600 bg-purple-50 border-purple-200"
  //     case "lainnya":
  //       return "text-orange-600 bg-orange-50 border-orange-200"
  //     default:
  //       return "text-gray-600 bg-gray-50 border-gray-200"
  //   }
  // }

  const getTimelineColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "berlangsung":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "selesai":
        return "text-green-600 bg-green-50 border-green-200"
      case "ditolak":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const timelineStatus = data.status_selesai || "menunggu"

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Simple Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-medium border border-gray-300 bg-gray-100 text-gray-800">
            {data.status || "Tidak diketahui"}
          </span>
          {/* <span className="text-xs text-gray-500">Kunjungan • {formatDate(data.tanggal_kunjungan)}</span> */}
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getTimelineColor(timelineStatus)}`}>
            {timelineStatus.charAt(0).toUpperCase() + timelineStatus.slice(1)}
          </span>
          <Access action="edit">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFeature(2)
                setSelectedId(data.id)
                setShowFormModal(true)
              }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
            >
              <i className="fas fa-edit text-xs"></i>
              <span>Edit</span>
            </button>
          </Access>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4" onClick={() => openModal(data)}>
        <div className="flex flex-col gap-3">
          {/* Visitor Name */}
          <h3 className="text-lg font-bold text-gray-900">{data.nama_pengunjung}</h3>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaUser className="text-blue-500 text-xs flex-shrink-0" />
                <span className="text-gray-600">Mengunjungi:</span>
                <span className="font-medium text-gray-800">{data.santri_dikunjungi}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-green-500 text-xs flex-shrink-0" />
                <span className="text-gray-600">Domisili Santri:</span>
                <span className="font-medium text-gray-800">
                  {data.blok} {data.kamar}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FaSchool className="text-purple-500 text-xs flex-shrink-0" />
                <span className="text-gray-600">Pendidikan:</span>
                <span className="font-medium text-gray-800">
                  {data.lembaga}, {data.jurusan}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaUsers className="text-indigo-500 text-xs flex-shrink-0" />
                <span className="text-gray-600">Jumlah Rombongan:</span>
                <span className="font-medium text-gray-800">{data.jumlah_rombongan || 1} orang</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FaCalendarAlt className="text-red-500 text-xs flex-shrink-0" />
                <span className="text-gray-600">Tanggal Kunjungan:</span>
                <span className="font-medium text-gray-800">{formatDate(data.tanggal_kunjungan)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 py-3 border-t-2 border-gray-200 px-4">
        <div className="flex items-center justify-between">
          {/* Step 1 - Menunggu */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status_selesai !== "menunggu"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
                }`}
            >
              {data.status_selesai !== "menunggu" ? "✓" : "1"}
            </div>
            <span className="text-xs text-gray-600 mt-1 font-medium">Menunggu</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>

          {/* Step 2 - Berlangsung / Ditolak */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status_selesai === "ditolak"
                  ? "bg-red-500 text-white"
                  : data.status_selesai === "berlangsung" || data.status_selesai === "selesai"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
            >
              {data.status_selesai === "ditolak"
                ? "✗"
                : data.status_selesai === "berlangsung" || data.status_selesai === "selesai"
                  ? "✓"
                  : "2"}
            </div>
            <span className="text-xs text-gray-600 mt-1 font-medium">
              {data.status_selesai === "ditolak" ? "Ditolak" : "Berlangsung"}
            </span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-1 rounded-full"></div>

          {/* Step 3 - Selesai */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs ${data.status_selesai === "selesai"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
                }`}
            >
              {data.status_selesai === "selesai" ? "✓" : "3"}
            </div>
            <span className="text-xs text-gray-600 mt-1 font-medium">Selesai</span>
          </div>
        </div>
      </div>


    </div>
  )
}

export default DataPengunjung
