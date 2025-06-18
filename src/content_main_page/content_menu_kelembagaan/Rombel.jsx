import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import ToggleStatus from "../../components/ToggleStatus";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import useFetchRombel from "../../hooks/hooks_menu_kelembagaan/Rombel";
import { ModalAddOrEditRombel, ModalDetailRombel } from "../../components/modal/modal_kelembagaan/ModalFormRombel";

const Rombel = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rombelData, setRombelData] = useState("");
    const { rombel, loadingRombel, error, fetchRombel, fetchRombelDetail, handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataRombel } = useFetchRombel();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Rombel</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setRombelData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditRombel isOpen={openModal} onClose={() => setOpenModal(false)} data={rombelData} refetchData={fetchRombel} />

            <ModalDetailRombel
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
                            totalData={totalDataRombel}
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
                                    <th className="px-3 py-2 border-b">Nama Rombel</th>
                                    <th className="px-3 py-2 border-b">Kelas</th>
                                    <th className="px-3 py-2 border-b">Jurusan</th>
                                    <th className="px-3 py-2 border-b">Lembaga</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingRombel ? (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : rombel.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    rombel.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                        setSelectedId(item.id);
                                                        setIsModalOpen(true);
                                                    }}>
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_rombel}</td>
                                            <td className="px-3 py-2 border-b">{item.kelas}</td>
                                            <td className="px-3 py-2 border-b">{item.jurusan}</td>
                                            <td className="px-3 py-2 border-b">{item.lembaga}</td>
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
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const data = await fetchRombelDetail(item.id);
                                                        setRombelData(data);
                                                        setOpenModal(true);
                                                    }}
                                                    className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
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

export default Rombel;