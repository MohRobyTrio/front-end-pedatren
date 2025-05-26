import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddPendidikanFormulir, ModalKeluarPendidikanFormulir } from "../../components/modal/modal_formulir/ModalFormPendidikan";

const TabPendidikan = () => {
  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [pendidikanList, setPendidikanList] = useState([]);
  const [selectedPendidikanId, setSelectedPendidikanId] = useState(null);
  const [selectedPendidikanDetail, setSelectedPendidikanDetail] = useState(null);
  const [noInduk, setNoInduk] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [feature, setFeature] = useState(null);

  const [loadingPendidikan, setLoadingPendidikan] = useState(true);
  const [loadingDetailPendidikan, setLoadingDetailPendidikan] = useState(null);
  const [loadingUpdatePendidikan, setLoadingUpdatePendidikan] = useState(false);

  const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();

  // Ubah label index ke-0 menjadi "Pilih ..."
  const updateFirstOptionLabel = (list, label) =>
    list.length > 0
      ? [{ ...list[0], label }, ...list.slice(1)]
      : list;

  // Buat versi baru filterLembaga yang labelnya diubah
  const updatedFilterLembaga = {
    lembaga: updateFirstOptionLabel(filterLembaga.lembaga, "Pilih Lembaga"),
    jurusan: updateFirstOptionLabel(filterLembaga.jurusan, "Pilih Jurusan"),
    kelas: updateFirstOptionLabel(filterLembaga.kelas, "Pilih Kelas"),
    rombel: updateFirstOptionLabel(filterLembaga.rombel, "Pilih Rombel"),
  };

  const fetchPendidikan = useCallback(async () => {
    const token = sessionStorage.getItem("token") || getCookie("token");
    if (!biodata_id || !token) return;
    try {
      setLoadingPendidikan(true);
      const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/pendidikan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setPendidikanList(result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data Pendidikan:", error);
    } finally {
      setLoadingPendidikan(false);
    }
  }, [biodata_id]);

  useEffect(() => {
    fetchPendidikan();
  }, [fetchPendidikan]);

  useEffect(() => {
    if (selectedPendidikanDetail) {
      if (selectedPendidikanDetail.lembaga_id) {
        handleFilterChangeLembaga({ lembaga: selectedPendidikanDetail.lembaga_id });
      }
      if (selectedPendidikanDetail.jurusan_id) {
        handleFilterChangeLembaga({ jurusan: selectedPendidikanDetail.jurusan_id });
      }
      if (selectedPendidikanDetail.kelas_id) {
        handleFilterChangeLembaga({ kelas: selectedPendidikanDetail.kelas_id });
      }
      if (selectedPendidikanDetail.rombel_id) {
        handleFilterChangeLembaga({ rombel: selectedPendidikanDetail.rombel_id });
      }
    }
  }, [selectedPendidikanDetail]);

  const handleCardClick = async (id) => {
    try {
      setLoadingDetailPendidikan(id);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/pendidikan/show`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      setSelectedPendidikanId(id);
      setSelectedPendidikanDetail(result.data);
      setNoInduk(result.data.no_induk || "");
      setEndDate(result.data.tanggal_keluar || "");
      setStartDate(result.data.tanggal_masuk || "");
      setStatus(result.data.status || "");
    } catch (error) {
      console.error("Gagal mengambil detail Pendidikan:", error);
    } finally {
      setLoadingDetailPendidikan(null);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPendidikanDetail) return;

    const { lembaga, jurusan, kelas, rombel } = selectedLembaga;

    if (!lembaga || !noInduk || !startDate) {
      alert("Lembaga, Nomor Induk, dan Tanggal Mulai wajib diisi");
      return;
    }

    const payload = {
      lembaga_id: lembaga,
      jurusan_id: jurusan || null,
      kelas_id: kelas || null,
      rombel_id: rombel || null,
      no_induk: noInduk,
      tanggal_masuk: startDate,
      tanggal_keluar: endDate || null,
      status: status || null
    };

    try {
      setLoadingUpdatePendidikan(true);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(
        `${API_BASE_URL}formulir/${selectedPendidikanId}/pendidikan`,
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
        alert(`Data pendidikan berhasil diperbarui!`);
        setSelectedPendidikanDetail(result.data || payload);
        fetchPendidikan();
      } else {
        alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error saat update:", error);
    } finally {
      setLoadingUpdatePendidikan(false);
    }
  };

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
    setSelectedPendidikanId(id);
    setShowOutModal(true);
  };

  const Filters = ({ filterOptions, onChange, selectedFilters }) => {
    return (
      <div className="flex flex-col gap-4 w-full">
        {Object.entries(filterOptions).map(([label, options], index) => (
          <div key={`${label}-${index}`}>
            <label htmlFor={label} className="block text-sm font-medium text-gray-700">
              {capitalizeFirst(label)} {label === 'lembaga' ? '*' : ''}
            </label>
            <select
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 || selectedPendidikanDetail?.status === "tidak aktif" ? 'bg-gray-200 text-gray-500' : ''}`}
              onChange={(e) => onChange({ [label]: e.target.value })}
              value={selectedFilters[label] || ""}
              disabled={options.length <= 1 || selectedPendidikanDetail?.status === "tidak aktif"}
            >
              {options.map((option, idx) => (
                <option key={idx} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="block" id="Pendidikan">
      <h1 className="text-xl font-bold flex items-center justify-between">Pendidikan
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
        <ModalAddPendidikanFormulir
          isOpen={showAddModal}
          onClose={closeAddModal}
          biodataId={biodata_id}
          cardId={selectedPendidikanId}
          refetchData={fetchPendidikan}
          feature={feature}
        />
      )}

      {showOutModal && (
        <ModalKeluarPendidikanFormulir
          isOpen={showOutModal}
          onClose={closeOutModal}
          id={selectedPendidikanId}
          refetchData={fetchPendidikan}
        />
      )}

      <div className="mt-5 space-y-6">
        {loadingPendidikan ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : pendidikanList.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : pendidikanList.map((pendidikan) => (
          <div key={pendidikan.id}>
            {/* Card */}
            <div
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => handleCardClick(pendidikan.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">{pendidikan.nama_lembaga}</h5>
                  <p className="text-gray-600 text-sm">Jurusan: {pendidikan.nama_jurusan || '-'}</p>
                  <p className="text-gray-600 text-sm">Kelas: {pendidikan.nama_kelas || '-'}</p>
                  <p className="text-gray-600 text-sm">Rombel: {pendidikan.nama_rombel || '-'}</p>
                  <p className="text-gray-600 text-sm">No. Induk: {pendidikan.no_induk}</p>
                  <p className="text-gray-600 text-sm">
                    Periode: {formatDate(pendidikan.tanggal_masuk)}
                    {pendidikan.tanggal_keluar ? ` s/d ${formatDate(pendidikan.tanggal_keluar)}` : ' - Sekarang'}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${pendidikan.status === "aktif"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {pendidikan.status === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {!pendidikan.tanggal_keluar && (
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeature(2);
                      openAddModal();
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    title="Pindah Pendidikan"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOutModal(pendidikan.id);
                    }}
                    className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                    title="Keluar Pendidikan"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                  </button>
                </div>
              )}
            </div>

            {/* Form Input */}
            {loadingDetailPendidikan === pendidikan.id ? (
              <div className="flex justify-center items-center mt-4">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : selectedPendidikanId === pendidikan.id && selectedPendidikanDetail && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Kolom kiri: Dropdown dependent */}
                <div className="flex flex-col gap-4">
                  <Filters
                    filterOptions={updatedFilterLembaga}
                    onChange={handleFilterChangeLembaga}
                    selectedFilters={selectedLembaga}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="noInduk" className="block text-sm font-medium text-gray-700">
                      Nomor Induk *
                    </label>
                    <input
                      type="text"
                      id="noInduk"
                      name="noInduk"
                      value={noInduk}
                      onChange={(e) => setNoInduk(e.target.value)}
                      maxLength={50}
                      placeholder="Masukkan Nomor Induk"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPendidikanDetail?.status === "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                      disabled={selectedPendidikanDetail?.status === "tidak aktif"}
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPendidikanDetail?.status === "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                      disabled={selectedPendidikanDetail?.status === "tidak aktif"}
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
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPendidikanDetail?.status === "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={selectedPendidikanDetail?.status === "tidak aktif"}
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectedPendidikanDetail?.status === "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={selectedPendidikanDetail?.status === "tidak aktif"}
                    >
                      <option value="">Pilih Status</option>
                      <option value="aktif">Aktif</option>
                      <option value="tidak aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                  <div className="flex space-x-2 mt-1">
                    {pendidikan.status === "aktif" && (
                      <button
                        type="button"
                        disabled={loadingUpdatePendidikan}
                        className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${loadingUpdatePendidikan ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                        onClick={handleUpdate}
                      >
                        {loadingUpdatePendidikan ? (
                          <i className="fas fa-spinner fa-spin text-2xl text-white w-13"></i>
                        ) :
                          "Update"
                        }
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                      onClick={() => {
                        setSelectedPendidikanId(null);
                        setSelectedPendidikanDetail(null);
                        setNoInduk("");
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

// Kapitalisasi huruf pertama
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default TabPendidikan;