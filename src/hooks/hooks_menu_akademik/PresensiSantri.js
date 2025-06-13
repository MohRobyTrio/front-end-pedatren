import { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const useFetchPresensiSantri = (filters) => {
    const [dataPresensi, setDataPresensi] = useState([]);
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [loadingPresensi, setLoadingPresensi] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPresensi, setTotalDataPresensi] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    const lastRequest = useRef("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}fitur/presensi-santri`;
        const params = [];

        if (limit !== null) params.push(`limit=${limit}`);
        if (currentPage > 1) params.push(`page=${currentPage}`);
        // if (debouncedSearchTerm) params.push(`nama=${encodeURIComponent(debouncedSearchTerm)}`);
        // if (filters?.tanggal) params.push(`tanggal=${encodeURIComponent(filters.tanggal)}`);
        // if (filters?.status) params.push(`status=${encodeURIComponent(filters.status)}`);

        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }

        if (!force && lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching from:", url);

        setLoadingPresensi(true);
        setError(null);

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const result = await response.json();
            console.log("Data Presensi:", result);

            setDataPresensi(Array.isArray(result.data) ? result.data : []);
            setTotalDataPresensi(result.total_data || 0);
            setTotalPages(result.total_pages || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setDataPresensi([]);
        } finally {
            setLoadingPresensi(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        dataPresensi,
        loadingPresensi,
        error,
        searchTerm,
        setSearchTerm,
        limit,
        setLimit,
        totalDataPresensi,
        fetchData,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchPresensiSantri;
