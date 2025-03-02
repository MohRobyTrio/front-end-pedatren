import { useEffect, useState } from "react";

export default function useFetchKaryawan() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setKaryawan(data.data);
        } else {
          setKaryawan([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return { karyawan, loading };
}
