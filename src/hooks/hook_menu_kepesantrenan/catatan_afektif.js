import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { getCookie } from '../../utils/cookieUtils';

const useFetchAfektif = (filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const lastRequest = useRef('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const token = sessionStorage.getItem("token") || getCookie("token");

  // Debounce searchTerm selama 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchData = useCallback(async (force = false) => {
    let url = `${API_BASE_URL}data-pokok/catatan-afektif?limit=${limit}&page=${currentPage}`;

    // Handle search
    if (debouncedSearchTerm) {
      url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
    }

    // Handle filters
    if (filters?.negara && filters.negara !== "Semua Negara") url += `&negara=${encodeURIComponent(filters.negara)}`;
    if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") url += `&provinsi=${encodeURIComponent(filters.provinsi)}`;
    if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") url += `&kabupaten=${encodeURIComponent(filters.kabupaten)}`;
    if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") url += `&kecamatan=${encodeURIComponent(filters.kecamatan)}`;
    if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") url += `&wilayah=${encodeURIComponent(filters.wilayah)}`;
    if (filters?.blok && filters.blok !== "Semua Blok") url += `&blok=${encodeURIComponent(filters.blok)}`;
    if (filters?.kamar && filters.kamar !== "Semua Kamar") url += `&kamar=${encodeURIComponent(filters.kamar)}`;
    if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") url += `&lembaga=${encodeURIComponent(filters.lembaga)}`;
    if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") url += `&jurusan=${encodeURIComponent(filters.jurusan)}`;
    if (filters?.kelas && filters.kelas !== "Semua Kelas") url += `&kelas=${encodeURIComponent(filters.kelas)}`;
    if (filters?.rombel && filters.rombel !== "Semua Rombel") url += `&rombel=${encodeURIComponent(filters.rombel)}`;
    if (filters?.jenisKelamin) url += `&jenis_kelamin=${encodeURIComponent(filters.jenisKelamin)}`;
    if (filters?.kategori && filters.kategori !== "") {url += `&kategori=${encodeURIComponent(filters.kategori)}`;}
    if (filters?.nilai && filters.nilai !== "") {url += `&score=${encodeURIComponent(filters.nilai)}`;}
    if (filters?.periode && filters.periode !== "") {url += `&periode=${encodeURIComponent(filters.periode)}`;}

    // Skip duplicate requests
    if (!force && lastRequest.current === url) {
      console.log('Skip duplicate request');
      return;
    }
    lastRequest.current = url;
    console.log('Fetching data from:', url);

    try {
      setLoading(true);
      const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      

      // Transform data
      const transformed = result.data.map(item => ({
        ...item,
        waktu_pencatatan: new Date(item.waktu_pencatatan).toLocaleString('id-ID'),
        foto: item.foto || null,
        fotoPencatat: item.fotoPencatat || null
      }));

      setData(transformed);
      console.log(transformed);
      
      setTotalData(result.total_data || 0);
      setTotalPages(result.total_pages || 1);
      setCurrentPage(result.current_page || 1);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, limit, debouncedSearchTerm]);

  // Auto fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when limit or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  // Group data by santri_id
  const groupedData = useMemo(() => {
    return data.reduce((acc, curr) => {
      if (!acc[curr.id_santri]) {
        acc[curr.id_santri] = {
          ...curr,  
          catatan: []
        };
      }
      acc[curr.id_santri].catatan.push(curr);
      return acc;
    }, {});
  }, [data]);

  return {
    // Data states
    data,
    groupedData,
    loading,
    error,

    // Pagination controls
    limit,
    setLimit,
    totalData,
    totalPages,
    currentPage,
    setCurrentPage,

    // Search
    searchTerm,
    setSearchTerm,

    // Fetch function
    fetchData
  };
};

export default useFetchAfektif;