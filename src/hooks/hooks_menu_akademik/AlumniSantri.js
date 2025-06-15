import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchLulusSantri = (filters) => {
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
        let url = `${API_BASE_URL}fitur/list-alumni`;
        const params = [];

        console.log(filters.kamar);
        

        // Tambahkan query params jika endpoint di masa depan mendukung
        if (limit !== null) params.push(`limit=${limit}`);
        if (currentPage > 1) params.push(`page=${currentPage}`);
        if (debouncedSearchTerm) params.push(`nama=${encodeURIComponent(debouncedSearchTerm)}`);
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") params.push(`wilayah=${encodeURIComponent(filters.wilayah)}`);
        if (filters?.blok && filters.blok !== "Semua Blok") params.push(`blok=${encodeURIComponent(filters.blok)}`);
        if (filters?.kamar && filters.kamar !== "Semua Kamar") params.push(`kamar=${encodeURIComponent(filters.kamar)}`);
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
            setTotalPages(result.total_pages); // tidak ada pagination info
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

    const fetchAllData = useCallback(async () => {
    const token = sessionStorage.getItem("token") || getCookie("token");
    let baseUrl = `${API_BASE_URL}fitur/list-alumni`;
    const params = [];

    if (debouncedSearchTerm) params.push(`nama=${encodeURIComponent(debouncedSearchTerm)}`);
    if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") params.push(`wilayah=${encodeURIComponent(filters.wilayah)}`);
    if (filters?.blok && filters.blok !== "Semua Blok") params.push(`blok=${encodeURIComponent(filters.blok)}`);
    if (filters?.kamar && filters.kamar !== "Semua Kamar") params.push(`kamar=${encodeURIComponent(filters.kamar)}`);
    if (filters?.urutBerdasarkan) params.push(`sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`);

    const urlWithoutLimit = `${baseUrl}?${params.join("&")}`;

    try {
        // Step 1: Fetch total data
        const response1 = await fetch(urlWithoutLimit, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response1.ok) throw new Error("Gagal fetch total data");

        const result1 = await response1.json();
        const total = result1.total_data || result1.data.length || 0;

        if (total === 0) return [];

        // Step 2: Fetch ulang dengan limit = total
        const urlWithLimit = `${baseUrl}?${[...params, `limit=${total}`].join("&")}`;
        const response2 = await fetch(urlWithLimit, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response2.ok) throw new Error("Gagal fetch semua data");

        const result2 = await response2.json();
        const ids = Array.isArray(result2.data) ? result2.data.map(item => item.biodata_id) : [];

        console.log("✅ Total ID diambil:", ids.length);
        return ids;

    } catch (error) {
        console.error("❌ fetchAllData error:", error);
        return [];
    }
}, [filters, debouncedSearchTerm]);

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
        fetchAllData,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchLulusSantri;
