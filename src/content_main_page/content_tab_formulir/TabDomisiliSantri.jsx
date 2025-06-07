import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddDomisiliFormulir, ModalKeluarDomisiliFormulir } from "../../components/modal/modal_formulir/ModalFormDomisili";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import useLogout from "../../hooks/Logout";
import Swal from "sweetalert2";
import Access from "../../components/Access";
import { hasAccess } from "../../utils/hasAccess";

const TabDomisiliSantri = () => {
    const { biodata_id } = useParams();
    const canEdit = hasAccess("edit");
    const canPindah = hasAccess("pindah");
    const canKeluar = hasAccess("keluar");
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
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

    // Format tanggal untuk tampilan card
    const formatDateTimeDisplay = (datetime) => {
        if (!datetime) return "";
        const options = {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        };
        return new Date(datetime).toLocaleDateString("id-ID", options).replace(" pukul", ",");
    };

    // Tambahkan state untuk dropdown wilayah
    const {
        filterWilayah,
        handleFilterChangeWilayah,
        selectedWilayah } = DropdownWilayah();

    // Ubah label dropdown
    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterWilayah = {
        wilayah: updateFirstOptionLabel(filterWilayah.wilayah, "Pilih Wilayah"),
        blok: updateFirstOptionLabel(filterWilayah.blok, "Pilih Blok"),
        kamar: updateFirstOptionLabel(filterWilayah.kamar, "Pilih Kamar"),
    };

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
            if (response.status === 401) {
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
            if (!response.ok) {
                // Misalnya response.status === 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }

            const result = await response.json();
            setDomisiliList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Domisili:", error);
        } finally {
            setLoadingDomisili(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (response.status === 401) {
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

            setSelectedDomisiliId(id);
            setSelectedDomisiliDetail(result.data);
            console.log(selectedDomisiliDetail);
            
            // setStartDate(result.data.tanggal_masuk || "");
            // setEndDate(result.data.tanggal_keluar || "");
            // Parsing datetime ke format input
            // Format tanggal untuk input
            const parseDateTimeForInput = (datetime) => {
                if (!datetime) return "";
                const date = new Date(datetime);
                return date.toISOString().split('T')[0]; // Ambil bagian tanggal saja
            };

            setStartDate(parseDateTimeForInput(result.data.tanggal_masuk));
            setEndDate(parseDateTimeForInput(result.data.tanggal_keluar));

            // Format untuk input datetime-local (type=datetime-local but value date-only)
            // setSelectedDomisiliDetail({
            //   ...result.data,
            //   // Untuk display di card
            //   tanggal_masuk: formatForDisplay(result.data.tanggal_masuk),
            //   tanggal_keluar: result.data.tanggal_keluar ? 
            //     formatForDisplay(result.data.tanggal_keluar) : null
            // });


            // Set dropdown values
            // const dropdownValues = {};

            // // Cari ID berdasarkan nama
            // if (result.data.nama_wilayah) {
            //     const wilayahOption = filterWilayah.wilayah.find(item => item.label === result.data.nama_wilayah);
            //     if (wilayahOption) dropdownValues.wilayah = wilayahOption.value;
            // }

            // if (result.data.nama_blok) {
            //     const blokOption = filterWilayah.blok.find(item => item.label === result.data.nama_blok);
            //     if (blokOption) dropdownValues.blok = blokOption.value;
            // }

            // if (result.data.nama_kamar) {
            //     const kamarOption = filterWilayah.kamar.find(item => item.label === result.data.nama_kamar);
            //     if (kamarOption) dropdownValues.kamar = kamarOption.value;
            // }

            // // Set selected wilayah
            // if (setSelectedWilayah && typeof setSelectedWilayah === 'function') {
            //     setSelectedWilayah(dropdownValues);
            // } else {
            //     // Handle perubahan dropdown bertahap
            //     const setDropdownValues = async () => {
            //         if (dropdownValues.wilayah) {
            //             await handleFilterChangeWilayah({ wilayah: dropdownValues.wilayah });

            //             setTimeout(() => {
            //                 if (dropdownValues.blok) {
            //                     handleFilterChangeWilayah({ blok: dropdownValues.blok });

            //                     setTimeout(() => {
            //                         if (dropdownValues.kamar) {
            //                             handleFilterChangeWilayah({ kamar: dropdownValues.kamar });
            //                         }
            //                     }, 50);
            //                 }
            //             }, 100);
            //         }
            //     };
            //     setDropdownValues();
            // }

        } catch (error) {
            console.error("Gagal mengambil detail Domisili:", error);
        } finally {
            setLoadingDetailDomisili(null);
        }
    };

    useEffect(() => {
        // Saat selectedFilterLembaga diisi, panggil handleFilterChangeLembaga secara bertahap
        if (selectedDomisiliDetail) {
            if (selectedDomisiliDetail.nama_wilayah) {
                handleFilterChangeWilayah({ wilayah: selectedDomisiliDetail.nama_wilayah });
            }
            if (selectedDomisiliDetail.nama_blok) {
                handleFilterChangeWilayah({ blok: selectedDomisiliDetail.nama_blok });
            }
            if (selectedDomisiliDetail.nama_kamar) {
                handleFilterChangeWilayah({ kamar: selectedDomisiliDetail.nama_kamar });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDomisiliDetail]);

    const handleUpdate = async () => {
        if (!selectedDomisiliDetail) return;

        const { wilayah, blok, kamar } = selectedWilayah || {};

        // Validasi wajib
        if (!wilayah || !startDate) {
            alert("Wilayah dan Tanggal Mulai wajib diisi");
            return;
        }

        // Validasi format tanggal
        // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        // if (!dateRegex.test(startDate)) {
        //   alert("Format tanggal mulai tidak valid (harus YYYY-MM-DD)");
        //   return;
        // }

        // Format payload sesuai kebutuhan backend
        const payload = {
            wilayah_id: wilayah,
            blok_id: blok || null,
            kamar_id: kamar || null,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null
        };

        try {
            setLoadingUpdateDomisili(true);
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedDomisiliId}/domisili`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (response.status === 401) {
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

            // Handle response
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal update");

            alert(`Data domisili berhasil diperbarui!`);

            // Reset form
            setSelectedDomisiliId(null);
            setSelectedDomisiliDetail(null);
            setStartDate("");
            setEndDate("");

            // Refresh data dengan delay singkat
            setTimeout(() => {
                fetchDomisili();
            }, 300);

        } catch (error) {
            console.error("Error saat update:", error);
            alert(error.message || "Terjadi kesalahan saat update");
        } finally {
            setLoadingUpdateDomisili(false);
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

    const isTanggalKeluarValid = (
        selectedDomisiliDetail?.tanggal_keluar &&
        selectedDomisiliDetail?.tanggal_keluar !== "-"
    );

    // Komponen dropdown
    const Filters = ({ filterOptions, onChange, selectedFilters }) => {
        return (
            <div className="flex flex-col gap-4 w-full">
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div key={`${label}-${index}`}>
                        <label htmlFor={label} className="block text-sm font-medium text-gray-700">
                            {capitalizeFirst(label)} {label === 'wilayah' ? '*' : ''}
                        </label>
                        <select
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 || !canEdit || isTanggalKeluarValid ? 'bg-gray-200 text-gray-500' : ''}`}
                            onChange={(e) => onChange({ [label]: e.target.value })}
                            value={selectedFilters[label] || ""}
                            disabled={options.length <= 1 || !canEdit || isTanggalKeluarValid}
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

    // Format tanggal ke ID
    // const formatDate = (dateStr) => {
    //   const options = { year: "numeric", month: "short", day: "2-digit" };
    //   return new Date(dateStr).toLocaleDateString("id-ID", options);
    // };

    // Kapitalisasi huruf pertama
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        try {
            setSelectedDomisiliId(id);
            setFeature(featureNum);
            setShowAddModal(true);
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
        }
    };

    return (
        <div className="block" id="Domisili">
            <h1 className="text-xl font-bold flex items-center justify-between">Domisili Santri
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
                        <span>Tambah Data</span>
                    </button>
                </Access>
            </h1>

            {/* {showAddModal && ( */}
            <ModalAddDomisiliFormulir
                isOpen={showAddModal}
                onClose={closeAddModal}
                biodataId={biodata_id}
                cardId={selectedDomisiliId}
                refetchData={fetchDomisili}
                feature={feature}
            />
            {/* )} */}

            {/* {showOutModal && ( */}
            <ModalKeluarDomisiliFormulir
                isOpen={showOutModal}
                onClose={closeOutModal}
                id={selectedDomisiliId}
                refetchData={fetchDomisili}
            />
            {/* )} */}

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
                            className="bg-white shadow-md drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
                            onClick={() => handleCardClick(domisili.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h5 className="text-lg font-bold">Wilayah {domisili.nama_wilayah} - {domisili.nama_kamar}</h5>
                                    <p className="text-gray-600 text-sm">
                                        Sejak {formatDateTimeDisplay(domisili.tanggal_masuk)}
                                        {domisili.tanggal_keluar ?
                                            ` s/d ${formatDateTimeDisplay(domisili.tanggal_keluar)}` : ' - Sekarang'}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${!domisili.tanggal_keluar
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {/* {!domisili.tanggal_keluar ? "Aktif" : "Nonaktif"} */}
                                    {domisili.status}
                                </span>
                            </div>

                            {!domisili.tanggal_keluar && (
                                                                <div className={`flex flex-wrap gap-2 gap-x-4 ${canPindah || canKeluar ? "" : "mt-2"}`}>
                                    <Access action="pindah">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenAddModalWithDetail(domisili.id, 2);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                            title="Pindah Domisili"
                                        >
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                        </button>
                                    </Access>
                                    <Access action="keluar">
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
                                    </Access>
                                </div>
                            )}
                        </div>

                        {/* Form Input */}
                        {loadingDetailDomisili === domisili.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedDomisiliId === domisili.id && selectedDomisiliDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="flex flex-col gap-4">
                                    <Filters
                                        filterOptions={updatedFilterWilayah}
                                        onChange={handleFilterChangeWilayah}
                                        selectedFilters={selectedWilayah}
                                    />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Tanggal Mulai *
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || isTanggalKeluarValid ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!canEdit || isTanggalKeluarValid}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)} // Simpan hanya tanggal
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
                                            onChange={(e) => setEndDate(e.target.value)} // Simpan hanya tanggal
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        {(selectedDomisiliDetail?.tanggal_keluar == null || selectedDomisiliDetail?.tanggal_keluar == "-" || !selectedDomisiliDetail?.tanggal_keluar) && (
                                            <Access action="edit">
                                                <button
                                                    type="button"
                                                    disabled={loadingUpdateDomisili}
                                                    className={`px-4 py-2 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${loadingUpdateDomisili ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                                                    onClick={handleUpdate}
                                                >
                                                    {loadingUpdateDomisili ? (
                                                        <i className="fas fa-spinner fa-spin text-2xl text-white w-13"></i>
                                                    ) :
                                                        "Update"
                                                    }
                                                </button>
                                            </Access>
                                        )}
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none cursor-pointer"
                                            onClick={() => {
                                                setSelectedDomisiliId(null);
                                                setSelectedDomisiliDetail(null);
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

export default TabDomisiliSantri;