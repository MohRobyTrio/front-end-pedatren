import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchRoles = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [error, setError] = useState(null);
    // const [limit, setLimit] = useState(25);
    // const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalDataRoles, setTotalDataRoles] = useState(0);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchRoles = useCallback(async () => {
        setLoadingRoles(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}roles`, {
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

            setRoles(data);
            // setTotalPages(data.last_page || 1);
            // setTotalDataRoles(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setRoles([]);
        } finally {
            setLoadingRoles(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, navigate, token]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

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
            const response = await fetch(`${API_BASE_URL}roles/${id}`, {
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

            sessionStorage.removeItem("menuRoles");
            fetchRoles();
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
        roles,
        loadingRoles,
        error,
        fetchRoles,
        handleDelete,
        currentPage, setCurrentPage,
    };
};

export default useFetchRoles;