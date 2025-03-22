import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config";

const useFetchPeserta = () => {
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(1); // Tambahkan total halaman
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            let url = `${API_BASE_URL}/peserta-didik?limit=${limit}`;
            // if (currentPage > 1) {
            //     url += `&page=${currentPage}`;
            //   }
            console.log("Fetching data from:", url);

            try {
                const response = await fetch(url);

                console.log("Response status:", response.status);

                if (!response.ok) {
                    setTotalData(0);
                    setTotalPages(1);
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const text = await response.text();
                console.log("Raw Response:", text);

                const data = JSON.parse(text);
                console.log("Data dari API:", data);

                setPesertaDidik(Array.isArray(data.data) ? data.data : []);
                setTotalData(data.total_data || 0);
                setTotalPages(data.total_pages || 1); // Ambil total halaman dari API
                setCurrentPage(data.current_page || 1); // Pastikan currentPage sesuai dengan API

            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setPesertaDidik([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, limit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    const filteredPesertaDidik = useMemo(() => {
        return pesertaDidik.filter(
            (item) =>
                item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.lembaga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item["nik/nopassport"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.wilayah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.kota_asal?.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
    }, [searchTerm, pesertaDidik]);

    return {
        pesertaDidik: filteredPesertaDidik,
        loading,
        searchTerm,
        setSearchTerm,
        error,
        limit,
        setLimit,
        totalData,
        totalPages, // Kembalikan total halaman dari API
        currentPage,
        setCurrentPage
    };
};

export default useFetchPeserta;
