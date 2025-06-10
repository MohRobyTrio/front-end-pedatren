import { useState } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { useTabKeluarga } from "../../hooks/hooks_formulir/tabKeluarga";
// import Access from "../../components/Access";
import { hasAccess } from "../../utils/hasAccess";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ModalAddOrangtuaFormulir, ModalFormPindahKeluarga } from "../../components/modal/modal_formulir/ModalAddOrangtua";
import Access from "../../components/Access";

const TabKeluarga = () => {
    const { biodata_id } = useParams();
    const canEdit = hasAccess("edit");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPindahModal, setShowPindahModal] = useState(false);

    const {
        error,
        nokk,
        keluargaList,
        id1,
        loadingKeluarga,
        selectedKeluargaId,
        setSelectedKeluargaId,
        selectedKeluargaDetail,
        setSelectedKeluargaDetail,
        loadingDetailKeluargaId,
        nomorkk,
        hubungan,
        setNomorkk,
        setHubungan,
        fetchKeluargaList,
        handleCardClick,
        handleUpdate,
        setShowAddModal: setShowAddModalHook,
        setFeature
    } = useTabKeluarga({ biodata_id });

    // const closeAddModal = () => {
    //     setShowAddModal(false);
    // };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const openPindahModal = (id) => {
        setSelectedKeluargaId(id);
        setShowPindahModal(true);
    };



    return (
        <div className="block" id="keluarga">
            <h1 className="text-xl font-bold flex items-center justify-between">
                Relasi Keluarga
                <Access action={"tambah"}>
                    <button
                        onClick={openAddModal}
                        type="button"
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Tambah</span>
                    </button>
                </Access>
            </h1>

            <ModalAddOrangtuaFormulir
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                refetchData={fetchKeluargaList}
            />
            <ModalFormPindahKeluarga
                isOpen={showPindahModal}
                onClose={() => setShowPindahModal(false)}
                id={id1}
                refetchData={fetchKeluargaList}
            />
            <br />
            {/* <div className="bg-white shadow-md drop-shadow rounded-lg p-4 w-100 flex justify-between items-center">
                <h2 className="text-md font-bold">
                    No.KK {nokk || '-'}
                </h2>
                <button
                    type="button"
                    onClick={openPindahModal}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer "
                    title="Pindah Pendidikan"
                >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah Nomor KK
                </button>
            </div> */}

            <div className="mt-5 space-y-6">
                {loadingKeluarga ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={fetchKeluargaList}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : keluargaList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data keluarga</p>
                ) : (
                    <>
                        <div className="bg-white shadow-md drop-shadow rounded-lg p-4 w-fit flex justify-between items-center gap-2">
                            <h2 className="text-md font-bold">
                                No.KK {nokk || '-'}
                            </h2>
                            {/* {sementara tidak dibutuhkan} */}
                            {/* <button
                                type="button"
                                onClick={openPindahModal}
                                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer "
                                title="Pindah Pendidikan"
                            >
                                <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah Nomor KK
                            </button> */}
                        </div>
                        {keluargaList.filter(keluarga => !keluarga.is_selected).map((keluarga) => (
                            <div key={keluarga.id_keluarga}>
                                <div
                                    className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                                    onClick={() => handleCardClick(keluarga.id_keluarga)}
                                >
                                    <div>
                                        <h5 className="text-lg font-bold">{keluarga.nama}</h5>
                                        <p className="text-gray-600 text-sm">
                                            {keluarga.nik} - {keluarga.status_keluarga}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${keluarga.sebagai_wali === 1
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {keluarga.sebagai_wali === 1 ? "Sebagai Wali" : ""}
                                    </span>
                                </div>

                                {loadingDetailKeluargaId === keluarga.id_keluarga ? (
                                    <div className="flex justify-center items-center mt-4">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : selectedKeluargaId === keluarga.id_keluarga && selectedKeluargaDetail && (
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md rounded-lg p-6">
                                        <div className="flex gap-4">
                                            <div className="w-full">
                                                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                                    Nama
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nama"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                                    value={selectedKeluargaDetail.nama}
                                                    disabled
                                                />
                                            </div>

                                            {/* <div>
                                            <label htmlFor="nik" className="block text-sm font-medium text-gray-700">
                                                NIK
                                            </label>
                                            <input
                                                type="text"
                                                id="nik"
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                                value={selectedKeluargaDetail.nik}
                                                disabled
                                            />
                                        </div> */}

                                            {/* <div>
                                            <label htmlFor="nomorkk" className="block text-sm font-medium text-gray-700">
                                                Nomor KK
                                            </label>
                                            <input
                                                type="text"
                                                id="nomorkk"
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit ? "bg-gray-200 text-gray-500" : ""}`}
                                                value={nomorkk}
                                                onChange={(e) => setNomorkk(e.target.value)}
                                                disabled={!canEdit}
                                            />
                                        </div> */}

                                            <div className="w-xs">
                                                <label htmlFor="hubungan" className="block text-sm font-medium text-gray-700">
                                                    Hubungan
                                                </label>
                                                <input
                                                    type="text"
                                                    id="hubungan"
                                                    className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit ? "bg-gray-200 text-gray-500" : ""}`}
                                                    value={hubungan ?? "Saudara"}
                                                    onChange={(e) => setHubungan(e.target.value)}
                                                    disabled
                                                />
                                                {/* <select
                                                id="hubungan"
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit ? "bg-gray-200 text-gray-500" : ""}`}
                                                value={hubungan}
                                                onChange={(e) => setHubungan(e.target.value)}
                                                disabled={!canEdit}
                                                >
                                                <option value="ayah kandung">Ayah Kandung</option>
                                                <option value="ibu kandung">Ibu Kandung</option>
                                                <option value="saudara kandung">Saudara kandung</option>
                                                <option value="null">Lainnya</option>
                                                </select> */}
                                            </div>
                                        </div>

                                        {/* <div className="col-span-2">
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedKeluargaDetail.is_wali}
                                                    className="text-blue-600 focus:ring-blue-500"
                                                    disabled={!canEdit}
                                                />
                                                <span className="ml-2 text-gray-700">Sebagai Wali</span>
                                            </label>
                                        </div>
                                    </div> */}

                                        <div className="col-span-2">
                                            <div className="flex space-x-2 mt-1">
                                                <Link to={`/formulir/${selectedKeluargaDetail.biodata_id}/biodata`}>
                                                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                                                        Buka di Formulir
                                                    </button>
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedKeluargaId(null);
                                                        setSelectedKeluargaDetail(null);
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
                    </>
                )}
            </div>
        </div>
    );
};

export default TabKeluarga;