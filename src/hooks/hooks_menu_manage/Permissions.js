import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchPermissions = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [error, setError] = useState(null);
    // const [limit, setLimit] = useState(25);
    // const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalDataPermissions, setTotalDataPermissions] = useState(0);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchPermissions = useCallback(async () => {
        setLoadingPermissions(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}permissions`, {
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
            const data = await response.json();

            setPermissions(data);
            // setTotalPages(data.last_page || 1);
            // setTotalDataPermissions(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPermissions([]);
        } finally {
            setLoadingPermissions(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, navigate, token]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

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

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}permissions/${id}`, {
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

            sessionStorage.removeItem("menuPermissions");
            fetchPermissions();
        } catch (error) {
            console.error("Error saat menghapus:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat menghapus data.",
            });
        }
    };

    return {
        permissions,
        loadingPermissions,
        error,
        fetchPermissions,
        handleDelete,
        currentPage, setCurrentPage,
    };
};

export default useFetchPermissions;