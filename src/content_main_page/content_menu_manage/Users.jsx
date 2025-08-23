import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import useFetchUsers from "../../hooks/hooks_menu_manage/Users";
import { ModalAddUser, MultiStepModalUsers } from "../../components/modal/ModalFormProfil";
import { useMultiStepFormUsers } from "../../hooks/hooks_modal/useMultiStepFormUsers";

const Users = () => {
    const [openModal, setOpenModal] = useState(false);
    // const [selectedId, setSelectedId] = useState(null);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersData, setUsersData] = useState("");
    const { users, loadingUsers, error, fetchUsers, handleDelete, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataUsers, fetchDetailUsers, biodata } = useFetchUsers();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [showFormModal, setShowFormModal] = useState(false);

    const formState = useMultiStepFormUsers(() => setShowFormModal(false), fetchUsers);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Users</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setUsersData(null);
                        setShowFormModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddUser isOpen={openModal} onClose={() => setOpenModal(false)} data={usersData} refetchData={fetchUsers} />

            <MultiStepModalUsers isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />

            {/* <ModalDetailUsers
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                id={selectedId}
            /> */}

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
                            totalData={totalDataUsers}
                            limit={limit}
                            toggleLimit={(e) => setLimit(Number(e.target.value))}
                            showFilterButtons={false}
                            showViewButtons={false}
                            showSearch={false}
                            showLimit={false}
                        />
                        <DoubleScrollbarTable>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">#</th>
                                        <th className="px-3 py-2 border-b">Nama User</th>
                                        <th className="px-3 py-2 border-b">Email</th>
                                        <th className="px-3 py-2 border-b">Role</th>
                                        <th className="px-3 py-2 border-b">Status</th>
                                        <th className="px-3 py-2 border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingUsers ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        users.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                                // setSelectedId(item.id);
                                                // setIsModalOpen(true);
                                            }}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.name}</td>
                                                <td className="px-3 py-2 border-b">{item.email}</td>
                                                <td className="px-3 py-2 border-b capitalize">
                                                    {item.roles.map((role) => role.name).join(', ')}
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
                                                <td className="px-3 py-2 border-b text-center space-x-2">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <button
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                await fetchDetailUsers(item.id);
                                                                setShowFormModal(true);
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
                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Users;