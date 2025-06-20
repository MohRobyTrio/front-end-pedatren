import { useCallback, useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useWaliAsuh = ({ biodata_id, setShowAddModal, setFeature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [waliAsuhList, setWaliAsuhList] = useState([]);
    const [loadingWaliAsuh, setLoadingWaliAsuh] = useState(false);
    const [loadingDetailWaliAsuhId, setLoadingDetailWaliAsuhId] = useState(null);
    const [santriId, setSantriId] = useState(null);

    const [selectedWaliAsuhId, setSelectedWaliAsuhId] = useState(null);
    const [selectedWaliAsuhDetail, setSelectedWaliAsuhDetail] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [grupWaliAsuhId, setGrupWaliAsuhId] = useState("");
    const [nis, setNis] = useState("");
    const [error, setError] = useState(false);

    const [menuGrupWaliAsuh, setMenuGrupWaliAsuh] = useState([]);
    const [loadingGrupWaliAsuh, setLoadingGrupWaliAsuh] = useState(false);
    const [errorGrupWaliAsuh, setErrorGrupWaliAsuh] = useState(false);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchDropdownGrup = useCallback(async () => {
        try {
            setLoadingGrupWaliAsuh(true);
            setErrorGrupWaliAsuh(false);

            const response = await fetch(`${API_BASE_URL}dropdown/grup`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // console.log("RESPONSE", response.status);


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
            setMenuGrupWaliAsuh(result || []);
            // console.log("HASIL FETCH", result);

        } catch (error) {
            console.error("Gagal memuat data grup kewaliasuhan:", error);
            setErrorGrupWaliAsuh(true);
        } finally {
            setLoadingGrupWaliAsuh(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // useEffect(() => {
    //     fetchDropdownGrup();
    // }, [fetchDropdownGrup]);

    const fetchSantriId = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/santri`, {
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
            const result = await response.json();
            // Ambil ID santri dari data paling baru
            // if (result.data && result.data.length > 0) {
            //     setSantriId(result.data[0].id);
            // }
            // Ambil ID santri dari data yang statusnya "aktif"
            if (result.data && result.data.length > 0) {
                const santriAktif = result.data.find(item => item.status === "aktif");
                if (santriAktif) {
                    setSantriId(santriAktif.id);
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data Santri:", error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);

    const fetchWaliAsuh = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(false);
            setLoadingWaliAsuh(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/waliasuh`, {
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

            if (!response.ok) {
                // Misalnya response.status === 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }
            
            const result = await response.json();
            setWaliAsuhList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Wali Asuh:", error);
            setError(true);
        } finally {
            setLoadingWaliAsuh(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);

    useEffect(() => {
        fetchSantriId();
        fetchWaliAsuh();
        fetchDropdownGrup();
    }, [fetchSantriId, fetchWaliAsuh, fetchDropdownGrup]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailWaliAsuhId(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/waliasuh/show`, {
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
            const result = await response.json();
            setSelectedWaliAsuhId(id);
            setSelectedWaliAsuhDetail(result.data);
            setEndDate(result.data.tanggal_akhir || "");
            setStartDate(result.data.tanggal_mulai || "");
            setGrupWaliAsuhId(result.data.grup || "");
            setNis(result.data.nis || "");
        } catch (error) {
            console.error("Gagal mengambil detail Wali Asuh:", error);
        } finally {
            setLoadingDetailWaliAsuhId(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedWaliAsuhDetail || !santriId) return;

        const payload = {
            id_santri: santriId,
            id_grup_wali_asuh: grupWaliAsuhId,
            tanggal_mulai: startDate,
            nis: nis || null
        };

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
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedWaliAsuhId}/waliasuh`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
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
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data berhasil diperbarui!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setSelectedWaliAsuhDetail(result.data || payload);
                fetchWaliAsuh();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal update',
                    text: result.message || 'Terjadi kesalahan saat memperbarui data',
                });
            }
        } catch (error) {
            console.error("Error saat update:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan saat mengirim permintaan',
            });
        }
        console.log("Payload untuk update:", payload);
        
    };

    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        setSelectedWaliAsuhId(id);
        setFeature(featureNum);
        setShowAddModal(true);
    };

    return {
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
        fetchDropdownGrup
    };
};