import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownMataPelajaran = () => {
  const [menuMataPelajaran, setMenuMataPelajaran] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuMataPelajaran");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuMataPelajaran(parsedData);
      } catch (error) {
        console.error("Gagal parsing session menuMataPelajaran:", error);
        sessionStorage.removeItem("menuMataPelajaran");
      }
    } else {
      fetchMataPelajaranDoubleFetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMataPelajaranDoubleFetch = async () => {
    try {
      // 1. Fetch pertama untuk mendapatkan total data
      const resTotal = await fetch(`${API_BASE_URL}formulir/mata-pelajaran`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resTotalData = await resTotal.json();
      const total = resTotalData?.total_data || 0;

      // 2. Fetch kedua dengan limit berdasarkan total
      const resAll = await fetch(`${API_BASE_URL}formulir/mata-pelajaran?limit=${total}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resAllData = await resAll.json();

      if (!Array.isArray(resAllData.data)) {
        throw new Error("Data dari API tidak valid");
      }

      const filtered = resAllData.data.filter(item => item.status == "Aktif");

      const formatted = [
        { label: "Pilih Mata Pelajaran", value: "", id: null },
        ...filtered.map(item => ({
          label: item.nama_mapel,
          value: item.id,
          id: item.id,
          kode_mapel: item.kode_mapel,
          nama_pengajar: item.nama_pengajar,
          nik_pengajar: item.nik_pengajar,
          pengajar_id: item.pengajar_id,
          status: item.status,
        }))
      ];

      sessionStorage.setItem("menuMataPelajaran", JSON.stringify(formatted));
      setMenuMataPelajaran(formatted);
    } catch (error) {
      console.error("Gagal fetch data mata pelajaran:", error);
      setMenuMataPelajaran([{ label: "Pilih Mata Pelajaran", value: "", id: null }]);
    }
  };

  const forceFetchDropdownMataPelajaran = async () => {
    try {
      await fetchMataPelajaranDoubleFetch();
      console.log("Berhasil force update menuMataPelajaran");
    } catch (err) {
      console.error("Gagal force fetch menuMataPelajaran:", err);
      throw err;
    }
  };

  return { menuMataPelajaran, forceFetchDropdownMataPelajaran };
};

export default useDropdownMataPelajaran;
