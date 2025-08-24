"use client"

import { useEffect, useState } from "react"
import useFetchSantri from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri"
import { OrbitProgress } from "react-loading-indicators"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import { getCookie } from "../../utils/cookieUtils"
import Swal from "sweetalert2"
import useLogout from "../../hooks/Logout"
import { Navigate, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../../hooks/config"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import Pagination from "../../components/Pagination"
import SearchBar from "../../components/SearchBar"
import useFetchLulusSantri from "../../hooks/hooks_menu_kewilayahan/AlumniSantri"
import { hasAccess } from "../../utils/hasAccess"

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
  return (
    <>
      <div className={`${vertical ? "space-y-4" : "grid grid-cols-2 gap-4"}`}>
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

const AlumniSantri = () => {
  const { clearAuthData } = useLogout()
  const navigate = useNavigate()
  const [selectedSantriIds, setSelectedSantriIds] = useState([])
  const [selectedLulusIds, setSelectedLulusIds] = useState([])
  const [isAllSelectedSantri, setIsAllSelectedSantri] = useState(false)
  const [isAllSelectedLulus, setIsAllSelectedLulus] = useState(false)
  const [submitAction, setSubmitAction] = useState(null)
  const [filters, setFilters] = useState({
    wilayah: "",
    blok: "",
    kamar: "",
    urutBerdasarkan: "",
  })

  const [filtersLulus, setFiltersLulus] = useState({
    wilayah: "",
    blok: "",
    kamar: "",
    urutBerdasarkan: "",
  })

  const urutBerdasarkan = [
    { label: "Urut Berdasarkan", value: "" },
    { label: "Nama", value: "nama" },
    { label: "NIUP", value: "niup" },
    { label: "Jenis Kelamin", value: "jenis_kelamin" },
  ]

  useEffect(() => {
    console.log(selectedSantriIds)
  }, [selectedSantriIds])

  useEffect(() => {
    console.log(selectedLulusIds)
  }, [selectedLulusIds])

  const {
    filterWilayah: filterWilayahFilter,
    handleFilterChangeWilayah: handleFilterChangeWilayahFilter,
    selectedWilayah: selectedWilayahFilter,
  } = DropdownWilayah()

  const {
    filterWilayah: filterWilayahFilterLulus,
    handleFilterChangeWilayah: handleFilterChangeWilayahFilterLulus,
    selectedWilayah: selectedWilayahFilterLulus,
  } = DropdownWilayah()

  const shouldFetch = selectedWilayahFilter.wilayah != ""

  const {
    santri,
    loadingSantri,
    error,
    setLimit,
    totalDataSantri,
    fetchData,
    fetchAllData: fetchAllDataSantri,
    searchTerm: searchTermSantri,
    setSearchTerm: setSearchTermSantri,
    allSantriIds,
    limit,
    setCurrentPage: setCurrentPageSantri,
    currentPage: currentPageSantri,
    totalPages: totalPagesSantri,
  } = useFetchSantri(filters)
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
  } = useFetchLulusSantri(filtersLulus)

  const updateFirstOptionLabel = (list, label) => (list.length > 0 ? [{ ...list[0], label }, ...list.slice(1)] : list)

  const updatedFilterWilayahFilter = {
    wilayah: updateFirstOptionLabel(filterWilayahFilter.wilayah, "Pilih Wilayah"),
    blok: updateFirstOptionLabel(filterWilayahFilter.blok, "Pilih Blok"),
    kamar: updateFirstOptionLabel(filterWilayahFilter.kamar, "Pilih Kamar"),
    urutBerdasarkan: urutBerdasarkan,
  }

  const updatedFilterWilayahFilterLulus = {
    wilayah: updateFirstOptionLabel(filterWilayahFilterLulus.wilayah, "Pilih Wilayah"),
    blok: updateFirstOptionLabel(filterWilayahFilterLulus.blok, "Pilih Blok"),
    kamar: updateFirstOptionLabel(filterWilayahFilterLulus.kamar, "Pilih Kamar"),
    urutBerdasarkan: urutBerdasarkan,
  }

  const wilayahTerpilih = filterWilayahFilter.wilayah.find((n) => n.value == selectedWilayahFilter.wilayah)?.nama || ""
  const blokTerpilih = filterWilayahFilter.blok.find((n) => n.value == selectedWilayahFilter.blok)?.label || ""
  const kamarTerpilih = filterWilayahFilter.kamar.find((n) => n.value == selectedWilayahFilter.kamar)?.label || ""

  const wilayahTerpilihLulus =
    filterWilayahFilterLulus.wilayah.find((n) => n.value == selectedWilayahFilterLulus.wilayah)?.nama || ""
  const blokTerpilihLulus =
    filterWilayahFilterLulus.blok.find((n) => n.value == selectedWilayahFilterLulus.blok)?.label || ""
  const kamarTerpilihLulus =
    filterWilayahFilterLulus.kamar.find((n) => n.value == selectedWilayahFilterLulus.kamar)?.label || ""

  useEffect(() => {
    if (wilayahTerpilih || blokTerpilih || kamarTerpilih) {
      setFilters({
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih,
      })
    }
    if (wilayahTerpilihLulus || blokTerpilihLulus || kamarTerpilihLulus) {
      console.log(wilayahTerpilihLulus)

      setFiltersLulus({
        wilayah: wilayahTerpilihLulus,
        blok: blokTerpilihLulus,
        kamar: kamarTerpilihLulus,
      })
    }
  }, [wilayahTerpilih, blokTerpilih, kamarTerpilih, wilayahTerpilihLulus, blokTerpilihLulus, kamarTerpilihLulus])

  // useEffect(() => {
  //     if (totalDataSantri && totalDataSantri != 0) setLimit(totalDataSantri);
  // }, [setLimit, totalDataSantri]);

  useEffect(() => {
    if (isAllSelectedSantri && allSantriIds.length > 0) {
      setSelectedSantriIds(allSantriIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSantriIds])

  // useEffect(() => {
  //     console.log(totalDataLulus);

  //     if (totalDataLulus && totalDataLulus != 0) setLimitLulus(totalDataLulus);
  // }, [setLimitLulus, totalDataLulus]);

  const handlePageChangeSantri = (page) => {
    if (page >= 1 && page <= totalPagesSantri) {
      setCurrentPageSantri(page)
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
    const selectedIds = isProses ? selectedSantriIds : selectedLulusIds

    if (selectedIds.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: `Pilih minimal satu data ${isProses ? "santri" : "alumni"} untuk diproses.`,
      })
      return
    }

    const endpoint = isProses ? "proses-alumni" : "batal-alumni"
    const payload = { santri_id: selectedIds }

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
    //     id: selectedSantriIds,
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
                        <b>Daftar santri yang gagal diproses:</b><br><br>
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
      setIsAllSelectedSantri(false)
      setSelectedSantriIds([])
      setSelectedLulusIds([])
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
    const availableIds = santri.map((item) => item.id)
    setSelectedSantriIds((prev) => prev.filter((id) => availableIds.includes(id)))

    if (!availableIds.some((id) => selectedSantriIds.includes(id))) {
      setIsAllSelectedSantri(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [santri])

  useEffect(() => {
    const availableIds = dataLulus.map((item) => item.id)
    setSelectedLulusIds((prev) => prev.filter((id) => availableIds.includes(id)))

    if (!availableIds.some((id) => selectedLulusIds.includes(id))) {
      setIsAllSelectedLulus(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLulus])

  if (!hasAccess("proses_alumni_santri")) {
        return <Navigate to="/forbidden" replace />;
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-graduation-cap text-white text-xl sm:text-2xl"></i>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Proses Alumni Santri</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Kelola proses dan pembatalan alumni santri
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Panel - Active Santri */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="text-white">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-users"></i>
                  Daftar Santri Aktif
                </h2>
                <p className="text-emerald-100 mt-1 text-sm">Pilih santri yang akan diluluskan</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama santri..."
                  className="pl-10 pr-4 py-3 w-full border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  value={searchTermSantri}
                  onChange={(e) => setSearchTermSantri(e.target.value)}
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
                  filterOptions={updatedFilterWilayahFilter}
                  onChange={(newFilters) => {
                    if (newFilters.urutBerdasarkan !== undefined) {
                      setFilters({ ...filters, urutBerdasarkan: newFilters.urutBerdasarkan })
                    } else {
                      handleFilterChangeWilayahFilter(newFilters)
                    }
                  }}
                  selectedFilters={{ ...selectedWilayahFilter, urutBerdasarkan: filters.urutBerdasarkan }}
                />
              </div>
            </div>

            {!shouldFetch ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-mosque text-emerald-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-gray-600 text-base sm:text-lg font-medium">Silakan pilih wilayah terlebih dahulu</p>
                <p className="text-gray-500 text-sm mt-1">Pilih wilayah untuk melihat daftar santri</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-red-600 font-semibold text-base sm:text-lg mb-2">Terjadi kesalahan</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Gagal mengambil data santri</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Muat Ulang
                </button>
              </div>
            ) : (
              <>
                <SearchBar
                  totalData={totalDataSantri}
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
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 transition-colors"
                              checked={isAllSelectedSantri}
                              onChange={async (e) => {
                                const checked = e.target.checked
                                setIsAllSelectedSantri(checked)
                                if (checked) {
                                  await fetchAllDataSantri()
                                  setSelectedSantriIds(allSantriIds)
                                } else {
                                  setSelectedSantriIds([])
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
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Wilayah
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {loadingSantri ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <OrbitProgress variant="disc" color="#10B981" size="small" text="" textColor="" />
                              <p className="text-gray-500 mt-3 text-sm sm:text-base">Memuat data santri...</p>
                            </td>
                          </tr>
                        ) : santri.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12 sm:py-16">
                              <div className="text-gray-500">
                                <i className="fas fa-inbox text-4xl sm:text-5xl mb-4 block text-gray-300"></i>
                                <p className="text-base sm:text-lg font-medium">Tidak ada data santri</p>
                                <p className="text-sm mt-1">Coba ubah filter atau kriteria pencarian</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          santri.map((item, index) => (
                            <tr
                              key={item.id || index}
                              className="hover:bg-emerald-50/50 transition-colors duration-200"
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 transition-colors"
                                  checked={selectedSantriIds.includes(item.id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    if (checked) {
                                      setSelectedSantriIds((prev) => {
                                        const newSelected = [...prev, item.id]
                                        if (newSelected.length == santri.length) {
                                          setIsAllSelectedSantri(true)
                                        }
                                        return newSelected
                                      })
                                    } else {
                                      setSelectedSantriIds((prev) => {
                                        const newSelected = prev.filter((id) => id != item.id)
                                        setIsAllSelectedSantri(false)
                                        return newSelected
                                      })
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 font-medium">
                                {(currentPageSantri - 1) * limit + index + 1}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-900">
                                {item.nis}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                {item.nama}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                {item.wilayah}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </DoubleScrollbarTable>
                </div>

                {totalPagesSantri > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPageSantri}
                      totalPages={totalPagesSantri}
                      handlePageChange={handlePageChangeSantri}
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
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-exchange-alt text-white text-lg sm:text-xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Aksi Kelulusan</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Pilih aksi yang ingin dilakukan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <button
                type="submit"
                onClick={() => setSubmitAction("proses")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <i className="fas fa-graduation-cap text-base sm:text-lg"></i>
                <span>Proses Alumni</span>
                <FontAwesomeIcon icon={isMobile ? faArrowDown : faArrowRight} className="text-xs sm:text-sm" />
              </button>

              <button
                type="submit"
                onClick={() => setSubmitAction("batal")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={isMobile ? faArrowUp : faArrowLeft} className="text-xs sm:text-sm" />
                <span>Batal Alumni</span>
                <i className="fas fa-undo text-base sm:text-lg"></i>
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-emerald-600">Santri Terpilih</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{selectedSantriIds.length}</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <p className="text-xs sm:text-sm font-medium text-orange-600">Alumni Terpilih</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-700 mt-1">{selectedLulusIds.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Graduated Santri */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="text-white">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-user-graduate"></i>
                  Alumni Santri
                </h2>
                <p className="text-orange-100 mt-1 text-sm">Data alumni santri 30 hari terakhir yang dapat dibatalkan</p>
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
                  filterOptions={updatedFilterWilayahFilterLulus}
                  onChange={(newFilters) => {
                    if (newFilters.urutBerdasarkan !== undefined) {
                      setFiltersLulus({ ...filtersLulus, urutBerdasarkan: newFilters.urutBerdasarkan })
                    } else {
                      handleFilterChangeWilayahFilterLulus(newFilters)
                    }
                  }}
                  selectedFilters={{ ...selectedWilayahFilterLulus, urutBerdasarkan: filtersLulus.urutBerdasarkan }}
                />
              </div>
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
                                  setSelectedLulusIds(allIds)
                                } else {
                                  setSelectedLulusIds([])
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
                                  checked={selectedLulusIds.includes(item.id)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    if (checked) {
                                      setSelectedLulusIds((prev) => {
                                        const newSelected = [...prev, item.id]
                                        if (newSelected.length === dataLulus.length) {
                                          setIsAllSelectedLulus(true)
                                        }
                                        return newSelected
                                      })
                                    } else {
                                      setSelectedLulusIds((prev) => {
                                        const newSelected = prev.filter((id) => id !== item.id)
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
                                {item.nis}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                {item.nama}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                <span
                                  className={`inline-flex px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full ${
                                    item.status == "alumni"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {item.status == "alumni" ? "Alumni" : "-"}
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

export default AlumniSantri
