import {  useMemo, useState } from "react";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import useFetchPengunjung from "../../hooks/hooks_menu_mahrom/Pengunjung";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import ModalDetail from "../../components/modal/ModalDetail";

const Pengunjung = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    }; 

    const [filters, setFilters] = useState({
        wilayah: "",
        jenisKelamin: "",
        jenisGroup: ""
    });

    const { filterWilayah } = DropdownWilayah();
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == filters.wilayah)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        wilayah: wilayahTerpilih
    }), [filters, kabupatenTerpilih, kecamatanTerpilih, negaraTerpilih, provinsiTerpilih, wilayahTerpilih]);    

    const {
        pengunjung,
        loading,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage
    } = useFetchPengunjung(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengunjung</h1>
                {/* <div className="space-x-2 flex flex-wrap">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                </div> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={{ wilayah: filterWilayah.wilayah }} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    showViewButtons={false}
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
                                    <th className="px-3 py-2 border-b">Wilayah Mahrom</th>
                                    <th className="px-3 py-2 border-b">Nama Pengunjung</th>
                                    <th className="px-3 py-2 border-b">Santri Dikunjungi</th>
                                    <th className="px-3 py-2 border-b">Jumlah Rombongan</th>
                                    <th className="px-3 py-2 border-b">Tanggal Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 text-center">
                                {loading ? (
                                    <tr><td colSpan="6" className="py-6"><OrbitProgress variant="disc" color="#2a6999" size="small" /></td></tr>
                                ) : pengunjung.length === 0 ? (
                                    <tr><td colSpan="6" className="py-6">Tidak ada data</td></tr>
                                ) : (
                                    pengunjung.map((item, index) => (
                                        <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 text-left hover:cursor-pointer" onClick={() => openModal(item)}>
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                            <td className="px-3 py-2 border-b">
                                                <div>{item.nama_pengunjung || "-"}</div>
                                                <div className="text-gray-500 text-sm italic">({item.status || "-"})</div>
                                            </td>
                                            <td className="px-3 py-2 border-b">
                                                <div>{item.santri_dikunjungi}</div>
                                                <div className="text-gray-500 text-sm italic">{item.kamar} - {item.blok} - {item.wilayah} -
                                                    {item.lembaga}, {item.jurusan}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 border-b">{item.jumlah_rombongan || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_kunjungan || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalOpen && (
                    <ModalDetail
                        title="Pengunjung"
                        menu={23}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default Pengunjung;
