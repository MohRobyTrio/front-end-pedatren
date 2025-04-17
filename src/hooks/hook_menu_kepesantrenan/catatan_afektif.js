import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../config';

const useFetchAfektif = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastRequest = useRef(null);

  const fetchData = useCallback(async (filters = {}, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    });

    const url = `${API_BASE_URL}dropdown/catatan-afektif?${queryParams}`;
    
    // Skip duplicate requests
    if (lastRequest.current === url) return;
    lastRequest.current = url;

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      
      // Transformasi data untuk komponen
      const transformed = result.data.map(item => ({
        ...item,
        waktu_pencatatan: new Date(item.waktu_pencatatan).toLocaleString('id-ID'),
        foto: item.foto || null, // Siapkan untuk foto santri
        fotoPencatat: item.fotoPencatat || null // Siapkan untuk foto pencatat
      }));

      setData(transformed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { data, groupedData, loading, error, fetchData };
};

export default useFetchAfektif;