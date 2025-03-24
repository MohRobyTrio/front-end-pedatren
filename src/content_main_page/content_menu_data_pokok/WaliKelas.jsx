import { useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import Pagination from "../../components/Pagination";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useFetchWaliKelas from "../../hooks/hooks_menu_data_pokok/WaliKelas";

const WaliKelas = () => {
    const { waliKelas, loading, error, totalData, limit, setLimit, currentPage, setCurrentPage } = useFetchWaliKelas();
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState(sessionStorage.getItem("viewMode") || "list");

    useEffect(() => {
        sessionStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    const totalPages = Math.ceil(totalData / limit);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filteredWaliKelas = useMemo(() => {
        // Debug: Log struktur data
        console.log("State waliKelas saat ini:", waliKelas);
    
        // Pastikan data tersedia dan merupakan array
        if (!waliKelas || !Array.isArray(waliKelas.data)) {
            console.log("Data wali kelas tidak ditemukan atau bukan array:", waliKelas);
            return [];
        }
    
        // Filter dengan penanganan null/undefined yang lebih aman
        return waliKelas.data.filter(item => 
            item?.nama && 
            item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [waliKelas, searchTerm]);
    
    console.log("Filtered Wali Kelas:", filteredWaliKelas);
    
    

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
                <h1 className="text-2xl font-bold">Data Wali Kelas</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <Filters showFilters={showFilters} filterOptions={filterOptions} />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={filteredWaliKelas.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {loading ? (
                    <div className="flex justify-center">
                        <i className="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded" onClick={() => window.location.reload()}>
                            Coba Lagi
                        </button>
                    </div>
                ) : viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
                        {filteredWaliKelas.length ? (
                            filteredWaliKelas.map((item, index) => (
                                <div
                                    key={item.id_walikelas || index}
                                    className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
                                >
                                    <img
                                        alt={item.nama || "-"}
                                        className="w-20 h-24 object-cover rounded-md"
                                        src={item.foto_profil || "https://via.placeholder.com/50"}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <h2 className="font-semibold">{item.nama}</h2>
                                        <p className="text-gray-600">- </p> {/*mengikuti contoh dari foto*/}
                                        <p className="text-gray-600">{item.lembaga} | {item.kelas}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Tidak ada data wali kelas.</p>
                        )}
                    </div>

                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">No</th>
                                <th className="border p-2">NIUP</th>
                                <th className="border p-2">NIK/NO. Passport</th>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Jenis Kelamin</th>
                                <th className="border p-2">Lembaga</th>
                                <th className="border p-2">Kelas Rombel</th>
                                <th className="border p-2">Gender Rombel</th>
                                <th className="border p-2">Jumlah Murid</th>
                                <th className="border p-2">Tgl Update Wali Kelas</th>
                                <th className="border p-2">Tgl Input Wali Kelas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWaliKelas.length ? filteredWaliKelas.map((item, index) => (
                                <tr key={item.id || index} className="text-center">
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{item.niup}</td>
                                    <td className="border p-2">{item["NIK/No.Passport"]}</td>
                                    <td className="border p-2">{item.nama}</td>
                                    <td className="border p-2">{item.JenisKelamin}</td>
                                    <td className="border p-2">{item.lembaga}</td>
                                    <td className="border p-2">{item.Kelas}-{item.rombel}</td>
                                    <td className="border p-2">{item.GenderRombel}</td>
                                    <td className="border p-2">{item.JumlahMurid}</td>
                                    <td className="border p-2">{item.tgl_update}</td>
                                    <td className="border p-2">{item.tgl_input}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="10" className="text-center p-4">Tidak ada data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default WaliKelas;
