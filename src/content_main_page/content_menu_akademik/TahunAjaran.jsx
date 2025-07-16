import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
// import Pagination from "../../components/Pagination";
// import SearchBar from "../../components/SearchBar";
// import { ModalAddOrEditTaloadingTahunAjaran, ModalDetailTaloadingTahunAjaran } from "../../components/modal/modal_kelembagaan/ModalFormKelas";
import useFetchTahunAjaran from "../../hooks/hooks_menu_akademik/TahunAjaran";
import { ModalAddOrEditTahunAjaran, ModalDetailTahunAjaran } from "../../components/modal/modal_kelembagaan/ModalFormTahunAjaran";

const TahunAjaran = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tahunAjaranData, setTahunAjaranData] = useState("");
    const { tahunAjaran, loadingTahunAjaran, error, fetchTahunAjaran, handleDelete, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataTahunAjaran } = useFetchTahunAjaran();

    // const handlePageChange = (page) => {
    //     if (page >= 1 && page <= totalPages) {
    //         setCurrentPage(page);
    //     }
    // };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Tahun Ajaran</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setTahunAjaranData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditTahunAjaran isOpen={openModal} onClose={() => setOpenModal(false)} data={tahunAjaranData} refetchData={fetchTahunAjaran} />

            <ModalDetailTahunAjaran
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
                        {/* <SearchBar
                            totalData={totalDataTahunAjaran}
                            limit={limit}
                            toggleLimit={(e) => setLimit(Number(e.target.value))}
                            showFilterButtons={false}
                            showViewButtons={false}
                            showSearch={false}
                        /> */}
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">#</th>
                                        <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                                        <th className="px-3 py-2 border-b">Jurusan</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingTahunAjaran ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : tahunAjaran.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        tahunAjaran.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                setSelectedId(item.id);
                                                setIsModalOpen(true);
                                            }}>
                                                <td className="px-3 py-2 border-b">{index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tahun_ajaran}</td>
                                                <td className="px-3 py-2 border-b">{item.tanggal_mulai.split("T")[0]}</td>
                                                <td className="px-3 py-2 border-b">{item.tanggal_selesai.split("T")[0]}</td>
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
                                                                setTahunAjaranData(item);
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
                                                        {/* <ToggleStatus
                                                            active={item.status}
                                                            onClick={() => handleToggleStatus(item)}
                                                    /> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </DoubleScrollbarTable>
                        {/* {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )} */}
                    </>
                )}
            </div>
        </div>
    );
};

export default TahunAjaran;