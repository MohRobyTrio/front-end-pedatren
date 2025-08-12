import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";  // Pastikan API_BASE_URL = "http://127.0.0.1:8000/api/"
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchPresensi = (filters) => {
  const { clearAuthData } = useLogout();
  const navigate = useNavigate();
  const [dataPresensi, setDataPresensi] = useState([]);
  const [loadingPresensi, setLoadingPresensi] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0); // Jika API mendukung pagination
  const [totalPages, setTotalPages] = useState(1); // Jika API mendukung pagination
  const [currentPage, setCurrentPage] = useState(1);
  const lastRequest = useRef("");
  const token = sessionStorage.getItem("token") || getCookie("token");

  const fetchData = useCallback(async (force = false) => {
    let url = `${API_BASE_URL}presensi?limit=${limit}`;

    if (currentPage > 1) {
      url += `&page=${currentPage}`;
    }

    // Contoh filter tanggal atau lain, jika API mendukung
    if (filters?.tanggal) {
      url += `&tanggal=${encodeURIComponent(filters.tanggal)}`;
    }

    if (!force && lastRequest.current === url) {
      console.log("Skip Fetch: URL sama dengan request sebelumnya");
      return;
    }

    lastRequest.current = url;
    console.log("Fetching data dari:", url);

    setLoadingPresensi(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 && !window.sessionExpiredShown) {
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
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data dari API Presensi:", data);

      // Sesuaikan pengambilan data array
      setDataPresensi(Array.isArray(data.data) ? data.data : []);
      
      // Jika API ada total data/pagination, sesuaikan
      setTotalData(data.total_data || 0);
      setTotalPages(data.total_pages || 1);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setDataPresensi([]);
    } finally {
      setLoadingPresensi(false);
    }
  }, [currentPage, filters, limit, token, clearAuthData, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  return {
    dataPresensi,
    loadingPresensi,
    error,
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
  };
};

export default useFetchPresensi;
