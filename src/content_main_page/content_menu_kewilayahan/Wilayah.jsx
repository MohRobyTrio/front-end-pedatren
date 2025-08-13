import { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { OrbitProgress } from "react-loading-indicators";
import useFetchWilayah from "../../hooks/hooks_menu_kewilayahan/Wilayah";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { ModalAddOrEditWilayah, ModalDetailWilayah } from "../../components/modal/modal_kewilayahan/ModalFormWilayah";
import ToggleStatus from "../../components/ToggleStatus";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";

const Wilayah = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedWilayah, setSelectedWilayah] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        wilayah,
        loadingWilayah,
        error,
        fetchWilayah,
        fetchWilayahDetail,
        handleToggleStatus,
        limit,
        setLimit,
        totalPages,
        currentPage,
        setCurrentPage,
        totalDataWilayah
    } = useFetchWilayah();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (!hasAccess("kewilayahan")) {
        return <Navigate to="/not-found" replace />;
    }
    
    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Wilayah</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => {
                            setSelectedWilayah(null);
                            setOpenModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
                    >
                        <FaPlus /> Tambah
                    </button>
                </div>
            </div>

            <ModalAddOrEditWilayah
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                data={selectedWilayah}
                refetchData={fetchWilayah}
            />

            <ModalDetailWilayah
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                id={selectedId}
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={fetchWilayah}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <>
                    <SearchBar
                        totalData={totalDataWilayah}
                        limit={limit}
                        toggleLimit={(e) => setLimit(Number(e.target.value))}
                        showFilterButtons={false}
                        showViewButtons={false}
                        showSearch={false}
                    />
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">Nama Wilayah</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b w-20">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingWilayah ? (
                                    <tr>
                                            <td colSpan="5" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                ) : wilayah.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    wilayah.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedId(item.id);
                                                        setIsModalOpen(true);
                                                    }}>
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_wilayah}</td>
                                            <td className="px-3 py-2 border-b">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status ? "Aktif" : "Nonaktif"}
                                                </span>
                                                
                                            </td>
                                            <td className="px-3 py-2 border-b space-x-2 text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const data = await fetchWilayahDetail(item.id);
                                                            setSelectedWilayah(data);
                                                            setOpenModal(true);
                                                        }}
                                                        className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <ToggleStatus
                                                        active={item.status}
                                                        onClick={() => handleToggleStatus(item)}
                                                    />
                                                </div>
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

export default Wilayah;
