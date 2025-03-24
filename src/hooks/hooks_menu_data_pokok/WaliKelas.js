import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const useFetchWalikelas = (filters) => {
    const [walikelas, setWalikelas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataWalikelas, setTotalDataWalikelas] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("Filters updated:", filters);
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            let url = `${API_BASE_URL}data-pokok/list/walikelas?limit=${limit}`;
            if (currentPage > 1) {
                url += `&page=${currentPage}`;
            }
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            
            // Pastikan filter yang dikirim memiliki value
            // if (filters?.GenderRombel && filters.GenderRombel !== '') {
            //     url += `&GenderRombel=${encodeURIComponent(filters.GenderRombel)}`;
            // }
            // if (filters?.lembaga && filters.lembaga !== '') {
            //     url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
            // }
            
            console.log("Fetching data from:", url);

            try {
                const response = await fetch(url);
                console.log("Response status:", response.status);

                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Data dari API:", data);

                // Pemeriksaan tambahan untuk struktur data
                const listData = data.data || data || [];
                
                setWalikelas(Array.isArray(listData) ? listData : []);
                setTotalDataWalikelas(data.total_data || listData.length || 0);
                setTotalPages(data.total_pages || 1);
                setCurrentPage(data.current_page || 1);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setWalikelas([]);
                setTotalDataWalikelas(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit, filters]);

    return {
        walikelas,
        loading,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataWalikelas,
        totalPages,
        currentPage,
        setCurrentPage,
    };
};

export default useFetchWalikelas;