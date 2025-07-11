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
import useFetchPesertaDidikBersaudara from "../../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/BersaudaraKandung";
import ModalDetail from "../../../components/modal/ModalDetail";
import { generateDropdownTahun } from "../../../utils/generateDropdownTahun";
import DoubleScrollbarTable from "../../../components/DoubleScrollbarTable";
import { ModalExport } from "../../../components/modal/ModalExport";
import { FaFileExport } from "react-icons/fa";

const BersaudaraKandung = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalExport, setOpenModalExport] = useState(false);
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

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

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
    const { pesertaDidikBersaudara, loadingBersaudara, searchTerm, setSearchTerm, error, limit, setLimit, totalDataBersaudara, totalPages, currentPage, setCurrentPage } = useFetchPesertaDidikBersaudara(updatedFilters);
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

        angkatanPelajar: generateDropdownTahun({
            placeholder: "Semua Angkatan Pelajar",
            labelTemplate: "Masuk Tahun {year}"
        }),

        angkatanSantri: generateDropdownTahun({
            placeholder: "Semua Angkatan Santri",
            labelTemplate: "Masuk Tahun {year}"
        }),
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
        ]
    }
    const filter6 = {
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
        ],
        statusSaudara: [
            { label: "Status Saudara", value: "" },
            { label: "Ibu Kandung Terisi", value: "ibu kandung terisi" },
            { label: "Ibu Kandung Tidak Terisi", value: "ibu kandung tidak terisi" },
            { label: "KK Sama Dengan Ibu Kandung", value: "kk sama dgn ibu kandung" },
            { label: "KK Berbeda Dengan Ibu Kandung", value: "kk berbeda dgn ibu kandung" }
        ]
        // kewaliasuhan: [
        //     { label: "Kewaliasuhan", value: "" },
        //     { label: "Wali Asuh / Anak Asuh", value: "waliasuh or anakasuh" },
        //     { label: "Non Kewaliasuhan", value: "non kewaliasuhan" }
        // ]
    };

    const fieldsExports = [
        // { label: "No. KK", value: "no_kk" },
        // { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        // { label: "Tempat Tgl Lahir", value: "tempat_tanggal_lahir" },
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
        // { label: "Pendidikan", value: "pendidikan" },
        { label: "Status", value: "status" },
        // { label: "Ibu Kandung", value: "ibu_kandung" },
        // { label: "Ayah Kandung", value: "ayah_kandung" }
    ];

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Bersaudara Kandung</h1>
                {/* <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div> */}
                <div className="flex items-center space-x-2">
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
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataBersaudara}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    // totalFiltered={pesertaDidikBersaudara.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                />

                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                ) : (
                    viewMode === "list" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {loadingBersaudara ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : pesertaDidikBersaudara.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pesertaDidikBersaudara.map((item, index) => <PesertaItem key={index} data={item} title="Bersaudara Kandung" menu={5} />)
                            )}
                        </div>
                    ) : (
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">No.</th>
                                        <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">No. KK</th>
                                        <th className="px-3 py-2 border-b">NIK / No. Passport</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Wilayah</th>
                                        <th className="px-3 py-2 border-b">Kota Asal</th>
                                        <th className="px-3 py-2 border-b">Ibu Kandung</th>
                                        <th className="px-3 py-2 border-b">Ayah Kandung</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Bio</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingBersaudara ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : pesertaDidikBersaudara.length === 0 ? (
                                        <tr>
                                            <td colSpan="11" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        pesertaDidikBersaudara.map((item, index) => (
                                            <tr key={item.id_pengajar || index} className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.no_kk || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nik_nopassport || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.ibu_kandung || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.ayah_kandung || "-"}</td>
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

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/bersaudara" /> 

                {isModalOpen && (
                    <ModalDetail
                        title="Bersaudara Kandung"
                        menu={5}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default BersaudaraKandung;
