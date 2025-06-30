import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { API_BASE_URL } from "../../hooks/config";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faRightFromBracket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaPlus } from "react-icons/fa";
import { ModalAddPengajarFormulir, ModalKeluarPengajarFormulir } from "../../components/modal/modal_formulir/ModalFormPengajar";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { hasAccess } from "../../utils/hasAccess";
import Access from "../../components/Access";
import DropdownGolonganGabungan from "../../hooks/hook_dropdown/DropdownGolonganGabungan";

const TabPengajar = () => {
    const { biodata_id } = useParams();
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const canEdit = hasAccess("edit");
    const canPindah = hasAccess("pindah");
    const canKeluar = hasAccess("keluar");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [pengajarList, setPengajarList] = useState([]);
    const [selectedPengajarId, setSelectedPengajarId] = useState(null);
    const [selectedPengajarDetail, setSelectedPengajarDetail] = useState(null);
    const [jabatan, setJabatan] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [feature, setFeature] = useState(null);
    const [golongan, setGolongan] = useState("");
    const [error, setError] = useState(null);

    const [loadingPengajar, setLoadingPengajar] = useState(true);
    const [loadingDetailPengajar, setLoadingDetailPengajar] = useState(null);

    const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();
    const { gabunganList } = DropdownGolonganGabungan();

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterLembaga = {
        lembaga: updateFirstOptionLabel(filterLembaga.lembaga, "Pilih Lembaga")
    };

    const fetchPengajar = useCallback(async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");
        if (!biodata_id || !token) return;
        try {
            setError(null);
            setLoadingPengajar(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/pengajar`, {
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
            if (response.status === 403) {
                throw new Error("403");
            }
            if (!response.ok) {
                // Misalnya response.status === 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);

            setPengajarList(result.data || []);
            setError(null);
        } catch (err) {
            if (err.message == 403) {
                setError("Akses ditolak: Anda tidak memiliki izin untuk melihat data ini.");
            } else {
                setError("Terjadi kesalahan saat mengambil data.");
            }
            console.error("Gagal mengambil data Pengajar:", error);
        } finally {
            setLoadingPengajar(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id]);

    useEffect(() => {
        fetchPengajar();
    }, [fetchPengajar]);

    useEffect(() => {
        if (selectedPengajarDetail) {
            if (selectedPengajarDetail.lembaga_id) {
                handleFilterChangeLembaga({ lembaga: selectedPengajarDetail.lembaga_id });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPengajarDetail]);

    useEffect(() => {
        if (selectedPengajarId) {
            handleCardClick(selectedPengajarId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pengajarList]);


    // useEffect(() => {
    //     console.log(golongan);        
    // }, [golongan])

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailPengajar(id);
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${id}/pengajar/show`,
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

            setSelectedPengajarId(id);
            setSelectedPengajarDetail(result.data);
            setGolongan(result.data.golongan_id || "")
            setJabatan(result.data.jabatan_kontrak || "");
            setEndDate(result.data.tanggal_keluar || "");
            setStartDate(result.data.tanggal_masuk || "");
            const formattedMateri = result.data.materi.map(item => ({
                id: item.materi_id || "-",
                kode_mapel: item.kode_mapel || "-",
                nama_mapel: item.nama_mapel || "-",
                status: item.status || "-"
            }));
            setMateriList(formattedMateri || []);
        } catch (error) {
            console.error("Gagal mengambil detail Pengajar:", error);
        } finally {
            setLoadingDetailPengajar(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedPengajarDetail) return;

        const { lembaga } = selectedLembaga;

        if (!lembaga) {
            await Swal.fire({
                icon: 'warning',
                title: 'Lembaga Belum Dipilih',
                text: 'Dropdown Lembaga harus dipilih.',
            });
            return;
        }

        if (materiList.length === 0) {
            await Swal.fire({
                icon: 'warning',
                title: 'Materi Kosong',
                text: 'Minimal satu materi harus ditambahkan.',
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        const payload = {
            lembaga_id: lembaga,
            golongan_id: golongan,
            jabatan: jabatan,
            tahun_masuk: startDate
        };

        console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

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
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedPengajarId}/pengajar`,
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
            console.log(`${API_BASE_URL}formulir/${selectedPengajarId}/pengajar`);
            const result = await response.json();
            console.log(result);

            if (response.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message || "Data berhasil diperbarui.",
                });
                setSelectedPengajarDetail(result.data || payload);
                fetchPengajar();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Memperbarui",
                    text: result.message || "Terjadi kesalahan saat memperbarui data.",
                });
            }
        } catch (error) {
            console.error("Error saat update:", error);
            await Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Gagal menghubungi server. Silakan coba lagi.",
            });
        }
    };

    const [materiList, setMateriList] = useState([])

    const handleAdd = async (formData, materiList) => {
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
            const pengajarId = selectedPengajarId; // asumsi ID pengajar tersedia

            const payload = {
                // ...formData,
                mata_pelajaran: materiList.map(item => ({
                    kode_mapel: item.kode_mapel || null,
                    nama_mapel: item.nama_mapel || null,
                    // jumlah_menit: item.menit ? parseInt(item.menit) : null
                })),
            };

            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/${pengajarId}/pengajar/materi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

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

            const result = await response.json();
            console.log(result);
            if (!response.ok || !("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: center;">${result.message || 'Gagal menambahkan materi.'}</div>`,
                });
                return;
            }

            // Jika berhasil, refresh data
            fetchPengajar();

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Materi berhasil ditambahkan"
            });

            closeAddModal();
        } catch (error) {
            console.error("Gagal menambahkan materi:", error);
            await Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Gagal mengirim data ke server. Silakan coba lagi."
            });
        }
    };


    // const handleRemove = (indexToRemove) => {
    //     const updatedList = materiList.filter((_, index) => index != indexToRemove)
    //     setMateriList(updatedList)
    // }

    const handleRemove = async (indexToRemove, e) => {
        e.preventDefault()
        const materiToRemove = materiList[indexToRemove];
        const pengajarId = selectedPengajarId;
        const materiId = materiToRemove.id;

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
            const token = sessionStorage.getItem("token") || getCookie("token");
            console.log(token);


            console.log(`${API_BASE_URL}formulir/${pengajarId}/pengajar/materi/${materiId}/nonaktifkan`);

            const response = await fetch(`${API_BASE_URL}formulir/${pengajarId}/pengajar/materi/${materiId}/nonaktifkan`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

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

            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                console.log("gagal");

                throw new Error("Gagal menonaktifkan materi");
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: center;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                html: "Materi berhasil dinonaktifkan",
                timer: 1500,
                showConfirmButton: false
            });

            fetchPengajar();
        } catch (error) {
            Swal.close();
            console.error("Error saat menonaktifkan materi:", error);
            Swal.fire({
                icon: "error",
                title: "Terjadi kesalahan",
                text: "Gagal menonaktifkan materi. Silakan coba lagi.",
            });
        }
    }


    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        try {
            setSelectedPengajarId(id);
            setFeature(featureNum);
            setShowAddModal(true);
        } catch (error) {
            console.error("Gagal mengambil detail Pengajar:", error);
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
        setSelectedPengajarId(id);
        setShowOutModal(true);
    };

    const jenisJabatan = [
        { label: "Pilih Jenis jabatan", value: "" },
        { label: "Kultural", value: "kultural" },
        { label: "Tetap", value: "tetap" },
        { label: "Kontrak", value: "kontrak" },
        { label: "Pengkaderan", value: "pengkaderan" }
    ]

    const semuaNonaktif = materiList.every(item => item.status === "tidak aktif");

    return (
        <div className="block" id="Pengajar">
            <h1 className="text-xl font-bold flex items-center justify-between">Pengajar
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

            <ModalAddPengajarFormulir isOpen={showAddModal} onClose={closeAddModal} biodataId={biodata_id} cardId={selectedPengajarId} refetchData={fetchPengajar} feature={feature} handleAddAPI={handleAdd} />

            <ModalKeluarPengajarFormulir isOpen={showOutModal} onClose={closeOutModal} id={selectedPengajarId} refetchData={fetchPengajar} />

            <div className="mt-5 space-y-6">
                {loadingPengajar ? (
                    <div className="flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">{error}</p>
                        {error.includes("Akses ditolak") ? null : (
                            <button
                                onClick={fetchPengajar}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Coba Lagi
                            </button>
                        )}
                    </div>
                ) : pengajarList.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada data</p>
                ) : pengajarList.map((pengajar) => (
                    <div key={pengajar.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-lg drop-shadow rounded-lg p-6 cursor-pointer w-full flex flex-col items-start gap-2"
                            onClick={() => handleCardClick(pengajar.id)}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <h5 className="text-lg font-bold">{pengajar.nama_lembaga}</h5>
                                    <p className="text-gray-600 text-sm">
                                        Sejak {formatDate(pengajar.tanggal_masuk)}{" "}
                                        Sampai {pengajar.tanggal_keluar ? formatDate(pengajar.tanggal_keluar) : "Sekarang"}
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${pengajar.status == "aktif"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {pengajar.status || "-"}
                                </span>
                            </div>

                            {!pengajar.tanggal_keluar && (
                                <div className={`flex flex-wrap gap-2 gap-x-4 ${canPindah || canKeluar ? "" : "mt-2"}`}>
                                    <Access action="pindah">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenAddModalWithDetail(pengajar.id, 2);
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
                                                openOutModal(pengajar.id);
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
                        {loadingDetailPengajar == pengajar.id ? (
                            <div className="flex justify-center items-center mt-4">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : selectedPengajarId == pengajar.id && selectedPengajarDetail && (
                            <form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label htmlFor="lembaga_id" className="block text-sm font-medium text-gray-700">
                                                Lembaga
                                            </label>
                                            <select
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${updatedFilterLembaga.lembaga.length <= 1 || !canEdit || selectedPengajarDetail.status_aktif === "tidak aktif" ? 'bg-gray-200 text-gray-500' : ''}`}
                                                onChange={(e) => handleFilterChangeLembaga({ lembaga: e.target.value })}
                                                value={selectedLembaga.lembaga || ""}
                                                disabled={updatedFilterLembaga.lembaga.length <= 1 || !canEdit || selectedPengajarDetail.status === "tidak aktif"}
                                            >
                                                {updatedFilterLembaga.lembaga.map((lembaga, idx) => (
                                                    <option key={idx} value={lembaga.value}>
                                                        {lembaga.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="golongan_id" className="block text-sm font-medium text-gray-700">
                                                Golongan
                                            </label>
                                            <select
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${gabunganList.length <= 1 || !canEdit || selectedPengajarDetail.status_aktif == "tidak aktif" ? 'bg-gray-200 text-gray-500' : ''}`}
                                                onChange={(e) => setGolongan(e.target.value)}
                                                value={golongan}
                                                disabled={gabunganList.length <= 1 || !canEdit || selectedPengajarDetail.status == "tidak aktif"}
                                            >
                                                {gabunganList.map((golongan, idx) => (
                                                    <option key={idx} value={golongan.id}>
                                                        {golongan.GolonganNama}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700">
                                                Jabatan
                                            </label>
                                            <select
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedPengajarDetail.status_aktif == "tidak aktif" ? 'bg-gray-200 text-gray-500' : ''}`}
                                                onChange={(e) => setJabatan(e.target.value)}
                                                value={jabatan}
                                                disabled={!canEdit || selectedPengajarDetail.status == "tidak aktif"}
                                            >
                                                {jenisJabatan.map((item, idx) => (
                                                    <option key={idx} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">


                                        <div>
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                                Tanggal Masuk
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!canEdit || selectedPengajarDetail.status_aktif == "tidak aktif" ? "bg-gray-200 text-gray-500" : ""}`}
                                                disabled={!canEdit || selectedPengajarDetail?.status == "tidak aktif"}
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                                Tanggal Keluar
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
                                </div>
                                <h1 className="text-black font-bold flex items-center justify-between w-full mb-2">
                                    Materi Ajar
                                    {pengajar.status == "aktif" && (
                                        <Access action="tambah">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFeature(3);
                                                    openAddModal();
                                                    console.log("add");
                                                }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded w-12 hover:bg-blue-800 cursor-pointer"
                                            >
                                                <FaPlus />
                                            </button>
                                        </Access>
                                    )}
                                </h1>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                            <tr>
                                                <th className="px-3 py-2 border-b">No</th>
                                                <th className="px-3 py-2 border-b">Kode Mapel</th>
                                                <th className="px-3 py-2 border-b">Nama Mapel</th>
                                                <th className="px-3 py-2 border-b">Status</th>
                                                {pengajar.status == "aktif" && !semuaNonaktif && (
                                                    <Access action="delete">
                                                        <th className="px-3 py-2 border-b">Aksi</th>
                                                    </Access>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-800">
                                            {materiList.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                    <td className="px-3 py-2 border-b">{index + 1}</td>
                                                    <td className="px-3 py-2 border-b">{item.kode_mapel}</td>
                                                    <td className="px-3 py-2 border-b">{item.nama_mapel}</td>
                                                    <td className="px-3 py-2 border-b"><span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status == 1
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {item.status == 1 ? "Aktif" : "Nonaktif"}
                                                    </span></td>
                                                    {pengajar.status == "aktif" && !semuaNonaktif && (
                                                        <Access action="delete">
                                                            <td className="px-3 py-2 border-b">
                                                                {item.status == 1 && (
                                                                    <button
                                                                        onClick={(e) => handleRemove(index, e)}
                                                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </Access>
                                                    )}
                                                </tr>
                                            ))}
                                            {materiList.length == 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-6">Belum Ada Materi</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        {pengajar.status == "aktif" && (
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
                                                setSelectedPengajarId(null);
                                                setSelectedPengajarDetail(null);
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

export default TabPengajar;
