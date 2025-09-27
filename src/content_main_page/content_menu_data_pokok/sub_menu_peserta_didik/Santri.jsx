import { useEffect, useMemo, useState } from "react";
import PesertaItem from "../../../components/PesertaItem";
import SearchBar from "../../../components/SearchBar";
import Filters from "../../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../../components/Pagination";
import DropdownNegara from "../../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
// import useFetchPeserta from "../../../hooks/hooks_menu_data_pokok/PesertaDidik";
import useFetchSantri from "../../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri";
import ModalDetail from "../../../components/modal/ModalDetail";
import DoubleScrollbarTable from "../../../components/DoubleScrollbarTable";
import { FaEdit, FaFileExport, FaFileImport, FaPlus } from "react-icons/fa";
import Access from "../../../components/Access";
import ModalImport from "../../../components/modal/ModalImport";
import MultiStepModal from "../../../components/modal/ModalFormPesertaDidik";
import { useMultiStepFormPesertaDidik } from "../../../hooks/hooks_modal/useMultiStepFormPesertaDidik";
import { Link, Navigate } from "react-router-dom";
import DropdownAngkatan from "../../../hooks/hook_dropdown/DropdownAngkatan";
import useDropdownBerkas from "../../../hooks/hook_dropdown/DropdownBerkas";
import { hasAccess } from "../../../utils/hasAccess";
import { ModalExportSantri } from "../../../components/modal/ModalExportSantri";

const Santri = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalExport, setOpenModalExport] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { jenisBerkasList } = useDropdownBerkas();

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const [filters, setFilters] = useState({
        phoneNumber: "",
        wargaPesantren: "",
        status: "",
        jenisKelamin: "",
        smartcard: "",
        pemberkasan: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",       // Tambahkan default value
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        angkatanPelajar: "",
        angkatanSantri: "",
        // kewaliasuhan: ""
    })

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { menuAngkatanSantri } = DropdownAngkatan();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.nama || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.nama || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.nama || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    // Gabungkan filter tambahan sebelum dipakai
    const updatedFilters = useMemo(() => ({
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
        rombel: rombelTerpilih
    }), [blokTerpilih, filters, jurusanTerpilih, kabupatenTerpilih, kamarTerpilih, kecamatanTerpilih, kelasTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih, rombelTerpilih, wilayahTerpilih]);

    // const { pesertaDidik, loadingPesertaDidik, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPesertaDidik, totalPages, currentPage, setCurrentPage } = useFetchPeserta(updatedFilters);
    const { santri, loadingSantri, searchTerm, setSearchTerm, error, limit, setLimit, totalDataSantri, totalPages, currentPage, setCurrentPage, fetchData } = useFetchSantri(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    // const totalPages = Math.ceil(totalDataPesertaDidik / limit);

    // console.log(totalPages);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter4 = {
        // Sudah
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        // Sudah
        status: [
            { label: "Semua Status", value: "" },
            { label: "Santri", value: "santri" },
            { label: "Santri Non Pelajar", value: "santri non pelajar" },
            { label: "Pelajar", value: "pelajar" },
            { label: "Pelajar Non Santri", value: "pelajar non santri" },
            { label: "Santri-Pelajar/Pelajar-Santri", value: "santri-pelajar" }
        ],

        angkatanSantri: updateFirstOptionLabel(menuAngkatanSantri, "Semua Angkatan Santri"),
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
    // const filter6 = {
    //     // Sudah
    //     smartcard: [
    //         { label: "Smartcard", value: "" },
    //         { label: "Memiliki Smartcard", value: "memiliki smartcard" },
    //         { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
    //     ],
    //     // Sudah
    //     phoneNumber: [
    //         { label: "Phone Number", value: "" },
    //         { label: "Memiliki Phone Number", value: "memiliki phone number" },
    //         { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
    //     ],
    //     // kewaliasuhan: [
    //     //     { label: "Kewaliasuhan", value: "" },
    //     //     { label: "Wali Asuh / Anak Asuh", value: "waliasuh or anakasuh" },
    //     //     { label: "Non Kewaliasuhan", value: "non kewaliasuhan" }
    //     // ]
    // };

    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        { label: "Tempat Tgl Lahir", value: "tempat_tanggal_lahir" },
        // { label: "Tanggal Lahir", value: "tanggal_lahir" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        { label: "Anak ke", value: "anak_ke" },
        { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "Alamat", value: "alamat" },
        // { label: "NIS", value: "nis" },
        { label: "Domisili Santri", value: "domisili_santri" },
        // { label: "Angkatan Santri", value: "angkatan_santri" },
        // { label: "No Induk", value: "no_induk" },
        // { label: "Lembaga", value: "lembaga" },
        // { label: "Jurusan", value: "jurusan" },
        // { label: "Kelas", value: "kelas" },
        // { label: "Rombel", value: "rombel" },
        // { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        { label: "Pendidikan", value: "pendidikan" },
        { label: "Status", value: "status" },
        { label: "Ibu Kandung", value: "ibu_kandung" },
        { label: "Ayah Kandung", value: "ayah_kandung" }
    ];

    const handleImportSuccess = () => {
        fetchData(true)
    }

    const [showFormModal, setShowFormModal] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)

    const formState = useMultiStepFormPesertaDidik(() => setShowFormModal(false), jenisBerkasList, fetchData)

    if (!hasAccess("santri")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold">
                    Data Santri
                </h1>
                {/* <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div> */}
                <div className="flex flex-wrap items-center gap-2">
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
                        // disabled={exportLoading}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                    >
                        <FaFileExport />
                        <span>Export</span>
                    </button>
                </div>
            </div>
            <div className="mb-10 overflow-x-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    {/* <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} /> */}
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataSantri}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    // totalFiltered={santri.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    onRefresh={() => fetchData(true)}
                    loadingRefresh={loadingSantri}
                />

                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                ) : (
                    viewMode === "list" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {loadingSantri ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : santri.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                santri.map((item, index) => <PesertaItem key={index} data={item} title="Santri" menu={2} />)
                            )}
                        </div>
                    ) : (
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">No.</th>
                                        <th className="px-3 py-2 border-b">No. Induk Santri</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Kamar</th>
                                        <th className="px-3 py-2 border-b">Blok</th>
                                        <th className="px-3 py-2 border-b">Wilayah</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Kota Asal</th>
                                        <th className="px-3 py-2 border-b">Angkatan</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Bio</th>
                                        <th className="px-3 py-2 border-b">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingSantri ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : santri.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        santri.map((item, index) => (
                                            <tr key={item.id_pengajar || index} className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kamar || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.blok || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.angkatan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
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

                    )
                )}

                <ModalExportSantri isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/santri" />

                {isModalOpen && (
                    <ModalDetail
                        title="Santri"
                        menu={2}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}

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

                {showFormModal && (
                    <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
                )}
            </div>
        </div>
    );
};

export default Santri;
