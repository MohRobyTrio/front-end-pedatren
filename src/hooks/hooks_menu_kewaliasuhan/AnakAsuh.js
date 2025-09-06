// src/hooks/useFetchAnakAsuh.js
import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchAnakAsuh = (filters) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [anakAsuh, setAnakAsuh] = useState([]);
    const [loadingAnakAsuh, setLoadingAnakAsuh] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataAnakAsuh, setTotalDataAnakAsuh] = useState(0);
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

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}data-pokok/anakasuh?limit=${limit}`;
        if (currentPage > 1) url += `&page=${currentPage}`;
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
        if (filters?.status) url += `&status=${encodeURIComponent(filters.status)}`;
        if (filters?.angkatan) url += `&angkatan_santri=${encodeURIComponent(filters.angkatan)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.urutBerdasarkan) url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`;
        if (filters?.urutSecara) url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;

        if (!force && lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;
        console.log("Fetching data from:", url);

        setLoadingAnakAsuh(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

            const data = await response.json();
            console.log("Data Anak Asuh dari API:", data);

            setAnakAsuh(Array.isArray(data.data) ? data.data : []);
            setTotalDataAnakAsuh(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setAnakAsuh([]);
        } finally {
            setLoadingAnakAsuh(false);
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
        anakAsuh,
        loadingAnakAsuh,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataAnakAsuh,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData
    };
};

export default useFetchAnakAsuh;
