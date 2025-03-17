import { useEffect, useState } from "react";

export default function useFetchWali() {
  const [wali, setWali] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setWali(data.data);
        } else {
          setWali([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return { wali, loading };
}
