import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import DropdownLembaga from "../hook_dropdown/DropdownLembaga";

const useFetchLembaga = () => {
    const { clearAuthData } = useLogout();
    const { forceFetchDropdownLembaga } = DropdownLembaga();
    const navigate = useNavigate();
    const [lembaga, setLembaga] = useState([]);
    const [loadingLembaga, setLoadingLembaga] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataLembaga, setTotalDataLembaga] = useState(0);
    const [allLembaga, setAllLembaga] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchLembaga = useCallback(async () => {
        setLoadingLembaga(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/lembaga?page=${currentPage}&per_page=${limit}`, {
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

            setLembaga(data.data);
            setTotalPages(data.last_page || 1);
            setTotalDataLembaga(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setLembaga([]);
        } finally {
            setLoadingLembaga(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, navigate, token]);

    useEffect(() => {
    const storedLembaga = sessionStorage.getItem("allLembaga");
    if (storedLembaga) {
        setAllLembaga(JSON.parse(storedLembaga));
        setLoadingLembaga(false);
    } else {
        const fetchAllLembaga = async () => {
            setLoadingLembaga(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}crud/lembaga?per_page=100000`, {
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

                setAllLembaga(data.data || []);
                sessionStorage.setItem("allLembaga", JSON.stringify(data.data));
            } catch (err) {
                console.error("Fetch ALL error:", err);
                setError(err.message);
                setAllLembaga([]);
            } finally {
                setLoadingLembaga(false);
            }
        };

        fetchAllLembaga(); // hanya fetch jika belum ada di session
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

    useEffect(() => {
        fetchLembaga();
    }, [fetchLembaga]);

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
                `${API_BASE_URL}crud/lembaga/${data.id}${data.status ? "" : "/activate"}`,
                {
                    method: data.status ? "DELETE" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
            fetchLembaga(); // refresh data
        } catch (error) {
            console.error("Error saat mengubah status:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui status data.",
            });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        lembaga,
        allLembaga,
        loadingLembaga,
        error,
        fetchLembaga,
        handleToggleStatus,
        limit,
        setLimit,
        totalPages,
        currentPage,
        setCurrentPage,
        totalDataLembaga
    };
};

export default useFetchLembaga;
