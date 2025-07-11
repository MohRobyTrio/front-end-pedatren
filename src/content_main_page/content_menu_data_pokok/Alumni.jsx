import { useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useFetchAlumni from "../../hooks/hooks_menu_data_pokok/Alumni";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Filters from "../../components/Filters";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import Pagination from "../../components/Pagination";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
// import { API_BASE_URL } from "../../hooks/config";
// import { downloadFile } from "../../utils/downloadFile";
import ModalDetail from "../../components/modal/ModalDetail";
import { FaFileExport } from "react-icons/fa";
import { generateDropdownTahun } from "../../utils/generateDropdownTahun";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { ModalExport } from "../../components/modal/ModalExport";

const Alumni = () => {
    const [openModalExport, setOpenModalExport] = useState(false);
    // const [exportLoading, setExportLoading] = useState(false);
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
        rombel: ""
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

    const { alumni, loadingAlumni, searchTerm, setSearchTerm, error, limit, setLimit, totalDataAlumni, totalPages, currentPage, setCurrentPage } = useFetchAlumni(updatedFilters);
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
        status: [
            { label: "Semua Status", value: "" },
            { label: "Alumni Santri", value: "alumni santri" },
            { label: "Alumni Santri Non Pelajar", value: "alumni santri non pelajar" },
            { label: "Alumni Santri Tetapi Masih Pelajar Aktif", value: "alumni santri tetapi masih pelajar aktif" },
            { label: "Alumni Pelajar", value: "alumni pelajar" },
            { label: "Alumni Pelajar Non Santri", value: "alumni pelajar non santri" },
            { label: "Alumni Pelajar Tetapi Masih Santri Aktif", value: "alumni pelajar tetapi masih santri aktif" },
            { label: "Alumni Santri-Pelajar/Alumni Pelajar-Santri", value: "alumni pelajar sekaligus santri" }
        ],

        angkatanPelajar: generateDropdownTahun({
            placeholder: "Semua Angkatan Pelajar",
            labelTemplate: "Keluar Tahun {year}"
        }),

        angkatanSantri: generateDropdownTahun({
            placeholder: "Semua Angkatan Santri",
            labelTemplate: "Keluar Tahun {year}"
        }),
    }

    const filter4 = {
        wafathidup: [
            { label: "Pilih Wafat / Hidup", value: "" },
            { label: "Wafat", value: "sudah wafat" },
            { label: "Hidup", value: "masih hidup" }
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
        { label: "Ibu Kandung", value: "ibu_kandung" },
        { label: "Tahun Keluar Santri", value: "tahun_keluar_santri" },
        { label: "Tahun Keluar Pelajar", value: "tahun_keluar_pelajar" }
    ];

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Alumni</h1>
                <div className="flex items-center space-x-2">
                {/* <button onClick={() => downloadFile(`${API_BASE_URL}export/alumni`)} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Export</button> */}
                {/* <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button> */}
                {/* <button
                    onClick={() => downloadFile(`${API_BASE_URL}export/alumni`, setExportLoading)}
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
            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataAlumni}
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
                            {loadingAlumni ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : alumni.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                alumni.map((item, index) => (
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
                                            <p className="text-gray-600">{item.kota_asal || "-"}</p>
                                            <p className="text-gray-600">
                                                Pend. Terakhir:{" "}
                                                {item.lembaga && item.lembaga !== "-" && item.tahun_keluar_santri && item.tahun_keluar_santri !== "-" ? (
                                                    <>
                                                        {item.lembaga} - {item.tahun_keluar_santri}
                                                    </>
                                                ) : item.lembaga && item.lembaga !== "-" ? (
                                                    item.lembaga
                                                ) : item.tahun_keluar_santri && item.tahun_keluar_santri !== "-" ? (
                                                    item.tahun_keluar_santri
                                                ) : (
                                                    "-"
                                                )}
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
                                        <th className="px-3 py-2 border-b">Status Santri Terakhir</th>
                                        <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                        {/* <th className="px-3 py-2 border-b">Status</th> */}
                                        <th className="px-3 py-2 border-b">Kota Asal</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Bio</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingAlumni ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : alumni.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        alumni.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">
                                                    Masuk: {item.tahun_masuk_santri || "-"}<br />
                                                    Bayang: {item.tahun_keluar_santri || "-"}
                                                </td>
                                                <td className="px-3 py-2 border-b">
                                                    {item.lembaga || "-"}<br />
                                                    <span className="italic">Lulus: {item.tahun_keluar_pendidikan || "-"}</span>
                                                </td>
                                                {/* <td className="px-3 py-2 border-b">
                                                    <span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "lulus"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-slate-100 text-slate-500"
                                                            }`}
                                                    >
                                                        {item.status === "lulus" ? "Lulus" : "-"}
                                                    </span>
                                                </td> */}
                                                <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
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

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/alumni" />

                {isModalOpen && (
                    <ModalDetail
                        title="Alumni"
                        menu={13}
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

export default Alumni;
