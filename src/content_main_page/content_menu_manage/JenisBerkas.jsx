import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { ModalAddOrEditJenisBerkas, ModalDetailJenisBerkas } from "../../components/modal/modal_kelembagaan/ModalFormJenisBerkas";
import useFetchJenisBerkas from "../../hooks/hooks_menu_manage/jenisBerkas";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";

const JenisBerkas = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jenisBerkasData, setJenisBerkasData] = useState("");
    const { jenisBerkas, loadingJenisBerkas, error, fetchJenisBerkas, handleDelete } = useFetchJenisBerkas();

    if (!hasAccess("jenis_berkas")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Jenis Berkas</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setJenisBerkasData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditJenisBerkas isOpen={openModal} onClose={() => setOpenModal(false)} data={jenisBerkasData} refetchData={fetchJenisBerkas} />

            <ModalDetailJenisBerkas
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
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">#</th>
                                        <th className="px-3 py-2 border-b">Nama Jenis Berkas</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingJenisBerkas ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : jenisBerkas.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        jenisBerkas.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                setSelectedId(item.id);
                                                setIsModalOpen(true);
                                            }}>
                                                <td className="px-3 py-2 border-b">{index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b capitalize">{item.nama_jenis_berkas}</td>
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
                                                <td className="px-3 py-2 border-b text-center space-x-2">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setJenisBerkasData(item);
                                                                setOpenModal(true);
                                                            }}
                                                            className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
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
                    </>
                )}
            </div>
        </div>
    );
};

export default JenisBerkas;