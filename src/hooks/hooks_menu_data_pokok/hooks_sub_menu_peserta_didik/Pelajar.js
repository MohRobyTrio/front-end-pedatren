import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../config";

const useFetchPelajar = (filters) => {
    const [pelajar, setPelajar] = useState([]);
    const [loadingPelajar, setLoadingPelajar] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPelajar, setTotalDataPelajar] = useState(0);
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

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}data-pokok/pelajar`;
        const params = [];
        if (limit !== null && limit !== undefined) {
            params.push(`limit=${limit}`);
        }
        // if (currentPage > 1) {
        //     url += `&page=${currentPage}`;
        // }
        // if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
        if (currentPage > 1) {
            params.push(`page=${currentPage}`);
        }
        if (debouncedSearchTerm) {
            params.push(`nama=${encodeURIComponent(debouncedSearchTerm)}`);
        }

        if (filters?.negara && filters.negara !== "Semua Negara") params.push(`negara=${encodeURIComponent(filters.negara)}`);
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") params.push(`provinsi=${encodeURIComponent(filters.provinsi)}`);
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") params.push(`kabupaten=${encodeURIComponent(filters.kabupaten)}`);
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") params.push(`kecamatan=${encodeURIComponent(filters.kecamatan)}`);
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") params.push(`wilayah=${encodeURIComponent(filters.wilayah)}`);
        if (filters?.blok && filters.blok !== "Semua Blok") params.push(`blok=${encodeURIComponent(filters.blok)}`);
        if (filters?.kamar && filters.kamar !== "Semua Kamar") params.push(`kamar=${encodeURIComponent(filters.kamar)}`);
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") params.push(`lembaga=${encodeURIComponent(filters.lembaga)}`);
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") params.push(`jurusan=${encodeURIComponent(filters.jurusan)}`);
        if (filters?.kelas && filters.kelas !== "Semua Kelas") params.push(`kelas=${encodeURIComponent(filters.kelas)}`);
        if (filters?.rombel && filters.rombel !== "Semua Rombel") params.push(`rombel=${encodeURIComponent(filters.rombel)}`);
        if (filters?.jenisKelamin) params.push(`jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`);
        if (filters?.smartcard) params.push(`smartcard=${encodeURIComponent(filters.smartcard)}`);
        if (filters?.status) params.push(`status=${encodeURIComponent(filters.status)}`);
        if (filters?.angkatanPelajar) params.push(`angkatan_pelajar=${encodeURIComponent(filters.angkatanPelajar)}`);
        if (filters?.wargaPesantren) params.push(`warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`);
        if (filters?.pemberkasan) params.push(`pemberkasan=${encodeURIComponent(filters.pemberkasan)}`);
        if (filters?.urutBerdasarkan) params.push(`sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`);
        if (filters?.urutSecara) params.push(`sort_order=${encodeURIComponent(filters.urutSecara)}`);
        if (filters?.phoneNumber) params.push(`phone_number=${encodeURIComponent(filters.phoneNumber)}`);

        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }

        if (!force && lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingPelajar(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API Pelajar:", data);

            setPelajar(Array.isArray(data.data) ? data.data : []);
            setTotalDataPelajar(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPelajar([]);
        } finally {
            setLoadingPelajar(false);
        }
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Untuk setting ke halaman 1 saat limit berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pelajar,
        loadingPelajar,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPelajar,
        fetchData,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchPelajar;
