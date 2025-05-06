// src/hooks/useFetchGroupKewaliasuhan.js
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";

const useFetchGroupKewaliasuhan = (filters) => {
    const [groupKewaliasuhan, setGroupKewaliasuhan] = useState([]);
    const [loadingGroupKewaliasuhan, setLoadingGroupKewaliasuhan] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalData, setTotalData] = useState(0);
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
        let url = `${API_BASE_URL}data-pokok/kewaliasuhan/grup?limit=${limit}&page=${currentPage}`;

        if (debouncedSearchTerm) {
            url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") {
            url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
        }

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching Group Kewaliasuhan from:", url);

        setLoadingGroupKewaliasuhan(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

            const data = await response.json();
            console.log("Data Group Kewaliasuhan dari API:", data);

            setGroupKewaliasuhan(Array.isArray(data.data) ? data.data : []);
            setTotalData(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setGroupKewaliasuhan([]);
        } finally {
            setLoadingGroupKewaliasuhan(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        groupKewaliasuhan,
        loadingGroupKewaliasuhan,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchGroupKewaliasuhan;
