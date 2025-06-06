import { useCallback, useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useKhadam = ({ biodata_id, setShowAddModal, setFeature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [khadamList, setKhadamList] = useState([]);
    const [loadingKhadam, setLoadingKhadam] = useState(false);
    const [loadingDetailKhadamId, setLoadingDetailKhadamId] = useState(null);

    const [selectedKhadamId, setSelectedKhadamId] = useState(null);
    const [selectedKhadamDetail, setSelectedKhadamDetail] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKhadam = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(null);
            setLoadingKhadam(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/khadam`, {
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
            if (response.status === 403) {
                throw new Error("403");
            }
            if (!response.ok) {
            // Misalnya response.status === 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }

            const result = await response.json();
            setKhadamList(result.data || []);
            setError(null);
        } catch (err) {
            if (err.message == 403) {
                setError("Akses ditolak: Anda tidak memiliki izin untuk melihat data ini.");
            } else {
                setError("Terjadi kesalahan saat mengambil data.");
            }
            console.error("Gagal mengambil data Khadam:", error);
        } finally {
            setLoadingKhadam(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);

    useEffect(() => {
        fetchKhadam();
    }, [fetchKhadam]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailKhadamId(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/khadam/show`, {
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
            setSelectedKhadamId(id);
            setSelectedKhadamDetail(result.data);
            setEndDate(result.data.tanggal_akhir || "");
            setStartDate(result.data.tanggal_mulai || "");
            setKeterangan(result.data.keterangan || "");
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
        } finally {
            setLoadingDetailKhadamId(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedKhadamDetail) return;

        const payload = {
            keterangan: keterangan || null,
            tanggal_mulai: startDate,
        };

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang memperbarui data khadam.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedKhadamId}/khadam`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
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
            const result = await response.json();
            Swal.close();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data berhasil diperbarui!',
                    timer: 2000,
                    showConfirmButton: false,
                });                   setSelectedKhadamDetail(result.data || payload);
                fetchKhadam();
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
    };

    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        try {
            setSelectedKhadamId(id);
            setFeature(featureNum);
            setShowAddModal(true);
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
        }
    };

    return {
        error,
        khadamList,
        loadingKhadam,
        fetchKhadam,
        handleCardClick,
        loadingDetailKhadamId,
        selectedKhadamDetail,
        setSelectedKhadamDetail,
        selectedKhadamId,
        setSelectedKhadamId,
        startDate,
        endDate,
        keterangan,
        setStartDate,
        setEndDate,
        setKeterangan,
        handleUpdate,
        handleOpenAddModalWithDetail
    };
};
