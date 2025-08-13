import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";
import Swal from "sweetalert2";

const useFetchTahfidz = (filters) => {
  const { clearAuthData } = useLogout();
  const navigate = useNavigate();
  const [dataTahfidz, setDataTahfidz] = useState([]);
  const [detailTahfidz, setDetailTahfidz] = useState(null); // detail santri
  const [loadingTahfidz, setLoadingTahfidz] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const lastRequest = useRef("");
  const token = sessionStorage.getItem("token") || getCookie("token");

  // Fetch list tahfidz
  const fetchData = useCallback(async (force = false) => {
    let url = `${API_BASE_URL}tahfidz?limit=${limit}`;

    if (currentPage > 1) {
      url += `&page=${currentPage}`;
    }
    if (filters?.tahun_ajaran) {
      url += `&tahun_ajaran=${encodeURIComponent(filters.tahun_ajaran)}`;
    }

    if (!force && lastRequest.current === url) {
      console.log("Skip Fetch: URL sama dengan request sebelumnya");
      return;
    }

    lastRequest.current = url;
    console.log("Fetching data dari:", url);

    setLoadingTahfidz(true);
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
      console.log("Data dari API Tahfidz:", data);

      setDataTahfidz(Array.isArray(data) ? data : (data.data || []));
      setTotalData(data.total_data || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setDataTahfidz([]);
    } finally {
      setLoadingTahfidz(false);
    }
  }, [currentPage, filters, limit, token, clearAuthData, navigate]);

  // Fetch detail tahfidz per santri
  const fetchDetailTahfidz = useCallback(async (santriId) => {
    if (!santriId) return;

    const url = `${API_BASE_URL}tahfidz/${santriId}`;
    console.log("Fetching detail dari:", url);

    setLoadingDetail(true);
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
      console.log("Detail Tahfidz:", data);

      setDetailTahfidz(data);
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError(err.message);
      setDetailTahfidz(null);
    } finally {
      setLoadingDetail(false);
    }
  }, [token, clearAuthData, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  return {
    dataTahfidz,
    detailTahfidz,
    loadingTahfidz,
    loadingDetail,
    error,
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
    fetchDetailTahfidz, // expose fungsi detail
  };
};

export default useFetchTahfidz;
