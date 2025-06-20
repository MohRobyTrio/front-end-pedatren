import { useMemo, useState, useEffect } from "react";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import useFetchGroupKewaliasuhan from "../../hooks/hooks_menu_kewaliasuhan/GroupKewaliasuhan";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { ModalFormGrupWaliAsuh, ModalConfirmationStatusGrup } from "../../components/modal/ModalFormGrupwaliasuh";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import { FaEdit, FaPlus } from "react-icons/fa";
import Access from "../../components/Access";
import { useNavigate } from "react-router-dom";


const GroupKewaliasuhan = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        wilayah: "",
        jenisKelamin: "",
        jenisGroup: ""
    });

    // State untuk modal dan data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrup, setSelectedGrup] = useState(null);
    const [modalMode, setModalMode] = useState("tambah");
    // const [loadingDetail, setLoadingDetail] = useState(false);
    const [wilayahData, setWilayahData] = useState([]);

    // State untuk modal konfirmasi status
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusModalData, setStatusModalData] = useState(null);
    const [isActivateAction, setIsActivateAction] = useState(false);

    // Fungsi untuk membuka modal konfirmasi status
    const openStatusModal = (grup, isActivate) => {
        setStatusModalData({
            id: grup.id,
            nama_grup: grup.group
        });
        setIsActivateAction(isActivate);
        setIsStatusModalOpen(true);
    };

    const { filterWilayah } = DropdownWilayah();
    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == filters.wilayah)?.nama || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        wilayah: wilayahTerpilih
    }), [filters, wilayahTerpilih]);

    const {
        groupKewaliasuhan,
        loadingGroupKewaliasuhan,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData
    } = useFetchGroupKewaliasuhan(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    // Ambil data wilayah untuk dropdown modal
    useEffect(() => {
        setWilayahData(filterWilayah.wilayah.map(w => ({
            id: w.value,
            nama_wilayah: w.label
        })));
    }, [filterWilayah]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Fungsi untuk mengambil detail grup dari API
    const fetchGrupDetail = async (id) => {
        // setLoadingDetail(true);
        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/${id}/grupwaliasuh/show`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            return result.data;
        } catch (error) {
            console.error("Gagal mengambil detail grup:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal mengambil data grup: ${error.message}`,
            });
            return null;
        } finally {
            // setLoadingDetail(false);
        }
    };

    // Fungsi untuk membuka modal tambah
    const handleTambah = () => {
        setModalMode("tambah");
        setSelectedGrup(null);
        setIsModalOpen(true);
    };

    // Fungsi untuk membuka modal edit dengan mengambil data dari API
    const handleEdit = async (id) => {
        Swal.fire({
            background: "transparent",    // tanpa bg putih box
            showConfirmButton: false,     // tanpa tombol
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
            }
        });

        const grupDetail = await fetchGrupDetail(id);
        Swal.close();

        if (grupDetail) {
            setModalMode("edit");
            setSelectedGrup({
                id: grupDetail.id,
                id_wilayah: grupDetail.id_wilayah,
                nama_grup: grupDetail.nama_grup,
                jenis_kelamin: grupDetail.jenis_kelamin
            });
            setIsModalOpen(true);
        }
    };

    const cmbJenisKelamin = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ]
    };

    const cmbJenisGroup = {
        jenisGroup: [
            { label: "Semua Jenis Group", value: "" },
            { label: "Tidak Ada Wali dan Anak", value: "tidak_ada_wali_dan_anak" },
            { label: "Tidak Ada Wali", value: "tidak_ada_wali" },
            { label: "Tidak Ada Anak", value: "tidak_ada_anak" },
            { label: "Wali Ada Tapi Tidak Ada Anak", value: "wali_ada_tapi_tidak_ada_anak" },
            { label: "Anak Ada Tapi Tidak Ada Wali", value: "anak_ada_tapi_tidak_ada_wali" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Group Kewaliasuhan</h1>
                {/* <div className="space-x-2 flex flex-wrap">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                </div> */}

                <div className="space-x-2 flex flex-wrap">
                    <Access action={"tambah"}>
                        <button
                            onClick={handleTambah}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
                        >
                            <FaPlus /> Tambah Grup
                        </button>
                    </Access>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={{ wilayah: filterWilayah.wilayah }} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={cmbJenisKelamin} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={cmbJenisGroup} onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    showViewButtons={false}
                />

                {error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">Group</th>
                                    <th className="px-3 py-2 border-b">NIS Wali Asuh</th>
                                    <th className="px-3 py-2 border-b">Nama Wali Asuh</th>
                                    <th className="px-3 py-2 border-b">Wilayah</th>
                                    <th className="px-3 py-2 border-b">Jum. Anak Asuh</th>
                                    <th className="px-3 py-2 border-b">Tgl Update Group</th>
                                    <th className="px-3 py-2 border-b">Tgl Input Group</th>
                                        <Access action={"edit"}>
                                            <th className="px-3 py-2 border-b">Aksi</th>
                                        </Access>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 text-center">
                                {loadingGroupKewaliasuhan ? (
                                    <tr><td colSpan="8" className="py-6"><OrbitProgress variant="disc" color="#2a6999" size="small" /></td></tr>
                                ) : groupKewaliasuhan.length === 0 ? (
                                    <tr><td colSpan="8" className="py-6">Tidak ada data</td></tr>
                                ) : (
                                    groupKewaliasuhan.map((item, index) => (
                                        <tr key={`${item.id}-${index}`} className="hover:bg-gray-50 text-left">
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.group || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nis_wali_asuh || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nama_wali_asuh || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.jumlah_anak_asuh || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
                                            <Access action={"edit"}>
                                                <td className="px-3 py-2 border-b">
                                                    <div className="flex items-center space-x-2">

                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        {item.status === 1 ? (
                                                            <button
                                                                onClick={() => openStatusModal(item, false)}
                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                            >
                                                                Non-Aktif
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => openStatusModal(item, true)}
                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                            >
                                                                Aktifkan
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </Access>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                )}

                {/* Modal untuk tambah/edit grup */}
                <ModalFormGrupWaliAsuh
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    mode={modalMode}
                    grupData={selectedGrup}
                    wilayahList={wilayahData}
                    refetchData={fetchData}
                />
                {/* Modal Konfirmasi Status */}
                <ModalConfirmationStatusGrup
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    grupData={statusModalData}
                    refetchData={fetchData}
                    isActivate={isActivateAction}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default GroupKewaliasuhan;