import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";

const useFetchPeserta = (filters) => {
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [loadingPesertaDidik, setLoadingPesertaDidik] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPesertaDidik, setTotalDataPesertaDidik] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const lastRequest = useRef("");

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/pesertadidik?limit=${limit}&page=${currentPage}`;
        
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        // Object.entries(filters || {}).forEach(([key, value]) => {
        //     if (value && value !== "Semua") {
        //         url += `&${key}=${encodeURIComponent(value)}`;
        //     }
        // });
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.status) url += `&status=${encodeURIComponent(filters.status)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.pemberkasan) url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`;
        if (filters?.urutBerdasarkan) url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`;
        if (filters?.urutSecara) url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`;
        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
        if (filters?.blok && filters.blok !== "Semua Blok") url += `&blok=${encodeURIComponent(filters.blok)}`;
        if (filters?.kamar && filters.kamar !== "Semua Kamar") url += `&kamar=${encodeURIComponent(filters.kamar)}`;
        if (filters?.angkatanPelajar) url += `&angkatan_pelajar=${encodeURIComponent(filters.angkatanPelajar)}`;
        if (filters?.angkatanSantri) url += `&angkatan_santri=${encodeURIComponent(filters.angkatanSantri)}`;
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
        if (filters?.kelas && filters.kelas !== "Semua Kelas") url += `&kelas=${encodeURIComponent(filters.kelas)}`;
        if (filters?.rombel && filters.rombel !== "Semua Rombel") url += `&rombel=${encodeURIComponent(filters.rombel)}`;
        
        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);
        
        setLoadingPesertaDidik(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.message}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API:", data);
            
            setPesertaDidik(Array.isArray(data.data) ? data.data : []);
            setTotalDataPesertaDidik(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPesertaDidik([]);
        } finally {
            setLoadingPesertaDidik(false);
        }
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pesertaDidik ,
        loadingPesertaDidik,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPesertaDidik,
        totalPages,
        currentPage,
        setCurrentPage
    };
};

export default useFetchPeserta;
