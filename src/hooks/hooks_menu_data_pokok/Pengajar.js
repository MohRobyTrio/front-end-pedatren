import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchPengajar = (filters) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [pengajar, setPengajar] = useState([]);
    const [loadingPengajar, setLoadingPengajar] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPengajar, setTotalDataPengajar] = useState(0);
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

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}data-pokok/pengajar?limit=${limit}`;
        if (currentPage > 1) {
            url += `&page=${currentPage}`;
        }
        if (debouncedSearchTerm) url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
        if (filters?.kategori && filters.kategori !== "Pilih Kategori Golongan") url += `&golongan_jabatan=${encodeURIComponent(filters.kategori)}`;
        if (filters?.golongan && filters.golongan !== "Pilih Golongan") url += `&golongan=${encodeURIComponent(filters.golongan)}`;
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.jenisJabatan) url += `&jabatan=${encodeURIComponent(filters.jenisJabatan)}`;
        if (filters?.masaKerja) url += `&masa_kerja=${encodeURIComponent(filters.masaKerja)}`;
        if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
        if (filters?.wargaPesantren) url += `&warga_pesantren=${encodeURIComponent(filters.wargaPesantren)}`;
        if (filters?.pemberkasan) url += `&pemberkasan=${encodeURIComponent(filters.pemberkasan)}`;
        if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
        if (filters?.umur) url += `&umur=${encodeURIComponent(filters.umur)}`;
        if (filters?.totalMateriAjar) url += `&materi_ajar=${encodeURIComponent(filters.totalMateriAjar)}`;

        if (!force && lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;  // Simpan URL yang baru
        console.log("Fetching data from:", url);
        
        setLoadingPengajar(true);
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

            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API:", data);
            
            setPengajar(Array.isArray(data.data) ? data.data : []);
            setTotalDataPengajar(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            // setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPengajar([]);
        } finally {
            setLoadingPengajar(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);  // Hanya berjalan saat `fetchData` berubah

    // Untuk setting ke halaman 1 saat limit berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    return {
        pengajar,
        loadingPengajar,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalDataPengajar,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData
    };
};

export default useFetchPengajar;

