import { useEffect, useMemo, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import useFetchOrangTua from "../../hooks/hooks_menu_data_pokok/Orangtua";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import ModalDetail from "../../components/modal/ModalDetail";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";

const OrangTua = () => {
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
        phoneNumber: "",
        jenisKelamin: "",
        jenisKelaminPesertaDidik: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wafatHidup: ""
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(k => k.value == selectedNegara.kecamatan)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih
    }), [filters, negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih]);

    const {
        orangtua,
        loadingOrangtua,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataOrangtua,
        totalPages,
        currentPage,
        setCurrentPage
    } = useFetchOrangTua(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) setViewMode(savedViewMode);
    }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const filter2 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        jenisKelaminPesertaDidik: [
            { label: "Pilih Jenis Kelamin Peserta Didik", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ]
    };

    const filter3 = {
        wafatHidup: [
            { label: "Pilih Wafat / Hidup", value: "" },
            { label: "Sudah Wafat", value: "sudah wafat" },
            { label: "Masih Hidup", value: "masih hidup" }
        ],
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Orang Tua</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filter2} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataOrangtua}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
                        {loadingOrangtua ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" />
                            </div>
                        ) : orangtua.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            orangtua.map((item, index) => (
                                <div key={item.id_orangtua || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer" onClick={() => openModal(item)}>
                                    <img
                                        alt={item.nama || "-"}
                                        className="w-20 h-24 object-cover"
                                        src={item.foto_profil}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = blankProfile;
                                        }}
                                    />
                                    <div>
                                        <h2 className="font-semibold text-xl">{item.nama || "-"}</h2>
                                        <p className="text-gray-600">NIK: {item.nik_or_passport || "-"}</p>
                                        <p className="text-gray-600">Phone: {item.telepon_1 || item.telepon_2 || "-"}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <DoubleScrollbarTable>
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
                                        <td colSpan="8" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                        </td>
                                    </tr>
                                ) : orangtua.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    orangtua.map((item, index) => (
                                        <tr key={item.id_orangtua || index} className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer" onClick={() => openModal(item)}>
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nik || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.telepon_2 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </DoubleScrollbarTable>
                    ))}

                {isModalOpen && (
                    <ModalDetail
                        title="Orang Tua"
                        menu={6}
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

export default OrangTua;
