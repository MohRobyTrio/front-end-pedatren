// src/hooks/useFetchAnakAsuh.js
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";

const useFetchAnakAsuh = (filters) => {
    const [anakAsuh, setAnakAsuh] = useState([]);
    const [loadingAnakAsuh, setLoadingAnakAsuh] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataAnakAsuh, setTotalDataAnakAsuh] = useState(0);
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

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/anakasuh?limit=${limit}`;
        if (currentPage > 1) url += `&page=${currentPage}`;
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        // Tambahkan filter jika ada (bisa dikembangkan sesuai kebutuhan)
        if (filters?.angkatan) url += `&angkatan=${encodeURIComponent(filters.angkatan)}`;
        if (filters?.kamar && filters.kamar !== "Semua Kamar") url += `&kamar=${encodeURIComponent(filters.kamar)}`;
        if (filters?.kota_asal) url += `&kota_asal=${encodeURIComponent(filters.kota_asal)}`;
        if (filters?.group_waliasuh) url += `&group_waliasuh=${encodeURIComponent(filters.group_waliasuh)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingAnakAsuh(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

            const data = await response.json();
            console.log("Data Anak Asuh dari API:", data);

            setAnakAsuh(Array.isArray(data.data) ? data.data : []);
            setTotalDataAnakAsuh(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setAnakAsuh([]);
        } finally {
            setLoadingAnakAsuh(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        anakAsuh,
        loadingAnakAsuh,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataAnakAsuh,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchAnakAsuh;
