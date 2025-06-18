import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchBlok = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [blok, setBlok] = useState([]);
    const [loadingBlok, setLoadingBlok] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataBlok, setTotalDataBlok] = useState(0);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchBlok = useCallback(async () => {
        setLoadingBlok(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}crud/blok?page=${currentPage}&per_page=${limit}`;
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

            setBlok(data.data || []);
            setTotalPages(data.last_page || 1);
            setTotalDataBlok(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setBlok([]);
        } finally {
            setLoadingBlok(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, token]);

    useEffect(() => {
        fetchBlok();
    }, [fetchBlok]);

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

            let response = "";

            if (data.status) {
                // Nonaktifkan (DELETE)
                response = await fetch(`${API_BASE_URL}crud/blok/${data.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Aktifkan (PUT)
                response = await fetch(`${API_BASE_URL}crud/blok/${data.id}/activate`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            Swal.close();

            if (!response.ok)
                throw new Error(data.status ? "Gagal menonaktifkan data." : "Gagal mengaktifkan data.");

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: data.status ? "Data berhasil dinonaktifkan." : "Data berhasil diaktifkan.",
            });

            fetchBlok(); // panggil ulang data blok
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.message || "Terjadi kesalahan saat memperbarui status.",
            });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return { blok, loadingBlok, error, fetchBlok, handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataBlok };
};

export default useFetchBlok;
