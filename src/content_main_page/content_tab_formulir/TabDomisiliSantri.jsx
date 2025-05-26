import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddDomisiliFormulir, ModalKeluarDomisiliFormulir } from "../../components/modal/modal_formulir/ModalFormDomisili";

const TabDomisiliSantri = () => {
  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [domisiliList, setDomisiliList] = useState([]);
  const [selectedDomisiliId, setSelectedDomisiliId] = useState(null);
  const [selectedDomisiliDetail, setSelectedDomisiliDetail] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feature, setFeature] = useState(null);

  const [loadingDomisili, setLoadingDomisili] = useState(true);
  const [loadingDetailDomisili, setLoadingDetailDomisili] = useState(null);
  const [loadingUpdateDomisili, setLoadingUpdateDomisili] = useState(false);

  const fetchDomisili = useCallback(async () => {
    const token = sessionStorage.getItem("token") || getCookie("token");
    if (!biodata_id || !token) return;
    try {
      setLoadingDomisili(true);
      const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/domisili`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setDomisiliList(result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data Domisili:", error);
    } finally {
      setLoadingDomisili(false);
    }
  }, [biodata_id]);

  useEffect(() => {
    fetchDomisili();
  }, [fetchDomisili]);

  const handleCardClick = async (id) => {
    try {
      setLoadingDetailDomisili(id);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/domisili/show`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      setSelectedDomisiliId(id);
      setSelectedDomisiliDetail(result.data);
      setStartDate(result.data.tanggal_masuk || "");
      setEndDate(result.data.tanggal_keluar || "");
    } catch (error) {
      console.error("Gagal mengambil detail Domisili:", error);
    } finally {
      setLoadingDetailDomisili(null);
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
    setSelectedDomisiliId(id);
    setShowOutModal(true);
  };

  // Format tanggal ke ID
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="block" id="Domisili">
      <h1 className="text-xl font-bold flex items-center justify-between">Domisili Santri
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
        <ModalAddDomisiliFormulir 
          isOpen={showAddModal} 
          onClose={closeAddModal} 
          biodataId={biodata_id} 
          cardId={selectedDomisiliId} 
          refetchData={fetchDomisili} 
          feature={feature} 
        />
      )}

      {showOutModal && (
        <ModalKeluarDomisiliFormulir 
          isOpen={showOutModal} 
          onClose={closeOutModal} 
          id={selectedDomisiliId} 
          refetchData={fetchDomisili} 
        />
      )}

      <div className="mt-5 space-y-6">
        {loadingDomisili ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : domisiliList.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : domisiliList.map((domisili) => (
          <div key={domisili.id}>
            {/* Card */}
            <div
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => handleCardClick(domisili.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">{domisili.nama_wilayah}</h5>
                  <p className="text-gray-600 text-sm">Blok: {domisili.nama_blok || '-'}</p>
                  <p className="text-gray-600 text-sm">Kamar: {domisili.nama_kamar || '-'}</p>
                  <p className="text-gray-600 text-sm">
                    Sejak {formatDate(domisili.tanggal_masuk)}
                    {domisili.tanggal_keluar ? ` s/d ${formatDate(domisili.tanggal_keluar)}` : ' - Sekarang'}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${!domisili.tanggal_keluar
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {!domisili.tanggal_keluar ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {!domisili.tanggal_keluar && (
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeature(2);
                      openAddModal();
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    title="Pindah Domisili"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOutModal(domisili.id);
                    }}
                    className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                    title="Keluar Domisili"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabDomisiliSantri;