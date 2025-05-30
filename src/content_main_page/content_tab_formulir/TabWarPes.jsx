import { useState } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { useWarPes } from "../../hooks/hooks_formulir/tabWarPes";
import ModalAddWarPesFormulir from "../../components/modal/modal_formulir/ModalFormWarpes";

const TabWarPes = () => {
    const { biodata_id } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        error,
        fetchWarPes,
        niup,
        setNiup,
        aktif,
        setAktif,
        warPesList,
        selectedWarPesId,
        selectedWarPesDetail,
        loadingWarPes,
        loadingDetailWarPes,
        setEndDate,
        setStartDate,
        setSelectedWarPesDetail,
        setSelectedWarPesId,
        handleCardClick,
        handleUpdate,
    } = useWarPes(biodata_id);

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    return (
        <div className="block" id="warPes">
            <h1 className="text-xl font-bold flex items-center justify-between">Warga Pesantren
                <button
                    onClick={openAddModal}
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    <i className="fas fa-plus"></i>
                    <span>Tambah Data</span>
                </button>
            </h1>

            <ModalAddWarPesFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} refetchData={fetchWarPes} />

            <div className="mt-5 space-y-6">
                {loadingWarPes ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={fetchWarPes}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : warPesList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : warPesList.map((warPes) => (
                    <div key={warPes.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                            onClick={() => handleCardClick(warPes.id)}
                        >
                            <div>
                                <h5 className="text-lg font-bold">{warPes.niup}</h5>
                            </div>
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${warPes.status
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {warPes.status ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>

                        {/* Form Input */}
                        {loadingDetailWarPes === warPes.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedWarPesId === warPes.id && selectedWarPesDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {/* NIUP */}
                                <div className="col-span-3 flex items-center">
                                    <label htmlFor="niup" className="w-1/8 text-sm font-medium text-gray-700">
                                        NIUP
                                    </label>
                                    <input
                                        type="text"
                                        id="niup"
                                        className="w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                        value={niup}
                                        onChange={(e) => setNiup(e.target.value)}
                                        disabled
                                    />
                                </div>

                                {/* Aktif */}
                                <div className="col-span-3 flex items-center">
                                    <label className="w-1/8 text-sm font-medium text-gray-700">
                                        Aktif
                                    </label>
                                    <div className="w-1/3 flex space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="aktif"
                                                value="true"
                                                className="form-radio text-blue-500 focus:ring-blue-500"
                                                checked={aktif === true}
                                                onChange={() => setAktif(true)}
                                            />
                                            <span className="ml-2 text-gray-700">Ya</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="aktif"
                                                value="false"
                                                checked={aktif === false}
                                                onChange={() => setAktif(false)}
                                                className="form-radio text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-gray-700">Tidak</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Tombol */}
                                <div className="flex items-center">
                                    <div className="w-2/3 flex space-x-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                                            onClick={() => {
                                                setSelectedWarPesId(null);
                                                setSelectedWarPesDetail(null);
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

export default TabWarPes;
