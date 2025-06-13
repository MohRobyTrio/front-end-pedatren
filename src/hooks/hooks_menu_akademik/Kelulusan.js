import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchLulus = (filters) => {
    const [dataLulus, setDataLulus] = useState([]);
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [loadingLulus, setLoadingLulus] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataLulus, setTotalDataLulus] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    const lastRequest = useRef("");

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}fitur/list-lulus`;
        const params = [];

        // Tambahkan query params jika endpoint di masa depan mendukung
        if (limit !== null) params.push(`limit=${limit}`);
        if (currentPage > 1) params.push(`page=${currentPage}`);
        if (debouncedSearchTerm) params.push(`nama=${encodeURIComponent(debouncedSearchTerm)}`);
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") params.push(`lembaga=${encodeURIComponent(filters.lembaga)}`);
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") params.push(`jurusan=${encodeURIComponent(filters.jurusan)}`);
        if (filters?.kelas && filters.kelas !== "Semua Kelas") params.push(`kelas=${encodeURIComponent(filters.kelas)}`);
        if (filters?.rombel && filters.rombel !== "Semua Rombel") params.push(`rombel=${encodeURIComponent(filters.rombel)}`);
        if (filters?.urutBerdasarkan) params.push(`sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`);


        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }

        if (!force && lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching from:", url);

        setLoadingLulus(true);
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
            console.log("Data dari API Lulus:", result);

            setDataLulus(Array.isArray(result.data) ? result.data : []);
            setTotalDataLulus(result.total_data || 0); // karena tidak ada total_data di response
            setTotalPages(1); // tidak ada pagination info
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setDataLulus([]);
        } finally {
            setLoadingLulus(false);
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
        dataLulus,
        loadingLulus,
        error,
        searchTerm,
        setSearchTerm,
        limit,
        setLimit,
        totalDataLulus,
        fetchData,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchLulus;
