import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchKitab = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [kitab, setKitab] = useState(() => {
        const stored = sessionStorage.getItem("kitabData");
        return stored ? JSON.parse(stored) : [];
    });

    const [loadingKitab, setLoadingKitab] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKitab = useCallback(async () => {
        setLoadingKitab(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}kitab`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const result = await response.json();

            const dataArray = Array.isArray(result) ? result : [];
        
            setKitab(dataArray);
            sessionStorage.setItem("kitabData", JSON.stringify(dataArray));
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKitab([]);
        } finally {
            setLoadingKitab(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        fetchKitab();
    }, [fetchKitab]);

    const handleToggleStatus = async (data) => {
            const confirmResult = await Swal.fire({
                title: data.status == 1 ? "Nonaktifkan Data?" : "Aktifkan Data?",
                text: data.status == 1
                    ? "Data akan dinonaktifkan."
                    : "Data akan diaktifkan kembali.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: data.status == 1 ? "Ya, nonaktifkan" : "Ya, aktifkan",
                cancelButtonText: "Batal",
            });
    
            if (!confirmResult.isConfirmed) return;
    
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
                    `${API_BASE_URL}${data.status == 1 ? `non-aktiv/${data.id}` : `aktiv/${data.id}`}`,
                    {
                        method: data.status == 1 ? "DELETE" : "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
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
    
                if (!response.ok) {
                    let result = {};
                    try {
                        result = await response.json();
                    // eslint-disable-next-line no-empty, no-unused-vars
                    } catch (_) { }
                    throw new Error(result.message || "Gagal memperbarui status data.");
                }
    
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: data.status == 1
                        ? "Data berhasil dinonaktifkan."
                        : "Data berhasil diaktifkan.",
                });
                
                sessionStorage.removeItem("kitabData");
                fetchKitab();
            } catch (error) {
                console.error("Error saat mengubah status:", error);
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: error.message || "Terjadi kesalahan saat memperbarui status data.",
                });
            }
        };

    return {
        kitab,
        loadingKitab,
        error,
        fetchKitab,
        handleToggleStatus
    };
};

export default useFetchKitab;
