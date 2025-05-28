import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddPengurusFormulir, ModalKeluarPengurusFormulir } from "../../components/modal/modal_formulir/ModalFormPengurus";
import useDropdownGolonganJabatan from "../../hooks/hook_dropdown/DropdownGolonganJabatan";
import useDropdownSatuanKerja from "../../hooks/hook_dropdown/DropdownSatuanKerja";

const TabPengurus = () => {
  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [pengurusList, setPengurusList] = useState([]);
  const [selectedPengurusId, setSelectedPengurusId] = useState(null);
  const [selectedPengurusDetail, setSelectedPengurusDetail] = useState(null);
  const [keteranganJabatan, setKeteranganJabatan] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [jabatanKontrak, setJabatanKontrak] = useState("");
  const [feature, setFeature] = useState(null);

  const [loadingPengurus, setLoadingPengurus] = useState(true);
  const [loadingDetailPengurus, setLoadingDetailPengurus] = useState(null);
  const [loadingUpdatePengurus, setLoadingUpdatePengurus] = useState(false);

  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState("");
  const [selectedGolonganJabatanId, setSelectedGolonganJabatanId] = useState("");

  const { menuGolonganJabatan } = useDropdownGolonganJabatan();
  const { menuSatuanKerja } = useDropdownSatuanKerja();

  // Dropdown hooks
  // const {
  //   filterOptions: filterSatuanKerja,
  //   handleFilterChange: handleSatuanKerjaChange,
  //   selectedFilters: selectedSatuanKerja,
  //   setSelectedFilters: setSelectedSatuanKerja
  // } = useDropdownSatuanKerja();

  // const {
  //   filterOptions: filterGolonganJabatan,
  //   handleFilterChange: handleGolonganJabatanChange,
  //   selectedFilters: selectedGolonganJabatan,
  //   setSelectedFilters: setSelectedGolonganJabatan
  // } = useDropdownGolonganJabatan();

  const fetchPengurus = useCallback(async () => {
    const token = sessionStorage.getItem("token") || getCookie("token");
    if (!biodata_id || !token) return;
    try {
      setLoadingPengurus(true);
      const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/pengurus`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setPengurusList(result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data Pengurus:", error);
    } finally {
      setLoadingPengurus(false);
    }
  }, [biodata_id]);

  useEffect(() => {
    fetchPengurus();
  }, [fetchPengurus]);

  const handleCardClick = async (id) => {
    try {
      setLoadingDetailPengurus(id);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/pengurus/show`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      setSelectedPengurusId(id);
      setSelectedPengurusDetail(result.data);
      setKeteranganJabatan(result.data.keterangan_jabatan || "");
      setEndDate(result.data.tanggal_keluar || "");
      setStartDate(result.data.tanggal_masuk || "");
      setStatus(result.data.status || "");
      setJabatanKontrak(result.data.jabatan_kontrak || "");

      setSelectedSatuanKerja(result.data.satuan_kerja || "");
      setSelectedGolonganJabatanId(result.data.golongan_jabatan_id || "");

      console.log("Detail Pengurus:", result.data);

    } catch (error) {
      console.error("Gagal mengambil detail Pengurus:", error);
    } finally {
      setLoadingDetailPengurus(null);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPengurusDetail) return;

    const payload = {
      keterangan_jabatan: keteranganJabatan,
      satuan_kerja: selectedSatuanKerja,
      golongan_jabatan_id: selectedGolonganJabatanId,
      jabatan: jabatanKontrak,
      tanggal_mulai: startDate,
      tanggal_akhir: endDate || null,
      status: status || null
    };

    if (!payload.satuan_kerja || !keteranganJabatan || !startDate) {
      alert("Satuan Kerja, Keterangan Jabatan, dan Tanggal Mulai wajib diisi");
      return;
    }

    try {
      setLoadingUpdatePengurus(true);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(
        `${API_BASE_URL}formulir/${selectedPengurusId}/pengurus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert(`Data pengurus berhasil diperbarui!`);
        setSelectedPengurusDetail(result.data || payload);
        fetchPengurus();
      } else {
        alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error saat update:", error);
    } finally {
      setLoadingUpdatePengurus(false);
    }
  };

  // debuging logs
  // console.log("menuGolonganJabatan", menuGolonganJabatan);
  // console.log("selectedGolonganJabatanId", selectedGolonganJabatanId);
  // console.log(
  //   "matching option:",
  //   menuGolonganJabatan.find((opt) => String(opt.id) === String(selectedGolonganJabatanId))
  // );

  // console.log("selectedPengurusId:", selectedPengurusId);




  const closeAddModal = () => setShowAddModal(false);
  const openAddModal = () => setShowAddModal(true);
  const closeOutModal = () => setShowOutModal(false);

  return (
    <div className="block" id="Pengurus">
      <h1 className="text-xl font-bold flex items-center justify-between">
        Pengurus
        <button
          onClick={() => {
            setFeature(1);
            openAddModal();
          }}
          type="button"
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
        >
          <i className="fas fa-plus"></i>
          <span>Tambah Data</span>
        </button>
      </h1>

      {showAddModal && (
        <ModalAddPengurusFormulir
          isOpen={showAddModal}
          onClose={closeAddModal}
          biodataId={biodata_id}
          refetchData={fetchPengurus}
          feature={feature}
          cardId={selectedPengurusId}
        />
      )}

      {showOutModal && (
        <ModalKeluarPengurusFormulir
          isOpen={showOutModal}
          onClose={closeOutModal}
          id={selectedPengurusId}
          refetchData={fetchPengurus}
        />
      )}

      <div className="mt-5 space-y-6">
        {loadingPengurus ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : pengurusList.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : pengurusList.map((pengurus) => (
          <div key={pengurus.id}>
            <div
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => handleCardClick(pengurus.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">{pengurus.keterangan_jabatan} {pengurus.satuan_kerja}</h5>
                  {/* <p className="text-gray-600 text-sm">Satuan Kerja: {pengurus.satuan_kerja || '-'}</p> */}
                  <p className="text-gray-600 text-sm">
                    {pengurus.jabatan_kontrak && pengurus.golongan_jabatan
                      ? `${pengurus.jabatan_kontrak} | ${pengurus.golongan_jabatan}`
                      : pengurus.jabatan_kontrak || pengurus.golongan_jabatan || '-'}
                  </p>
                  {/* <p className="text-gray-600 text-sm">Golongan: {pengurus.golongan_jabatan || '-'}</p> */}
                  <p className="text-gray-600 text-sm">
                    Periode: {formatDate(pengurus.tanggal_masuk)}
                    {pengurus.tanggal_keluar ? ` s/d ${formatDate(pengurus.tanggal_keluar)}` : ' - Sekarang'}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${pengurus.status === "aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {pengurus.status === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {!pengurus.tanggal_keluar && (
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeature(2);
                      openAddModal();
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    title="Pindah Jabatan"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOutModal(true);
                    }}
                    className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                    title="Keluar Jabatan"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                  </button>
                </div>
              )}
            </div>

            {loadingDetailPengurus === pengurus.id ? (
              <div className="flex justify-center items-center mt-4">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : selectedPengurusId === pengurus.id && selectedPengurusDetail && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Satuan Kerja *</label>
                    <select
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPengurusDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500" : ""
                        }`}
                      // onChange={(e) => handleSatuanKerjaChange({ satuan_kerja: e.target.value })}
                      value={selectedSatuanKerja || ""}
                      onChange={(e) => setSelectedSatuanKerja(e.target.value)}
                      disabled={selectedPengurusDetail?.status !== "aktif"}
                    >
                      {menuSatuanKerja.map((option, idx) => (
                        <option key={idx} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="keteranganJabatan" className="block text-sm font-medium text-gray-700">
                      Keterangan Jabatan *
                    </label>
                    <input
                      type="text"
                      id="keteranganJabatan"
                      value={keteranganJabatan}
                      onChange={(e) => setKeteranganJabatan(e.target.value)}
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPengurusDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500" : ""
                        }`}
                      disabled={selectedPengurusDetail?.status !== "aktif"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Golongan Jabatan *</label>
                    <select
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPengurusDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500" : ""
                        }`}
                      // onChange={(e) => handleGolonganJabatanChange({ golongan_jabatan: e.target.value })}
                      value={selectedGolonganJabatanId || ""}
                      onChange={(e) => setSelectedGolonganJabatanId(e.target.value)}
                      disabled={selectedPengurusDetail?.status !== "aktif"}
                    >
                      {menuGolonganJabatan.map((option, idx) => (
                        <option key={idx} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-4">

                  <div>
                    <label htmlFor="jabatanKontrak" className="block text-sm font-medium text-gray-700">
                      Jenis Kontrak
                    </label>
                    <select
                      id="jabatanKontrak"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPengurusDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500" : ""
                        }`}
                      value={jabatanKontrak}
                      onChange={(e) => setJabatanKontrak(e.target.value)}
                      disabled={selectedPengurusDetail?.status !== "aktif"}
                    >
                      <option value="">Pilih Jenis Kontrak</option>
                      <option value="kultural">Kultural</option>
                      <option value="tetap">Tetap</option>
                      <option value="kontrak">Kontrak</option>
                      <option value="pengkaderan">Pengkaderan</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPengurusDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500" : ""
                        }`}
                      disabled={selectedPengurusDetail?.status !== "aktif"}
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
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="flex space-x-2">
                    {selectedPengurusDetail?.status === "aktif" && (
                      <button
                        type="button"
                        disabled={loadingUpdatePengurus}
                        className={`px-4 py-2 text-white rounded-lg ${loadingUpdatePengurus
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          }`}
                        onClick={handleUpdate}
                      >
                        {loadingUpdatePengurus ? (
                          <i className="fas fa-spinner fa-spin text-2xl text-white w-13"></i>
                        ) : "Update"}
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                      onClick={() => {
                        setSelectedPengurusId(null);
                        setSelectedPengurusDetail(null);
                        setKeteranganJabatan("");
                        setStartDate("");
                        setEndDate("");
                        setStatus("");
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

export default TabPengurus;