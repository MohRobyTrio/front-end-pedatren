import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../config"; // Pastikan API_BASE_URL = "http://127.0.0.1:8000/api/"
import { getCookie } from "../../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../../Logout";
import Swal from "sweetalert2";

const useFetchTransaksi = (filters) => {
  const { clearAuthData } = useLogout();
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [loadingTransaksi, setLoadingTransaksi] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0); // Jika API mendukung pagination
  const [totalPages, setTotalPages] = useState(1); // Jika API mendukung pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [jadwalMendatang, setJadwalMendatang] = useState(null);
  const [statusTransaksi, setStatusTransaksi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const lastRequest = useRef("");
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = useCallback(
    async (force = false) => {
      let url = `${API_BASE_URL}transaksi?limit=${limit}`;

      if (debouncedSearchTerm) url += `&q=${encodeURIComponent(debouncedSearchTerm)}`;

      if (currentPage > 1) {
        url += `&page=${currentPage}`;
      }

      // Contoh filter tanggal atau lain, jika API mendukung
      if (filters?.outlet_id) {
        url += `&outlet_id=${encodeURIComponent(filters.outlet_id)}`;
      }
      if (filters?.date_from) {
        url += `&date_from=${encodeURIComponent(filters.date_from)}`;
      }
      if (filters?.date_to) {
        url += `&date_to=${encodeURIComponent(filters.date_to)}`;
      }
      if (filters?.kategori_id) {
        url += `&kategori_id=${encodeURIComponent(filters.kategori_id)}`;
      }
      // if (filters?.jenis_kelamin) {
      //   url += `&jenis_kelamin=${encodeURIComponent(filters.jenis_kelamin)}`;
      // }
      // if (filters?.status) {
      //   url += `&status=${encodeURIComponent(filters.status)}`;
      // }
      // if (filters?.showAll) {
      //   url += `&all=${encodeURIComponent(filters.showAll)}`;
      // }

      if (!force && lastRequest.current === url) {
        console.log("Skip Fetch: URL sama dengan request sebelumnya");
        return;
      }

      lastRequest.current = url;
      console.log("Fetching data dari:", url);

      setLoadingTransaksi(true);
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
        console.log("Data dari API Transaksi:", data);

        // Sesuaikan pengambilan data array
        setDataTransaksi(Array.isArray(data.data) ? data.data : []);

        // Jika API ada total data/pagination, sesuaikan
        setTotalData(data.total_data || 0);
        setTotalPages(data.total_pages || 1);
        setTotalPembayaran(data.total_pembayaran || 0);
        setJadwalMendatang(data.jadwal_mendatang || null);
        setStatusTransaksi(data.status_presensi || "");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setDataTransaksi([]);
      } finally {
        setLoadingTransaksi(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [currentPage, filters, limit, token, debouncedSearchTerm]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log("Total Data:", totalData);
  }, [totalData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  return {
    dataTransaksi,
    loadingTransaksi,
    error,
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchData,
    totalPembayaran,
    jadwalMendatang,
    statusTransaksi,
    searchTerm,
    setSearchTerm
  };
};

export default useFetchTransaksi;
