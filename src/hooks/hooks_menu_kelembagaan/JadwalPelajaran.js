import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchJadwalPelajaran = (filters) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [jadwalPelajaran, setJadwalPelajaran] = useState([]);
    const [loadingJadwalPelajaran, setLoadingJadwalPelajaran] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchJadwalPelajaran = useCallback(async () => {
        setLoadingJadwalPelajaran(true);
        setError(null);
        const params = [];
        let url = `${API_BASE_URL}crud/jadwal-pelajaran`;

        if (filters?.lembaga_id) params.push(`lembaga_id=${encodeURIComponent(filters.lembaga_id)}`);
        if (filters?.jurusan_id) params.push(`jurusan_id=${encodeURIComponent(filters.jurusan_id)}`);
        if (filters?.kelas_id) params.push(`kelas_id=${encodeURIComponent(filters.kelas_id)}`);
        if (filters?.rombel_id) params.push(`rombel_id=${encodeURIComponent(filters.rombel_id)}`);
        if (filters?.semester_id) params.push(`semester_id=${encodeURIComponent(filters.semester_id)}`);
        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }
        console.log("Fetching data from:", url);
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

            setJadwalPelajaran(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setJadwalPelajaran([]);
        } finally {
            setLoadingJadwalPelajaran(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, token]);

    useEffect(() => {
        fetchJadwalPelajaran();
    }, [fetchJadwalPelajaran]);

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
            const response = await fetch(`${API_BASE_URL}crud/jadwal-pelajaran/${id}`, {
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

            fetchJadwalPelajaran();
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
        jadwalPelajaran,
        loadingJadwalPelajaran,
        error,
        fetchJadwalPelajaran,
        handleDelete
    };
};

export default useFetchJadwalPelajaran;
