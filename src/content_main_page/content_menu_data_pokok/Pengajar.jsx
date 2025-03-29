import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchPengajar from '../../hooks/hooks_menu_data_pokok/Pengajar';
import Pagination from '../../components/Pagination';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import PesertaItem from '../../components/PesertaItem';


const Pengajar = () => {
    const [filters, setFilters] = useState({
        negara: "",       // Tambahkan default value
        provinsi: "",
        kabupaten: "",
        kecamatan: ""
    })
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih
    }), [filters, kabupatenTerpilih, kecamatanTerpilih, negaraTerpilih, provinsiTerpilih]);

    const { pengajar, loadingPengajar, searchTerm, setSearchTerm, totalDataPengajar, totalPages, totalFiltered, limit, setLimit, currentPage, setCurrentPage } = useFetchPengajar(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    // const totalPages = pengajar.total_pages;
    
    // console.log(totalPages)  ;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // const handleLimitChange = (e) => {
    //     const newLimit = Number(e.target.value);
    //     console.log("Limit changed to:", newLimit);
    //     setLimit(newLimit);
    // };

    const filter6 = {
        // Sudah
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        // Sudah
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };

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
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
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
                            pengajar.map((student, index) => <PesertaItem key={index} student={student} />)
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

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default Pengajar;