import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const useFetchPengurus = (filters) => {
    const [pengurus, setPengurus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPengurus, setTotalDataPengurus] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("Filters updated:", filters);
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            let url = `${API_BASE_URL}data-pokok/pengurus?limit=${limit}`;
            if (currentPage > 1) {
                url += `&page=${currentPage}`;
            }
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            if (filters?.jabatan) {
                url += `&jabatan=${encodeURIComponent(filters.jabatan)}`;
            }
            if (filters?.lembaga) {
                url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
            }
            console.log("Fetching data from:", url);

            try {
                const response = await fetch(url);
                console.log("Response status:", response.status);

                if (!response.ok) {
                    setTotalDataPengurus(0);
                    setTotalPages(1);
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const text = await response.text();
                const data = JSON.parse(text);
                console.log("Data dari API:", data);

                setPengurus(Array.isArray(data.data) ? data.data : []);
                setTotalDataPengurus(data.total_data || 0);
                setTotalPages(data.total_pages || 1);
                setCurrentPage(data.current_page || 1);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setPengurus([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pengurus,
        loading,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPengurus,
        totalPages,
        currentPage,
        setCurrentPage,
    };
};

export default useFetchPengurus;
