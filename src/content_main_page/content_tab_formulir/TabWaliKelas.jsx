import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAddSantriFormulir from "../../components/modal/modal_formulir/ModalFormSantri";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";

const TabWaliKelas = () => {
    const { biodata_id } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
    const [waliKelasList, setWaliKelasList] = useState([]);
    const [selectedWaliKelasId, setSelectedWaliKelasId] = useState(null);
    const [selectedWaliKelasDetail, setSelectedWaliKelasDetail] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");

    const [loadingWaliKelas, setLoadingWaliKelas] = useState(true);
    const [loadingDetailWaliKelas, setLoadingDetailWaliKelas] = useState(null);
    const [loadingUpdateWaliKelas, setLoadingUpdateWaliKelas] = useState(false);

    const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();

    const fetchWaliKelas = useCallback(async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");
        if (!biodata_id || !token) return;
        try {
            setLoadingWaliKelas(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/walikelas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            console.log(result);

            setWaliKelasList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data WaliKelas:", error);
        } finally {
            setLoadingWaliKelas(false);
        }
    }, [biodata_id]);

    useEffect(() => {    
        fetchWaliKelas();
    }, [fetchWaliKelas]);

    useEffect(() => {
        // Saat selectedFilterLembaga diisi, panggil handleFilterChangeLembaga secara bertahap
        if (selectedWaliKelasDetail) {
            if (selectedWaliKelasDetail.lembaga_id) {
                handleFilterChangeLembaga({ lembaga: selectedWaliKelasDetail.lembaga_id });
            }
            if (selectedWaliKelasDetail.jurusan_id) {
                handleFilterChangeLembaga({ jurusan: selectedWaliKelasDetail.jurusan_id });
            }
            if (selectedWaliKelasDetail.kelas_id) {
                handleFilterChangeLembaga({ kelas: selectedWaliKelasDetail.kelas_id });
            }
            if (selectedWaliKelasDetail.rombel_id) {
                handleFilterChangeLembaga({ rombel: selectedWaliKelasDetail.rombel_id });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWaliKelasDetail]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailWaliKelas(id);
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/walikelas/show`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const result = await response.json();        
            console.log(result);
                
            setSelectedWaliKelasId(id);
            setSelectedWaliKelasDetail(result.data);
            setEndDate(result.data.periode_akhir || "");
            setStartDate(result.data.periode_awal || "");
        } catch (error) {
            console.error("Gagal mengambil detail WaliKelas:", error);
        } finally {
            setLoadingDetailWaliKelas(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedWaliKelasDetail) return;

        const { lembaga, jurusan, kelas, rombel } = selectedLembaga;

        if (!lembaga || !jurusan || !kelas || !rombel) {
            alert("Semua dropdown (Lembaga, Jurusan, Kelas, Rombel) harus dipilih.");
            return;
        }

        const payload = {
            lembaga_id: lembaga,
            jurusan_id: jurusan,
            kelas_id: kelas,
            rombel_id: rombel,
            jumlah_murid: 20,
            periode_awal: startDate
        };

        console.log("Payload yang dikirim ke API:", payload);

        try {
            setLoadingUpdateWaliKelas(true);
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedWaliKelasId}/walikelas`,
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
                alert(`Data berhasil diperbarui! ${result.message}-${result.data}`);
                setSelectedWaliKelasDetail(result.data || payload);
            } else {
                alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error("Error saat update:", error);
        } finally {
            setLoadingUpdateWaliKelas(false);
        }
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const Filters = ({ filterOptions, onChange, selectedFilters }) => {
        return (
            <div className="flex flex-col gap-4 w-full">
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div key={`${label}-${index}`}>
                        <label htmlFor={label} className="block text-sm font-medium text-gray-700">
                            {capitalizeFirst(label)} *
                        </label>
                        <select
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                            onChange={(e) => onChange({ [label]: e.target.value })}
                            value={selectedFilters[label] || ""}
                            disabled={options.length <= 1}
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
        <div className="block" id="WaliKelas">
            <h1 className="text-xl font-bold flex items-center justify-between">Wali Kelas
                <button
                    onClick={openAddModal}
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    <i className="fas fa-plus"></i>
                    <span>Tambah Data</span>
                </button>
            </h1>

            {showAddModal && (
                <ModalAddSantriFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} />
            )}

            <div className="mt-5 space-y-6">
                {loadingWaliKelas ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : waliKelasList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : waliKelasList.map((waliKelas) => (
                    <div key={waliKelas.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                            onClick={() => handleCardClick(waliKelas.id)}
                        >
                            <div>
                                <h5 className="text-lg font-bold">{waliKelas.Lembaga}</h5>
                                <p className="text-gray-600 text-sm">Jurusan: {waliKelas.Jurusan}</p>
                                <p className="text-gray-600 text-sm">Kelas: {waliKelas.Kelas}</p>
                                <p className="text-gray-600 text-sm">Rombel: {waliKelas.Rombel}</p>
                                <p className="text-gray-600 text-sm">
                                    Sejak {formatDate(waliKelas.Periode_awal)}{" "}
                                    Sampai {waliKelas.Periode_akhir ? formatDate(waliKelas.Periode_akhir) : "Sekarang"}
                                </p>
                            </div>
                        </div>

                        {/* Form Input */}
                        {loadingDetailWaliKelas === waliKelas.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedWaliKelasId === waliKelas.id && selectedWaliKelasDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Kolom kiri: Dropdown dependent */}
                                <div className="flex flex-col gap-4">
                                    <Filters filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Periode Awal
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
                                            Periode Akhir
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        <button
                                            type="button"
                                            disabled={loadingUpdateWaliKelas}
                                            className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${loadingUpdateWaliKelas ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                                            onClick={handleUpdate}
                                        >
                                            {loadingUpdateWaliKelas ? (
                                                <i className="fas fa-spinner fa-spin text-2xl text-white w-13"></i>
                                            ) :
                                                "Update"
                                            }
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                                            onClick={() => {
                                                setSelectedWaliKelasId(null);
                                                setSelectedWaliKelasDetail(null);
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

export default TabWaliKelas;
