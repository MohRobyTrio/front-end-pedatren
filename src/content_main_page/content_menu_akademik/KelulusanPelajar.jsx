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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import useFetchLulus from "../../hooks/hooks_menu_akademik/KelulusanPelajar"
import Pagination from "../../components/Pagination"
import SearchBar from "../../components/SearchBar"

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
  return (
    <>
      <div className={`${vertical ? "space-y-4" : "grid grid-cols-2 gap-3 sm:gap-4"}`}>
        {Object.entries(filterOptions).map(([label, options], index) => (
          <div key={`${label}-${index}`} className="w-full">
            {vertical && (
              <label className="block text-gray-700 mb-2 text-sm font-medium capitalize">{label} Tujuan</label>
            )}
            <select
              className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 sm:py-4 text-sm font-medium transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none hover:border-gray-300 bg-white shadow-sm ${
                options.length <= 1 ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : "cursor-pointer"
              }`}
              onChange={(e) => onChange({ [label]: e.target.value })}
              value={selectedFilters[label] || ""}
              disabled={options.length <= 1}
              required={vertical}
            >
              {options.map((option, idx) => (
                <option key={idx} value={option.value} className="py-2">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  )
}

const KelulusanPelajar = () => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [selectedPelajarBiodataIds, setSelectedPelajarBiodataIds] = useState([])
  const [selectedLulusBiodataIds, setSelectedLulusBiodataIds] = useState([])
  const [isAllSelectedPelajar, setIsAllSelectedPelajar] = useState(false)
  const [isAllSelectedLulus, setIsAllSelectedLulus] = useState(false)
  const [submitAction, setSubmitAction] = useState(null)
  const [filters, setFilters] = useState({
    lembaga: "",
    jurusan: "",
    kelas: "",
    rombel: "",
    urutBerdasarkan: "",
  })

  const [filtersLulus, setFiltersLulus] = useState({
    lembaga: "",
    jurusan: "",
    kelas: "",
    rombel: "",
    urutBerdasarkan: "",
  })

  const urutBerdasarkan = [
    { label: "Urut Berdasarkan", value: "" },
    { label: "Nama", value: "nama" },
    { label: "NIUP", value: "niup" },
    { label: "Jenis Kelamin", value: "jenis_kelamin" },
  ]

  useEffect(() => {
    console.log(selectedPelajarBiodataIds)
  }, [selectedPelajarBiodataIds])

  useEffect(() => {
    console.log(selectedLulusBiodataIds)
  }, [selectedLulusBiodataIds])

  const {
    filterLembaga: filterLembagaFilter,
    handleFilterChangeLembaga: handleFilterChangeLembagaFilter,
    selectedLembaga: selectedLembagaFilter,
  } = DropdownLembaga()

  const {
    filterLembaga: filterLembagaFilterLulus,
    handleFilterChangeLembaga: handleFilterChangeLembagaFilterLulus,
    selectedLembaga: selectedLembagaFilterLulus,
  } = DropdownLembaga()

  const shouldFetch = selectedLembagaFilter.lembaga !== ""

  const {
    pelajar,
    loadingPelajar,
    error,
    setLimit,
    totalDataPelajar,
    fetchData,
    fetchAllData: fetchAllDataPelajar,
    searchTerm: searchTermPelajar,
    setSearchTerm: setSearchTermPelajar,
    allPelajarIds,
    limit,
    setCurrentPage: setCurrentPagePelajar,
    currentPage: currentPagePelajar,
    totalPages: totalPagesPelajar,
  } = useFetchPelajar(filters)
  const {
    dataLulus,
    loadingLulus,
    error: errorLulus,
    setLimit: setLimitLulus,
    totalDataLulus,
    fetchData: fetchDataLulus,
    searchTerm: searchTermLulus,
    setSearchTerm: setSearchTermLulus,
    limit: limitLulus,
    setCurrentPage: setCurrentPageLulus,
    currentPage: currentPageLulus,
    totalPages: totalPagesLulus,
    fetchAllData: fetchAllDataLulus,
  } = useFetchLulus(filtersLulus)

  const updateFirstOptionLabel = (list, label) => (list.length > 0 ? [{ ...list[0], label }, ...list.slice(1)] : list)

  const updatedFilterLembagaFilter = {
    lembaga: updateFirstOptionLabel(filterLembagaFilter.lembaga, "Pilih Lembaga"),
    jurusan: updateFirstOptionLabel(filterLembagaFilter.jurusan, "Pilih Jurusan"),
    kelas: updateFirstOptionLabel(filterLembagaFilter.kelas, "Pilih Kelas"),
    rombel: updateFirstOptionLabel(filterLembagaFilter.rombel, "Pilih rombel"),
  }

  const updatedFilterLembagaFilterLulus = {
    lembaga: updateFirstOptionLabel(filterLembagaFilterLulus.lembaga, "Pilih Lembaga"),
    jurusan: updateFirstOptionLabel(filterLembagaFilterLulus.jurusan, "Pilih Jurusan"),
    kelas: updateFirstOptionLabel(filterLembagaFilterLulus.kelas, "Pilih Kelas"),
    rombel: updateFirstOptionLabel(filterLembagaFilterLulus.rombel, "Pilih rombel"),
  }

  const lembagaTerpilih = filterLembagaFilter.lembaga.find((n) => n.value == selectedLembagaFilter.lembaga)?.label || ""
  const jurusanTerpilih = filterLembagaFilter.jurusan.find((n) => n.value == selectedLembagaFilter.jurusan)?.label || ""
  const kelasTerpilih = filterLembagaFilter.kelas.find((n) => n.value == selectedLembagaFilter.kelas)?.label || ""
  const rombelTerpilih = filterLembagaFilter.rombel.find((n) => n.value == selectedLembagaFilter.rombel)?.label || ""

  const lembagaTerpilihLulus =
    filterLembagaFilterLulus.lembaga.find((n) => n.value == selectedLembagaFilterLulus.lembaga)?.label || ""
  const jurusanTerpilihLulus =
    filterLembagaFilterLulus.jurusan.find((n) => n.value == selectedLembagaFilterLulus.jurusan)?.label || ""
  const kelasTerpilihLulus =
    filterLembagaFilterLulus.kelas.find((n) => n.value == selectedLembagaFilterLulus.kelas)?.label || ""
  const rombelTerpilihLulus =
    filterLembagaFilterLulus.rombel.find((n) => n.value == selectedLembagaFilterLulus.rombel)?.label || ""

  useEffect(() => {
    if (lembagaTerpilih || jurusanTerpilih || kelasTerpilih || rombelTerpilih) {
      setFilters({
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih,
      })
    }
    if (lembagaTerpilihLulus || jurusanTerpilihLulus || kelasTerpilihLulus || rombelTerpilihLulus) {
      setFiltersLulus({
        lembaga: lembagaTerpilihLulus,
        jurusan: jurusanTerpilihLulus,
        kelas: kelasTerpilihLulus,
        rombel: rombelTerpilihLulus,
      })
    }
  }, [
    lembagaTerpilih,
    jurusanTerpilih,
    kelasTerpilih,
    rombelTerpilih,
    lembagaTerpilihLulus,
    jurusanTerpilihLulus,
    kelasTerpilihLulus,
    rombelTerpilihLulus,
  ])

  useEffect(() => {
    if (isAllSelectedPelajar && allPelajarIds.length > 0) {
      setSelectedPelajarBiodataIds(allPelajarIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPelajarIds])

  const handlePageChangePelajar = (page) => {
    if (page >= 1 && page <= totalPagesPelajar) {
      setCurrentPagePelajar(page)
    }
  }

  const handlePageChangeLulus = (page) => {
    if (page >= 1 && page <= totalPagesLulus) {
      setCurrentPageLulus(page)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isProses = submitAction === "proses"
    const selectedIds = isProses ? selectedPelajarBiodataIds : selectedLulusBiodataIds

    if (selectedIds.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: `Pilih minimal satu data ${isProses ? "pelajar" : "alumni"} untuk diproses.`,
      })
      return
    }

    const endpoint = isProses ? "proses-lulus" : "batal-lulus"
    const payload = { biodata_id: selectedIds }

    const confirmResult = await Swal.fire({
      title: "Yakin ingin memproses data ini?",
      text: "Pastikan data sudah sesuai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, proses",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) return

    // const payload = {
    //     biodata_id: selectedPelajarBiodataIds,
    // };

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

      Swal.close()
      const result = await response.json()
      console.log(result)

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

      if (result.data?.gagal?.length > 0) {
        const gagalList = result.data.gagal.map((item, index) => `<b>${index + 1}. ${item.nama}</b>`).join("<br><br>")

        await Swal.fire({
          icon: "warning",
          title: "Sebagian Gagal Diproses",
          html: `
                    <div style="text-align: left;">
                        ${result.message}<br><br>
                        <b>Daftar siswa yang gagal diproses:</b><br><br>
                        ${gagalList}
                    </div>`,
        })
      } else {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: result.message || `${submitAction} lulus berhasil diproses!`,
        })
      }

      // Reset form jika diperlukan
      setIsAllSelectedLulus(false)
      setIsAllSelectedPelajar(false)
      setSelectedPelajarBiodataIds([])
      setSelectedLulusBiodataIds([])
      fetchData(true)
      fetchDataLulus(true)
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

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const currentIds = pelajar.map((item) => item.biodata_id)
    setSelectedPelajarBiodataIds((prev) => prev.filter((id) => currentIds.includes(id)))

    // Auto-uncheck select-all jika semua ID terpilih tidak lagi valid
    if (!currentIds.some((id) => selectedPelajarBiodataIds.includes(id))) {
      setIsAllSelectedPelajar(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pelajar])

  useEffect(() => {
    const currentIds = dataLulus.map((item) => item.biodata_id)
    setSelectedLulusBiodataIds((prev) => prev.filter((id) => currentIds.includes(id)))

    if (!currentIds.some((id) => selectedLulusBiodataIds.includes(id))) {
      setIsAllSelectedLulus(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLulus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-graduation-cap text-white text-xl sm:text-2xl"></i>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Kelulusan Pelajar</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Kelola proses kelulusan dan pembatalan kelulusan pelajar
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Panel - Active Students */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="text-white">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-users"></i>
                  Daftar Pelajar Aktif
                </h2>
                <p className="text-blue-100 mt-1 text-sm">Pilih pelajar yang akan diluluskan</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama pelajar..."
                  className="pl-10 pr-4 py-3 w-full border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  value={searchTermPelajar}
                  onChange={(e) => setSearchTermPelajar(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Filters
                  filterOptions={updatedFilterLembagaFilter}
                  onChange={handleFilterChangeLembagaFilter}
                  selectedFilters={selectedLembagaFilter}
                />
              </div>
              <select
                className="block w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white text-sm font-medium hover:border-gray-300"
                value={filters.urutBerdasarkan}
                onChange={(e) => setFilters({ ...filters, urutBerdasarkan: e.target.value })}
              >
                {urutBerdasarkan.map((urut, idx) => (
                  <option key={idx} value={urut.value} className="py-2">
                    {urut.label}
                  </option>
                ))}
              </select>
            </div>

            {!shouldFetch ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-school text-blue-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-gray-600 text-base sm:text-lg font-medium">Silakan pilih lembaga terlebih dahulu</p>
                <p className="text-gray-500 text-sm mt-1">Pilih lembaga untuk melihat daftar pelajar</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-red-600 font-semibold text-base sm:text-lg mb-2">Terjadi kesalahan</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Gagal mengambil data pelajar</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Muat Ulang
                </button>
              </div>
            ) : (
              <>
                <SearchBar
                  totalData={totalDataPelajar}
                  limit={limit}
                  toggleLimit={(e) => setLimit(Number(e.target.value))}
                  showViewButtons={false}
                  showFilterButtons={false}
                  showSearch={false}
                />

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <DoubleScrollbarTable>
                    <table className="min-w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center w-12">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                              checked={isAllSelectedPelajar}
                              onChange={async (e) => {
                                const checked = e.target.checked
                                setIsAllSelectedPelajar(checked)
                                if (checked) {
                                  await fetchAllDataPelajar()
                                  setSelectedPelajarBiodataIds(allPelajarIds)
                                } else {
                                  setSelectedPelajarBiodataIds([])
                                }
                              }}
                            />
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                            No
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            No. Induk
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Nama
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loadingPelajar ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <OrbitProgress variant="disc" color="#3B82F6" size="small" text="" textColor="" />
                              <p className="text-gray-500 mt-3 text-sm sm:text-base">Memuat data pelajar...</p>
                            </td>
                          </tr>
                        ) : pelajar.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <div className="text-gray-500">
                                <i className="fas fa-inbox text-4xl sm:text-5xl mb-4 block text-gray-300"></i>
                                <p className="text-base sm:text-lg font-medium">Tidak ada data pelajar</p>
                                <p className="text-sm mt-1">Coba ubah filter atau kriteria pencarian</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          pelajar.map((item, index) => (
                            <tr
                              key={item.biodata_id || index}
                              className="hover:bg-blue-50/50 transition-colors duration-200"
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                                  checked={selectedPelajarBiodataIds.includes(item.biodata_id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    if (checked) {
                                      setSelectedPelajarBiodataIds((prev) => {
                                        const newSelected = [...prev, item.biodata_id]
                                        if (newSelected.length === pelajar.length) {
                                          setIsAllSelectedPelajar(true)
                                        }
                                        return newSelected
                                      })
                                    } else {
                                      setSelectedPelajarBiodataIds((prev) => {
                                        const newSelected = prev.filter((biodata_id) => biodata_id != item.biodata_id)
                                        setIsAllSelectedPelajar(false)
                                        return newSelected
                                      })
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 font-medium">
                                {(currentPagePelajar - 1) * limit + index + 1}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-900">
                                {item.no_induk}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                {item.nama}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <span
                                  className={`inline-flex px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full ${
                                    item.status == "aktif"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {item.status == "aktif" ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </DoubleScrollbarTable>
                </div>

                {totalPagesPelajar > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPagePelajar}
                      totalPages={totalPagesPelajar}
                      handlePageChange={handlePageChangePelajar}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center Panel - Action Buttons */}
        <div className="lg:col-span-12 xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 xl:sticky xl:top-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-exchange-alt text-white text-lg sm:text-xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Aksi Kelulusan</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Pilih aksi yang ingin dilakukan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <button
                type="submit"
                onClick={() => setSubmitAction("proses")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <i className="fas fa-graduation-cap text-base sm:text-lg"></i>
                <span>Proses Lulus</span>
                <FontAwesomeIcon icon={isMobile ? faArrowDown : faArrowRight} className="text-xs sm:text-sm" />
              </button>

              <button
                type="submit"
                onClick={() => setSubmitAction("batal")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={isMobile ? faArrowUp : faArrowLeft} className="text-xs sm:text-sm" />
                <span>Batal Lulus</span>
                <i className="fas fa-undo text-base sm:text-lg"></i>
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-blue-600">Pelajar Terpilih</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">
                    {selectedPelajarBiodataIds.length}
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-orange-600">Alumni Terpilih</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-700 mt-1">
                    {selectedLulusBiodataIds.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Graduated Students */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="text-white">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-user-graduate"></i>
                  Lulusan Pelajar
                </h2>
                <p className="text-orange-100 mt-1 text-sm">Data lulusan 30 hari terakhir yang dapat dibatalkan</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama alumni..."
                  className="pl-10 pr-4 py-3 w-full border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  value={searchTermLulus}
                  onChange={(e) => setSearchTermLulus(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Filters
                  filterOptions={updatedFilterLembagaFilterLulus}
                  onChange={handleFilterChangeLembagaFilterLulus}
                  selectedFilters={selectedLembagaFilterLulus}
                />
              </div>
              <select
                className="block w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-200 bg-white text-sm font-medium hover:border-gray-300"
                value={filtersLulus.urutBerdasarkan}
                onChange={(e) => setFiltersLulus({ ...filtersLulus, urutBerdasarkan: e.target.value })}
              >
                {urutBerdasarkan.map((urut, idx) => (
                  <option key={idx} value={urut.value} className="py-2">
                    {urut.label}
                  </option>
                ))}
              </select>
            </div>

            {errorLulus ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-red-600 font-semibold text-base sm:text-lg mb-2">Terjadi kesalahan</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Gagal mengambil data alumni</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Muat Ulang
                </button>
              </div>
            ) : (
              <>
                <SearchBar
                  totalData={totalDataLulus}
                  limit={limitLulus}
                  toggleLimit={(e) => setLimitLulus(Number(e.target.value))}
                  showViewButtons={false}
                  showFilterButtons={false}
                  showSearch={false}
                />

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <DoubleScrollbarTable>
                    <table className="min-w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center w-12">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-colors"
                              checked={isAllSelectedLulus}
                              onChange={async (e) => {
                                const checked = e.target.checked
                                setIsAllSelectedLulus(checked)
                                if (checked) {
                                  const allIds = await fetchAllDataLulus()
                                  setSelectedLulusBiodataIds(allIds)
                                } else {
                                  setSelectedLulusBiodataIds([])
                                }
                              }}
                            />
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                            No
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            No. Induk
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Nama
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loadingLulus ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <OrbitProgress variant="disc" color="#EA580C" size="small" text="" textColor="" />
                              <p className="text-gray-500 mt-3 text-sm sm:text-base">Memuat data alumni...</p>
                            </td>
                          </tr>
                        ) : dataLulus.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <div className="text-gray-500">
                                <i className="fas fa-user-graduate text-4xl sm:text-5xl mb-4 block text-gray-300"></i>
                                <p className="text-base sm:text-lg font-medium">Tidak ada data alumni</p>
                                <p className="text-sm mt-1">Belum ada lulusan dalam 30 hari terakhir</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          dataLulus.map((item, index) => (
                            <tr key={item.id} className="hover:bg-orange-50/50 transition-colors duration-200">
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-colors"
                                  checked={selectedLulusBiodataIds.includes(item.biodata_id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    if (checked) {
                                      setSelectedLulusBiodataIds((prev) => {
                                        const newSelected = [...prev, item.biodata_id]
                                        if (newSelected.length === dataLulus.length) {
                                          setIsAllSelectedLulus(true)
                                        }
                                        return newSelected
                                      })
                                    } else {
                                      setSelectedLulusBiodataIds((prev) => {
                                        const newSelected = prev.filter((biodata_id) => biodata_id !== item.biodata_id)
                                        setIsAllSelectedLulus(false)
                                        return newSelected
                                      })
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 font-medium">
                                {(currentPageLulus - 1) * limitLulus + index + 1}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-900">
                                {item.no_induk}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                {item.nama}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <span
                                  className={`inline-flex px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full ${
                                    item.status === "lulus"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {item.status == "lulus" ? "Lulus" : "-"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </DoubleScrollbarTable>
                </div>

                {totalPagesLulus > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPageLulus}
                      totalPages={totalPagesLulus}
                      handlePageChange={handlePageChangeLulus}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KelulusanPelajar
