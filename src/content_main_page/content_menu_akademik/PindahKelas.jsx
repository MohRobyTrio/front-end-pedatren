"use client"

import { useEffect, useState } from "react"
import useFetchPelajar from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Pelajar"
import { OrbitProgress } from "react-loading-indicators"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import { getCookie } from "../../utils/cookieUtils"
import Swal from "sweetalert2"
import useLogout from "../../hooks/Logout"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../hooks/config"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import SearchBar from "../../components/SearchBar"
import Pagination from "../../components/Pagination"

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

const PindahKelas = () => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [selectedPelajarIds, setSelectedPelajarIds] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [submitAction, setSubmitAction] = useState(null)
  const [filters, setFilters] = useState({
    lembaga: "",
    jurusan: "",
    kelas: "",
    rombel: "",
  })

  const {
    filterLembaga: filterLembagaFilter,
    handleFilterChangeLembaga: handleFilterChangeLembagaFilter,
    selectedLembaga: selectedLembagaFilter,
  } = DropdownLembaga()

  // untuk form tujuan
  const {
    filterLembaga: filterLembagaTujuan,
    handleFilterChangeLembaga: handleFilterChangeLembagaTujuan,
    selectedLembaga: selectedLembagaTujuan,
  } = DropdownLembaga()

  const shouldFetch = selectedLembagaFilter.lembaga !== ""

  const {
    pelajar,
    loadingPelajar,
    error,
    setLimit,
    totalDataPelajar,
    fetchData,
    fetchAllData,
    limit,
    searchTerm,
    setSearchTerm,
    totalPages,
    currentPage,
    setCurrentPage,
    allPelajarIds,
  } = useFetchPelajar(filters)

  const updateFirstOptionLabel = (list, label) => (list.length > 0 ? [{ ...list[0], label }, ...list.slice(1)] : list)

  const updatedFilterLembagaFilter = {
    lembaga: updateFirstOptionLabel(filterLembagaFilter.lembaga, "Pilih Lembaga"),
    jurusan: updateFirstOptionLabel(filterLembagaFilter.jurusan, "Pilih Jurusan"),
    kelas: updateFirstOptionLabel(filterLembagaFilter.kelas, "Pilih Kelas"),
    rombel: updateFirstOptionLabel(filterLembagaFilter.rombel, "Pilih rombel"),
  }

  const updatedFilterLembagaTujuan = {
    lembaga: updateFirstOptionLabel(filterLembagaTujuan.lembaga, "-- Pilih Lembaga --"),
    jurusan: updateFirstOptionLabel(filterLembagaTujuan.jurusan, "-- Pilih Jurusan --"),
    kelas: updateFirstOptionLabel(filterLembagaTujuan.kelas, "-- Pilih Kelas --"),
    rombel: updateFirstOptionLabel(filterLembagaTujuan.rombel, "-- Pilih rombel --"),
  }

  const lembagaTerpilih = filterLembagaFilter.lembaga.find((n) => n.value == selectedLembagaFilter.lembaga)?.label || ""
  const jurusanTerpilih = filterLembagaFilter.jurusan.find((n) => n.value == selectedLembagaFilter.jurusan)?.label || ""
  const kelasTerpilih = filterLembagaFilter.kelas.find((n) => n.value == selectedLembagaFilter.kelas)?.label || ""
  const rombelTerpilih = filterLembagaFilter.rombel.find((n) => n.value == selectedLembagaFilter.rombel)?.label || ""

  useEffect(() => {
    if (lembagaTerpilih || jurusanTerpilih || kelasTerpilih || rombelTerpilih) {
      setFilters({
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih,
      })
    }
  }, [lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih])

  useEffect(() => {
    if (isAllSelected && allPelajarIds.length > 0) {
      setSelectedPelajarIds(allPelajarIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPelajarIds])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let endpoint = ""
    if (submitAction == "Naik") {
      endpoint = "naik-jenjang"
    } else {
      endpoint = "pindah-jenjang"
    }

    if (selectedPelajarIds.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih minimal satu santri untuk diproses.",
      })
      return
    }

    const confirmResult = await Swal.fire({
      title: "Yakin ingin memproses data ini?",
      text: "Pastikan data tujuan sudah sesuai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, proses",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) return

    const payload = {
      biodata_id: selectedPelajarIds,
      lembaga_id: selectedLembagaTujuan.lembaga,
      jurusan_id: selectedLembagaTujuan.jurusan,
      kelas_id: selectedLembagaTujuan.kelas,
      rombel_id: selectedLembagaTujuan.rombel,
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
      const response = await fetch(`${API_BASE_URL}fitur/${endpoint}`, {
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
          html: `<div style="text-align: left;">${result.message || "Tidak ada data yang berhasil diproses."}</div>`,
        })
        return
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: result.message || `${submitAction} kelas berhasil diproses!`,
      })

      // Reset form jika diperlukan
      setSelectedPelajarIds([])
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
    console.log(selectedPelajarIds)
  }, [selectedPelajarIds])

  useEffect(() => {
    // Ambil semua ID yang tersedia setelah filter diterapkan
    const availableIds = pelajar.map((item) => item.biodata_id)

    // Buang ID yang tidak lagi ada di daftar
    setSelectedPelajarIds((prevSelected) => prevSelected.filter((id) => availableIds.includes(id)))

    // Jika semua sudah tidak terpilih lagi, reset "Select All"
    if (!availableIds.some((id) => selectedPelajarIds.includes(id))) {
      setIsAllSelected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pelajar])

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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Pindah Kelas Siswa
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola perpindahan dan kenaikan kelas siswa dengan mudah</p>
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <span>Daftar Siswa</span>
                </h2>
                <p className="text-blue-100 text-sm mt-1">Pilih siswa yang akan dipindahkan atau dinaikkan kelas</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Data</h3>
                  <Filters
                    filterOptions={updatedFilterLembagaFilter}
                    onChange={handleFilterChangeLembagaFilter}
                    selectedFilters={selectedLembagaFilter}
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
                    <p className="text-gray-500 font-medium">Silakan pilih lembaga terlebih dahulu</p>
                    <p className="text-gray-400 text-sm mt-1">Pilih lembaga untuk menampilkan daftar siswa</p>
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
                      totalData={totalDataPelajar}
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
                                      setSelectedPelajarIds(allPelajarIds)
                                    } else {
                                      setSelectedPelajarIds([])
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-center w-16 text-gray-700 font-semibold">No</th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                No. Induk (Siswa/Mahasiswa)
                              </th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Nama</th>
                              <th className="px-4 py-3 text-left text-gray-700 font-semibold rounded-r-lg">Kelas</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-1">
                            {loadingPelajar ? (
                              <tr>
                                <td colSpan="5" className="text-center py-12">
                                  <OrbitProgress variant="disc" color="#2563eb" size="small" text="" textColor="" />
                                </td>
                              </tr>
                            ) : pelajar.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center py-12 text-gray-500">
                                  Tidak ada data siswa
                                </td>
                              </tr>
                            ) : (
                              pelajar.map((item, index) => (
                                <tr
                                  key={`${item.id}-${index}`}
                                  className="bg-white hover:bg-blue-50 transition-colors duration-150"
                                >
                                  <td className="px-4 py-3 text-center rounded-l-lg">
                                    <input
                                      type="checkbox"
                                      checked={selectedPelajarIds.includes(item.biodata_id)}
                                      onChange={(e) => {
                                        const checked = e.target.checked
                                        if (checked) {
                                          setSelectedPelajarIds((prev) => {
                                            const newSelected = [...prev, item.biodata_id]
                                            if (newSelected.length === pelajar.length) {
                                              setIsAllSelected(true)
                                            }
                                            return newSelected
                                          })
                                        } else {
                                          setSelectedPelajarIds((prev) => {
                                            const newSelected = prev.filter(
                                              (biodata_id) => biodata_id !== item.biodata_id,
                                            )
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
                                  <td className="px-4 py-3 font-medium text-gray-900">{item.no_induk}</td>
                                  <td className="px-4 py-3 text-gray-900">{item.nama}</td>
                                  <td className="px-4 py-3 text-gray-600 rounded-r-lg">{item.kelas}</td>
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
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    <span>Tujuan Pindah</span>
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1">Pilih lokasi tujuan perpindahan atau kenaikan kelas</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <Filters
                      filterOptions={updatedFilterLembagaTujuan}
                      onChange={handleFilterChangeLembagaTujuan}
                      selectedFilters={selectedLembagaTujuan}
                      vertical={true}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      onClick={() => setSubmitAction("Naik")}
                      className="flex-1 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-semibold px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      <span>Naik</span>
                    </button>
                    <button
                      type="submit"
                      onClick={() => setSubmitAction("Pindah")}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <span>Pindah</span>
                    </button>
                  </div>

                  {selectedPelajarIds.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        {selectedPelajarIds.length} siswa dipilih untuk diproses
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

export default PindahKelas
