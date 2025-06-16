import { useState } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddOrPindahKhadamFormulir, ModalKeluarKhadamFormulir } from "../../components/modal/modal_formulir/ModalFormKhadam";
import { useKhadam } from "../../hooks/hooks_formulir/tabKhadam";
import { hasAccess } from "../../utils/hasAccess";
import Access from "../../components/Access";

const TabKhadam = () => {
    const { biodata_id } = useParams();
    const canEdit = hasAccess("edit");
    const canPindah = hasAccess("pindah");
    const canKeluar = hasAccess("keluar");
    // const [selectedKhadamData, setSelectedKhadamData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [feature, setFeature] = useState(null);

    const {
        error,
        khadamList,
        loadingKhadam,
        fetchKhadam,
        handleCardClick,
        loadingDetailKhadamId,
        selectedKhadamDetail,
        setSelectedKhadamDetail,
        selectedKhadamId,
        setSelectedKhadamId,
        startDate,
        endDate,
        keterangan,
        setStartDate,
        setEndDate,
        setKeterangan,
        handleUpdate,
        handleOpenAddModalWithDetail
    } = useKhadam({ biodata_id, setShowAddModal, setFeature });

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeOutModal = () => {
        setShowOutModal(false);
    };

    const openOutModal = (id) => {
        setSelectedKhadamId(id);
        setShowOutModal(true);
    };

    const formatDate = (dateStr) => {
        const options = { year: "numeric", month: "short", day: "2-digit" };
        return new Date(dateStr).toLocaleDateString("id-ID", options);
    };

    return (
        <div className="block" id="khadam">
            <h1 className="text-xl font-bold flex items-center justify-between">Status Khadam
                <Access action="tambah">
                    <button
                        onClick={() => {
                            setFeature(1);
                            openAddModal();
                        }}
                        type="button"
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Tambah</span>
                    </button>
                </Access>
            </h1>

            <ModalAddOrPindahKhadamFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} feature={feature} dataId={selectedKhadamId} refetchData={fetchKhadam} />

            <ModalKeluarKhadamFormulir isOpen={showOutModal} onClose={closeOutModal} id={selectedKhadamId} refetchData={fetchKhadam}/>

            <div className="mt-5 space-y-6">
                {loadingKhadam ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">{error}</p>
                            {error.includes("Akses ditolak") ? null : (
                                <button
                                    onClick={fetchKhadam}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Coba Lagi
                                </button>
                            )}
                    </div>
                ) : khadamList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : khadamList.map((khadam) => (
                    <div key={khadam.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
                            onClick={() => {
                                handleCardClick(khadam.id)
                            }}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h5 className="text-lg font-bold">{khadam.keterangan}</h5>
                                    <p className="text-gray-600 text-sm">
                                        Sejak {formatDate(khadam.tanggal_mulai)}{" "}
                                        Sampai {khadam.tanggal_akhir ? formatDate(khadam.tanggal_akhir) : "Sekarang"}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${khadam.status == 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {khadam.status == 0 ? "Nonaktif" : "Aktif"}
                                </span>
                            </div>

                            {!khadam.tanggal_akhir && (
                                <div className={`flex flex-wrap gap-2 gap-x-4 ${canPindah || canKeluar ? "" : "mt-2"}`}>
                                    <Access action="pindah">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenAddModalWithDetail(khadam.id, 2);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                            title="Pindah Khadam"
                                        >
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                        </button>
                                    </Access>
                                    <Access action="keluar">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openOutModal(khadam.id);
                                            }}
                                            className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                                            title="Keluar Khadam"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                                        </button>
                                    </Access>
                                </div>
                            )}
                        </div>

                        {loadingDetailKhadamId === khadam.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedKhadamId === khadam.id && selectedKhadamDetail && (
                            <form className="grid grid-cols-1 gap-4 mt-4">
                                <div>
                                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">
                                        Keterangan
                                    </label>
                                    <input
                                        type="text"
                                        id="keterangan"
                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKhadamDetail.status == 0 ? "bg-gray-200 text-gray-500" : ""}`}
                                        value={keterangan}
                                        maxLength={255}
                                        onChange={(e) => setKeterangan(e.target.value)}
                                        disabled={!canEdit || selectedKhadamDetail?.status == 0}
                                    />
                                </div>

                                {/* Baris 2: Tanggal Mulai dan Tanggal Akhir */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedKhadamDetail.status == 0 ? "bg-gray-200 text-gray-500" : ""}`}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            disabled={!canEdit || selectedKhadamDetail?.status == 0}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                            Tanggal Akhir
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500`}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Baris 3: Tombol */}
                                <div className="flex space-x-2 mt-1">
                                    {khadam.status == 1 && (
                                        <Access action="edit">
                                            <button
                                                type="button"
                                                className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer`}
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                        </Access>
                                    )}
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                                        onClick={() => {
                                            setSelectedKhadamId(null);
                                            setSelectedKhadamDetail(null);
                                            setStartDate("");
                                            setEndDate("");
                                        }}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>

                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabKhadam;
