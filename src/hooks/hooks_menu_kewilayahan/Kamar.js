import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import DropdownWilayah from "../hook_dropdown/DropdownWilayah";

const useFetchKamar = () => {
    const { clearAuthData } = useLogout();
    const { forceFetchDropdownWilayah } = DropdownWilayah();
    const navigate = useNavigate();
    const [kamar, setKamar] = useState([]);
    const [loadingKamar, setLoadingKamar] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataKamar, setTotalDataKamar] = useState(0);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKamar = useCallback(async () => {
        setLoadingKamar(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}crud/kamar?page=${currentPage}&per_page=${limit}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("fetch ke",url);
            

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
            const data = await response.json();

            setKamar(data.data || []);
            setTotalPages(data.last_page || 1);
            setTotalDataKamar(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKamar([]);
        } finally {
            setLoadingKamar(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, token]);

    useEffect(() => {
        fetchKamar();
    }, [fetchKamar]);

    const handleToggleStatus = async (data) => {
        const confirm = await Swal.fire({
            title: data.status ? "Nonaktifkan Data?" : "Aktifkan Data?",
            text: data.status
                ? "Data akan dinonaktifkan."
                : "Data akan diaktifkan kembali.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: data.status ? "Ya, nonaktifkan" : "Ya, aktifkan",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: data.status ? "Menonaktifkan..." : "Mengaktifkan...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(
                `${API_BASE_URL}crud/kamar/${data.id}${data.status ? "" : "/activate"}`,
                {
                    method: data.status ? "DELETE" : "PUT",
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
                text: data.status
                    ? "Data berhasil dinonaktifkan."
                    : "Data berhasil diaktifkan.",
            });

            forceFetchDropdownWilayah();
            fetchKamar(); // refresh data kamar setelah perubahan status
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan saat memperbarui status.",
            });
        }
    };

    const fetchKamarDetail = async (id) => {
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
            const response = await fetch(`${API_BASE_URL}crud/kamar/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
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
            console.log("kamar detail",result);
            

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            return result;
        } catch (error) {
            console.error("Gagal mengambil detail:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal mengambil data : ${error.message}`,
            });
            return null;
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return { kamar, loadingKamar, error, fetchKamar, fetchKamarDetail, handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataKamar };
};

export default useFetchKamar;
