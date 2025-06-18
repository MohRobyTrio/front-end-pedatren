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

    const handleToggleStatus = async (data) => {
        const isAktif = data.status == 1;
        const actionText = isAktif ? "Nonaktifkan Data?" : "Aktifkan Data?";
        const confirmText = isAktif
            ? "Data akan dinonaktifkan."
            : "Data akan diaktifkan kembali.";

        const confirm = await Swal.fire({
            title: actionText,
            text: confirmText,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: isAktif ? "Ya, Nonaktifkan" : "Ya, aktifkan",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: isAktif ? "Menonaktifkan..." : "Mengaktifkan...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            let response;
            const endpoint = isAktif
                ? `${API_BASE_URL}crud/wilayah/${data.id}`
                : `${API_BASE_URL}crud/wilayah/${data.id}/activate`;

            const method = isAktif ? "DELETE" : "PUT";

            response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.close();

            if (!response.ok) throw new Error("Gagal memproses permintaan.");

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: isAktif ? "Data berhasil dinonaktifkan." : "Data berhasil diaktifkan.",
            });

            fetchWilayah();
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan saat memproses data.",
            });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return { wilayah, loadingWilayah, error, fetchWilayah, handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataWilayah };
};

export default useFetchWilayah;
