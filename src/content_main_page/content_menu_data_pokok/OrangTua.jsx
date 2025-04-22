import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import Filters from '../../components/Filters';
import SearchBar from '../../components/SearchBar';
import { useEffect, useState } from 'react';
import useFetchOrangTua from '../../hooks/hooks_menu_data_pokok/Orangtua';

const OrangTua = () => {
    const { orangtua, loading } = useFetchOrangTua();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
        jenisKelamin: ["Pilih Jenis Kelamin", "Laki-laki", "Perempuan"],
        hidup: ["Pilih Wafat/Hidup", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
        smartcard: ["Smartcard", "Aktif", "Tidak Aktif", "Alumni"],
        phoneNumber: ["Semua Phone Number", "Tersedia", "Tidak Tersedia"],
        kabupaten: ["Pilih Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
        ortuDari: ["Semua Orang Tua Dari"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Orang Tua</h1>
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
                <Filters showFilters={showFilters} filterOptions={filterOptions} />
                <SearchBar
                    searchTerm={""}
                    setSearchTerm={""}
                    totalData={0}
                    totalFiltered={0}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}

                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listorangtua">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : orangtua.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            orangtua.map((item) => (
                                <div key={item.id_orangtua} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                                    <img
                                        alt={item.nama}
                                        className="w-16 h-16 rounded-full object-cover"
                                        src={item.image_url}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <h2 className="font-semibold">{item.nama}</h2>
                                        <p className="text-gray-600">NIK: {item.nik}</p>
                                        <p className="text-gray-600">{item.telepon}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                ) : (
                    <div className="w-full border-collapse border border-gray-300">
                        <table className="min-w-[900px] w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2 text-left w-12">#</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">NIK</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Nama</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Telepon 1</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Telepon 2</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Kota Asal</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Tgl Update Bio</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Tgl Input Bio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : orangtua.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    orangtua.map((item, index) => (
                                        <tr key={item.id_orangtua} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{item.nik}</td>
                                            <td className="border px-4 py-2">{item.nama}</td>
                                            <td className="border px-4 py-2">{item.telepon1}</td>
                                            <td className="border px-4 py-2">{item.telepon2}</td>
                                            <td className="border px-4 py-2">{item.kota_asal}</td>
                                            <td className="border px-4 py-2">{item.updated_at}</td>
                                            <td className="border px-4 py-2">{item.input_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrangTua;