import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';

const useFetchAfektif = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const lastRequest = useRef('');

  const fetchData = useCallback(async (filters = {}) => {
    let url = `${API_BASE_URL}dropdown/catatan-afektif?limit=${limit}&page=${currentPage}`;
    
    // Handle search
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
    
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
        waktu_pencatatan: new Date(item.waktu_pencatatan).toLocaleString('id-ID'),
        foto: item.foto || null,
        fotoPencatat: item.fotoPencatat || null
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
  }, [currentPage, limit, searchTerm]);

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