import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchPegawai from '../../hooks/hooks_menu_kepegawaian/Pegawai';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import DropdownLembaga from '../../hooks/hook_dropdown/DropdownLembaga';
import blankProfile from "../../assets/blank_profile.png";
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import ModalDetail from '../../components/modal/ModalDetail';
// import { downloadFile } from '../../utils/downloadFile';
// import { API_BASE_URL } from '../../hooks/config';
import { FaEdit, FaFileExport, FaFileImport, FaPlus } from 'react-icons/fa';
import MultiStepFormPegawai from '../../components/modal/ModalFormPegawai';
import useMultiStepFormPegawai from '../../hooks/hooks_modal/useMultiStepFormPegawai';
import Access from '../../components/Access';
import DoubleScrollbarTable from '../../components/DoubleScrollbarTable';
import { ModalExport } from '../../components/modal/ModalExport';
import { useNavigate } from 'react-router-dom';
import ModalImport from '../../components/modal/ModalImport';

const Pegawai = () => {
    const navigate = useNavigate();
    // const [exportLoading, setExportLoading] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false)
    const [openModalExport, setOpenModalExport] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        wafathidup: "",
        status: "",
        jenisKelamin: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        angkatanPelajar: "",
        angkatanSantri: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih
    }), [filters, jurusanTerpilih, kabupatenTerpilih, kecamatanTerpilih, kelasTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih, rombelTerpilih]);

    const { pegawai, loadingPegawai, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPegawai, totalPages, currentPage, setCurrentPage, fetchData } = useFetchPegawai(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        entitas: [
            { label: "Semua Entitas", value: "" },
            { label: "Pengurus", value: "pengurus" },
            { label: "Karyawan", value: "karyawan" },
            { label: "Pengajar", value: "pengajar" },
            // { label: "Pengajar-Pengurus", value: "pengajar pengurus" },
            // { label: "Pengajar-Karyawan", value: "pengajar karyawan" },
            // { label: "Pengurus-Karyawan", value: "pengurus karyawan" },
            // { label: "Pengajar-Pengurus-Karyawan", value: "pengajar pengurus karyawan" },
        ],
        status: [
            { label: "Semua Status", value: "" },
            { label: "Aktif", value: "aktif" },
            { label: "Tidak Aktif", value: "tidak_aktif" },
        ],
    }

    const filter5 = {
        // Sudah
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" }
        ],
        // Sudah
        // pemberkasan: [
        //     { label: "Pemberkasan", value: "" },
        //     { label: "Tidak Ada Berkas", value: "tidak ada berkas" },
        //     { label: "Tidak Ada Foto Diri", value: "tidak ada foto diri" },
        //     { label: "Memiliki Foto Diri", value: "memiliki foto diri" },
        //     { label: "Memiliki KK", value: "memiliki kk" },
        //     { label: "Memiliki Akta Kelahiran", value: "memiliki akta kelahiran" },
        //     { label: "Memiliki Ijazah", value: "memiliki ijazah" }
        // ],
        umur: [
            { label: "Semua Umur", value: "" },
            { label: "< 20 Tahun", value: "0-20" },
            { label: "20-29 Tahun", value: "20-29" },
            { label: "30-39 Tahun", value: "30-39" },
            { label: "40-49 Tahun", value: "40-49" },
            { label: "50-59 Tahun", value: "50-49" },
            { label: "60-65 Tahun", value: "60-65" },
            { label: "> 65 Tahun", value: "65-200" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    }

    // const filter4 = {
    // smartcard: [
    //     { label: "Smartcard", value: "" },
    //     { label: "Memiliki Smartcard", value: "memiliki smartcard" },
    //     { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
    // ],
    // phoneNumber: [
    //     { label: "Phone Number", value: "" },
    //     { label: "Memiliki Phone Number", value: "memiliki phone number" },
    //     { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
    // ]
    // };

    const hasStatus = (status, keyword) => {
        if (!status) return false;
        return status.toLowerCase().includes(keyword.toLowerCase());
    };

    const renderStatus = (value) => {
        if (value === true) return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
        if (value === false) return <FontAwesomeIcon icon={faTimes} className="text-red-600" />;
        return "-";
    };

    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        { label: "Tempat dan Tanggal Lahir", value: "tempat_tanggal_lahir" },
        // { label: "Tanggal Lahir", value: "tanggal_lahir" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        // { label: "Anak ke", value: "anak_ke" },
        // { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "Alamat", value: "alamat" },
        { label: "Pendidikan Terakhir", value: "pendidikan_terakhir" }
        // { label: "NIS", value: "nis" },
        // { label: "Domisili Santri", value: "domisili_santri" },
        // { label: "Angkatan Santri", value: "angkatan_santri" },
        // { label: "No Induk", value: "no_induk" },
        // { label: "Lembaga", value: "lembaga" },
        // { label: "Jurusan", value: "jurusan" },
        // { label: "Kelas", value: "kelas" },
        // { label: "Rombel", value: "rombel" },
        // { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        // { label: "Status", value: "status" },
        // { label: "Ibu Kandung", value: "ibu_kandung" }
    ];

    const [showFormModal, setShowFormModal] = useState(false);

    const formState = useMultiStepFormPegawai(() => setShowFormModal(false), fetchData);

    const handleEditClick = (biodataId, kondisi) => {
        navigate(`/formulir/${biodataId}/biodata`, {
            state: { kondisiTabFormulir: kondisi }
        });
    };

    const handleImportSuccess = () => {
        fetchData() // Refresh data setelah import berhasil
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                {/* Judul */}
                <h1 className="text-xl md:text-2xl font-bold">Pegawai</h1>

                {/* Semua tombol di satu div */}
                <div className="flex items-center gap-2">
                    <Access action="tambah">
                        <button
                            onClick={() => setShowFormModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                        >
                            <FaPlus />
                            Tambah
                        </button>
                    </Access>

                    <button
                        onClick={() => setOpenModalImport(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                    >
                        <FaFileImport />
                        Import
                    </button>

                    <button
                        onClick={() => setOpenModalExport(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base"
                    >
                        <FaFileExport />
                        Export
                    </button>
                </div>
            </div>




            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    {/* <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} /> */}
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPegawai}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    viewMode === "list" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {loadingPegawai ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : pegawai.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pegawai.map((item, index) => (
                                    <div key={item.id || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer" onClick={() => openModal(item)}>
                                        <img
                                            alt={item.nama || "-"}
                                            className="w-20 h-24 object-cover"
                                            src={item.foto_profil}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = blankProfile;
                                            }}
                                        />
                                        <div>
                                            <h2 className="font-semibold">{item.nama || "-"}</h2>
                                            <p className="text-gray-600">{item.status || "-"}</p>
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
                                        <th className="px-3 py-2 border-b">#</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">NIK/No. Passport</th>
                                        <th className="px-3 py-2 border-b">Jenis Kelamin</th>
                                        {/* <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">Umur</th> */}
                                        <th className="px-3 py-2 border-b">Pengurus</th>
                                        <th className="px-3 py-2 border-b">Karyawan</th>
                                        <th className="px-3 py-2 border-b">Pengajar</th>
                                        <th className="px-3 py-2 border-b">Wali Kelas</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        {/* <th className="px-3 py-2 border-b">Pendidikan Terakhir</th> */}
                                        <th className="px-3 py-2 border-b">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingPegawai ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : pegawai.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        pegawai.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nik_or_passport || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.jenis_kelamin || "-"}</td>
                                                {/* <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.umur === 0 ? 0 : item.umur || "-"}</td> */}
                                                <td className="px-3 py-2 border-b">{renderStatus(hasStatus(item.status, "Pengurus"))}</td>
                                                <td className="px-3 py-2 border-b">{renderStatus(hasStatus(item.status, "Karyawan"))}</td>
                                                <td className="px-3 py-2 border-b">{renderStatus(hasStatus(item.status, "Pengajar"))}</td>
                                                <td className="px-3 py-2 border-b">{renderStatus(hasStatus(item.status, "Wali Kelas"))}</td>
                                                <td className="px-3 py-2 border-b w-30">
                                                    <span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status_aktif == "aktif"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {item.status_aktif == "aktif" ? "Aktif" : "Nonaktif"}
                                                    </span>
                                                </td>
                                                {/* <td className="px-3 py-2 border-b">{item.pendidikanTerkahir || "-"}</td> */}
                                                <td className="px-3 py-2 border-b text-center space-x-2 w-10">
                                                    {/* <Link to={`/formulir/${item.biodata_id || item.id || item}/biodata`}> */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(item.biodata_id || item.id || item, 'kondisi1')
                                                        }}
                                                        className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    {/* </Link> */}
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </DoubleScrollbarTable>

                    )
                )}

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/pegawai" />

                <ModalImport
                    isOpen={openModalImport}
                    onClose={() => setOpenModalImport(false)}
                    onSuccess={handleImportSuccess}
                    title="Import Data Pegawai"
                    endpoint="import/pegawai"
                    templateUrl="/template/pegawai_import_template_v2.xlsx"
                    templateName="template_pegawai.xlsx"
                    instructions={[
                        "Download template terlebih dahulu",
                        "Isi data sesuai format template (header di baris 2)",
                        "Jangan mengubah nama kolom/header",
                        "Pastikan format tanggal menggunakan YYYY-MM-DD",
                        "Upload file yang sudah diisi dan klik 'Import Data'",
                    ]}
                />

                {isModalOpen && (
                    <ModalDetail
                        title="Pegawai"
                        menu={21}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {showFormModal && (
                    <MultiStepFormPegawai isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}

            </div>
        </div>
    )
}

export default Pegawai;