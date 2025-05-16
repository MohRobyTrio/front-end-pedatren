import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config"; // Pastikan ini sesuai path kamu

const useFetchKaryawan = (filters) => {
    const [karyawan, setKaryawan] = useState([]);
    const [loadingKaryawan, setLoadingKaryawan] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataKaryawan, setTotalDataKaryawan] = useState(0);
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
        let url = `${API_BASE_URL}data-pokok/karyawans?limit=${limit}`;
        if (currentPage > 1) {
            url += `&page=${currentPage}`;
        }
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
        
        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.pemberkasan) url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.umur) url += `&umur=${encodeURIComponent(filters.umur)}`;
        if (filters?.jenisJabatan) url += `&jabatan=${encodeURIComponent(filters.jenisJabatan)}`;
        if (filters?.golonganJabatan && filters.golonganJabatan !== "Pilih Golongan Jabatan") url += `&golongan=${encodeURIComponent(filters.golonganJabatan)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingKaryawan(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API:", data);

            setKaryawan(Array.isArray(data.data) ? data.data : []);
            setTotalDataKaryawan(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setKaryawan([]);
        } finally {
            setLoadingKaryawan(false);
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
        karyawan,
        loadingKaryawan,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataKaryawan,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchKaryawan;
