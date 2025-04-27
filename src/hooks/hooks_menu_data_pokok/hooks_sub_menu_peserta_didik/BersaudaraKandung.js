import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../config";

const useFetchPesertaDidikBersaudara = (filters) => {
    const [pesertaDidikBersaudara, setPesertaDidikBersaudara] = useState([]);
    const [loadingBersaudara, setLoadingBersaudara] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataBersaudara, setTotalDataBersaudara] = useState(0);
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

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/pesertadidik-bersaudara?limit=${limit}&page=${currentPage}`;

        if (debouncedSearchTerm) url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingBersaudara(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API Peserta Didik Bersaudara:", data);

            setPesertaDidikBersaudara(Array.isArray(data.data) ? data.data : []);
            setTotalDataBersaudara(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPesertaDidikBersaudara([]);
        } finally {
            setLoadingBersaudara(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pesertaDidikBersaudara,
        loadingBersaudara,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataBersaudara,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchPesertaDidikBersaudara;
