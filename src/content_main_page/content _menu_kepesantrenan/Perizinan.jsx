import { useEffect, useState, useMemo } from "react";
import useFetchPerizinan from "../../hooks/hook_menu_kepesantrenan/Perizinan";
import useApprovePerizinan from "../../hooks/hook_menu_kepesantrenan/approvePerizinan";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Pagination from "../../components/Pagination";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import ModalDetail from "../../components/modal/ModalDetail";
import { FaFileExport, FaPlus, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaSchool, FaClipboardList, FaClock, FaUsers, FaCheckCircle, FaHome } from "react-icons/fa";
import { ModalAddPerizinan, ModalApprove } from "../../components/modal/ModalFormPerizinan";
import Access from "../../components/Access";
import { getRolesString } from "../../utils/getRolesString";
import { ModalExport } from "../../components/modal/ModalExport";
import { API_BASE_URL } from "../../hooks/config";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";

const DataPerizinan = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalExport, setOpenModalExport] = useState(false);
    const [selectedName, setSelectedName] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feature, setFeature] = useState("");
    const capitalizeFirstLetter = getRolesString();
    
    console.log("Roles:", capitalizeFirstLetter);
    
    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenisKelamin: ""
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";
    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.nama || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";
    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih,
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih,
    }), [
        filters,
        negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih,
        wilayahTerpilih, blokTerpilih, kamarTerpilih,
        lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih
    ]);

    const {
        data,
        loading,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData,
    } = useFetchPerizinan(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchData(updatedFilters, filters);
    }, [updatedFilters, filters, fetchData]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        bermalam: [
            { label: "Bermalam / Tidak Bermalam", value: "" },
            { label: "Bermalam", value: "bermalam" },
            { label: "Tidak Bermalam", value: "tidak bermalam" }
        ],
        jenis_izin: [
            { label: "Rombongan / Personal", value: "" },
            { label: "Rombongan", value: "rombongan" },
            { label: "Personal", value: "personal" }
        ],
        status: [
            { label: "Semua Status Izin", value: "" },
            { label: "Sedang Proses Izin", value: "sedang proses izin" },
            { label: "Perizinan Diterima", value: "perizinan diterima" },
            { label: "Sudah Berada Di Luar Pondok", value: "sudah berada diluar pondok" },
            { label: "Perizinan Ditolak", value: "perizinan ditolak" },
            { label: "Perizinan Dibatalkan", value: "dibatalkan" },
            { label: "Telat (sudah kembali)", value: "telat(sudah kembali)" },
            { label: "Telat (belum kembali)", value: "telat(belum kembali)" },
            { label: "Kembali Tepat Waktu", value: "kembali tepat waktu" }
        ]
    }

    const filter4 = {
        masa_telat: [
            { label: "Semua Masa Telat", value: "" },
            { label: "Lebih Dari 1 Minggu", value: "lebih dari seminggu" },
            { label: "Lebih Dari 2 Minggu", value: "lebih dari 2 minggu" },
            { label: "Lebih Dari 1 Bulan", value: "lebih dari satu bulan" }
        ]
    }

    const fieldsExports = [];

    const [showFormModal, setShowFormModal] = useState(false);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Perizinan</h1>
                <div className="flex items-center space-x-2">
                    <Access action="tambah">
                        <button onClick={() => {
                            setFeature(1);
                            setShowFormModal(true);
                            }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah </button>
                    </Access>
                    <button
                        onClick={() => setOpenModalExport(true)}
                        className={`px-4 py-2 rounded flex items-center gap-2 text-white cursor-pointer bg-blue-500 hover:bg-blue-700`}
                    >
                        <FaFileExport />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <ModalAddPerizinan isOpen={showFormModal} onClose={() => setShowFormModal(false)} refetchData={fetchData} feature={feature} id={selectedId} nama={selectedName} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterNegara}
                        onChange={handleFilterChangeNegara}
                        selectedFilters={selectedNegara}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterWilayah}
                        onChange={handleFilterChangeWilayah}
                        selectedFilters={selectedWilayah}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterLembaga}
                        onChange={handleFilterChangeLembaga}
                        selectedFilters={selectedLembaga}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter3}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter4}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    showViewButtons={false}
                />

                <div>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : data.length > 0 ? (
                            <div className="">
                                {data.map(perizinan => (
                                    <PerizinanCard key={perizinan.id} data={perizinan} openModal={openModal} setShowFormModal={setShowFormModal} setFeature={setFeature} setSelectedId={setSelectedId} setSelectedName={setSelectedName} refetchData={fetchData} userRole={capitalizeFirstLetter} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data perizinan</p>
                        )}
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    className="mt-6"
                />

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/perizinan" />
                 
                {isModalOpen && (
                    <ModalDetail
                        title="Perizinan"
                        menu={17}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

// Compact Enhanced Perizinan Card Component
const PerizinanCard = ({ data, openModal, setShowFormModal, setFeature, setSelectedId, setSelectedName, refetchData}) => {
    const userRole = getRolesString().toLowerCase();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { approvePerizinan, isApproving, error } = useApprovePerizinan();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showKeluarModal, setShowKeluarModal] = useState(false);
    const [showKembaliModal, setShowKembaliModal] = useState(false);
    const [showLoadingKeluarModal, setShowLoadingKeluarModal] = useState(false);
    const [showLoadingKembaliModal, setShowLoadingKembaliModal] = useState(false);
    const [approveError, setApproveError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const canApprove = useMemo(() => {
        if (!userRole) return false;
        const approvalStatus = {
            biktren: !data.approved_by_biktren,
            kamtib: !data.approved_by_kamtib,
            pengasuh: !data.approved_by_pengasuh
        };
        return approvalStatus[userRole];
    }, [userRole, data]);

    // Handle proses approval
    const handleApprove = async () => {
        setApproveError(null);
        const success = await approvePerizinan(data.id, userRole);
        if (success) {
            setShowApproveModal(false);
            try {
                await refetchData(true);
            } catch (err) {
                console.error("Gagal refetch:", err);
            }
        } else {
            setApproveError(error);
        }
    };

    const token = sessionStorage.getItem("token") || getCookie("token");
    

    const handleSetKeluar = async () => {
        try {
            setShowLoadingKeluarModal(true)
            // Swal.fire({
            //     background: "transparent",    // tanpa bg putih box
            //     showConfirmButton: false,     // tanpa tombol
            //     allowOutsideClick: false,
            //     didOpen: () => {
            //         Swal.showLoading();
            //     },
            //     customClass: {
            //         popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
            //     }
            // });
            const response = await fetch(`${API_BASE_URL}crud/${data.id}/perizinan/set-keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Swal.close();

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
            console.log(result);
            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }
            if (!response.ok) throw new Error(`Gagal set keluar (${response.status})`);

            Swal.fire("Berhasil!", "success");
            setShowKeluarModal(false);
            refetchData(true);
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        } finally {
            setShowLoadingKeluarModal(false)
        }
    };

    const handleSetKembali = async () => {
        try {
            setShowLoadingKembaliModal(true)
            // Swal.fire({
            //     background: "transparent",    // tanpa bg putih box
            //     showConfirmButton: false,     // tanpa tombol
            //     allowOutsideClick: false,
            //     didOpen: () => {
            //         Swal.showLoading();
            //     },
            //     customClass: {
            //         popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
            //     }
            // });
            const response = await fetch(`${API_BASE_URL}crud/${data.id}/perizinan/set-kembali`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
            console.log(result);
            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }
            if (!response.ok) throw new Error(`Gagal set kembali (${response.status})`);

            Swal.fire("Berhasil!", "success");
            setShowKembaliModal(false);
            refetchData(true);
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        } finally {
            setShowLoadingKembaliModal(false)
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'sedang proses izin':
                return { 
                    bg: 'bg-amber-100', 
                    text: 'text-amber-800',
                    border: 'border-amber-300',
                    icon: '⏳'
                };
            case 'perizinan diterima':
                return { 
                    bg: 'bg-emerald-100', 
                    text: 'text-emerald-800',
                    border: 'border-emerald-300',
                    icon: '✅'
                };
            case 'sudah berada diluar pondok':
                return { 
                    bg: 'bg-blue-100', 
                    text: 'text-blue-800',
                    border: 'border-blue-300',
                    icon: '🚪'
                };
            case 'kembali tepat waktu':
                return { 
                    bg: 'bg-green-100', 
                    text: 'text-green-800',
                    border: 'border-green-300',
                    icon: '🏠'
                };
            case 'perizinan ditolak':
            case 'dibatalkan':
                return { 
                    bg: 'bg-red-100', 
                    text: 'text-red-800',
                    border: 'border-red-300',
                    icon: '❌'
                };
            case 'telat(sudah kembali)':
            case 'telat(belum kembali)':
                return { 
                    bg: 'bg-orange-100', 
                    text: 'text-orange-800',
                    border: 'border-orange-300',
                    icon: '⚠️'
                };
            default:
                return { 
                    bg: 'bg-gray-100', 
                    text: 'text-gray-800',
                    border: 'border-gray-300',
                    icon: '📋'
                };
        }
    };

    const statusConfig = getStatusConfig(data.status);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-3 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Compact Header */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    {/* <span className="text-sm">{statusConfig.icon}</span> */}
                    <span className="capitalize">{data.status}</span>
                </div>

                <div className="flex items-center gap-1">
                    {canApprove && (
                        <Access action="approve">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowApproveModal(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium"
                            >
                                <FaCheckCircle className="text-xs" />
                                <span>Approve</span>
                            </button>
                        </Access>
                    )}
                    
                    <Access action="edit">
                        {data.status == "perizinan diterima" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowKeluarModal(true)
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium"
                            >
                                <i className="fas fa-sign-out-alt text-xs"></i>
                                <span>Keluar</span>
                            </button>
                        )}
                        {data.status == "sudah berada diluar pondok" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowKembaliModal(true)
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium"
                            >
                                <i className="fas fa-sign-in-alt text-xs"></i>
                                <span>Kembali</span>
                            </button>
                        )}
                    </Access>
                    
                    <Access action="edit">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFeature(2);
                                setSelectedId(data.id);
                                setSelectedName(data.nama_santri);
                                setShowFormModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                        >
                            <i className="fas fa-edit text-xs"></i>
                            <span>Edit</span>
                        </button>
                    </Access>
                </div>
            </div>

            {/* Compact Main Content */}
            <div className="p-4" onClick={() => openModal(data)}>
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Compact Photo - Top on mobile, left on desktop */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <div className="relative">
                            <img
                                alt={data.nama_santri || "-"}
                                className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border-2 border-white"
                                src={data.foto_profil || "/placeholder.svg"}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = blankProfile;
                                }}
                            />
                            {/* <div className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white">
                                {data.jenis_kelamin === 'p' ? '♀' : '♂'}
                            </div> */}
                        </div>
                    </div>

                    {/* Compact Information */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        {/* Compact Information */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                            {/* Name and Basic Info */}
                            <div className="mb-2 flex items-center justify-center sm:justify-start gap-2">
                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                    {data.nama_santri}
                                </h3>
                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white flex-shrink-0">
                                    {data.jenis_kelamin === "p" ? "♀" : "♂"}
                                </div>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <FaSchool className="text-blue-500" />
                                    <span className="font-medium">{data.lembaga}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-green-500" />
                                    <span>{data.kamar} - {data.blok}</span>
                                </div>
                            </div>
                        </div>


                        {/* Compact Grid Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-red-500 text-xs flex-shrink-0" />
                                <span className="text-gray-600 truncate">{data.kecamatan}, {data.kabupaten}</span>
                            </div>
                            
                            {(data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (
                                <div className="flex items-center gap-1.5 justify-self-end">
                                    <FaHome className="text-green-500 text-xs flex-shrink-0" />
                                    <span className="text-green-700 font-medium text-xs">Kembali: {data.tanggal_kembali}</span>
                                </div>
                            )}
                        </div>

                        {/* Compact Permission Reason */}
                        <div className="mt-2">
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                <div className="flex items-start gap-1.5">
                                    <FaClipboardList className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <span className="font-medium text-blue-800 text-xs">Alasan:</span>
                                        <p className="text-gray-800 text-sm mt-0.5 line-clamp-2">{data.alasan_izin}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compact Destination */}
                        <div className="mt-2 text-sm">
                            <div className="flex items-start gap-1.5">
                                <i className="fas fa-map-pin text-purple-500 text-xs mt-0.5 flex-shrink-0"></i>
                                <span className="text-gray-600 truncate">
                                    <span className="font-medium">Tujuan:</span> {data.alamat_tujuan}
                                </span>
                            </div>
                        </div>

                        {/* Compact Additional Info */}
                        {data.keterangan && (
                            <div className="mt-2">
                                <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <div className="flex items-start gap-1.5">
                                        <i className="fas fa-info-circle text-yellow-600 text-xs mt-0.5 flex-shrink-0"></i>
                                        <p className="text-yellow-700 text-xs line-clamp-1">{data.keterangan}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Compact Progress Timeline */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                            <span className="text-xs text-gray-600 mt-1">Proses</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                (data.status === "perizinan ditolak" || data.status === "dibatalkan")
                                    ? 'bg-red-500 text-white'
                                    : (data.status !== "sedang proses izin")
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-300 text-gray-600'
                            }`}>
                                {(data.status === "perizinan ditolak" || data.status === "dibatalkan") ? '✗' : 
                                 (data.status !== "sedang proses izin") ? '✓' : '2'}
                            </div>
                            <span className="text-xs text-gray-600 mt-1">
                                {data.status === "dibatalkan" ? "Batal" : 
                                 data.status === "perizinan ditolak" ? "Tolak" : "Terima"}
                            </span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                (data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || 
                                 data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)")
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-600'
                            }`}>
                                {(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || 
                                  data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") ? '✓' : '3'}
                            </div>
                            <span className="text-xs text-gray-600 mt-1">Keluar</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                data.status === "kembali tepat waktu"
                                    ? 'bg-green-500 text-white'
                                    : (data.status === "telat(belum kembali)" || data.status === "telat(sudah kembali)")
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-300 text-gray-600'
                            }`}>
                                {data.status === "kembali tepat waktu" ? '✓' :
                                 (data.status === "telat(belum kembali)" || data.status === "telat(sudah kembali)") ? '!' : '4'}
                            </div>
                            <span className="text-xs text-gray-600 mt-1">Kembali</span>
                        </div>
                    </div>
                </div>

                {/* Compact Extended Toggle */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="w-full flex items-center justify-center gap-1 py-1.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-700 hover:text-gray-900 text-sm font-medium transition-all duration-200"
                    >
                        {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                        <span>{isExpanded ? 'Tutup Detail' : 'Lihat Detail'}</span>
                    </button>
                </div>

                {/* Compact Extended Information */}
                {isExpanded && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Compact Duration Info */}
                            <div className="bg-white rounded p-3 shadow-sm">
                                <h4 className="flex items-center gap-1.5 font-semibold text-gray-800 mb-2 text-sm">
                                    <FaClock className="text-blue-500 text-xs" />
                                    Durasi Izin
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mulai:</span>
                                        <span className="font-medium">{data.tanggal_mulai}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sampai:</span>
                                        <span className="font-medium">{data.tanggal_akhir}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Durasi:</span>
                                        <span className="font-medium text-purple-700">{data.lama_izin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bermalam:</span>
                                        <span className="font-medium text-indigo-700">{data.bermalam}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jenis:</span>
                                        <span className="font-medium text-orange-700">{data.jenis_izin}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Compact Approval Team */}
                            <div className="bg-white rounded p-3 shadow-sm">
                                <h4 className="flex items-center gap-1.5 font-semibold text-gray-800 mb-2 text-sm">
                                    <FaUsers className="text-emerald-500 text-xs" />
                                    Persetujuan
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Pembuat:</span>
                                        <span className="font-medium">{data.pembuat}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Biktren:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{data.nama_biktren || '-'}</span>
                                            {data.approved_by_biktren && <FaCheckCircle className="text-green-500 text-xs" />}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Pengasuh:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{data.nama_pengasuh || '-'}</span>
                                            {data.approved_by_pengasuh && <FaCheckCircle className="text-green-500 text-xs" />}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Kamtib:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{data.nama_kamtib || '-'}</span>
                                            {data.approved_by_kamtib && <FaCheckCircle className="text-green-500 text-xs" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compact Timestamps */}
                        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                            <span>Dibuat: {data.tgl_input}</span>
                            <span>Diubah: {data.tgl_update}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ModalApprove
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApprove}
                isLoading={isApproving}
                roleName={userRole}
            />
            <ModalApprove
                isOpen={showKeluarModal}
                onClose={() => setShowKeluarModal(false)}
                onConfirm={handleSetKeluar}
                isLoading={showLoadingKeluarModal}
                mode="keluar"
            />
            <ModalApprove
                isOpen={showKembaliModal}
                onClose={() => setShowKembaliModal(false)}
                onConfirm={handleSetKembali}
                isLoading={showLoadingKembaliModal}
                mode="kembali"
            />

            {approveError && (
                <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-700 p-2 rounded text-xs flex items-center gap-1">
                    <i className="fas fa-exclamation-triangle text-red-500"></i>
                    <span>Error: {approveError}</span>
                </div>
            )}
        </div>
    );
};

export default DataPerizinan;
