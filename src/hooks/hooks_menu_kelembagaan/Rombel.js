import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import DropdownLembaga from "../hook_dropdown/DropdownLembaga";

const useFetchRombel = () => {
    const { clearAuthData } = useLogout();
    const { forceFetchDropdownLembaga } = DropdownLembaga();
    const navigate = useNavigate();
    const [rombel, setRombel] = useState([]);
    const [loadingRombel, setLoadingRombel] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataRombel, setTotalDataRombel] = useState(0);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchRombel = useCallback(async () => {
        setLoadingRombel(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/rombel?page=${currentPage}&per_page=${limit}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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

            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();

            setRombel(data.data);
            setTotalPages(data.last_page || 1);
            setTotalDataRombel(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setRombel([]);
        } finally {
            setLoadingRombel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, navigate, token]);

    useEffect(() => {
        fetchRombel();
    }, [fetchRombel]);

    const handleToggleStatus = async (data) => {
        const confirmResult = await Swal.fire({
            title: data.status ? "Nonaktifkan Data?" : "Aktifkan Data?",
            text: data.status
                ? "Data akan dinonaktifkan."
                : "Data akan diaktifkan kembali.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: data.status ? "Ya, nonaktifkan" : "Ya, aktifkan",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                title: "Mohon tunggu...",
                html: data.status ? "Menonaktifkan data..." : "Mengaktifkan data...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(
                `${API_BASE_URL}crud/rombel/${data.id}${data.status ? "" : "/activate"}`,
                {
                    method: data.status ? "DELETE" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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

            forceFetchDropdownLembaga();
            fetchRombel(); // refresh data
        } catch (error) {
            console.error("Error saat mengubah status:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui status data.",
            });
        }
    };

    const fetchRombelDetail = async (id) => {
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
            const response = await fetch(`${API_BASE_URL}crud/rombel/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            Swal.close();
            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                return null;
            }

            const result = await response.json();
            console.log("rombel detail", result);


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

    return {
        rombel,
        loadingRombel,
        error,
        fetchRombel,
        fetchRombelDetail,
        handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataRombel
    };
};

export default useFetchRombel;
