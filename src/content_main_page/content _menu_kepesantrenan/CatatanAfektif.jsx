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
    const { groupedData, loading, error, fetchData } = useFetchAfektif();

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
                <Filters
                    filters={filters}
                    onChange={(newFilters) => {
                        setFilters(newFilters);
                        setPage(1); // Reset ke page 1 saat filter berubah
                    }}
                />

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                        Error: {error}
                    </div>
                )}

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                        </div>
                    ) : Object.values(groupedData).length > 0 ? (
                        Object.values(groupedData).map(santri => (
                            <SantriAfektifCard key={santri.id_santri} santri={santri} />
                        ))
                    ) : (
                        <p className="text-center py-8 text-gray-500">Tidak ada data</p>
                    )}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={10} // Ganti dengan nilai dinamis dari API
                    onChange={setPage}
                    className="mt-6"
                />
            </div>

        </div>
    );
};

export default CatatanAfektif;