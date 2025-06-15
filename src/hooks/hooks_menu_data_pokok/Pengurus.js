import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useFetchPengurus = (filters) => {
    const [pengurus, setPengurus] = useState([]);
    const [loadingPengurus, setLoadingPengurus] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPengurus, setTotalDataPengurus] = useState(0);
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

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/pengurus?limit=${limit}`;
        if (currentPage > 1) url += `&page=${currentPage}`;
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.satuanKerja && filters.satuanKerja !== "Pilih Satuan Kerja") url += `&satuan_kerja=${encodeURIComponent(filters.satuanKerja)}`;
        if (filters?.golonganJabatan && filters.golonganJabatan !== "Pilih Golongan Jabatan") url += `&golongan=${encodeURIComponent(filters.golonganJabatan)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.pemberkasan) url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
        if (filters?.umur) url += `&umur=${encodeURIComponent(filters.umur)}`;
        if (filters?.jenisJabatan) url += `&jabatan=${encodeURIComponent(filters.jenisJabatan)}`;

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingPengurus(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                setTotalDataPengurus(0);
                setTotalPages(1);
                throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Data Pengurus dari API:", data);

            setPengurus(Array.isArray(data.data) ? data.data : []);
            setTotalDataPengurus(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPengurus([]);
        } finally {
            setLoadingPengurus(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pengurus,
        loadingPengurus,
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
