import '@fortawesome/fontawesome-free/css/all.min.css';
import useFetchWali from '../../logic/logic_menu_data_pokok/Wali';
import { OrbitProgress } from "react-loading-indicators";
import Filters from '../../components/Filters';
import SearchBar from '../../components/SearchBar';
import { useEffect, useState } from 'react';


const Wali = () => {
    const { wali, loading } = useFetchWali();
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
            ortuDari: ["Semua Wali Dari"],
            urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
            kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
            urutSecara: ["Urut Secara", "Ascending", "Descending"]
        };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Wali</h1>
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
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listpesertadidik">
                    {loading ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                        </div>
                    ) : wali.length === 0 ? (
                        <p className="text-center col-span-3">Tidak ada data</p>
                    ) : (
                        wali.map((item) => (
                            <div key={item.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
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
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-16">No</th>
                                <th className="border p-2">NIUP</th>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Pendidikan Terakhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4" className="text-center p-4">Tidak ada data</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Wali;