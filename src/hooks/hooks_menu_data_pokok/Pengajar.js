import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../config";

export default function useFetchPengajar() {
  const [pengajar, setPengajar] = useState([]);
  const [loadingPengajar, setLoadingPengajar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataPengajar, setTotalDataPengajar] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPengajar(true);
      try {
        let url = `${API_BASE_URL}data-pokok/list/pengajars?limit=${limit}`;
        if (currentPage > 1) {
          url += `&page=${currentPage}`;
        }
        console.log("Fetching data from:", url);
        const response = await fetch(url);
        // const response = await fetch(url, {
        //   headers: {
        //     "ngrok-skip-browser-warning": "true", // Tambahkan header ini
        //   },
        // });
        const data = await response.json();

        if (data.data) {
          setPengajar(data.data);
          setTotalDataPengajar(data.total_data);
          setTotalPages(data.total_pages);
        } else {
          setPengajar([]);
          setTotalDataPengajar(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPengajar([]);
        setTotalDataPengajar(0);
        setTotalPages(1);
      } finally {
        setLoadingPengajar(false);
      }
    };

    fetchData();
  }, [limit, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const filteredPengajar = useMemo(() => {
    return pengajar.filter(
      (item) =>
        item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.lembaga?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, pengajar]);

  return {
    pengajar: filteredPengajar,
    loadingPengajar,
    searchTerm,
    setSearchTerm,
    totalDataPengajar,
    totalPages,
    totalFiltered: filteredPengajar.length,
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
  };
}
