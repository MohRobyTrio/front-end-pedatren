import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
// import useFetchGolongan from "../../hooks/hooks_menu_kepegawaian/KartuRFID";
// import ModalAddOrEditGolongan from "../../components/modal/modal_kelembagaan/ModalFormGolongan";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchKartuRFID from "../../hooks/hooks_menu_data_pokok/KartuRFID";

const KartuRFID = () => {
    
    const [openModal, setOpenModal] = useState(false);
    const [lembagaData, setLembagaData] = useState("");
    const [feature, setFeature] = useState("");
    const { karturfid, loadingKartuRFID, error, fetchKartuRFID, handleDelete } = useFetchKartuRFID();

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Kartu RFID</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            {/* <ModalAddOrEditGolongan isOpen={openModal} onClose={() => setOpenModal(false)} data={lembagaData} refetchData={fetchGolongan} feature={feature} /> */}

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
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b w-10">#</th>
                                    <th className="px-3 py-2 border-b">Nama Santri</th>
                                    <th className="px-3 py-2 border-b">NIS</th>
                                    <th className="px-3 py-2 border-b">UID Kartu</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b">Tanggal Terbit</th>
                                    <th className="px-3 py-2 border-b">Tanggal Kadaluarsa</th>
                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingKartuRFID ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : karturfid.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    karturfid.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">{item.nis}</td>
                                            <td className="px-3 py-2 border-b">{item.uid_kartu}</td>
                                            <td className="px-3 py-2 border-b w-30">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.aktif
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.aktif ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_terbit}</td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_expired}</td>
                                            <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                <button
                                                    onClick={() => {
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
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                )}
            </div>
        </div>
    );
};

export default KartuRFID;