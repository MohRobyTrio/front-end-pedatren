import { useEffect, useState } from "react";

export default function useFetchAnakPegawai() {
  const [anakpegawai, setAnakPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian

  useEffect(() => {
    fetch("") //Isi dengan URL API dari backend
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setAnakPegawai(data.data);
        } else {
          setAnakPegawai([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  // 🔍 Filter data berdasarkan pencarian
  const filteredanakpegawai = anakpegawai
    ? anakpegawai.filter((item) =>
        (item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item?.niup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item?.lembaga?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  return { 
    anakpegawai: filteredanakpegawai, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    totalData: anakpegawai.length, // Total sebelum filter
    totalFiltered: filteredanakpegawai.length // Total setelah filter
  };
}
