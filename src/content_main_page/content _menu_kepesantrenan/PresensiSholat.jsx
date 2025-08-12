"use client"

import { FaArrowLeft, FaEdit, FaFileExport, FaFileImport, FaPlus, FaTrash } from "react-icons/fa"
import Pagination from "../../components/Pagination"
import { OrbitProgress } from "react-loading-indicators"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import StatistikChart from "../../components/StatistikChart"
import Access from "../../components/Access"
import { generateDropdownTahun } from "../../utils/generateDropdownTahun"
import { useEffect, useMemo, useState } from "react"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import useFetchPresensi from "../../hooks/hooks_menu_data_pokok/Presensi"

const PresensiSholat = () => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatistik, setShowStatistik] = useState(false)
    const [showFormModal, setShowFormModal] = useState(false) // Declare setShowFormModal

    const openModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedItem(null)
        setIsModalOpen(false)
    }

    const [filters, setFilters] = useState({
        tahunAjaran: "",
        status: "",
        jenisKelamin: "",
        tingkatHafalan: "",
        targetHafalan: "",
        jenisSetoran: "",
        nilai: "",
        ustadz: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara()
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah()
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga()

    const negaraTerpilih = filterNegara.negara.find((n) => n.value == selectedNegara.negara)?.label || ""
    const provinsiTerpilih = filterNegara.provinsi.find((p) => p.value == selectedNegara.provinsi)?.label || ""
    const kabupatenTerpilih = filterNegara.kabupaten.find((k) => k.value == selectedNegara.kabupaten)?.label || ""
    const kecamatanTerpilih = filterNegara.kecamatan.find((kec) => kec.value == selectedNegara.kecamatan)?.label || ""

    const wilayahTerpilih = filterWilayah.wilayah.find((n) => n.value == selectedWilayah.wilayah)?.nama || ""
    const blokTerpilih = filterWilayah.blok.find((p) => p.value == selectedWilayah.blok)?.label || ""
    const kamarTerpilih = filterWilayah.kamar.find((k) => k.value == selectedWilayah.kamar)?.label || ""

    const lembagaTerpilih = filterLembaga.lembaga.find((n) => n.value == selectedLembaga.lembaga)?.label || ""
    const jurusanTerpilih = filterLembaga.jurusan.find((n) => n.value == selectedLembaga.jurusan)?.label || ""
    const kelasTerpilih = filterLembaga.kelas.find((n) => n.value == selectedLembaga.kelas)?.label || ""
    const rombelTerpilih = filterLembaga.rombel.find((n) => n.value == selectedLembaga.rombel)?.label || ""

    // Gabungkan filter tambahan sebelum dipakai
    const updatedFilters = useMemo(
        () => ({
            ...filters,
            negara: negaraTerpilih,
            provinsi: provinsiTerpilih,
            kabupaten: kabupatenTerpilih,
            kecamatan: kecamatanTerpilih,
            wilayah: wilayahTerpilih,
            blok: blokTerpilih,
            kamar: kamarTerpilih,
            lembaga: lembagaTerpilih,
            jurusan: jurusanTerpilih,
            kelas: kelasTerpilih,
            rombel: rombelTerpilih,
        }),
        [
            blokTerpilih,
            filters,
            jurusanTerpilih,
            kabupatenTerpilih,
            kamarTerpilih,
            kecamatanTerpilih,
            kelasTerpilih,
            lembagaTerpilih,
            negaraTerpilih,
            provinsiTerpilih,
            rombelTerpilih,
            wilayahTerpilih,
        ],
    )

    const {
        dataPresensi,
        loadingPresensi,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
    } = useFetchPresensi(updatedFilters)

    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState("table")

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode")
        if (savedViewMode) {
            setViewMode(savedViewMode)
        }
    }, [])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const filter4 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" },
        ],
        status: [
            { label: "Semua Status", value: "" },
            { label: "Hadir", value: "Hadir" },
            { label: "Izin", value: "Izin" },
            { label: "Sakit", value: "Sakit" },
            { label: "Alfa", value: "Alfa" },
        ],
        tahunAjaran: generateDropdownTahun({
            placeholder: "Semua Tahun Ajaran",
            labelTemplate: "Tahun {year}/{nextYear}",
        }),
    }

    const filter5 = {
        metode: [
            { label: "Semua Metode", value: "" },
            { label: "Manual", value: "Manual" },
            { label: "Kartu", value: "Kartu" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Waktu Presensi", value: "waktu_presensi" },
            { label: "Status", value: "status" },
            { label: "Metode", value: "metode" },
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" },
        ],
    }

    const filter6 = {}

    const fieldsExports = [
        { label: "Tanggal", value: "tanggal" },
        { label: "Waktu Presensi", value: "waktu_presensi" },
        { label: "Status", value: "status" },
        { label: "Metode", value: "metode" },
    ]

    const getStatusBadge = (status) => {
        const statusStyles = {
            Hadir: "bg-green-100 text-green-800",
            Izin: "bg-yellow-100 text-yellow-800",
            Sakit: "bg-blue-100 text-blue-800",
            Alfa: "bg-red-100 text-red-800",
        }
        return statusStyles[status] || "bg-gray-100 text-gray-800"
    }

    const getMethodBadge = (metode) => {
        const methodStyles = {
            Manual: "bg-purple-100 text-purple-800",
            Kartu: "bg-indigo-100 text-indigo-800",
        }
        return methodStyles[metode] || "bg-gray-100 text-gray-800"
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {showStatistik ? "Statistik Presensi Sholat" : "Data Presensi Sholat"}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                    {showStatistik ? (
                        <button
                            onClick={() => setShowStatistik(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                        >
                            <FaArrowLeft /> Kembali ke Data
                        </button>
                    ) : (
                        <>
                            {/* <Access action="tambah">
                                <button
                                    onClick={() => setShowFormModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                                >
                                    <FaPlus /> Tambah
                                </button>
                            </Access> */}

                            {/* <button
                                onClick={() => setOpenModalImport(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                            >
                                <FaFileImport /> Import
                            </button>

                            <button
                                onClick={() => setOpenModalExport(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                            >
                                <FaFileExport /> Export
                            </button> */}
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                {/* {showStatistik ? (
                    <StatistikChart
                        data={presensiSholatData}
                        loading={loadingPresensiSholat}
                        totalData={totalDataPresensiSholat}
                    />
                ) : (
                    <> */}
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
                                filterOptions={filterWilayah}
                                onChange={handleFilterChangeWilayah}
                                selectedFilters={selectedWilayah}
                            />
                            <Filters
                                showFilters={showFilters}
                                filterOptions={filterLembaga}
                                onChange={handleFilterChangeLembaga}
                                selectedFilters={selectedLembaga}
                            />
                            <Filters
                                showFilters={showFilters}
                                filterOptions={filter4}
                                onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                                selectedFilters={filters}
                            />
                            <Filters
                                showFilters={showFilters}
                                filterOptions={filter5}
                                onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                                selectedFilters={filters}
                            />
                            <Filters
                                showFilters={showFilters}
                                filterOptions={filter6}
                                onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                                selectedFilters={filters}
                            />
                        </div>

                        <SearchBar
                            // searchTerm={searchTerm}
                            // setSearchTerm={setSearchTerm}
                            totalData={totalData}
                            limit={limit}
                            toggleLimit={(e) => setLimit(Number(e.target.value))}
                            toggleFilters={() => setShowFilters(!showFilters)}
                            toggleView={setViewMode}
                        />

                        {error ? (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        ) : viewMode === "list" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                {loadingPresensi ? (
                                    <div className="col-span-3 flex justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : dataPresensi.length === 0 ? (
                                    <p className="text-center col-span-3">Tidak ada data</p>
                                ) : (
                                    dataPresensi.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm font-medium text-gray-600">Tanggal:</span>
                                                    <span className="text-sm text-gray-900">{item.tanggal}</span>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm font-medium text-gray-600">Waktu:</span>
                                                    <span className="text-sm text-gray-900">{item.waktu_presensi}</span>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm font-medium text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm font-medium text-gray-600">Metode:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodBadge(item.metode)}`}>
                                                        {item.metode}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <DoubleScrollbarTable>
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                        <tr>
                                            <th className="px-3 py-2 border-b w-16">#</th>
                                            <th className="px-3 py-2 border-b">Nama Santri</th>
                                            <th className="px-3 py-2 border-b">NIS</th>
                                            <th className="px-3 py-2 border-b">Nama Sholat</th>
                                            <th className="px-3 py-2 border-b">Tanggal</th>
                                            <th className="px-3 py-2 border-b">Waktu Presensi</th>
                                            <th className="px-3 py-2 border-b">Status</th>
                                            <th className="px-3 py-2 border-b">Metode</th>
                                            {/* <th className="px-3 py-2 border-b">Aksi</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800">
                                        {loadingPresensi ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-6">
                                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                </td>
                                            </tr>
                                        ) : dataPresensi.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-6">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            dataPresensi.map(
                                                (item, index) => (
                                                    <tr
                                                        key={item.id || index}
                                                        className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                                        onClick={() => openModal(item)}
                                                    >
                                                        <td className="px-3 py-2 border-b text-center">{index + 1}</td>
                                                        <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
                                                        <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                        <td className="px-3 py-2 border-b">{item.nama_sholat || "-"}</td>
                                                        <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                                        <td className="px-3 py-2 border-b">{item.waktu_presensi || "-"}</td>
                                                        <td className="px-3 py-2 border-b">
                                                            {item.status || "-"}
                                                        </td>
                                                        <td className="px-3 py-2 border-b">
                                                            {item.metode || "-"}
                                                        </td>
                                                        {/* <td className="px-3 py-2 border-b text-center space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    // Handle edit action
                                                                }}
                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    // Handle delete action
                                                                }}
                                                                className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td> */}
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </DoubleScrollbarTable>
                        )}

                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )}
                    {/* </>
                )} */}
            </div>
        </div>
    )
}

export default PresensiSholat
