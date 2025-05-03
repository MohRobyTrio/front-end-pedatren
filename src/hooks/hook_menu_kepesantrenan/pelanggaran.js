import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';

const useFetchPelanggaran = () => {
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
  

  // Field yang akan dijadikan sebagai searchable
  const SEARCHABLE_FIELDS = ['nama_santri', 'provinsi', 'kabupaten', 'lembaga'];

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
    let url = `${API_BASE_URL}data-pokok/pelanggaran?limit=${limit}&page=${currentPage}`;
    
    // Handle search
    if (debouncedSearchTerm) {
      url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
      url += `&search_fields=${SEARCHABLE_FIELDS.join(',')}`;
    }
    
    // Handle filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'Semua') {
        url += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    // Skip duplicate requests
    if (lastRequest.current === url) {
      console.log('Skip duplicate request');
      return;
    }
    lastRequest.current = url;

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
        tgl_input: new Date(item.tgl_input).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
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
  }, [currentPage, limit, debouncedSearchTerm]);

  // Auto fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when limit or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  // Filter options
  const filterOptions = useMemo(() => {
    const options = {
      provinsi: [],
      kabupaten: [],
      kecamatan: [],
      lembaga: [],
      jenis_pelanggaran: [],
      status_pelanggaran: []
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

export default useFetchPelanggaran;