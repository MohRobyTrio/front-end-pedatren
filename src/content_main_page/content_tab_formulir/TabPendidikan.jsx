import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { ModalAddPendidikanFormulir, ModalKeluarPendidikanFormulir } from "../../components/modal/modal_formulir/ModalFormPendidikan";
import useLogout from "../../hooks/Logout";
import Swal from "sweetalert2";
import DropdownAngkatan from "../../hooks/hook_dropdown/DropdownAngkatan";
import Access from "../../components/Access";
import { hasAccess } from "../../utils/hasAccess";

const TabPendidikan = () => {
    const { biodata_id } = useParams();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const canEdit = hasAccess("edit");
    const canPindah = hasAccess("pindah");
    const canKeluar = hasAccess("keluar");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [pendidikanList, setPendidikanList] = useState([]);
    const [selectedPendidikanId, setSelectedPendidikanId] = useState(null);
    const [selectedPendidikanDetail, setSelectedPendidikanDetail] = useState(null);
    const [noInduk, setNoInduk] = useState("");
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [angkatanId, setAngkatanId] = useState("");
    const [status, setStatus] = useState("");
    const [feature, setFeature] = useState(null);

    const [loadingPendidikan, setLoadingPendidikan] = useState(true);
    const [loadingDetailPendidikan, setLoadingDetailPendidikan] = useState(null);
    const [loadingUpdatePendidikan, setLoadingUpdatePendidikan] = useState(false);

    const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();
    const { menuAngkatanPelajar } = DropdownAngkatan();

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
            setPendidikanList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Pendidikan:", error);
        } finally {
            setLoadingPendidikan(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id]);

    useEffect(() => {
        fetchPendidikan();
    }, [fetchPendidikan]);

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

            setSelectedPendidikanId(id);
            setSelectedPendidikanDetail(result.data);
            setNoInduk(result.data.no_induk || "");
            setEndDate(result.data.tanggal_keluar === "-" ? null : result.data.tanggal_keluar);
            setStartDate(result.data.tanggal_masuk || "");
            setStatus(result.data.status || "");
            setAngkatanId(result.data.nama_angkatan || "");

            // Set dropdown values berdasarkan nama (cari ID berdasarkan nama)
            // const dropdownValues = {};

            // // Cari ID berdasarkan nama lembaga
            // if (result.data.nama_lembaga) {
            //     const lembagaOption = filterLembaga.lembaga.find(item => item.label === result.data.nama_lembaga);
            //     if (lembagaOption) {
            //         dropdownValues.lembaga = lembagaOption.value;
            //     }
            // }

            // // Cari ID berdasarkan nama jurusan
            // if (result.data.nama_jurusan) {
            //     const jurusanOption = filterLembaga.jurusan.find(item => item.label === result.data.nama_jurusan);
            //     if (jurusanOption) {
            //         dropdownValues.jurusan = jurusanOption.value;
            //     }
            // }

            // // Cari ID berdasarkan nama kelas
            // if (result.data.nama_kelas) {
            //     const kelasOption = filterLembaga.kelas.find(item => item.label === result.data.nama_kelas);
            //     if (kelasOption) {
            //         dropdownValues.kelas = kelasOption.value;
            //     }
            // }

            // // Cari ID berdasarkan nama rombel
            // if (result.data.nama_rombel) {
            //     const rombelOption = filterLembaga.rombel.find(item => item.label === result.data.nama_rombel);
            //     if (rombelOption) {
            //         dropdownValues.rombel = rombelOption.value;
            //     }
            // }

            console.log('Data from API:', result.data);
            // console.log('Dropdown values to set:', dropdownValues);
            // console.log('Available options:', filterLembaga);

            // // Jika ada setSelectedLembaga function, gunakan itu
            // if (setSelectedLembaga && typeof setSelectedLembaga === 'function') {
            //     setSelectedLembaga(dropdownValues);
            // } else {
            //     // Gunakan handleFilterChangeLembaga secara bertahap dengan delay
            //     const setDropdownValues = async () => {
            //         if (dropdownValues.lembaga) {
            //             await handleFilterChangeLembaga({ lembaga: dropdownValues.lembaga });

            //             // Tunggu sebentar untuk memastikan jurusan options ter-load
            //             setTimeout(() => {
            //                 if (dropdownValues.jurusan) {
            //                     handleFilterChangeLembaga({ jurusan: dropdownValues.jurusan });

            //                     setTimeout(() => {
            //                         if (dropdownValues.kelas) {
            //                             handleFilterChangeLembaga({ kelas: dropdownValues.kelas });

            //                             setTimeout(() => {
            //                                 if (dropdownValues.rombel) {
            //                                     handleFilterChangeLembaga({ rombel: dropdownValues.rombel });
            //                                 }
            //                             }, 50);
            //                         }
            //                     }, 50);
            //                 }
            //             }, 100);
            //         }
            //     };

            //     setDropdownValues();
            // }
        } catch (error) {
            console.error("Gagal mengambil detail Pendidikan:", error);
        } finally {
            setLoadingDetailPendidikan(null);
        }
    };

    useEffect(() => {
        // Saat selectedFilterLembaga diisi, panggil handleFilterChangeLembaga secara bertahap
        if (selectedPendidikanDetail) {
            if (selectedPendidikanDetail.nama_lembaga) {
                handleFilterChangeLembaga({ lembaga: selectedPendidikanDetail.nama_lembaga });
            }
            if (selectedPendidikanDetail.nama_jurusan) {
                handleFilterChangeLembaga({ jurusan: selectedPendidikanDetail.nama_jurusan });
            }
            if (selectedPendidikanDetail.nama_kelas) {
                handleFilterChangeLembaga({ kelas: selectedPendidikanDetail.nama_kelas });
            }
            if (selectedPendidikanDetail.nama_rombel) {
                handleFilterChangeLembaga({ rombel: selectedPendidikanDetail.nama_rombel });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPendidikanDetail]);

    const handleUpdate = async () => {
        if (!selectedPendidikanDetail) return;

        const { lembaga, jurusan, kelas, rombel } = selectedLembaga;

        if (!lembaga || !noInduk || !startDate) {
            await Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: "Lembaga, Nomor Induk, dan Tanggal Mulai wajib diisi",
            });
            return;
        }

        const confirmed = await Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin memperbarui data pendidikan ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, update!",
            cancelButtonText: "Batal",
        });

        if (!confirmed.isConfirmed) return;

        const payload = {
            lembaga_id: lembaga,
            jurusan_id: jurusan || null,
            kelas_id: kelas || null,
            rombel_id: rombel || null,
            no_induk: noInduk,
            angkatan_id: angkatanId,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate,
            status: status
        };

        console.log("Payload:", payload);


        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang proses update data pendidikan.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
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
            if (response.status === 401) {
                Swal.close();
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
            
            if (response.ok) {
                const errorMessages = [
                    "Tanggal keluar tidak boleh diisi jika status santri masih aktif",
                    // tambahkan pesan validasi lain yang mungkin muncul
                ];

                const isErrorMessage = errorMessages.some(msg =>
                    result.message?.toLowerCase().includes(msg.toLowerCase())
                );

                if (isErrorMessage) {
                    await Swal.fire({
                        icon: "error",
                        title: "Validasi gagal",
                        text: result.message,
                    });
                    setEndDate(null);
                } else {
                    await Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: result.message || "Data pendidikan berhasil diperbarui!",
                    });
                    setSelectedPendidikanDetail(result.data || payload);
                    fetchPendidikan();
                }
                setSelectedPendidikanDetail(result.data || payload);
                fetchPendidikan();
            } else {
                if (result.errors) {
                    let errMsg = "";
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        errMsg += `${field}: ${messages.join(", ")}\n`;
                    });
                    await Swal.fire({
                        icon: "error",
                        title: "Gagal update",
                        text: errMsg,
                    });
                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Gagal update",
                        text: result.message || "Terjadi kesalahan",
                    });
                }
            }
        } catch (error) {
            Swal.close();
            console.error("Error saat update:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Terjadi kesalahan saat mengupdate data. Silakan coba lagi.",
            });
        } finally {
            setLoadingUpdatePendidikan(false);
        }
    };

    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        try {
            setSelectedPendidikanId(id);
            setFeature(featureNum);
            setShowAddModal(true);
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
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

    console.log("selectedPendidikanId:", selectedPendidikanId);


    const Filters = ({ filterOptions, onChange, selectedFilters }) => {
        return (
            <div className="flex flex-col gap-4 w-full">
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div key={`${label}-${index}`}>
                        <label htmlFor={label} className="block text-sm font-medium text-gray-700">
                            {capitalizeFirst(label)} {label === 'lembaga' ? '*' : ''}
                        </label>
                        <select
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 || !canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? 'bg-gray-200 text-gray-500' : ''}`}
                            onChange={(e) => onChange({ [label]: e.target.value })}
                            value={selectedFilters[label] || ""}
                            disabled={options.length <= 1 || !canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")}
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
            <ModalAddPendidikanFormulir
                isOpen={showAddModal}
                onClose={closeAddModal}
                biodataId={biodata_id}
                cardId={selectedPendidikanId}
                refetchData={fetchPendidikan}
                feature={feature}
            />
            {/* )} */}

            {/* {showOutModal && ( */}
            <ModalKeluarPendidikanFormulir
                isOpen={showOutModal}
                onClose={closeOutModal}
                id={selectedPendidikanId}
                refetchData={fetchPendidikan}
            />
            {/* )} */}

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
                            className="bg-white shadow-md drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
                            onClick={() => handleCardClick(pendidikan.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h5 className="text-lg font-bold">{pendidikan.nama_lembaga} - {pendidikan.nama_jurusan}</h5>
                                    {/* <p className="text-gray-600 text-sm">Jurusan: {pendidikan.nama_jurusan || '-'}</p> */}
                                    {/* <p className="text-gray-600 text-sm">Kelas: {pendidikan.nama_kelas || '-'}</p> */}
                                    {/* <p className="text-gray-600 text-sm">Rombel: {pendidikan.nama_rombel || '-'}</p> */}
                                    <p className="text-gray-600 text-sm">No. Induk : {pendidikan.no_induk}</p>
                                    <p className="text-gray-600 text-sm">
                                        Sejak : {formatDate(pendidikan.tanggal_masuk)}
                                        {pendidikan.tanggal_keluar ? ` s/d ${formatDate(pendidikan.tanggal_keluar)}` : ' - Sekarang'}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${pendidikan.status === "aktif"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {pendidikan.status &&
                                        pendidikan.status[0].toUpperCase() + pendidikan.status.slice(1)
                                    }
                                </span>
                            </div>

                            {!pendidikan.tanggal_keluar && (
                                                                <div className={`flex flex-wrap gap-2 gap-x-4 ${canPindah || canKeluar ? "" : "mt-2"}`}>
                                    <Access action="pindah">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenAddModalWithDetail(pendidikan.id, 2);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                                        title="Pindah Pendidikan"
                                    >
                                        <FontAwesomeIcon icon={faArrowRightArrowLeft} />Pindah
                                    </button>
                                    </Access>
                                    <Access action="keluar">
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
                                    </Access>
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

                                    <div>
                                        <label htmlFor="angkatan_id" className="block text-sm font-medium text-gray-700">
                                            Angkatan *
                                        </label>
                                        <select
                                            id="angkatan_id"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? "bg-gray-200 text-gray-500" : ""}`}
                                            onChange={(e) => setAngkatanId(e.target.value)}
                                            value={angkatanId}
                                            disabled={!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")} 
                                            required
                                        >
                                            {menuAngkatanPelajar.map((pelajar, idx) => (
                                                <option key={idx} value={pelajar.value}>
                                                    {pelajar.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Tanggal Mulai *
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")}
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
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? "bg-gray-200 text-gray-500" : ""}`}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            disabled={!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti") ? "bg-gray-200 text-gray-500" : ""}`}
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            disabled={!canEdit && (selectedPendidikanDetail?.status !== "aktif" || selectedPendidikanDetail?.status !== "cuti")}
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="aktif">Aktif</option>
                                            <option value="do">Drop Out</option>
                                            <option value="berhenti">Berhenti</option>
                                            <option value="lulus">Lulus</option>
                                            <option value="pindah">Pindah</option>
                                            <option value="cuti">Cuti</option>
                                            <option value="naik_kelas">Naik Kelas</option>
                                            <option value="nonaktif">Non Aktif</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        {pendidikan.status === "aktif" && (
                                            <Access action="edit">
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
                                            </Access>
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