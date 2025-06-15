// src/hooks/useFetchWaliKelas.js
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

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
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/walikelas?limit=${limit}`;
        if (currentPage > 1) url += `&page=${currentPage}`;
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
        if (filters?.kelas && filters.kelas !== "Semua Kelas") url += `&kelas=${encodeURIComponent(filters.kelas)}`;
        if (filters?.rombel && filters.rombel !== "Semua Rombel") url += `&rombel=${encodeURIComponent(filters.rombel)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.genderRombel) url += `&gender_rombel=${encodeURIComponent(filters.genderRombel)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingWaliKelas(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error(`${response.statusText}: ${response.status}`);

            const data = await response.json();
            console.log("Data Wali Kelas dari API:", data);

            setWaliKelas(Array.isArray(data.data) ? data.data : []);
            setTotalDataWaliKelas(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1); // di-nonaktifkan agar tidak override
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setWaliKelas([]);
        } finally {
            setLoadingWaliKelas(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset ke halaman 1 saat limit berubah
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
