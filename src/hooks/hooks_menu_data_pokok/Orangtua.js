import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";

const useFetchOrangtua = (filters) => {
  const [orangtua, setOrangtua] = useState([]);
  const [loadingOrangtua, setLoadingOrangtua] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalDataOrangtua, setTotalDataOrangtua] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const lastRequest = useRef("");

  const fetchData = useCallback(async () => {
    let url = `${API_BASE_URL}data-pokok/orangtua?limit=${limit}&page=${currentPage}`;

    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

    if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;
    if (filters?.kotaAsal) url += `&kota_asal=${encodeURIComponent(filters.kotaAsal)}`;
    if (filters?.urutBerdasarkan) url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`;
    if (filters?.urutSecara) url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`;
    // Kalau mau tambah filter lain tinggal tambahin disini...

    if (lastRequest.current === url) {
      console.log("Skip Fetch: URL sama dengan request sebelumnya");
      return;
    }

    lastRequest.current = url;
    console.log("Fetching data from:", url);

    setLoadingOrangtua(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.statusText}: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data dari API Orangtua:", data);

      setOrangtua(Array.isArray(data.data) ? data.data : []);
      setTotalDataOrangtua(data.total_data || 0);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setOrangtua([]);
    } finally {
      setLoadingOrangtua(false);
    }
  }, [currentPage, filters, limit, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  return {
    orangtua,
    loadingOrangtua,
    searchTerm,
    setSearchTerm,
    error,
    limit,
    setLimit,
    totalDataOrangtua,
    totalPages,
    currentPage,
    setCurrentPage,
  };
};

export default useFetchOrangtua;
