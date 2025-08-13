import { useEffect, useMemo, useState } from "react";
import useFetchPelanggaran from "../../hooks/hook_menu_kepesantrenan/pelanggaran";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Pagination from "../../components/Pagination";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import ModalDetail from "../../components/modal/ModalDetail";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FaFileExport, FaPlus, FaMapMarkerAlt, FaSchool, FaClipboardList, FaUsers, FaGavel, FaCalendarAlt } from "react-icons/fa";
import { ModalAddPelanggaran } from "../../components/modal/ModalFormPelanggaran";
import Access from "../../components/Access";
import { ModalExport } from "../../components/modal/ModalExport";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";

const DataPelanggaran = () => {
    const [openModalExport, setOpenModalExport] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feature, setFeature] = useState("");

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const [filters, setFilters] = useState({
        provinsi: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenis_pelanggaran: "",
        status_pelanggaran: ""
    });

    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.nama || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";
    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih,
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih
    }), [blokTerpilih, filters, jurusanTerpilih, kamarTerpilih, kelasTerpilih, lembagaTerpilih, rombelTerpilih, wilayahTerpilih]);

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
    } = useFetchPelanggaran(updatedFilters);

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
        status_pelanggaran: [
            { label: "Pilih Status Pelanggaran", value: "" },
            { label: "Sudah diproses", value: "Sudah diproses" },
            { label: "Sedang diproses", value: "Sedang diproses" },
            { label: "Belum diproses", value: "Belum diproses" }
        ],
        jenis_putusan: [
            { label: "Pilih Jenis Putusan", value: "" },
            { label: "Belum ada putusan", value: "Belum ada putusan" },
            { label: "Disanksi", value: "Disanksi" },
            { label: "Dibebaskan", value: "Dibebaskan" }
        ],
        jenis_pelanggaran: [
            { label: "Pilih Jenis Pelanggaran", value: "" },
            { label: "Ringan", value: "Ringan" },
            { label: "Sedang", value: "Sedang" },
            { label: "Berat", value: "Berat" }
        ]
    }

    const [showFormModal, setShowFormModal] = useState(false);
    const fieldsExports = [];

    if (!hasAccess("pelanggaran")) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
                <div className="flex items-center space-x-2">
                    <Access action="tambah">
                        <button onClick={() => {
                            setFeature(1);
                            setShowFormModal(true);
                        }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
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

            <ModalAddPelanggaran isOpen={showFormModal} onClose={() => setShowFormModal(false)} refetchData={fetchData} feature={feature} id={selectedId} nama={selectedName} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
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
                                {data.map(pelanggaran => (
                                    <PelanggaranCard key={pelanggaran.id} data={pelanggaran} openModal={openModal} setShowFormModal={setShowFormModal} setFeature={setFeature} setSelectedId={setSelectedId} setSelectedName={setSelectedName} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data pelanggaran</p>
                        )}
                    </div>
                </div>

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/pelanggaran" />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    className="mt-6"
                />

                {isModalOpen && (
                    <ModalDetail
                        title="Pelanggaran"
                        menu={18}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

// Clean and Informative Pelanggaran Card Component
const PelanggaranCard = ({ data, openModal, setShowFormModal, setFeature, setSelectedId, setSelectedName }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Sudah diproses':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-300'
                };
            case 'Sedang diproses':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-800',
                    border: 'border-blue-300'
                };
            case 'Belum diproses':
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300'
                };
        }
    };

    const getSeverityColor = (jenis) => {
        switch (jenis) {
            case 'Berat': return 'text-red-600 bg-red-50 border-red-200';
            case 'Sedang': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Ringan': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const statusConfig = getStatusConfig(data.status_pelanggaran);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Simple Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    {data.status_pelanggaran}
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(data.jenis_pelanggaran)}`}>
                        {data.jenis_pelanggaran}
                    </span>
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

            {/* Main Content */}
            <div className="p-4" onClick={() => openModal(data)}>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Photo Section */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                        <img
                            alt={data.nama_santri || "-"}
                            className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border-2 border-white"
                            src={data.foto_profil || "/placeholder.svg"}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = blankProfile;
                            }}
                        />
                    </div>

                    {/* Information Section */}
                    <div className="flex-1 min-w-0">
                        {/* Student Name */}
                        <h3 className="text-lg text-center sm:text-left font-bold text-gray-900 mb-3">{data.nama_santri}</h3>
                        {/* Name and Basic Info */}
                        {/* <div className="mb-2 flex items-center justify-center sm:justify-start gap-2">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                {data.nama_santri}
                            </h3>
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white flex-shrink-0">
                                {data.jenis_kelamin === "p" ? "♀" : "♂"}
                            </div>
                        </div> */}

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-2 text-sm">
                                {/* Domisili */}
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-green-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[70px]">Domisili</span>
                                    <span className="font-medium text-gray-800">
                                        : {data.wilayah} - {data.blok} {data.kamar}
                                    </span>
                                </div>

                                {/* Lembaga */}
                                <div className="flex items-center gap-2">
                                    <FaSchool className="text-blue-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[70px]">Lembaga</span>
                                    <span className="font-medium text-gray-800">: {data.lembaga}</span>
                                </div>

                                {/* Alamat */}
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-red-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[70px]">Alamat</span>
                                    <span className="font-medium text-gray-800">
                                        : {data.kabupaten}, {data.provinsi}
                                    </span>
                                </div>
                            </div>


                            {/* Right Column */}
                            <div className="space-y-2 text-sm">
                                {/* Mahkamah */}
                                <div className="flex items-center gap-2">
                                    <FaGavel className="text-indigo-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Mahkamah</span>
                                    {data.diproses_mahkamah ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            : Ya <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xs" />
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium flex items-center gap-1">
                                            : Tidak <FontAwesomeIcon icon={faX} className="text-red-600 text-xs" />
                                        </span>
                                    )}
                                </div>

                                {/* Tanggal */}
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Tanggal</span>
                                    <span className="font-medium text-gray-800">: {data.tgl_input}</span>
                                </div>

                                {/* Pencatat */}
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-purple-500 text-sm flex-shrink-0" />
                                    <span className="text-gray-600 min-w-[80px]">Pencatat</span>
                                    <span className="font-medium text-gray-800">: {data.pencatat}</span>
                                </div>
                            </div>
                        </div>

                        {/* Keterangan Section */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2">
                                <FaClipboardList className="text-gray-600 text-sm mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <span className="text-gray-600 text-sm font-medium block mb-1">Keterangan Pelanggaran:</span>
                                    <p className="text-gray-800 text-sm leading-relaxed">{data.keterangan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPelanggaran;
