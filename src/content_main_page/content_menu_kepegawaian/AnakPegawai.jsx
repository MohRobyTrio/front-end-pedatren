import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from '/src/assets/blank_profile.png';
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchAnakPegawai from '../../hooks/hooks_menu_kepegawaian/Anakpegawai';
import Pagination from '../../components/Pagination';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import DropdownWilayah from '../../hooks/hook_dropdown/DropdownWilayah';
import DropdownLembaga from '../../hooks/hook_dropdown/DropdownLembaga';
import ModalDetail from '../../components/modal/ModalDetail';
import Access from '../../components/Access';
import { FaEdit, FaFileExport, FaPlus } from 'react-icons/fa';
import MultiStepModalAnakPegawai from '../../components/modal/ModalFormAnakPegawai';
import { useMultiStepFormAnakPegawai } from '../../hooks/hooks_modal/useMultiStepFormAnakPegawai';
import { jenisBerkasList } from '../../data/menuData';
import DoubleScrollbarTable from '../../components/DoubleScrollbarTable';
import { ModalExport } from '../../components/modal/ModalExport';
import { useNavigate } from 'react-router-dom';
import DropdownAngkatan from '../../hooks/hook_dropdown/DropdownAngkatan';

const AnakPegawai = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openModalExport, setOpenModalExport] = useState(false);
    
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
        angkatanSantri: ""
    })

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { menuAngkatanPelajar, menuAngkatanSantri } = DropdownAngkatan()

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.nama || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";

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
    const { anakPegawai, loadingAnakPegawai, searchTerm, setSearchTerm, error, limit, setLimit, totalDataAnakPegawai, totalPages, currentPage, setCurrentPage, fetchData } = useFetchAnakPegawai(updatedFilters);
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

        angkatanPelajar: updateFirstOptionLabel(menuAngkatanPelajar, "Semua Angkatan Pelajar"),

        angkatanSantri: updateFirstOptionLabel(menuAngkatanSantri, "Semua Angkatan Santri"),
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
        //     { label: "Tidak Ada KK", value: "tidak ada kk" },
        //     { label: "Tidak Ada Akta Kelahiran", value: "tidak ada akta kelahiran" },
        //     { label: "Tidak Ada Ijazah", value: "tidak ada ijazah" }
        // ],
        // Sudah
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Jenis Kelamin", value: "jenis_kelamin" }
        ],
        // Sudah
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    }
    // const filter6 = {
        // Sudah
        // smartcard: [
        //     { label: "Smartcard", value: "" },
        //     { label: "Memiliki Smartcard", value: "memiliki smartcard" },
        //     { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        // ],
        // Sudah
    //     phoneNumber: [
    //         { label: "Phone Number", value: "" },
    //         { label: "Memiliki Phone Number", value: "memiliki phone number" },
    //         { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
    //     ]
    // };

    const fieldsExports = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        // { label: "Tempat Lahir", value: "tempat_lahir" },
        // { label: "Tanggal Lahir", value: "tanggal_lahir" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        { label: "Anak ke", value: "anak_ke" },
        { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "Alamat", value: "alamat" },
        // { label: "NIS", value: "nis" },
        { label: "Domisili Santri", value: "domisili_santri" },
        { label: "Angkatan Santri", value: "angkatan_santri" },
        // { label: "No Induk", value: "no_induk" },
        // { label: "Lembaga", value: "lembaga" },
        // { label: "Jurusan", value: "jurusan" },
        // { label: "Kelas", value: "kelas" },
        // { label: "Rombel", value: "rombel" },
        { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        { label: "Status", value: "status" },
        { label: "Ibu Kandung", value: "ibu_kandung" }
    ];

    const [showFormModal, setShowFormModal] = useState(false);

    const formState = useMultiStepFormAnakPegawai(() => setShowFormModal(false), jenisBerkasList, fetchData);

    const handleEditClick = (biodataId, kondisi) => {
        navigate(`/formulir/${biodataId}/biodata`, {
            state: { kondisiTabFormulir: kondisi }
        });
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Anak Pegawai</h1>
                <div className="flex items-center space-x-2">
                    <Access action="tambah">
                        <button onClick={() => setShowFormModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                    </Access>
                    {/* <div className="flex items-center space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Export
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
                            Statistik
                        </button>
                    </div> */}
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
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                    totalData={totalDataAnakPegawai}
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
                            {loadingAnakPegawai ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : anakPegawai.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                anakPegawai.map((item, index) => (
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
                                            <p className="text-gray-600">NIUP: {item.niup || "-"}</p>
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
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">NIS</th>
                                        <th className="px-3 py-2 border-b">NIK / No. Passport</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Jurusan</th>
                                        <th className="px-3 py-2 border-b">Kelas</th>
                                        <th className="px-3 py-2 border-b">Wilayah</th>
                                        <th className="px-3 py-2 border-b">Blok</th>
                                        <th className="px-3 py-2 border-b">Kamar</th>
                                        <th className="px-3 py-2 border-b">Kota Asal</th>
                                        <th className="px-3 py-2 border-b">Orang Tua</th>
                                        <th className="px-3 py-2 border-b">Aksi</th>
                                        {/* <th className="px-3 py-2 border-b">Tgl Input Khadam</th> */}
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingAnakPegawai ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : anakPegawai.length === 0 ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        anakPegawai.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-left hover:cursor-pointer" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nik_or_passport || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.jurusan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kelas || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.blok || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kamar || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_ortu || "-"}</td>
                                                {/* <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td> */}
                                                 <td className="px-3 py-2 border-b text-center space-x-2 w-10">
                                                    {/* <Link to={`/formulir/${item.biodata_id || item.id || item}/biodata`}> */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(item.biodata_id || item.id || item, 'kondisi2')
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

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/anakpegawai" />

                {isModalOpen && (
                    <ModalDetail
                        title="Anak Pegawai"
                        menu={22}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                <MultiStepModalAnakPegawai isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default AnakPegawai;