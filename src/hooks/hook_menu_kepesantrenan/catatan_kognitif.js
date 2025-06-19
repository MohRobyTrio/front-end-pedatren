import { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useFetchKognitif = (filters) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [catatanKognitif, setCatatanKognitif] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const lastRequest = useRef("");
    const token = sessionStorage.getItem("token") || getCookie("token");

    // Debounce untuk pencarian
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}data-pokok/catatan-kognitif?limit=${limit}`;
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

        // Filter tambahan
        if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
        if (filters?.kategori && filters.kategori !== "") {url += `&kategori=${encodeURIComponent(filters.kategori)}`;}
        if (filters?.nilai && filters.nilai !== "") {url += `&score=${encodeURIComponent(filters.nilai)}`;}
        if (filters?.periode && filters.periode !== "") {url += `&periode=${encodeURIComponent(filters.periode)}`;}


        // Skip request duplikat
        if (!force && lastRequest.current === url) {
            console.log("Skip duplicate request");
            return;
        }
        lastRequest.current = url;
        console.log("Fetching data from:", url);


        setLoading(true);
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
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log("Data Catatan Kognitif:", result);

            setCatatanKognitif(result.data || []);
            setTotalData(result.total_data || 0);
            setTotalPages(result.total_pages || 1);
        } catch (err) {
            setError(err.message);
            setCatatanKognitif([]);
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters, limit, debouncedSearchTerm]);

    // Fetch data saat dependency berubah
    useEffect(() => {
        fetchData(filters);
    }, [fetchData, filters]);

    // Reset ke halaman pertama saat limit berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    //Penambahan groupedData
    const groupedData = useMemo(() => {
        return catatanKognitif.reduce((acc, curr) => {
            const key = curr.id_santri;
            if (!acc[key]) {
                acc[key] = {
                    ...curr,
                    catatan: []
                };
            }
            acc[key].catatan.push(curr);
            return acc;
        }, {});
    }, [catatanKognitif]);

    return {
        catatanKognitif,
        groupedData,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchData
    };
};

export default useFetchKognitif;