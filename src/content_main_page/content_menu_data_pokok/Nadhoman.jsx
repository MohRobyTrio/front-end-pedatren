"use client"

import { useEffect, useMemo, useState } from "react"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { OrbitProgress } from "react-loading-indicators"
import Pagination from "../../components/Pagination"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import ModalDetail from "../../components/modal/ModalDetail"
import { FaChartLine, FaEdit, FaPlus, FaBook, FaScroll } from "react-icons/fa"
import MultiStepModal from "../../components/modal/ModalFormNadhoman"
import { useMultiStepFormNadhoman } from "../../hooks/hooks_modal/useMultiStepFormNadhoman"
import { generateDropdownTahun } from "../../utils/generateDropdownTahun"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { ModalExport } from "../../components/modal/ModalExport"
import ModalImport from "../../components/modal/ModalImport"
import StatistikChart from "../../components/StatistikChart"
import NadhomanForm from "../../components/NadhomanForm"
import useFetchNadhoman from "../../hooks/hooks_menu_data_pokok/Nadhoman"
import NadhomanItem from "../../components/NadhomanItem"
import useFetchTahunAjaran from "../../hooks/hooks_menu_akademik/TahunAjaran"

const Nadhoman = () => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatistik, setShowStatistik] = useState(false)
    const [activeTab, setActiveTab] = useState("tambah")
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showStudentModal, setShowStudentModal] = useState(false)

    const { allTahunAjaran } = useFetchTahunAjaran();

    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        if (allTahunAjaran.length > 0 && !selectedYear) {
            const aktif = allTahunAjaran.find((tahun) => tahun.status == true);
            if (aktif) {
                setSelectedYear(aktif.id);
            }
        }
    }, [allTahunAjaran, selectedYear]); 

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
        kitab: "",
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
        nadhomanData,
        loadingNadhoman,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataNadhoman,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
    } = useFetchNadhoman(updatedFilters)
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
            { label: "Aktif", value: "aktif" },
            { label: "Tidak Aktif", value: "tidak aktif" },
            { label: "Lulus", value: "lulus" },
            { label: "Pindah", value: "pindah" },
        ],
        tahunAjaran: generateDropdownTahun({
            placeholder: "Semua Tahun Ajaran",
            labelTemplate: "Tahun {year}/{nextYear}",
        }),
    }

    const filter5 = {
        kitab: [
            { label: "Semua Kitab", value: "" },
            { label: "Bahasa Arab", value: "bahasa-arab" },
            { label: "Amsilati", value: "amsilati" },
            { label: "Awamil", value: "awamil" },
            { label: "Amsilati Tasrifiyah", value: "amsilati-tasrifiyah" },
            { label: "Jurumiyah Jawan", value: "jurumiyah-jawan" },
            { label: "Imrithi", value: "imrithi" },
            { label: "Alfiyah Ibnu Malik Awwal", value: "alfiyah-awwal" },
            { label: "Alfiyah Ibnu Malik Tsani", value: "alfiyah-tsani" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIS", value: "nis" },
            { label: "Kitab", value: "kitab" },
            { label: "Jumlah Hafalan", value: "jumlah_hafalan" },
            { label: "Tanggal Update", value: "tanggal_update" },
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" },
        ],
    }

    const filter6 = {}

    const fieldsExports = [
        { label: "NIS", value: "nis" },
        { label: "Nama Siswa", value: "nama_santri" },
        { label: "Kelas", value: "kelas" },
        { label: "Kitab", value: "kitab" },
        { label: "Jumlah Hafalan Baru", value: "hafalan_baru" },
        { label: "Keterangan Hafalan", value: "keterangan_hafalan" },
        { label: "Tanggal", value: "tanggal" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormNadhoman(() => setShowFormModal(false), fetchData)

    // Mock data untuk demo
    const mockStudents = [
        { nis: "097556282828838", nama: "Ari Surahman", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "1717", nama: "Erwanto E. Yusuf", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "34534543", nama: "Udin", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "123456", nama: "Syamsuri", unit: "PONDOKPA", kelas: "KELAS 1" },
    ]

    const handleSelectStudent = (student) => {
        setSelectedStudent(student)
        setShowStudentModal(false)
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            {/* <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {showStatistik ? "Statistik Data Nadhoman" : "Data Nadhoman Santri"}
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
                            {activeTab === "laporan" && (
                                <>
                                    <Access action="tambah">
                    <button
                      onClick={() => setShowFormModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                    >
                      <FaPlus /> Tambah Nadhoman
                    </button>
                  </Access> 

                                    <button
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
                                    </button>
                                </>
                            )}
                        </>
                    )}

                    <button
            onClick={() => setShowStatistik(!showStatistik)}
            className={`${
              showStatistik ? "bg-gray-500 hover:bg-gray-600" : "bg-indigo-500 hover:bg-indigo-700"
            } text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base`}
          >
            {showStatistik ? <FaTable /> : <FaChartLine />}
            {showStatistik ? "Data" : "Statistik"}
          </button> 
                </div>
            </div> */}

            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">


                {!selectedStudent ? (
                    <div className="text-center py-8">
                        <FaScroll className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Pilih Tahun Ajaran & Santri</h3>
                        <p className="text-gray-500 mb-4">Silakan pilih tahun ajaran lalu pilih santri untuk menambahkan data nadhoman</p>

                        {/* Pilih Tahun Ajaran */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 m-4"
                        >
                            {allTahunAjaran.map((tahun) => (
                                <option key={tahun.id} value={tahun.id}>
                                    {tahun.tahun_ajaran}
                                </option>
                            ))}
                        </select>

                        {/* Pilih Santri */}
                        <button
                            onClick={() => setShowStudentModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                        >
                            Pilih Santri
                        </button>
                    </div>
                ) : (
                    <>
                        {showStatistik ? (
                            <StatistikChart data={nadhomanData} loading={loadingNadhoman} totalData={totalDataNadhoman} />
                        ) : (
                            <>
                                {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6 shadow-sm"> */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                                        Informasi Santri Terpilih
                                    </h3>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <FaEdit className="w-3 h-3" />
                                        Ganti
                                    </button>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-shrink-0 flex justify-center lg:justify-start">
                                        <div className="relative">
                                            <img
                                                src="src\assets\blank_profile.png"
                                                alt={`Foto ${selectedStudent.nama}`}
                                                className="w-24 h-30 md:w-36 md:h-44 rounded-xl object-cover border-3 border-white shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                                                            NIS
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.nis}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                                                            Nama Lengkap
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.nama}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                                                            Unit Sekolah
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.unit}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                                                            Kelas
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.kelas}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-amber-100">
                                                <div className="flex flex-wrap items-center gap-2 justify-between">
                                                    {/* Badge status & tahun ajaran */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                            Aktif
                                                        </span>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                            Tahun Ajaran 2024/2025
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}
                                {/* Tab Navigation */}
                                <div className="border-b border-gray-200 mb-6 mt-4">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveTab("tambah")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "tambah"
                                                ? "border-amber-500 text-amber-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaPlus className="inline mr-2" />
                                            Tambah Hafalan
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("laporan")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "laporan"
                                                ? "border-amber-500 text-amber-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaBook className="inline mr-2" />
                                            Laporan Nadhoman
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("rekap")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "rekap"
                                                ? "border-amber-500 text-amber-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaChartLine className="inline mr-2" />
                                            Rekap Laporan
                                        </button>
                                    </nav>
                                </div>

                                {activeTab === "tambah" && (
                                    <NadhomanForm student={selectedStudent} onSuccess={fetchData} />
                                )}

                                {/* Tab Content */}
                                {activeTab === "laporan" && (
                                    <div>
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
                                                {loadingNadhoman ? (
                                                    <div className="col-span-3 flex justify-center items-center">
                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                    </div>
                                                ) : nadhomanData.length === 0 ? (
                                                    <p className="text-center col-span-3">Tidak ada data</p>
                                                ) : (
                                                    nadhomanData.map((item, index) => (
                                                        <NadhomanItem key={index} data={item} title="Data Nadhoman" menu={1} />
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <>
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
                                                    searchTerm={searchTerm}
                                                    setSearchTerm={setSearchTerm}
                                                    totalData={totalDataNadhoman}
                                                    limit={limit}
                                                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                                                    toggleFilters={() => setShowFilters(!showFilters)}
                                                    toggleView={setViewMode}
                                                    showFilterButtons={false}
                                                    showSearch={false}
                                                />
                                                <DoubleScrollbarTable>
                                                    <table className="min-w-full text-sm text-left">
                                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                            <tr>
                                                                <th className="px-3 py-2 border-b w-16">#</th>
                                                                <th className="px-3 py-2 border-b">Tanggal</th>
                                                                <th className="px-3 py-2 border-b">Nama Siswa</th>
                                                                <th className="px-3 py-2 border-b">NIS</th>
                                                                <th className="px-3 py-2 border-b">Kelas</th>
                                                                <th className="px-3 py-2 border-b">Kitab</th>
                                                                <th className="px-3 py-2 border-b">Jumlah Hafalan Baru</th>
                                                                <th className="px-3 py-2 border-b">Keterangan</th>
                                                                <th className="px-3 py-2 border-b">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-800">
                                                            {loadingNadhoman ? (
                                                                <tr>
                                                                    <td colSpan="9" className="text-center py-6">
                                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                                    </td>
                                                                </tr>
                                                            ) : nadhomanData.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="9" className="text-center py-6">
                                                                        Tidak ada data
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                nadhomanData.map((item, index) => (
                                                                    <tr
                                                                        key={item.id || index}
                                                                        className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                                        onClick={() => openModal(item)}
                                                                    >
                                                                        <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.kelas || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.kitab || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.hafalan_baru || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.keterangan || "-"}</td>
                                                                        <td className="px-3 py-2 border-b text-center space-x-2 w-10">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    // Handle edit
                                                                                }}
                                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                                            >
                                                                                <FaEdit />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </DoubleScrollbarTable>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === "rekap" && (
                                    <div>
                                        <DoubleScrollbarTable>
                                            <table className="min-w-full text-sm text-left">
                                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                    <tr>
                                                        <th className="px-3 py-2 border-b w-16">#</th>
                                                        <th className="px-3 py-2 border-b">NIS</th>
                                                        <th className="px-3 py-2 border-b">Nama Siswa</th>
                                                        <th className="px-3 py-2 border-b">Unit</th>
                                                        <th className="px-3 py-2 border-b">Kelas</th>
                                                        <th className="px-3 py-2 border-b">Kitab</th>
                                                        <th className="px-3 py-2 border-b">Total Hafalan</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-800">
                                                    {loadingNadhoman ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center py-6">
                                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        mockStudents.map((student, index) => (
                                                            <tr key={student.nis} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                                <td className="px-3 py-2 border-b">{student.nis}</td>
                                                                <td className="px-3 py-2 border-b">{student.nama}</td>
                                                                <td className="px-3 py-2 border-b">{student.unit}</td>
                                                                <td className="px-3 py-2 border-b">{student.kelas}</td>
                                                                <td className="px-3 py-2 border-b">
                                                                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                                                                        {["Amsilati", "Jurumiyah", "Imrithi", "Alfiyah"][Math.floor(Math.random() * 4)]}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 border-b">
                                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                                        {Math.floor(Math.random() * 100) + 1} Bait
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </DoubleScrollbarTable>
                                    </div>
                                )}

                                {/* Pagination - Only show on laporan tab */}
                                {totalPages > 1 && activeTab === "laporan" && (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Student Selection Modal */}
            {showStudentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pilih Data Siswa</h3>
                            <button onClick={() => setShowStudentModal(false)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left">No</th>
                                        <th className="px-3 py-2 text-left">NIS</th>
                                        <th className="px-3 py-2 text-left">Nama</th>
                                        <th className="px-3 py-2 text-left">Unit Sekolah</th>
                                        <th className="px-3 py-2 text-left">Kelas</th>
                                        <th className="px-3 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockStudents.map((student, index) => (
                                        <tr key={student.nis} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2">{student.nis}</td>
                                            <td className="px-3 py-2">{student.nama}</td>
                                            <td className="px-3 py-2">{student.unit}</td>
                                            <td className="px-3 py-2">{student.kelas}</td>
                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    onClick={() => handleSelectStudent(student)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Pilih
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <ModalExport
                isOpen={openModalExport}
                onClose={() => setOpenModalExport(false)}
                filters={updatedFilters}
                searchTerm={searchTerm}
                limit={limit}
                currentPage={currentPage}
                fields={fieldsExports}
                endpoint="export/nadhoman"
            />

            <ModalImport
                isOpen={openModalImport}
                onClose={() => setOpenModalImport(false)}
                onSuccess={handleImportSuccess}
                title="Import Data Nadhoman"
                endpoint="import/nadhoman"
                templateUrl="/template/nadhoman_import_template.xlsx"
                templateName="template_nadhoman.xlsx"
                instructions={[
                    "Download template terlebih dahulu",
                    "Isi data sesuai format template (header di baris 2)",
                    "Jangan mengubah nama kolom/header",
                    "Pastikan format tanggal menggunakan YYYY-MM-DD",
                    "Upload file yang sudah diisi dan klik 'Import Data'",
                ]}
            />

            {isModalOpen && <ModalDetail title="Data Nadhoman" menu={1} item={selectedItem} onClose={closeModal} />}

            {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )}
        </div>
    )
}

export default Nadhoman
