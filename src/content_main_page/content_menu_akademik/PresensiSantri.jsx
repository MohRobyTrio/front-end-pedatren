import { OrbitProgress } from "react-loading-indicators";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import useFetchPresensiSantri from "../../hooks/hooks_menu_akademik/PresensiSantri";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";

const PresensiSantri = () => {
    const { dataPresensi, loadingPresensi, error, searchTerm, setSearchTerm, limit, setLimit, totalDataPresensi, 
        // fetchData, 
        totalPages, currentPage, setCurrentPage } = useFetchPresensiSantri();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Presensi Santri</h1>
                {/* <div className="space-x-2 flex flex-wrap">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                </div> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={{ wilayah: filterWilayah.wilayah }} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={cmbJenisKelamin} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={cmbJenisGroup} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div> */}

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPresensi}
                    // toggleFilters={() => setShowFilters(!showFilters)}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    showViewButtons={false}
                    showFilterButtons={false}
                />

                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">Nama Santri</th>
                                    <th className="px-3 py-2 border-b">Nama Presensi</th>
                                    <th className="px-3 py-2 border-b">Tanggal</th>
                                    <th className="px-3 py-2 border-b">Waktu Presensi</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b">Lokasi</th>
                                    <th className="px-3 py-2 border-b">Metode</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 text-center">
                                {loadingPresensi ? (
                                    <tr><td colSpan="8" className="py-6"><OrbitProgress variant="disc" color="#2a6999" size="small" /></td></tr>
                                ) : dataPresensi.length === 0 ? (
                                    <tr><td colSpan="8" className="py-6">Tidak ada data</td></tr>
                                ) : (
                                    dataPresensi.map((item, index) => (
                                        // <tr key={item.id || index} className="hover:bg-gray-50 text-left"> //Ini yang awal
                                        <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 text-left">
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_presensi || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.waktu_presensi || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.status || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.lokasi || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.metode || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
}

export default PresensiSantri;