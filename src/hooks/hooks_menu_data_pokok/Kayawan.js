import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config"; // Pastikan ini sesuai path kamu

const useFetchKaryawan = (filters) => {
    const [karyawans, setKaryawans] = useState([]);
    const [loadingKaryawans, setLoadingKaryawans] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataKaryawans, setTotalDataKaryawans] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const lastRequest = useRef("");

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/karyawans?limit=${limit}&page=${currentPage}`;

        //Ini Filter
        // if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        // if (filters?.lembaga) url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        // if (filters?.jenisJabatan) url += `&jenis_jabatan=${encodeURIComponent(filters.jenisJabatan)}`;
        // if (filters?.golongan) url += `&golongan=${encodeURIComponent(filters.golongan)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingKaryawans(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API:", data);

            setKaryawans(Array.isArray(data.data) ? data.data : []);
            setTotalDataKaryawans(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKaryawans([]);
        } finally {
            setLoadingKaryawans(false);
        }
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        karyawans,
        loadingKaryawans,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataKaryawans,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchKaryawan;
