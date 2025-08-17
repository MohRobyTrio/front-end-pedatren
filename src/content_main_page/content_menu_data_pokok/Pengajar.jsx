import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchPengajar from '../../hooks/hooks_menu_data_pokok/Pengajar';
import Pagination from '../../components/Pagination';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import blankProfile from "../../assets/blank_profile.png";
import DropdownGolongan from '../../hooks/hook_dropdown/DropdownGolongan';
import DropdownLembaga from '../../hooks/hook_dropdown/DropdownLembaga';
import ModalDetail from '../../components/modal/ModalDetail';
// import { downloadFile } from '../../utils/downloadFile';
import { FaFileExport, FaFileImport, FaPlus } from 'react-icons/fa';
// import { API_BASE_URL } from '../../hooks/config';
import DoubleScrollbarTable from '../../components/DoubleScrollbarTable';
import { ModalExport } from '../../components/modal/ModalExport';
import Access from '../../components/Access';
import MultiStepFormPegawai from '../../components/modal/ModalFormPegawai';
import useMultiStepFormPegawai from '../../hooks/hooks_modal/useMultiStepFormPegawai';
import ModalImport from '../../components/modal/ModalImport';


const Pengajar = () => {
    // const [exportLoading, setExportLoading] = useState(false);
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
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kategori: "",
        golongan: "",
        lembaga: "",
        jenisJabatan: "",
        masaKerja: "",
        honeNumber: "",
        wargaPesantren: "",
        smartcard: "",
        pemberkasan: "",
        umur: "",
        totalMateriAjar: ""
    })

    const [selectedFilters, setSelectedFilters] = useState({
        kategori: "",
        golongan: "",
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    // const { filterGolongan, selectedGolongan, handleFilterChangeGolongan } = DropdownGolongan();
    const { kategoriGolongan, filteredGolongan, setSelectedKategori } = DropdownGolongan();
    const { filterLembaga } = DropdownLembaga();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const kategoriTerpilih = selectedFilters.kategori
        ? kategoriGolongan.find(kt => kt.value == selectedFilters.kategori)?.label
        : undefined;
    const golonganTerpilih = selectedFilters.golongan
        ? filteredGolongan.find(g => g.value == selectedFilters.golongan)?.label
        : undefined;

    const lembagaTerpilih = filterLembaga.lembaga.find(l => l.value == filters.lembaga)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        kategori: kategoriTerpilih,
        golongan: golonganTerpilih,
        lembaga: lembagaTerpilih
    }), [filters, golonganTerpilih, kabupatenTerpilih, kategoriTerpilih, kecamatanTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih]);

    const { pengajar, loadingPengajar, searchTerm, setSearchTerm, error, totalDataPengajar, totalPages, limit, setLimit, currentPage, setCurrentPage, fetchData } = useFetchPengajar(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const handleFilterChange = (changed) => {
        const key = Object.keys(changed)[0];
        const value = Object.values(changed)[0];

        setSelectedFilters((prev) => {
            const updated = { ...prev, ...changed };

            if (key === "kategori") {
                setSelectedKategori(value);
                updated["golongan"] = "";
            }

            return updated;
        });

        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter2 = {
        lembaga: filterLembaga.lembaga,
        kategori: kategoriGolongan,
        golongan: filteredGolongan,
        totalMateriAjar: [
            { label: "Pilih Total Materi Ajar", value: "" },
            { label: "Kosong", value: "0" },
            { label: "1 Materi", value: "1" },
            { label: "Lebih dari 1 Materi", value: ">1" },
            { label: "2 Materi", value: "2" },
            { label: "Lebih dari 2 Materi", value: ">2" },
            { label: "3 Materi", value: "3" },
            { label: "Lebih dari 3 Materi", value: ">3" },
        ]
    }
    const filter3 = {
        // Sudah
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        // Sudah
        jenisJabatan: [
            { label: "Pilih Jenis jabatan", value: "" },
            { label: "Kultural", value: "kultural" },
            { label: "Tetap", value: "tetap" },
            { label: "Kontrak", value: "kontrak" },
            { label: "Pengkaderan", value: "pengkaderan" }
        ],
        masaKerja: [
            { label: "Pilih Masa Kerja", value: "" },
            { label: "< 1 Tahun", value: "1" },
            { label: "1-5 Tahun", value: "1-5" },
            { label: "6-10 Tahun", value: "6-10" },
            { label: "11-15 Tahun", value: "11-15" },
            { label: "16-20 Tahun", value: "16-20" },
            { label: "21-25 Tahun", value: "21-25" },
            { label: "26-30 Tahun", value: "26-30" },
            { label: "31-40 Tahun", value: "31-40" },
            { label: "> 40 Tahun", value: "40-200" }
        ]
    }

    const filter4 = {
        // Sudah
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" }
        ],
        // Sudah
        pemberkasan: [
            { label: "Pemberkasan", value: "" },
            { label: "Tidak Ada Berkas", value: "tidak ada berkas" },
            { label: "Tidak Ada Foto Diri", value: "tidak ada foto diri" },
            { label: "Memiliki Foto Diri", value: "memiliki foto diri" },
            { label: "Memiliki KK", value: "memiliki kk" },
            { label: "Memiliki Akta Kelahiran", value: "memiliki akta kelahiran" },
            { label: "Memiliki Ijazah", value: "memiliki ijazah" }
        ],
        umur: [
            { label: "Semua Umur", value: "" },
            { label: "< 20 Tahun", value: "0-20" },
            { label: "20-29 Tahun", value: "20-29" },
            { label: "30-39 Tahun", value: "30-39" },
            { label: "40-49 Tahun", value: "40-49" },
            { label: "50-59 Tahun", value: "50-49" },
            { label: "60-65 Tahun", value: "60-65" },
            { label: "> 65 Tahun", value: "65-200" }
        ]
    }

    const filter5 = {
        // Sudah
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        // Sudah
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };

    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        { label: "Jalan", value: "jalan" },
        // { label: "Nama", value: "nama" },
        { label: "Tempat Lahir", value: "tempat_lahir" },
        { label: "Tanggal Lahir", value: "tanggal_lahir" },
        { label: "Pendidikan Terakhir", value: "pendidikan_terakhir" },
        { label: "Email", value: "email" },
        { label: "No Handphone", value: "no_telepon" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        // { label: "Anak ke", value: "anak_ke" },
        // { label: "Jumlah Saudara", value: "jumlah_saudara" },
        // { label: "Alamat", value: "alamat" },
        // { label: "NIS", value: "nis" },
        // { label: "Domisili Santri", value: "domisili_santri" },
        // { label: "Angkatan Santri", value: "angkatan_santri" },
        // { label: "No Induk", value: "no_induk" },
        { label: "Lembaga", value: "lembaga" },
        { label: "Golongan", value: "golongan" },
        // { label: "Jurusan", value: "jurusan" },
        // { label: "Kelas", value: "kelas" },
        // { label: "Rombel", value: "rombel" },
        // { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        // { label: "Status", value: "status" },
        // { label: "Ibu Kandung", value: "ibu_kandung" }
    ];

    const [openModalImport, setOpenModalImport] = useState(false)
    const [showFormModal, setShowFormModal] = useState(false);

    const formState = useMultiStepFormPegawai(() => setShowFormModal(false), fetchData);

    const handleImportSuccess = () => {
        fetchData(true)
    }

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold">Data Pengajar</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* <button
                            onClick={() => downloadFile(`${API_BASE_URL}export/pengajar`, setExportLoading)}
                            disabled={exportLoading}
                            className={`px-4 py-2 rounded flex items-center gap-2 text-white cursor-pointer ${exportLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                        >
                            {exportLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin text-white"></i>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <FaFileExport />
                                    <span>Export</span>
                                </>
                            )}
                        </button> */}
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
                            // disabled={exportLoading}
                            className={`bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm md:text-base`}
                        >
                            <FaFileExport />
                            <span>Export</span>
                        </button>
                    </div>
            </div>
            <div className="mb-10 overflow-x-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    {/* <Filters showFilters={showFilters} filterOptions={filterGolongan} onChange={handleFilterChangeGolongan} selectedFilters={selectedGolongan} /> */}
                    {/* <Filters showFilters={showFilters} filterOptions={filter2} onChange={(newFilters) => { setFilters((prev) => ({ ...prev, ...newFilters })); if (newFilters.kategori) setSelectedKategori(newFilters.kategori); }} selectedFilters={filters} /> */}
                    <Filters showFilters={showFilters} filterOptions={filter2} onChange={handleFilterChange} selectedFilters={selectedFilters} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPengajar}
                    // totalFiltered={totalFiltered}
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
                            {loadingPengajar ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : pengajar.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pengajar.map((item, index) => (
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
                                            <h2 className="font-semibold text-xl">{item.nama || "-"}</h2>
                                            <p className="text-gray-600">{item.niup || "-"}</p>
                                            <p className="text-gray-600">{item.lembaga || "-"}</p>
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
                                        <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Umur</th>
                                        <th className="px-3 py-2 border-b">Pangkalan Lembaga</th>
                                        <th className="px-3 py-2 border-b">Materi Ajar</th>
                                        <th className="px-3 py-2 border-b">Total Materi Ajar</th>
                                        <th className="px-3 py-2 border-b">Masa Kerja</th>
                                        <th className="px-3 py-2 border-b">Golongan</th>
                                        <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Bio</th>

                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingPengajar ? (
                                        <tr>
                                            <td colSpan="11" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : pengajar.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" className="text-center p-4">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        pengajar.map((item, index) => (
                                            <tr key={item.id_pengajar || index} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.umur === 0 ? 0 : item.umur || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.daftar_materi || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.total_materi === 0 ? 0 : item.total_materi || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.masa_kerja || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.golongan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.pendidikan_terakhir || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </DoubleScrollbarTable>
                    )
                )}

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/pengajar" />

                {isModalOpen && (
                    <ModalDetail
                        title="Pengajar"
                        menu={8}
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
                    title="Import Data Pegawai"
                    endpoint="import/pegawai"
                    templateUrl="/template/kepegawaian_template_pusdatren.xlsx"
                    templateName="template_pegawai.xlsx"
                    instructions={[
                        "Download template terlebih dahulu",
                        "Isi data sesuai format template (header di baris 2)",
                        "Jangan mengubah nama kolom/header",
                        "Pastikan format tanggal menggunakan YYYY-MM-DD",
                        "Upload file yang sudah diisi dan klik 'Import Data'",
                    ]}
                />

                {showFormModal && (
                    <MultiStepFormPegawai isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
                )}
            </div>
        </div>
    )
}

export default Pengajar;