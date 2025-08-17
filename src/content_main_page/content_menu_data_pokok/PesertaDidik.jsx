"use client"

import { useEffect, useMemo, useState } from "react"
import useFetchPeserta from "../../hooks/hooks_menu_data_pokok/PesertaDidik"
import PesertaItem from "../../components/PesertaItem"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { OrbitProgress } from "react-loading-indicators"
import Pagination from "../../components/Pagination"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import ModalDetail from "../../components/modal/ModalDetail"
import { FaEdit, FaFileExport, FaFileImport, FaPlus, FaArrowLeft } from "react-icons/fa"
import MultiStepModal from "../../components/modal/ModalFormPesertaDidik"
import { useMultiStepFormPesertaDidik } from "../../hooks/hooks_modal/useMultiStepFormPesertaDidik"
import { jenisBerkasList } from "../../data/menuData"
import { generateDropdownTahun } from "../../utils/generateDropdownTahun"
import Access from "../../components/Access"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { ModalExport } from "../../components/modal/ModalExport"
import { Link, Navigate } from "react-router-dom"
import ModalImport from "../../components/modal/ModalImport"
import { hasAccess } from "../../utils/hasAccess"

const PesertaDidik = () => {
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
        phoneNumber: "",
        wargaPesantren: "",
        status: "santri",
        jenisKelamin: "",
        smartcard: "",
        pemberkasan: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        angkatanPelajar: "",
        angkatanSantri: "",
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
        pesertaDidik,
        loadingPesertaDidik,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPesertaDidik,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData,
    } = useFetchPeserta(updatedFilters)
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
            // { label: "Semua Status", value: "" },
            { label: "Santri", value: "santri" },
            { label: "Santri Non Pelajar", value: "santri non pelajar" },
            { label: "Pelajar", value: "pelajar" },
            { label: "Pelajar Non Santri", value: "pelajar non santri" },
            { label: "Santri-Pelajar/Pelajar-Santri", value: "" },
            { label: "Santri Sekaligus Pelajar", value: "santri-pelajar" },
        ],
        angkatanPelajar: generateDropdownTahun({
            placeholder: "Semua Angkatan Pelajar",
            labelTemplate: "Masuk Tahun {year}",
        }),
        angkatanSantri: generateDropdownTahun({
            placeholder: "Semua Angkatan Santri",
            labelTemplate: "Masuk Tahun {year}",
        }),
    }

    const filter5 = {
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Angkatan", value: "angkatan" },
            { label: "Jenis Kelamin", value: "jenis kelamin" },
            { label: "Tempat Lahir", value: "tempat lahir" },
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" },
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" },
        ],
    }

    const filter6 = {}

    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        { label: "Anak ke", value: "anak_ke" },
        { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "Alamat", value: "alamat" },
        { label: "Domisili Santri", value: "domisili_santri" },
        { label: "Angkatan Santri", value: "angkatan_santri" },
        { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        { label: "Status", value: "status" },
        { label: "Ibu Kandung", value: "ibu_kandung" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormPesertaDidik(() => setShowFormModal(false), jenisBerkasList, fetchData)

    if (!hasAccess("santri")) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold">
                    {showStatistik ? "Statistik Data Peserta Didik" : "Data Peserta Didik"}
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

            <div className="mb-10">
                {/* {showStatistik ? (
                    <StatistikChart data={pesertaDidik} loading={loadingPesertaDidik} totalData={totalDataPesertaDidik} />
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
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            totalData={totalDataPesertaDidik}
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
                                {loadingPesertaDidik ? (
                                    <div className="col-span-3 flex justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : pesertaDidik.length === 0 ? (
                                    <p className="text-center col-span-3">Tidak ada data</p>
                                ) : (
                                    pesertaDidik.map((item, index) => (
                                        <PesertaItem key={index} data={item} title="Peserta Didik" menu={1} />
                                    ))
                                )}
                            </div>
                        ) : (
                            <DoubleScrollbarTable>
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                        <tr>
                                            <th className="px-3 py-2 border-b w-16">#</th>
                                            <th className="px-3 py-2 border-b">Nama</th>
                                            <th className="px-3 py-2 border-b">NIUP</th>
                                            <th className="px-3 py-2 border-b">NIK / No. Passport</th>
                                            <th className="px-3 py-2 border-b">Lembaga</th>
                                            <th className="px-3 py-2 border-b">Wilayah</th>
                                            <th className="px-3 py-2 border-b">Kota Asal</th>
                                            <th className="px-3 py-2 border-b">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800">
                                        {loadingPesertaDidik ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-6">
                                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                </td>
                                            </tr>
                                        ) : pesertaDidik.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-6">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            pesertaDidik.map((item, index) => (
                                                <tr
                                                    key={item.id_pengajar || index}
                                                    className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                    onClick={() => openModal(item)}
                                                >
                                                    <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.nik_or_passport || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                                    <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                                    <td className="px-3 py-2 border-b text-center space-x-2 w-10">
                                                        <Link to={`/formulir/${item.biodata_id || item.id || item}/biodata`}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                }}
                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </Link>
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
                    {/* </>
                )} */}
            </div>

            <ModalExport
                isOpen={openModalExport}
                onClose={() => setOpenModalExport(false)}
                filters={updatedFilters}
                searchTerm={searchTerm}
                limit={limit}
                currentPage={currentPage}
                fields={fieldsExports}
                endpoint="export/pesertadidik"
            />

            <ModalImport
                isOpen={openModalImport}
                onClose={() => setOpenModalImport(false)}
                onSuccess={handleImportSuccess}
                title="Import Data"
                endpoint="import/santri"
                templateUrl="/template/pesertadidik_template_pusdatren.xlsx"
                templateName="template_santri.xlsx"
                instructions={[
                    "Download template terlebih dahulu",
                    "Isi data sesuai format template (header di baris 2)",
                    "Jangan mengubah nama kolom/header",
                    "Pastikan format tanggal menggunakan YYYY-MM-DD",
                    "Upload file yang sudah diisi dan klik 'Import Data'",
                ]}
            />

            {isModalOpen && <ModalDetail title="Peserta Didik" menu={1} item={selectedItem} onClose={closeModal} />}

            {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )}
        </div>
    )
}

export default PesertaDidik
