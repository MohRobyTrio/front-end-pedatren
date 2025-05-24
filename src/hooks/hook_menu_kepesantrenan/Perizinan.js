import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';

const useFetchPerizinan = (filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const lastRequest = useRef('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce searchTerm selama 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
        clearTimeout(handler);
    };
}, [searchTerm]);

  const fetchData = useCallback(async (filters = {}) => {
    let url = `${API_BASE_URL}data-pokok/perizinan?limit=${limit}&page=${currentPage}`;
    
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
    if (filters?.bermalam) url += `&bermalam=${encodeURIComponent(filters.bermalam)}`;
    if (filters?.jenis_izin) url += `&jenis_izin=${encodeURIComponent(filters.jenis_izin)}`;
    if (filters?.status) url += `&status=${encodeURIComponent(filters.status)}`;
    
    // Handle filters
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (value && value !== 'Semua') {
    //     url += `&${key}=${encodeURIComponent(value)}`;
    //   }
    // });

    // Skip duplicate requests
    if (lastRequest.current === url) {
      console.log('Skip duplicate request');
      return;
    }
    lastRequest.current = url;
    console.log('Fetching data from:', url);

    try {
      setLoading(true);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      // Transform data
      const transformed = result.data.map(item => ({
        ...item,
        tanggal_mulai: new Date(item.tanggal_mulai).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        tanggal_selesai: new Date(item.tanggal_selesai).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        durasi: calculateDuration(item.tanggal_mulai, item.tanggal_selesai),
        foto_profil: item.foto_profil || null
      }));

      setData(transformed);
      setTotalData(result.total_data || 0);
      setTotalPages(result.total_pages || 1);
      setCurrentPage(result.current_page || 1);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, limit, debouncedSearchTerm]);

  // Helper function untuk menghitung durasi
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} Hari ${hours} Jam`;
    }
    return `${hours} Jam`;
  };

  // Auto fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when limit or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  // Filter options (tidak digunakan)
  const filterOptions = useMemo(() => {
    const options = {
      alasan_izin: [],
      status: [],
      jenis_izin: []
    };

    data.forEach(item => {
      Object.keys(options).forEach(key => {
        if (item[key] && !options[key].includes(item[key])) {
          options[key].push(item[key]);
        }
      });
    });

    return options;
  }, [data]);

  return {
    // Data states
    data,
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
    
    // Filter options
    filterOptions,
    
    // Fetch function
    fetchData
  };
};

export default useFetchPerizinan;