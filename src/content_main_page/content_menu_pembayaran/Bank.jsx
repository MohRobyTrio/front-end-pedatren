import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
// import useFetchGolongan from "../../hooks/hooks_menu_kepegawaian/Bank";
// import ModalAddOrEditGolongan from "../../components/modal/modal_kelembagaan/ModalFormGolongan";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchBank from "../../hooks/hooks_menu_pembayaran/Bank";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";
import { ModalAddOrEditBank } from "../../components/modal/ModalFormBank";

const Bank = () => {
    const [filters, setFilters] = useState({
        status: "",
    })
    const [openModal, setOpenModal] = useState(false);
    const [bankData, setBankData] = useState("");
    const [feature, setFeature] = useState("");
    const [showFilters, setShowFilters] = useState(false)
    const { bank, loadingBank, error, fetchBank, handleDelete, searchTerm, setSearchTerm, totalPages, currentPage, setCurrentPage, totalData } = useFetchBank(filters);

    const filter = {
        status: [
            { label: "Semua Status", value: "" },
            { label: "Aktif", value: "true" },
            { label: "Nonaktif", value: "false" },
        ],
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    if (!hasAccess("bank")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Bank</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setBankData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditBank isOpen={openModal} onClose={() => setOpenModal(false)} data={bankData} refetchData={fetchBank} feature={feature} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}
                        >
                            <Filters
                                showFilters={showFilters}
                                filterOptions={filter}
                                onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                                selectedFilters={filters}
                            />
                        </div>
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            totalData={totalData}
                            toggleFilters={() => setShowFilters(!showFilters)}
                            showLimit={false}
                            onRefresh={() => fetchBank(true)}
                            loadingRefresh={loadingBank}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b w-10">#</th>
                                        <th className="px-3 py-2 border-b">Kode Bank</th>
                                        <th className="px-3 py-2 border-b">Nama Bank</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingBank ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : bank.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        bank.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.kode_bank}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_bank}</td>
                                                <td className="px-3 py-2 border-b w-30">
                                                    <span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {item.status ? "Aktif" : "Nonaktif"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                    <button
                                                        onClick={() => {
                                                            setBankData(item);
                                                            setFeature(2);
                                                            setOpenModal(true);
                                                        }}
                                                        className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </DoubleScrollbarTable>
                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Bank;