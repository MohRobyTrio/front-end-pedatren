import {  useMemo, useState } from "react";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import useFetchGroupKewaliasuhan from "../../hooks/hooks_menu_kewaliasuhan/GroupKewaliasuhan"; // Buat sesuai

const GroupKewaliasuhan = () => {
    const [filters, setFilters] = useState({
        wilayah: "",
        blok: "",
        kamar: "",
        jenisKelamin: "",
        jenisGroup: ""
    });

    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value === selectedWilayah.wilayah)?.label || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value === selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value === selectedWilayah.kamar)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih
    }), [filters, wilayahTerpilih, blokTerpilih, kamarTerpilih]);

    const {
        groupKewaliasuhan,
        loadingGroupKewaliasuhan,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage
    } = useFetchGroupKewaliasuhan(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filterOptions = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        jenisGroup: [
            { label: "Semua Jenis Group", value: "" },
            { label: "Group A", value: "A" },
            { label: "Group B", value: "B" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Group Kewaliasuhan</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterOptions} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">Group</th>
                                    <th className="px-3 py-2 border-b">NIS Wali Asuh</th>
                                    <th className="px-3 py-2 border-b">Nama Wali Asuh</th>
                                    <th className="px-3 py-2 border-b">Wilayah</th>
                                    <th className="px-3 py-2 border-b">Jum. Anak Asuh</th>
                                    <th className="px-3 py-2 border-b">Tgl Update Group</th>
                                    <th className="px-3 py-2 border-b">Tgl Input Group</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 text-center">
                                {loadingGroupKewaliasuhan ? (
                                    <tr><td colSpan="8" className="py-6"><OrbitProgress variant="disc" color="#2a6999" size="small" /></td></tr>
                                ) : groupKewaliasuhan.length === 0 ? (
                                    <tr><td colSpan="8" className="py-6">Tidak ada data</td></tr>
                                ) : (
                                    groupKewaliasuhan.map((item, index) => (
                                        // <tr key={item.id || index} className="hover:bg-gray-50 text-left"> //Ini yang awal
                                        <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 text-left">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.group || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nis_wali_asuh || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_wali_asuh || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.jumlah_anak_asuh || "-"}</td>
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

export default GroupKewaliasuhan;
