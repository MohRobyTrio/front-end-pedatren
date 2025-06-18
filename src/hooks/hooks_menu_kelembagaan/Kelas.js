import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import DropdownLembaga from "../hook_dropdown/DropdownLembaga";

const useFetchKelas = () => {
    const { clearAuthData } = useLogout();
    const { forceFetchDropdownLembaga } = DropdownLembaga();
    const navigate = useNavigate();
    const [kelas, setKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataKelas, setTotalDataKelas] = useState(0);
    const [allKelas, setAllKelas] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKelas = useCallback(async () => {
        setLoadingKelas(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/kelas?page=${currentPage}&per_page=${limit}`, {
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

            setKelas(data.data);
            setTotalPages(data.last_page || 1);
            setTotalDataKelas(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKelas([]);
        } finally {
            setLoadingKelas(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, navigate, token]);

    useEffect(() => {
    const storedKelas = sessionStorage.getItem("allKelas");
    if (storedKelas) {
        setAllKelas(JSON.parse(storedKelas));
    } else {
        const fetchAllKelas = async () => {
            setError(null);

            try {
                // Step 1: Ambil 1 data untuk dapatkan total
                const firstResponse = await fetch(`${API_BASE_URL}crud/kelas?page=1&per_page=1`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (firstResponse.status === 401) {
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

                if (!firstResponse.ok) throw new Error(`Error ${firstResponse.status}`);
                const firstData = await firstResponse.json();

                const total = firstData.total || 0;

                // Step 2: Ambil semua data berdasarkan total
                const fullResponse = await fetch(`${API_BASE_URL}crud/kelas?page=1&per_page=${total}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!fullResponse.ok) throw new Error(`Error ${fullResponse.status}`);
                const fullData = await fullResponse.json();

                const kelasList = fullData.data || [];

                setAllKelas(kelasList);
                sessionStorage.setItem("allKelas", JSON.stringify(kelasList));
            } catch (err) {
                console.error("Fetch ALL error:", err);
                setError(err.message);
                setAllKelas([]);
            }
        };

        fetchAllKelas(); // panggil hanya jika belum ada di session
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ⚠️ Dependency array kosong = hanya dijalankan sekali saat mount


    useEffect(() => {
        fetchKelas();
    }, [fetchKelas]);

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
                `${API_BASE_URL}crud/kelas/${data.id}${data.status ? "" : "/activate"}`,
                {
                    method: data.status ? "DELETE" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.close();

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
            fetchKelas(); // refresh data
        } catch (error) {
            console.error("Error saat mengubah status:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui status data.",
            });
        }
    };

    return {
        kelas,
        allKelas,
        loadingKelas,
        error,
        fetchKelas,
        handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataKelas
    };
};

export default useFetchKelas;
