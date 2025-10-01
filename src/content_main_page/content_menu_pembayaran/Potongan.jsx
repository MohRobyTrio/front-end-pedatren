import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import useFetchPotongan from "../../hooks/hooks_menu_pembayaran/Potongan";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import { ModalAddOrEditPotongan, ModalDetailPotongan } from "../../components/modal/ModalFormPotongan";
import ToggleStatus from "../../components/ToggleStatus";

const Potongan = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [potonganData, setPotonganData] = useState("");
    const [idPotongan, setIdPotongan] = useState("");
    const [feature, setFeature] = useState("");
    const { potongan, loadingPotongan, error, fetchPotongan, handleDelete, handleToggleStatus, searchTerm, setSearchTerm, totalPages, currentPage, setCurrentPage, totalData } = useFetchPotongan();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatKategori = (kategori) => {
        const map = {
            'anak_pegawai': 'Anak Pegawai',
            'bersaudara': 'Bersaudara',
            'khadam': 'Khadam',
            'umum': 'Umum'
        };
        return map[kategori] || kategori?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "-";
    };

    if (!hasAccess("potongan")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Potongan</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setPotonganData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditPotongan isOpen={openModal} onClose={() => setOpenModal(false)} data={potonganData} refetchData={fetchPotongan} feature={feature} />

            <ModalDetailPotongan isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} id={idPotongan} />

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
                            onRefresh={() => fetchPotongan(true)}
                            loadingRefresh={loadingPotongan}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b w-10">#</th>
                                        <th className="px-3 py-2 border-b">Nama Potongan</th>
                                        <th className="px-3 py-2 border-b">Kategori</th>
                                        <th className="px-3 py-2 border-b">Jenis</th>
                                        <th className="px-3 py-2 border-b">Nilai</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingPotongan ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : potongan.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        potongan.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                setIdPotongan(item.id)
                                                setOpenDetailModal(true)
                                            }}>
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{formatKategori(item.kategori)}</td>
                                                <td className="px-3 py-2 border-b capitalize">
                                                    {item.jenis}
                                                </td>
                                                <td className="px-3 py-2 border-b">
                                                    {item.jenis === "persentase"
                                                        ? `${parseFloat(item.nilai)} %`
                                                        : formatCurrency(item.nilai)}
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
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <ToggleStatus
                                                            active={item.status == 1}
                                                            onClick={() => handleToggleStatus(item)}
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setPotonganData(item);
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

export default Potongan;