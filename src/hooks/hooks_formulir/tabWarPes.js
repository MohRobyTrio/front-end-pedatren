import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useWarPes = (biodata_id) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [warPesList, setWarPesList] = useState([]);
    const [selectedWarPesId, setSelectedWarPesId] = useState(null);
    const [selectedWarPesDetail, setSelectedWarPesDetail] = useState(null);
    const [error, setError] = useState(null);
    const [niup, setNiup] = useState("");
    const [aktif, setAktif] = useState("");

    const [loadingWarPes, setLoadingWarPes] = useState(true);
    const [loadingDetailWarPes, setLoadingDetailWarPes] = useState(null);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchWarPes = useCallback(async () => {
        if (!biodata_id || !token) return;
        try {
            setError(null);
            setLoadingWarPes(true);
            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/wargapesantren`, {
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
            setWarPesList(result.data || []);
            setError(null);
        } catch (err) {
            if (err.message == 403) {
                setError("Akses ditolak: Anda tidak memiliki izin untuk melihat data ini.");
            } else {
                setError("Terjadi kesalahan saat mengambil data.");
            }
            console.error("Gagal mengambil data warPes:", error);
        } finally {
            setLoadingWarPes(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);

    // Ambil data wargapesantren pertama kali
    useEffect(() => {
        fetchWarPes();
    }, [fetchWarPes]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailWarPes(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/wargapesantren/show`,
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
            setSelectedWarPesId(id);
            setSelectedWarPesDetail(result.data);
            setNiup(result.data.niup);
            setAktif(result.data.status);
        } catch (error) {
            console.error("Gagal mengambil detail wargapesantren:", error);
        } finally {
            setLoadingDetailWarPes(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedWarPesDetail) return;

        const payload = {
            niup: niup,
            status: aktif,
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
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedWarPesId}/wargapesantren`,
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
            const result = await response.json();
            console.log(result);
            
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
                setSelectedWarPesDetail(result.data || payload);
                fetchWarPes();
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
        fetchWarPes,
        niup,
        setNiup,
        aktif,
        setAktif,
        warPesList,
        selectedWarPesId,
        selectedWarPesDetail,
        loadingWarPes,
        loadingDetailWarPes,
        setSelectedWarPesDetail,
        setSelectedWarPesId,
        handleCardClick,
        handleUpdate,
    };
};
