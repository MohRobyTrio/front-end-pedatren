import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchNadhoman = (filters) => {
  const { clearAuthData } = useLogout();
  const navigate = useNavigate();

  const [dataNadhoman, setDataNadhoman] = useState([]);
  const [loadingNadhoman, setLoadingNadhoman] = useState(true);
  const [error, setError] = useState(null);

  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [detailNadhoman, setDetailNadhoman] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const lastRequest = useRef("");
  const token = sessionStorage.getItem("token") || getCookie("token");

  // Debounce searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleUnauthorized = async () => {
    if (!window.sessionExpiredShown) {
      window.sessionExpiredShown = true;
      await Swal.fire({
        title: "Sesi Berakhir",
        text: "Sesi anda telah berakhir, silakan login kembali.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      clearAuthData();
      navigate("/login");
    }
  };

  const fetchData = useCallback(
    async (force = false) => {
      let url = `${API_BASE_URL}nadhoman?limit=${limit}`;

      if (currentPage > 1) url += `&page=${currentPage}`;
      if (debouncedSearchTerm)
        url += `&nama_santri=${encodeURIComponent(debouncedSearchTerm)}`;

      if (filters?.nama_kitab)
        url += `&nama_kitab=${encodeURIComponent(filters.nama_kitab)}`;

      if (!force && lastRequest.current === url) {
        console.log("Skip Fetch: URL sama dengan request sebelumnya");
        return;
      }

      lastRequest.current = url;
      setLoadingNadhoman(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) return handleUnauthorized();
        if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);

        const data = await response.json();
        setDataNadhoman(Array.isArray(data.data) ? data.data : []);
        setTotalData(data.total_data || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message);
        setDataNadhoman([]);
      } finally {
        setLoadingNadhoman(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, filters, limit, debouncedSearchTerm, token]
  );

  // ✅ Fungsi baru untuk fetch detail santri
  const fetchNadhomanDetail = useCallback(
    async (santriId) => {
      if (!santriId) return;
      setLoadingDetail(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}nadhoman/${santriId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) return handleUnauthorized();
        if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);

        const data = await response.json();
        setDetailNadhoman(data);
      } catch (err) {
        setError(err.message);
        setDetailNadhoman(null);
      } finally {
        setLoadingDetail(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  return {
    // list
    dataNadhoman,
    loadingNadhoman,
    error,
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    fetchData,

    // detail
    detailNadhoman,
    loadingDetail,
    fetchNadhomanDetail,
  };
};

export default useFetchNadhoman;
