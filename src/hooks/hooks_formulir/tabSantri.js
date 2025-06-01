import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useSantri = (biodata_id) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [santriList, setSantriList] = useState([]);
    const [selectedSantriId, setSelectedSantriId] = useState(null);
    const [selectedSantriDetail, setSelectedSantriDetail] = useState(null);
    const [angkatanId, setAngkatanId] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState(false);

    const [loadingSantri, setLoadingSantri] = useState(true);
    const [loadingDetailSantri, setLoadingDetailSantri] = useState(null);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchSantri = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(false);
            setLoadingSantri(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/santri`, {
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
            setSantriList(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data santri:", error);
            setError(true);
        } finally {
            setLoadingSantri(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);

    // Ambil data santri pertama kali
    useEffect(() => {
        fetchSantri();
    }, [fetchSantri]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailSantri(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/santri/show`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
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
            console.log(result);
            
            setSelectedSantriId(id);
            setSelectedSantriDetail(result.data);
            setAngkatanId(result.data.angkatan_id || "");
            setEndDate(result.data.tanggal_keluar || "");
            setStartDate(result.data.tanggal_masuk || "");
            setStatus(result.data.status || "");
        } catch (error) {
            console.error("Gagal mengambil detail santri:", error);
        } finally {
            setLoadingDetailSantri(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedSantriDetail) return;

        const payload = {
            angkatan_id: angkatanId,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null,
            status: status || null,
        };

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang memperbarui data santri.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedSantriId}/santri`,
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
            Swal.close();
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
            if (!("data" in result)) {
              await Swal.fire({
                icon: "error",
                title: "Gagal",
                html: `<div style="text-align: left;">${
                  result.message || "Gagal memperbarui data pengurus."
                }</div>`,
              });
              return;
            }
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data berhasil diperbarui!',
                    timer: 2000,
                    showConfirmButton: false,
                });                
                setSelectedSantriDetail(result.data || payload);
                fetchSantri();
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

    return {
        error,
        fetchSantri,
        santriList,
        selectedSantriId,
        selectedSantriDetail,
        angkatanId,
        endDate,
        startDate,
        status,
        loadingSantri,
        loadingDetailSantri,
        setAngkatanId,
        setEndDate,
        setStartDate,
        setStatus,
        setSelectedSantriDetail,
        setSelectedSantriId,
        handleCardClick,
        handleUpdate,
    };
};
