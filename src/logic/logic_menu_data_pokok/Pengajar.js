import { useEffect, useState, useMemo } from "react";

export default function useFetchPengajar() {
  const [pengajar, setPengajar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:8000/api/v1/list/pengajars?limit=${limit}`;
        if (currentPage > 1) {
          url += `&page=${currentPage}`;
        }
        const response = await fetch(url);
        // const response = await fetch(url, {
        //   headers: {
        //     "ngrok-skip-browser-warning": "true", // Tambahkan header ini
        //   },
        // });
        const data = await response.json();

        if (data.data) {
          setPengajar(data.data);
          setTotalData(data.total_data);
          setTotalPages(data.total_pages);
        } else {
          setPengajar([]);
          setTotalData(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPengajar([]);
        setTotalData(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
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
    loading,
    searchTerm,
    setSearchTerm,
    totalData,
    totalPages,
    totalFiltered: filteredPengajar.length,
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
  };
}
