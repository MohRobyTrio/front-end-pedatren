import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchPotonganKhusus from "../../hooks/hooks_menu_pembayaran/PotonganKhusus";
import { ModalAddOrEditSantriPotongan, ModalDetailSantriPotongan } from "../../components/modal/ModalFormSantriPotongan";

const PotonganKhusus = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [potonganKhususData, setPotonganKhususData] = useState("");
    const [idPotonganKhusus, setIdPotonganKhusus] = useState("");
    const [feature, setFeature] = useState("");
    const { potonganKhusus, loadingPotonganKhusus, error, fetchPotonganKhusus, handleDelete, searchTerm, setSearchTerm, totalPages, currentPage, setCurrentPage, totalData } = useFetchPotonganKhusus();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    if (!hasAccess("potongan_khusus")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Potongan Khusus</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setPotonganKhususData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditSantriPotongan isOpen={openModal} onClose={() => setOpenModal(false)} initialData={potonganKhususData} refetchData={fetchPotonganKhusus} feature={feature} />

            <ModalDetailSantriPotongan isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} id={idPotonganKhusus} />

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
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            totalData={totalData}
                            showLimit={false}
                            showSearch={false}
                            showFilterButtons={false}
                            onRefresh={() => fetchPotonganKhusus(true)}
                            loadingRefresh={loadingPotonganKhusus}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b w-10">#</th>
                                        <th className="px-3 py-2 border-b">Nama Santri</th>
                                        <th className="px-3 py-2 border-b">Nama Potongan</th>
                                        <th className="px-3 py-2 border-b">Keterangan</th>
                                        <th className="px-3 py-2 border-b">Berlaku</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingPotonganKhusus ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : potonganKhusus.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        potonganKhusus.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                setIdPotonganKhusus(item.id)
                                                setOpenDetailModal(true)
                                            }}>
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_santri}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_potongan}</td>
                                                <td className="px-3 py-2 border-b capitalize">
                                                    {item.keterangan}
                                                </td>
                                                <td className="px-3 py-2 border-b">
                                                    {item.berlaku_dari} s.d. {item.berlaku_sampai}
                                                </td>
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
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPotonganKhususData(item);
                                                            setFeature(2);
                                                            setOpenModal(true);
                                                        }}
                                                        className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete(item.id)
                                                        }}
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

export default PotonganKhusus;