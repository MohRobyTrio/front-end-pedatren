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
import { FaChartLine, FaEdit, FaPlus, FaBook, FaQuran, FaArrowLeft, FaFileImport, FaFileExport, FaUser, FaIdCard, FaStar, FaCheckCircle, FaCalendarAlt } from "react-icons/fa"
import { useMultiStepFormTahfidz } from "../../hooks/hooks_modal/useMultiStepFormTahfidz"
import { generateDropdownTahun } from "../../utils/generateDropdownTahun"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { ModalExport } from "../../components/modal/ModalExport"
import ModalImport from "../../components/modal/ModalImport"
import StatistikChart from "../../components/StatistikChart"
import TahfidzForm from "../../components/TahfidzForm"
import useFetchTahfidz from "../../hooks/hooks_menu_data_pokok/Tahfidz"
import TahfidzItem from "../../components/TahfidzItem"
import useFetchTahunAjaran from "../../hooks/hooks_menu_akademik/TahunAjaran"
import Access from "../../components/Access"
import MultiStepModal from "../../components/modal/ModalFormPesertaDidik"
import { ModalAddTahfidz } from "../../components/modal/ModalFormTahfidz"

export const Tahfidz = ({ student }) => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatistik, setShowStatistik] = useState(false)
    const [activeTab, setActiveTab] = useState("tambah")
    const [selectedStudent, setSelectedStudent] = useState(student)
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [feature, setFeature] = useState(null)

    const { allTahunAjaran } = useFetchTahunAjaran()

    const [selectedYear, setSelectedYear] = useState("")

    // Auto pilih yang statusnya true saat pertama render
    useEffect(() => {
        if (allTahunAjaran.length > 0 && !selectedYear) {
            const aktif = allTahunAjaran.find((tahun) => tahun.status == true)
            if (aktif) {
                setSelectedYear(aktif.id)
            }
        }
    }, [allTahunAjaran, selectedYear])

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
        dataTahfidz,
        detailTahfidz,
        loadingTahfidz,
        loadingDetail,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
        fetchDetailTahfidz,
    } = useFetchTahfidz(updatedFilters)
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState("table")

    useEffect(() => {
        console.log("student:", student);
        if (student) {
            console.log("Fetching detail for student ID:", student.santri_id);
            fetchDetailTahfidz(student.santri_id)
        }
    }, [student, student.santri_id]);

    useEffect(() => {
        if (detailTahfidz?.data) {
            console.log("Daftar Tahfidz:", detailTahfidz.data.tahfidz);
            console.log("Rekap Tahfidz:", detailTahfidz.data.rekap_tahfidz);

            // contoh ambil satu nilai
            console.log("Nama Santri:", detailTahfidz.data.rekap_tahfidz.santri_nama);
            console.log("Tahun Ajaran:", detailTahfidz.data.rekap_tahfidz.tahun_ajaran);
            console.log("Persentase Khatam:", detailTahfidz.data.rekap_tahfidz.persentase_khatam);

            // contoh loop tahfidz
            detailTahfidz.data.tahfidz.forEach((item) => {
                console.log(item.tanggal, item.jenis_setoran, item.surat);
            });
        }
    }, [detailTahfidz]);

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
        tingkatHafalan: [
            { label: "Semua Tingkat", value: "" },
            { label: "1-5 Juz", value: "1-5" },
            { label: "6-10 Juz", value: "6-10" },
            { label: "11-15 Juz", value: "11-15" },
            { label: "16-20 Juz", value: "16-20" },
            { label: "21-25 Juz", value: "21-25" },
            { label: "26-30 Juz", value: "26-30" },
        ],
        targetHafalan: [
            { label: "Semua Target", value: "" },
            { label: "1 Juz", value: "1" },
            { label: "5 Juz", value: "5" },
            { label: "10 Juz", value: "10" },
            { label: "15 Juz", value: "15" },
            { label: "20 Juz", value: "20" },
            { label: "30 Juz", value: "30" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIS", value: "nis" },
            { label: "Tingkat Hafalan", value: "tingkat_hafalan" },
            { label: "Target Hafalan", value: "target_hafalan" },
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
        { label: "Nama Santri", value: "nama_santri" },
        { label: "Kelas", value: "kelas" },
        { label: "Tingkat Hafalan", value: "tingkat_hafalan" },
        { label: "Target Hafalan", value: "target_hafalan" },
        { label: "Hafalan Baru", value: "hafalan_baru" },
        { label: "Murojaah", value: "murojaah" },
        { label: "Tanggal Update", value: "tanggal_update" },
        { label: "Keterangan", value: "keterangan" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormTahfidz(() => setShowFormModal(false), fetchData)

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
        <div className="flex-1 overflow-y-auto">
            {showStudentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pilih Data Santri</h3>
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

            <div className="overflow-x-auto">
                {showStatistik ? (
                    <StatistikChart data={dataTahfidz} loading={loadingTahfidz} totalData={totalData} />
                ) : (
                    <>
                        {/* Filter Section - Only show on laporan tab */}

                        {!selectedStudent ? (
                            <div className="text-center py-8">
                                <FaQuran className="mx-auto text-6xl text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">Pilih Tahun Ajaran & Santri</h3>
                                <p className="text-gray-500 mb-4">
                                    Silakan pilih tahun ajaran lalu pilih santri untuk menambahkan data tahfidz
                                </p>

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
                                <div className="flex items-center justify-between mb-4">
                                    {/* <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-gray-500 rounded-full"></div>
                                        Informasi Santri Terpilih
                                    </h3> */}
                                    {/* <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <FaEdit className="w-3 h-3" />
                                        Ganti Santri
                                    </button> */}
                                </div>

                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-shrink-0 flex justify-center lg:justify-start">
                                        <div className="relative">
                                            <img
                                                src="src\assets\blank_profile.png"
                                                alt={`Foto ${selectedStudent.nama}`}
                                                className="w-24 h-30 md:w-38 md:h-46 rounded-xl object-cover border-3 border-white shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">NIS</span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.nis}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                            Nama Santri
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.nama_santri}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                            Tahun Ajaran
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">{selectedStudent.tahun_ajaran}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                            Rata Rata Nilai
                                                        </span>
                                                        <span className="text-lg font-semibold text-gray-800">
                                                            {selectedStudent.rata_rata_nilai}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="mt-2 pt-2 border-t border-green-100">
                        <div className="flex flex-wrap items-center gap-2 justify-between">
]                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              Aktif
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Tahun Ajaran {selectedStudent.tahun_ajaran}
                            </span>
                          </div>

                        </div>
                      </div> */}
                                        </div>
                                    </div>
                                </div>
                                {/* Tab Navigation */}
                                <div className="border-b border-gray-200 mb-6 mt-4">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveTab("tambah")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "tambah"
                                                ? "border-blue-500 text-blue-500"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaPlus className="inline mr-2" />
                                            Tambah Hafalan
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("laporan")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "laporan"
                                                ? "border-blue-500 text-blue-500"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaBook className="inline mr-2" />
                                            Laporan Tahfidz
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("rekap")}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "rekap"
                                                ? "border-blue-500 text-blue-500"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <FaChartLine className="inline mr-2" />
                                            Rekap Laporan
                                        </button>
                                    </nav>
                                </div>

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
                                                {loadingTahfidz ? (
                                                    <div className="col-span-3 flex justify-center items-center">
                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                    </div>
                                                ) : dataTahfidz.length === 0 ? (
                                                    <p className="text-center col-span-3">Tidak ada data</p>
                                                ) : (
                                                    dataTahfidz.map((item, index) => (
                                                        <TahfidzItem key={index} data={item} title="Data Tahfidz" menu={1} />
                                                    ))
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {/* <div
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
                                                    // totalData={totalDataTahfidz}
                                                    limit={limit}
                                                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                                                    toggleFilters={() => setShowFilters(!showFilters)}
                                                    toggleView={setViewMode}
                                                    showFilterButtons={false}
                                                    showSearch={false}
                                                /> */}
                                                <DoubleScrollbarTable>
                                                    <table className="min-w-full text-sm text-left">
                                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                            <tr>
                                                                <th className="px-3 py-2 border-b w-16">#</th>
                                                                <th className="px-3 py-2 border-b">Tanggal</th>
                                                                <th className="px-3 py-2 border-b">Nama Santri</th>
                                                                <th className="px-3 py-2 border-b">Jenis Setoran</th>
                                                                <th className="px-3 py-2 border-b">Surat</th>
                                                                <th className="px-3 py-2 border-b">Nilai</th>
                                                                <th className="px-3 py-2 border-b">Catatan</th>
                                                                <th className="px-3 py-2 border-b">Status</th>
                                                                <th className="px-3 py-2 border-b">Pencatat</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-800">
                                                            {loadingDetail ? (
                                                                <tr>
                                                                    <td colSpan="9" className="text-center py-6">
                                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                                    </td>
                                                                </tr>
                                                            ) : detailTahfidz.data.tahfidz.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="9" className="text-center py-6">
                                                                        Tidak ada data
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                detailTahfidz.data.tahfidz.map((item, index) => (
                                                                    <tr
                                                                        key={item.id || index}
                                                                        className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                                        onClick={() => openModal(item)}
                                                                    >
                                                                        <td className="px-3 py-2 border-b">
                                                                            {(currentPage - 1) * limit + index + 1 || "-"}
                                                                        </td>
                                                                        <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.santri_nama || "-"}</td>
                                                                        <td className="px-3 py-2 border-b capitalize">{item.jenis_setoran || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.surat || "-"}</td>
                                                                        <td className="px-3 py-2 border-b capitalize">{item.nilai || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.catatan || "-"}</td>
                                                                        <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                                                                        <td className="px-3 py-2 border-b">{item.pencatat || "-"}</td>
                                                                        {/* <td className="px-3 py-2 border-b text-center space-x-2 w-10">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    // Handle edit
                                                                                }}
                                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                                            >
                                                                                <FaEdit />
                                                                            </button>
                                                                        </td> */}
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
                                    loadingDetail ? (
                                        <div className="flex justify-center items-center py-6">
                                            <OrbitProgress
                                                variant="disc"
                                                color="#2a6999"
                                                size="small"
                                                text=""
                                                textColor=""
                                            />
                                        </div>

                                    ) : (
                                        <>
                                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                    <FaChartLine className="mr-2 text-green-600" />
                                                    Progress Hafalan
                                                </h2>

                                                <div className="space-y-6">
                                                    {/* Progress Bar */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-700">Persentase Khatam</span>
                                                            <span
                                                                className={`text-sm font-bold ${Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam) > 50 ? "text-green-600" : Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam) > 25 ? "text-yellow-600" : "text-red-600"}`}
                                                            >
                                                                {Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam).toFixed(2)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className={`h-3 rounded-full transition-all duration-500 ${Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam) > 50
                                                                    ? "bg-green-500"
                                                                    : Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam) > 25
                                                                        ? "bg-yellow-500"
                                                                        : "bg-red-500"
                                                                    }`}
                                                                style={{
                                                                    width: `${Number.parseFloat(detailTahfidz.data.rekap_tahfidz.persentase_khatam)}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Statistics Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-green-600">
                                                                {detailTahfidz.data.rekap_tahfidz.total_surat}
                                                            </div>
                                                            <div className="text-sm text-gray-600">Total Surat</div>
                                                        </div>

                                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {detailTahfidz.data.rekap_tahfidz.jumlah_setoran}
                                                            </div>
                                                            <div className="text-sm text-gray-600">Jumlah Setoran</div>
                                                        </div>

                                                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-purple-600">
                                                                {detailTahfidz.data.rekap_tahfidz.surat_tersisa}
                                                            </div>
                                                            <div className="text-sm text-gray-600">Surat Tersisa</div>
                                                        </div>

                                                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                                            <div className="text-2xl font-bold text-yellow-600">
                                                                {Number.parseFloat(detailTahfidz.data.rekap_tahfidz.sisa_persentase).toFixed(2)}%
                                                            </div>
                                                            <div className="text-sm text-gray-600">Tersisa</div>
                                                        </div>
                                                    </div>

                                                    {/* Additional Information */}
                                                    {(detailTahfidz.data.rekap_tahfidz.tanggal_mulai ||
                                                        detailTahfidz.data.rekap_tahfidz.tanggal_selesai) && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                                                {detailTahfidz.data.rekap_tahfidz.tanggal_mulai && (
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                                                            <FaCalendarAlt className="text-indigo-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm text-gray-500">Tanggal Mulai</div>
                                                                            <div className="font-semibold text-gray-800">
                                                                                {new Date(detailTahfidz.data.rekap_tahfidz.tanggal_mulai).toLocaleDateString(
                                                                                    "id-ID",
                                                                                    {
                                                                                        year: "numeric",
                                                                                        month: "long",
                                                                                        day: "numeric",
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {detailTahfidz.data.rekap_tahfidz.tanggal_selesai && (
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="bg-emerald-100 p-2 rounded-lg">
                                                                            <FaCheckCircle className="text-emerald-600" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm text-gray-500">Tanggal Selesai</div>
                                                                            <div className="font-semibold text-gray-800">
                                                                                {new Date(detailTahfidz.data.rekap_tahfidz.tanggal_selesai).toLocaleDateString(
                                                                                    "id-ID",
                                                                                    {
                                                                                        year: "numeric",
                                                                                        month: "long",
                                                                                        day: "numeric",
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </>
                                    )
                                )}

                                {activeTab === "tambah" && (
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <TahfidzForm student={selectedStudent} onSuccess={fetchData} />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination - Only show on laporan tab */}
                        {/* {totalPages > 1 && activeTab === "laporan" && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )} */}
                    </>
                )}
            </div>

            <ModalExport
                isOpen={openModalExport}
                onClose={() => setOpenModalExport(false)}
                filters={updatedFilters}
                // searchTerm={searchTerm}
                limit={limit}
                currentPage={currentPage}
                fields={fieldsExports}
                endpoint="export/tahfidz"
            />

            <ModalImport
                isOpen={openModalImport}
                onClose={() => setOpenModalImport(false)}
                onSuccess={handleImportSuccess}
                title="Import Data Tahfidz"
                endpoint="import/tahfidz"
                templateUrl="/template/tahfidz_import_template.xlsx"
                templateName="template_tahfidz.xlsx"
                instructions={[
                    "Download template terlebih dahulu",
                    "Isi data sesuai format template (header di baris 2)",
                    "Jangan mengubah nama kolom/header",
                    "Pastikan format tanggal menggunakan YYYY-MM-DD",
                    "Upload file yang sudah diisi dan klik 'Import Data'",
                ]}
            />

            {isModalOpen && <ModalDetail title="Data Tahfidz" menu={1} item={selectedItem} onClose={closeModal} />}

            {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )}

            <ModalAddTahfidz
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                refetchData={fetchData}
                feature={feature}
                id={selectedId}
            />
        </div>
    )
}

export const TahfidzRekap = () => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatistik, setShowStatistik] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [feature, setFeature] = useState(null)

    const [currentView, setCurrentView] = useState("rekap") // 'rekap' or 'tahfidz'
    const [selectedStudentForTahfidz, setSelectedStudentForTahfidz] = useState(null)

    const handleSelectStudent = (student) => {
        setSelectedStudentForTahfidz(student)
        setCurrentView("tahfidz")
    }

    const handleBackToRekap = () => {
        setCurrentView("rekap")
        setSelectedStudentForTahfidz(null)
    }

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
        dataTahfidz,
        detailTahfidz,
        loadingTahfidz,
        loadingDetail,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
        fetchDetailTahfidz,
    } = useFetchTahfidz(updatedFilters)

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
        jenisSetoran: [
            { label: "Semua Jenis Setoran", value: "" },
            { label: "Baru", value: "baru" },
            { label: "Murojaah", value: "murojaah" },
        ],
        nilai: [
            { label: "Semua Nilai", value: "" },
            { label: "Lancar", value: "lancar" },
            { label: "Cukup", value: "cukup" },
            { label: "Kurang", value: "kurang" },
        ],
        ustadz: [
            { label: "Semua Ustadz", value: "" },
            { label: "Ustadz Ahmad", value: "ustadz_ahmad" },
            { label: "Ustadz Muhammad", value: "ustadz_muhammad" },
            { label: "Ustadz Ali", value: "ustadz_ali" },
            { label: "Ustadz Hassan", value: "ustadz_hassan" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIS", value: "nis" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Surat", value: "surat" },
            { label: "Nilai", value: "nilai" },
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
        { label: "Nama Santri", value: "nama_siswa" },
        { label: "Kelas", value: "kelas" },
        { label: "Tahun Ajaran", value: "tahun_ajaran" },
        { label: "Ustadz", value: "ustadz" },
        { label: "Tanggal", value: "tanggal" },
        { label: "Jenis Setoran", value: "jenis_setoran" },
        { label: "Surat", value: "surat" },
        { label: "Ayat Mulai", value: "ayat_mulai" },
        { label: "Ayat Selesai", value: "ayat_selesai" },
        { label: "Nilai", value: "nilai" },
        { label: "Status", value: "status" },
        { label: "Catatan", value: "catatan" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormTahfidz(() => setShowFormModal(false), fetchData)

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            {currentView === "tahfidz" ? (
                // Show Tahfidz component
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4 justify-between">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {/* <div className="w-2 h-6 bg-gray-500 rounded-full"></div> */}
                            Informasi Santri Terpilih
                        </h3>
                        <button
                            onClick={handleBackToRekap}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                        {/* <h1 className="text-xl md:text-2xl font-bold">Input Tahfidz - {selectedStudentForTahfidz?.nama}</h1> */}
                    </div>
                    <Tahfidz student={selectedStudentForTahfidz} />
                </div>
            ) : (
                // Show existing rekap content
                <>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            {showStatistik ? "Statistik Data Tahfidz" : "Rekap Data Tahfidz Santri"}
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
                                            onClick={() => {
                                                setShowFormModal(true)
                                                setFeature(1)
                                            }}
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
                                    </button> */}

                                    <button
                                        onClick={() => setOpenModalExport(true)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                                    >
                                        <FaFileExport /> Export
                                    </button>
                                </>
                            )}

                            {/* <button
                        onClick={() => setShowStatistik(!showStatistik)}
                        className={`${showStatistik ? "bg-gray-500 hover:bg-gray-600" : "bg-indigo-500 hover:bg-indigo-700"
                            } text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base`}
                    >
                        {showStatistik ? <FaTable /> : <FaChartLine />}
                        {showStatistik ? "Data" : "Statistik"}
                    </button> */}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                        {showStatistik ? (
                            <StatistikChart data={dataTahfidz} loading={loadingTahfidz} totalData={totalData} />
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
                                        {loadingTahfidz ? (
                                            <div className="col-span-3 flex justify-center items-center">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </div>
                                        ) : (dataTahfidz.length > 0).length === 0 ? (
                                            <p className="text-center col-span-3">Tidak ada data</p>
                                        ) : (
                                            (dataTahfidz.length > 0).map((item, index) => (
                                                <TahfidzItem key={index} data={item} title="Data Tahfidz" menu={1} />
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
                                                    <th className="px-3 py-2 border-b">Total Surat</th>
                                                    <th className="px-3 py-2 border-b">Progress (%)</th>
                                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-800">
                                                {loadingTahfidz ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-6">
                                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                        </td>
                                                    </tr>
                                                ) : dataTahfidz.length == 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-6">
                                                            Tidak ada data
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    dataTahfidz.length > 0 &&
                                                    dataTahfidz.map((item, index) => (
                                                        <tr
                                                            key={item.id || index}
                                                            className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                            onClick={() => openModal(item)}
                                                        >
                                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.total_surat || "-"}</td>
                                                            <td className="px-3 py-2 border-b">
                                                                <div className="flex items-center">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                                        <div
                                                                            className="bg-green-600 h-2 rounded-full"
                                                                            style={{ width: `${item.persentase_khatam}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-gray-600">{item.persentase_khatam}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 border-b text-center">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleSelectStudent(item)
                                                                    }}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1 mx-auto"
                                                                >
                                                                    <FaEdit className="w-3 h-3" />
                                                                    Pilih
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </DoubleScrollbarTable>
                                )}

                                {totalPages > 1 && (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                                )}
                            </>
                        )}
                    </div>

                    <ModalExport
                        isOpen={openModalExport}
                        onClose={() => setOpenModalExport(false)}
                        filters={updatedFilters}
                        // searchTerm={searchTerm}
                        limit={limit}
                        currentPage={currentPage}
                        fields={fieldsExports}
                        endpoint="export/tahfidz"
                    />

                    <ModalImport
                        isOpen={openModalImport}
                        onClose={() => setOpenModalImport(false)}
                        onSuccess={handleImportSuccess}
                        title="Import Data Tahfidz"
                        endpoint="import/tahfidz"
                        templateUrl="/template/tahfidz_import_template.xlsx"
                        templateName="template_tahfidz.xlsx"
                        instructions={[
                            "Download template terlebih dahulu",
                            "Isi data sesuai format template (header di baris 2)",
                            "Jangan mengubah nama kolom/header",
                            "Pastikan format tanggal menggunakan YYYY-MM-DD",
                            "Upload file yang sudah diisi dan klik 'Import Data'",
                        ]}
                    />

                    {isModalOpen && <ModalDetail title="Data Tahfidz" menu={24} item={selectedItem} onClose={closeModal} />}

                    {/* {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )} */}

                    <ModalAddTahfidz
                        isOpen={showFormModal}
                        onClose={() => setShowFormModal(false)}
                        refetchData={fetchData}
                        feature={feature}
                        id={selectedId}
                    />
                </>
            )}
        </div>
    )
}


export const TahfidzSetoran = () => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatistik, setShowStatistik] = useState(false)

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
        tahfidzData,
        loadingTahfidz,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataTahfidz,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
    } = useFetchTahfidz(updatedFilters)
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
        jenisSetoran: [
            { label: "Semua Jenis Setoran", value: "" },
            { label: "Baru", value: "baru" },
            { label: "Murojaah", value: "murojaah" },
        ],
        nilai: [
            { label: "Semua Nilai", value: "" },
            { label: "Lancar", value: "lancar" },
            { label: "Cukup", value: "cukup" },
            { label: "Kurang", value: "kurang" },
        ],
        ustadz: [
            { label: "Semua Ustadz", value: "" },
            { label: "Ustadz Ahmad", value: "ustadz_ahmad" },
            { label: "Ustadz Muhammad", value: "ustadz_muhammad" },
            { label: "Ustadz Ali", value: "ustadz_ali" },
            { label: "Ustadz Hassan", value: "ustadz_hassan" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIS", value: "nis" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Surat", value: "surat" },
            { label: "Nilai", value: "nilai" },
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
        { label: "Nama Santri", value: "nama_siswa" },
        { label: "Kelas", value: "kelas" },
        { label: "Tahun Ajaran", value: "tahun_ajaran" },
        { label: "Ustadz", value: "ustadz" },
        { label: "Tanggal", value: "tanggal" },
        { label: "Jenis Setoran", value: "jenis_setoran" },
        { label: "Surat", value: "surat" },
        { label: "Ayat Mulai", value: "ayat_mulai" },
        { label: "Ayat Selesai", value: "ayat_selesai" },
        { label: "Nilai", value: "nilai" },
        { label: "Status", value: "status" },
        { label: "Catatan", value: "catatan" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormTahfidz(() => setShowFormModal(false), fetchData)

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {/* <FaQuran className="text-green-600" /> */}
                    {showStatistik ? "Statistik Data Tahfidz" : "Data Tahfidz Santri"}
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
                            <Access action="tambah">
                                <button
                                    onClick={() => setShowFormModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                                >
                                    <FaPlus /> Tambah
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

                    {/* <button
                        onClick={() => setShowStatistik(!showStatistik)}
                        className={`${showStatistik ? "bg-gray-500 hover:bg-gray-600" : "bg-indigo-500 hover:bg-indigo-700"
                            } text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base`}
                    >
                        {showStatistik ? <FaTable /> : <FaChartLine />}
                        {showStatistik ? "Data" : "Statistik"}
                    </button> */}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                {showStatistik ? (
                    <StatistikChart data={tahfidzData} loading={loadingTahfidz} totalData={totalDataTahfidz} />
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
                            totalData={totalDataTahfidz}
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
                                {loadingTahfidz ? (
                                    <div className="col-span-3 flex justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : (tahfidzData.length > 0 ? tahfidzData : mockTahfidzData).length === 0 ? (
                                    <p className="text-center col-span-3">Tidak ada data</p>
                                ) : (
                                    (tahfidzData.length > 0 ? tahfidzData : mockTahfidzData).map((item, index) => (
                                        <TahfidzItem key={index} data={item} title="Data Tahfidz" menu={1} />
                                    ))
                                )}
                            </div>
                        ) : (
                            <DoubleScrollbarTable>
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                        <tr>
                                            <th className="px-3 py-2 border-b w-16">#</th>
                                            <th className="px-3 py-2 border-b">Tanggal</th>
                                            <th className="px-3 py-2 border-b">Nama Santri</th>
                                            <th className="px-3 py-2 border-b">NIS</th>
                                            <th className="px-3 py-2 border-b">Kelas</th>
                                            <th className="px-3 py-2 border-b">Hafalan Baru</th>
                                            <th className="px-3 py-2 border-b">Keterangan</th>
                                            <th className="px-3 py-2 border-b">Murojaah</th>
                                            <th className="px-3 py-2 border-b">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800">
                                        {loadingTahfidz ? (
                                            <tr>
                                                <td colSpan="14" className="text-center py-6">
                                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                </td>
                                            </tr>
                                        ) : (tahfidzData.length > 0 ? tahfidzData : mockTahfidzData).length === 0 ? (
                                            <tr>
                                                <td colSpan="14" className="text-center py-6">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            (tahfidzData.length > 0 ? tahfidzData : mockTahfidzData).map((item, index) => (
                                                <tr
                                                    key={item.id || index}
                                                    className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                    onClick={() => openModal(item)}
                                                >
                                                    <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.nama_siswa || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.kelas || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.tahun_ajaran || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.ustadz || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.ustadz || "-"}</td>
                                                    <td className="px-3 py-2 border-b text-center space-x-2 w-10">
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
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </DoubleScrollbarTable>
                        )}

                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )}
                    </>
                )}
            </div>

            <ModalExport
                isOpen={openModalExport}
                onClose={() => setOpenModalExport(false)}
                filters={updatedFilters}
                searchTerm={searchTerm}
                limit={limit}
                currentPage={currentPage}
                fields={fieldsExports}
                endpoint="export/tahfidz"
            />

            <ModalImport
                isOpen={openModalImport}
                onClose={() => setOpenModalImport(false)}
                onSuccess={handleImportSuccess}
                title="Import Data Tahfidz"
                endpoint="import/tahfidz"
                templateUrl="/template/tahfidz_import_template.xlsx"
                templateName="template_tahfidz.xlsx"
                instructions={[
                    "Download template terlebih dahulu",
                    "Isi data sesuai format template (header di baris 2)",
                    "Jangan mengubah nama kolom/header",
                    "Pastikan format tanggal menggunakan YYYY-MM-DD",
                    "Upload file yang sudah diisi dan klik 'Import Data'",
                ]}
            />

            {isModalOpen && <ModalDetail title="Data Tahfidz" menu={1} item={selectedItem} onClose={closeModal} />}

            {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )}
        </div>
    )
}