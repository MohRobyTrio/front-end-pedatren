import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchProsesTagihan from "../../hooks/hooks_menu_pembayaran/prosesTagihan";
import SearchBar from "../../components/SearchBar";
import { ModalAddOrEditProsesTagihan } from "../../components/modal/ModalFormProsesTagihan";

const ProsesTagihan = () => {
    const [openModal, setOpenModal] = useState(false);
    const [prosesTagihanData, setProsesTagihanData] = useState("");
    const [feature, setFeature] = useState("");
    const { prosesTagihan, loadingProsesTagihan, error, fetchProsesTagihan, handleDelete, searchTerm, setSearchTerm, totalPages, currentPage, setCurrentPage, totalData } = useFetchProsesTagihan();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!hasAccess("proses_prosesTagihan")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Proses Tagihan</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setProsesTagihanData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditProsesTagihan isOpen={openModal} onClose={() => setOpenModal(false)} data={prosesTagihanData} refetchData={fetchProsesTagihan} feature={feature} />

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
                            onRefresh={() => fetchProsesTagihan(true)}
                            loadingRefresh={loadingProsesTagihan}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b w-10">#</th>
                                        <th className="px-3 py-2 border-b">Nama ProsesTagihan</th>
                                        <th className="px-3 py-2 border-b">Tipe</th>
                                        <th className="px-3 py-2 border-b">Nominal</th>
                                        <th className="px-3 py-2 border-b">Jatuh Tempo</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingProsesTagihan ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : prosesTagihan.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        prosesTagihan.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_prosesTagihan}</td>
                                                <td className="px-3 py-2 border-b">
                                                    {item.tipe === 'bulanan' ? 'Bulanan' : 
                                                     item.tipe === 'semester' ? 'Semester' :
                                                     item.tipe === 'tahunan' ? 'Tahunan' : 'Sekali Bayar'}
                                                </td>
                                                <td className="px-3 py-2 border-b">{formatCurrency(item.nominal)}</td>
                                                <td className="px-3 py-2 border-b">{formatDate(item.jatuh_tempo)}</td>
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
                                                            setProsesTagihanData(item);
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
                    </>
                )}
            </div>
        </div>
    );
};

export default ProsesTagihan;