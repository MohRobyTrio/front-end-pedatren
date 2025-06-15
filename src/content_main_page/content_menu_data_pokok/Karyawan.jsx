import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import useFetchKaryawan from '../../hooks/hooks_menu_data_pokok/Kayawan';
import blankProfile from "../../assets/blank_profile.png";
import Filters from '../../components/Filters';
import Pagination from '../../components/Pagination';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import DropdownLembaga from '../../hooks/hook_dropdown/DropdownLembaga';
import useDropdownGolonganJabatan from '../../hooks/hook_dropdown/DropdownGolonganJabatan';
import ModalDetail from '../../components/modal/ModalDetail';
// import { downloadFile } from '../../utils/downloadFile';
// import { API_BASE_URL } from '../../hooks/config';
import { FaFileExport } from 'react-icons/fa';
import DoubleScrollbarTable from '../../components/DoubleScrollbarTable';
import { ModalExport } from '../../components/modal/ModalExport';

const Karyawan = () => {
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
        phoneNumber: "",
        status: "",
        jenisKelamin: "",
        lembaga: "",
        pemberkasan: "",
        satuanKerja: "",
        golonganJabatan: "",
        wargaPesantren: "",
        umur: "",
        smartcard: ""
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterLembaga } = DropdownLembaga();
    const { menuGolonganJabatan } = useDropdownGolonganJabatan();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(l => l.value == filters.lembaga)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        lembaga: lembagaTerpilih,
    }), [filters, kabupatenTerpilih, kecamatanTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih]);

    const { karyawan, loadingKaryawan, searchTerm, setSearchTerm, error, limit, setLimit, totalDataKaryawan, totalPages, currentPage, setCurrentPage } = useFetchKaryawan(updatedFilters);
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

    const filter2 = {
        lembaga: filterLembaga.lembaga
    }

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        jenisJabatan: [
            { label: "Pilih Jenis Jabatan", value: "" },
            { label: "Kultural", value: "kultural" },
            { label: "Tetap", value: "tetap" },
            { label: "Kontrak", value: "kontrak" },
            { label: "Pengkaderan", value: "pengkaderan" },
        ],
        golonganJabatan: menuGolonganJabatan,
    }

    const filter5 = {
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
            { label: "Tidak Ada KK", value: "tidak ada kk" },
            { label: "Tidak Ada Akta Kelahiran", value: "tidak ada akta kelahiran" },
            { label: "Tidak Ada Ijazah", value: "tidak ada ijazah" }
        ],
        umur: [
            { label: "Semua Umur", value: "" },
            { label: "< 20 Tahun", value: "0-20" },
            { label: "20-29 Tahun", value: "20-29" },
            { label: "30-39 Tahun", value: "30-39" },
            { label: "40-49 Tahun", value: "40-49" },
            { label: "50-59 Tahun", value: "50-59" },
            { label: "60-65 Tahun", value: "60-65" },
            { label: "> 65 Tahun", value: "65-200" }
        ]
    }

    const filter4 = {
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };
    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        // { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        // { label: "Tempat Lahir", value: "tempat_lahir" },
        // { label: "Tanggal Lahir", value: "tanggal_lahir" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        { label: "Anak ke", value: "anak_ke" },
        { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "Alamat", value: "alamat" },
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
        { label: "Ibu Kandung", value: "ibu_kandung" }
    ];

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Karyawan</h1>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Export
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
                            Statistik
                        </button> */}
                        {/* <button
                        onClick={() => downloadFile(`${API_BASE_URL}export/karyawan`, setExportLoading)}
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
                        <button
                            onClick={() => setOpenModalExport(true)}
                            // disabled={exportLoading}
                            className={`px-4 py-2 rounded flex items-center gap-2 text-white cursor-pointer bg-blue-500 hover:bg-blue-700`}
                        >
                                    <FaFileExport />
                                    <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filter2} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataKaryawan}
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
                            {loadingKaryawan ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : karyawan.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                karyawan.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer" onClick={() => openModal(item)}>
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
                                            <p className="font-semibold text-xl">{item.nama}</p>
                                            <p className="text-gray-600">{item.nik}</p>
                                            <p className="text-gray-600">
                                                {
                                                    item.Keterangan_jabatan && item.Keterangan_jabatan !== '-'
                                                        ? item.lembaga && item.lembaga !== '-'
                                                            ? `${item.Keterangan_jabatan} - ${item.lembaga}`
                                                            : item.KeteranganJabatan
                                                        : item.lembaga && item.lembaga !== '-'
                                                            ? item.lembaga
                                                            : ''
                                                }
                                            </p>
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
                                        <th className="px-3 py-2 border-b">Jabatan</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Jenis</th>
                                        <th className="px-3 py-2 border-b">Golongan</th>
                                        <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Karyawan</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Karyawan</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingKaryawan ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : karyawan.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        karyawan.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.umur === 0 ? 0 : item.umur || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.Keterangan_jabatan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.jenis_jabatan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.golongan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.pendidikanTerakhir || "-"}</td>
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

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/karyawan" />
                
                {isModalOpen && (
                    <ModalDetail
                        title="Karyawan"
                        menu={10}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}

            </div>
        </div>
    )
}

export default Karyawan;