import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchDataOutlet from "../../hooks/hook_menu_kepesantrenan/belanja/hookOutlet";
import { ModalAddOrEditOutlet, ModalDetailOutlet } from "../../components/modal/ModalFormOutlet";
import SearchBar from "../../components/SearchBar";

const ViewOutlet = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [lembagaData, setLembagaData] = useState("");
    const [feature, setFeature] = useState("");
    const { dataOutlet, loadingDataOutlet, error, fetchDataOutlet, handleDelete } = useFetchDataOutlet();

    if (!hasAccess("outlet")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Outlet</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditOutlet isOpen={openModal} onClose={() => setOpenModal(false)} data={lembagaData} refetchData={fetchDataOutlet} feature={feature} />

            <ModalDetailOutlet
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                id={selectedId}
            />

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
                            totalData={dataOutlet.length}
                            onRefresh={() => fetchDataOutlet(true)}
                            loadingRefresh={loadingDataOutlet}
                            showFilterButtons={false}
                            showSearch={false}
                            showLimit={false}
                        />
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b w-10">#</th>
                                    <th className="px-3 py-2 border-b">Nama Outlet</th>
                                    <th className="px-3 py-2 border-b">Kategori</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingDataOutlet ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : dataOutlet.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    dataOutlet.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={() => {
                                            setSelectedId(item.id);
                                            setIsModalOpen(true);
                                        }}>
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_outlet}</td>
                                            <td className="px-3 py-2 border-b">
                                                {item.kategori && item.kategori.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.kategori.map((kat) => (
                                                            <span
                                                                key={kat.id}
                                                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                                                            >
                                                                {kat.nama_kategori}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 border-b w-30">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status == 1
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status == 1 ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setLembagaData(item);
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
                                                </div>
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

export default ViewOutlet;