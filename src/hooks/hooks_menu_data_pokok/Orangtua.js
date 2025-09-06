import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchOrangtua = (filters) => {
  const { clearAuthData } = useLogout();
    const navigate = useNavigate();
  const [orangtua, setOrangtua] = useState([]);
  const [loadingOrangtua, setLoadingOrangtua] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalDataOrangtua, setTotalDataOrangtua] = useState(0);
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
    let url = `${API_BASE_URL}data-pokok/orangtua?limit=${limit}`;
    if (currentPage > 1) {
      url += `&page=${currentPage}`;
  }
    if (debouncedSearchTerm)
      url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;

    if (filters?.negara && filters.negara !== "Semua Negara")
      url += `&negara=${encodeURIComponent(filters.negara)}`;
    if (filters?.provinsi && filters.provinsi !== "Semua Provinsi")
      url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
    if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten")
      url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
    if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan")
      url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
    if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
    if (filters?.jenisKelaminPesertaDidik) url += `&jenis_kelamin_anak=${encodeURIComponent(filters.jenisKelaminPesertaDidik)}`;
    if (filters?.wafatHidup) url += `&wafat=${encodeURIComponent(filters.wafatHidup)}`;
    if (filters?.smartcard) url += `&smartcard=${encodeURIComponent(filters.smartcard)}`;
    if (filters?.phoneNumber) url += `&phone_number=${encodeURIComponent(filters.phoneNumber)}`;

    if (!force && lastRequest.current === url) {
      console.log("Skip Fetch: URL sama dengan request sebelumnya");
      return;
    }

    lastRequest.current = url;
    console.log("Fetching data from:", url);

    setLoadingOrangtua(true);
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
        throw new Error(`${response.statusText}: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data dari API Orangtua:", data);

      setOrangtua(Array.isArray(data.data) ? data.data : []);
      setTotalDataOrangtua(data.total_data || 0);
      setTotalPages(data.total_pages || 1);
      // setCurrentPage(data.current_page || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setOrangtua([]);
    } finally {
      setLoadingOrangtua(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, limit, debouncedSearchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Untuk setting ke halaman 1 saat limit berubah
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
    fetchData
  };
};

export default useFetchOrangtua;
