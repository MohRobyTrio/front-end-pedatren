import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { useState } from "react";
import useFetchMataPelajaran from "../../hooks/hooks_menu_akademik/MataPelajaran";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ModalAddOrEditMataPelajaran from "../../components/modal/modal_kelembagaan/ModalFormMataPelajaran";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";

const MataPelajaran = () => {
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState("");
    const [feature, setFeature] = useState("");
    const [filters, setFilters] = useState({
        lembaga: "",
    });
    const { filterLembaga } = DropdownLembaga();
    const { mataPelajaran, loadingMataPelajaran, error, searchTerm, setSearchTerm, fetchMataPelajaran, handleDelete, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataMaPel } = useFetchMataPelajaran(filters);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Mata Pelajaran</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setData(null)
                        setFeature(1);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditMataPelajaran isOpen={openModal} onClose={() => setOpenModal(false)} data={data} refetchData={fetchMataPelajaran} feature={feature} />

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
                        <div className="mb-4">
                            <select
                                value={filters.lembaga}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, lembaga: e.target.value }))
                                }
                                className={`border border-gray-300 rounded p-2 ${filterLembaga.lembaga.length <= 1
                                        ? "bg-gray-200 text-gray-500"
                                        : ""
                                    }`}
                            >
                                {filterLembaga.lembaga.map((lembaga) => (
                                    <option key={lembaga.value} value={lembaga.label}>
                                        {lembaga.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            totalData={totalDataMaPel}
                            limit={limit}
                            toggleLimit={(e) => setLimit(Number(e.target.value))}
                            showFilterButtons={false}
                            showViewButtons={false}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b w-10">#</th>
                                        <th className="px-3 py-2 border-b">Kode Mapel</th>
                                        <th className="px-3 py-2 border-b">Nama Mapel</th>
                                        <th className="px-3 py-2 border-b">Nama Pengajar</th>
                                        <th className="px-3 py-2 border-b">NIK Pengajar</th>
                                        <th className="px-3 py-2 border-b">Lembaga</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingMataPelajaran ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : mataPelajaran.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        mataPelajaran.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kode_mapel}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_mapel}</td>
                                                <td className="px-3 py-2 border-b">{item.nama_pengajar}</td>
                                                <td className="px-3 py-2 border-b">{item.nik_pengajar}</td>
                                                <td className="px-3 py-2 border-b">{item.lembaga}</td>
                                                <td className="px-3 py-2 border-b">
                                                    <span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status == "Aktif"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {item.status == "Aktif" ? "Aktif" : "Nonaktif"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                    {item.status == "Aktif" && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setData(item);
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
                                                        </>
                                                    )}
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

export default MataPelajaran;