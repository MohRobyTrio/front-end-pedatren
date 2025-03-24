import { useEffect, useState } from "react";
import useFetchPengurus from "../../hooks/hooks_menu_data_pokok/Pengurus";
import PengurusItem from "../../components/PengurusItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import Pagination from "../../components/Pagination";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Pengurus = () => {
    const [filters, setFilters] = useState({
        jabatan: "",
        urutBerdasarkan: "",
        urutSecara: "",
    });
    const { pengurus, loading, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPengurus, currentPage, setCurrentPage } = useFetchPengurus(filters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const totalPages = Math.ceil(totalDataPengurus / limit);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filterOptions = {
        negara: [
            { label: "Semua Negara", value: "" },
            { label: "Indonesia", value: "id" },
            { label: "Malaysia", value: "my" },
            { label: "Singapura", value: "sg" },
            { label: "Brunei", value: "bn" },
            { label: "Thailand", value: "th" }
        ],
        provinsi: [
            { label: "Semua Provinsi", value: "" },
            { label: "Jawa Barat", value: "jabar" },
            { label: "Jawa Timur", value: "jatim" },
            { label: "Jawa Tengah", value: "jateng" },
            { label: "DKI Jakarta", value: "jakarta" }
        ],
        kabupaten: [
            { label: "Semua Kabupaten", value: "" },
            { label: "Bandung", value: "bandung" },
            { label: "Surabaya", value: "surabaya" },
            { label: "Semarang", value: "semarang" },
            { label: "Medan", value: "medan" }
        ],
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        kecamatan: [
            { label: "Semua Kecamatan", value: "" },
            { label: "Kecamatan A", value: "kec_a" },
            { label: "Kecamatan B", value: "kec_b" },
            { label: "Kecamatan C", value: "kec_c" }
        ],
        jabatan: [
            { label: "Semua Jabatan", value: "" },
            { label: "Ketua", value: "ketua" },
            { label: "Wakil", value: "wakil" },
            { label: "Sekertaris", value: "sekertaris" }
        ],
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ],
        pemberkasan: [
            { label: "Pemberkasan", value: "" },
            { label: "Tidak Ada Berkas", value: "tidak ada berkas" },
            { label: "Tidak Ada Foto Diri", value: "tidak ada foto diri" },
            { label: "Memiliki Foto Diri", value: "memiliki foto diri" },
            { label: "Tidak Ada KK", value: "tidak ada kk" },
            { label: "Tidak Ada Akta Kelahiran", value: "tidak ada akta kelahiran" },
            { label: "Tidak Ada Ijazah", value: "tidak ada ijazah" }
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Angkatan", value: "angkatan" },
            { label: "Jenis Kelamin", value: "jenis kelamin" },
            { label: "Tempat Lahir", value: "tempat lahir" }
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" }
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
                <Filters showFilters={showFilters} filterOptions={filterOptions} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} />
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
                            {loading ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <i className="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
                                </div>
                            ) : pengurus.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pengurus.map((item, index) => <PengurusItem key={index} pengurus={item} />)
                            )}
                        </div>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">No.</th>
                                    <th className="border p-2">NIUP</th>
                                    <th className="border p-2">Nama</th>
                                    <th className="border p-2">Jabatan</th>
                                    <th className="border p-2">Umur</th>
                                    <th className="border p-2">Satuan Kerja</th>
                                    <th className="border p-2">Jenis</th>
                                    <th className="border p-2">Golongan</th>
                                    <th className="border p-2">Pendidikan Terakhir</th>
                                    <th className="border p-2">Tgl Input Pengurus</th>
                                    <th className="border p-2">Tgl Update Pengurus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
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
                                        <tr key={item.id_pengurus || index} className="text-center">
                                            <td className="border p-2">{index + 1}</td>
                                            <td className="border p-2">{item.niup}</td>
                                            <td className="border p-2">{item.nama}</td>
                                            <td className="border p-2">{item.jabatan}</td>
                                            <td className="border p-2">{item.umur}</td>
                                            <td className="border p-2">{item.satuan_kerja}</td>
                                            <td className="border p-2">{item.jenis}</td>
                                            <td className="border p-2">{item.golongan}</td>
                                            <td className="border p-2">{item.pendidikan_terakhir}</td>
                                            <td className="border p-2">{item.tgl_input}</td>
                                            <td className="border p-2">{item.tgl_update}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
