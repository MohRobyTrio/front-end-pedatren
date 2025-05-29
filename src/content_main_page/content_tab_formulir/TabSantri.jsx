import { useState } from "react";
import { useParams } from "react-router-dom";
import ModalAddSantriFormulir from "../../components/modal/modal_formulir/ModalFormSantri";
import { OrbitProgress } from "react-loading-indicators";
import { useSantri } from "../../hooks/hooks_formulir/tabSantri";

const TabSantri = () => {
    const { biodata_id } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        error,
        fetchSantri,
        santriList,
        selectedSantriId,
        selectedSantriDetail,
        endDate,
        startDate,
        loadingSantri,
        loadingDetailSantri,
        setEndDate,
        setStartDate,
        setSelectedSantriDetail,
        setSelectedSantriId,
        handleCardClick,
        handleUpdate,
    } = useSantri(biodata_id);

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    return (
        <div className="block" id="santri">
            <h1 className="text-xl font-bold flex items-center justify-between">Status Santri
                <button
                    onClick={openAddModal}
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    <i className="fas fa-plus"></i>
                    <span>Tambah Data</span>
                </button>
            </h1>

            <ModalAddSantriFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} refetchData={fetchSantri} />
            
            <div className="mt-5 space-y-6">
                {loadingSantri ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={fetchSantri}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : santriList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : santriList.map((santri) => (
                    <div key={santri.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                            onClick={() => handleCardClick(santri.id)}
                        >
                            <div>
                                <h5 className="text-lg font-bold">{santri.nis}</h5>
                                <p className="text-gray-600 text-sm">
                                    Sejak {formatDate(santri.tanggal_masuk)}{" "}
                                    Sampai {santri.tanggal_keluar ? formatDate(santri.tanggal_keluar) : "Sekarang"}
                                </p>
                            </div>
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${santri.status === "aktif"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {capitalizeFirst(santri.status)}
                            </span>
                        </div>

                        {/* Form Input */}
                        {loadingDetailSantri === santri.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedSantriId === santri.id && selectedSantriDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                        Nomor Induk Santri
                                    </label>
                                    <input
                                        type="text"
                                        id="nis"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                        value={selectedSantriDetail.nis}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer`}
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                                            onClick={() => {
                                                setSelectedSantriId(null);
                                                setSelectedSantriDetail(null);
                                                setStartDate("");
                                                setEndDate("");
                                            }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </form>

                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Format tanggal ke ID
const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
};

// Kapitalisasi huruf pertama
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default TabSantri;
