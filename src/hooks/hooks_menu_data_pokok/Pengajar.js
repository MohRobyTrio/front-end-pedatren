// import { useEffect, useState, useMemo } from "react";
// import { API_BASE_URL } from "../config";

// export default function useFetchPengajar() {
//   const [pengajar, setPengajar] = useState([]);
//   const [loadingPengajar, setLoadingPengajar] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [limit, setLimit] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalDataPengajar, setTotalDataPengajar] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoadingPengajar(true);
//       try {
//         let url = `${API_BASE_URL}data-pokok/list/pengajars?limit=${limit}`;
//         if (currentPage > 1) {
//           url += `&page=${currentPage}`;
//         }
//         console.log("Fetching data from:", url);
//         const response = await fetch(url);
//         // const response = await fetch(url, {
//         //   headers: {
//         //     "ngrok-skip-browser-warning": "true", // Tambahkan header ini
//         //   },
//         // });
//         const data = await response.json();

//         if (data.data) {
//           setPengajar(data.data);
//           setTotalDataPengajar(data.total_data);
//           setTotalPages(data.total_pages);
//         } else {
//           setPengajar([]);
//           setTotalDataPengajar(0);
//           setTotalPages(1);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setPengajar([]);
//         setTotalDataPengajar(0);
//         setTotalPages(1);
//       } finally {
//         setLoadingPengajar(false);
//       }
//     };

//     fetchData();
//   }, [limit, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [limit]);

//   const filteredPengajar = useMemo(() => {
//     return pengajar.filter(
//       (item) =>
//         item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item?.lembaga?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, pengajar]);

//   return {
//     pengajar: filteredPengajar,
//     loadingPengajar,
//     searchTerm,
//     setSearchTerm,
//     totalDataPengajar,
//     totalPages,
//     totalFiltered: filteredPengajar.length,
//     limit,
//     setLimit,
//     currentPage,
//     setCurrentPage,
//   };
// }

import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";

const useFetchPengajar = (filters) => {
    const [pengajar, setPengajar] = useState([]);
    const [loadingPengajar, setLoadingPengajar] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalDataPengajar, setTotalDataPengajar] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const lastRequest = useRef("");  // Untuk menyimpan request terakhir

    const fetchData = useCallback(async () => {
        let url = `${API_BASE_URL}data-pokok/list/pengajars?limit=${limit}&page=${currentPage}`;
        
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;

        // Jika URL sama dengan request terakhir, jangan lakukan fetch ulang
        if (lastRequest.current === url) {
            console.log("Skip Fetch: URL sama dengan request sebelumnya");
            return;
        }

        lastRequest.current = url;  // Simpan URL yang baru
        console.log("Fetching data from:", url);
        
        setLoadingPengajar(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data dari API:", data);
            
            setPengajar(Array.isArray(data.data) ? data.data : []);
            setTotalDataPengajar(data.total_data || 0);
            setTotalPages(data.total_pages || 1);
            setCurrentPage(data.current_page || 1);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setPengajar([]);
        } finally {
            setLoadingPengajar(false);
        }
    }, [currentPage, filters, limit, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);  // Hanya berjalan saat `fetchData` berubah

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
        setCurrentPage
    };
};

export default useFetchPengajar;

