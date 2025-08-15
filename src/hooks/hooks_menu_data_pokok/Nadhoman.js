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
        url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
      if (filters?.negara && filters.negara !== "Semua Negara")
        url += `&negara=${encodeURIComponent(filters.negara)}`;
      if (filters?.provinsi && filters.provinsi !== "Semua Provinsi")
        url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
      if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten")
        url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
      if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan")
        url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
      if (filters?.jenisKelamin)
        url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
      if (filters?.wilayah && filters.wilayah !== "Semua Wilayah")
        url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
      if (filters?.blok && filters.blok !== "Semua Blok")
        url += `&blok=${encodeURIComponent(filters.blok)}`;
      if (filters?.kamar && filters.kamar !== "Semua Kamar")
        url += `&kamar=${encodeURIComponent(filters.kamar)}`;
      if (filters?.lembaga && filters.lembaga !== "Semua Lembaga")
        url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
      if (filters?.jurusan && filters.jurusan !== "Semua Jurusan")
        url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
      if (filters?.kelas && filters.kelas !== "Semua Kelas")
        url += `&kelas=${encodeURIComponent(filters.kelas)}`;
      if (filters?.rombel && filters.rombel !== "Semua Rombel")
        url += `&rombel=${encodeURIComponent(filters.rombel)}`;
      if (filters?.urutBerdasarkan) url += `&sort_by=${encodeURIComponent(filters.urutBerdasarkan)}`;
        if (filters?.urutSecara) url += `&sort_order=${encodeURIComponent(filters.urutSecara)}`;

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
        if (!response.ok)
          throw new Error(`${response.status} - ${response.statusText}`);

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
        if (!response.ok)
          throw new Error(`${response.status} - ${response.statusText}`);

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
