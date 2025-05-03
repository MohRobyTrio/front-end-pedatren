import { useState, useEffect, useRef, useCallback } from "react";

import { API_BASE_URL } from "../config";

const useFetchWaliKelas = (filters) => {
    const [waliKelas, setWaliKelas] = useState([]);
    const [loadingWaliKelas, setLoadingWaliKelas] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataWaliKelas, setTotalDataWaliKelas] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const lastRequest = useRef("");

    // Debounce searchTerm selama 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/walikelas?limit=${limit}&page=${currentPage}`;

        if (debouncedSearchTerm) {
            url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") {
            url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        }

        if (filters?.jenisKelamin) {
            url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        }

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingWaliKelas(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.statusText}: ${response.status}`);
            
            const data = await response.json();
            console.log("Data dari API:", data);

            setWaliKelas(Array.isArray(data.data) ? data.data : []);
            setTotalDataWaliKelas(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setWaliKelas([]);
        } finally {
            setLoadingWaliKelas(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        waliKelas,
        loadingWaliKelas,
        error,
        searchTerm,
        setSearchTerm,
        limit,
        setLimit,
        totalDataWaliKelas,
        totalPages,
        currentPage,
        setCurrentPage,
    };
};

export default useFetchWaliKelas;
