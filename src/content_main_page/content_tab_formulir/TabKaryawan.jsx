import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../hooks/config"; // Asumsi path config API
import { getCookie } from "../../utils/cookieUtils"; // Asumsi path utilitas cookie
import { ModalAddKaryawanFormulir, ModalKeluarKaryawanFormulir } from "../../components/modal/modal_formulir/ModalFormKaryawan"; // Sesuaikan path jika perlu
import useDropdownGolonganJabatan from "../../hooks/hook_dropdown/DropdownGolonganJabatan"; // Ganti atau gunakan hook yang sudah ada
import useDropdownLembaga from "../../hooks/hook_dropdown/DropdownLembagaDoang"; 

const TabKaryawan = () => {
  const { biodata_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [karyawanList, setKaryawanList] = useState([]);
  const [selectedKaryawanId, setSelectedKaryawanId] = useState(null);
  const [selectedKaryawanDetail, setSelectedKaryawanDetail] = useState(null);
  const [keteranganJabatan, setKeteranganJabatan] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [jabatanKontrak, setJabatanKontrak] = useState("");
  const [feature, setFeature] = useState(null);

  const [loadingKaryawan, setLoadingKaryawan] = useState(true);
  const [loadingDetailKaryawan, setLoadingDetailKaryawan] = useState(null);
  const [loadingUpdateKaryawan, setLoadingUpdateKaryawan] = useState(false);

  const [selectedLembagaId, setSelectedLembagaId] = useState("");
  const [selectedGolonganJabatanId, setSelectedGolonganJabatanId] = useState("");

  const { menuLembaga } = useDropdownLembaga(); 
  const { menuGolonganJabatan } = useDropdownGolonganJabatan();

  const fetchKaryawan = useCallback(async () => {
    const token = sessionStorage.getItem("token") || getCookie("token");
    if (!biodata_id || !token) {
      setLoadingKaryawan(false);
      return;
    }
    try {
      setLoadingKaryawan(true);
      const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/karyawan`, { // Endpoint diubah
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setKaryawanList(result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data Karyawan:", error);
      setKaryawanList([]); // Set ke array kosong jika error
    } finally {
      setLoadingKaryawan(false);
    }
  }, [biodata_id]);

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  const handleCardClick = async (id) => {
    try {
      setLoadingDetailKaryawan(id);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/karyawan/show`, { // Endpoint diubah
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      const karyawanData = result.data;

      setSelectedKaryawanId(id);
      setSelectedKaryawanDetail(karyawanData);
      setKeteranganJabatan(karyawanData.keterangan_jabatan || "");
      setEndDate(karyawanData.tanggal_keluar || "");
      setStartDate(karyawanData.tanggal_masuk || "");
      setStatus(karyawanData.status || "");
      setJabatanKontrak(karyawanData.jabatan_kontrak || ""); // Ditambahkan
      setSelectedLembagaId(String(karyawanData.lembaga_id || "")); // Pastikan string untuk value select
      setSelectedGolonganJabatanId(karyawanData.golongan_jabatan_id || ""); // Pastikan string untuk value select

    } catch (error) {
      console.error("Gagal mengambil detail Karyawan:", error);
    } finally {
      setLoadingDetailKaryawan(null);
    }
  };

  useEffect(() => {
    if (menuLembaga.length > 0 && selectedKaryawanDetail?.lembaga_id) {
      const isValid = menuLembaga.some(
        (opt) => String(opt.value) === String(selectedKaryawanDetail.lembaga_id)
      );
      setSelectedLembagaId(isValid ? String(selectedKaryawanDetail.lembaga_id) : "");
    }
  }, [menuLembaga, selectedKaryawanDetail?.lembaga_id]);

  const handleUpdate = async () => {
    if (!selectedKaryawanDetail) return;

    const payload = {
      lembaga_id: selectedLembagaId,
      golongan_jabatan_id: selectedGolonganJabatanId,
      keterangan_jabatan: keteranganJabatan,
      jabatan: jabatanKontrak, // Ditambahkan
      tanggal_mulai: startDate,
      tanggal_akhir: endDate || null, // endDate tetap dikirim, API yang akan handle jika disabled
      // status: status, // Status biasanya tidak diupdate langsung di form ini, tapi melalui proses "Keluar"
    };

    // Validasi field wajib (sesuaikan dengan kebutuhan)
    if (!payload.lembaga_id || !payload.golongan_jabatan_id || !keteranganJabatan || !startDate) {
      alert("Lembaga, Golongan Jabatan, Keterangan Jabatan, dan Tanggal Mulai wajib diisi!");
      return;
    }

    try {
      setLoadingUpdateKaryawan(true);
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(
        `${API_BASE_URL}formulir/${selectedKaryawanId}/karyawan`, // Endpoint diubah
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
        alert(`Data karyawan berhasil diperbarui!`);
        // Optimistic update atau fetch ulang detail untuk data terbaru
        // setSelectedKaryawanDetail(prev => ({ ...prev, ...payload, golongan_jabatan: menuGolonganJabatan.find(g => g.id === selectedGolonganJabatanId)?.label, lembaga: { nama: menuLembaga.find(l => l.id === selectedLembagaId)?.label } }));
        fetchKaryawan(); // Refresh data list
        // Jika ingin langsung menutup form edit setelah update:
        // setSelectedKaryawanId(null);
        // setSelectedKaryawanDetail(null);
      } else {
        alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error saat update:", error);
      alert("Terjadi kesalahan saat update data.");
    } finally {
      setLoadingUpdateKaryawan(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
  };

  const closeAddModal = () => setShowAddModal(false);
  const openAddModal = (karyawanId = null) => {
      setSelectedKaryawanId(karyawanId); // Reset selected ID for new entry if modal is reused for add/pindah
      setShowAddModal(true);
  }
  const closeOutModal = () => setShowOutModal(false);

  const handlePindahJabatan = (karyawanId) => {
    setSelectedKaryawanId(karyawanId); // Set ID karyawan yang akan dipindah
    setFeature(2); // Mode pindah
    openAddModal(karyawanId);
    console.log("handlePindahJabatan called with karyawanId:", karyawanId);
  };

  const handleKeluarJabatan = (karyawanId) => {
    setSelectedKaryawanId(karyawanId);
    setShowOutModal(true);
  };

  // console.log("selectedKaryawanId:", selectedKaryawanId);
  
  // debuging logs untuk golongan jabatan
  // console.log("menuGolonganJabatan", menuGolonganJabatan);
  // console.log("selectedGolonganJabatanId", selectedGolonganJabatanId);
  // console.log(
  //   "matching option golongan:",
  //   menuGolonganJabatan.find((opt) => String(opt.id) === String(selectedGolonganJabatanId))
  // );
  // debuging logs untuk lembaga
  // console.log("menuLembaga:", menuLembaga);
  // console.log("selectedLembagaId:", selectedLembagaId);
  // console.log(
  //   "matching option lembaga:",
  //   menuLembaga.find((opt) => String(opt.value) === String(selectedLembagaId))
  // );

  return (
    <div className="block" id="Karyawan">
      <h1 className="text-xl font-bold flex items-center justify-between">
        Karyawan
        <button
          onClick={() => {
            setFeature(1); // 1 = Tambah
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
        <ModalAddKaryawanFormulir
          isOpen={showAddModal}
          onClose={closeAddModal}
          biodataId={biodata_id}
          refetchData={fetchKaryawan}
          feature={feature}
          // cardId={selectedKaryawanId || null}
          karyawanIdToPindah={selectedKaryawanId} // Kirim ID karyawan jika mode pindah
        />
      )}

      {showOutModal && (
        <ModalKeluarKaryawanFormulir
          isOpen={showOutModal}
          onClose={closeOutModal}
          id={selectedKaryawanId}
          refetchData={fetchKaryawan}
        />
      )}

      <div className="mt-5 space-y-6">
        {loadingKaryawan ? (
          <div className="flex justify-center items-center">
            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
          </div>
        ) : karyawanList.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data</p>
        ) : karyawanList.map((karyawan) => (
          <div key={karyawan.id}>
            <div
              className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
              onClick={() => handleCardClick(karyawan.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <h5 className="text-lg font-bold">{karyawan.keterangan_jabatan}</h5>
                  <p className="text-gray-600 text-sm">
                    {/* Asumsi API list mengembalikan nama lembaga dan golongan, jika tidak, perlu find dari menuLembaga/menuGolonganJabatan */}
                    {karyawan.lembaga?.nama || menuLembaga.find(l => l.id === String(karyawan.lembaga_id))?.label || "-"} | {" "}
                    {karyawan.golongan_jabatan?.nama || menuGolonganJabatan.find(g => g.id === String(karyawan.golongan_jabatan_id))?.label || "-"}
                  </p>
                  {/* Tampilkan Jabatan Kontrak di Card */}
                  <p className="text-gray-600 text-sm">
                    {karyawan.jabatan_kontrak || "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Sejak: {formatDate(karyawan.tanggal_masuk)}
                    {karyawan.tanggal_keluar ? ` s/d ${formatDate(karyawan.tanggal_keluar)}` : " - Sekarang"}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    karyawan.status === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {karyawan.status === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {!karyawan.tanggal_keluar && karyawan.status === "aktif" && ( // Ditambahkan pengecekan status aktif juga, karena bisa jadi tanggal keluar null tapi status sudah nonaktif dari proses lain
                <div className="flex flex-wrap gap-2 gap-x-4 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePindahJabatan(karyawan.id);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    title="Pindah Jabatan"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} /> Pindah
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKeluarJabatan(karyawan.id);
                    }}
                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                    title="Keluar Jabatan"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} /> Keluar
                  </button>
                </div>
              )}
            </div>

            {loadingDetailKaryawan === karyawan.id ? (
              <div className="flex justify-center items-center mt-4">
                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
              </div>
            ) : selectedKaryawanId === karyawan.id && selectedKaryawanDetail && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                {/* Kolom Kiri */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lembaga *</label>
                    <select
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        selectedKaryawanDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                      value={selectedLembagaId}
                      onChange={(e) => setSelectedLembagaId(e.target.value)}
                      disabled={selectedKaryawanDetail?.status !== "aktif"}
                    >
                      {/* <option value="">Pilih Lembaga</option> */}
                      {menuLembaga.map((opt) => ( // Gunakan menuLembaga dari state/hook
                        <option key={opt.value} value={opt.value}> {/* Pastikan value adalah ID */}
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Golongan Jabatan *</label>
                    <select
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        selectedKaryawanDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                      value={selectedGolonganJabatanId}
                      onChange={(e) => setSelectedGolonganJabatanId(e.target.value)}
                      disabled={selectedKaryawanDetail?.status !== "aktif"}
                    >
                       {/* <option value="">Pilih Golongan Jabatan</option> */}
                      {menuGolonganJabatan.map((opt) => ( // Gunakan menuGolonganJabatan dari state/hook
                        <option key={opt.id} value={opt.id}> {/* Pastikan value adalah ID */}
                          {opt.label}
                        </option>
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
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        selectedKaryawanDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                      disabled={selectedKaryawanDetail?.status !== "aktif"}
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="jabatanKontrak" className="block text-sm font-medium text-gray-700">
                      Jenis Kontrak
                    </label>
                    <select
                      id="jabatanKontrak"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        selectedKaryawanDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                      value={jabatanKontrak}
                      onChange={(e) => setJabatanKontrak(e.target.value)}
                      disabled={selectedKaryawanDetail?.status !== "aktif"}
                    >
                      <option value="">Pilih Jenis Kontrak</option>
                      <option value="kultural">Kultural</option>
                      <option value="tetap">Tetap</option>
                      <option value="kontrak">Kontrak</option>
                      <option value="pengkaderan">Pengkaderan</option>
                      {/* Tambahkan opsi lain jika perlu */}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        selectedKaryawanDetail?.status !== "aktif" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                      disabled={selectedKaryawanDetail?.status !== "aktif"}
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
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500 cursor-not-allowed" // Selalu disabled
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)} // Sebenarnya tidak akan bisa diubah jika disabled
                      disabled // Dibuat selalu disabled
                    />
                  </div>
                </div>

                {/* Tombol Aksi Form */}
                <div className="col-span-full">
                  <div className="flex space-x-2 mt-2">
                    {selectedKaryawanDetail?.status === "aktif" && (
                      <button
                        type="button"
                        disabled={loadingUpdateKaryawan}
                        className={`px-4 py-2 text-white rounded-lg ${
                          loadingUpdateKaryawan
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                        onClick={handleUpdate}
                      >
                        {loadingUpdateKaryawan ? (
                          <i className="fas fa-spinner fa-spin text-white"></i> // Ukuran icon disesuaikan
                        ) : "Update"}
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                      onClick={() => {
                        setSelectedKaryawanId(null);
                        setSelectedKaryawanDetail(null);
                        // Reset form fields
                        setKeteranganJabatan("");
                        setStartDate("");
                        setEndDate("");
                        setStatus("");
                        setJabatanKontrak("");
                        setSelectedLembagaId("");
                        setSelectedGolonganJabatanId("");
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


export default TabKaryawan;
