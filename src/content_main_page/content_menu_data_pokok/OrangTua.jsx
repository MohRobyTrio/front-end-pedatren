import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import Filters from '../../components/Filters';
import SearchBar from '../../components/SearchBar';
import { useEffect, useState } from 'react';
import blankProfile from "../../assets/blank_profile.png";
import useFetchOrangTua from '../../hooks/hooks_menu_data_pokok/Orangtua';
import Pagination from "../../components/Pagination";

const OrangTua = () => {
    const { orangtua,
        loadingOrangtua,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataOrangtua,
        totalPages,
        currentPage,
        setCurrentPage, } = useFetchOrangTua();
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
                {/* <Filters showFilters={showFilters} filterOptions={filterOptions} /> */}

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataOrangtua}
                    totalFiltered={orangtua.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}

                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listorangtua">
                        {loadingOrangtua ? (
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
                                        className="w-20 h-24 object-cover"
                                        src={item.image_url || blankProfile}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <h2 className="font-semibold">{item.nama}</h2>
                                        <p className="text-gray-600">NIK: {item.nik_or_passport}</p>
                                        <p className="text-gray-600">Phone : {item.telepon_1 || item.telepon_2}</p>
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
                                    <th className="px-3 py-2 border-b">Kota Asal</th>
                                    <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                    <th className="px-3 py-2 border-b">Tgl Input Bio</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingOrangtua ? (
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
                                        <tr key={item.id_orangtua} className="hover:bg-gray-50 whitespace-nowrap">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.nik_or_passport}</td>
                                            <td className="px-3 py-2 border-b">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_1}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_2}</td>
                                            <td className="px-3 py-2 border-b">{item.kota_asal}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_update}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_input}</td>
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

export default OrangTua;