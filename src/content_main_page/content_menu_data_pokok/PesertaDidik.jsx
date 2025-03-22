import { useEffect, useState } from "react";
import useFetchPeserta from "../../hooks/hooks_menu_data_pokok/PesertaDidik";
import PesertaItem from "../../components/PesertaItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";

const PesertaDidik = () => {
    const { pesertaDidik, loading, searchTerm, setSearchTerm, error, limit, setLimit, totalData, totalPages, currentPage, setCurrentPage } = useFetchPeserta();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    // const totalPages = Math.ceil(totalData / limit);

    // console.log(totalData);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
        wilayah: ["Semua Wilayah", "Wilayah Utara", "Wilayah Selatan", "Wilayah Timur", "Wilayah Barat"],
        lembaga: ["Semua Lembaga", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
        blok: ["Semua Blok", "Blok A", "Blok B", "Blok C", "Blok D"],
        jurusan: ["Semua Jurusan", "IPA", "IPS", "Bahasa", "Agama", "Teknik"],
        status: ["Semua Status", "Aktif", "Tidak Aktif", "Alumni"],
        kabupaten: ["Semua Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
        kamar: ["Semua Kamar", "Kamar 101", "Kamar 102", "Kamar 103"],
        kelas: ["Semua Kelas", "Kelas 1", "Kelas 2", "Kelas 3"],
        angkatanPelajar: ["Semua Angkatan Pelajar", "2020", "2021", "2022", "2023"],
        kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
        rombel: ["Semua Rombel", "Rombel 1", "Rombel 2", "Rombel 3"],
        angkatanSantri: ["Semua Angkatan Santri", "2018", "2019", "2020", "2021"],
        wargaPesantren: ["Warga Pesantren", "Santri Mukim", "Santri Non-Mukim"],
        smartcard: ["Smartcard", "Ada", "Tidak Ada"],
        phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Peserta Didik</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                <Filters showFilters={showFilters} filterOptions={filterOptions} />

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={0}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                />

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : pesertaDidik.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            pesertaDidik.map((student, index) => <PesertaItem key={index} student={student} />)
                        )}
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-16">No.</th>
                                <th className="border p-2">NIUP</th>
                                <th className="border p-2">NIK / No. Passport</th>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Lembaga</th>
                                <th className="border p-2">Wilayah</th>
                                <th className="border p-2">Kota Asal</th>
                                <th className="border p-2">Tgl Update Bio</th>
                                <th className="border p-2">Tgl Input Bio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </td>
                                </tr>
                            ) : pesertaDidik.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center p-4">Tidak ada data</td>
                                </tr>
                            ) : (
                                pesertaDidik.map((item, index) => (
                                    <tr key={item.id_pengajar || index} className="text-center">
                                        <td className="border p-2 w-16">{index + 1 || "-"}</td>
                                        <td className="border p-2">{item.niup || "-"}</td>
                                        <td className="border p-2">{item["nik/nopassport"] || "-"}</td>
                                        <td className="border p-2">{item.nama}</td>
                                        <td className="border p-2">{item.lembaga || "-"}</td>
                                        <td className="border p-2">{item.wilayah || "-"}</td>
                                        <td className="border p-2">{item.kota_asal || "-"}</td>
                                        <td className="border p-2">{item.tgl_update || "-"}</td>
                                        <td className="border p-2">{item.tgl_input || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default PesertaDidik;
