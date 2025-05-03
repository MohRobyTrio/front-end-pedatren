import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import Filters from '../../components/Filters';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import blankProfile from "../../assets/blank_profile.png";

import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import useFetchWali from '../../hooks/hooks_menu_data_pokok/Wali';

import { useEffect, useMemo, useState } from 'react';

const Wali = () => {
    const [filters, setFilters] = useState({
        phoneNumber: "",
        wafathidup: "",
        status: "",
        jenisKelamin: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: ""
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const negaraTerpilih = filterNegara.negara.find(n => n.value === selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value === selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value === selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value === selectedNegara.kecamatan)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih
    }), [filters, negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih]);

    const {
        wali,
        loadingWali,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataWali,
        totalPages,
        currentPage,
        setCurrentPage
    } = useFetchWali(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

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

        jenisKelaminPesertaDidik: [
            { label: "Pilih Jenis Kelamin Peserta Didik", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ]
        // pilihWaliDari : [
        //     { label: "Pilih Wali Dari", value: "" },
        //     { label: "Santri": value ""},
        //     { label: "Santri Non Pelajar", value: "wafat" },
        //     { label: "Pelajar": value ""},
        //     { label: "Pelajar Non Santri": value ""},
        //     { label: "Santri Sekaligus Pelajar": value ""}
        // ]
    };

    const filter4 = {
        wafathidup: [
            { label: "Pilih Wafat/Hidup", value: "" },
            { label: "Masih Hidup", value: "hidup" },
            { label: "Sudah Wafat", value: "wafat" }
        ],
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Aktif", value: "aktif" },
            { label: "Tidak Aktif", value: "tidak aktif" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Tersedia", value: "tersedia" },
            { label: "Tidak Tersedia", value: "tidak tersedia" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Wali</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataWali}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {loadingWali ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" />
                            </div>
                        ) : wali.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            wali.map((item, index) => (
                                <div key={item.id || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
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
                                        <p className="text-gray-600">{item.nik_or_passport || "-"}</p>
                                        <p className="text-gray-600">{item.telepon_1 || item.telepon_2}</p>
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
                                    <th className="px-3 py-2 border-b">NIK</th>
                                    <th className="px-3 py-2 border-b">Nama</th>
                                    <th className="px-3 py-2 border-b">Telepon 1</th>
                                    <th className="px-3 py-2 border-b">Telepon 2</th>
                                    <th className="px-3 py-2 border-b">Tgl Update</th>
                                    <th className="px-3 py-2 border-b">Tgl Input</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingWali ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                        </td>
                                    </tr>
                                ) : wali.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    wali.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.nik_or_passport || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_2 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
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
    );
};

export default Wali;
