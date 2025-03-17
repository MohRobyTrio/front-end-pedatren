import { useEffect, useState } from "react";

export default function useFetchPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian

  useEffect(() => {
    fetch("") //Ini berisi url API
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPegawai(data.data);
        } else {
          setPegawai([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 Filter data berdasarkan pencarian
  const filteredPegawai = pegawai
    ? pegawai.filter((item) =>
        (item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item?.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  return { 
    pegawai: filteredPegawai, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    totalData: pegawai.length, // Total sebelum filter
    totalFiltered: filteredPegawai.length // Total setelah filter
  };
}
