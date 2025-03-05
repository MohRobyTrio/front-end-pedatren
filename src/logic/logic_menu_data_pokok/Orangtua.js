import { useEffect, useState } from "react";

export default function useFetchOrangTua() {
  const [orangtua, setOrangTua] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setOrangTua(data.data);
        } else {
          setOrangTua([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return { orangtua, loading };
}
