import { useEffect, useState } from "react";

export default function useFetchPengajar() {
  const [pengajar, setPengajar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian

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

  // 🔍 Filter data berdasarkan pencarian
  const filteredPengajar = pengajar
    ? pengajar.filter((item) =>
        (item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item?.nama_pendidikan_terakhir?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  return { 
    pengajar: filteredPengajar, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    totalData: pengajar.length, // Total sebelum filter
    totalFiltered: filteredPengajar.length // Total setelah filter
  };
}
