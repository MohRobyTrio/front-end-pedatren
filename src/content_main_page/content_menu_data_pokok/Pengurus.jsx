import { useEffect, useMemo, useState } from "react";
import useFetchPengurus from "../../hooks/hooks_menu_data_pokok/Pengurus";
import PengurusItem from "../../components/PengurusItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import Pagination from "../../components/Pagination";
import blankProfile from "../../assets/blank_profile.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";

const Pengurus = () => {
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

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    // Gabungkan filter tambahan sebelum dipakai
    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih
    }), [filters, kabupatenTerpilih, kecamatanTerpilih, negaraTerpilih, provinsiTerpilih]);

    const { pengurus, loadingPengurus, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPengurus, totalPages, currentPage, setCurrentPage } = useFetchPengurus(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

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
        ]
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
            { label: "50-59 Tahun", value: "50-49" },
            { label: "60-65 Tahun", value: "60-65" },
            { label: "> 65 Tahun", value: "65-200" }
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
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengurus</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>                
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPengurus}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={pengurus.length}
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
                            {loadingPengurus ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <i className="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
                                </div>
                            ) : pengurus.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pengurus.map((item, index) => <PengurusItem key={index} item={item} />)
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr className="bg-gray-100">
                                        <th className="px-3 py-2 border-b">No.</th>
                                        <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Jabatan</th>
                                        <th className="px-3 py-2 border-b">Umur</th>
                                        <th className="px-3 py-2 border-b">Satuan Kerja</th>
                                        <th className="px-3 py-2 border-b">Jenis</th>
                                        <th className="px-3 py-2 border-b">Golongan</th>
                                        <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Pengurus</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Pengurus</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingPengurus ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-4">
                                                <i className="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
                                            </td>
                                        </tr>
                                    ) : pengurus.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-4">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        pengurus.map((item, index) => (
                                            <tr key={item.id_pengurus || index} className="hover:bg-gray-50 whitespace-nowrap">
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.jabatan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.umur || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.satuan_kerja || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.jenisJabatan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.golongan || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.pendidikan_terakhir || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default Pengurus;
