import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalFormWaliAsuh, ModalFormKeluarWaliAsuh } from "../../components/modal/modal_formulir/ModalFormWaliAsuh";
import { useWaliAsuh } from "../../hooks/hooks_formulir/tabWaliAsuh";
import Access from "../../components/Access";

const TabWaliAsuh = () => {

  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [feature, setFeature] = useState(null);
  const [grupSearch, setGrupSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    error,
    waliAsuhList,
    loadingWaliAsuh,
    fetchWaliAsuh,
    handleCardClick,
    loadingDetailWaliAsuhId,
    selectedWaliAsuhDetail,
    setSelectedWaliAsuhDetail,
    selectedWaliAsuhId,
    setSelectedWaliAsuhId,
    startDate,
    endDate,
    grupWaliAsuhId,
    nis,
    setStartDate,
    setEndDate,
    setGrupWaliAsuhId,
    setNis,
    handleUpdate,
    handleOpenAddModalWithDetail,
    santriId,
    menuGrupWaliAsuh,
    loadingGrupWaliAsuh,
    errorGrupWaliAsuh,
    fetchDropdownGrup,
  } = useWaliAsuh({ biodata_id, setShowAddModal, setFeature });

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
    setSelectedWaliAsuhId(id);
    setShowOutModal(true);
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  useEffect(() => {
    if (selectedWaliAsuhDetail?.grup && menuGrupWaliAsuh.length > 0) {
      const grupTerpilih = menuGrupWaliAsuh.find(item => item.nama_grup == grupWaliAsuhId);
      if (grupTerpilih) {
        setGrupSearch(grupTerpilih.nama_grup);
      }
    }
  }, [selectedWaliAsuhDetail, menuGrupWaliAsuh]);


  const handleSelectGrup = (item) => {
    setGrupSearch(item.nama_grup);        // tampilkan nama di input
    setGrupWaliAsuhId(item.id);           // simpan ID ke state utama
    setShowDropdown(false);
  };

  const filteredGrup = menuGrupWaliAsuh.filter(item =>
    item.nama_grup.toLowerCase().includes(grupSearch.toLowerCase())
  );


  //debuging
  // console.log("menuGrupWaliAsuh", menuGrupWaliAsuh);
  // console.log("filteredGrup", filteredGrup);
  // console.log("⇨ Effect jalan:", { menuGrupWaliAsuh, grupWaliAsuhId });
  // console.log("⇨ Kirim ke ModalForm:", {
  //   showAddModal,
  //   biodata_id,
  //   santriId,
  // });


  return (
    <div className="block" id="wali-asuh">
      <h1 className="text-xl font-bold flex items-center justify-between">Wali Asuh
        <Access action={"tambah"}>
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

      <ModalFormWaliAsuh
        isOpen={showAddModal}
        onClose={closeAddModal}
        biodataId={biodata_id}
        feature={feature}
        refetchData={fetchWaliAsuh}
        santriId={santriId}
        grupWaliAsuhList={menuGrupWaliAsuh}
      />

      <ModalFormKeluarWaliAsuh
        isOpen={showOutModal}
        onClose={closeOutModal}
        id={selectedWaliAsuhId}
        refetchData={fetchWaliAsuh}
      />

      <div className="mt-5 space-y-6">
        {loadingWaliAsuh ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : error ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
            <button
              onClick={fetchWaliAsuh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : waliAsuhList.length == 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : waliAsuhList.map((waliAsuh) => (
          <div key={waliAsuh.id}>
            {/* Card */}
            <div
              className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => {
                handleCardClick(waliAsuh.id)
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">NIS: {waliAsuh.nis || '-'}</h5>
                  <p className="text-gray-600 text-sm">
                    Sejak {formatDate(waliAsuh.tanggal_mulai)}{" "}
                    Sampai {waliAsuh.tanggal_akhir ? formatDate(waliAsuh.tanggal_akhir) : "Sekarang"}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${waliAsuh.status == 1
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {waliAsuh.status == 1 ? 'Aktif' : 'Non Aktif'}
                </span>
              </div>

              {!waliAsuh.tanggal_akhir && (
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  {/* <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAddModalWithDetail(waliAsuh.id, 2);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    title="Pindah Wali Asuh"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                  </button> */}
                  <Access action={"keluar"}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOutModal(waliAsuh.id);
                      }}
                      className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                      title="Keluar Wali Asuh"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                    </button>
                  </Access>
                </div>
              )}
            </div>

            {loadingDetailWaliAsuhId == waliAsuh.id ? (
              <div className="flex justify-center items-center mt-4">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : selectedWaliAsuhId == waliAsuh.id && selectedWaliAsuhDetail && (
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
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedWaliAsuhDetail.status == 0 ? "bg-gray-200 text-gray-500" : ""}`}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={selectedWaliAsuhDetail?.status == 0}
                    />
                  </div>
                </div>

                {/* Baris 2: Grup Wali Asuh dan Tanggal Akhir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="grupWaliAsuhId" className="block text-sm font-medium text-gray-700">
                      Grup Wali Asuh *
                    </label>
                    <input
                      type="text"
                      placeholder="Grup wali asuh"
                      value={grupSearch}
                      onChange={e => {
                        setGrupSearch(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {showDropdown && grupSearch && filteredGrup.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
                        {filteredGrup.map(item => (
                          <li
                            key={item.id}
                            onClick={() => handleSelectGrup(item)}
                            className="p-2 cursor-pointer hover:bg-gray-50"
                          >
                            {item.nama_grup}
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
                  {waliAsuh.status == 1 && (
                      <Access action={"edit"}>
                        <button
                          type="button"
                          className="px-4 py-2 text-white rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
                      setSelectedWaliAsuhId(null);
                      setSelectedWaliAsuhDetail(null);
                      setStartDate("");
                      // setEndDate(""); 
                      setGrupSearch("");
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

export default TabWaliAsuh;
