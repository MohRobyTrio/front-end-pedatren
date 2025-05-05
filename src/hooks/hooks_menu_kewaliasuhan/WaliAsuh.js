// src/hooks/useFetchWaliAsuh.js
import { useState, useEffect, useRef, useCallback } from "react";

import { API_BASE_URL } from "../config";

const useFetchWaliAsuh = (filters) => {
    const [waliAsuh, setWaliAsuh] = useState([]);
    const [loadingWaliAsuh, setLoadingWaliAsuh] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataWaliAsuh, setTotalDataWaliAsuh] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const lastRequest = useRef("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/waliasuh?limit=${limit}&page=${currentPage}`;

        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        // filter tambahan jika diperlukan
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
        if (filters?.blok && filters.blok !== "Semua Blok") url += `&blok=${encodeURIComponent(filters.blok)}`;
        if (filters?.kamar && filters.kamar !== "Semua Kamar") url += `&kamar=${encodeURIComponent(filters.kamar)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching Wali Asuh from:", url);

        setLoadingWaliAsuh(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

            const data = await response.json();
            console.log("Data Wali Asuh dari API:", data);

            setWaliAsuh(Array.isArray(data.data) ? data.data : []);
            setTotalDataWaliAsuh(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setWaliAsuh([]);
        } finally {
            setLoadingWaliAsuh(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        waliAsuh,
        loadingWaliAsuh,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataWaliAsuh,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchWaliAsuh;
