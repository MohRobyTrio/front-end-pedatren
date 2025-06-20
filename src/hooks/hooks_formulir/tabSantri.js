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
    const [originalEndDate, setOriginalEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);

    const [loadingSantri, setLoadingSantri] = useState(true);
    const [loadingDetailSantri, setLoadingDetailSantri] = useState(null);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchSantri = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(null);
            setLoadingSantri(true);
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
            if (response.status == 403) {
                throw new Error("403");
            }
            if (!response.ok) {
            // Misalnya response.status === 500
                throw new Error(`Gagal fetch: ${response.status}`);
            }

            const result = await response.json();
            setSantriList(result.data || []);
            setError(null);
        } catch (err) {
            if (err.message == 403) {
                setError("Akses ditolak: Anda tidak memiliki izin untuk melihat data ini.");
            } else {
                setError("Terjadi kesalahan saat mengambil data.");
            }
            console.error("Gagal mengambil data santri:", error);
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
            
            setSelectedSantriId(id);
            setSelectedSantriDetail(result.data);
            setAngkatanId(result.data.angkatan_id || "");
            const rawTanggalKeluar = result.data.tanggal_keluar;

const formattedDatetimeLocal = rawTanggalKeluar
    ? new Date(rawTanggalKeluar).toISOString().slice(0, 16) // "YYYY-MM-DDTHH:MM"
    : "";
    
setEndDate(formattedDatetimeLocal);
setOriginalEndDate(formattedDatetimeLocal);

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

        // Konfirmasi jika endDate diisi
        if (endDate && endDate !== originalEndDate) {
            const warningResult = await Swal.fire({
                title: "Perhatian",
                text: "Pengisian Tanggal Keluar akan mengubah data domisili santri.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Lanjutkan",
                cancelButtonText: "Batal",
            });

            if (!warningResult.isConfirmed) {
                return;
            }
        }

        // Konfirmasi umum sebelum update
        const confirmUpdate = await Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin memperbarui data santri?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, perbarui",
            cancelButtonText: "Batal",
        });

        if (!confirmUpdate.isConfirmed) {
            return;
        }

        const payload = {
            angkatan_id: angkatanId,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null,
            status: status || null,
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
