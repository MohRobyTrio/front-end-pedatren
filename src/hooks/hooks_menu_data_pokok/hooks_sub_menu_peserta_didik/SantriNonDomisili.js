import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../config";
import { getCookie } from "../../../utils/cookieUtils";

const useFetchSantriNonDomisili = (filters) => {
    const [santriNonDomisili, setSantriNonDomisili] = useState([]);
    const [loadingSantriNonDomisili, setLoadingSantriNonDomisili] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataSantriNonDomisili, setTotalDataSantriNonDomisili] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const token = sessionStorage.getItem("token") || getCookie("token");
    const lastRequest = useRef("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/santri-nondomisili?limit=${limit}`;
        if (currentPage > 1) {
            url += `&page=${currentPage}`;
        }
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
        if (filters?.blok && filters.blok !== "Semua Blok") url += `&blok=${encodeURIComponent(filters.blok)}`;
        if (filters?.kamar && filters.kamar !== "Semua Kamar") url += `&kamar=${encodeURIComponent(filters.kamar)}`;
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
        if (filters?.kelas && filters.kelas !== "Semua Kelas") url += `&kelas=${encodeURIComponent(filters.kelas)}`;
        if (filters?.rombel && filters.rombel !== "Semua Rombel") url += `&rombel=${encodeURIComponent(filters.rombel)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.status) url += `&status=${encodeURIComponent(filters.status)}`;
        if (filters?.angkatanSantri) url += `&angkatan_santri=${encodeURIComponent(filters.angkatanSantri)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.pemberkasan) url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`;
        if (filters?.urutBerdasarkan) url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`;
        if (filters?.urutSecara) url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
        // Kalau mau pakai filter tambahan, bisa diaktifkan di sini
        // Object.entries(filters || {}).forEach(([key, value]) => {
        //     if (value && value !== "Semua") {
        //         url += `&${key}=${encodeURIComponent(value)}`;
        //     }
        // });

        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingSantriNonDomisili(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API Santri NonDomisili:", data);

            setSantriNonDomisili(Array.isArray(data.data) ? data.data : []);
            setTotalDataSantriNonDomisili(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setSantriNonDomisili([]);
        } finally {
            setLoadingSantriNonDomisili(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, debouncedSearchTerm, filters, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Untuk setting ke halaman 1 saat limit berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        santriNonDomisili,
        loadingSantriNonDomisili,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataSantriNonDomisili,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchSantriNonDomisili;
