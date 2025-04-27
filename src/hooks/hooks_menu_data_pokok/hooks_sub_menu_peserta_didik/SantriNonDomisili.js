import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../config";

const useFetchSantriNonDomisili = (filters) => {
    const [santriNonDomisili, setSantriNonDomisili] = useState([]);
    const [loadingSantriNonDomisili, setLoadingSantriNonDomisili] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataSantriNonDomisili, setTotalDataSantriNonDomisili] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    const lastRequest = useRef("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/santri-nondomisili?limit=${limit}&page=${currentPage}`;

        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        // Kalau mau pakai filter tambahan, bisa diaktifkan di sini
        // Object.entries(filters || {}).forEach(([key, value]) => {
        //     if (value && value !== "Semua") {
        //         url += `&${key}=${encodeURIComponent(value)}`;
        //     }
        // });

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingSantriNonDomisili(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API Santri NonDomisili:", data);

            setSantriNonDomisili(Array.isArray(data.data) ? data.data : []);
            setTotalDataSantriNonDomisili(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setSantriNonDomisili([]);
        } finally {
            setLoadingSantriNonDomisili(false);
        }
    }, [currentPage, debouncedSearchTerm, filters, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        santriNonDomisili,
        loadingSantriNonDomisili,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataSantriNonDomisili,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchSantriNonDomisili;
