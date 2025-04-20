import { useEffect, useMemo, useState } from "react";
import useFetchAfektif from "../../hooks/hook_menu_kepesantrenan/catatan_afektif";
import SantriAfektifCard from "../../components/catatanCard";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";

const CatatanAfektif = () => {
    const [filters, setFilters] = useState({
        kategori: '',
        nilai: '',
        wilayah: ''
    });
    const [page, setPage] = useState(1);
    const {
        groupedData,
        loading,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData
      } = useFetchAfektif();
    const [showFilters, setShowFilters] = useState(false);

    // Fetch data saat filter/page berubah
    useEffect(() => {
        fetchData(filters, page);
    }, [filters, page, fetchData]);

    return (
        <div className="flex-1 p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold mb-6">Catatan Afektif</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Wali Asuh Tidak Menginput</button>
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Statistik</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* <Filters
                    filters={filters}
                    onChange={(newFilters) => {
                        setFilters(newFilters);
                        setPage(1); // Reset ke page 1 saat filter berubah
                    }}
                /> */}
                
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={groupedData.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    showViewButtons={false}
                    // toggleView={setViewMode}
                />

                <div>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : Object.values(groupedData).length > 0 ? (
                            Object.values(groupedData).map(santri => (
                                <SantriAfektifCard key={santri.id_santri} santri={santri} />
                            ))
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data</p>
                        )}
                    </div>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages} // Ganti dengan nilai dinamis dari API
                    onChange={setPage}
                    className="mt-6"
                />
            </div>

        </div>
    );
};

export default CatatanAfektif;