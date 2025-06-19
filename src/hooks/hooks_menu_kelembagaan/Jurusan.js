import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import DropdownLembaga from "../hook_dropdown/DropdownLembaga";

const useFetchJurusan = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [jurusan, setJurusan] = useState([]);
    const [loadingJurusan, setLoadingJurusan] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataJurusan, setTotalDataJurusan] = useState(0);
    const [allJurusan, setAllJurusan] = useState([]);
    const { forceFetchDropdownLembaga } = DropdownLembaga();
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchJurusan = useCallback(async () => {
        setLoadingJurusan(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}crud/jurusan?page=${currentPage}&per_page=${limit}`, {
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

            setJurusan(data.data);
            setTotalPages(data.last_page || 1);
            setTotalDataJurusan(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setJurusan([]);
        } finally {
            setLoadingJurusan(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, navigate, token]);

    useEffect(() => {
        console.log("halo");

        const storedJurusan = sessionStorage.getItem("allJurusan");
        if (storedJurusan) {
            setAllJurusan(JSON.parse(storedJurusan));
        } else {
            // Lakukan fetch hanya jika belum ada di session
            const fetchAllJurusan = async () => {
                try {
                    // Pertama ambil total data
                    const resTotal = await fetch(`${API_BASE_URL}crud/jurusan?page=1&per_page=1`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (resTotal.status === 401) {
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

                    const dataTotal = await resTotal.json();
                    const total = dataTotal.total || 0;

                    // Ambil semua data sesuai total
                    const resAll = await fetch(`${API_BASE_URL}crud/jurusan?page=1&per_page=${total}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const dataAll = await resAll.json();
                    const result = dataAll.data || [];

                    setAllJurusan(result);
                    sessionStorage.setItem("allJurusan", JSON.stringify(result));
                } catch (err) {
                    console.error("Fetch error:", err);
                    setError(err.message);
                    setAllJurusan([]);
                }
            };

            fetchAllJurusan();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        fetchJurusan();
    }, [fetchJurusan]);

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
                `${API_BASE_URL}crud/jurusan/${data.id}${data.status ? "" : "/activate"}`,
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
            fetchJurusan(); // refresh data
        } catch (error) {
            console.error("Error saat mengubah status:", error);
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memperbarui status data.",
            });
        }
    };

    const fetchJurusanDetail = async (id) => {
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
            const response = await fetch(`${API_BASE_URL}crud/jurusan/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            Swal.close();
            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                return null;
            }

            const result = await response.json();
            console.log("jurusan detail", result);


            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            return result;
        } catch (error) {
            console.error("Gagal mengambil detail:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal mengambil data : ${error.message}`,
            });
            return null;
        }
    };

    return {
        jurusan,
        allJurusan,
        loadingJurusan,
        error,
        fetchJurusan,
        fetchJurusanDetail,
        handleToggleStatus, limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataJurusan
    };
};

export default useFetchJurusan;
