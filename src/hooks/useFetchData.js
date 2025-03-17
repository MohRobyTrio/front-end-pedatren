import { useState, useEffect, useMemo } from "react";

const useFetchData = (endpoint, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Gunakan useMemo untuk menjaga stabilitas dependency
  const paramsString = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = new URL(`${API_BASE_URL}/${endpoint}`);
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Gagal fetch data: ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        setData(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, paramsString, API_BASE_URL, params]); // Gunakan paramsString agar stabil

  return { data, loading, error };
};

export default useFetchData;
