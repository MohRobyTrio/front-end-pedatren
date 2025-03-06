import { useEffect, useState } from "react";

export default function useFetchPengajar() {
  const [pengajar, setPengajar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/list-pengajar")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPengajar(data.data);
        } else {
          setPengajar([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return { pengajar, loading };
}
