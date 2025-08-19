"use client"

import { useEffect, useState } from "react"
import { OrbitProgress } from "react-loading-indicators"
import { getCookie } from "../../utils/cookieUtils"
import Swal from "sweetalert2"
import useLogout from "../../hooks/Logout"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../hooks/config"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import useFetchSantri from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import Pagination from "../../components/Pagination"
import SearchBar from "../../components/SearchBar"

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
  return (
    <div className={vertical ? "space-y-4" : "grid grid-cols-2 gap-4"}>
      {Object.entries(filterOptions).map(([label, options], index) => (
        <div key={`${label}-${index}`} className="space-y-2">
          {vertical && <label className="block text-sm font-medium text-gray-700 capitalize">{label} Tujuan</label>}
          <select
            className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              options.length <= 1 ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white hover:border-gray-300"
            }`}
            onChange={(e) => onChange({ [label]: e.target.value })}
            value={selectedFilters[label] || ""}
            disabled={options.length <= 1}
            required={vertical}
          >
            {options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

const PindahKamar = () => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [selectedSantriIds, setSelectedSantriIds] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [filters, setFilters] = useState({
    wilayah: "",
    blok: "",
    kamar: "",
  })

  useEffect(() => {
    console.log(selectedSantriIds)
  }, [selectedSantriIds])

  const {
    filterWilayah: filterWilayahFilter,
    handleFilterChangeWilayah: handleFilterChangeWilayahFilter,
    selectedWilayah: selectedWilayahFilter,
  } = DropdownWilayah()

  // untuk form tujuan
  const {
    filterWilayah: filterWilayahTujuan,
    handleFilterChangeWilayah: handleFilterChangeWilayahTujuan,
    selectedWilayah: selectedWilayahTujuan,
  } = DropdownWilayah({ withSisa: true })

  const shouldFetch = selectedWilayahFilter.wilayah !== ""

  const {
    santri,
    loadingSantri,
    error,
    setLimit,
    totalDataSantri,
    fetchData,
    fetchAllData,
    limit,
    searchTerm,
    setSearchTerm,
    totalPages,
    currentPage,
    setCurrentPage,
    allSantriIds,
  } = useFetchSantri(filters)

  const updateFirstOptionLabel = (list, label) => (list.length > 0 ? [{ ...list[0], label }, ...list.slice(1)] : list)

  const updatedFilterWilayahFilter = {
    wilayah: updateFirstOptionLabel(filterWilayahFilter.wilayah, "Pilih Wilayah"),
    blok: updateFirstOptionLabel(filterWilayahFilter.blok, "Pilih Blok"),
    kamar: updateFirstOptionLabel(filterWilayahFilter.kamar, "Pilih Kamar"),
  }

  const updatedFilterWilayahTujuan = {
    wilayah: updateFirstOptionLabel(filterWilayahTujuan.wilayah, "-- Pilih Wilayah --"),
    blok: updateFirstOptionLabel(filterWilayahTujuan.blok, "-- Pilih Blok --"),
    kamar: updateFirstOptionLabel(filterWilayahTujuan.kamar, "-- Pilih Kamar --"),
  }

  const wilayahTerpilih = filterWilayahFilter.wilayah.find((n) => n.value == selectedWilayahFilter.wilayah)?.nama || ""
  const blokTerpilih = filterWilayahFilter.blok.find((n) => n.value == selectedWilayahFilter.blok)?.label || ""
  const kamarTerpilih = filterWilayahFilter.kamar.find((n) => n.value == selectedWilayahFilter.kamar)?.label || ""

  useEffect(() => {
    if (wilayahTerpilih || blokTerpilih || kamarTerpilih) {
      setFilters({
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih,
      })
    }
  }, [wilayahTerpilih, blokTerpilih, kamarTerpilih])

  useEffect(() => {
    if (isAllSelected && allSantriIds.length > 0) {
      setSelectedSantriIds(allSantriIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSantriIds])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedSantriIds.length == 0) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih minimal satu santri untuk dipindah.",
      })
      return
    }

    const confirmResult = await Swal.fire({
      title: "Yakin ingin memproses perpindahan?",
      text: "Pastikan data tujuan sudah sesuai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, proses",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) return

    const payload = {
      santri_id: selectedSantriIds,
      wilayah_id: selectedWilayahTujuan.wilayah,
      blok_id: selectedWilayahTujuan.blok,
      kamar_id: selectedWilayahTujuan.kamar,
    }

    try {
      Swal.fire({
        background: "transparent", // tanpa bg putih box
        showConfirmButton: false, // tanpa tombol
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
        customClass: {
          popup: "p-0 shadow-none border-0 bg-transparent", // hilangkan padding, shadow, border, bg
        },
      })

      const token = sessionStorage.getItem("token") || getCookie("token")
      const response = await fetch(`${API_BASE_URL}fitur/pindah-kamar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      Swal.close()

      if (response.status == 401 && !window.sessionExpiredShown) {
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
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${result.message || "Terjadi kesalahan saat memproses perpindahan."}</div>`,
        })
        return
      }

      const berhasil = result?.data?.berhasil
      if (!berhasil || (Array.isArray(berhasil) && berhasil.length === 0)) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${result.message || "Tidak ada santri yang berhasil dipindah."}</div>`,
        })
        return
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pindah kamar berhasil diproses!",
      })

      // Reset form jika diperlukan
      setSelectedSantriIds([])
      fetchData(true)
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      Swal.close()
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Terjadi kesalahan saat mengirim data.",
      })
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  useEffect(() => {
    const availableIds = santri.map((item) => item.id)

    setSelectedSantriIds((prevSelected) => prevSelected.filter((id) => availableIds.includes(id)))

    if (!availableIds.some((id) => selectedSantriIds.includes(id))) {
      setIsAllSelected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [santri])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Pindah Kamar Santri
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola perpindahan kamar santri dengan mudah</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0v-2a3 3 0 015.196-2.196M7 20v-2m0 0a3 3 0 015.196-2.196M7 18a3 3 0 015.196-2.196"
                    />
                  </svg>
                  <span>Daftar Santri</span>
                </h2>
                <p className="text-blue-100 text-sm mt-1">Pilih santri yang akan dipindahkan</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Data</h3>
                  <Filters
                    filterOptions={updatedFilterWilayahFilter}
                    onChange={handleFilterChangeWilayahFilter}
                    selectedFilters={selectedWilayahFilter}
                  />
                </div>

                {!shouldFetch ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Silakan pilih wilayah terlebih dahulu</p>
                    <p className="text-gray-400 text-sm mt-1">Pilih wilayah untuk menampilkan daftar santri</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-red-600 font-semibold mb-2">Terjadi kesalahan saat mengambil data</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                    >
                      Muat Ulang
                    </button>
                  </div>
                ) : (
                  <>
                    <SearchBar
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      totalData={totalDataSantri}
                      limit={limit}
                      toggleLimit={(e) => setLimit(Number(e.target.value))}
                      showViewButtons={false}
                      showFilterButtons={false}
                    />
                    <div className="bg-gray-50 rounded-lg p-1">
                      <DoubleScrollbarTable>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-white">
                              <th className="px-4 py-3 text-center w-12 rounded-l-lg">
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  onChange={async (e) => {
                                    const checked = e.target.checked
                                    setIsAllSelected(checked)
                                    if (checked) {
                                      await fetchAllData()
                                      setSelectedSantriIds(allSantriIds)
                                    } else {
                                      setSelectedSantriIds([])
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-center w-16 text-gray-700 font-semibold">No</th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold">No. Induk Santri</th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Nama</th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold rounded-r-lg">Kamar</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-1">
                            {loadingSantri ? (
                              <tr>
                                <td colSpan="5" className="text-center py-12">
                                  <OrbitProgress variant="disc" color="#2563eb" size="small" text="" textColor="" />
                                </td>
                              </tr>
                            ) : santri.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-500">
                                  Tidak ada data santri
                                </td>
                              </tr>
                            ) : (
                              santri.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-blue-50 transition-colors duration-150">
                                  <td className="px-4 py-3 text-center rounded-l-lg">
                                    <input
                                      type="checkbox"
                                      checked={selectedSantriIds.includes(item.id)}
                                      onChange={(e) => {
                                        const checked = e.target.checked
                                        if (checked) {
                                          setSelectedSantriIds((prev) => {
                                            const newSelected = [...prev, item.id]
                                            if (newSelected.length === santri.length) {
                                              setIsAllSelected(true)
                                            }
                                            return newSelected
                                          })
                                        } else {
                                          setSelectedSantriIds((prev) => {
                                            const newSelected = prev.filter((id) => id !== item.id)
                                            setIsAllSelected(false)
                                            return newSelected
                                          })
                                        }
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-center text-gray-600">
                                    {(currentPage - 1) * limit + index + 1 || "-"}
                                  </td>
                                  <td className="px-4 py-3 font-medium text-gray-900">{item.nis}</td>
                                  <td className="px-4 py-3 text-gray-900">{item.nama}</td>
                                  <td className="px-4 py-3 text-gray-600 rounded-r-lg">{item.kamar}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </DoubleScrollbarTable>
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          handlePageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Tujuan Pindah</span>
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1">Pilih lokasi tujuan perpindahan</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <Filters
                      filterOptions={updatedFilterWilayahTujuan}
                      onChange={handleFilterChangeWilayahTujuan}
                      selectedFilters={selectedWilayahTujuan}
                      vertical={true}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    <span>Proses Pindah</span>
                  </button>

                  {selectedSantriIds.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        {selectedSantriIds.length} santri dipilih untuk dipindahkan
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PindahKamar
