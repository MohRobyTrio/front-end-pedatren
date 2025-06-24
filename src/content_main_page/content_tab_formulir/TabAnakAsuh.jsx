import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket,faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ModalFormAnakAsuh, ModalFormKeluarAnakAsuh } from "../../components/modal/modal_formulir/ModalFormAnakAsuh";
import { useAnakAsuh } from "../../hooks/hooks_formulir/tabAnakAsuh";
import Access from "../../components/Access";

const TabAnakAsuh = () => {
  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [feature, setFeature] = useState(null);
  const [waliSearch, setWaliSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    error,
    anakAsuhList,
    loadingAnakAsuh,
    fetchAnakAsuh,
    handleCardClick,
    loadingDetailAnakAsuhId,
    selectedAnakAsuhDetail,
    setSelectedAnakAsuhDetail,
    selectedAnakAsuhId,
    setSelectedAnakAsuhId,
    startDate,
    endDate,
    waliAsuhId,
    nis,
    setStartDate,
    setEndDate,
    setWaliAsuhId,
    setNis,
    handleUpdate,
    handleOpenAddModalWithDetail,
    santriId,
    menuWaliAsuh,
    loadingWaliAsuh,
    errorWaliAsuh,
    fetchDropdownWali,
  } = useAnakAsuh({ biodata_id, setShowAddModal, setFeature });

  const closeAddModal = () => setShowAddModal(false);
  const openAddModal = () => setShowAddModal(true);
  const closeOutModal = () => setShowOutModal(false);
  const openOutModal = (id) => {
    setSelectedAnakAsuhId(id);
    setShowOutModal(true);
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    if (selectedAnakAsuhDetail?.wali_asuh && menuWaliAsuh.length > 0) {
      const waliTerpilih = menuWaliAsuh.find(item => item.id == waliAsuhId);
      if (waliTerpilih) {
        setWaliSearch(waliTerpilih.nama);
      }
    }
  }, [selectedAnakAsuhDetail, menuWaliAsuh]);

  const handleSelectWali = (item) => {
    setWaliSearch(item.nama);
    setWaliAsuhId(item.id);
    setShowDropdown(false);
  };

  const filteredWali = menuWaliAsuh.filter(item =>
    item.nama.toLowerCase().includes(waliSearch.toLowerCase())
  );

  console.log(anakAsuhList.map(a => a.id));

  return (
    <div className="block" id="anak-asuh">
      <h1 className="text-xl font-bold flex items-center justify-between">Anak Asuh
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

      <ModalFormAnakAsuh
        isOpen={showAddModal}
        onClose={closeAddModal}
        biodataId={biodata_id}
        feature={feature}
        refetchData={fetchAnakAsuh}
        santriId={santriId}
        waliAsuhList={menuWaliAsuh}
        dataId={selectedAnakAsuhId}
      />

      <ModalFormKeluarAnakAsuh
        isOpen={showOutModal}
        onClose={closeOutModal}
        id={selectedAnakAsuhId}
        refetchData={fetchAnakAsuh}
      />

      <div className="mt-5 space-y-6">
        {loadingAnakAsuh ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : error ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
            <button
              onClick={fetchAnakAsuh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : anakAsuhList.length == 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : anakAsuhList.map((anakAsuh) => (
          <div key={anakAsuh.id}>
            {/* Card */}
            <div
              className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => {
                handleCardClick(anakAsuh.id)
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">NIS: {anakAsuh.nis || '-'}</h5>
                  <p className="text-gray-600 text-sm">
                    Sejak {formatDate(anakAsuh.tanggal_mulai)}{" "}
                    Sampai {anakAsuh.tanggal_akhir ? formatDate(anakAsuh.tanggal_akhir) : "Sekarang"}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${anakAsuh.tanggal_akhir
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                    }`}
                >
                  {anakAsuh.tanggal_akhir ? 'Non Aktif' : 'Aktif'}
                </span>
              </div>

              {!anakAsuh.tanggal_akhir && (
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  <Access action="pindah">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddModalWithDetail(anakAsuh.id, 2);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      title="Pindah Anak Asuh"
                    >
                      <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                    </button>
                  </Access>
                  <Access action="keluar">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOutModal(anakAsuh.id);
                      }}
                      className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                      title="Keluar Anak Asuh"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                    </button>
                  </Access>
                </div>
              )}
            </div>

            {loadingDetailAnakAsuhId == anakAsuh.id ? (
              <div className="flex justify-center items-center mt-4">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : selectedAnakAsuhId == anakAsuh.id && selectedAnakAsuhDetail && (
              <form className="grid grid-cols-1 gap-4 mt-4">
                {/* Baris 1: NIS dan Tanggal Mulai */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                      NIS
                    </label>
                    <input
                      type="text"
                      id="nis"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                      value={nis || '-'}
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
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedAnakAsuhDetail.status == 0 ? "bg-gray-200 text-gray-500" : ""}`}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={selectedAnakAsuhDetail?.status == 0}
                    />
                  </div>
                </div>

                {/* Baris 2: Wali Asuh dan Tanggal Akhir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="waliAsuhId" className="block text-sm font-medium text-gray-700">
                      Wali Asuh *
                    </label>
                    <input
                      type="text"
                      placeholder="Wali asuh"
                      value={waliSearch}
                      onChange={e => {
                        setWaliSearch(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {showDropdown && waliSearch && filteredWali.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
                        {filteredWali.map(item => (
                          <li
                            key={item.id}
                            onClick={() => handleSelectWali(item)}
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            {item.nama}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                      value={endDate}
                      disabled
                    />
                  </div>
                </div>

                {/* Baris 3: Tombol */}
                <div className="flex space-x-2 mt-1">
                  {!anakAsuh.tanggal_akhir && (
                      <Access action="edit">
                        <button
                          type="button"
                          className="px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
                      setSelectedAnakAsuhId(null);
                      setSelectedAnakAsuhDetail(null);
                      setStartDate("");
                      setWaliSearch("");
                      setShowDropdown(false);
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

export default TabAnakAsuh;