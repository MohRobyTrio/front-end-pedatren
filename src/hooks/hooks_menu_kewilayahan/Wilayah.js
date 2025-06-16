import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchWilayah = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [wilayah, setWilayah] = useState([]);
    const [loadingWilayah, setLoadingWilayah] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataWilayah, setTotalDataWilayah] = useState(0);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchWilayah = useCallback(async () => {
        setLoadingWilayah(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}crud/wilayah?page=${currentPage}&per_page=${limit}`;
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("fetch ke",url);
            

            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();

            setWilayah(data.data || []);
            setTotalPages(data.last_page || 1);
            setTotalDataWilayah(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setWilayah([]);
        } finally {
            setLoadingWilayah(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, token]);

    useEffect(() => {
        fetchWilayah();
    }, [fetchWilayah]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Hapus Data?",
            text: "Data yang dihapus tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: "Menghapus...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(`${API_BASE_URL}crud/wilayah/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.close();

            if (!response.ok) throw new Error("Gagal menghapus data.");

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil dihapus.",
            });

            fetchWilayah();
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan saat menghapus.",
            });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return { wilayah, loadingWilayah, error, fetchWilayah, handleDelete, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataWilayah };
};

export default useFetchWilayah;
