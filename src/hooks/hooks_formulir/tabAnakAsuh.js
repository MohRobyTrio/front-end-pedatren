import { useCallback, useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useAnakAsuh = ({ biodata_id, setShowAddModal, setFeature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [anakAsuhList, setAnakAsuhList] = useState([]);
    const [loadingAnakAsuh, setLoadingAnakAsuh] = useState(false);
    const [loadingDetailAnakAsuhId, setLoadingDetailAnakAsuhId] = useState(null);
    const [santriId, setSantriId] = useState(null);

    const [selectedAnakAsuhId, setSelectedAnakAsuhId] = useState(null);
    const [selectedAnakAsuhDetail, setSelectedAnakAsuhDetail] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [waliAsuhId, setWaliAsuhId] = useState("");
    const [nis, setNis] = useState("");
    const [error, setError] = useState(false);

    const [menuWaliAsuh, setMenuWaliAsuh] = useState([]);
    const [loadingWaliAsuh, setLoadingWaliAsuh] = useState(false);
    const [errorWaliAsuh, setErrorWaliAsuh] = useState(false);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchDropdownWali = useCallback(async () => {
        try {
            setLoadingWaliAsuh(true);
            setErrorWaliAsuh(false);

            const response = await fetch(`${API_BASE_URL}dropdown/waliasuh`, {
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
            setMenuWaliAsuh(result || []);
        } catch (error) {
            console.error("Gagal memuat data wali asuh:", error);
            setErrorWaliAsuh(true);
        } finally {
            setLoadingWaliAsuh(false);
        }
    }, [token]);

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
            if (result.data && result.data.length > 0) {
                const santriAktif = result.data.find(item => item.status === "aktif");
                if (santriAktif) {
                    setSantriId(santriAktif.id);
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data Santri:", error);
        }
    }, [biodata_id, token]);

    const fetchAnakAsuh = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(false);
            setLoadingAnakAsuh(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/anakasuh`, {
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
                throw new Error(`Gagal fetch: ${response.status}`);
            }
            const result = await response.json();
            setAnakAsuhList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Anak Asuh:", error);
            setError(true);
        } finally {
            setLoadingAnakAsuh(false);
        }
    }, [biodata_id, token]);

    useEffect(() => {
        fetchSantriId();
        fetchAnakAsuh();
        fetchDropdownWali();
    }, [fetchSantriId, fetchAnakAsuh, fetchDropdownWali]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailAnakAsuhId(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/anakasuh/show`, {
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
            setSelectedAnakAsuhId(id);
            setSelectedAnakAsuhDetail(result.data);
            setEndDate(result.data.tanggal_akhir || "");
            setStartDate(result.data.tanggal_mulai || "");
            setWaliAsuhId(result.data.id_wali_asuh || "");
            setNis(result.data.nis || "");
        } catch (error) {
            console.error("Gagal mengambil detail Anak Asuh:", error);
        } finally {
            setLoadingDetailAnakAsuhId(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedAnakAsuhDetail || !santriId) return;

        const payload = {
            // id_santri: santriId,
            id_wali_asuh: waliAsuhId,
            tanggal_mulai: startDate,
            nis: nis || null
        };

        try {
            Swal.fire({
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'p-0 shadow-none border-0 bg-transparent'
                }
            });
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedAnakAsuhId}/anakasuh`,
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
                setSelectedAnakAsuhDetail(result.data || payload);
                fetchAnakAsuh();
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
        setSelectedAnakAsuhId(id);
        setFeature(featureNum);
        setShowAddModal(true);
    };

    return {
        error,
        anakAsuhList,
        loadingAnakAsuh,
        fetchAnakAsuh,
        handleCardClick,
        loadingDetailAnakAsuhId,
        selectedAnakAsuhDetail,
        setSelectedAnakAsuhDetail,
        selectedAnakAsuhId,
        setSelectedAnakAsuhId,
        startDate,
        endDate,
        waliAsuhId,
        nis,
        setStartDate,
        setEndDate,
        setWaliAsuhId,
        setNis,
        handleUpdate,
        handleOpenAddModalWithDetail,
        santriId,
        menuWaliAsuh,
        loadingWaliAsuh,
        errorWaliAsuh,
        fetchDropdownWali
    };
};