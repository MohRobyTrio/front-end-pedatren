import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";

const useFetchKategoriGolongan = () => {
    const { clearAuthData } = useLogout();
    const [kategoriGolongan, setKategoriGolongan] = useState([]);
    const [loadingKategori, setLoadingKategori] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKategoriGolongan = useCallback(async () => {
        setLoadingKategori(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/kategori-golongan`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);
            const result = await response.json();

            setKategoriGolongan(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKategoriGolongan([]);
        } finally {
            setLoadingKategori(false);
        }
    }, [token]);

    useEffect(() => {
        fetchKategoriGolongan();
    }, [fetchKategoriGolongan]);

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

            const response = await fetch(`${API_BASE_URL}crud/${id}/kategori-golongan`, {
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

            fetchKategoriGolongan();
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
        kategoriGolongan,
        loadingKategori,
        error,
        fetchKategoriGolongan,
        handleDelete
    };
};

export default useFetchKategoriGolongan;
