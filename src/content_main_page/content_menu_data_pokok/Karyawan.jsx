import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useState } from 'react';
import useFetchKaryawan from '../../hooks/hooks_menu_data_pokok/Kayawan';
import blankProfile from "../../assets/blank_profile.png";
import Filters from '../../components/Filters';
import Pagination from '../../components/Pagination';


const Karyawan = () => {
    const [filters, setFilters] = useState({});
    const { karyawans, loadingKaryawans, searchTerm, setSearchTerm, error,
        limit,
        setLimit,
        totalDataKaryawans,
        totalPages,
        currentPage,
        setCurrentPage } = useFetchKaryawan();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

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
        // Sudah
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Angkatan", value: "angkatan" },
            { label: "Jenis Kelamin", value: "jenis kelamin" },
            { label: "Tempat Lahir", value: "tempat lahir" }
        ],
        // Sudah
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" }
        ]
    }
    const filter6 ={
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
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Karyawan</h1>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Export
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
                            Statistik
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* <Filters showFilters={showFilters} filterOptions={filterOptions} /> */}

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={ totalDataKaryawans}
                    totalFiltered={karyawans.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}

                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
                        {loadingKaryawans ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : karyawans.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            karyawans.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                                    <img
                                        alt={item.nama}
                                        className="w-20 h-24 object-cover"
                                        src={item.image_url || blankProfile}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <p className="font-semibold">{item.nama}</p>
                                        <p className="text-gray-600">{item.nik}</p>
                                        <p className="text-gray-600">{item.KeteranganJabatan} - {item.lembaga}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
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
                            {loadingKaryawans ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : karyawans.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    karyawans.map((item, index) => (
                                        <tr key={item.id_karyawan} className="hover:bg-gray-50 whitespace-nowrap">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.niup  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.umur  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.KeteranganJabatan || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.lembaga  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.jenisJabatan  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.golongan  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.pendidikanTerakhir  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_update  || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_input  || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>



                )}
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}

            </div>
        </div>
    )
}

export default Karyawan;