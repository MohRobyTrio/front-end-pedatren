import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import { ModalAddWaliKelasFormulir, ModalKeluarWaliKelasFormulir } from "../../components/modal/modal_formulir/ModalFormWaliKelas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { hasAccess } from "../../utils/hasAccess";
import Access from "../../components/Access";

const TabWaliKelas = () => {
    const { biodata_id } = useParams();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const canEdit = hasAccess("edit");
    const canPindah = hasAccess("pindah");
    const canKeluar = hasAccess("keluar");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [waliKelasList, setWaliKelasList] = useState([]);
    const [selectedWaliKelasId, setSelectedWaliKelasId] = useState(null);
    const [selectedWaliKelasDetail, setSelectedWaliKelasDetail] = useState(null);
    const [jmlMurid, setJmlMurid] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [feature, setFeature] = useState(null);
    const [error, setError] = useState(null);

    const [loadingWaliKelas, setLoadingWaliKelas] = useState(true);
    const [loadingDetailWaliKelas, setLoadingDetailWaliKelas] = useState(null);

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

    const fetchWaliKelas = useCallback(async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");
        if (!biodata_id || !token) return;
        try {
            setError(null);
            setLoadingWaliKelas(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/walikelas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }
            if (response.status == 403) {
                throw new Error("403");
            }
            if (!response.ok) {
                // Misalnya response.status == 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);

            setWaliKelasList(result.data || []);
            setError(null);
        } catch (err) {
            if (err.message == 403) {
                setError("Akses ditolak: Anda tidak memiliki izin untuk melihat data ini.");
            } else {
                setError("Terjadi kesalahan saat mengambil data.");
            }
            console.error("Gagal mengambil data WaliKelas:", error);
        } finally {
            setLoadingWaliKelas(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }
            const result = await response.json();
            console.log(result);

            setSelectedWaliKelasId(id);
            setSelectedWaliKelasDetail(result.data);
            setJmlMurid(result.data.jumlah_murid || "");
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
            Swal.fire({
                background: "transparent",    // tanpa bg putih box
                showConfirmButton: false,     // tanpa tombol
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
                }
            });
            // setLoadingUpdateWaliKelas(true);
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
            Swal.close();
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }
            console.log(`${API_BASE_URL}formulir/${selectedWaliKelasId}/walikelas`);
            const result = await response.json();
            if (response.ok) {
                alert(`Data berhasil diperbarui! ${result.message}-${result.data}`);
                setSelectedWaliKelasDetail(result.data || payload);
            } else {
                alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error("Error saat update:", error);
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
        setSelectedWaliKelasId(id);
        setShowOutModal(true);
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
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 || !canEdit || selectedWaliKelasDetail.status_aktif == "tidak aktif" ? 'bg-gray-200 text-gray-500' : ''}`}
                            onChange={(e) => onChange({ [label]: e.target.value })}
                            value={selectedFilters[label] || ""}
                            disabled={options.length <= 1 || !canEdit || selectedWaliKelasDetail.status_aktif == "tidak aktif"}
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
                <Access action="tambah">
                    <button
                        onClick={() => {
                            setFeature(1);
                            openAddModal();
                        }
                        }
                        type="button"
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Tambah</span>
                    </button>
                </Access>
            </h1>

            <ModalAddWaliKelasFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} cardId={selectedWaliKelasId} refetchData={fetchWaliKelas} feature={feature} />

            <ModalKeluarWaliKelasFormulir isOpen={showOutModal} onClose={closeOutModal} id={selectedWaliKelasId} refetchData={fetchWaliKelas} />

            <div className="mt-5 space-y-6">
                {loadingWaliKelas ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">{error}</p>
                            {error.includes("Akses ditolak") ? null : (
                                <button
                                    onClick={fetchWaliKelas}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Coba Lagi
                                </button>
                            )}
                    </div>
                ) : waliKelasList.length == 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : waliKelasList.map((waliKelas) => (
                    <div key={waliKelas.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
                            onClick={() => handleCardClick(waliKelas.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h5 className="text-lg font-bold">{waliKelas.Lembaga}</h5>
                                    {/* <p className="text-gray-600 text-sm">Jurusan: {waliKelas.Jurusan}</p>
                                    <p className="text-gray-600 text-sm">Kelas: {waliKelas.Kelas}</p>
                                    <p className="text-gray-600 text-sm">Rombel: {waliKelas.Rombel}</p>
                                    <p className="text-gray-600 text-sm">Jumlah Murid: {waliKelas.jumlah_murid}</p> */}
                                    <p className="text-gray-600 text-sm">
                                        Sejak {formatDate(waliKelas.Periode_awal)}{" "}
                                        Sampai {waliKelas.Periode_akhir ? formatDate(waliKelas.Periode_akhir) : "Sekarang"}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${waliKelas.status_aktif == "aktif"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {waliKelas.status_aktif || "-"}
                                </span>
                            </div>

                            {!waliKelas.Periode_akhir && (
                                <div className={`flex flex-wrap gap-2 gap-x-4 ${canPindah || canKeluar ? "" : "mt-2"}`}>
                                    <Access action="pindah">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFeature(2);
                                                openAddModal();
                                                // handleOpenAddModalWithDetail(khadam.id, 2);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                            title="Pindah Khadam"
                                        >
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                        </button>
                                    </Access>
                                    <Access action="keluar">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openOutModal(waliKelas.id);
                                            }}
                                            className="justify-end text-yellow-600 hover:text-yellow-800 flex items-center gap-1 cursor-pointer"
                                            title="Keluar Khadam"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />Keluar
                                        </button>
                                    </Access>
                                </div>
                            )}
                        </div>

                        {/* Form Input */}
                        {loadingDetailWaliKelas == waliKelas.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedWaliKelasId == waliKelas.id && selectedWaliKelasDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Kolom kiri: Dropdown dependent */}
                                <div className="flex flex-col gap-4">
                                    <Filters filterOptions={updatedFilterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Jumlah Murid
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                            }}
                                            id="jumlah_murid"
                                            name="jumlah_murid"
                                            value={jmlMurid}
                                            onChange={(e) => setJmlMurid(e.target.value)}
                                            maxLength={50}
                                            placeholder="Masukkan Jumlah Murid"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedWaliKelasDetail.status_aktif == "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!canEdit || selectedWaliKelasDetail?.status_aktif == "tidak aktif"}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Periode Awal
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedWaliKelasDetail.status_aktif == "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!canEdit || selectedWaliKelasDetail?.status_aktif == "tidak aktif"}
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
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500  bg-gray-200 text-gray-500"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        {waliKelas.status_aktif == "aktif" && (
                                            <Access action="edit">
                                                <button
                                                    type="button"
                                                    className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer`}
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
