import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchLembaga = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [lembaga, setLembaga] = useState([]);
    const [loadingLembaga, setLoadingLembaga] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchLembaga = useCallback(async () => {
        setLoadingLembaga(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/lembaga`, {
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

            setLembaga(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setLembaga([]);
        } finally {
            setLoadingLembaga(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        fetchLembaga();
    }, [fetchLembaga]);

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
                title: "Mohon tunggu...",
                html: "Menghapus data...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}crud/${id}/lembaga`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            await Swal.close();

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
                // Jika bukan 204 dan error, coba ambil response body
                let result = {};
                try {
                    result = await response.json();
                // eslint-disable-next-line no-empty, no-unused-vars
                } catch (_) { }
                throw new Error(result.message || "Gagal menghapus data.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil dihapus.",
            });

            fetchLembaga();
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
        lembaga,
        loadingLembaga,
        error,
        fetchLembaga,
        handleDelete
    };
};

export default useFetchLembaga;
