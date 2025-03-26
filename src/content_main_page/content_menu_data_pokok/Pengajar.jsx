import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import defaultProfile from '/src/assets/blank_profile.png';
import SearchBar from '../../components/SearchBar';
import { useEffect, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchPengajar from '../../hooks/hooks_menu_data_pokok/Pengajar';
import Pagination from '../../components/Pagination';


const Pengajar = () => {
    const { pengajar, loadingPengajar, searchTerm, setSearchTerm, totalDataPengajar, totalFiltered, limit, setLimit, currentPage, setCurrentPage } = useFetchPengajar();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const totalPages = Math.ceil(totalDataPengajar / limit);

    // console.log(totalData);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
        lembaga: ["Semua Lembaga", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
        status: ["Semua Status", "Aktif", "Tidak Aktif", "Alumni"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
        kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
        phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
        kabupaten: ["Semua Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };

    // const handleLimitChange = (e) => {
    //     const newLimit = Number(e.target.value);
    //     console.log("Limit changed to:", newLimit);
    //     setLimit(newLimit);
    // };


    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengajar</h1>
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
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                
                <Filters showFilters={showFilters} filterOptions={filterOptions} />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPengajar}
                    totalFiltered={totalFiltered}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {loadingPengajar ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : pengajar.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            pengajar.map((item, index) => (
                                <div key={item.id_pengajar || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
                                    <img
                                        alt={item.nama || "-"}
                                        className="w-20 h-24 object-cover"
                                        src={item.foto_profil || defaultProfile}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <h2 className="font-semibold">{item.nama}</h2>
                                        <p className="text-gray-600">NIUP: {item.niup}</p>
                                        <p className="text-gray-600">{item.lembaga}</p>
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
                                <th className="border p-2">Lembaga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingPengajar ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </td>
                                </tr>
                            ) : pengajar.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">Tidak ada data</td>
                                </tr>
                            ) : (
                                pengajar.map((item, index) => (
                                    <tr key={item.id_pengajar || index} className="text-center">
                                        <td className="border p-2 w-16">{index + 1}</td>
                                        <td className="border p-2">{item.niup}</td>
                                        <td className="border p-2">{item.nama}</td>
                                        <td className="border p-2">{item.lembaga}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
            </div>
        </div>
    )
}

export default Pengajar;