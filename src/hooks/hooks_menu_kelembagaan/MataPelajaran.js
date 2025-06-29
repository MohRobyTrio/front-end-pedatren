import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchMataPelajaran = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [mataPelajaran, setMataPelajaran] = useState([]);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataMaPel, setTotalDataMaPel] = useState(0);
    const [loadingMataPelajaran, setLoadingMataPelajaran] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchMataPelajaran = useCallback(async () => {
        setLoadingMataPelajaran(true);
        setError(null);
        let url = `${API_BASE_URL}formulir/mata-pelajaran?page=${currentPage}&limit=${limit}`;

        if (debouncedSearchTerm) url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;

        try {
            const response = await fetch(url, {
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

            setMataPelajaran(Array.isArray(result.data) ? result.data : []);
            setTotalPages(result.total_pages || 1);
            setTotalDataMaPel(result.total_data || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setMataPelajaran([]);
        } finally {
            setLoadingMataPelajaran(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentPage, debouncedSearchTerm, limit, navigate, token]);

    useEffect(() => {
        fetchMataPelajaran();
    }, [fetchMataPelajaran]);

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: "Yakin ingin menghapus data ini?",
            text: "Data yang sudah dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
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
            const response = await fetch(`${API_BASE_URL}formulir/${id}/mata-pelajaran`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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

            if (!response.ok) {
                let result = {};
                try {
                    result = await response.json();
                // eslint-disable-next-line no-empty, no-unused-vars
                } catch (_) {}
                throw new Error(result.message || "Gagal menghapus data.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil dihapus.",
            });

            fetchMataPelajaran();
        } catch (error) {
            console.error("Error saat menghapus:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat menghapus data.",
            });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        mataPelajaran,
        loadingMataPelajaran,
        searchTerm,
        setSearchTerm,
        error,
        fetchMataPelajaran,
        handleDelete,
        limit,
        setLimit,
        totalPages,
        currentPage,
        setCurrentPage,
        totalDataMaPel
    };
};

export default useFetchMataPelajaran;
